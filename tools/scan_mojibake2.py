# -*- coding: utf-8 -*-
"""Check HEAD (committed) copies of key files for mojibake."""
import subprocess
import sys

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

BAD = ["Ã", "Ã¢", "â€", "Â»", "Â·", "áº", "á»", "chÆ°a", "Khá»‘i"]
FILES = [
    "src/components/ConfettiSVG.tsx",
    "src/components/HolidayModal.tsx",
    "src/components/SunCard.tsx",
    "src/types/holiday-effects.ts",
    "src/app/widget/page.tsx",
    "src/app/page.tsx",
    "src/app/globals.css",
    "tools/sharpen_holidays.py",
]

for f in FILES:
    proc = subprocess.run(
        ["git", "show", f"HEAD:{f}"],
        capture_output=True,
    )
    text = proc.stdout.decode("utf-8", errors="replace")
    hits = sum(1 for c in BAD if c in text)
    print(f, "bytes=", len(proc.stdout), "rc=", proc.returncode, "MOJIBAKE_HITS=", hits)
