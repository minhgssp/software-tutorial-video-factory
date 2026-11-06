# Writing the lesson script (lesson.json)

## Source → key ideas
1. Read the full `pack.md` / `.txt` transcript (a 40-min talk ≈ 30 KB; read it all, don't skim the start).
2. List 6–9 key ideas in the speaker's order. Drop anecdotes that don't teach, keep 1–2 concrete stories as examples.
3. Summarise **in your own words**. Short quotes of a few words are fine; never paste transcript paragraphs.
   Credit generically on the end card ("An animated summary of a talk on …").

## Scene pattern (8–10 scenes, 3–4 min total)
| scene | role |
|---|---|
| 1 hook | surprising number/claim + the one key word of the lesson |
| 2 analogy | a concrete metaphor the viewer already knows (kitchen, garden, road…) |
| 3 problem | what goes wrong today (before) |
| 4…N-1 ideas | one idea per scene: **main idea → explanation → example** |
| N recap | the one takeaway as a 3-step checklist + motivating close |

Each scene = 3–5 narration lines. Each line = one sentence, 8–22 words, spoken ~150 wpm.
Aim for ~500–550 words total ≈ 3.5 min.

Lines must work as subtitles: one idea per line, no parentheses, numbers written as words
(the TTS reads them more naturally; STT verification tolerates the mismatch).

## Vietnamese subtitle (`vi`) of an English lesson
Natural Vietnamese, same meaning, similar length. Technical terms Vietnamese devs use in English (agent, pull request,
lint rule, codebase, skill, framework, CI) may stay in English **in this subtitle line only**. In a Vietnamese lesson
(`--lang vi`) the `vi` line is spoken: follow SKILL.md step 3 (Vietnamese terms, numbers as words).

## `visual` field
One sentence per scene describing what is on screen and what happens on each beat.
It is the brief for writing scenes.js — write it before drawing.

## Voice
- **VI**: VieNeu voice **Hải Đăng** (male, northern, natural); others with `reelcrew tts voices`. See SKILL.md step 4.
- **EN**: ElevenLabs **Liam** `TX3LPaxmHKxFdv7VOQHJ` (young US male, energetic). Alternatives: Brian `nPczCjzI2devNBz1zQrb`
  (deep, calm), Adam `pNInz6obpgDQGcFmaJgB` (firm), Daniel `onwK4e9ZLuTAKqWW03F9` (British, broadcaster). English narration
  waits for reelcrew's ElevenLabs voice adapter.

## Music prompt (instrumental, one short paragraph)
"Upbeat energetic electronic pop instrumental, bouncy synth plucks, punchy drums, claps, 120 bpm,
playful and motivating, for a fun animated explainer video, no vocals". Swap genre/bpm for mood:
lo-fi 85 bpm (calm lesson), cinematic 100 bpm (story), funk 110 bpm (playful). `music.py` makes it to the video's length.
