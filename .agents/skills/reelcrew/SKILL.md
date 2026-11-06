---
name: reelcrew
description: Reelcrew itself, the film crew for your agent: Claude Code or Codex on a Mac, a Windows PC or a Linux computer (Ubuntu, Debian, Fedora, RHEL, WSL2), or a Cloud Agent's machine (ChatGPT Work, Claude Code on the web). Use when the user mentions Reelcrew (or "rc"), asks what videos they can make or which skill fits a video idea, wants Reelcrew set up or checked (voices, transcription, images, music, sound effects, API keys, license, "cài đặt", "thiết lập", "kiểm tra máy"), reports a reelcrew error, wants to update, roll back, sign in or move to another machine, or needs a one-off video job without a full video skill (cut a clip, transcribe, add subtitles, measure a song's beat, mix, make a vertical copy, export for TikTok/YouTube), or asks about Reelcrew Studio (reviewing a video, pinning comments, the app icon, "cài app", the Claude plugin), or wants to keep an approved video's style as their own skill ("lưu thành skill", "lần sau làm giống vậy"). Routes to the right video skill or command.
---

# Reelcrew

Reelcrew is a command-line crew (`reelcrew`, short `rc`) that does the hands-on work of video: voice, music, sound
effects, images, subtitles, rendering and export, all on this machine. You (the agent) direct; Reelcrew's video skills
hold the recipes. Every command takes `--json` (read that, not the text) and `--help` (exact flags: check it before
using a flag you have not used in this session). Errors come as `{ "error": { "code", "message", "hint" } }`: act on the
hint.

## 1. Pick the skill for a video idea

Each video skill's instructions are printed by `reelcrew skill <name>` in any agent host (Claude Code, Codex, ChatGPT Work, …);
Claude Code and Codex also have them installed as `reelcrew-<name>` (in Codex: `$reelcrew-<name>`). `reelcrew ls` shows which ones this machine has.

| The user wants | Skill | In |
|---|---|---|
| A vertical "hot news" photo short (Reels, TikTok, Shorts) from a news topic | `news-photo-short` | Starter, Pro |
| A ~30 s cinematic science explainer | `cinematic-explainer-short` | Starter, Pro |
| Motion effects over a talking video: cards, text behind the speaker, glitches, split screen | `motion-fx-kit` | Starter, Pro |
| A lecture or talk turned into a hand-drawn animated lesson | `animated-lesson-video` | Starter, Pro |
| A research paper (PDF, arXiv) walked through section by section | `paper-walkthrough-video` | Starter, Pro |
| A research paper explained in the 3Blue1Brown / Manim look (formulas, one spine) | `paper-3b1b-video` | Starter, Pro |
| A paper-collage (Vox style) explainer from an article or brief | `vox-collage-video` | Pro |
| An editorial engraved-plate film on a philosophy, history or ideas topic (sepia plates, stamps, karaoke subtitles) | `engraved-plate-video` | Starter, Pro |
| An 8–10 min archival documentary on a history or technology topic | `archival-documentary-video` | Pro |
| A property video with a location map (routes, nearby places) | `property-location-video` | Pro |
| A ~70 s isometric "decision factory" explainer of a system, pipeline or process (belt, stations, before/after acts) | `isometric-factory-video` | Pro |
| A long talking-head recording cut into a highlight short (motion-fx design, or the paper collage with the speaker as a sticker); a faceless collage video from a script and a TTS voice | `talking-head-highlight-short` | Pro |
| A 60–90 s vertical explainer for one niche (travel, law, trading, English, history, office, AI for business, personal finance, cooking…) with a mascot and niche widgets | `niche-explainer-short` | Pro |
| A beat-synced motion-graphics video: a product launch (keynote, comic, notebook), one concept on a diagram, one idea as a morphing dot, a science paradox, a product from the seller's photos, a website launch, a product demo recording, or a person's site as a music-only showreel | `beat-motion-video` | Pro |
| A short square looping meme (about 8 s) with original stick-figure characters drawn in SVG, no AI video | `meme-loop-video` | Pro |
| A brand's 3D mascot (rebuilt from the customer's pictures or their GLB file): a character sheet, a promo or a two-mascot dialogue in 16:9 or 9:16, a seamless landing-page hero loop with its page | `mascot-3d-video` | Pro |
| A 15–80 s vertical English listening lesson for Vietnamese learners: a story read line by line, a vocabulary passage, or a guess-the-word quiz (free Kokoro and VieNeu voices) | `english-listen-video` | Pro |
| A whiteboard drawing video (16:9 or 9:16) from subtitles, a voice or a script: a hand draws each scene's line art region by region in the story's order, then colours it, with the voice, music and a pencil sound | `whiteboard-video` | Pro |
| A technical idea explained by a real machine in crafted isometric SVG (WebGL and 3D optional), as a narrated or music-only video (16:9 or 9:16), plus its interactive page and printable A4/Letter sheets; searches the community gallery first | `machine-explainer-video` | Pro |

- Show what a skill makes: `reelcrew examples <skill>` lists its sample videos (links, what each shows); `--out-dir <dir>`
  downloads style frames to look at. The same samples are on the home page and in `/examples.md` of the site.
- A skill the user does not have: say which package has it and where to buy it (the shop at the `server` address of
  `reelcrew license --json`, path `/shop`); never try to fetch it another way. After buying: `reelcrew login`.
- No skill fits: do the job with the commands in section 4, and say so.

## 2. Set up or check this machine

Reelcrew has no free tier: every tool command needs this machine signed in to an account that owns a pack
(Starter or Pro). Otherwise commands fail with `license.not_activated` (run `reelcrew login` and wait for the user to
confirm in the browser) or `license.no_pack` (the account has bought nothing yet: give the shop link from the hint).
Open without an account: `login`, `whoami`, `license`, `setup`, `doctor`, `update`, `help`.

**Windows shell:** in Claude Code on Windows use the Bash tool (Git Bash) when Claude Code has it; Git Bash is
recommended, not required (`reelcrew doctor` shows it as optional: `winget install Git.Git`). Without Git Bash, Claude
Code uses PowerShell; Codex uses PowerShell: `reelcrew` works there too (the installer puts `reelcrew.cmd` on the user PATH); set
variables as `$NAME = "<value>"`, run one command per call, and use `Remove-Item` / `Copy-Item -Recurse` / `New-Item -ItemType Directory -Force` for
`rm` / `cp -R` / `mkdir -p`.

**`reelcrew: command not found`** (zsh: `command not found: reelcrew`)**:** when `~/.reelcrew/bin/reelcrew` exists, reelcrew is installed and only this shell
has not read its PATH line (on Linux an agent's shell is neither a login nor an interactive one). Run
`~/.reelcrew/bin/reelcrew` by its full path for that command and every reelcrew command after it (Python scripts:
`~/.reelcrew/bin/reelcrew python <script>`), and tell the user once to open a new terminal and restart Claude Code or
Codex. Do not reinstall, and do not rely on `export PATH`: each command runs in a new shell. Only when that file is
missing is reelcrew not installed: install it with the line from the user's account page. `reelcrew doctor` on Linux
shows ○ under Agent host when a login shell does not find `reelcrew`, with the fix.

**Codex on Linux:** Codex runs each command in its sandbox (bubblewrap): by default no network, and writes only in
the folder Codex was started in and `/tmp`. reelcrew needs the network (sign-in, downloads, paid engines), writes
`~/.reelcrew` and starts headless Chrome. Ask the user to start Codex in the project folder (a git folder, or one
Codex may write) and to approve reelcrew's commands when Codex asks to run them outside the sandbox. Or the user adds
these two lines to `~/.codex/config.toml` themselves (never change Codex's config yourself):
`[sandbox_workspace_write]` then `network_access = true` and `writable_roots = ["<home>/.reelcrew"]`.
`cli.codex_sandbox_write_blocked` and `cli.codex_sandbox_network_blocked` say which one is missing: ask for it, never work
around it.

**Linux system packages:** `reelcrew doctor` prints each system step as this distribution's own command (`apt-get` on
Ubuntu and Debian, `dnf` on Fedora, RHEL, Rocky, Alma and Amazon Linux 2023), with `sudo` for a user. Show the user
the command and ask them to run it in their own terminal (it needs their password); as root on Ubuntu 20.04, 22.04,
24.04 or Debian 12, 13, `reelcrew chrome install` and `reelcrew setup` install Chrome's libraries and fonts themselves.
Without a `Text font` (bare images ship none) pages render with no text: it is a Render step like the others. On
Debian 11 doctor says it reached its end of life (`endOfLife` in `--json`): tell the user reelcrew supports Debian 12 and 13, and
that the printed `apt-get` commands fail there. `chrome.sandbox_unavailable`
(a container, or Ubuntu 23.10+ as a user): the user adds `export REELCREW_CHROME_NO_SANDBOX=1` to the two files the
error's hint names (the login file and `~/.bashrc` or `~/.zshrc`), opens a new terminal and starts the agent again
from it. To show the user a file on Linux, see section 9. When `reelcrew render` stops with `render.chrome_start_failed` naming Codex's sandbox, ask to run it
outside the sandbox; never replace the render with an ffmpeg slideshow.

1. `reelcrew setup --json --no-input`: checks the sign-in first (its `next` says `login` or `buy_pack` when that is
   missing, and nothing else is installed); then downloads the account's packs, installs the skills into the folder of each agent
   host found (Claude Code: `~/.claude/skills`; Codex: `~/.agents/skills`; an agent in another host reads them with
   `reelcrew skill <name>`), gets ffmpeg and yt-dlp, and returns
   `machine.capabilities` (each `ready` or not, with the command that fixes it) and `next` steps. `reelcrew doctor`
   shows the same machine check alone.
2. For each missing capability, explain the choices in one line each (free or paid, quality) and **ask the user**.
   Never pick a paid service for them. The usual choices:
   - Vietnamese voice: `vieneu` (free, offline, needs VieNeu-TTS installed), `elevenlabs` (most natural, paid),
     `soniox` (cheaper, paid), `openrouter` (one OpenRouter key for many makers' voices and for images; Microsoft's
     Vietnamese voices by default, paid per character). Set up with `reelcrew tts setup <adapter>` (`--default` makes
     it the engine skills use); list voices with `reelcrew tts voices`.
   - Transcription: `whisper` (free, no key, on this machine's CPU: the setup installs it and downloads a 1.6 GB
     model once; about a quarter of the audio's length on 4 CPUs; good Vietnamese, names can come out wrong),
     `elevenlabs` (the same key as the voice, paid) or `soniox` (paid per minute): `reelcrew transcribe setup <adapter>`. **One key per purpose**: a user who has an ElevenLabs key already uses it
     for voice, music, sound effects and transcription; never ask for a second key for the same job. Without a
     transcriber a video can still be finished for free: each skill's "No transcriber set up" section names the
     options (`--takes 1`, `--no-words`, `--no-stt` …) and what is lost (the speech checks, exact word timing).
   - Images: `codex` (uses the user's ChatGPT plan through the Codex CLI, no key), `gemini` (paid) or `openrouter`
     (the same OpenRouter key as its voices; many makers' models, Gemini flash by default, about $0.07 an image,
     the cost of each image in `--json`): `reelcrew image setup <adapter>`; another model for one image with
     `--model <id>`.
   - Music and sound effects: `elevenlabs` (paid): `reelcrew music setup elevenlabs`, `reelcrew sfx setup elevenlabs`.
     Free default sounds exist too: `reelcrew sfx defaults --search <words>`.
   - Person cutout and motion design: `reelcrew hyperframes install` (free, one download).
3. **API keys never go through the chat.** Ask the user to open their own terminal (Terminal on a Mac or Linux, PowerShell on
   Windows) and run `reelcrew keys set <name>` (typed hidden), then continue once they say it is done. A cloud sandbox
   has no terminal of the user's: section 10.
   `reelcrew keys` lists what is set; `reelcrew keys test` checks them against the providers.
4. A person at a terminal can also run `reelcrew setup` there: it asks these questions itself.
5. In Claude Code or Codex, new skills appear after a restart: remind the user.

## 3. Account, updates, machines

- Sign in (the account's packs download right after): `reelcrew login` opens the browser for confirmation; wait for the user.
- Which account and packs: `reelcrew whoami`. Details and the update window: `reelcrew license`.
- Update now: `reelcrew update`; undo: `reelcrew update --rollback`; automatic updates: `reelcrew update --auto on|notify|off`.
- Another machine: `reelcrew license deactivate` here frees the seat; sign in on the new one. Seats can also be
  freed on the account page.
- Hide a skill the user does not use (the agent stops seeing it, it stays off after setup and updates):
  `reelcrew uninstall <skill>`; turn it back on: `reelcrew install <skill>`. `reelcrew ls` shows which are off.
- Remove Reelcrew: `reelcrew self uninstall` shows what it removes (the program, its skills in Claude Code and
  Codex, the studio's Claude plugin); `--yes` to do it (`--all` also removes keys, license, library and packs). The user's own
  skills stay (unless `--all`). No sign-in is needed; an older CLI that asks for one: `reelcrew update` first. Moving to
  another computer instead: `reelcrew license deactivate` first frees this machine's seat. Then the user restarts Claude Code or Codex.
  When `reelcrew` no longer runs at all, remove it by hand (ask before deleting):
  - macOS: `rm -rf ~/.reelcrew`, and the line with `.reelcrew/bin` in `~/.zshrc` (or `~/.bash_profile`).
  - Linux: `rm -rf ~/.reelcrew`; the line with `.reelcrew/bin` (and the `# reelcrew` line above it) in `~/.profile` (or
    `~/.bash_profile`), `~/.bashrc`, `~/.zprofile` and `~/.zshrc`; the links `reelcrew` and `rc` in `~/.local/bin`
    when they point to `~/.reelcrew/bin/reelcrew`.
  - Windows (PowerShell): `Remove-Item -Recurse -Force $env:USERPROFILE\.reelcrew`, and `%USERPROFILE%\.reelcrew\bin`
    from the user's Path.
  - All: the `reelcrew-*` and `reelcrew` folders in `~/.claude/skills`; `claude plugin uninstall reelcrew@reelcrew-local`
    and `claude plugin marketplace remove reelcrew-local` when the Studio plugin was installed.

## 4. One-off jobs without a video skill

| Job | Command |
|---|---|
| Bring in a link (YouTube, X, web page, PDF): text, transcript, video, audio, page images | `reelcrew fetch <url>` |
| Facts about a media file: streams, loudness, silences, cuts, contact sheet | `reelcrew inspect <file>` |
| Speech to text with word timing; check audio against a script | `reelcrew transcribe <file>` |
| A voice-over from text | `reelcrew tts say "<text>" --out vo.wav` |
| Music from a prompt; the beat, bars and drop of any song; do the cuts land on the beat | `reelcrew music make "<prompt>"`, `reelcrew music analyze <file> [--events ev.json]` |
| A sound effect: free sets, CC0 recordings, or made for the moment (paid) | `reelcrew sfx defaults --type <type> --sheet sheet.png`, `reelcrew sfx find "<words>"` + `reelcrew sfx add <url> --type <type>`, `reelcrew sfx make "<prompt>"` |
| An image from a prompt | `reelcrew image create "<prompt>"` |
| Archival photos with licenses; stock photos and clips (the user's free Pixabay key) | `reelcrew commons search "<words>"`, `reelcrew pixabay search "<words>" [--kind video]` |
| Cut, join, overlay, subtitles, vertical reframe, into one video | `reelcrew compose <timeline.json>` |
| Voice + music + sound effects into one track | `reelcrew mix <mix.json> --out mix.wav` |
| An HTML/JS page rendered to video or stills | `reelcrew render <page.html>` |
| The finished file: picture + mix, loudness for the platform, contact sheet; under a size limit with `--max-mb 30` | `reelcrew deliver <video.mp4> --audio mix.wav --out final.mp4` |
| Is it ready to deliver: black or frozen picture, single bad frames (flashes, with their frame number), loudness, silences, sound length, size, speech, 9:16 safe zones per app, lone last words and Vietnamese marks touching the line above (also at the busiest frame), footage that stutters, text on the face | `reelcrew check <video> [--page page.html [--platform all]] [--motion] [--face x,y,w,h] [--clips 2-6@clip.mp4]` |
| Cut the person out of a video | `reelcrew matte <video> --out <file>` |
| Maps and routes (OpenStreetMap) | `reelcrew osm …` |
| Generated sounds, music and images kept for reuse | `reelcrew library` |

Before handing any video over, run `reelcrew check <video>` (add `--size` / `--fps` for the platform; for a 9:16 video
made from an HTML page add `--page <page.html>`, which finds text under the apps' buttons and captions) and fix what it
reports. Check `reelcrew <command> --help` for the flags before the first use. Paid calls (voice, music, sound effects,
images, transcription) spend the user's credits: say so before a large batch.

## 5. No skill fits: build the video yourself

Nothing limits you to the skills: Reelcrew's commands make any video. For a look or format no skill has:

1. Read `$HOME/.reelcrew/app/current/skill-packs/video/skills/reelcrew/references/directing.md` (craft: brief, sound, rhythm, camera, checks) and
   `$HOME/.reelcrew/app/current/skill-packs/video/skills/reelcrew/references/render-page.md` (how a page becomes video).
2. Copy `$HOME/.reelcrew/app/current/skill-packs/video/skills/reelcrew/templates/page/` into the project as the starting page; draw the look in it.
3. Voice (`tts`), music (`music make`, then `music analyze` for the beat), sound effects (`sfx`), images (`image`,
   `commons`), footage (`fetch`, `compose`) as the idea needs; one timeline in the page drives them all.
4. `render` stills first, then the video; `render --data EV` for the events; `music analyze --events` to check the
   cuts land on the beat; `mix`; `deliver`; `check`.

To edit existing footage (cut, join, reframe, subtitles, overlays), `reelcrew compose` takes a timeline JSON
(`size`, `fps`, `clips`, `overlays`, `audio`, `subtitles`); `transcribe` gives word timing to cut on words. A clip is
`{ "src", "in", "out", "fit": "crop|contain|stretch", "speed" }`, an image `{ "src", "duration" }` or a colour card
`{ "color": "#rrggbb", "duration" }`, and any clip can add `"crop": [x, y, width, height]` (source pixels: cut off black
bars, a logo, burned-in lyrics; `reelcrew inspect` finds letterbox bars), `"sharpen": 0.5` (0–2, after an upscale) and
`"hold": 1.5` (seconds the last frame stays, sound padded with silence).

## 6. When something fails

- Read the error `code` and `hint` from `--json`; they name one cause and the fix. Do not guess around them.
- A capability shows ✗: `reelcrew doctor` names what is missing and the command for it.
- `*_key_missing` / `*_key_rejected`: the user sets or replaces the key in their terminal (`reelcrew keys set <name>`).
- `*_not_configured`: that service has no provider yet: section 2.
- `license.not_activated`: `reelcrew login`. `license.no_pack`: the account must buy a pack first.
- A skill is missing or "not licensed": `reelcrew whoami`; if the pack is there, `reelcrew license sync`.
- On Windows, run Python scripts with `reelcrew python <script.py>`, never `python3` or `python`.
- `reelcrew: command not found`, `cli.codex_sandbox_write_blocked`, `cli.codex_sandbox_network_blocked`: section 2.
- Still stuck, or reelcrew did something wrong: send a bug report (below).

### Sending a bug report to Reelcrew support

reelcrew keeps a log of its own failures (`~/.reelcrew/logs/errors.jsonl`). A report bundles its latest lines with the
machine facts support needs and a note; it holds no account, key or file of the user's. Nothing leaves the machine
until the user says yes.

1. Write the note in the user's own words, in three parts: what they were doing (the skill and the step), what they
   expected, and what happened and what was already tried. Keep it under 2000 characters; leave out names, links and
   anything private.
2. Make the report: `reelcrew report --note '<the note>'`. Use single quotes, never double quotes: inside double
   quotes the shell runs backticks and `$( )` as commands. Write any apostrophe in the note as ’. Nothing is sent; it
   prints the file it wrote.
3. Open that file and read it. Tell the user in one short paragraph what it holds: the errors (their codes and
   messages), the machine facts (app version, OS, what `doctor` found, the installed packs) and the note; that it
   holds no account, key or file of theirs; name any file name or link an error message or the note still shows; and
   give the file's path so they can open it too.
4. Ask once: send it to Reelcrew support, or not. Mention that they can add an email for an answer
   (`--contact <email>`); add it only if they give one. Anything but a clear yes means do not send.
5. Only after a yes: `reelcrew report --send "<the path it printed>"` (with `--contact <email>` if they gave one).
   Give the user the `report_id` it prints. If it fails:
   - `report.send_failed`, `report.not_activated`: tell the user where the file is so they can send it to
     support@reelcrew.io themselves (or run `reelcrew login` first for `not_activated`).
   - `report.rate_limited`: say so and try again only when the user asks, later.
   - `report.pii_found` names a field: take that text out of the file, tell the user what you removed, and send only
     after a new yes. `report.file_malformed` names an edited field: make the report again (step 2).
   - `report.too_large`: make it again with fewer errors (`--last 3`); `report.contact_malformed`: ask for the email
     again; `report.already_sent`: it went already; give the user the id under `sent` in the file.
   - `report.server_refused`: send nothing more; give the user the file for a manual send.

## 7. Rules for every video (whatever the skill or the idea)

These come from real runs where the same mistakes cost a review round each. They hold for any skill, any look and
any format; a skill's own rules add to them.

- **Narration for one viewer.** A narrated explainer is written for one person outside the field (`audience`: who,
  knows, wants, worry), without AI-slop phrases, counted openers or sentences over 25 words; niche-explainer-short,
  beat-motion-video and property-location-video's route mode (`review-route.py`) check it, english-listen-video checks
  only the AI-slop phrases (each skill's `references/writing-voice.md`). A word used in its plain sense ("hành trình"
  for a route) is not refused for good: a niche or look turns that named rule off (`review.slopOff`), or the user lets
  one sentence keep it with a reason (`writingAllow`); never drop `"writingRules"` to get past one line. With the
  review gates on, gate A of a niche explainer, or of a beat-motion story or a narrated route with `audience`, also
  needs the lay retell: a reviewer who is not the builder (a subagent) plays that viewer and fills
  `review/plain-retell.json` from the form the skill's content review writes.
- **Sensitive info.** Before a photo, a clip or a screen recording of the user's is shown, look at it for what must
  not be published: QR and payment codes, bank details, order numbers, a customer's name, phone, e-mail or address,
  licence plates, ID papers, other people's chats, autofill lists, account menus. Blur only that region, only while it
  shows, in the file (`reelcrew redact scan`, regions in `data/redaction.json`, `redact apply`, `redact verify`, then
  build from the `-redacted` copy); a file looked at and found clean is recorded with `reelcrew redact mark-clean`.
  The one exception is the fast cut's own long recording: `"redact_source": true` blurs its regions inside the render.
  Some builds stop until a file is cleared (their `references/craft.md`): talking-head-highlight-short's fast cut for
  the photos and clips of its `broll` and the pictures of its `image` cards, its project video and edited short for
  the `assets/` files their edit names, property-location-video's route mode for every scene photo of the user's, and
  the recording only with `redact_source`. Nothing checks a recording without `redact_source`: look at it yourself.
- **Frame size.** A page declares its size (`window.SIZE = "1080x1920"`, or `TIMELINE.size`), and `reelcrew render`
  uses it for stills, video and thumbnail when `--size` is not given. Make every new page declare it. Look at stills at
  the delivery size before the full render: a vertical video checked in 16:9 stills proves nothing.
- **Vietnamese letters.** Use a font that has every Vietnamese letter at every weight you draw, kept next to the page
  (the skills' templates bundle Be Vietnam Pro in `fonts/`). Never rely on a system font: one missing a letter (Ố, Ổ,
  Ữ, Ặ…) at a heavy weight falls back to another font for that letter alone, and the word looks broken. Canvas text
  does not wait for fonts: load every weight (`document.fonts.load`) before `window.READY`. After any font change,
  read a still with those letters.
- **Text that has to fit** (titles, thumbnails, labels, lower thirds): measure it in the page and make it smaller
  until it fits; do not count characters. At most 3 short lines; rewrite a longer idea instead of squeezing it.
- **Safe zones (9:16).** The apps cover the top ~150 px, the bottom ~480 px, the left ~60 px and the right ~140 px.
  Keep text, faces, handles and watermarks out of them. `reelcrew check <video> --page <page.html>` finds text there:
  run it before every delivery (`--platform tiktok|instagram-reels|youtube-shorts|universal|all` for the apps the video
  goes to; `reelcrew check --platforms` lists their zones). The same run finds a lone last word, a very short last line
  and Vietnamese marks touching the line above, also at the busiest frame of each scene. Text that is decoration, not
  meant to be read (a giant ghost word drifting behind a card), carries `data-layout-decor` on its element and the check
  skips it (and counts it); readable text never carries the mark. For a speaker or media clips
  add `--motion` (`--face x,y,w,h` when `matte heads` is not set up; `--speaker start-end,…` for the times the speaker is on screen, so cards are not judged) and `--clips start-end@source.mp4#x,y,w,h` (the clip's box): footage that
  stutters while the frame still changes, and text within 40 px of the face (`--waive start-end` for a frame you
  checked by eye).
- **Paid choices first.** Before any paid generation (voice, music, sound effects, images), settle with the user the
  engine, the voice id and the model, and say what a redo costs. A voice changed after the takes are made pays twice.
- **Providers.** When a command says an engine is not set up and that engine is a paid service the user has not
  chosen (a transcriber, say), ask first and offer the free way the script names (`run this script again with …`);
  otherwise run the setup command its hint gives (the key is often there already). ElevenLabs in Vietnamese:
  `eleven_v3` (the default). With Gemini, read several lines with `tts takes --one-take` (separate calls change the
  voice between lines; the one-call reading is cut by what is heard, so it needs a transcriber). OpenRouter: any of its voice models with
  `--model <id>` on one call (`reelcrew tts voices --adapter openrouter --model <id>` for its voices); no word times,
  so captions come from transcription.
- **ffmpeg and ffprobe.** In a command you write yourself, use the paths `reelcrew ffmpeg path --json` gives (`bin`,
  `ffprobe`), never the ones on PATH: another app's copy may be a different version or lack filters.
- **Full renders** take minutes: start `reelcrew render … --out <file>` in the background from the first run and
  follow `.<file name>.rendering.json` next to the output (`done`, `total`, `eta_s`; gone when it ends). Look at the
  stills the skill names first.
- **Asking the user.** A question with choices gives 2–4 options; for a free answer add one like "Có — gõ ở ô Other".
- **Shell.** One item per command, or a loop the shell really splits: zsh does not split an unquoted `$var`
  (`set -- $p` gives one word). On Windows, see section 2.
- **Sound cues.** You cannot hear: choose sounds by their numbers and their picture, and check them by machine.
  - A sound goes only on a real action on screen; give each cue its `visual` (cut, move, land, appear) and place it
    by its peak (`"align": "peak"`): `reelcrew check --cues` judges a cue with a `visual` by where its peak lands.
  - At most one hero moment about every 4 s: a layered hit and boom (`"sound": "<hit>+<boom>"`, `"weight": "hero"`)
    with a riser or reverse peaking on it. A sound that must sit over the music and voice gets `"gain": "in_band"`
    (`reelcrew mix --help`).
  - One sonic family per film (the same set, the same kind of hit); vary a repeated sound (another file or level).
  - Never make a hit, click or whoosh from ffmpeg tones. Look first in the free sets (`reelcrew sfx defaults --type
    <type> --tone dark --sheet sheet.png`, then open the sheet), then CC0 recordings (`reelcrew sfx find "<material
    action>"`, `reelcrew sfx add <url> --type <type> --credit "…"`); a sound made for the moment (`reelcrew sfx make`)
    is paid: ask first.
  - Before delivery run `reelcrew check <final.mp4> --cues mix.json` and fix what it finds; at most two fix rounds.
  - In the report, list five timecodes for the user to check by ear, and never call the sound good: you did not hear it.
- **When the user reports a problem in a video**, find its cause in a still or a measurement first, then fix it where
  it comes from (the page, the template, the timeline) so the next render does not bring it back.
- **Errors** name one cause and their hint names the fix: act on the hint, do not work around it. A hint that would
  start a paid service is the user's choice: ask, and say what the free way loses.

## 8. Save a video as the user's own skill

When the user approved a video and wants more like it ("lưu thành skill", "lần sau làm giống vậy"), or after a video
that took real back-and-forth, offer to keep it as their own skill. Never save one without their OK.

1. **Name it with the user**: lowercase letters, digits and dashes, not starting with `reelcrew-`, not a name
   `reelcrew ls` already shows.
2. **Draft it in `<project>/skill/`**, shaped like any skill:
   - Keep what the next video reuses: the page or template (with this video's topic taken out), its engine, fonts,
     scripts, and the choices made (format and size, voice engine + voice id + model, music and sound style,
     watermark or handle). Paths inside the skill are written `$HOME/.reelcrew/app/current/skill-packs/video/skills/reelcrew/…`.
   - When the video came from a Reelcrew skill, build on it: the steps say "run `reelcrew skill <that skill>` and
     follow it, with these differences", and copy only the files the user's version changed. The new skill then keeps
     getting Reelcrew's fixes.
   - `reelcrew skill edit` changes a Reelcrew skill for every video and every channel. A channel's own rules belong in
     an own skill (one per channel), never in `skill edit`.
   - An own skill copies its changed files into each new project after the base init, and again on `--refresh`: keep
     them at the same paths as in that skill (`templates/video/page.js`, `niches/<niche>/video/theme.css`). For
     niche-explainer-short the one command is
     `reelcrew python $HOME/.reelcrew/packs/niche-explainer-short/current/skills/niche-explainer-short/scripts/init-project.py <project> --niche <niche> --overlay $HOME/.reelcrew/app/current/skill-packs/video/skills/reelcrew`
     (a project made earlier: add `--refresh all`). A project keeps its own copy of the files it was made with.
   - Leave out renders, footage, this topic's images and voice takes, and every key file (`keys.env`, `.env`: the
     save refuses them). An `example/` with this video's script or timeline and a still or two helps; the whole draft
     stays under 300 MB.
3. **Write `SKILL.md`**: frontmatter `name` and `description` (when to use it and what it makes, in the user's words:
   the agent picks skills by it); then what it makes; **the user's rules**, taken from their edits and pinned comments
   ("titles at most 2 lines", "no watermark", "voice Hải Đăng"); the steps as reelcrew commands; the checks before
   delivery (`reelcrew check`).
4. **Show the user** the name, the description, their rules and what is copied; wait for their approval.
5. **Save**: `reelcrew skill save <name> --from <project>` (it reads `<project>/skill/`). Claude Code and Codex list it as
   `reelcrew-<name>` after a restart (any agent reads it with `reelcrew skill <name>`); `reelcrew ls` shows it in the pack `mine`. It lives in `~/.reelcrew/my-skills/`,
   which updates never touch.
6. **Later**: after another approved video, improve it: edit the files in the folder `reelcrew skill <name>` prints,
   or save a new draft over it (`--force`). `reelcrew skill delete <name>` removes it.

## 9. Reelcrew Studio: review a video with the user

Claude Code and Claude Desktop on macOS and Windows only (Claude Desktop has no Linux build: on Linux and WSL2 review
as the last bullet says; in a cloud sandbox, as section 10 says). Reelcrew Studio is where the
user reviews a video with you: they watch a render, walk its scenes and pin comments on the frame. It shows inside
Claude Desktop (the Code tab), in its Browser pane, through the Reelcrew Claude plugin.
Suggest it after a render, or when the user wants to give feedback on a video.

- **Install the Claude plugin once** (it gives you `open_studio`, `list_review_comments`, `mark_review_comments`):
  1. Run `reelcrew studio claude-plugin`. It writes a local plugin marketplace and prints two commands.
  2. Ask the user before running them: they change the user's Claude settings.
     - `claude plugin marketplace add "<folder it printed>"`
     - `claude plugin install reelcrew@reelcrew-local`
  3. The user restarts Claude Desktop (or Claude Code) to load the plugin.
  4. To try it in one session without installing: `claude --plugin-dir "<the .zip it printed>"`.
  5. After updating Reelcrew: run `reelcrew studio claude-plugin` again, then `claude plugin marketplace update reelcrew-local` and `claude plugin update reelcrew@reelcrew-local`.
- **Then** call `open_studio` on the project after a render. The plugin's `studio` skill says how to show it, wait for
  the user's comments and mark them done. Claude Code in a terminal has no Browser pane: the studio shows in Claude
  Desktop only.
- **Regions view:** for a project with scene annotations (`video/scenes/<scene>.annotation.json` beside its image),
  `open_studio` with `view: "regions"` (and `scene`) lets the user fix the region boxes, order, times and subtitles and
  save them; read the files again before the render.
- **On Linux and WSL2** (no Studio there): review with stills (`reelcrew render <page> --stills … --out-dir …`),
  contact sheets (`reelcrew inspect <video>`) and the skills' review pages. Every page, still and MP4 stays on the
  machine reelcrew runs on, so tell the user how to open each file you ask them to look at:
  - **over SSH** (a server, or a computer they reach from another): its absolute path, and the command to copy it to
    their own computer, run there: `scp <user>@<host>:<absolute path> .` (`scp -r` for a folder such as `review/`);
  - **on WSL2** (`reelcrew doctor`'s first line says `Linux on WSL2`): the Windows path
    `\\wsl.localhost\<distro>\<absolute path with backslashes>`, which opens in Explorer (`<distro>` is
    `$WSL_DISTRO_NAME`);
  - **at the Linux computer's own desktop:** its absolute path (`xdg-open <path>` opens it).

## 10. Running in a Cloud Agent's machine (ChatGPT Work, Claude Code on the web)

When the agent works in a cloud machine (the user pasted the prompt from their account's Cloud Agent page; `reelcrew
doctor` shows Linux: no Claude Code in ChatGPT Work, Claude Code on the web), the sections above hold with these
differences.

- **The machine.** Linux, often as root. It may be kept between chats or be a new one: start every chat with
  `reelcrew doctor --json` and set up only what it shows missing. When `reelcrew` is not found and `~/.reelcrew/bin/reelcrew`
  exists, run that full path for every reelcrew command (section 2); only when it is missing, run the install line
  from the user's prompt (their account page has it), then use `~/.reelcrew/bin/reelcrew` by its full path.
- **Sign in** with `reelcrew login --cloud`: it prints a link and a code, keeps the code and ends (the command never
  waits). Show the user the link to open (a phone works) and stop until they say they confirmed it; then run
  `reelcrew login --cloud` again: it collects the sign-in (not confirmed yet: it shows the same link again; the code
  works 10 minutes, after that it asks for a new one). The sign-in lasts 24 hours and renews itself while commands
  run. A newer sandbox that signs in replaces this one (`license.cloud_replaced`: `reelcrew login --cloud` again);
  the day's sign-in limit (`license.cloud_limit`) says in its hint when it opens again. Packs download as on a
  computer, with no daily limit. Never ask the user for a pack's files: packs come only through `reelcrew`.
- **Skills, no Studio.** Read skills with `reelcrew skill <name>` (it works with or without Claude Code); skip the
  steps that restart Claude Code or install the Studio plugin. Review with pictures in the chat: stills (`reelcrew render <page> --stills … --out-dir …`)
  and contact sheets (`reelcrew inspect <video>`); the user answers in words.
- **Workers.** Pass the render workers `reelcrew doctor` gives (`render workers` on its Machine line;
  `machine.render_workers` in `--json`) as `--workers`, not the number a skill suggests: a sandbox has less memory
  than a desktop.
- **Images.** When you can make pictures in the chat (ChatGPT can), make them yourself and save them where the skill
  expects them: each skill that makes images has a paragraph "Images made by the agent" naming the file and its
  aspect; no image key is needed. When you cannot (Claude), use photos (`reelcrew commons search`, or stock photos and clips with `reelcrew pixabay search` and the user's
  free Pixabay key) or the user's image
  key (`reelcrew image setup`, with the key rules below).
  A cut-out is a transparent PNG you make, or `reelcrew matte` cuts one out (after the install below).
- **HyperFrames** (motion design in `motion-fx-kit` and `talking-head-highlight-short`, the person cutout of
  `reelcrew matte`) runs here too: `reelcrew hyperframes install` once (about 30 s; it needs the network). Renders use
  the workers doctor prints; a cutout takes about 10 s of work per second of video on 4 CPUs, so say the wait first
  and cut out only what the video needs.
- **Without API keys.** Voice: VieNeu (free; it downloads its model once). On Linux: run the Vietnamese voice line
  `reelcrew doctor` prints (it makes a Python 3.10 environment in `~/vieneu`, with the venv package or uv first where
  this machine needs them, and installs VieNeu into it), then `reelcrew tts setup vieneu --python ~/vieneu/bin/python`. VieNeu reads Vietnamese and Kokoro reads English (free,
  offline, it downloads its model once; its venv goes in a short folder such as `~/kokoro`, since espeak-ng cannot read
  a deeply nested path; on Linux run the line `reelcrew tts setup kokoro` prints without `--python`: it makes a
  Python 3.10 environment in `~/kokoro`, with the venv package or uv first where this machine needs them, installs
  `kokoro-onnx soundfile` and ends with `reelcrew tts setup kokoro --python ~/kokoro/bin/python`). When a setup fails its error names what is missing and the way round:
  the user's ElevenLabs or Gemini key (below), or a video with no narration. Sounds: the free sets (`reelcrew sfx
  defaults`) and CC0 recordings (`reelcrew sfx find`). Photos: `reelcrew commons search` (a free Pixabay key adds
  `reelcrew pixabay search` for stock photos and clips). Music: the user's own file or
  none (`music make` is paid). Transcription: `reelcrew transcribe setup whisper --default` (free; word timing and the
  speech checks work as with a paid one; never install a Whisper of your own beside it).
- **API keys.** A key typed into this chat lives in the agent's cloud machine, not the user's. Use one only when the
  user accepts that; otherwise take the way without keys, or the desktop. Advise a separate key just for this agent
  with a spending cap at the provider (ElevenLabs: a key with a character quota; Google AI Studio: a project spend
  limit; OpenRouter: a credit limit on the key; or a small prepaid balance), replaced when the work is done. To set it, write
  the key to a file with your code tool, never on a command line, run `reelcrew keys set <name> < <file>` and delete
  the file. Never print, echo or repeat the key. Afterwards tell the user to delete the chat message that held it.
- **Hand over** the finished MP4 as a file for the user to download, after `reelcrew check` passes.
