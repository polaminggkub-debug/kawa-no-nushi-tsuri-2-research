#!/usr/bin/env python3
"""Generate the rod, hook and float/sinker advice from the measured gear effects.

Reads data/gear-effects.json (what each rod and hook does to the fight meter's start, and the
reach each fish needs), data/fight-tables.json (hook classes and fish matches) and the shop stock.
Rewrites, in place and only for these items:
  data/rod-item-decisions.json   per-rod label, advice and reason
  data/gear-item-decisions.json  per-hook and per-float/sinker label, advice and reason
  data/player-decisions.json     rod, hook and float category intros
The item-page text (summary, facts, evidence notes) comes from scripts/gear_advice/overlay.py,
which build_item_use.py applies.

Usage: python3 scripts/build_gear_advice.py [--check]
Run it before build_item_use.py and build_catalogue.cjs; --check fails when the files are stale.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from gear_advice.write import stale, write_all  # noqa: E402


def main():
    if "--check" in sys.argv[1:]:
        paths = stale()
        if paths:
            raise SystemExit("Stale (run python3 scripts/build_gear_advice.py): " + ", ".join(paths))
        print("Gear advice check PASS: rod, hook and float decisions match the generator")
        return
    for path in write_all():
        print("Wrote", path)


if __name__ == "__main__":
    main()
