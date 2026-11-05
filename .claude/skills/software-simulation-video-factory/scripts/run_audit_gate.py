#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Quick wrapper to invoke `factory_cli.py` audit gates from skill directory."""

import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[4]
CLI = REPO_ROOT / "factory_cli.py"

if __name__ == "__main__":
    sys.exit(subprocess.run([sys.executable, str(CLI)] + sys.argv[1:]).returncode)
