#!/usr/bin/env python3
"""Verify the initial Fishing Notebook grant in a locally supplied Japanese ROM."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

ROM_SIZE = 1_572_864
ROM_SHA1 = "c2103dd94e2a1a65a495fc02adc2e7d040f31212"
ROM_SHA256 = "e0594921a5a2ef1a2613b9d2e29fed066569e3793393c591bf4c4968a54c0b49"
FINGERPRINTS = (
    ("signature_mismatch_initializes_save", 1, 0xB5DF,
     "a2 00 00 bf 67 b7 01 df 00 00 70 f0 04 20 05 b7 60"),
    ("fresh_save_initialization", 1, 0xB705,
     "a9 00 00 8f 00 00 70 8b a0 01 00 a2 00 00 a9 fe 1f 54 70 70 ab "
     "a2 00 00 bf 67 b7 01 9f 00 00 70 e8 e8 e0 0e 00 90 f1 20 c5 be"),
    ("all_four_character_initializers", 1, 0xB72F,
     "a9 01 00 85 12 20 75 b7 a9 02 00 85 12 20 75 b7 "
     "a9 03 00 85 12 20 75 b7 a9 04 00 85 12 20 75 b7 60"),
    ("clear_character_data_restore_word_width", 1, 0xB775,
     "38 a9 e8 11 e9 5a 08 85 10 e2 20 a9 00 a2 00 00 "
     "9d 5a 08 e8 e4 10 90 f8 c2 20"),
    ("unconditional_notebook_grant", 1, 0xB84F,
     "a9 05 00 8d 5a 0b a9 13 00 8d 5c 0b"),
    ("save_initialized_character", 1, 0xB9DD, "20 17 bd 60"),
    ("four_character_sram_destinations", 1, 0xBD17,
     "38 a9 e8 11 e9 5a 08 85 10 ad 60 08 c9 01 00 d0 0d "
     "a9 10 00 85 06 a9 70 00 85 08 4c 6b bd c9 02 00 d0 0d "
     "a9 e0 04 85 06 a9 70 00 85 08 4c 6b bd c9 03 00 d0 0d "
     "a9 b0 09 85 06 a9 70 00 85 08 4c 6b bd c9 04 00 d0 0d "
     "a9 80 0e 85 06 a9 70 00 85 08 4c 6b bd"),
    ("compact_inventory_save_copy", 1, 0xBD8F,
     "bd 5a 08 97 06 c8 e8 e8 e4 10 90 f4 c2 20"),
    ("notebook_item_record", 5, 0xB270, "08 0e 13 b3 32 00"),
)


def lorom(bank: int, address: int) -> int:
    if not 0 <= bank <= 0x7F or not 0x8000 <= address <= 0xFFFF:
        raise ValueError("Invalid lower-bank LoROM address")
    return bank * 0x8000 + address - 0x8000


def verify_identity(rom: bytes) -> dict[str, object]:
    identity = {"sizeBytes": len(rom), "sha1": hashlib.sha1(rom).hexdigest(),
                "sha256": hashlib.sha256(rom).hexdigest(), "header": "none"}
    if (identity["sizeBytes"], identity["sha1"], identity["sha256"]) != (
        ROM_SIZE, ROM_SHA1, ROM_SHA256
    ):
        raise ValueError("Requires the supplied headerless original Japanese ROM")
    return identity


def verify_fingerprint(rom: bytes, fingerprint: tuple) -> dict[str, str]:
    name, bank, address, expected_hex = fingerprint
    expected = bytes.fromhex(expected_hex)
    offset = lorom(bank, address)
    actual = rom[offset:offset + len(expected)]
    if actual != expected:
        raise ValueError(f"ROM mismatch at {bank:02X}:{address:04X}")
    return {"name": name, "cpu": f"{bank:02X}:{address:04X}",
            "fileOffset": f"0x{offset:06X}", "bytes": actual.hex(" ")}


def acquisition_evidence() -> dict[str, object]:
    return {
        "item": {"category": "general_tool", "id": "05", "nameJa": "釣りノート"},
        "acquisition": {
            "type": "starting_equipment", "characterIds": [1, 2, 3, 4],
            "initializer": "01:B775", "saveInitializer": "01:B705",
            "callSites": ["01:B734", "01:B73C", "01:B744", "01:B74C"],
            "grant": {"cpu": "01:B84F..B854", "fileOffset": "0x00B84F",
                      "value": "0005", "inventoryAddress": "7E:0B5A",
                      "widthBytes": 2, "condition": "unconditional in character initializer"},
            "persistence": {"callSite": "01:B9DD", "routine": "01:BD17",
                            "sramRecordBases": ["70:0010", "70:04E0", "70:09B0", "70:0E80"],
                            "copy": "01:BD8F..BD99 saves low bytes of character words; Tool05 fits one byte"},
        },
        "limitations": [
            "Static code evidence in the original Japanese ROM, not a new controller replay.",
            "Thai-patch initializer equivalence was not independently checked.",
            "Does not establish replacement acquisition or every possible removal/sale path.",
            "No shop, price or NPC gift is inferred from this initial grant.",
        ],
    }


def build(rom: bytes) -> dict[str, object]:
    identity = verify_identity(rom)
    checks = [verify_fingerprint(rom, entry) for entry in FINGERPRINTS]
    return {
        "schemaVersion": 1, "rom": identity, "evidenceType": "rom_code_trace",
        "scope": "Initial Fishing Notebook availability for all four character records; no external guides.",
        "sources": ["docs/general-tool-actions-research.md", "scripts/verify_notebook_starting_inventory.py"],
        **acquisition_evidence(), "checks": checks,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--rom", type=Path, required=True)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    result = build(args.rom.read_bytes())
    rendered = json.dumps(result, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        args.output.write_text(rendered, encoding="utf-8")
    else:
        print(rendered, end="")


if __name__ == "__main__":
    main()
