#!/usr/bin/env python3
"""Verify bounded original-ROM acquisition evidence for bait 0D."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
ROM_SHA1 = "c2103dd94e2a1a65a495fc02adc2e7d040f31212"
ROM_SHA256 = "e0594921a5a2ef1a2613b9d2e29fed066569e3793393c591bf4c4968a54c0b49"
ROM_SIZE = 1_572_864
RNG_TABLE_SHA256 = "a55490a3bd21b09c02cb237002e5a6cbddba52d3080a0e077f2f44b2d4f9e2d0"


def lorom_offset(bank: int, address: int) -> int:
    if not 0 <= bank <= 0x7D or not 0x8000 <= address <= 0xFFFF:
        raise ValueError(f"not a LoROM address: {bank:02X}:{address:04X}")
    return bank * 0x8000 + address - 0x8000


def check_bytes(rom: bytes, bank: int, address: int, expected: str, label: str) -> None:
    wanted = bytes.fromhex(expected)
    offset = lorom_offset(bank, address)
    actual = rom[offset:offset + len(wanted)]
    if actual != wanted:
        raise ValueError(f"{label} mismatch at {bank:02X}:{address:04X}: {actual.hex(' ')}")


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def verify_rom_identity(rom: bytes) -> str:
    sha1, sha256 = hashlib.sha1(rom).hexdigest(), hashlib.sha256(rom).hexdigest()
    if len(rom) != ROM_SIZE or sha1 != ROM_SHA1 or sha256 != ROM_SHA256:
        raise ValueError(f"wrong ROM: size={len(rom)} SHA-1={sha1} SHA-256={sha256}")
    return sha256


def verify_dispatch_and_gates(rom: bytes) -> None:
    check_bytes(rom, 0x03, 0xBC6F,
                "c9 03 00 d0 06 20 bd bd 4c 2e bd", "item-03 dispatch")
    check_bytes(
        rom, 0x03, 0xBDBD,
        "ad 34 08 c9 02 00 f0 06 20 85 c6 60 80 18 "
        "ad 58 08 c9 03 00 90 04 20 96 c6 60 "
        "ad 58 08 c9 01 00 d0 04 20 96 c6 60 "
        "ad 5c 08 cd 49 1d d0 0b ad 5e 08 cd 4b 1d d0 03 4c 19 bf",
        "magnifier use gates",
    )
    check_bytes(rom, 0x03, 0xBE02,
                "ad 5a 08 c9 06 00 f0 02 b0 69", "map-area split")
    check_bytes(
        rom, 0x03, 0xBE75,
        "c9 0c 00 f0 02 b0 16 ad 5e 08 29 f0 00 c9 10 00 "
        "d0 05 a9 0d 00 80 03 4c 19 bf 4c a6 be",
        "town-area Y-band and bait-0D selection",
    )


def verify_grant_and_random(rom: bytes) -> str:
    check_bytes(
        rom, 0x03, 0xBEA6,
        "8d 10 12 22 46 80 03 a0 00 00 b9 8c 08 cd 10 12 d0 0f "
        "b9 b8 08 c9 09 00 90 05 4c 3d c0 80 02 80 0f c8 c8 c0 24 00 "
        "90 e2 ad ae 08 f0 03 4c 3d c0 20 bc bf 60",
        "bait stack lookup and nine-item cap",
    )
    check_bytes(
        rom, 0x03, 0xBFDE,
        "22 92 da 00 29 03 00 1a 8d 7b 1a a9 09 00 38 f9 b8 08 "
        "cd 7b 1a b0 03 8d 7b 1a 18 b9 b8 08 6d 7b 1a 99 b8 08",
        "one-to-four random draw and cap clamp",
    )
    check_bytes(rom, 0x00, 0xDA92, "20 e9 ed 6b", "random-byte trampoline")
    check_bytes(rom, 0x00, 0xEDE9,
                "ee ae 16 ad ae 16 29 ff 00 aa bd fa ed 29 ff 00 60",
                "random-byte lookup")
    start = lorom_offset(0, 0xEDFA)
    digest = hashlib.sha256(rom[start:start + 0x100]).hexdigest()
    if digest != RNG_TABLE_SHA256:
        raise ValueError("shared random table hash mismatch")
    return digest


def verify_arrival_candidates(rom: bytes) -> None:
    expected = bytes.fromhex(
        "07 00 0d 00 07 00 1d 00 07 00 2d 00 07 00 3d 00 07 00 4d 00"
    )
    if rom[0x2049:0x2049 + len(expected)] != expected:
        raise ValueError("ROM town-arrival table changed")
    arrivals = (ROOT / "data/shop-locations-rom.json")
    data = load_json(arrivals)
    if data["rom"]["sha1"] != ROM_SHA1:
        raise ValueError("town arrival index belongs to a different ROM")
    for index, area in enumerate(data["areas"], start=1):
        if area["townMapId"] != index + 6:
            raise ValueError(f"unexpected town map ID for outdoor area {index}")
        row = next(row for row in area["entrances"] if row["ordinal"] == 1)
        if [row["townArrival"]["x"], row["townArrival"]["y"]] != [7, 29]:
            raise ValueError(f"unexpected ordinal-1 arrival in town map {index + 6}")


def verify_alternative_sources(rom: bytes) -> int:
    sys.path.insert(0, str(ROOT / "scripts"))
    import extract_shop_stock

    stock = extract_shop_stock.extract(rom)
    if stock["romSha1"] != ROM_SHA1 or "bait:0D" in stock["items"]:
        raise ValueError("ROM shop-stock decode unexpectedly offers bait 0D")
    path = ROOT / "data/town-item-acquisition.json"
    raw = path.read_bytes()
    digest = hashlib.sha256(raw).hexdigest()
    if digest != "e7d0ca32bf3beb4f60a4cc5d205729f5745b8044c6887029fbfc0ca7b5fe72ba":
        raise ValueError("town-chest acquisition data hash mismatch")
    chests = json.loads(raw)
    if chests["rom"]["sha1"] != ROM_SHA1 or "bait:0D" in chests["items"]:
        raise ValueError("known town-chest index unexpectedly lists bait 0D")
    return len(stock["areas"])


def verify_item_name() -> None:
    data = load_json(ROOT / "data/items-rom.json")
    bait = next(row for row in data["categories"] if row["id"] == "bait")["entries"]
    item = next(row for row in bait if row["id"] == "0D")
    if item["nameJapanese"] != "ネリエ" or item["maximumStack"] != 9:
        raise ValueError("bait 0D item record changed")
    labels = load_json(ROOT / "data/thai-rom-names.json")["entries"]
    if labels["bait:0D"]["nameTh"] is not None:
        raise ValueError("a verified Thai patched-ROM label now exists; review wording")


def verify_runtime_capture() -> str:
    record = load_json(ROOT / "data/town-paste-bait-evidence.json")
    runtime = record["runtime"]
    if record["romSha1"] != ROM_SHA1 or runtime["mapId"] != 12:
        raise ValueError("runtime provenance mismatch")
    if runtime["injectedWrites"] != [["0x0B5E", [3, 0]]]:
        raise ValueError("runtime tool fixture changed")
    if runtime["before"] != {"id": 0, "count": 0}:
        raise ValueError("runtime seed already had bait")
    if runtime["after"] != {"id": 13, "count": 3}:
        raise ValueError("runtime result changed")
    digest = hashlib.sha256((ROOT / runtime["image"]).read_bytes()).hexdigest()
    if digest != runtime["imageSha256"]:
        raise ValueError("runtime image changed")
    return digest


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("rom", type=Path, help="Privately supplied original Japanese ROM")
    rom = parser.parse_args().rom.read_bytes()
    sha256 = verify_rom_identity(rom)
    verify_dispatch_and_gates(rom)
    rng_digest = verify_grant_and_random(rom)
    verify_arrival_candidates(rom)
    shops = verify_alternative_sources(rom)
    verify_item_name()
    screenshot_digest = verify_runtime_capture()
    print(f"ROM verified: {len(rom):,} bytes, SHA-1 {ROM_SHA1}, SHA-256 {sha256}")
    print("Tool 03 selects bait 0D on town maps 7–12 when Y is 16–31")
    print("Each town's second recorded entrance arrives at (7,29), which qualifies")
    print("Quantity draw is 1–4, clamped to the stack cap of 9")
    print(f"ROM shop-stock decode: no bait 0D in {shops} areas; RNG table {rng_digest}")
    print("Archived controlled runtime example: town map 12 at (7,29), ID 0D count 0 → 3; only tool 03 injected")
    print(f"Runtime capture SHA-256: {screenshot_digest}")
    print("Thai patched-ROM label remains unverified; all checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
