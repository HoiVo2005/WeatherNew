# -*- coding: utf-8 -*-
"""Scan for remaining cp1252-style mojibake in source files."""
import io
import os
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Characters that appear when UTF-8 is mis-decoded as cp1252/latin-1 but
# never appear in legitimate Vietnamese source text.
BAD_CHARS = "ÃÂâ€†'"

FILES = [
    "src/app/widget/page.tsx",
    "src/components/ConfettiSVG.tsx",
    "src/components/HolidayEffectsSettings.tsx",
    "src/components/HolidayModal.tsx",
    "src/components/SunCard.tsx",
    "src/components/WeatherFX.tsx",
    "src/types/holiday-effects.ts",
    "tools/sharpen_holidays.py",
    "src/app/page.tsx",
    "src/app/globals.css",
]

total = 0
with io.open("scan_out.txt", "w", encoding="utf-8") as out:
    for f in FILES:
        if not os.path.exists(f):
            continue
        for i, line in enumerate(io.open(f, encoding="utf-8"), 1):
            if any(c in line for c in BAD_CHARS):
                total += 1
                out.write(f"{f}:{i}: {line.strip()[:100]}\n")
    out.write(f"TOTAL_SUSPECT_LINES= {total}\n")

print("DONE")
