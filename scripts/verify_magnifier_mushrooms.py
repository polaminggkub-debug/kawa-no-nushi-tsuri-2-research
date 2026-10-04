#!/usr/bin/env python3
"""Verify the original-ROM magnifier mushroom branch and its shared PRNG."""

from __future__ import annotations

import argparse
import hashlib
from collections import Counter
from pathlib import Path
import sys


ROM_SIZE = 1_572_864
ROM_SHA1 = "c2103dd94e2a1a65a495fc02adc2e7d040f31212"
ROM_SHA256 = "e0594921a5a2ef1a2613b9d2e29fed066569e3793393c591bf4c4968a54c0b49"


def lorom_offset(bank: int, address: int) -> int:
    if not 0 <= bank <= 0x7D or not 0x8000 <= address <= 0xFFFF:
        raise ValueError(f"not a LoROM ROM address: {bank:02X}:{address:04X}")
    return bank * 0x8000 + address - 0x8000


def check_bytes(rom: bytes, bank: int, address: int, expected_hex: str, label: str) -> bytes:
    expected = bytes.fromhex(expected_hex)
    offset = lorom_offset(bank, address)
    actual = rom[offset : offset + len(expected)]
    if actual != expected:
        raise ValueError(
            f"fingerprint mismatch at {bank:02X}:{address:04X} ({label}): "
            f"expected {expected.hex(' ')}, got {actual.hex(' ')}"
        )
    return actual


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("rom", type=Path, help="path to the original Japanese SFC ROM")
    args = parser.parse_args()

    rom = args.rom.read_bytes()
    sha1 = hashlib.sha1(rom).hexdigest()
    sha256 = hashlib.sha256(rom).hexdigest()
    if len(rom) != ROM_SIZE or sha1 != ROM_SHA1 or sha256 != ROM_SHA256:
        print(
            f"ROM mismatch: size={len(rom)} SHA-1={sha1} SHA-256={sha256}",
            file=sys.stderr,
        )
        return 2

    # Use-item dispatcher: selected item 03 calls the magnifier handler.
    check_bytes(
        rom,
        0x03,
        0xBC6F,
        "c9 03 00 d0 06 20 bd bd 4c 2e bd",
        "selected item 03 dispatch",
    )

    # Magnifier entry: field state check, movement-state checks, then position cache.
    check_bytes(
        rom,
        0x03,
        0xBDBD,
        "ad 34 08 c9 02 00 f0 06 20 85 c6 60 80 18 "
        "ad 58 08 c9 03 00 90 04 20 96 c6 60 "
        "ad 58 08 c9 01 00 d0 04 20 96 c6 60 "
        "ad 5c 08 cd 49 1d d0 0b ad 5e 08 cd 4b 1d d0 03 4c 19 bf",
        "magnifier field/movement/duplicate-tile gates",
    )

    # Maps with area ID > 12 take this separate draw path. Areas 7-12 instead
    # pass through the y-high-nibble check and do not enter the mushroom branch.
    check_bytes(
        rom,
        0x03,
        0xBE02,
        "ad 5a 08 c9 06 00 f0 02 b0 69",
        "area 6 boundary",
    )
    check_bytes(
        rom,
        0x03,
        0xBE75,
        "c9 0c 00 f0 02 b0 16 ad 5e 08 29 f0 00 c9 10 00 "
        "d0 05 a9 0d 00 80 03 4c 19 bf 4c a6 be "
        "22 92 da 00 29 01 00 f0 05 a9 0a 00 80 03 4c da be 4c a6 be",
        "area 12/13+ and area 7-12 y gate",
    )

    # The first low-bit draw on area IDs 13+ selects bait 0A on bit 1, or
    # continues into the food-slot and mushroom branch on bit 0.
    check_bytes(
        rom,
        0x03,
        0xBE92,
        "22 92 da 00 29 01 00 f0 05 a9 0a 00 80 03 4c da be 4c a6 be",
        "first draw: bait-versus-food branch",
    )
    check_bytes(
        rom,
        0x03,
        0xBEDA,
        "ad 58 0b f0 03 4c 19 bf",
        "food-slot availability gate",
    )

    # Exact second draw: zero selects food ID 0A; one selects food ID 09.
    check_bytes(
        rom,
        0x03,
        0xBEE2,
        "22 92 da 00 29 01 00 f0 05 a9 09 00 80 03 a9 0a 00 8d 88 12",
        "mushroom ID selection at BEE2",
    )
    check_bytes(
        rom,
        0x03,
        0xBEF3,
        "8d 88 12 a0 00 00 b9 3a 0b f0 04 c8 c8 80 f7 ad 88 12 99 3a 0b "
        "a9 1c 00 8d a8 16 a0 48 01 20 0d d3 22 04 80 02 60",
        "store selected food in first free food slot and show message 0148",
    )

    # DA92 is a trampoline. EDE9 advances a WRAM counter and indexes a ROM
    # table; it does not read the current tile or map coordinates.
    check_bytes(rom, 0x00, 0xDA92, "20 e9 ed 6b", "shared random-byte trampoline")
    check_bytes(
        rom,
        0x00,
        0xEDE9,
        "ee ae 16 ad ae 16 29 ff 00 aa bd fa ed 29 ff 00 60",
        "counter-based random-byte lookup",
    )
    table = rom[lorom_offset(0x00, 0xEDFA) : lorom_offset(0x00, 0xEDFA) + 0x100]
    table_sha256 = hashlib.sha256(table).hexdigest()
    parity = Counter(value & 1 for value in table)
    if len(table) != 0x100 or len(set(table)) != 0x100:
        raise ValueError("random lookup table is not the expected 256-byte permutation")
    if parity != Counter({0: 128, 1: 128}):
        raise ValueError(f"unexpected lookup-table low-bit counts: {dict(parity)}")
    if table_sha256 != "a55490a3bd21b09c02cb237002e5a6cbddba52d3080a0e077f2f44b2d4f9e2d0":
        raise ValueError(f"unexpected lookup-table SHA-256: {table_sha256}")

    # The separate bait grant draw masks two low bits and adds one, producing
    # quantity 1..4. This does not control the food-ID branch above.
    check_bytes(
        rom,
        0x03,
        0xBFDE,
        "22 92 da 00 29 03 00 1a 8d 7b 1a",
        "bait quantity draw",
    )

    print(f"ROM verified: {len(rom)} bytes, SHA-1 {sha1}, SHA-256 {sha256}")
    print("Use route: selected item 03 -> 03:BDBD magnifier handler")
    print("Area gate: area IDs 13+ take the bait/food draw; area IDs 7-12 use the y-nibble branch")
    print("First draw low bit: 1 -> bait 0A; 0 -> food-slot check then mushroom draw")
    print("Mushroom draw at 03:BEE2 low bit: 1 -> food 09; 0 -> food 0A")
    print("Shared byte source: increment WRAM 7E:16AE, index 256-byte ROM table at 00:EDFA")
    print(f"Table SHA-256: {table_sha256}; values are unique; low-bit counts={dict(sorted(parity.items()))}")
    print("Bait grant quantity is a separate draw: (byte & 3) + 1 = 1..4")
    print("All requested ROM fingerprints passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
