#!/usr/bin/env python3
"""Giọng đọc tiếng Anh bằng Kokoro-82M (Apache 2.0, không dấu ẩn) cho engine style.

Ra ba file trong --out:
  voice.wav             giọng đọc 24 kHz mono
  voice_timeline.json   mốc từng từ, cùng hợp đồng `core/timeline.js` ({ words: [{ text, start_ms, end_ms }] })
  voice.srt             phụ đề tiếng Anh để tải lên YouTube, đã cộng --srt-offset (mặc định 0,5 s như script)
  voice-receipt.json    biên nhận: mô hình, giọng, sha256, kết quả cổng chép lại (nếu chạy --check)

Chạy bằng venv có `kokoro` (xem ADR-030):
  {{KUDO_HOME}}/.venv/kokoro-py312/bin/python -I engines/voice/kokoro_tts.py \
      --text lines.txt --voice am_michael --out work/ [--speed 1.0] [--check]

Lời đọc: mỗi đoạn cách nhau một dòng trống; giữa hai đoạn chèn khoảng lặng --gap giây.
Viết số và ký hiệu theo cách đọc ("one dollar fifty", không "$1.50") để mốc từ khớp lời nói.
Các hàm ghép mốc và chia phụ đề không cần Kokoro, có test ở tests/test_voice_kokoro.py.
"""
import argparse, datetime, hashlib, json, os, re, subprocess, sys

SR = 24000
WHISPER_PY = os.environ.get('KUDO_WHISPER_PY', os.path.expanduser('{{KUDO_HOME}}/.venv/faster-whisper-py312/bin/python'))
WORD = re.compile(r"[\w']", re.UNICODE)


def merge_tokens(chunks):
    """chunks: [(offset_s, [(text, whitespace, start_ts, end_ts)])] → words [{text, start_ms, end_ms}].
    Dấu câu đứng riêng được dính vào từ trước (giữ cho phụ đề), không thành từ riêng."""
    words = []
    for off, toks in chunks:
        for text, ws, t0, t1 in toks:
            if t0 is None or t1 is None:
                continue
            if not WORD.search(text):
                if words:
                    words[-1]['text'] += text
                continue
            words.append({'text': text, 'start_ms': round((off + t0) * 1000), 'end_ms': round((off + t1) * 1000)})
    for i, w in enumerate(words, 1):
        w['word_id'] = f'W{i:04d}'
    return words


def cues(words, max_chars=42, max_dur=3.2, gap_break=0.35):
    """Chia phụ đề: ngắt sau dấu câu kết, khi nghỉ giọng > gap_break, hoặc khi vượt độ dài/thời lượng."""
    out, cur = [], []
    for i, w in enumerate(words):
        if cur:
            text = ' '.join(x['text'] for x in cur + [w])
            gap = (w['start_ms'] - cur[-1]['end_ms']) / 1000
            if len(text) > max_chars or (w['end_ms'] - cur[0]['start_ms']) / 1000 > max_dur or gap > gap_break:
                out.append(cur); cur = []
        cur.append(w)
        if re.search(r'[.!?;:]["\')]*$', w['text']) or (w['text'].endswith(',') and len(' '.join(x['text'] for x in cur)) > max_chars * 0.55):
            out.append(cur); cur = []
    if cur:
        out.append(cur)
    return [{'start_ms': c[0]['start_ms'], 'end_ms': c[-1]['end_ms'], 'text': ' '.join(x['text'] for x in c)} for c in out]


def srt(cs, offset_ms=0):
    def ts(ms):
        h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
        return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'
    return '\n'.join(f"{i}\n{ts(c['start_ms'])} --> {ts(c['end_ms'])}\n{c['text']}\n" for i, c in enumerate(({**c, 'start_ms': c['start_ms'] + offset_ms, 'end_ms': c['end_ms'] + offset_ms} for c in cs), 1))


NUMWORDS = set('''zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen
seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred thousand million billion
trillion point dollar dollars percent cent cents'''.split())


def wer(ref, hyp):
    """Tỉ lệ sai từ (word error rate) sau khi thường hoá, bỏ dấu câu.
    Bỏ cụm số ở cả hai phía: lời đọc viết số bằng chữ, Whisper lại ghi chữ số ($1.50, 92%), so trực tiếp sẽ báo sai giả.
    Số liệu vì thế phải soát bằng mắt trong hypothesis của biên nhận."""
    norm = lambda s: re.sub(r"[^\w' ]", ' ', s.lower().replace('u.s.', 'us')).split()
    r = [w for w in norm(ref) if w not in NUMWORDS]
    h = [w for w in norm(hyp) if not re.search(r'\d', w)]
    d = list(range(len(h) + 1))
    for i in range(1, len(r) + 1):
        prev, d[0] = d[0], i
        for j in range(1, len(h) + 1):
            cur = min(d[j] + 1, d[j - 1] + 1, prev + (r[i - 1] != h[j - 1]))
            prev, d[j] = d[j], cur
    return d[len(h)] / max(1, len(r))


def paragraphs(text):
    return [re.sub(r'\s+', ' ', p).strip() for p in re.split(r'\n\s*\n', text) if p.strip()]


def synth(paras, voice, speed, gap):
    import numpy as np
    from kokoro import KPipeline
    pipe = KPipeline(lang_code=voice[0], repo_id='hexgrad/Kokoro-82M')
    audio, chunks, off = [], [], 0.0
    for pi, para in enumerate(paras):
        if pi:
            audio.append(np.zeros(int(gap * SR), dtype=np.float32)); off += gap
        for r in pipe(para, voice=voice, speed=speed, split_pattern=None):
            a = r.audio.numpy()
            chunks.append((off, [(t.text, t.whitespace, t.start_ts, t.end_ts) for t in (r.tokens or [])]))
            audio.append(a); off += len(a) / SR
    return np.concatenate(audio), chunks


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--text', required=True); ap.add_argument('--voice', required=True)
    ap.add_argument('--out', required=True); ap.add_argument('--speed', type=float, default=1.0)
    ap.add_argument('--gap', type=float, default=0.45); ap.add_argument('--check', action='store_true')
    ap.add_argument('--max-wer', type=float, default=0.03)
    ap.add_argument('--srt-offset', type=float, default=0.5, help='giây giọng bắt đầu trong video (khớp "offset" của script, mặc định 0,5)')
    a = ap.parse_args(argv)
    if a.voice[0] not in 'ab':
        sys.exit('chỉ hỗ trợ giọng tiếng Anh: tiền tố a (Mỹ) hoặc b (Anh), ví dụ am_michael, bf_emma')
    import soundfile as sf
    os.makedirs(a.out, exist_ok=True)
    paras = paragraphs(open(a.text, encoding='utf-8').read())
    audio, chunks = synth(paras, a.voice, a.speed, a.gap)
    wav = os.path.join(a.out, 'voice.wav'); sf.write(wav, audio, SR)
    sha = hashlib.sha256(open(wav, 'rb').read()).hexdigest()
    words = merge_tokens(chunks)
    transcript = ' '.join(paras)
    tl = {
        'schema': 'tpr.voice_timeline.v2', 'revision': 1, 'run_id': os.path.basename(os.path.abspath(a.out)),
        'created_at': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'),
        'audio': {'provider': 'kokoro', 'model': 'hexgrad/Kokoro-82M', 'voice': a.voice, 'speed': a.speed,
                  'path': 'voice.wav', 'sha256': sha, 'duration_ms': round(len(audio) / SR * 1000), 'language': 'en'},
        'transcript_status': 'approved', 'transcript_text': transcript, 'words': words,
        'word_timing_provenance': 'kokoro_duration_predictor',
    }
    json.dump(tl, open(os.path.join(a.out, 'voice_timeline.json'), 'w'), ensure_ascii=False, indent=1)
    open(os.path.join(a.out, 'voice.srt'), 'w', encoding='utf-8').write(srt(cues(words), round(a.srt_offset * 1000)))
    receipt = {'model': 'hexgrad/Kokoro-82M', 'license': 'Apache-2.0', 'watermark': 'none (kokoro 0.9.4 không có lớp đóng dấu)',
               'voice': a.voice, 'speed': a.speed, 'sha256': sha, 'duration_s': round(len(audio) / SR, 2),
               'words': len(words), 'paragraphs': len(paras)}
    status = 0
    if a.check:
        code = ("import sys,json\nfrom faster_whisper import WhisperModel\n"
                "m=WhisperModel('small',device='cpu',compute_type='int8')\n"
                "s,_=m.transcribe(sys.argv[1],language='en')\nprint(json.dumps(' '.join(x.text.strip() for x in s)))")
        r = subprocess.run([WHISPER_PY, '-I', '-c', code, wav], capture_output=True, text=True)
        if r.returncode:
            sys.exit('cổng chép lại lỗi: ' + r.stderr[-500:])
        hyp = json.loads(r.stdout.strip().splitlines()[-1])
        e = wer(transcript, hyp)
        receipt['check'] = {'asr': 'faster-whisper small', 'wer': round(e, 4), 'max_wer': a.max_wer,
                            'verdict': 'PASS' if e <= a.max_wer else 'FAIL', 'numbers': 'loại khỏi WER, soát tay', 'hypothesis': hyp}
        status = 0 if e <= a.max_wer else 2
    json.dump(receipt, open(os.path.join(a.out, 'voice-receipt.json'), 'w'), ensure_ascii=False, indent=1)
    print(json.dumps({k: v for k, v in receipt.items() if k != 'check'} | ({'wer': receipt['check']['wer'], 'verdict': receipt['check']['verdict']} if 'check' in receipt else {}), ensure_ascii=False))
    return status


if __name__ == '__main__':
    sys.exit(main())
