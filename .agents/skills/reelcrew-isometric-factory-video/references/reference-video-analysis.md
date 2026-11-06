# Reference video: "AI powered Decision Factory" (TextQL)

Source: https://x.com/TheEthanDing/status/2104327286296019181. The post has one sentence ("AI powered Decision Factory —
coming soon to your enterprise") and a 29-second video. Fetch it again with
`reelcrew fetch <link> --want text,video --out-dir $P/ref`, measure it with `reelcrew inspect $P/ref/<video> --out-dir $P/ref/inspect`.

## Measurements
| Property | Value |
|---|---|
| Size | 2408×1336 (≈1.80:1; the skill delivers 1920×1080) |
| Length / real fps | 29.09 s / ≈54 fps VFR (a screen recording) |
| Sound | none |
| Cuts | 0: one continuous shot, fixed camera |
| Motion cycle | the boxes move in lockstep, **≈1.70–1.75 s** per move; each move ~0.5–0.7 s, then a stop while the stations "stamp" |
| Background | `#f4f4f4` (61 % of pixels), cards/header `#fcfcfc` |
| The one accent | green `#0c7c4c`–`#147c4f`, dark green `#124b31`; mint zone `#e0ece4` |
| Strokes | ~`#2b2b2b`, about 1 px (at 1920) |

## Visual grammar
- **True 30° isometric**: x and y edges at ±30°, z vertical. White top faces, light grey sides (greyer on +X), thin
  black outlines. A faint iso grid over the whole page.
- **Header**: the product name in bold black, then a grey breadcrumb ("Ontology System  Health Insurance · Data ·
  Logic · Action · Security"). On the right: an upper-case mono status line (green dot) and a small button.
- **Left column**:
  - a mono label `[ DECISION PIPELINE ]`, a large title, a list of 6 numbered steps with line icons;
  - a `[ LIVE DECISION ]` card with black corner brackets, a green code on the right, the current question, a
    step-by-step log (filled green square = done, green outline = running);
  - a `[ DECISION LEDGER ]`, newest first: each row has code · type, a name, 6 status cells (SIG RES DEC RUN GOV DEL),
    the destination in mono on the right.
- **The factory**:
  - data-source pillars (SAP ERP, Cotiviti, Snowflake, Epic) piped in grey to a raised mint plate;
  - a diagonal belt going down-right through gantries (2 posts + a beam, the beam turns green when it stamps);
  - station labels are mono tags (`02 RESOLVE`); a transparent mint zone with a dashed wireframe and text on the floor
    ("Sandcastle", "3 ACTIVE RUNS").
- **The ontology desk** (behind, to the right): a gridded plate, a building in the middle, round nodes with icons,
  joined by right-angled green circuit traces. The active node has a thick ring and a green tag ("MEMBER", "CLAIM",
  "PROVIDER"). A dotted green line runs from the station to that node.
- **The DELIVER plate**: 3 stacks of layered discs (green top layer) with tags "ANSWERS · 11", "DATA APPS · 5",
  "ACTIONS · 16". A box dropping onto a stack raises its count.
- **Footer**: "SHEET 05 / HEALTH INSURANCE / DECISION PIPELINE" in mono, the brand logo bottom left.

## Motion grammar
- All boxes move **together** one station, then stop. During the stop: the gantry stamps (green beam), the box top
  turns green, the lookup line reaches the desk, a node lights, the ledger fills a cell, a new row slides in on top.
- The camera never moves. The sense of "busy" comes from many small updates happening in step.

## How it maps onto a topic (the worked example)
| Reference | Worked example (Jev) |
|---|---|
| 6 stations Signal → Deliver | Ticket → State → Route → Dispatch → Review → Deliver |
| SAP/Epic… data pillars | Chat / Email / Zalo / Hotline channels |
| Ontology desk + building | Router desk: LLM tower (act 1) → the dark Jev gateway block (act 2) |
| "MEMBER"… nodes | Agent nodes: Sales / Support / Complaint / Human desk / Triage LLM / Registry |
| Answers/Data apps/Actions stacks | Support / Sales / Complaint / Human desk stacks + an Outcome log block |
| None | Muted red `#b8452e` for faults (the reference has no faults) |
| TextQL logo | **Not used**: only the topic's name (no one else's brand) |
