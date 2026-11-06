#!/usr/bin/env python3
"""Cổng QA máy cho một khung của run. In PASS/FAIL, ghi <run>/work/qa-<o>.json và ảnh tổng hợp để NHÌN.

Dùng:
  python3 qa.py <run> doc|ngang --no-video      # sau build.py, TRƯỚC render: soát project bằng Chrome không giao diện
  python3 qa.py <run> doc|ngang <file.mp4>      # sau render: soát thêm MP4 (thông số, độ to, chuyển động)

Kiểm:
  probe  — lỗi JS khi vẽ; chữ ra ngoài vùng nội dung / sprite ra ngoài vùng an toàn; chữ chồng chữ; chữ phủ sprite;
           tua xuôi/ngược ra cùng một hình; lỗi console (font, GSAP không tải được…);
           độ đầy khung — mỗi 0,1 giây cộng diện tích hộp sprite trên vùng nội dung: vật nhỏ / khung chỉ có chữ.
  mp4    — kích thước, 30 fps, thời lượng khớp direction, có audio AAC 48 kHz; −14 ±1 LUFS, đỉnh ≤ −1 dBFS;
           không đoạn đứng yên > 3 giây (≥ 2 giây là cảnh báo).
  mix    — đọc work/mix-<o>.json (do mix.py ghi): SFX phải thấp hơn giọng ≥ 12 dB.
  ảnh    — mỗi 2 giây + mọi mốc hiệu ứng mạnh (P punch, S shake, T tem, C giữa chuyển cảnh). Ảnh tổng hợp ở
           work/qa-<o>/; PHẢI mở xem từng ảnh — máy không thấy chữ xấu, hình vô nghĩa hay nhịp lệch.
Thoát 1 nếu FAIL.
"""
from __future__ import annotations

import argparse
import importlib.util
import json
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE / "qa"))
import media  # noqa: E402

_spec = importlib.util.spec_from_file_location("pe_build", HERE.parent / "engine/build.py")
_build = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_build)
FRAMES = _build.FRAMES
GRID = {"doc": (180, 320), "ngang": (320, 180)}
SUBTOP = {"doc": 215, "ngang": 155}          # hàng lưới bắt đầu dải phụ đề (bỏ khi đo chuyển động)
SHEET = {"doc": (4, 270, 16), "ngang": (3, 480, 15)}  # cột, bề rộng ảnh nhỏ, số khung mỗi ảnh tổng hợp
# Độ đầy khung: tổng diện tích hộp sprite (sau camera) / diện tích vùng nội dung. Dưới ngưỡng = "vật nhỏ, khung trống".
# Khung ngang rộng gấp ~1,6 lần nên ngưỡng thấp hơn. Đây là sàn tối thiểu, không phải chỉ tiêu.
FILL_MIN = {"doc": 0.15, "ngang": 0.10}
FILL_MEDIAN = {"doc": 0.25, "ngang": 0.17}
# Mực thật: tổng điểm ảnh đục của sprite / vùng nội dung. Hộp sprite gồm cả phần trong suốt và lớp chưa hiện nên
# một vòng tròn rỗng hay một tầng tháp lẻ vẫn "phủ" lớn; mực thật mới cho thấy khung có thưa hay không.
PX_MIN = {"doc": 0.10, "ngang": 0.08}
HOOK_WIN = (0.4, 2.0)
PX_BARE = 0.03
# Nhãn phải đứng cạnh vật nó gọi tên: khoảng cách (ô lưới) từ nhãn tới mực sprite gần nhất.
LABEL_GAP = {"doc": 24, "ngang": 40}
LABEL_FAR_MAX = {"doc": 0.20, "ngang": 0.45}


def overshoot(box: list[float], region: list[float]) -> float:
    x0, y0, x1, y1 = box
    return max(region[0] - x0, region[1] - y0, x1 - region[2], y1 - region[3], 0)


def fx_marks(direction: dict) -> dict[float, str]:
    """Mốc hiệu ứng mạnh cần nhìn tận mắt (lệch 0,15 giây để thấy lúc hiệu ứng đang ăn)."""
    m: dict[float, str] = {}
    for sc in direction["scenes"]:
        tin = sc.get("tin") or {}
        if tin.get("kind", "cut") != "cut":
            m[round(sc["from"] + tin.get("dur", 0.4) / 2, 2)] = "C"
        for key, tag in (("punch", "P"), ("shake", "S")):
            for e in sc.get(key, []):
                m[round(e[0] + 0.15, 2)] = tag
        for it in sc["items"]:
            if it.get("kind") == "label" and it.get("plate") == "stamp":
                m[round(it["at"] + 0.4, 2)] = "T"
    return m


def sheet_times(dur: float, marks: dict[float, str]) -> list[float]:
    base = [round(1.0 + 2 * k, 2) for k in range(int((dur - 1.5) / 2) + 1)]
    times = sorted(set(marks) | {t for t in base if all(abs(t - mt) > 0.3 for mt in marks)})
    return [t for t in times if t < dur - 0.05]


def run_probe(project: Path, outdir: Path, times: list[float]) -> dict:
    cmd = ["node", str(HERE / "qa/probe.cjs"), str(project / "index.html"), str(outdir), "--at", ",".join(f"{t:.2f}" for t in times)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        raise SystemExit(f"probe lỗi:\n{r.stderr[-2000:]}")
    return json.loads((outdir / "probe.json").read_text())


def jolts(direction: dict) -> list[tuple[float, float]]:
    """Khoảng punch/shake: camera giật làm vật lệch tạm vài px — không tính là lỗi bố cục nếu chỉ lệch trong lúc đó."""
    win = []
    for sc in direction["scenes"]:
        for e in sc.get("punch", []):
            win.append((e[0] - 0.05, e[0] + (e[2] if len(e) > 2 else 0.3) + 0.15))
        for e in sc.get("shake", []):
            win.append((e[0] - 0.05, e[0] + (e[2] if len(e) > 2 else 0.3) + 0.15))
        for it in sc["items"]:          # engine tự thêm punch/shake cho tem (at + 0,25) và gạch chữ (lúc gạch xong)
            if it.get("kind") == "label" and it.get("plate") == "stamp":
                win.append((it["at"] + 0.2, it["at"] + 0.9))
            if it.get("kind") == "label" and isinstance(it.get("strike"), dict):
                te = it["strike"]["at"] + it["strike"].get("dur", 0.25)
                win.append((te - 0.05, te + 0.4))
    return win


def judge_overlap(overlap: list, fails: list, warns: list) -> None:
    # Chồng lấn đo theo điểm ảnh đục (engine): vật bị che ≥ 25% kéo dài ≥ 5 mẫu (0,5 giây) là lỗi, ≥ 10% trong ≥ 3 mẫu
    # là cảnh báo. Nhân vật (role actor) chặt hơn: bị che đầu (40% hàng trên) ≥ 20% trong ≥ 5 mẫu, hoặc bị nhân vật khác
    # che ≥ 10% trong ≥ 5 mẫu là lỗi. Nhẹ hơn (tối đa cảnh báo): dấu đánh (dau-*, o-khoa) đặt lên vật không phải nhân vật,
    # chồng hai bản của cùng một sprite (xấp giấy), nhân vật đứng trên mô hình (vd. Kudo ở tâm quỹ đạo), nhãn đặt trên mô
    # hình mà che < 50% (nhãn ghi vào tầng tháp, miệng phễu).
    # Chồng có chủ ý (chữ trên màn hình laptop, vật cầm trên tay) thì khai over:true ở nhãn/sprite nằm trên.
    mark = lambda name: name.startswith("dau-") or name == "o-khoa"
    for g in overlap:
        nf, nw = len(fails), len(warns)
        span = f"{g['t0']}–{g['t1']} giây, {g['n']} mẫu, nặng nhất {g.get('worstAt', g['t0'])} giây"
        n25, n10, nh20 = g.get("n25", 0), g.get("n10", 0), g.get("nh20", 0)
        ra, rb = g.get("ra"), g.get("rb")
        if g["type"] == "text-text":
            (fails if g["frac"] >= 0.10 and g["n"] >= 3 else warns).append(
                f"chữ chồng chữ: '{g['a']}' × '{g['b']}' ({span}, phủ {round(g['frac'] * 100)}%)")
        elif g["type"] == "text-near":
            (fails if g["gap"] < 1 and g["n"] >= 3 else warns).append(
                f"chữ sát chữ: '{g['a']}' × '{g['b']}' khe {g['gap']} block ({span}) — cách ít nhất 2 block")
        elif g["type"] in ("text-sprite", "sprite-sprite"):
            what = "chữ che vật" if g["type"] == "text-sprite" else "vật che vật"
            msg = f"{what}: '{g['a']}' che {round(g['frac'] * 100)}% điểm ảnh của '{g['b']}' ({span})"
            if rb == "actor" and nh20 >= 5:
                fails.append(msg + f", che {round(g.get('head', 0) * 100)}% phần đầu nhân vật — dời ra")
            elif rb == "actor" and ra == "actor" and n10 >= 5:
                fails.append(msg + " — người đè người, tách ra")
            elif rb != "actor" and g["type"] == "sprite-sprite" and (mark(g["a"]) or g["a"] == g["b"]):
                if n10 >= 3:
                    warns.append(msg + " — dấu đánh/chồng cùng vật, xem ảnh: vật dưới còn nhận ra không")
            elif rb == "model" and ra == "actor":
                if n10 >= 3:
                    warns.append(msg + " — xem ảnh: nhân vật nằm đúng ô trống của mô hình không")
            elif rb == "model" and ra == "text" and g["frac"] < 0.5:
                if n10 >= 3:
                    warns.append(msg + " — xem ảnh: nhãn nằm trong ô của mô hình, không che chi tiết chính")
            elif n25 >= 5:
                fails.append(msg + " — dời ra, hoặc khai over:true nếu cố ý")
            elif n10 >= 3 or (rb == "actor" and g.get("head", 0) >= 0.25):
                warns.append(msg + (f", che {round(g.get('head', 0) * 100)}% phần đầu" if rb == "actor" else "") + " — xem ảnh")
        g["verdict"] = "LOI" if len(fails) > nf else "canh bao" if len(warns) > nw else None


def judge_probe(pr: dict, o: str, direction: dict, fails: list, warns: list) -> dict:
    fr = FRAMES[o]
    jw = jolts(direction)
    for t, err in pr["render"]["bad"]:
        fails.append(f"lỗi JS khi vẽ giây {t}: {err[:160]}")
    for e in pr["errors"]:
        fails.append(f"console: {e[:200]}")
    if pr.get("missing"):
        fails.append("engine thiếu __layoutCheck — build bằng engine/engine.js của skill")
    layout = []
    for g in (pr.get("layout") or {}).values():
        region = fr["content"] if g["kind"] in ("label", "headline") else fr["safe"]
        worst = max(overshoot(b[1:], region) for b in g["boxes"])
        steady = [b for b in g["boxes"] if not any(t0 <= b[0] <= t1 for t0, t1 in jw)]
        worst_steady = max([overshoot(b[1:], region) for b in steady], default=0)
        row = {**{k: g[k] for k in ("scene", "kind", "name", "t0", "t1", "n")}, "over_px": round(worst), "over_px_steady": round(worst_steady)}
        layout.append(row)
        text = region is fr["content"]
        msg = (f"{g['kind']} '{g['name']}' lệch {round(worst)} px khỏi {'vùng nội dung' if text else 'vùng an toàn'} "
               f"({g['t0']}–{g['t1']} giây, {g['n']} mẫu{', chỉ trong lúc punch/shake' if not steady else ''})")
        # Lệch khi camera giật (punch/shake) là tạm thời: chỉ lỗi nếu quá 24 px. Lệch lúc đứng yên: chữ > 4 px kéo dài
        # ≥ 0,3 giây hoặc > 12 px là lỗi; sprite > 4 px kéo dài ≥ 0,5 giây hoặc > 12 px là lỗi.
        bad = worst > 24 or worst_steady > 12 or (worst_steady > 4 and len(steady) >= (3 if text else 5))
        (fails if bad else warns).append(msg)
    overlap = list((pr.get("overlap") or {}).values())
    judge_overlap(overlap, fails, warns)
    if pr["seek"]["mismatch"]:
        fails.append(f"tua ra hình khác nhau tại {pr['seek']['mismatch'][:8]} — hiệu ứng phụ thuộc trạng thái/ngẫu nhiên không hạt")
    return {"render": pr["render"], "layout": layout, "overlap": overlap, "seek": pr["seek"], "errors": pr["errors"]}


def judge_fill(pr: dict, o: str, fails: list, warns: list) -> dict:
    """Vật nhỏ, khung thưa, khung chỉ có chữ, nhãn xa vật. Bỏ mẫu đang chuyển cảnh; vật đang nảy vào, đang move không
    tính (engine bỏ qua). Engine mới gửi thêm hộp mực và số điểm ảnh đục của từng sprite (box dài 12)."""
    C = FRAMES[o]["content"]
    area = (C[2] - C[0]) * (C[3] - C[1])
    B = FRAMES[o]["W"] / GRID[o][0]
    clip = lambda q: [max(q[0], C[0]), max(q[1], C[1]), min(q[2], C[2]), min(q[3], C[3])]
    ar = lambda q: max(0, q[2] - q[0]) * max(0, q[3] - q[1])

    def gap(a, q):
        return max(max(0, q[0] - a[2], a[0] - q[2]), max(0, q[1] - a[3], a[1] - q[3])) / B

    rows, gaps, ink = [], [], False
    for t, k, trans, boxes in pr.get("fill") or []:
        if trans:
            continue
        spr = [b for b in boxes if b[0] == 0]
        if any(len(b) > 11 for b in spr):
            ink = True
            boxes_ = [b[7:11] for b in spr if b[9] > b[7]]
            px = sum(b[11] for b in spr) / area
        else:
            boxes_, px = [b[3:7] for b in spr], None
        cov = sum(ar(clip(q)) for q in boxes_) / area
        labs = [b for b in boxes if b[0] == 1 and b[1] == "label"]
        if ink and boxes_:
            gaps += [(t, b[2], min(gap(b[3:7], q) for q in boxes_)) for b in labs]
        rows.append((t, k, len(boxes_), sum(1 for b in boxes if b[0] == 1), cov, px))
    if not rows:
        warns.append("không đo được độ đầy khung (engine cũ thiếu __fillCheck?)")
        return {}
    if not ink:
        warns.append("engine cũ chưa đo mực thật — build lại bằng engine/engine.js của skill để có cổng khung thưa, nhãn xa vật")

    def spans(pred):
        out, cur = [], None
        for t, *r in rows:
            if pred(r):
                if cur and t - cur[1] <= 0.15:
                    cur[1] = t
                else:
                    cur and out.append(cur)
                    cur = [t, t]
        cur and out.append(cur)
        return [(a, round(b + 0.1, 1)) for a, b in out]

    small = spans(lambda r: r[1] > 0 and r[3] < FILL_MIN[o])
    bare = spans(lambda r: r[1] == 0 or (r[4] is not None and r[4] < PX_BARE))
    frac = sum(1 for r in rows if r[2] > 0 and r[4] < FILL_MIN[o]) / len(rows)
    med = sorted(r[4] for r in rows)[len(rows) // 2]
    for a, b in small:
        if b - a >= 2.0:
            fails.append(f"vật nhỏ, khung trống {a}–{b} giây ({b - a:.1f} s): mực sprite phủ < {round(FILL_MIN[o] * 100)}% vùng nội dung "
                         f"— tăng scale, dùng sprite lớn hơn hoặc thêm vật mang nghĩa (CRAFT.md §7)")
        elif b - a >= 1.0:
            warns.append(f"vật nhỏ {a}–{b} giây ({b - a:.1f} s): mực sprite phủ < {round(FILL_MIN[o] * 100)}% vùng nội dung")
    for a, b in bare:
        if a >= 0.5 or b - a >= 1.5:
            (fails if b - a >= 1.5 else warns if b - a >= 0.8 else []).append(
                f"khung gần như chỉ có chữ {a}–{b} giây ({b - a:.1f} s; không sprite hoặc điểm ảnh sprite < {round(PX_BARE * 100)}%) "
                f"— vật được gọi tên phải có hình đủ lớn")
    out = {"samples": len(rows), "median": round(med, 3), "small_frac": round(frac, 3), "small": small, "bare": bare}
    if ink:
        # Khung thưa: mực thật dưới ngưỡng. Bỏ 0,5 giây đầu (vật đầu tiên đang hiện).
        sparse = [(a, b) for a, b in spans(lambda r: r[4] is not None and r[4] < PX_MIN[o]) if b > 0.5]
        for a, b in sparse:
            a = max(a, 0.5)
            if b - a >= 2.0:
                fails.append(f"khung thưa {a}–{b} giây ({b - a:.1f} s): điểm ảnh sprite < {round(PX_MIN[o] * 100)}% vùng nội dung "
                             f"— vật rỗng (vòng tròn, khung) hoặc một mảnh lẻ của mô hình; phóng to vật chính, hiện thêm phần "
                             f"lời đang nói tới (CRAFT.md §7)")
            elif b - a >= 1.0:
                warns.append(f"khung thưa {a}–{b} giây ({b - a:.1f} s): điểm ảnh sprite < {round(PX_MIN[o] * 100)}% vùng nội dung")
        # Hook (references/HOOK.md): 0,4–2,0 giây đầu là lúc người lướt quyết định ở lại — không được thưa dù chỉ 0,3 giây.
        hook = [r for r in rows if HOOK_WIN[0] <= r[0] <= HOOK_WIN[1]]
        thin = [r[0] for r in hook if r[5] is not None and r[5] < PX_MIN[o]]
        if not hook:
            fails.append(f"hook: không có mẫu đo nào ở {HOOK_WIN[0]}–{HOOK_WIN[1]} giây — cảnh đầu đang chuyển cảnh hoặc trống")
        elif thin and (max(thin) - min(thin) >= 0.25 or len(thin) >= 3):
            fails.append(f"hook mở đầu thưa {min(thin)}–{max(thin)} giây: điểm ảnh hình < {round(PX_MIN[o] * 100)}% vùng nội dung "
                         f"— đặt hình hook lớn hiện ngay từ 0 giây (references/HOOK.md)")
        out["hook_px_min"] = round(min((r[5] for r in hook if r[5] is not None), default=0), 3)
        pxs = sorted(r[5] for r in rows if r[5] is not None)
        far = [g for g in gaps if g[2] > LABEL_GAP[o]]
        ff = len(far) / max(1, len(gaps))
        if ff > LABEL_FAR_MAX[o]:
            names = sorted({n for _, n, _ in far}, key=lambda n: -sum(1 for g in far if g[1] == n))[:6]
            fails.append(f"nhãn xa vật: {round(ff * 100)}% thời gian nhãn cách vật gần nhất > {LABEL_GAP[o]} ô "
                         f"(tối đa {round(LABEL_FAR_MAX[o] * 100)}%) — đặt nhãn sát vật nó gọi tên; xa nhất: {names}")
        out.update(px_median=round(pxs[len(pxs) // 2], 3), sparse=sparse, label_far=round(ff, 3))
    if frac > 0.15:
        fails.append(f"{round(frac * 100)}% thời lượng vật nhỏ (mực sprite phủ < {round(FILL_MIN[o] * 100)}% vùng nội dung; tối đa 15%)")
    if med < FILL_MEDIAN[o]:
        fails.append(f"độ phủ sprite trung vị {round(med * 100)}% < {round(FILL_MEDIAN[o] * 100)}% — cả video vật quá nhỏ so với khung")
    return out


def judge_mp4(mp4: Path, o: str, dur: float, fails: list, warns: list) -> dict:
    fr = FRAMES[o]
    st = media.streams(mp4)
    if (st["W"], st["H"]) != (fr["W"], fr["H"]):
        fails.append(f"kích thước {st['W']}×{st['H']} ≠ {fr['W']}×{fr['H']}")
    if abs(st["fps"] - 30) > 0.01:
        fails.append(f"fps {st['fps']} ≠ 30")
    if abs(st["dur"] - dur) > 0.15:
        fails.append(f"thời lượng {st['dur']} giây ≠ direction {dur} giây")
    if not st["audio"]:
        fails.append("MP4 không có audio")
    elif st["acodec"] != "aac" or st["rate"] != 48000:
        warns.append(f"audio {st['acodec']} {st['rate']} Hz (mong đợi aac 48000)")
    loud = media.loudness(mp4) if st["audio"] else {"I": None, "peak": None}
    if loud["I"] is not None and not -15 <= loud["I"] <= -13:
        fails.append(f"độ to {loud['I']} LUFS ngoài −14 ±1")
    if loud["peak"] is not None and loud["peak"] > -1.0:
        fails.append(f"đỉnh {loud['peak']} dBFS > −1")
    gw, gh = GRID[o]
    mo = media.motion(mp4, gw, gh, SUBTOP[o])
    if mo["longest_quiet"] > 3.0:
        fails.append(f"đứng yên {mo['longest_quiet']} giây (> 3): {[q for q in mo['quiet_ge2'] if q[2] > 3]}")
    elif mo["quiet_ge2"]:
        warns.append(f"đứng yên ≥ 2 giây: {mo['quiet_ge2']}")
    if mo["activity_min"] < 1.0:
        warns.append(f"cửa sổ 5 giây ít chuyển động nhất chỉ {mo['activity_min']}% (video mẫu ≈ 2%)")
    return {"streams": st, "loudness": loud, "motion": mo}


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("run", type=Path)
    ap.add_argument("orient", choices=["doc", "ngang"])
    ap.add_argument("mp4", type=Path, nargs="?")
    ap.add_argument("--no-video", action="store_true", help="chỉ soát project (trước render)")
    ap.add_argument("--project", type=Path, help="mặc định <run>/project-<orient>")
    a = ap.parse_args()
    run, o = a.run.resolve(), a.orient
    if not a.no_video and not a.mp4:
        ap.error("cần đường dẫn MP4, hoặc --no-video để soát trước render")
    project = (a.project or run / f"project-{o}").resolve()
    direction = json.loads((run / f"work/direction-{o}.json").read_text())
    dur = direction["dur"]
    qdir = run / f"work/qa-{o}"
    qdir.mkdir(parents=True, exist_ok=True)
    marks = fx_marks(direction)
    times = sheet_times(dur, marks)
    fails: list[str] = []
    warns: list[str] = []
    report: dict = {"run": str(run), "orient": o, "dur": dur, "stage": "pre-render" if a.no_video else "video"}

    frames_dir = qdir / "_frames"
    pr = run_probe(project, frames_dir, times if a.no_video else [])
    report["probe"] = judge_probe(pr, o, direction, fails, warns)
    report["fill"] = judge_fill(pr, o, fails, warns)

    mix = run / f"work/mix-{o}.json"
    if mix.is_file():
        mx = json.loads(mix.read_text())
        report["mix"] = mx
        if mx.get("voice_sfx_gap_min") is not None and mx["voice_sfx_gap_min"] < 12:
            fails.append(f"SFX chỉ thấp hơn giọng {mx['voice_sfx_gap_min']} dB (cần ≥ 12) tại cửa sổ {mx.get('voice_sfx_gap_at')}")
    else:
        warns.append(f"chưa có {mix.name} — chạy tools/mix.py trước build")

    cols, tw, per = SHEET[o]
    # Ảnh chồng lấn: khung tại lúc nặng nhất của mỗi lỗi/cảnh báo chồng lấn — sửa, hoặc ghi lý do giữ.
    ov = {}
    for g in report["probe"]["overlap"]:   # một khung mỗi giây; trùng giây thì giữ nhãn LOI
        if g.get("verdict") and g.get("shot") and (g["worstAt"] not in ov or g["verdict"] == "LOI"):
            ov[g["worstAt"]] = g
    ov = sorted(ov.values(), key=lambda g: g["worstAt"])
    if ov:
        report["overlap_sheets"] = [str(p) for p in media.contact([Path(g["shot"]) for g in ov], [g["worstAt"] for g in ov],
                                                                   qdir / "overlap-sheet", cols, tw, per, {g["worstAt"]: g["verdict"] for g in ov})]
    if a.no_video:
        paths = [frames_dir / f"t{t:06.2f}.png" for t in times]
        report["sheets"] = [str(p) for p in media.contact(paths, times, qdir / "pre-sheet", cols, tw, per, marks)]
    else:
        report["mp4"] = judge_mp4(a.mp4.resolve(), o, dur, fails, warns)
        paths = media.frames_from_mp4(a.mp4.resolve(), times, frames_dir)
        report["sheets"] = [str(p) for p in media.contact(paths, times, qdir / "sheet", cols, tw, per, marks)]
    shutil.rmtree(frames_dir, ignore_errors=True)   # ảnh lẻ nặng; trích lại bằng ffmpeg khi cần soi

    report.update(verdict="FAIL" if fails else "PASS", fails=fails, warns=warns)
    out = run / f"work/qa-{o}{'-pre' if a.no_video else ''}.json"
    out.write_text(json.dumps(report, ensure_ascii=False, indent=1) + "\n")
    print(f"QA {o} ({report['stage']}): {report['verdict']}  —  {len(fails)} lỗi, {len(warns)} cảnh báo")
    for f in fails:
        print("  LỖI     ", f)
    for w in warns:
        print("  cảnh báo", w)
    if "mp4" in report:
        m = report["mp4"]
        print(f"  mp4 {m['streams']['W']}×{m['streams']['H']} {m['streams']['fps']}fps {m['streams']['dur']}s {m['streams']['mb']}MB"
              f" | {m['loudness']['I']} LUFS đỉnh {m['loudness']['peak']} | đứng yên dài nhất {m['motion']['longest_quiet']}s"
              f" | chuyển động/5s min {m['motion']['activity_min']}% trung vị {m['motion']['activity_median']}%")
    if report["fill"]:
        f = report["fill"]
        print(f"  độ đầy khung: sprite phủ trung vị {round(f['median'] * 100)}% vùng nội dung | vật nhỏ {round(f['small_frac'] * 100)}% thời lượng")
    print(f"  báo cáo: {out}")
    print("  ảnh tổng hợp (BẮT BUỘC mở xem):")
    for s in report["sheets"]:
        print("   ", s)
    if report.get("overlap_sheets"):
        print("  ảnh chồng lấn (BẮT BUỘC mở xem; mỗi mục LỖI/cảnh báo: sửa, hoặc ghi lý do giữ):")
        for s in report["overlap_sheets"]:
            print("   ", s)
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
