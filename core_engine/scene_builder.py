#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Declarative 6-Archetype 16:9 HTML Scene Compiler (`core_engine/scene_builder.py`)

Ported & Generalized from the FinBank Đơn vị Doanh nghiệp Course Engine (`build_pages.py` — `SP_261030_04`)
and `/kudo` Widescreen 16:9 Stage:
  - Compiles declarative JSON video specs (`specs/videos/<VIDEO_ID>.json`) into standalone
    HTML pages (`pages/<VIDEO_ID>/<shot_id>.html`) ready for `/kudo` Playwright CDP capture.
  - Supports 6 Visual Page Archetypes:
      1. `concept`: Grid / Hero / Focus / Cards / Table / Flow / Tree / Big Callout
      2. `app`: 3-Column AI Workspace Simulator (Sessions + Agent Stream + Live Document Previews)
      3. `webchat`: Browser AI Chat Simulator + Floating Word/Excel Overlays
      4. `predict`: Next-Token Probability Bars (explaining LLM hallucination mechanics)
      5. `board`: 4-Pillar K-W-S-R Board with Dynamic SVG Link Drawing (`svg.links`)
      6. `workspace`: Folder Tree + Live Step Execution Simulator
  - Exposes `window.__act(name, arg)` (`reveal`, `doc`, `hide`, `tick`, `copy`, `show`, `hl`, `clear`, `newchat`)
    so the Playwright CDP screencast engine can trigger every visual change on exact voice word timestamps.
"""

from __future__ import annotations

import html
import json
from pathlib import Path
from typing import Any, Dict, List, Optional


CSS = r"""
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fbfaf6;color:#141311;font-family:'Be Vietnam Pro',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased;line-height:1.45}
body{padding:28px 36px 40px;max-width:1280px;margin:0 auto}
.top{display:flex;align-items:center;justify-content:space-between;padding-bottom:16px;margin-bottom:22px;border-bottom:1.5px solid #e7e2d6}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:15px;letter-spacing:.03em;color:#141311;text-transform:uppercase}
.brand .dot{width:11px;height:11px;border-radius:3px;background:#c84b1f;display:inline-block}
.crumb{font-size:14px;color:#6e6960;font-weight:600}
h1.title{font-size:32px;font-weight:800;letter-spacing:-.02em;line-height:1.18;margin-bottom:8px;color:#141311}
h1.title em{font-style:normal;color:#c84b1f;background:#fbe9df;padding:1px 9px;border-radius:6px}
.sub{font-size:17px;color:#524e47;margin-bottom:22px;max-width:980px}

.grid{display:grid;gap:16px;margin-bottom:18px}
.g2{grid-template-columns:1fr 1fr}
.g3{grid-template-columns:1fr 1fr 1fr}
.g4{grid-template-columns:1fr 1fr 1fr 1fr}

.card{background:#fff;border:1.5px solid #e4dfd2;border-radius:14px;padding:18px 20px;box-shadow:0 2px 6px rgba(20,19,17,.03)}
.card.accent{border-color:#c84b1f;background:#fffaf6}
.card.good{border-color:#157347;background:#f4fbf7}
.card.warn{border-color:#b85600;background:#fff9f0}
.card.bad{border-color:#b42318;background:#fef5f4}
.card.blue{border-color:#1d4ed8;background:#f4f7ff}
.tag{display:inline-block;font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:3px 9px;border-radius:5px;margin-bottom:8px;background:#f0ece1;color:#4a463f}
.card.accent .tag{background:#fbe3d6;color:#9e3510}
.card.good .tag{background:#daf3e4;color:#0f5a36}
.card.warn .tag{background:#fdeacc;color:#8a3f00}
.card.bad .tag{background:#fbdad7;color:#8e1911}
.card.blue .tag{background:#dce6fe;color:#1e40af}
.card h3{font-size:20px;font-weight:800;margin-bottom:6px;line-height:1.25;color:#141311}
.card p{font-size:15.5px;color:#3d3a34;line-height:1.45}
.card ul{list-style:none;margin-top:8px;display:flex;flex-direction:column;gap:5px}
.card li{font-size:15px;color:#2f2c27;padding-left:16px;position:relative;line-height:1.4}
.card li::before{content:"•";position:absolute;left:2px;color:#c84b1f;font-weight:900}

.num{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:8px;background:#141311;color:#fff;font-weight:800;font-size:14px;margin-right:8px}
.card.accent .num{background:#c84b1f}
.card.good .num{background:#157347}
.card.blue .num{background:#1d4ed8}

.tbl{width:100%;border-collapse:separate;border-spacing:0;background:#fff;border:1.5px solid #e4dfd2;border-radius:14px;overflow:hidden;margin-bottom:18px}
.tbl th{background:#f3efe4;text-align:left;padding:12px 16px;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:#3d3a34;border-bottom:1.5px solid #e4dfd2}
.tbl td{padding:13px 16px;font-size:15.5px;border-bottom:1px solid #eee9dc;vertical-align:top;color:#23211d}
.tbl tr:last-child td{border-bottom:none}
.tbl tr.hl td{background:#fff6ed;font-weight:600}
.pill{display:inline-block;padding:2px 9px;border-radius:99px;font-size:12.5px;font-weight:700}
.pill.ok{background:#daf3e4;color:#0f5a36}
.pill.no{background:#fbdad7;color:#8e1911}
.pill.mid{background:#fdeacc;color:#8a3f00}

.flow{display:flex;align-items:stretch;gap:10px;margin-bottom:18px}
.step{flex:1;background:#fff;border:1.5px solid #e4dfd2;border-radius:12px;padding:14px 16px;position:relative}
.step.on{border-color:#c84b1f;background:#fffaf6}
.step .sn{font-size:12px;font-weight:800;color:#c84b1f;letter-spacing:.06em;text-transform:uppercase;margin-bottom:4px}
.step h4{font-size:17px;font-weight:800;margin-bottom:4px;color:#141311}
.step p{font-size:14.5px;color:#46423b;line-height:1.4}
.arr{display:flex;align-items:center;color:#9a9388;font-weight:900;font-size:22px}

.callout{background:#141311;color:#fbfaf6;border-radius:14px;padding:18px 22px;display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:6px}
.callout .k{font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#f59e0b;margin-bottom:4px}
.callout .v{font-size:19px;font-weight:700;line-height:1.35}
.callout .v em{color:#fbbf24;font-style:normal}

.tree{background:#fff;border:1.5px solid #e4dfd2;border-radius:14px;padding:18px 22px;font-family:'JetBrains Mono',Consolas,monospace;font-size:15px;line-height:1.75;margin-bottom:18px}
.tree .row{display:flex;align-items:center;gap:10px;padding:3px 8px;border-radius:6px}
.tree .row.hl{background:#fff4e8;font-weight:700}
.tree .ic{font-weight:800;color:#c84b1f}
.tree .cm{color:#6e6960;font-family:'Be Vietnam Pro',sans-serif;font-size:14.5px;margin-left:auto}

body.bare{padding:18px 24px 20px}
.hero{display:flex;flex-direction:column;gap:18px;min-height:790px;justify-content:space-between}
.hero-head{background:#141311;color:#fbfaf6;border-radius:18px;padding:26px 32px;display:flex;align-items:center;justify-content:space-between;gap:24px}
.hero-head .k{font-size:14px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#fbbf24;margin-bottom:8px}
.hero-head h1{font-size:44px;font-weight:900;line-height:1.12;letter-spacing:-.02em;color:#fff}
.hero-head h1 em{color:#fbbf24;font-style:normal}
.hero-head .sub{font-size:21px;color:#d8d3c8;margin:10px 0 0;max-width:960px;line-height:1.38}
.hero-cols{display:grid;gap:18px;flex:1;align-items:stretch}
.hero-cols.c2{grid-template-columns:1fr 1fr}
.hero-cols.c3{grid-template-columns:1fr 1fr 1fr}
.hero-cols.c4{grid-template-columns:1fr 1fr 1fr 1fr}
.hcol{background:#fff;border:2.5px solid #e4dfd2;border-radius:18px;padding:26px 26px;display:flex;flex-direction:column;justify-content:space-between;gap:14px}
.hcol.accent{border-color:#c84b1f;background:#fff8f3}
.hcol.blue{border-color:#1d4ed8;background:#f4f7ff}
.hcol.good{border-color:#157347;background:#f3fbf6}
.hcol.warn{border-color:#b85600;background:#fff9ee}
.hcol.bad{border-color:#b42318;background:#fef5f4}
.hcol .num-big{font-size:46px;font-weight:900;line-height:1;letter-spacing:-.03em;color:#c84b1f}
.hcol.blue .num-big{color:#1d4ed8}
.hcol.good .num-big{color:#157347}
.hcol.warn .num-big{color:#b85600}
.hcol.bad .num-big{color:#b42318}
.hcol .tag{font-size:14px;padding:5px 12px;margin-bottom:6px}
.hcol h2{font-size:32px;font-weight:900;line-height:1.18;color:#141311;letter-spacing:-.015em}
.hcol p{font-size:21px;color:#2f2c27;line-height:1.4;font-weight:500}
.hcol ul{list-style:none;display:flex;flex-direction:column;gap:10px;margin-top:4px}
.hcol li{font-size:20px;color:#23211d;padding-left:22px;position:relative;line-height:1.36;font-weight:600}
.hcol li::before{content:"▸";position:absolute;left:2px;color:#c84b1f;font-weight:900}
.hero-foot{background:#fff4e8;border:2px solid #c84b1f;border-radius:16px;padding:20px 28px;font-size:24px;font-weight:800;color:#141311;line-height:1.32;text-align:center}
.hero-foot em{color:#c84b1f;font-style:normal}

body.app{padding:0;max-width:none;background:#eeebe3}
.app-shell{display:grid;grid-template-columns:210px 1fr 480px;height:860px;background:#fbfaf6;border:1px solid #d8d2c5}
.side{background:#181715;color:#e7e3da;padding:16px 14px;display:flex;flex-direction:column;gap:12px}
.side .ws{font-weight:800;font-size:13.5px;letter-spacing:.03em;color:#fff;padding:8px 10px;background:#262420;border-radius:8px;display:flex;align-items:center;gap:8px}
.side .ws .d{width:9px;height:9px;border-radius:50%;background:#22c55e}
.side .sec{font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#8c867c;padding:4px 8px 2px}
.side .it{font-size:12.5px;padding:7px 10px;border-radius:7px;color:#c9c4b8;display:flex;align-items:center;gap:7px}
.side .it.on{background:#c84b1f;color:#fff;font-weight:700}

.chat{display:flex;flex-direction:column;height:860px;border-right:1px solid #e2ddd0;background:#fbfaf6}
.chat-hd{padding:12px 20px;border-bottom:1px solid #e2ddd0;display:flex;align-items:center;justify-content:space-between;background:#fff}
.chat-hd .t{font-weight:800;font-size:15px}
.chat-hd .m{font-size:12px;color:#157347;background:#daf3e4;padding:3px 10px;border-radius:99px;font-weight:700}
.chat-bd{flex:1;padding:16px 20px;overflow:hidden;display:flex;flex-direction:column;gap:10px}
.msg{max-width:94%;padding:11px 15px;border-radius:12px;font-size:14.5px;line-height:1.45}
.msg.u{align-self:flex-end;background:#141311;color:#fff;border-bottom-right-radius:3px}
.msg.a{align-self:flex-start;background:#fff;border:1.5px solid #e2ddd0;color:#141311;border-bottom-left-radius:3px}
.msg .who{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;margin-bottom:4px;opacity:.75}
.msg.a .who{color:#c84b1f;opacity:1}
.msg .step-line{font-size:13.5px;padding:3px 0;color:#2f2c27}
.msg.st{align-self:flex-start;background:#f3efe4;border:1.5px dashed #c8b99e;color:#3d3a34;font-size:13.5px;padding:8px 13px;display:flex;align-items:center;gap:9px;font-weight:600}
.msg.st .dot-spin{width:9px;height:9px;border-radius:50%;background:#c84b1f;flex-shrink:0}
.msg.gate{align-self:stretch;max-width:100%;background:#fff8eb;border:2px solid #d97706;color:#141311}
.msg.gate .who{color:#b45309;opacity:1}
.hidden{display:none!important}

.chat-in{padding:12px 16px;border-top:1px solid #e2ddd0;background:#fff;display:flex;gap:10px;align-items:center}
.chat-in input{flex:1;border:2px solid #141311;border-radius:10px;padding:11px 14px;font-size:14.5px;font-family:inherit;background:#fffef9;color:#141311;font-weight:600}
.chat-in button{background:#c84b1f;color:#fff;border:none;border-radius:10px;padding:11px 18px;font-weight:800;font-size:14px;cursor:pointer}

.pv{background:#f3efe4;padding:14px 18px;display:flex;flex-direction:column;gap:10px;height:860px;overflow:hidden;position:relative}
.pv-hd{display:flex;align-items:center;justify-content:space-between}
.pv-hd .t{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#4a463f}
.pv-doc{background:#fff;border:1.5px solid #dcd6c6;border-radius:12px;padding:16px 18px;flex:1;overflow:hidden;display:flex;flex-direction:column;gap:9px}
.pv-doc h3{font-size:17px;font-weight:800;color:#141311;padding-bottom:7px;border-bottom:1.5px solid #eee9dc}
.pv-doc .kv{display:grid;grid-template-columns:135px 1fr;gap:5px 10px;font-size:13.5px}
.pv-doc .kv b{color:#524e47}
.pv-doc .sec-h{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.05em;color:#c84b1f;margin-top:4px}
.pv-doc .bul{font-size:13.5px;color:#23211d;padding-left:13px;position:relative;line-height:1.4}
.pv-doc .bul::before{content:"▸";position:absolute;left:0;color:#c84b1f;font-weight:900}
.hl-box{background:#fff6ed;border:1.5px solid #c84b1f;border-radius:9px;padding:9px 12px;font-size:13.5px;font-weight:600;color:#141311}
"""

ACT_JS = r"""
window.__revealIdx = 0;
window.__act = function(name, arg){
  if (name === 'reveal') {
    var n = arg || 1;
    var list = document.querySelectorAll('[data-seq]');
    for (var i = 0; i < n && window.__revealIdx < list.length; i++, window.__revealIdx++) {
      list[window.__revealIdx].classList.remove('hidden');
    }
  } else if (name === 'doc') {
    document.querySelectorAll('[data-doc]').forEach(function(d){ d.classList.add('hidden'); });
    var t = document.querySelector('[data-doc="' + arg + '"]');
    if (t) t.classList.remove('hidden');
  } else if (name === 'hide') {
    var h = document.getElementById(arg) || document.querySelector('[data-doc="' + arg + '"]');
    if (h) h.classList.add('hidden');
  } else if (name === 'tick') {
    var s = document.getElementById(arg);
    if (s) { s.classList.remove('run'); s.classList.add('done'); }
  } else if (name === 'copy') {
    var c = document.getElementById(arg);
    if (c) c.classList.add('copied');
  } else if (name === 'show') {
    var el = document.getElementById(arg);
    if (el) el.classList.remove('hidden');
  } else if (name === 'hl') {
    document.querySelectorAll('.hl-on,.hl').forEach(function(x){ x.classList.remove('hl-on'); });
    var target = document.getElementById(arg);
    if (target) {
      target.classList.remove('hidden');
      target.classList.add('hl-on');
      target.classList.add('hl');
    }
  } else if (name === 'clear') {
    var inp = document.getElementById('prompt-input');
    if (inp) inp.value = '';
  } else if (name === 'newchat') {
    var bd = document.getElementById('chat-body');
    if (bd) {
      bd.querySelectorAll('[data-seq]:not(.hidden)').forEach(function(m){ m.classList.add('hidden'); });
    }
    var inp2 = document.getElementById('prompt-input');
    if (inp2) inp2.value = '';
  }
};
"""


def _esc(val: Any) -> str:
    return html.escape(str(val or ""), quote=True)


def _render_cards(block: Dict[str, Any]) -> str:
    cols = int(block.get("cols", 3))
    items_html: List[str] = []
    for c in block.get("items", []):
        cls = f"card {c.get('tone', '')}".strip()
        cid = f' id="{_esc(c["id"])}"' if c.get("id") else ""
        tag = f'<div class="tag">{c["tag"]}</div>' if c.get("tag") else ""
        num = f'<span class="num">{c["num"]}</span>' if c.get("num") else ""
        h3 = f'<h3>{num}{c.get("title", "")}</h3>' if c.get("title") else ""
        p = f'<p>{c["text"]}</p>' if c.get("text") else ""
        ul = ""
        if c.get("bullets"):
            ul = "<ul>" + "".join(f"<li>{x}</li>" for x in c["bullets"]) + "</ul>"
        items_html.append(f'<div class="{cls}"{cid}>{tag}{h3}{p}{ul}</div>')
    return f'<div class="grid g{cols}">' + "".join(items_html) + "</div>"


def _render_table(block: Dict[str, Any]) -> str:
    tid = f' id="{_esc(block["id"])}"' if block.get("id") else ""
    ths = "".join(f"<th>{h}</th>" for h in block.get("headers", []))
    rows_html: List[str] = []
    for r in block.get("rows", []):
        rid = f' id="{_esc(r["id"])}"' if r.get("id") else ""
        rcls = ' class="hl"' if r.get("hl") else ""
        tds = "".join(f"<td>{c}</td>" for c in r.get("cells", []))
        rows_html.append(f"<tr{rid}{rcls}>{tds}</tr>")
    return f'<table class="tbl"{tid}><thead><tr>{ths}</tr></thead><tbody>{"".join(rows_html)}</tbody></table>'


def _render_flow(block: Dict[str, Any]) -> str:
    fid = f' id="{_esc(block["id"])}"' if block.get("id") else ""
    parts: List[str] = []
    for i, s in enumerate(block.get("steps", [])):
        if i:
            parts.append('<div class="arr">→</div>')
        sid = f' id="{_esc(s["id"])}"' if s.get("id") else ""
        cls = "step on" if s.get("on") else "step"
        sn = f'<div class="sn">{s["kicker"]}</div>' if s.get("kicker") else ""
        parts.append(f'<div class="{cls}"{sid}>{sn}<h4>{s.get("title", "")}</h4><p>{s.get("text", "")}</p></div>')
    return f'<div class="flow"{fid}>{"".join(parts)}</div>'


def _render_tree(block: Dict[str, Any]) -> str:
    tid = f' id="{_esc(block["id"])}"' if block.get("id") else ""
    rows: List[str] = []
    for r in block.get("rows", []):
        rid = f' id="{_esc(r["id"])}"' if r.get("id") else ""
        cls = "row hl" if r.get("hl") else "row"
        indent = "&nbsp;&nbsp;&nbsp;&nbsp;" * int(r.get("depth", 0))
        cm = f'<span class="cm">{r["note"]}</span>' if r.get("note") else ""
        rows.append(
            f'<div class="{cls}"{rid}><span>{indent}<span class="ic">{r.get("icon", "▸")}</span> {r.get("name", "")}</span>{cm}</div>'
        )
    return f'<div class="tree"{tid}>{"".join(rows)}</div>'


def _render_hero(block: Dict[str, Any]) -> str:
    hid = f' id="{_esc(block["id"])}"' if block.get("id") else ""
    head = ""
    if block.get("title"):
        k = f'<div class="k">{block["kicker"]}</div>' if block.get("kicker") else ""
        sub = f'<div class="sub">{block["sub"]}</div>' if block.get("sub") else ""
        head = f'<div class="hero-head" id="hero-head"><div>{k}<h1>{block["title"]}</h1>{sub}</div></div>'
    items = block.get("items", [])
    cols_n = int(block.get("cols", len(items) or 3))
    cols_html: List[str] = []
    for c in items:
        cid = f' id="{_esc(c["id"])}"' if c.get("id") else ""
        cls = f"hcol {c.get('tone', '')}".strip()
        num = f'<div class="num-big">{c["num"]}</div>' if c.get("num") else ""
        tag = f'<span class="tag">{c["tag"]}</span>' if c.get("tag") else ""
        h2 = f'<h2>{c["title"]}</h2>' if c.get("title") else ""
        p = f'<p>{c["text"]}</p>' if c.get("text") else ""
        ul = ""
        if c.get("bullets"):
            ul = "<ul>" + "".join(f"<li>{x}</li>" for x in c["bullets"]) + "</ul>"
        cols_html.append(f'<div class="{cls}"{cid}><div>{tag}{num}{h2}</div><div>{p}{ul}</div></div>')
    foot = ""
    if block.get("foot"):
        fid = f' id="{_esc(block.get("foot_id", "hero-foot"))}"'
        foot = f'<div class="hero-foot"{fid}>{block["foot"]}</div>'
    return f'<div class="hero"{hid}>{head}<div class="hero-cols c{cols_n}">{"".join(cols_html)}</div>{foot}</div>'


def _render_callout(block: Dict[str, Any]) -> str:
    cid = f' id="{_esc(block["id"])}"' if block.get("id") else ""
    return (
        f'<div class="callout"{cid}><div><div class="k">{block.get("kicker", "GHI NHỚ")}</div>'
        f'<div class="v">{block.get("text", "")}</div></div></div>'
    )


def _render_doc_blocks(blocks: List[Dict[str, Any]]) -> str:
    out: List[str] = []
    for b in blocks:
        tp = b.get("type")
        bid = f' id="{_esc(b["id"])}"' if b.get("id") else ""
        if tp == "kv":
            rows = "".join(f"<b>{k}</b><span>{v}</span>" for k, v in b.get("rows", []))
            out.append(f'<div class="kv"{bid}>{rows}</div>')
        elif tp == "sec":
            out.append(f'<div class="sec-h"{bid}>{b.get("title", "")}</div>')
        elif tp == "bullets":
            items = "".join(f'<div class="bul">{x}</div>' for x in b.get("items", []))
            out.append(f"<div{bid}>{items}</div>")
        elif tp == "hl":
            out.append(f'<div class="hl-box"{bid}>{b.get("text", "")}</div>')
    return "".join(out)


def _page_concept(p: Dict[str, Any]) -> str:
    dispatch = {
        "cards": _render_cards,
        "table": _render_table,
        "flow": _render_flow,
        "tree": _render_tree,
        "callout": _render_callout,
        "hero": _render_hero,
    }
    body = "".join(dispatch[b["type"]](b) for b in p.get("blocks", []) if b.get("type") in dispatch)
    if p.get("bare"):
        return f'<!doctype html><html lang="vi"><head><meta charset="utf-8"><style>{CSS}</style></head><body class="bare">{body}</body></html>'
    sub = f'<div class="sub">{p["sub"]}</div>' if p.get("sub") else ""
    return f"""<!doctype html><html lang="vi"><head><meta charset="utf-8"><style>{CSS}</style></head><body>
<div class="top"><div class="brand"><span class="dot"></span>{p.get("brand", "CẨM NANG AI THỰC CHIẾN")}</div><div class="crumb">{p.get("crumb", "")}</div></div>
<h1 class="title" id="page-title">{p.get("title", "")}</h1>{sub}{body}
</body></html>"""


def _page_app(p: Dict[str, Any]) -> str:
    side_items = "".join(
        f'<div class="sec">{s["group"]}</div>'
        if "group" in s
        else f'<div class="it{" on" if s.get("on") else ""}" id="{_esc(s.get("id", ""))}"><span>{s.get("icon", "▸")}</span><span>{s.get("name", "")}</span></div>'
        for s in p.get("sessions", [])
    )
    msgs: List[str] = []
    for m in p.get("chat", []):
        mid = f' id="{_esc(m["id"])}"' if m.get("id") else ""
        cls = "msg u" if m.get("role") == "user" else "msg a"
        who = m.get("who", "Bạn" if m.get("role") == "user" else "Trợ lý AI")
        lines = "".join(f'<div class="step-line">{x}</div>' for x in m.get("lines", []))
        msgs.append(f'<div class="{cls}"{mid}><div class="who">{who}</div><div>{m.get("text", "")}</div>{lines}</div>')

    for i, m in enumerate(p.get("stream", [])):
        mid = f' id="{_esc(m["id"])}"' if m.get("id") else ""
        role = m.get("role", "agent")
        if role in ("status", "status wait"):
            msgs.append(
                f'<div class="msg st hidden" data-seq="{i}"{mid}><span class="dot-spin"></span><span>{m.get("text", "")}</span></div>'
            )
        elif role == "gate":
            lines = "".join(f'<div class="step-line">{x}</div>' for x in m.get("lines", []))
            msgs.append(
                f'<div class="msg gate hidden" data-seq="{i}"{mid}><div class="who">{m.get("who", "Cổng duyệt")}</div><div><b>{m.get("text", "")}</b></div>{lines}</div>'
            )
        else:
            cls = "msg u hidden" if role == "user" else "msg a hidden"
            who = m.get("who", "Bạn" if role == "user" else "Trợ lý AI")
            lines = "".join(f'<div class="step-line">{x}</div>' for x in m.get("lines", []))
            msgs.append(
                f'<div class="{cls}" data-seq="{i}"{mid}><div class="who">{who}</div><div>{m.get("text", "")}</div>{lines}</div>'
            )

    pvs = p.get("previews") or ([p["preview"]] if p.get("preview") else [])
    pv_docs: List[str] = []
    for k, pv in enumerate(pvs):
        did = pv.get("id", f"pv-{k}")
        hid = "" if (pv.get("visible") or (k == 0 and not p.get("stream"))) else " hidden"
        body = _render_doc_blocks(pv.get("blocks", []))
        pv_docs.append(f'<div class="pv-doc{hid}" id="{_esc(did)}" data-doc="{_esc(did)}"><h3>{pv.get("file", "")}</h3>{body}</div>')

    return f"""<!doctype html><html lang="vi"><head><meta charset="utf-8"><style>{CSS}</style></head><body class="app">
<div class="app-shell">
  <div class="side" id="side-panel">
    <div class="ws"><span class="d"></span>{p.get("project", "Không gian làm việc AI")}</div>
    <div class="sec">Phiên làm việc</div>{side_items}
  </div>
  <div class="chat">
    <div class="chat-hd"><div class="t">{p.get("chat_title", "Phiên làm việc")}</div><div class="m">{p.get("badge", "Đang mở")}</div></div>
    <div class="chat-bd" id="chat-body">{"".join(msgs)}</div>
    <div class="chat-in"><input id="prompt-input" value="{_esc(p.get("input_init", ""))}" placeholder="Nhập yêu cầu giao việc cho AI..."/><button id="send-btn">Gửi ↵</button></div>
  </div>
  <div class="pv" id="preview-pane">
    <div class="pv-hd"><div class="t">Tài liệu dự án</div></div>
    {"".join(pv_docs)}
  </div>
</div>
<script>
document.getElementById('send-btn').addEventListener('click', function(){{
  var inp = document.getElementById('prompt-input');
  var v = inp.value.trim();
  if (v) {{
    var d = document.createElement('div');
    d.className = 'msg u';
    d.id = 'sent-prompt';
    d.innerHTML = '<div class="who">Bạn</div><div>' + v + '</div>';
    document.getElementById('chat-body').appendChild(d);
    inp.value = '';
  }}
}});
{ACT_JS}
</script></body></html>"""


def build_shot_html(shot_page: Dict[str, Any]) -> str:
    """Render a single shot's `page` dictionary into an HTML string."""
    tp = shot_page.get("type", "concept")
    if tp == "app":
        return _page_app(shot_page)
    return _page_concept(shot_page)


def compile_spec_to_pages(spec_path: Path | str, out_dir: Path | str) -> Dict[str, Any]:
    """
    Compile all `shots` inside a JSON video spec (`B01..B09.json`) into standalone HTML files
    under `out_dir/<video_id>/<shot_id>.html`.
    """
    spath = Path(spec_path).resolve()
    spec = json.loads(spath.read_text(encoding="utf-8"))
    vid = spec.get("video_id") or spath.stem
    vdir = Path(out_dir).resolve() / vid
    vdir.mkdir(parents=True, exist_ok=True)

    generated: List[str] = []
    for shot in spec.get("shots", []):
        if "page" not in shot:
            continue
        sid = shot.get("id", f"shot_{len(generated) + 1}")
        html_str = build_shot_html(shot["page"])
        out_file = vdir / f"{sid}.html"
        out_file.write_text(html_str, encoding="utf-8")
        generated.append(str(out_file))

    return {
        "video_id": vid,
        "spec_path": str(spath),
        "pages_dir": str(vdir),
        "pages_compiled": len(generated),
        "files": generated,
    }
