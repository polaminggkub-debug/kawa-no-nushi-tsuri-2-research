#!/usr/bin/env python3
"""Verify a bounded Area 6 magnet-story trace against the original ROM."""
import argparse
import importlib.util
import json
import sys
from pathlib import Path


def load_builder(script_dir):
    package_dir = script_dir / "magnet-story-gate"
    spec = importlib.util.spec_from_file_location(
        "magnet_story_gate", package_dir / "__init__.py",
        submodule_search_locations=[str(package_dir)],
    )
    if spec is None or spec.loader is None:
        raise RuntimeError("Could not load magnet-story-gate helper package")
    package = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = package
    spec.loader.exec_module(package)
    return package.build


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--rom", required=True, type=Path)
    repo = Path(__file__).resolve().parents[2]
    parser.add_argument("--output", type=Path, default=repo / "publication" / "data" / "magnet-story-gate.json")
    args = parser.parse_args()
    build = load_builder(Path(__file__).resolve().parent)
    fish_index = repo / "publication" / "data" / "lure-coverage.json"
    result = build(args.rom.read_bytes(), fish_index)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {args.output}")


if __name__ == "__main__":
    main()
