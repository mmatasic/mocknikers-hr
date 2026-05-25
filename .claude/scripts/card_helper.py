#!/usr/bin/env python3
"""Helper for adding Croatian cards to src/data/base_cards_hr.json.

Commands:
  stats                 Print total card count, any duplicate titles, and
                        category distribution. Use as a sanity check.
  check TITLE [TITLE..] For each title, print whether it already exists in
                        the file (case-insensitive). Use BEFORE proposing
                        a batch to filter out duplicates.

Examples:
  python3 .claude/scripts/card_helper.py stats
  python3 .claude/scripts/card_helper.py check "Hvar" "Pelinkovac" "Bura"
"""
import json
import sys
from collections import Counter
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CARDS_FILE = REPO_ROOT / "src" / "data" / "base_cards_hr.json"


def load_cards():
    return json.loads(CARDS_FILE.read_text(encoding="utf-8"))


def cmd_stats():
    cards = load_cards()
    title_counts = Counter(c["title"].lower() for c in cards)
    dups = sorted(t for t, n in title_counts.items() if n > 1)
    cat_counts = Counter(c["category"] for c in cards)
    print(f"Total cards: {len(cards)}")
    print(f"Duplicates: {dups if dups else 'none'}")
    print("Category distribution:")
    for cat, n in cat_counts.most_common():
        print(f"  {cat}: {n}")


def cmd_check(titles):
    cards = load_cards()
    existing = {c["title"].lower() for c in cards}
    for t in titles:
        status = "PRESENT" if t.lower() in existing else "free"
        print(f"  {status}: {t}")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    cmd, *args = sys.argv[1:]
    if cmd == "stats":
        cmd_stats()
    elif cmd == "check":
        if not args:
            print("Provide one or more titles", file=sys.stderr)
            sys.exit(1)
        cmd_check(args)
    else:
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
