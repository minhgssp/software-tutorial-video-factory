# -*- coding: utf-8 -*-
"""Embedded `/kudo` Screencast (`kcast`) & Widescreen 16:9 Engine."""

import sys
from pathlib import Path

_HERE = Path(__file__).resolve().parent
if str(_HERE) not in sys.path:
    sys.path.insert(0, str(_HERE))

from .kcast import plan as kcast_plan  # noqa: E402
from .widescreen_16x9 import (  # noqa: E402
    CONTENT_CORNER_JS,
    OPENER_CSS,
    OPENER_JS,
    WIDESCREEN_16X9_STAGE_CSS,
    paragraph_captions,
    sfx_cues_around_speech,
)

__all__ = [
    "kcast_plan",
    "CONTENT_CORNER_JS",
    "OPENER_CSS",
    "OPENER_JS",
    "WIDESCREEN_16X9_STAGE_CSS",
    "paragraph_captions",
    "sfx_cues_around_speech",
]
