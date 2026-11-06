# -*- coding: utf-8 -*-
"""
build_pages.py — Dựng trang minh họa HTML (1280x860) + kịch bản Kudo (script.yaml) từ một spec video JSON.

  python build_pages.py specs/videos/B02_*.json        # một video
  python build_pages.py --all                           # mọi spec trong specs/videos/
  python build_pages.py --check specs/videos/B02_*.json # chỉ kiểm lời đọc + nhãn thương hiệu

Spec JSON (xem specs/videos/B02_BaCapDoLamViecAI.json làm mẫu):
  video_id, lesson_no, lesson_title, out_name, shots[]
  shot: id, kind (card|screen|live), kicker, title, note, chip, say[] (mỗi phần tử = một ý lớn),
        card: items[[tag, text, chip]]
        screen: page{type: concept|app}, beats[{at, target, label, zoom}]
        live: page{type: app, prompt, stream[]}
"""
from __future__ import annotations

import base64
import html
import json
import re
import sys
import unicodedata
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
SPECS = ROOT / "specs" / "videos"
PAGES = ROOT / "pages"
RUNS = ROOT / "runs"
FONTS_CSS = "file:///C:/Users/user/kudo/engines/screencast/fonts/fonts.css"

# Tên thương hiệu / công cụ không được xuất hiện (whitelabel)
BANNED = ["FinBank", "agribank", "vietcombank", "vietinbank", "vpbank", "techcombank", "mb bank", "Đơn vị Doanh nghiệp", "lâm đồng",
          "antigravity", "claude", "chatgpt", "gemini", "codex", "grok", "digisource", "modernform", "greenhome",
          "openai", "google", "microsoft", "anthropic"]

TONES = {
    "green": ("#0F6E56", "#E7F5F0"), "amber": ("#A15C07", "#FDF3E1"), "red": ("#B42318", "#FDECEA"),
    "blue": ("#1D4ED8", "#EAF0FE"), "coral": ("#C2410C", "#FDEEE6"), "ink": ("#23211E", "#F1EEE7"),
    "plum": ("#7A2E5C", "#F6EAF1"),
}

e = lambda s: html.escape(str(s), quote=True)


def tone(t):
    return TONES.get(t or "ink", TONES["ink"])


def rich(s: str) -> str:
    """**đậm** và `mã` trong chuỗi."""
    s = e(s)
    s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"`(.+?)`", r"<code>\1</code>", s)
    return s


BASE_CSS = """
:root{--paper:#F7F5F0;--card:#FFFFFF;--line:#E2DED4;--line2:#D3CEC2;--ink:#23211E;--ink2:#57524A;--mute:#8C877E;
--teal:#0F6E56;--coral:#E05A33;--lac:#AE1C3E}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1280px;height:860px;overflow:hidden;background:var(--paper);color:var(--ink);
font-family:'Be Vietnam Pro',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
code{font-family:'IBM Plex Mono',monospace;font-size:.9em;background:#EFECE4;border:1px solid #E2DED4;border-radius:5px;padding:1px 6px}
b{font-weight:700}
"""

CONCEPT_CSS = """
.pg{padding:30px 40px 26px;height:860px;display:flex;flex-direction:column;gap:16px}
.hd{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;border-bottom:2px solid var(--line);padding-bottom:14px}
.hd h1{font-size:31px;font-weight:700;line-height:1.15;letter-spacing:-.01em}
.hd p{font-size:17px;color:var(--ink2);margin-top:6px;line-height:1.4;max-width:900px}
.badge{flex-shrink:0;font-size:13px;font-weight:700;letter-spacing:.08em;color:#fff;background:var(--lac);padding:7px 13px;border-radius:999px}
.badge.sim{background:#A15C07}
.body{flex:1;display:flex;flex-direction:column;justify-content:center;gap:20px;min-height:0}
.row{display:flex;gap:16px;align-items:stretch}.row>*{flex:1;min-width:0}
.cards{display:grid;gap:14px}
.cd{background:var(--card);border:1.5px solid var(--line);border-radius:16px;padding:22px 22px;border-top:6px solid var(--tc);
box-shadow:0 6px 18px rgba(35,33,30,.05);display:flex;flex-direction:column;gap:8px}
.cd .tg{align-self:flex-start;font-size:12.5px;font-weight:700;letter-spacing:.06em;color:var(--tc);background:var(--tb);padding:4px 10px;border-radius:999px}
.cd h3{font-size:24px;line-height:1.25}
.cd ul{list-style:none;display:flex;flex-direction:column;gap:6px}
.cd li{font-size:18px;line-height:1.45;color:var(--ink2);padding-left:16px;position:relative}
.cd li:before{content:"";position:absolute;left:0;top:10px;width:7px;height:7px;border-radius:50%;background:var(--tc)}
.tb{width:100%;border-collapse:separate;border-spacing:0;background:var(--card);border:1.5px solid var(--line);border-radius:14px;overflow:hidden}
.tb th{font-size:14px;letter-spacing:.04em;text-transform:uppercase;text-align:left;color:var(--ink2);background:#EFECE4;padding:11px 14px;border-bottom:1.5px solid var(--line)}
.tb td{font-size:17.5px;line-height:1.4;padding:12px 14px;border-bottom:1px solid var(--line);vertical-align:top;color:var(--ink2)}
.tb tr:last-child td{border-bottom:none}
.tb td:first-child{font-weight:700;color:var(--tc);border-left:6px solid var(--tc);background:var(--tb);width:210px}
.flow{display:flex;align-items:stretch;gap:0}
.st{flex:1;background:var(--card);border:1.5px solid var(--line);border-radius:16px;padding:16px 16px;display:flex;flex-direction:column;gap:8px;position:relative}
.st .n{width:38px;height:38px;border-radius:50%;background:var(--tc);color:#fff;font-weight:700;font-size:17px;display:flex;align-items:center;justify-content:center}
.st h4{font-size:20px;line-height:1.25}
.st p{font-size:16.5px;line-height:1.42;color:var(--ink2)}
.st .gt{align-self:flex-start;font-size:12px;font-weight:700;color:#B42318;background:#FDECEA;border-radius:999px;padding:3px 9px}
.ar{width:26px;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:var(--line2);font-size:24px;font-weight:700}
.flow.v{flex-direction:column;gap:8px}.flow.v .st{flex-direction:row;align-items:center;gap:14px;padding:11px 16px}
.flow.v .st .tx{display:flex;flex-direction:column;gap:2px}.flow.v .ar{display:none}
.tree{background:#FFFFFF;border:1.5px solid var(--line);border-radius:16px;padding:16px 20px;font-family:'IBM Plex Mono',monospace;display:flex;flex-direction:column;gap:4px}
.tr{display:flex;align-items:center;gap:12px;padding:7px 10px;border-radius:9px;font-size:18px}
.tr .nm{color:var(--tc);font-weight:500;white-space:nowrap}
.tr .nt{font-family:'Be Vietnam Pro',sans-serif;font-size:16px;color:var(--ink2)}
.tr .pm{margin-left:auto;font-family:'Be Vietnam Pro',sans-serif;font-size:12.5px;font-weight:700;color:var(--tc);background:var(--tb);padding:3px 10px;border-radius:999px;white-space:nowrap}
.co{border-radius:16px;padding:16px 20px;background:var(--tb);border:1.5px solid var(--tc);display:flex;gap:16px;align-items:flex-start}
.co .ic{width:34px;height:34px;border-radius:10px;background:var(--tc);color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px}
.co h4{font-size:20px;color:var(--tc);margin-bottom:4px}.co p{font-size:17.5px;line-height:1.45;color:var(--ink)}
.hero{display:flex;flex-direction:column;gap:26px;flex:1;justify-content:center}
.hero .hk{font-size:20px;font-weight:700;letter-spacing:.14em;color:var(--teal)}
.hero .hh{font-size:64px;font-weight:700;line-height:1.05;letter-spacing:-.02em}
.hcols{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.hcols.tight{gap:12px}.hcols.tight .hc{padding:20px 16px 22px;min-height:340px;border-top-width:8px}
.hcols.tight .hn{font-size:62px}.hcols.tight .ht{font-size:26px}.hcols.tight .hs{font-size:20px}
.hc{background:#fff;border-radius:22px;border:2px solid var(--line);border-top:10px solid var(--tc);padding:30px 28px 34px;display:flex;flex-direction:column;gap:14px;min-height:400px}
.hc .hn{font-size:86px;font-weight:700;line-height:1;color:var(--tc)}
.hc .ht{font-size:31px;font-weight:700;line-height:1.2}
.hc .hs{font-size:22px;line-height:1.45;color:var(--ink2)}
.fx{flex:1;display:flex;flex-direction:column;gap:30px;justify-content:center}
.flad{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.fl{display:flex;align-items:center;gap:12px;padding:14px 18px;border-radius:14px;border:2px solid var(--line);background:#fff;font-size:19px;font-weight:600;color:var(--mute);opacity:.6}
.fl b{width:36px;height:36px;border-radius:50%;background:#E2DED4;color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.fl.on{opacity:1;color:var(--ink);border-color:var(--tc);background:var(--tb)}.fl.on b{background:var(--tc)}
.fmain{display:grid;grid-template-columns:400px 1fr;gap:28px;align-items:stretch}
.fleft{background:#fff;border-radius:24px;border:2px solid var(--line);border-top:12px solid var(--tc);padding:30px;display:flex;flex-direction:column;gap:14px}
.fleft .fn{font-size:120px;font-weight:700;line-height:.9;color:var(--tc)}
.fleft .ft{font-size:38px;font-weight:700;line-height:1.15}
.fleft .fs{font-size:20px;color:var(--ink2);line-height:1.4}
.ftr{list-style:none;display:flex;flex-direction:column;gap:16px;justify-content:center}
.ftr li{background:#fff;border:2px solid var(--line);border-left:10px solid var(--tc);border-radius:16px;padding:20px 24px;font-size:26px;line-height:1.35;font-weight:500}
.big{background:var(--card);border:1.5px solid var(--line);border-radius:16px;padding:20px 24px;text-align:center}
.big .f{font-size:30px;font-weight:700;color:var(--tc)}.big .c{font-size:15.5px;color:var(--ink2);margin-top:6px}
"""

APP_CSS = """
.win{width:1280px;height:860px;display:flex;flex-direction:column;background:#EFECE6;position:relative}
.tbar{height:44px;display:flex;align-items:center;gap:14px;padding:0 16px;border-bottom:1px solid var(--line);font-size:13px;color:var(--ink2)}
.tbar .ws{font-weight:700;color:var(--ink)}.tbar .sep{color:var(--mute)}
.tbar .sim{margin-left:auto;font-size:12px;font-weight:700;letter-spacing:.07em;color:#fff;background:#A15C07;padding:5px 11px;border-radius:999px}
.cols{flex:1;display:grid;grid-template-columns:232px 498px 1fr;min-height:0}
.sb{padding:12px 10px;display:flex;flex-direction:column;gap:3px;border-right:1px solid var(--line)}
.nc{background:#fff;border:1px solid var(--line2);border-radius:8px;padding:8px 12px;font-size:13px;font-weight:600;margin-bottom:8px}
.sh{font-size:11.5px;font-weight:700;color:var(--mute);letter-spacing:.06em;padding:10px 8px 4px;text-transform:uppercase}
.sv{font-size:13px;color:var(--ink2);padding:7px 10px;border-radius:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sv.on{background:#DFDBD0;color:var(--ink);font-weight:600}
.ch{background:#F8F7F3;border-right:1px solid var(--line);display:flex;flex-direction:column;min-height:0}
.stream{flex:1;padding:16px 18px;display:flex;flex-direction:column;gap:10px;overflow:hidden}
.m{font-size:14.5px;line-height:1.5}
.m.user{align-self:flex-end;max-width:88%;background:#E7E3DA;border-radius:14px 14px 4px 14px;padding:10px 14px;color:var(--ink)}
.m.agent{color:var(--ink);padding:2px 2px}
.m.status{font-family:'IBM Plex Mono',monospace;font-size:12.5px;color:var(--ink2);display:flex;gap:8px;align-items:center}
.m.status:before{content:"";width:8px;height:8px;border-radius:50%;background:#0F6E56;flex-shrink:0}
.m.status.wait:before{background:#A15C07}
.m.gate{background:#FDECEA;border:1.5px solid #B42318;border-radius:12px;padding:10px 13px;color:#7A1A12;font-weight:600}
.m.hide{display:none}
.inp{margin:0 14px 14px;background:#fff;border:1.5px solid var(--line2);border-radius:14px;padding:10px 12px;display:flex;gap:10px;align-items:flex-end}
.inp textarea{flex:1;border:none;outline:none;resize:none;font:500 14.5px/1.45 'Be Vietnam Pro',sans-serif;color:var(--ink);height:44px;background:transparent}
.inp button{width:36px;height:36px;border:none;border-radius:10px;background:#23211E;color:#fff;font-size:17px;font-weight:700;cursor:pointer}
.pv{background:#F2EFE9;display:flex;flex-direction:column;min-height:0}.pv .doc{flex:1}
.pt{height:38px;display:flex;align-items:center;padding:0 16px;font-family:'IBM Plex Mono',monospace;font-size:12.5px;color:var(--ink2);border-bottom:1px solid var(--line)}
.doc{margin:14px;flex:1;background:#fff;border:1px solid var(--line);border-radius:12px;padding:20px 22px;overflow:hidden;display:flex;flex-direction:column;gap:10px}
.doc.hide{visibility:hidden}
.doc h2{font-size:19px;line-height:1.3}.doc h3{font-size:15.5px;color:var(--teal);margin-top:4px}
.doc p{font-size:15px;line-height:1.5;color:var(--ink2)}
.doc table{width:100%;border-collapse:collapse;font-size:14.5px}
.doc th{background:#EFECE4;text-align:left;padding:7px 9px;font-size:12px;letter-spacing:.03em;color:var(--ink2);border:1px solid var(--line)}
.doc td{padding:7px 9px;border:1px solid var(--line);color:var(--ink)}
.doc td.ok{color:#0F6E56;font-weight:700}.doc td.bad{color:#B42318;font-weight:700}.doc td.warn{color:#A15C07;font-weight:700}
.doc ul{list-style:none;display:flex;flex-direction:column;gap:5px}
.doc li{font-size:15px;line-height:1.45;color:var(--ink2);padding-left:22px;position:relative}
.doc li:before{content:"☐";position:absolute;left:0;color:var(--mute)}
.doc li.done:before{content:"☑";color:#0F6E56}
.opg .flag{border-radius:10px;padding:10px 12px;font-size:15px;font-weight:600;background:#FDECEA;color:#7A1A12;border-left:5px solid #B42318}
.doc .flag{border-radius:10px;padding:9px 12px;font-size:13.5px;line-height:1.45;font-weight:600}
.doc .flag.red{background:#FDECEA;color:#7A1A12;border-left:5px solid #B42318}
.doc .flag.amber{background:#FDF3E1;color:#6B3D05;border-left:5px solid #A15C07}
.doc .flag.green{background:#E7F5F0;color:#0B4F3E;border-left:5px solid #0F6E56}
.pvdoc{display:flex;flex-direction:column;flex:1;min-height:0}.pvdoc.hide{display:none}
.m.sel{background:#CFE0FF !important;outline:2px solid #3B6FD8;border-radius:8px}
#toast{position:absolute;left:50%;top:70px;transform:translateX(-50%);background:#23211E;color:#fff;font-size:15px;font-weight:600;padding:9px 18px;border-radius:999px;opacity:0;transition:opacity .2s}
#toast.on{opacity:1}
#flash{position:absolute;inset:84px 0 0 0;background:#fff;opacity:0;pointer-events:none;transition:opacity .25s}#flash.on{opacity:.92}
.ovl{position:absolute;right:28px;top:96px;width:620px;height:600px;background:#fff;border-radius:10px;box-shadow:0 24px 60px rgba(0,0,0,.28),0 0 0 1px #C9C4B8;overflow:hidden}
.ovl.hide{display:none}
.otb{height:38px;background:#2B579A;color:#fff;display:flex;align-items:center;gap:14px;padding:0 14px;font-size:13.5px}
.orb{height:34px;background:#F3F2F1;border-bottom:1px solid #DDD;font-size:12.5px;color:#444;display:flex;align-items:center;padding:0 14px}
.opg{margin:18px 26px;display:flex;flex-direction:column;gap:10px}
.opg p,.opg pre{font-size:14.5px;line-height:1.5;color:#222}
.opg h2{font-size:18px}
.doc .raw,.opg .raw{font-family:'IBM Plex Mono',monospace;font-size:13.5px;white-space:pre-wrap;color:#333;line-height:1.55}
.doc .wf{display:flex;gap:12px;align-items:flex-start;padding:10px 12px;border:1.5px solid var(--line);border-radius:10px;opacity:.55}
.doc .wf .c{width:28px;height:28px;border-radius:50%;border:2px solid var(--line2);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:var(--mute)}
.doc .wf b{font-size:15px}.doc .wf p{font-size:13.5px}
.doc .wf.run{opacity:1;border-color:#A15C07;background:#FDF3E1}.doc .wf.run .c{border-color:#A15C07;color:#A15C07}
.doc .wf.done{opacity:1;border-color:#0F6E56;background:#E7F5F0}.doc .wf.done .c{background:#0F6E56;border-color:#0F6E56;color:#fff}
.doc .wf.done .c:after{content:"✓"}.doc .wf.done .c span{display:none}
.doc .wf.gate.run{border-color:#B42318;background:#FDECEA}
.slide{aspect-ratio:16/9;border-radius:8px;overflow:hidden;border:1px solid var(--line2);display:flex;flex-direction:column;background:#FBFAF6}
.slide .sh1{background:#0F4C3A;color:#fff;padding:12px 18px;font-size:17px;font-weight:700}
.slide .sb1{flex:1;display:grid;grid-template-columns:1.2fr 1fr;gap:14px;padding:14px 18px}
.slide ul{list-style:disc;padding-left:18px;display:flex;flex-direction:column;gap:6px}.slide li{font-size:13px;color:#333;padding:0}.slide li:before{display:none}
.slide .k{display:flex;flex-direction:column;gap:8px}.slide .k div{background:#fff;border:1px solid var(--line);border-radius:8px;padding:8px 10px}
.slide .k span{display:block;font-size:11px;color:var(--mute)}.slide .k b{font-size:17px;color:#0F4C3A}
.scan{position:relative;background:#EFEBDD;border:1px solid #D8D1BC;border-radius:4px;padding:14px 18px;font-family:'Cormorant Garamond',serif;transform:rotate(-.5deg);box-shadow:inset 0 0 40px rgba(120,100,60,.18)}
.scan .sh2{font-size:17px;font-weight:600;color:#3d3a33;margin-bottom:6px;filter:blur(.3px)}
.scan .sr{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px dashed #CFC7B0;font-size:17px;color:#3d3a33;filter:blur(.35px)}
.scan .sr b{position:relative;font-weight:600}.scan .sr b.blur{filter:blur(1.1px)}
.scan .stamp{position:absolute;right:-26px;top:-24px;width:78px;height:78px;border:3px solid rgba(190,30,30,.7);border-radius:50%;color:rgba(190,30,30,.75);font:700 10px/1.1 'Be Vietnam Pro',sans-serif;display:flex;align-items:center;justify-content:center;text-align:center;transform:rotate(-18deg);filter:blur(.3px)}
.doc .kv{display:grid;grid-template-columns:170px 1fr;gap:4px 12px;font-size:13.5px}.doc .kv span{color:var(--mute)}
.kvr{display:contents}
.rv{display:none !important}
.doc tr.hl td,.doc li.hl,.kvr.hl>*,.doc .flag.hl,.doc .wf.hl,.m.hl{background:#FFF0A3 !important;box-shadow:0 0 0 2px #E2B93B;border-radius:4px}
/* Chữ to hơn cho khung 16:9 (CEO, 2026-10-30) */
.cols{grid-template-columns:150px 480px 1fr}
.tbar{font-size:15px}.nc{font-size:13px;padding:7px 8px}.sv{font-size:13.5px;padding:7px 8px}
.m{font-size:18.5px;line-height:1.45}.m.status{font-size:15.5px}
.inp textarea{font-size:17.5px;height:50px}
.pt{font-size:15px}
.doc{gap:14px;padding:22px 24px}
.doc h2{font-size:26px}.doc h3{font-size:21px}.doc p{font-size:20px}
.doc table{font-size:19.5px}.doc th{font-size:15.5px;padding:8px 10px}.doc td{padding:9px 10px}
.doc li{font-size:20.5px;padding-left:28px}.doc ul{gap:9px}
.doc .flag{font-size:18.5px;padding:11px 14px}
.doc .kv{grid-template-columns:200px 1fr;font-size:18.5px;gap:7px 12px}
.doc .wf{padding:12px 14px}.doc .wf b{font-size:19.5px}.doc .wf p{font-size:17px}
.doc .wf .c{width:32px;height:32px;font-size:15px}
.doc .raw,.opg .raw{font-size:16px}
"""


def blk_cards(b):
    cols = b.get("cols", len(b["items"]))
    out = [f'<div class="cards" id="{e(b.get("id",""))}" style="grid-template-columns:repeat({cols},1fr)">']
    for it in b["items"]:
        tc, tb = tone(it.get("tone"))
        lines = "".join(f"<li>{rich(x)}</li>" for x in it.get("lines", []))
        tg = f'<span class="tg">{e(it["tag"])}</span>' if it.get("tag") else ""
        out.append(f'<div class="cd" id="{e(it.get("id",""))}" style="--tc:{tc};--tb:{tb}">{tg}<h3>{rich(it["title"])}</h3><ul>{lines}</ul></div>')
    return "".join(out) + "</div>"


def blk_table(b):
    th = "".join(f"<th>{e(c)}</th>" for c in b["cols"])
    rows = []
    for r in b["rows"]:
        tc, tb = tone(r.get("tone"))
        tds = "".join(f"<td>{rich(c)}</td>" for c in r["cells"])
        rows.append(f'<tr id="{e(r.get("id",""))}" style="--tc:{tc};--tb:{tb}">{tds}</tr>')
    return f'<table class="tb" id="{e(b.get("id",""))}"><thead><tr>{th}</tr></thead><tbody>{"".join(rows)}</tbody></table>'


def blk_flow(b):
    v = " v" if b.get("vertical") else ""
    out = [f'<div class="flow{v}" id="{e(b.get("id",""))}">']
    for i, it in enumerate(b["items"]):
        tc, tb = tone(it.get("tone", b.get("tone", "green")))
        if i:
            out.append('<div class="ar">›</div>')
        gate = f'<span class="gt">{e(it["gate"])}</span>' if it.get("gate") else ""
        dim = ";opacity:.45" if it.get("tone") == "ink" else ";box-shadow:0 0 0 3px var(--tc)"
        out.append(f'<div class="st" id="{e(it.get("id",""))}" style="--tc:{tc};--tb:{tb}{dim}"><div class="n">{e(it.get("num", i+1))}</div>'
                   f'<div class="tx"><h4>{rich(it["title"])}</h4><p>{rich(it.get("desc",""))}</p>{gate}</div></div>')
    return "".join(out) + "</div>"


def blk_tree(b):
    out = [f'<div class="tree" id="{e(b.get("id",""))}">']
    for it in b["items"]:
        tc, tb = tone(it.get("tone"))
        pad = 10 + 30 * int(it.get("depth", 0))
        pm = f'<span class="pm">{e(it["perm"])}</span>' if it.get("perm") else ""
        nt = f'<span class="nt">{rich(it["note"])}</span>' if it.get("note") else ""
        out.append(f'<div class="tr" id="{e(it.get("id",""))}" style="--tc:{tc};--tb:{tb};padding-left:{pad}px">'
                   f'<span class="nm">{e(it["name"])}</span>{nt}{pm}</div>')
    return "".join(out) + "</div>"


def blk_callout(b):
    tc, tb = tone(b.get("tone", "coral"))
    return (f'<div class="co" id="{e(b.get("id",""))}" style="--tc:{tc};--tb:{tb}"><div class="ic">{e(b.get("icon","!"))}</div>'
            f'<div><h4>{rich(b["title"])}</h4><p>{rich(b["text"])}</p></div></div>')


def blk_big(b):
    tc, _ = tone(b.get("tone", "green"))
    return f'<div class="big" id="{e(b.get("id",""))}" style="--tc:{tc}"><div class="f">{rich(b["text"])}</div><div class="c">{rich(b.get("caption",""))}</div></div>'


def blk_hero(b):
    cols = []
    for it in b["items"]:
        tc, tb = tone(it.get("tone"))
        cols.append(f'<div class="hc" id="{e(it.get("id",""))}" style="--tc:{tc};--tb:{tb}"><div class="hn">{e(it["num"])}</div>'
                    f'<div class="ht">{rich(it["title"])}</div><div class="hs">{rich(it.get("sub",""))}</div></div>')
    return (f'<div class="hero" id="{e(b.get("id",""))}"><div class="hk">{rich(b.get("kicker",""))}</div>'
            f'<div class="hh">{rich(b["title"])}</div><div class="hcols{" tight" if len(cols) > 3 else ""}" '
            f'style="grid-template-columns:repeat({len(cols)},1fr)">{"".join(cols)}</div></div>')


def blk_focus(b):
    """Lý thuyết một cấp độ: thang 3 cấp ở trên, số lớn + tên cấp bên trái, đặc trưng chữ lớn bên phải."""
    lad = []
    for it in b["ladder"]:
        tc, tb = tone(it.get("tone"))
        on = it.get("on")
        lad.append(f'<div class="fl{" on" if on else ""}" style="--tc:{tc};--tb:{tb}"><b>{e(it["num"])}</b>{rich(it["title"])}</div>')
    tc, tb = tone(b.get("tone"))
    tr = "".join(f'<li id="{e(t.get("id",""))}">{rich(t["text"])}</li>' for t in b["traits"])
    return (f'<div class="fx" id="{e(b.get("id",""))}" style="--tc:{tc};--tb:{tb}"><div class="flad">{"".join(lad)}</div>'
            f'<div class="fmain"><div class="fleft"><div class="fn">{e(b["num"])}</div><div class="ft">{rich(b["title"])}</div>'
            f'<div class="fs">{rich(b.get("sub",""))}</div></div><ul class="ftr">{tr}</ul></div></div>')


def blk_html(b):
    """Khối vẽ riêng (đồ thị, sơ đồ SVG): HTML viết sẵn trong spec, có thể có id để `show`, `hl`, `on`."""
    return b["html"]


def blk_row(b):
    return f'<div class="row" id="{e(b.get("id",""))}">' + "".join(block(x) for x in b["blocks"]) + "</div>"


def block(b):
    return {"cards": blk_cards, "table": blk_table, "flow": blk_flow, "tree": blk_tree, "callout": blk_callout,
            "big": blk_big, "row": blk_row, "hero": blk_hero, "focus": blk_focus, "html": blk_html}[b["type"]](b)


def page_concept(p, lesson):
    if p.get("bare"):
        return f'<style>{CONCEPT_CSS}</style><div class="pg">' + "".join(block(b) for b in p["blocks"]) + "</div>"
    badge = p.get("badge", f"BÀI {lesson}")
    sim = " sim" if p.get("sim") else ""
    body = "".join(block(b) for b in p["blocks"])
    return (f'<style>{CONCEPT_CSS}</style><div class="pg"><div class="hd"><div><h1>{rich(p["heading"])}</h1>'
            f'<p>{rich(p.get("sub",""))}</p></div><span class="badge{sim}">{e(badge)}</span></div><div class="body">{body}</div></div>')


def _item_attr(b, i, cls=""):
    """Thuộc tính cho từng dòng trong khối: `ids` để tô đúng dòng, `reveal` để dòng hiện dần theo lời đọc."""
    ids = b.get("ids") or []
    rid = ids[i] if i < len(ids) else ""
    classes = " ".join(x for x in (cls, "rv" if rid and b.get("reveal") else "") if x)
    return (f' id="{e(rid)}"' if rid else "") + (f' class="{classes}"' if classes else "")


def doc_blocks(blocks):
    out = []
    for b in blocks:
        t = b["type"]
        if t == "h":
            out.append(f"<h2>{rich(b['text'])}</h2>")
        elif t == "h3":
            out.append(f"<h3>{rich(b['text'])}</h3>")
        elif t == "p":
            out.append(f"<p>{rich(b['text'])}</p>")
        elif t == "kv":
            out.append('<div class="kv">' + "".join(f'<div{_item_attr(b, i, "kvr")}><span>{e(k)}</span><b>{rich(v)}</b></div>' for i, (k, v) in enumerate(b["items"])) + "</div>")
        elif t == "table":
            th = "".join(f"<th>{e(c)}</th>" for c in b["cols"])
            trs = []
            for r in b["rows"]:
                tds = []
                for c in r:
                    m = re.match(r"^\[(ok|bad|warn)\]\s*(.*)$", str(c))
                    tds.append(f'<td class="{m.group(1)}">{rich(m.group(2))}</td>' if m else f"<td>{rich(c)}</td>")
                trs.append(f"<tr{_item_attr(b, len(trs))}>" + "".join(tds) + "</tr>")
            out.append(f"<table><thead><tr>{th}</tr></thead><tbody>{''.join(trs)}</tbody></table>")
        elif t == "list":
            out.append("<ul>" + "".join(f'<li{_item_attr(b, i, "done" if x.startswith("[x]") else "")}>{rich(x[3:].strip() if x.startswith("[x]") or x.startswith("[ ]") else x)}</li>' for i, x in enumerate(b["items"])) + "</ul>")
        elif t == "scan":
            rows = []
            for i, (k, v) in enumerate(b["rows"]):
                st = i == b.get("stamp_row", -1)
                stamp = f'<span class="stamp">{e(b.get("stamp","ĐÃ KIỂM TOÁN"))}</span>' if st else ""
                rows.append(f'<div class="sr"><span>{e(k)}</span><b class="{"blur" if st else ""}">{e(v)}{stamp}</b></div>')
            out.append(f'<div class="scan"><div class="sh2">{e(b.get("title",""))}</div>{"".join(rows)}</div>')
        elif t == "raw":
            out.append(f'<div class="raw">{e(b["text"])}</div>')
        elif t == "workflow":
            out.append("".join(f'<div class="wf{" gate" if it.get("gate") else ""}" id="{e(it["id"])}"><div class="c"><span>{i+1}</span></div>'
                               f'<div><b>{rich(it["title"])}</b><p>{rich(it.get("desc",""))}</p></div></div>' for i, it in enumerate(b["items"])))
        elif t == "slide":
            kp = "".join(f"<div><span>{e(k)}</span><b>{e(v)}</b></div>" for k, v in b.get("kpis", []))
            li = "".join(f"<li>{rich(x)}</li>" for x in b.get("bullets", []))
            out.append(f'<div class="slide"><div class="sh1">{e(b["title"])}</div><div class="sb1"><ul>{li}</ul><div class="k">{kp}</div></div></div>')
        elif t == "dhtml":  # Thêm cho bài 6: HTML viết sẵn trong tài liệu xem trước, để một cụm có tiêu đề và bảng hiện cùng lúc.
            out.append(b["html"])
        elif t in ("red", "amber", "green"):
            out.append(f'<div class="flag {t}{" rv" if b.get("reveal") else ""}"{(' id="' + e(b["id"]) + '"') if b.get("id") else ""}>{rich(b["text"])}</div>')
    return "".join(out)


REVEAL_JS = """
<script>
(function(){
 const st=document.getElementById('stream');
 const ta=document.getElementById('prompt-input');
 const sendBtn=document.getElementById('send-btn');
 if(sendBtn) sendBtn.addEventListener('click',function(){
   const txt=ta.value.trim();
   if(txt){const u=document.createElement('div');u.className='m user';u.textContent=txt;
     const first=document.querySelector('.js-stream.hide');st.insertBefore(u,first||null);ta.value='';
     st.scrollTop=st.scrollHeight;}
 });
 function toast(t){let x=document.getElementById('toast');x.textContent=t;x.classList.add('on');setTimeout(()=>x.classList.remove('on'),1600);}
 // Thao tác do bộ quay gọi đúng lúc lời đọc nhắc tới
 window.__act=function(name,arg){
   if(name==='reveal'){[...document.querySelectorAll('.js-stream.hide')].slice(0,arg||1).forEach(el=>el.classList.remove('hide'));st.scrollTop=st.scrollHeight;}
   else if(name==='doc'){document.querySelectorAll('.pvdoc').forEach(d=>d.classList.toggle('hide',d.id!==arg));
     const o=document.getElementById(arg); if(o&&o.classList.contains('ovl')) o.classList.remove('hide');}
   else if(name==='hide'){const o=document.getElementById(arg); if(o) o.classList.add('hide');}
   else if(name==='tick'){const o=document.getElementById(arg); if(o){o.classList.remove('run');o.classList.add('done');}
     const n=o&&o.nextElementSibling; if(n&&n.classList.contains('wf')) n.classList.add('run');}
   else if(name==='copy'){const o=document.getElementById(arg); if(o) o.classList.add('sel'); toast('Đã sao chép  (Ctrl + C)');}
   else if(name==='show'){const o=document.getElementById(arg); if(o) o.classList.remove('rv');}
   else if(name==='hl'){document.querySelectorAll('.hl').forEach(x=>x.classList.remove('hl')); const o=document.getElementById(arg); if(o) o.classList.add('hl');}
   else if(name==='clear'){st.querySelectorAll('.m:not(.hide)').forEach(m=>{m.style.display='none'});}
   else if(name==='newchat'){st.querySelectorAll('.m:not(.hide)').forEach(m=>{m.style.display='none'});
     document.querySelectorAll('.ovl').forEach(o=>o.classList.add('hide'));
     const tb=document.querySelector('.wtab span'); if(tb) tb.textContent=arg||'Cuộc trò chuyện mới';
     const u=document.querySelector('.waddr .u'); if(u) u.textContent='trang-chat-ai.vi/tro-chuyen-moi-2';
     const f=document.getElementById('flash'); if(f){f.classList.add('on');setTimeout(()=>f.classList.remove('on'),900);}
     toast('Hôm sau · mở cuộc trò chuyện mới');}
 };
})();
</script>"""


def _msgs(p, live):
    msgs = [f'<div class="m {m["role"]}"{(' id="' + e(m["id"]) + '"') if m.get("id") else ""}>{rich(m["text"])}</div>' for m in p.get("chat", [])]
    hide = " hide" if live else ""
    msgs += [f'<div class="m {m["role"]}{hide} js-stream"{(' id="' + e(m["id"]) + '"') if m.get("id") else ""}>{rich(m["text"])}</div>'
             for m in p.get("stream", [])]
    return "".join(msgs)


def _previews(p, live):
    docs = p.get("previews") or ([p["preview"]] if p.get("preview") else [])
    out = []
    for i, d in enumerate(docs):
        shown = d.get("visible", not live and i == 0)
        out.append(f'<div class="pvdoc{"" if shown else " hide"}" id="{e(d["id"])}"><div class="pt">{e(d.get("file",""))}</div>'
                   f'<div class="doc">{doc_blocks(d.get("blocks", []))}</div></div>')
    return "".join(out)


def page_app(p, lesson, live: bool):
    sess = p.get("sessions", [])
    groups = "".join(
        (f'<div class="sh">{e(s["group"])}</div>' if s.get("group") else f'<div class="sv{" on" if s.get("active") else ""}">{e(s["title"])}</div>')
        for s in sess)
    ta_val = "" if live else e(p.get("prompt", ""))
    sim_badge = p.get("badge", "TÌNH HUỐNG GIẢ LẬP · SỐ LIỆU MINH HỌA")
    bt = tone(p["badge_tone"])[0] if p.get("badge_tone") else "#A15C07"
    return (f'<style>{APP_CSS}</style><div class="win"><div class="tbar"><span class="ws">{e(p.get("workspace","Không gian làm việc AI"))}</span>'
            f'<span class="sep">/</span><span>{e(p.get("project",""))}</span><span class="sim" style="background:{bt}">{e(sim_badge)}</span></div>'
            f'<div class="cols"><div class="sb" id="sidebar"><div class="nc">+ Phiên làm việc mới</div>{groups}</div>'
            f'<div class="ch"><div class="stream" id="stream">{_msgs(p, live)}</div>'
            f'<div class="inp" id="prompt-box"><textarea id="prompt-input" placeholder="Giao việc cho AI bằng tiếng Việt…">{ta_val}</textarea>'
            f'<button id="send-btn">↑</button></div></div>'
            f'<div class="pv" id="preview">{_previews(p, live)}</div></div></div><div id="toast"></div>'
            + (REVEAL_JS if live else ""))


WEBCHAT_CSS = """
.wb{width:1280px;height:860px;display:flex;flex-direction:column;background:#E9E6DF;position:relative}
.wtab{height:40px;display:flex;align-items:flex-end;gap:6px;padding:0 14px}
.wtab span{background:#F8F7F3;border-radius:9px 9px 0 0;padding:8px 18px;font-size:13px;color:var(--ink2)}
.waddr{height:44px;background:#F8F7F3;display:flex;align-items:center;gap:12px;padding:0 16px;border-bottom:1px solid var(--line)}
.waddr .u{flex:1;background:#fff;border:1px solid var(--line);border-radius:999px;padding:7px 16px;font-size:13.5px;color:var(--ink2)}
.waddr .sim{font-size:12px;font-weight:700;letter-spacing:.07em;color:#fff;background:#A15C07;padding:5px 11px;border-radius:999px}
.wmain{flex:1;background:#FFFFFF;display:flex;flex-direction:column;align-items:center;min-height:0}
.wb .stream{width:900px;flex:1;padding:22px 10px;display:flex;flex-direction:column;gap:14px;overflow:hidden}
.wb .m{font-size:17px;line-height:1.55}
.wb .m.user{align-self:flex-end;max-width:80%;background:#EFECE6;border-radius:18px 18px 4px 18px;padding:12px 16px}
.wb .m.agent{color:var(--ink)}
.wb .m.paste{align-self:flex-end;max-width:80%;font-family:'IBM Plex Mono',monospace;font-size:13.5px;line-height:1.5;white-space:pre-wrap;background:#F6F4EF;border:1px dashed var(--line2);border-radius:12px;padding:10px 14px;color:var(--ink2)}
.wb .m.raw{font-family:'IBM Plex Mono',monospace;font-size:13.5px;white-space:pre-wrap;color:var(--ink2);background:#FAFAF8;border-radius:10px;padding:10px 14px}
.wb .m.divider{align-self:center;font-size:13px;font-weight:700;letter-spacing:.06em;color:var(--mute);border-top:1.5px dashed var(--line2);padding-top:10px;width:100%;text-align:center}
.wb .m.problem{background:#FDECEA;border:1.5px solid #B42318;border-radius:12px;padding:10px 14px;color:#7A1A12;font-weight:600;font-size:15.5px}
.wb .m.hide{display:none}
.wb .inp{width:900px;margin:0 0 18px;background:#fff;border:1.5px solid var(--line2);border-radius:18px;padding:12px 14px;display:flex;gap:10px;align-items:flex-end;box-shadow:0 4px 14px rgba(0,0,0,.05)}
.wb .inp textarea{flex:1;border:none;outline:none;resize:none;font:500 16px/1.45 'Be Vietnam Pro',sans-serif;height:46px}
.wb .inp button{width:40px;height:40px;border:none;border-radius:50%;background:#23211E;color:#fff;font-size:18px;font-weight:700}
"""


def page_webchat(p, lesson, live: bool):
    ta_val = "" if live else e(p.get("prompt", ""))
    return (f'<style>{APP_CSS}{WEBCHAT_CSS}</style><div class="wb"><div class="wtab"><span>{e(p.get("tab","Trò chuyện với AI"))}</span></div>'
            f'<div class="waddr"><div class="u">{e(p.get("address","trang-chat-ai.vi/tro-chuyen-moi"))}</div>'
            f'<span class="sim">{e(p.get("badge","TÌNH HUỐNG GIẢ LẬP"))}</span></div>'
            f'<div class="wmain"><div class="stream" id="stream">{_msgs(p, live)}</div>'
            f'<div class="inp" id="prompt-box"><textarea id="prompt-input" placeholder="Hỏi bất kỳ điều gì…">{ta_val}</textarea>'
            f'<button id="send-btn">↑</button></div></div></div>{_overlays(p, live)}<div id="flash"></div><div id="toast"></div>' + (REVEAL_JS if live else ""))


def _overlays(p, live):
    out = []
    for o in p.get("overlays", []):
        out.append(f'<div class="ovl pvdoc{" hide" if live else ""}" id="{e(o["id"])}"><div class="otb"><b>{e(o.get("app","Word"))}</b>'
                   f'<span>{e(o.get("file",""))}</span></div><div class="orb">Trang chủ · Chèn · Bố cục · Xem lại</div>'
                   f'<div class="opg">{doc_blocks(o.get("blocks", []))}</div></div>')
    return "".join(out)


PREDICT_CSS = """
.pd{width:1280px;height:860px;padding:48px 64px;display:flex;flex-direction:column;gap:26px;background:var(--paper);position:relative}
.pd .pk{font-size:18px;font-weight:700;letter-spacing:.12em;color:var(--teal)}
.pd .ps{font-size:52px;font-weight:700;line-height:1.2;background:#fff;border:2px solid var(--line);border-radius:20px;padding:26px 32px}
.pd .ps i{font-style:normal;color:var(--mute)}
.pd .stream{display:flex;flex-direction:column;gap:14px}
.pd .m.hide{display:none}
.pd .pr{display:grid;grid-template-columns:230px 1fr 90px;gap:16px;align-items:center;font-size:26px;font-weight:600}
.pd .pr .bar{height:30px;background:#E9E5DA;border-radius:999px;overflow:hidden}
.pd .pr .bar b{display:block;height:100%;background:var(--tc);border-radius:999px}
.pd .pr .pc{color:var(--tc);font-weight:700;text-align:right}
.pd .note{font-size:14px;color:var(--mute)}
.pd .pconc{background:var(--tb);border:2px solid var(--tc);border-radius:16px;padding:18px 24px;font-size:24px;line-height:1.4;font-weight:600}
"""


def page_predict(p, lesson, live: bool):
    hide = " hide" if live else ""
    rows = []
    for o in p["options"]:
        tc, tb = tone(o.get("tone", "green"))
        rows.append(f'<div class="m pr{hide} js-stream" style="--tc:{tc}"><span>{e(o["label"])}</span>'
                    f'<div class="bar"><b style="width:{int(o["pct"])}%"></b></div><span class="pc">{int(o["pct"])}%</span></div>')
    tc, tb = tone(p.get("tone", "blue"))
    conc = f'<div class="m pconc{hide} js-stream" id="pd_conc" style="--tc:{tc};--tb:{tb}">{rich(p["conclusion"])}</div>'
    return (f'<style>{PREDICT_CSS}</style><div class="pd"><div class="pk">{e(p.get("kicker",""))}</div>'
            f'<div class="ps" id="pd_sentence">{e(p["sentence"])} <i>…</i></div><div class="stream" id="stream">{"".join(rows)}{conc}</div>'
            f'<div class="note">{e(p.get("footnote",""))}</div></div>' + (REVEAL_JS if live else ""))


# ---------- Hai loại trang thêm cho cảnh có hình thay đổi theo lời (bài 5). Bài khác không dùng nên không đổi.
BOARD_CSS = """
.rv{display:none !important}
svg .hide,.bd .hide{display:none !important}
.bd{position:relative;width:1280px;height:860px;padding:26px 40px;display:flex;flex-direction:column;gap:18px;background:var(--paper)}
.bk{position:absolute;right:40px;top:20px;font-size:15px;font-weight:700;letter-spacing:.1em;color:var(--mute)}
.bh{font-size:36px;font-weight:700;line-height:1.15;letter-spacing:-.01em;padding-right:200px}
.bd .hl{background:#FFF0A3 !important;box-shadow:0 0 0 2px #E2B93B;border-radius:6px}
.bd .tb th{font-size:18px;padding:12px 18px}
.bd .tb td{font-size:27px;padding:25px 18px;color:var(--ink);vertical-align:middle}
.bd .tb td:first-child{width:220px;font-size:30px}
.bd .tb td:nth-child(2){font-family:'IBM Plex Mono',monospace;font-size:27px;font-weight:500}
.bd .tb tr.hl td{background:#FFF0A3 !important}
.dimon.on{opacity:.3}
@keyframes flyit{0%{offset-distance:0%;opacity:0}12%{opacity:1}88%{opacity:1}100%{offset-distance:100%;opacity:0}}
.fly{position:absolute;left:0;top:0;opacity:0;offset-rotate:0deg;background:#B42318;color:#fff;font-size:24px;font-weight:700;padding:8px 16px;border-radius:999px;white-space:nowrap}
.fly.on{animation:flyit 1.8s ease-in-out forwards}
/* Lưới bốn trụ cột */
.pls{flex:1;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:18px;min-height:0;margin-top:16px}
.pl{background:#fff;border:2px solid var(--line);border-top:10px solid var(--tc);border-radius:18px;padding:16px 24px;display:flex;flex-direction:column;gap:10px;min-height:0;overflow:hidden;transition:opacity .25s,box-shadow .25s}
.pls.on .pl{opacity:.5}.pls.on .pl.on{opacity:1;box-shadow:0 0 0 4px var(--tc)}
.plh{display:flex;align-items:center;gap:20px}
.pll{font-size:78px;font-weight:700;line-height:1;color:var(--tc);width:92px;text-align:center}
.pln{font-size:32px;font-weight:700;line-height:1.15}
.plq{font-size:26px;font-weight:600;line-height:1.25;color:var(--tc)}
.plm{font-size:23px;line-height:1.3;color:#7A1A12;font-weight:600;padding:2px 6px;border-radius:6px}
.plm.on{background:#FFF0A3;box-shadow:0 0 0 2px #E2B93B}
.plx{font-size:23px;line-height:1.3;color:var(--ink);font-weight:600}
.plc{display:flex;gap:10px;flex-wrap:wrap}
.plc span{font-size:21px;font-weight:600;padding:6px 12px;border-radius:9px;background:var(--tb);color:var(--tc);border:1.5px solid var(--tc);transition:opacity .3s,box-shadow .3s}
.plc span.on{box-shadow:0 0 0 3px #E2B93B;background:#FFF0A3;color:var(--ink)}
.plc span.dimon.on{opacity:.3;box-shadow:none;background:var(--tb);color:var(--tc)}
"""

WORKSPACE_CSS = """
.wcols{flex:1;display:grid;min-height:0}
.tc{padding:14px 12px;border-right:1px solid var(--line);background:#F3F0E9;display:flex;flex-direction:column;gap:3px;position:relative;min-height:0}
.t2{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:8px;font:500 18px/1.3 'IBM Plex Mono',monospace;color:var(--ink);white-space:nowrap;transition:background .2s}
.t2.root{font:700 18px/1.3 'Be Vietnam Pro',sans-serif;color:var(--ink2)}
.t2.hl,.t2.on{background:#FFF0A3;box-shadow:0 0 0 2px #E2B93B}
.t2.hide{display:none}
.t2 .tg{font:700 14px/1 'Be Vietnam Pro',sans-serif;color:#fff;background:var(--tgc,#B42318);padding:4px 8px;border-radius:999px}
.wc{position:absolute;left:14px;right:14px;bottom:18px;background:#fff;border:2px solid #0F6E56;border-radius:14px;padding:14px 16px;font-size:21px;font-weight:600;line-height:1.3}
.wc.hide{display:none}
.tkb{display:flex;gap:6px;margin-left:18px}
.tkb span{width:34px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;font:700 17px/1 'Be Vietnam Pro',sans-serif;color:var(--mute);background:#E2DED4;transition:background .2s,color .2s}
.tkb span.on{background:var(--tc);color:#fff}
.wbad{margin-left:auto;font-size:12px;font-weight:700;letter-spacing:.07em;color:#fff;background:#A15C07;padding:5px 11px;border-radius:999px}
.win .m{font-size:20px}.win .m.status{font-size:17px}
.win .m.on{background:#FFF0A3;box-shadow:0 0 0 2px #E2B93B;border-radius:6px;padding:4px 6px}
.win .pt{font-size:16px}
.win .doc{gap:11px;padding:18px 22px}
.win .doc li{font-size:21px}
.win .doc li.hide{display:none}
.win .doc li.on{outline:2.5px solid #B42318;outline-offset:3px;border-radius:5px;color:#7A1A12;font-weight:700}
.win .doc .flag{font-size:20px}
.win .doc h2{font-size:25px}.win .doc h3{font-size:22px}.win .doc p{font-size:20px}
"""

BOARD_JS = """
<svg id="links" width="1280" height="860" style="position:absolute;left:0;top:0;pointer-events:none;z-index:50"><defs><marker id="lah" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#B42318"/></marker></defs></svg>
<style>@keyframes lkd{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}.lk{fill:none;stroke:#B42318;stroke-width:3.5;marker-end:url(#lah);stroke-dasharray:1;animation:lkd .45s ease-out both}</style>
<script>
(function(){
 const base=window.__act, box=(el)=>(el.querySelector('.nm')||el).getBoundingClientRect();
 window.__act=function(name,arg){
   const o=typeof arg==='string'?document.getElementById(arg):null;
   if(name==='on'){if(o) o.classList.add('on');}
   else if(name==='off'){if(o) o.classList.remove('on');}
   else if(name==='unlink'){document.querySelectorAll('#links .lk').forEach(x=>x.remove());}
   else if(name==='link'){const [a,b]=arg.split('>').map(x=>document.getElementById(x)); if(!a||!b) return;
     const r=box(a), s=box(b), ltr=s.left>=r.right, rtl=s.right<=r.left, x1=ltr?r.right+6:r.left-6, y1=r.top+r.height/2, x2=ltr?s.left-8:s.right+8, y2=s.top+s.height/2, c=Math.max(50,Math.abs(x2-x1)*.4);
     const p=document.createElementNS('http://www.w3.org/2000/svg','path');
     p.setAttribute('class','lk'); p.setAttribute('pathLength','1');
     if(ltr||rtl) p.setAttribute('d',`M${x1} ${y1} C${x1+(ltr?c:-c)} ${y1} ${x2+(ltr?-c:c)} ${y2} ${x2} ${y2}`);
     else {const x=Math.min(r.right,s.right)-40; p.setAttribute('d',`M${x} ${r.bottom+4} L${x} ${s.top-8}`);}
     document.getElementById('links').appendChild(p);}
   else base(name,arg);
 };
})();
</script>"""


def page_board(p, lesson, live: bool):
    """Trang chữ lớn hoặc sơ đồ có hình đổi theo lời: dùng các thao tác show, hide, hl, on, off, link."""
    head = (f'<div class="bk" id="bk">{e(p.get("corner",""))}</div>' if p.get("corner") else "") + (f'<div class="bh">{rich(p["heading"])}</div>' if p.get("heading") else "")
    return (f'<style>{CONCEPT_CSS}{BOARD_CSS}</style><div class="bd" id="board">{head}{"".join(block(b) for b in p["blocks"])}</div>'
            + (REVEAL_JS + BOARD_JS if live else ""))


def _tree(items):
    out = []
    for it in items:
        if "raw" in it:  # Thêm cho bài 6: bọc một nhóm dòng trong cây thư mục (viền quanh một ca, ghi chú, mũi tên).
            out.append(it["raw"])
            continue
        cls = " ".join(x for x in ("t2", "root" if it.get("root") else "", "rv" if it.get("reveal") else "") if x)
        tag = f'<span class="tg" style="--tgc:{tone(it.get("tag_tone", "red"))[0]}">{e(it["tag"])}</span>' if it.get("tag") else ""
        out.append(f'<div class="{cls}" id="{e(it.get("id",""))}" style="margin-left:{22 * int(it.get("depth", 0))}px"><span class="nm">{e(it["name"])}</span>{tag}</div>')
    return "".join(out)


def _wcard(c):
    return f'<div class="wc rv" id="{e(c["id"])}">{rich(c["text"])}</div>'


def page_workspace(p, lesson, live: bool):
    """Không gian làm việc AI có cây thư mục bên trái; giữa là tiến trình (nếu có `stream`), phải là tệp đang mở (nếu có `previews`)."""
    badges = "".join(f'<span id="{e(b["id"])}" style="--tc:{tone(b.get("tone"))[0]}">{e(b["text"])}</span>' for b in p.get("badges", []))
    cols = [f'<div class="tc" id="tree">{_tree(p.get("tree", []))}{"".join(_wcard(c) for c in p.get("cards", []))}</div>']
    if "stream" in p:
        cols.append(f'<div class="ch"><div class="stream" id="stream">{_msgs(p, live)}</div>'
                    f'<div class="inp" id="prompt-box"><textarea id="prompt-input" placeholder="Giao việc cho AI bằng tiếng Việt…"></textarea>'
                    f'<button id="send-btn">↑</button></div></div>')
    if p.get("previews"):
        cols.append(f'<div class="pv" id="preview">{_previews(p, live)}</div>')
    return (f'<style>{APP_CSS}{WORKSPACE_CSS}</style><div class="win"><div class="tbar"><span class="ws">{e(p.get("workspace","Không gian làm việc AI"))}</span>'
            f'<span class="sep">/</span><span>{e(p.get("project",""))}</span><span class="tkb" id="tkb">{badges}</span>'
            f'<span class="wbad" id="wbad">{e(p.get("badge","TÌNH HUỐNG GIẢ LẬP · SỐ LIỆU MINH HỌA"))}</span></div>'
            f'<div class="wcols" style="grid-template-columns:{e(p.get("cols","470px 1fr"))}">{"".join(cols)}</div></div><div id="toast"></div>'
            + (REVEAL_JS + BOARD_JS if live else ""))


def render_page(shot, lesson):
    p = shot["page"]
    live = shot["kind"] == "live"
    inner = {"concept": lambda: page_concept(p, lesson), "app": lambda: page_app(p, lesson, live),
             "webchat": lambda: page_webchat(p, lesson, live), "predict": lambda: page_predict(p, lesson, live),
             "board": lambda: page_board(p, lesson, live), "workspace": lambda: page_workspace(p, lesson, live)}[p["type"]]()
    return (f'<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><link rel="stylesheet" href="{FONTS_CSS}">'
            f'<style>{BASE_CSS}</style></head><body>{inner}</body></html>')


# ---------- kiểm lời đọc ----------
def _num_words_ok(tok):
    return not re.search(r"\d", tok)


def check_say(spec) -> list[str]:
    errs = []
    blob = json.dumps(spec, ensure_ascii=False).casefold()
    for w in BANNED:
        if w in spec.get("allow_brands", []):  # ngoại lệ do CEO chốt cho từng bài
            continue
        if re.search(r"(?<![a-zà-ỹ])" + re.escape(w) + r"(?![a-zà-ỹ])", blob):
            errs.append(f"có tên thương hiệu/cơ quan cụ thể: '{w}'")
    for s in spec["shots"]:
        text = " ".join(s["say"])
        for tok in text.split():
            parts = "".join(c if c.isalnum() or c.isspace() else " " for c in unicodedata.normalize("NFC", tok).casefold()).split()
            if len(parts) != 1:
                errs.append(f"{s['id']}: từ '{tok}' phải là đúng một âm tiết (bỏ gạch nối, dấu chấm giữa từ, ký hiệu đứng riêng)")
            if not _num_words_ok(tok):
                errs.append(f"{s['id']}: '{tok}' có chữ số — viết số bằng chữ")
            if "/" in tok:
                errs.append(f"{s['id']}: '{tok}' có dấu / (dành cho nghỉ giọng)")
        for b in s.get("beats", []):
            if b["at"] not in text:
                errs.append(f"{s['id']}: mốc '{b['at']}' không có nguyên văn trong lời đọc")
        for m in s.get("opener", {}).get("marks", []):
            if m["at"] not in text:
                errs.append(f"{s['id']}: mốc tô '{m['at']}' không có nguyên văn trong lời đọc")
            if m["text"] not in s["opener"]["text"]:
                errs.append(f"{s['id']}: chữ tô '{m['text']}' không có trong câu trên màn hình")
        last = -1
        for st in s.get("steps", []):
            i = text.find(st["at"])
            if i < 0:
                errs.append(f"{s['id']}: step '{st['at']}' không có nguyên văn trong lời đọc")
            elif i < last:
                errs.append(f"{s['id']}: step '{st['at']}' đứng trước step liền trước trong lời")
            last = max(last, i)
        for st in s.get("steps", []):
            if st["do"] == "type" and len(st.get("text", s["page"].get("prompt", ""))) > 95:
                errs.append(f"{s['id']}: câu gõ dài quá 95 ký tự (gõ không kịp nhịp đọc)")
        if s["kind"] in ("screen", "live") and "page" in s:
            ids = set(re.findall(r'id="([^"]+)"', render_page(s, spec["lesson_no"])))
            for b in s.get("beats", []) + [x for x in s.get("steps", []) if x.get("target")]:
                if b["target"].lstrip("#") not in ids:
                    errs.append(f"{s['id']}: beat target '{b['target']}' không có trên trang")
    return errs


def opener_for_script(o: dict) -> dict:
    """Cảnh mở của một ý lớn: thêm màu nhấn cùng bảng màu với trang chữ lớn; phần dựng hình nằm ở run_kudo_16x9.py."""
    out = {**o, "color": tone(o.get("tone"))[0]}
    # Thêm cho bài 5: `svg` là hình nằm trên câu tóm tắt, `css` chỉnh riêng từ khóa của cảnh này (gạch ngang, hiện dần).
    # Gói thành data URI, không có dấu cách, vì ô tiêu đề của cảnh mở tách chữ theo dấu cách. Bài không khai báo thì không đổi.
    extra = ""
    if out.pop("css", None):
        extra += '<link/rel="stylesheet"/href="data:text/css;base64,' + base64.b64encode(o["css"].encode()).decode() + '">'
    if out.pop("svg", None):
        extra += '<img/alt=""/style="display:block;height:' + str(int(o.get("svg_h", 420))) + 'px"/src="data:image/svg+xml;base64,' + base64.b64encode(o["svg"].encode()).decode() + '">'
    if extra:
        out["title"] = extra + o.get("title", "")
    out.pop("svg_h", None)
    return out


def build(spec_path: Path) -> Path:
    spec = json.loads(spec_path.read_text(encoding="utf-8"))
    errs = check_say(spec)
    if errs:
        raise SystemExit(f"[{spec_path.name}] LỖI SPEC:\n  - " + "\n  - ".join(errs))
    vid = spec["video_id"]
    pdir = PAGES / vid
    pdir.mkdir(parents=True, exist_ok=True)
    shots = []
    for s in spec["shots"]:
        say = " ".join(x.strip() for x in s["say"])
        perform = " //\n".join(x.strip() for x in s["say"])
        y = {"id": s["id"], "kind": s["kind"], "kicker": s.get("kicker", ""), "title": s.get("title", ""),
             "note": s.get("note", ""), "say": say, "perform": perform}
        if s.get("chip"):
            y["chip"] = s["chip"]
        if s["kind"] == "card":
            if s.get("items"):
                y["items"] = s["items"]
            if s.get("collage"):
                y["collage"] = s["collage"]
            if s.get("opener"):
                y["opener"] = opener_for_script(s["opener"])
        else:
            fp = pdir / f"{s['id']}.html"
            fp.write_text(render_page(s, spec["lesson_no"]), encoding="utf-8")
            y["url"] = fp.resolve().as_uri()
            if s["kind"] == "screen":
                y["beats"] = [{"at": b["at"], "target": {"selector": "#" + b["target"].lstrip("#")}, "do": b.get("do", "focus"),
                               "label": b.get("label", ""), "zoom": float(b.get("zoom", 1.3))} for b in s.get("beats", [])]
            else:
                p = s["page"]
                y["lead"] = 0.4
                y["actions"] = []
                for st in s["steps"]:
                    act = {"do": st["do"], "at": st["at"]}
                    if st.get("wait"):
                        act["wait"] = float(st["wait"])
                    if st["do"] == "type":
                        act.update(target={"selector": "#prompt-input"}, text=st.get("text", p.get("prompt", "")), delay=int(st.get("delay", 50)),
                                   label=st.get("label", "GIAO VIỆC BẰNG TIẾNG VIỆT"), zoom=float(st.get("zoom", 1.0)), sec=0.2)
                    elif st["do"] == "send":
                        act.update(do="click", target={"selector": "#send-btn"}, label=st.get("label", "GỬI YÊU CẦU"), sec=0.2)
                    elif st["do"] == "point":
                        act.update(target={"selector": "#" + st["target"].lstrip("#")}, label=st.get("label", ""),
                                   zoom=float(st.get("zoom", 1.25)), mark=st.get("mark", "frame"), sec=0.2)
                    else:  # reveal / doc / hide / tick / copy / clear: thao tác JS trên trang
                        act.update(do="js", name=st["do"], arg=st.get("n", 1) if st["do"] == "reveal" else st.get("arg", st.get("target", "")))
                    y["actions"].append(act)
                y["tail"] = 1.0
        shots.append(y)
    script = {"title": spec["lesson_title"], "theme": "paper", "voice": "Hải Đăng", "pace": 1.02,
              "viewport": {"w": 1280, "h": 860}, "shots": shots}
    kdir = ROOT / "specs" / "kudo"
    kdir.mkdir(parents=True, exist_ok=True)
    out = kdir / f"{vid}.yaml"
    out.write_text(yaml.safe_dump(script, allow_unicode=True, sort_keys=False, width=200), encoding="utf-8")
    print(f"OK {vid}: {len(shots)} cảnh, trang → {pdir}, kịch bản → {out}")
    return out


def main(argv):
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if "--check" in argv:
        bad = 0
        for a in [x for x in argv if x != "--check"]:
            errs = check_say(json.loads(Path(a).read_text(encoding="utf-8")))
            print(f"{Path(a).name}: {'OK' if not errs else 'LỖI'}")
            for x in errs:
                print("  -", x)
            bad += bool(errs)
        return 1 if bad else 0
    paths = sorted(SPECS.glob("*.json")) if "--all" in argv else [Path(a) for a in argv]
    for p in paths:
        build(p)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
