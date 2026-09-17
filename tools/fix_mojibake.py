# -*- coding: utf-8 -*-
"""Fix mojibake (UTF-8 text wrongly decoded/saved as CP1252/Latin-1).

Uses `ftfy` (the dedicated mojibake-repair library) and falls back to a
manual cp1252/latin-1 -> UTF-8 roundtrip. Only rewrites files whose content
actually changes and whose repaired text contains Vietnamese characters.
"""
import os
import sys

import ftfy

SKIP_DIRS = {"node_modules", ".git", ".next", "dist", "public", ".turbo"}
TEXT_EXTS = {
    ".ts", ".tsx", ".js", ".cjs", ".mjs", ".jsx", ".css", ".scss",
    ".md", ".json", ".html", ".yml", ".yaml", ".py", ".txt",
}


def has_vietnamese(text: str) -> bool:
    return any(
        0x1EA0 <= ord(c) <= 0x1EF9 or ord(c) in (0x0102, 0x0103, 0x0110, 0x0111)
        for c in text
    )


def manual_fix(text: str):
    """Fallback: encode back to cp1252/latin-1 then decode as UTF-8."""
    for codec in ("cp1252", "latin-1"):
        try:
            data = text.encode(codec)
        except UnicodeEncodeError:
            continue
        try:
            return data.decode("utf-8")
        except UnicodeDecodeError:
            return None
    return None


def recover(text: str):
    """Return repaired text or None when nothing safe could be recovered."""
    candidate = ftfy.fix_text(text, normalization="NFC")
    if candidate != text and has_vietnamese(candidate):
        return candidate
    return None


def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    fixed, skipped_fail, clean = [], [], 0

    for dirpath, dirnames, filenames in os.walk(root_dir):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.startswith(".")]
        for fn in filenames:
            ext = os.path.splitext(fn)[1].lower()
            if ext not in TEXT_EXTS:
                continue
            path = os.path.join(dirpath, fn)
            rel = os.path.relpath(path, root_dir)

            try:
                with open(path, "rb") as f:
                    raw = f.read()
            except OSError:
                continue

            has_bom = raw.startswith(b"\xef\xbb\xbf")
            body = raw[3:] if has_bom else raw

            try:
                text = body.decode("utf-8")
            except UnicodeDecodeError:
                skipped_fail.append(rel + "  (not valid UTF-8)")
                continue

            recovered = recover(text)
            if recovered is None:
                clean += 1
                continue

            out = (
                b"\xef\xbb\xbf" + recovered.encode("utf-8")
                if has_bom
                else recovered.encode("utf-8")
            )
            with open(path, "wb") as f:
                f.write(out)
            fixed.append(rel)

    print("FIXED=%d" % len(fixed))
    for rel in fixed:
        print("  +", rel)
    print("CLEAN=%d" % clean)
    print("NOT_UTF8=%d" % len(skipped_fail))
    for rel in skipped_fail:
        print("  !", rel)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
