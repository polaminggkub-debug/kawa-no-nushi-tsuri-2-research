#!/usr/bin/env python3
"""Extract the small numeric tables the fight engine needs from the supplied original ROM.

Read-only: validates the original Japanese dump and writes a derived JSON file containing only
the numbers the ported fight loop reads (named fish-profile, rod, hook, bait, lure and fly fields,
the 256-entry random table and the scene step-mask table). No ROM is modified or packaged.

    python3 scripts/extract_fight_tables.py --rom /path/to/original.sfc --output data/fight-tables.json
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

EXPECTED_SIZE = 1_572_864
EXPECTED_SHA1 = "c2103dd94e2a1a65a495fc02adc2e7d040f31212"


def file_offset(bank: int, address: int) -> int:
    """LoROM: bank:address (address >= 0x8000) to file offset."""
    return (bank & 0x3F) * 0x8000 + (address & 0x7FFF)


def table_pointer(rom: bytes, slot: int) -> int:
    """Bank 05 pointer table at 05:8000; returns the CPU address inside bank 05."""
    base = file_offset(5, 0x8000 + 2 * slot)
    return rom[base] | rom[base + 1] << 8


# Byte offsets (within a record) of every field the ported fight loop reads. RAM destinations are
# those of the in-game loaders: fish 03:D26D, rod 03:D11F, hook 03:D1C3, bait 03:D030, lure 03:D083,
# fly 03:D0D9.
FISH_FIELDS = {
    "sizeLow": 0,  # $11EA
    "sizeHigh": 1,  # $11EC
    "approach": 3,  # $11F0 lure: approach timer scale
    "biteMax": 4,  # $11F2 lure: longest strike window
    "biteMin": 5,  # $11F4 lure: shortest strike window
    "restBase": 6,  # $11F6
    "staminaBase": 7,  # $11F8
    "beatMask": 8,  # $11FA
    "idleSpread": 9,  # $11FC
    "fightStart": 10,  # $11FE
    "pullMask": 11,  # $1200
    "flags": 13,  # $1204
}
ROD_FIELDS = {"style": 0, "reach": 3, "fishMatch": 4, "selector": 7}
HOOK_FIELDS = {"selector": 0, "fishMatch": 1}
BAIT_FIELDS = {"fishMatch": 1}
LURE_FIELDS = {"action": 0, "selector": 1, "fishMatch": 2}
FLY_FIELDS = {"flag": 2, "selector": 6}


def rows(rom: bytes, address: int, stride: int, count: int, fields: dict[str, int]) -> list[dict]:
    """Records are addressed `base + (id - 1) * stride` in bank 05; keep the named byte offsets."""
    out = []
    for index in range(count):
        start = file_offset(5, address) + index * stride
        row = {"id": index + 1}
        for name, offset in fields.items():
            row[name] = rom[start + offset]
        out.append(row)
    return out


def build(rom: bytes) -> dict:
    fish_ptr = table_pointer(rom, 0)
    bait_ptr = table_pointer(rom, 1)
    hook_ptr = table_pointer(rom, 2)
    lure_ptr = table_pointer(rom, 4)
    rod_ptr = table_pointer(rom, 5)
    fly_ptr = table_pointer(rom, 6)
    rng_start = file_offset(0, 0xEDFA)
    scene_start = file_offset(4, 0xB89E)
    return {
        "schema_version": 2,
        "rom": {"size_bytes": EXPECTED_SIZE, "sha1": EXPECTED_SHA1},
        "scope": (
            "Numeric inputs of the ported fight loop only: named ROM profile and item selector "
            "fields plus two small helper tables. Derived by scripts/extract_fight_tables.py."
        ),
        "sources": {
            "fish_profile": f"05:{fish_ptr:04X} stride 23 (loader 03:D26D), id 1..73",
            "rod": f"05:{rod_ptr:04X} stride 12 (loader 03:D11F), id 1..21",
            "hook": f"05:{hook_ptr:04X} stride 9 (loader 03:D1C3), id 1..13",
            "bait": f"05:{bait_ptr:04X} stride 12 (loader 03:D030), id 1..23",
            "lure": f"05:{lure_ptr:04X} stride 12 (loader 03:D083), id 1..81",
            "fly": f"05:{fly_ptr:04X} stride 11 (loader 03:D0D9), id 1..134",
            "random_table": "00:EDFA, 256 bytes, indexed by the low byte of the counter at $16AE",
            "scene_step_mask": "04:B89E, 16-bit words indexed by scene type ($0850), types 0..13",
        },
        "rng": {
            "table": list(rom[rng_start : rng_start + 256]),
            "note": "counter $16AE += 1, value = table[counter & 255]; LFSR state is $16B0/$16B2.",
        },
        "sceneStepMask": [
            rom[scene_start + 2 * i] | rom[scene_start + 2 * i + 1] << 8 for i in range(14)
        ],
        "fish": rows(rom, fish_ptr, 23, 73, FISH_FIELDS),
        "rod": rows(rom, rod_ptr, 12, 21, ROD_FIELDS),
        "hook": rows(rom, hook_ptr, 9, 13, HOOK_FIELDS),
        "bait": rows(rom, bait_ptr, 12, 23, BAIT_FIELDS),
        "lure": rows(rom, lure_ptr, 12, 81, LURE_FIELDS),
        "fly": rows(rom, fly_ptr, 11, 134, FLY_FIELDS),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--rom", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    rom = args.rom.read_bytes()
    if len(rom) != EXPECTED_SIZE or hashlib.sha1(rom).hexdigest() != EXPECTED_SHA1:
        raise SystemExit("ROM does not match the supported headerless Japanese dump")
    data = build(rom)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
