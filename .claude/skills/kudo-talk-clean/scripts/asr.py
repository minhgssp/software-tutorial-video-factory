"""ASR tiếng Việt có mốc từng từ cho talkclean.

Dùng: python3 asr.py AUDIO.wav WORDS.json
Ra: [{w,s,e,p}] — từ, giây bắt đầu, giây kết thúc, độ tin cậy.
Tắt VAD và không nối ngữ cảnh để không nuốt từ đệm, câu nói lại.
"""
import json, sys
from faster_whisper import WhisperModel

m = WhisperModel('large-v3', device='cpu', compute_type='int8')
segs, info = m.transcribe(sys.argv[1], language='vi', word_timestamps=True, vad_filter=False,
                          beam_size=5, condition_on_previous_text=False)
out = []
for s in segs:
    for w in s.words:
        out.append({'w': w.word.strip(), 's': round(w.start, 3), 'e': round(w.end, 3), 'p': round(w.probability, 3)})
    print(f"[{s.start:6.2f}-{s.end:6.2f}] {s.text}", flush=True)
json.dump(out, open(sys.argv[2], 'w'), ensure_ascii=False, indent=0)
