# -*- coding: utf-8 -*-
"""Trộn lại âm thanh một video đã dựng với mức tiếng hiệu ứng mới, không dựng lại hình.

  python remux_sfx.py <VIDEO_ID> [--sfx-vol 0.22]
"""
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCORE = Path.home() / "kudo" / "engines" / "audio" / "score.py"


def main():
    vid = sys.argv[1]
    sfx = sys.argv[sys.argv.index("--sfx-vol") + 1] if "--sfx-vol" in sys.argv else "0.22"
    run = ROOT / "runs" / vid
    final = run / "out" / "final.mp4"
    subprocess.run([sys.executable, str(SCORE), "mux", str(run / "work" / "voiced.mp4"), str(run / "work" / "bed.wav"),
                    "-o", str(final), "--vol", "0.10", "--sfx-vol", sfx], check=True)
    name = json.loads((ROOT / "specs" / "videos" / f"{vid}.json").read_text(encoding="utf-8"))["out_name"]
    shutil.copy2(final, ROOT / "output_video" / name)
    print(f"OK {name} · sfx-vol {sfx}")


if __name__ == "__main__":
    main()
