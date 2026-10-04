#!/usr/bin/env python3
"""Verify Fishing Notebook record rules in the supplied Japanese SFC ROM."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

ROM_SIZE = 1_572_864
ROM_SHA1 = "c2103dd94e2a1a65a495fc02adc2e7d040f31212"


def lorom(bank: int, address: int) -> int:
    if not 0x8000 <= address <= 0xFFFF:
        raise ValueError(f"Invalid LoROM address {bank:02X}:{address:04X}")
    return bank * 0x8000 + address - 0x8000


def verify(rom: bytes, bank: int, address: int, expected_hex: str) -> dict[str, str]:
    expected = bytes.fromhex(expected_hex)
    offset = lorom(bank, address)
    actual = rom[offset:offset + len(expected)]
    if actual != expected:
        raise ValueError(f"ROM mismatch at {bank:02X}:{address:04X}: {actual.hex(' ')}")
    return {"cpu": f"{bank:02X}:{address:04X}", "fileOffset": f"0x{offset:06X}", "bytes": actual.hex(" ")}


def build(rom: bytes) -> dict[str, object]:
    if len(rom) != ROM_SIZE or hashlib.sha1(rom).hexdigest() != ROM_SHA1:
        raise ValueError("Requires the supplied headerless Japanese original ROM")
    checks = [
        verify(rom, 1, 0x8B00, "ad e8 11 c9 42 00 f0 03 90 01 60"),
        verify(rom, 1, 0x8B0B, "3a 0a aa bd 4c 0e c9 e8 03 b0 04 1a 9d 4c 0e bd c8 0d cd b1 1e 90 01 60"),
        verify(rom, 1, 0x8B23, "ad 6b 1f 9d 64 11 ad 5a 08 9d 3c 0c"),
        verify(rom, 1, 0x8C76, "a5 06 0a 0a 0a 9d c0 0c 85 06 a5 08 0a 0a 0a 9d 44 0d 85 08 ad b1 1e 9d c8 0d"),
        verify(rom, 1, 0xBF5B, "a0 00 00 b9 3c 0c c9 01 00 d0 07 98 9f fa 2a 7f"),
        verify(rom, 1, 0xBF7C, "b9 3c 0c c9 02 00 d0 07 98 9f fa 2a 7f"),
        verify(rom, 1, 0xBF9A, "b9 3c 0c c9 03 00 d0 07 98 9f fa 2a 7f"),
        verify(rom, 1, 0xBFB8, "b9 3c 0c c9 04 00 d0 07 98 9f fa 2a 7f"),
        verify(rom, 1, 0xBFD6, "b9 3c 0c c9 05 00 d0 07 98 9f fa 2a 7f"),
        verify(rom, 1, 0xBFF4, "b9 3c 0c c9 06 00 d0 07 98 9f fa 2a 7f"),
        verify(rom, 1, 0xC258, "a5 06 c5 12 d0 01 60"),
        verify(rom, 1, 0xCE84, "af 8e 2a 7f 4a 85 3e 22 4a da 00"),
        verify(rom, 1, 0xCEAB, "af 90 2a 7f 38 ef 8e 2a 7f 4a 85 3e 22 4a da 00"),
        verify(rom, 1, 0xCED7, "af 92 2a 7f 38 ef 90 2a 7f 4a 85 3e 22 4a da 00"),
        verify(rom, 1, 0xCF03, "af 94 2a 7f 38 ef 92 2a 7f 4a 85 3e 22 4a da 00"),
        verify(rom, 1, 0xCF2F, "af 96 2a 7f 38 ef 94 2a 7f 4a 85 3e 22 4a da 00"),
        verify(rom, 1, 0xCF5B, "af 98 2a 7f 38 ef 96 2a 7f 4a 85 3e 22 4a da 00"),
        verify(rom, 1, 0xD300, "ad e8 11 3a 0a aa da bd 4c 0e 85 3e 22 4a da 00"),
        verify(rom, 1, 0xD32D, "da bd c8 0d 85 3e 22 4a da 00"),
    ]
    return {
        "rom": {"sizeBytes": len(rom), "sha1": hashlib.sha1(rom).hexdigest()},
        "speciesIdRangeInclusive": [1, 0x42],
        "speciesSlotCount": 0x42,
        "areaArray": {"address": "$7E:0C3C", "entryWidthBytes": 2, "entries": 0x42},
        "recordSizeArray": {"address": "$7E:0DC8", "entryWidthBytes": 2, "entries": 0x42},
        "callbackCounter": {"address": "$7E:0E4C", "entryWidthBytes": 2, "limit": 0x3E8, "displayRead": "01:D300..D30C (file offset 0x00D300) formats the active profile's value as decimal for a game display; this trace does not identify its player-facing label."},
        "rule": "A profile ID above 0x42 exits before indexing. For IDs 1..0x42, the per-profile callback counter increments, saturating at 0x03E8. Separately, current raw size is compared against that ID's prior best at $0DC8. Equal or smaller sizes leave the best size and recorded area unchanged. A strictly larger size replaces the best and writes the current area to that species' single area slot.",
        "notebookPages": "The notebook scans all area words and appends the species index for values 1..6. Its six metadata values are cumulative byte endpoints into the shared list; derive each page count as (current endpoint - previous endpoint) / 2. The six rendered formulas are area 1: 2A8E/2; area 2: (2A90-2A8E)/2; area 3: (2A92-2A90)/2; area 4: (2A94-2A92)/2; area 5: (2A96-2A94)/2; area 6: (2A98-2A96)/2. Each divides a byte boundary difference by two to get the number of two-byte species entries. Thus one species appears on at most one area page at a time; a later personal best in another area moves that entry instead of creating a second copy. These are current saved-record counts, not the guide route's first-occurrence additions or each area's total available fish.",
        "checks": checks,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("rom", type=Path)
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
