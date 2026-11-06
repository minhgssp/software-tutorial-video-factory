# Style guide: the isometric factory

This is the look the worked example was approved in. To stay true to the reference video, add **no** colours, no
camera moves and no glow.

## 1. Identity
| Element | Value |
|---|---|
| Page background | `#f4f4f4` + an iso grid `#e6e6e6` 0.8 px (every 2 units) |
| Cards, header | `#fcfcfc`, border `#e3e3e3` / `#dcdcdc` |
| Block strokes | `#2b2b2b` 1.1 px; top face `#fdfdfd`, +Y face `#f0f0f0`, +X face `#e2e2e2` |
| Accent | green `#0c7c4c`, dark green `#124b31`, mint `#e0ece4` / `#cfe2d6` |
| Warning | muted red `#b8452e`, only for a fault or a risk (overload, wrong delivery, refund, stale) |
| "Dark" block | `#1d2622` / `#26332d`, for the part that arrives in act 2 (e.g. the Jev gateway) |
| Type | Inter 400/500/600 (titles, questions, captions); JetBrains Mono upper case, letter-spaced 0.14–0.16em (labels, tags, ledger) |

Labels are always `[ IN BRACKETS ]`. Small upper-case tags have a thin border. An "active" tag is green with white text.

## 2. Layout at 1920×1080 (measured on the reference, ×0.8)
- Header: `left 22, top 10, 1876×72`. Title 34 px, grey breadcrumb 34 px. A mono ticker 10.5 px on the right.
- Left column `x 58–480`:
  - act label at y 112, a 31 px title at y 130, the 6 steps at y 200–350;
  - the LIVE card at `58,392`, `372×280`;
  - the ledger at y 698, 5 rows × 50 px, status cells from x = 532;
  - brand at y 1022, the SHEET footer on the right at y 1040.
- The factory (S = 20 px/unit, origin `500,318`):
  - the belt from (500,318) to about (1345,830);
  - the router desk at about x 1110–1670, y 230–570;
  - the DELIVER plate at about x 1270–1830, y 660–1000.
- **The caption card is fixed at the top right** `1346,98`, 530 wide, 25 px type. That area is empty in the reference.
  Captions floating next to objects end up over the blocks, so they are not used.
- Free spot for the router's chip: `(1090, 300)`, between the sources and the desk.
- The frame is 16:9 only. A 9:16 version needs a new layout, never a squeeze: ask the user first.

## 3. Rhythm
- The belt moves **on a bar line** of the music (`beats.py`), cubic ease-in-out, 0.5 s per move (fast act) or 0.9 s
  (slow act, it feels "heavy").
- During a dwell:
  - +0.15 s: the gantry stamps (green beam);
  - +0.2 s: the box's top turns green, the chip fades in over 0.25 s;
  - +0.35 s: the lookup line reaches the router desk;
  - once chosen: the circuit trace lights and the node gets its tag.
- Act 1 slow (a move every 2 bars) and act 2 fast (every bar): the belt's speed itself **tells** the before/after story.
- Each caption lives within 1–2 dwells, fading in and out over 0.3 s. Between the acts (~1 s) no caption; the centre
  block morphs over 1.3 s.
- Put act 1's peak event on the bar nearest to the music's biggest lift (`beats.py` prints it).

## 4. Story shape (~70 s)
0–4 s: the whole scene fades in, the topic title in the left column. Act 1 (5 captions): the problem, the slow
mechanism, it adds up, overload, wrong without knowing.
Act change: the centre block morphs, the queue clears, the title changes, the belt runs twice as fast.
Act 2 (7–8 captions): the new mechanism, parallel + probabilities, rules in code, the exceptions (stale, borderline,
risky), the correction loop, the closing line.
The last 3–5 s: the factory runs on, no caption.

## 5. Caption → picture (patterns from the worked example)
| What the caption says | Picture |
|---|---|
| "has to ask the LLM" | a dotted line from ROUTE to the LLM tower, a chip `LLM ▸ {"agent": "sa…` typing token by token |
| "generates token by token" | the token chip and a `tok · s` count rising |
| "the waits add up" | red chips `+0.4s +2.6s…` appearing one by one on each gantry, then a `Σ wait` chip |
| "34 calls at once" | a red `N in flight` tag counting up, packets running faster, a queue piling up at station 01, the ticker turning red |
| "only a label, delivered wrong" | a chip `label "sales" p = ?`, a red box on the Sales stack, a chip `complaint → sales ✗`, ledger `✗` |
| "the model only picks" | the dark block, the answer there at once (no typing) |
| "3 questions in parallel + probabilities" | a chip with 3 bars and a dashed threshold mark, the ms figure |
| "compared with a threshold" | a chip at DISPATCH `0.94 ≥ 0.80 → sales` |
| "old state rebuilt" | the Chat source lit, the box at DISPATCH lifting, a red packet flying along a dashed arc back to STATE, then green again |
| "borderline / timeout → triage" | a 0.55 bar under the mark or `timeout > 500 ms`, the Triage LLM node lit |
| "a refund needs a human" | the REVIEW posts turning red, a chip `action: refund → human desk`, the box dropping onto the Human desk stack |
| "sent back → tighten the threshold" | a red box flying from the Sales stack to the Outcome log, a dashed loop back to the Registry, `0.80 → 0.85` |
| the closing line | 3 green chips: `Jev picks the agent`, `Code holds the rules`, `Agents do the work` |

## 6. Do and avoid
- Do:
  - illustrative data that makes business sense (everyday tickets in the video's language), and **tell the user it is
    illustrative**;
  - keep the owner's caption wording exactly.
- Avoid:
  - the reference video's logo or brand name (TextQL), or anyone else's: the brand slot shows the topic's name;
  - camera moves, zoom, cuts;
  - a third accent beyond green and muted red;
  - type smaller than 9.5 px.

## 7. Stills checklist
1. No text on top of other text: station labels, floor text, box tags, chips, stack tags.
2. The caption card covers no chip or tag (the router's chip stays below y 300).
3. Stack tags sit under the stack's front corner, not over the stack behind.
4. Ledger: newest row on top, no half-row offset during a dwell; the destination never shows before the ticket reaches
   its station.
5. The ticket flagged for an event is at the **right station** in that caption's dwell (formula in `engine-api.md`).
6. Just before and after the act change: title, SHEET footer, Act button, ticker and desk edge text have all changed.

## 8. Bugs already met (do not repeat)
- Ledger rows half a row off during a dwell: `newest = ceil(u)`, `yy = (r − (newest − u))·rowH` (fixed in the engine).
- A chip on the router desk hidden by the caption card: anchor the router's chip in the free spot `(1090, 300)`.
- The lit trace to the chosen node drawn over the centre block: the engine draws it **along the circuit path**, before
  the block.
- The ledger showing the destination before the ticket reached REVIEW: show `human desk` only when `p ≥ 4.5`.
- A station tag overlapping the mint zone's floor text: floor text at `zone.y1 + 2.4`, just under label 02.
- Whisper-style transcription invents sentences on music-only audio: read a topic video's captions from its frames,
  never from a transcript.
