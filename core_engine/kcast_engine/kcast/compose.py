"""Ghép kịch bản + kết quả quay + mốc giọng thành plan.json cho trang dựng hình (stage.html)."""

from __future__ import annotations

from . import plan as P


def build(script: dict, cap: dict, words: list[dict] | None) -> dict:
    shots = script["shots"]
    says = [s.get("say", "") for s in shots]
    timing = "voice" if words else "estimate"
    words = words or P.estimate_words(says)
    per_shot = P.split_words(says, words)
    spans = P.shot_spans(per_shot)
    out_shots = []
    for k, (shot, (t0, t1)) in enumerate(zip(shots, spans)):
        kind = shot.get("kind", "screen")
        base = {"id": shot["id"], "kind": kind, "t0": t0, "t1": t1, "kicker": shot.get("kicker", ""),
                "title": shot.get("title", ""), "accent": shot.get("accent", ""), "note": shot.get("note", ""),
                "url": shot.get("url", ""), "chip": shot.get("chip", "TERMINAL" if kind == "terminal" else "")}
        c = cap["shots"].get(shot["id"]) if kind != "card" else None
        if kind in ("screen", "live", "demo", "terminal") and not c:
            raise SystemExit(f"CAPTURE_MISSING: cảnh {shot['id']} chưa quay, chạy lại capture")
        if kind == "screen":
            base["states"] = [{"src": f"capture/{s['png']}", "w": s["w"], "h": s["h"]} for s in c["states"]]
            base["view_w"] = c["viewport"]["width"] if "width" in c["viewport"] else c["viewport"]["w"]
            base.update(P.plan_screen(shot, {**c, "viewport": {"w": base["view_w"]}}, per_shot[k], t0, t1))
        elif kind == "live":
            base.update(_plan_live(c, t0, t1))
        elif kind == "terminal":
            base.update(P.plan_terminal(shot, c, per_shot[k], t0, t1))
            base["url"] = shot.get("url", "")
            if base["late"] > 0:
                print(f"  CẢNH BÁO {shot['id']}: đầu ra terminal vượt lời {base['late']} s, kéo dài lời hoặc bớt lệnh", flush=True)
        elif kind == "demo":
            base.update({"frames": [{"src": f"capture/{f['src']}", "t": f["t"]} for f in c["frames"]],
                         "w": c["w"], "h": c["h"], "rate": min(1.6, max(1.0, c["dur"] / max(t1 - t0 - 0.3, 0.1))), "play_t0": round(t0 + 0.15, 3), "fit": shot.get("fit", "contain")})
        elif kind == "card":
            base["collage"] = [_first_image(cap, sid) for sid in shot.get("collage", []) if _first_image(cap, sid)]
            base["items"] = shot.get("items", [])
        out_shots.append(base)
    dur = round(spans[-1][1], 3)
    return {"w": P.W, "h": P.H, "fps": P.FPS, "duration": dur, "card": P.CARD, "timing": timing,
            "title": script.get("title", ""), "shots": out_shots, "captions": P.captions(words),
            "marks_svg": {s["id"]: [P.wobble_path(m["rect"], m["kind"], m["seed"]) if "rect" in m else "" for m in s.get("marks", [])]
                          for s in out_shots if s.get("marks")}}


def _first_image(cap: dict, sid: str) -> dict | None:
    c = cap["shots"].get(sid)
    if c and c.get("states"):
        s = c["states"][0]
        return {"src": f"capture/{s['png']}", "w": s["w"], "h": s["h"]}
    if c and c.get("frames"):
        return {"src": f"capture/{c['frames'][len(c['frames']) // 2]['src']}", "w": c["w"], "h": c["h"]}
    return None


def _plan_live(c: dict, t0: float, t1: float) -> dict:
    dur = t1 - t0
    # Lời quyết định độ dài cảnh (giọng không bị kéo); bản quay dài hơn thì tua nhanh tới 1,6 lần rồi cắt đuôi.
    rate = min(1.6, max(1.0, c["dur"] / max(dur - 0.4, 0.1)))
    vt = lambda u: round(t0 + 0.2 + u / rate, 3)  # noqa: E731  thời điểm trong video của mốc u trong bản quay
    vw, vh = c["w"], c["h"]
    full = P.clamp_cam(vw / 2, vh / 2, 1.0, vw, vh, vw)
    cam = [{"t0": t0, "t1": t0, "state": 0, **full}]
    cursor = [{"t0": t0, "t1": t0, "x": vw * 0.7, "y": vh * 0.7, "state": 0}]
    clicks, spots, marks, labels, typing = [], [], [], [], []
    evs = [e for e in c["events"] if e.get("found") and e.get("rect")]
    for i, e in enumerate(evs):
        t = vt(e["t"])
        nxt = vt(evs[i + 1]["t_move"]) if i + 1 < len(evs) else t1
        r = e["rect"]
        # Gõ: khung nhìn gồm ô nhập và phần trang phản hồi ngay bên dưới (gợi ý, kết quả).
        rv = {"x": r["x"] - 220, "y": r["y"] - 20, "w": r["w"] + 260, "h": r["h"] + 220} if e["do"] == "type" else r
        z = P.zoom_for(rv, vw, "focus", e.get("zoom")) if e["do"] != "scroll" else 1.0
        z = min(z, 2.0 if e["do"] == "type" else 1.8)  # khung quay trực tiếp là ảnh khung hình, không phóng quá sâu
        cc = P.clamp_cam(rv["x"] + rv["w"] / 2, rv["y"] + rv["h"] / 2, z, vw, vh, vw)
        cam.append({"t0": round(vt(e["t_move"]) - 0.1, 3), "t1": t, "state": 0, **cc})
        cam.append({"t0": t, "t1": round(max(t + 0.3, nxt - 0.4), 3), "state": 0, **cc})
        cursor.append({"t0": vt(e["t_move"]), "t1": t, "x": e["x"], "y": e["y"], "state": 0})
        lab = e.get("label") or P.LABELS.get(e["do"], "")
        if lab:
            labels.append({"t0": t, "t1": round(min(t + 1.5, nxt), 3), "text": lab})
        if e["do"] in ("click", "type"):
            clicks.append(round(t + 0.05, 3))
        if e["do"] == "type" and e.get("text"):
            typing.append({"t0": vt(e["t_type"]), "t1": vt(e["t_typed"]), "text": e["text"]})
            if e.get("t_enter"):
                clicks.append(vt(e["t_enter"]))
        hold = round(max(t + 0.5, nxt - 0.2), 3)
        spots.append({"t0": t, "t1": hold, "state": 0, "rect": P._pad(rv, 8)})
        mark = e.get("mark") or P.default_mark(e["do"])
        if mark and mark != "none":
            marks.append({"t0": t, "t1": hold, "kind": "frame" if mark == "lift" else mark, "state": 0,
                          "rect": P._pad(r, 6), "seed": i + 3})
    if evs:
        cam.append({"t0": round(t1 - 0.9, 3), "t1": round(t1 - 0.1, 3), "state": 0, **full})
    return {"frames": [{"src": f"capture/{f['src']}", "t": f["t"]} for f in c["frames"]], "rate": rate,
            "play_t0": round(t0 + 0.2, 3), "w": vw, "h": vh, "view_w": vw, "states": [{"w": vw, "h": vh}],
            "cam": cam, "cursor": cursor, "clicks": sorted(clicks), "spots": spots, "marks": P._limit_marks(marks),
            "labels": labels, "swaps": [], "typing": typing}
