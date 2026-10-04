#!/usr/bin/env python3
"""Extract water-marker classes and their mapped fish from the original ROM."""

from __future__ import annotations

import argparse
import hashlib
import json
from collections import defaultdict
from pathlib import Path


ROM_SIZE = 1_572_864
ROM_SHA1 = "c2103dd94e2a1a65a495fc02adc2e7d040f31212"
PROFILE_BASE = 0x028018
PROFILE_STRIDE = 23
PROFILE_COUNT = 0x49
BAIT_BASE = 0x029E67
BAIT_STRIDE = 12
FISH_TABLE_BASE = 0x064800
MAP_TABLE_STRIDE = 0x200
ROWS_PER_MAP = 256
SIZE_THRESHOLD = 50
POTATO_BAIT_ID = 0x11
KATAKANA = (
    "アイウエオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトド"
    "ナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロワヲン"
)
FISH_GLYPHS = {0x5E + index: char for index, char in enumerate(KATAKANA)}
FISH_GLYPHS[0xAA] = "ー"
PUBLICATION_DIR = Path(__file__).resolve().parents[1]
RNG_SEED_A = 0x7B
RNG_SEED_B = 0x34


def read_word(rom: bytes, offset: int) -> int:
    return int.from_bytes(rom[offset : offset + 2], "little")


def cpu_offset(bank: int, address: int) -> int:
    return (bank & 0x7F) * 0x8000 + (address & 0x7FFF)


def decode_fish_name(rom: bytes, profile_offset: int) -> str:
    pointer = read_word(rom, profile_offset + 17)
    start = 0x20000 + pointer
    end = rom.index(0, start, min(start + 64, len(rom)))
    return "".join(FISH_GLYPHS.get(char, f"<{char:02X}>") for char in rom[start:end])


def phase_range(profile: bytes) -> tuple[int | None, int | None, int]:
    base_half = profile[0] // 2
    cap = profile[1]
    if base_half == 0:
        return None, None, cap
    if 2 * base_half - 1 > cap:
        raise ValueError("Fish profile has an unsupported size range.")
    return base_half, 2 * base_half - 1, cap


def marker_class(
    profile: bytes, initial_min: int | None, initial_max: int | None, cap: int
) -> tuple[bool, list[str]]:
    mask = read_word(profile, 15)
    bubble = bool(mask & 0x0100)
    if bubble:
        return True, ["bubble"]
    classes = ["small"] if initial_min is not None and initial_min < SIZE_THRESHOLD else []
    if initial_max is not None and (initial_max >= SIZE_THRESHOLD or cap >= SIZE_THRESHOLD):
        classes.append("large")
    return False, classes


def size_rng_cycle() -> list[int]:
    a, b = RNG_SEED_A, RNG_SEED_B
    initial = (a, b)
    seen: set[tuple[int, int]] = set()
    outputs = []
    while (a, b) not in seen:
        seen.add((a, b))
        feedback = b ^ (0x80 if b & 0x10 else 0)
        carry = feedback >> 7
        b = ((feedback << 1) & 0xFF) | carry
        a = (a + b) & 0xFF
        outputs.append(a)
    if (a, b) != initial or set(outputs) != set(range(256)):
        raise ValueError("ROM size generator no longer cycles through every output byte.")
    return outputs


def profile_data(rom: bytes, fish_id: int) -> dict:
    offset = PROFILE_BASE + (fish_id - 1) * PROFILE_STRIDE
    profile = rom[offset : offset + PROFILE_STRIDE]
    name = decode_fish_name(rom, offset)
    base_half, initial_max, cap = phase_range(profile)
    initial_min = base_half
    bubble, classes = marker_class(profile, initial_min, initial_max, cap)
    mask = read_word(profile, 15)
    return {
        "fishId": f"{fish_id:02X}",
        "nameJa": name,
        "profileFileOffset": f"0x{offset:06X}",
        "profilePlus0": profile[0],
        "baseHalf": base_half,
        "cap": cap,
        "initialRawSizeRangeCm": [base_half, initial_max] if base_half is not None else None,
        "reachableRawSizeRangeCmBeforeReset": [base_half, cap] if base_half is not None else None,
        "profileWordPlus15Plus16": f"0x{mask:04X}",
        "bubble": bubble,
        "possibleClasses": classes,
        "potatoBaitMaskCompatible": bubble,
    }


def map_rows(rom: bytes) -> tuple[list[dict], dict[str, list[dict]]]:
    maps = []
    placements: dict[str, list[dict]] = defaultdict(list)
    for map_index in range(6):
        table = FISH_TABLE_BASE + map_index * MAP_TABLE_STRIDE
        rows: dict[int, list[int]] = defaultdict(list)
        for row in range(ROWS_PER_MAP):
            fish_id = read_word(rom, table + row * 2)
            if fish_id == 0:
                continue
            if fish_id > PROFILE_COUNT:
                raise ValueError(f"Map set {map_index + 1:02d} has unknown fish ID {fish_id}.")
            rows[fish_id].append(row)
        entries = []
        map_id = f"{map_index + 1:02d}"
        for fish_id, indices in sorted(rows.items()):
            key = f"{fish_id:02X}"
            entries.append({
                "fishId": key,
                "configuredSpawnRows": len(indices),
                "spawnRowIndices": indices,
            })
            placements[key].append({
                "mapSet": map_id,
                "configuredSpawnRows": len(indices),
                "spawnRowIndices": indices,
            })
        maps.append({"mapSet": map_id, "fish": entries})
    return maps, placements


def fingerprint(rom: bytes, bank: int, start: int, end: int) -> dict:
    offset = cpu_offset(bank, start)
    code = rom[offset : offset + end - start]
    return {
        "cpuRangeInclusive": f"{bank:02X}:{start:04X}..{bank:02X}:{end - 1:04X}",
        "fileOffset": f"0x{offset:06X}",
        "byteCount": len(code),
        "sha256": hashlib.sha256(code).hexdigest(),
    }


def build_profiles(rom: bytes, placements: dict[str, list[dict]]) -> dict:
    profiles = {}
    for fish_id in range(1, PROFILE_COUNT + 1):
        key = f"{fish_id:02X}"
        record = profile_data(rom, fish_id)
        map_entries = placements.get(key, [])
        record["mapStages"] = [entry["mapSet"] for entry in map_entries]
        record["mapPlacements"] = map_entries
        profiles[key] = record
    return profiles


def build_evidence(rom: bytes, potato_offset: int, potato_mask: int) -> dict:
    return {
        "fishProfileTable": {
            "cpuBase": "05:8018",
            "fileOffset": f"0x{PROFILE_BASE:06X}",
            "strideBytes": PROFILE_STRIDE,
            "recordCount": PROFILE_COUNT,
        },
        "fishIdMapTables": {
            "cpuBases": ["0C:C800", "0C:CA00", "0C:CC00", "0C:CE00", "0C:D000", "0C:D200"],
            "fileOffset": f"0x{FISH_TABLE_BASE:06X}",
            "rowsPerMap": ROWS_PER_MAP,
            "rowStrideBytes": 2,
        },
        "potatoBait": {
            "id": f"{POTATO_BAIT_ID:02X}",
            "nameJa": "イモ",
            "cpuAddress": "05:9F27",
            "fileOffset": f"0x{potato_offset:06X}",
            "compatibilityMask": f"0x{potato_mask:04X}",
        },
        "sizeAndCatch": {
            "markerSelectorCpu": "04:C369..C3D4",
            "sizeInitializationCpu": "03:83AA..83DF",
            "sizeGrowthCpu": "04:EC56..EC8B",
            "profileLoaderCpu": "03:D26D",
            "catchStoresSameSizeCpu": "04:8717..871B",
            "keepnetDisplaysSizeAsCm": "02:AA5F..AA7A",
        },
        "byteFingerprints": [
            fingerprint(rom, 4, 0xC369, 0xC3D5),
            fingerprint(rom, 3, 0x83AA, 0x83E0),
            fingerprint(rom, 4, 0xEC56, 0xEC8C),
            fingerprint(rom, 0, 0xEEFA, 0xEF1A),
            fingerprint(rom, 0, 0xDF93, 0xDF9F),
        ],
        "sizeDisplayEvidence": "ROM code copies the selected size directly to the keepnet record and formats that integer as centimetres; the water marker itself divides it at 50.",
        "sizeRngResetSeeds": {"$16B0": f"0x{RNG_SEED_A:02X}", "$16B2": f"0x{RNG_SEED_B:02X}"},
    }


def extract(rom: bytes) -> dict:
    digest = hashlib.sha1(rom).hexdigest()
    if len(rom) != ROM_SIZE or digest != ROM_SHA1:
        raise ValueError(f"Requires the matching original Japanese ROM ({ROM_SIZE} bytes; SHA-1 {ROM_SHA1}).")
    potato_offset = BAIT_BASE + (POTATO_BAIT_ID - 1) * BAIT_STRIDE
    potato_mask = read_word(rom, potato_offset + 6)
    if potato_mask != 0x0100:
        raise ValueError("Bait ID 11 no longer has compatibility mask 0x0100.")
    maps, placements = map_rows(rom)
    profiles = build_profiles(rom, placements)
    return {
        "schemaVersion": 1,
        "romSha1": digest,
        "source": {
            "description": "Original headerless Japanese SFC ROM; no external guide data.",
            "sizeBytes": len(rom),
            "sha1": digest,
        },
        "rules": {
            "small": "When a fish object is created, the ordinary marker is small if its stored size is below 50 cm.",
            "large": "When a fish object is created, the ordinary marker is large if its stored size is 50 cm or more.",
            "bubble": "The bubble marker overrides the size marker when fish profile word +15/+16 has bit 0x0100. That is the same compatibility bit used by Bait ID 11 (potato).",
            "rendererSelectors": {"small": "0x006A/0x006B", "large": "0x006C/0x006E", "bubble": "0x007A/0x007B"},
            "initialSize": "On row initialization, size = floor(profile +0 / 2) + (ROM random byte modulo floor(profile +0 / 2)).",
            "growth": "On a later fish-row refresh, the stored size increments by 1 until profile +1; after it exceeds +1, the row value is cleared.",
            "mapScope": "Map sets change which fish profiles and rows are configured. The traced marker selector uses the profile flag or row size; it has no map-number input.",
            "refreshLimit": "The marker class is stored when the fish object is created. Size-growth routines update the row value without directly refreshing that class; exact refresh timing after growth is unresolved.",
            "interpretationLimit": "Marker classes do not guarantee a bite or catch. The bubble marker identifies potato-bait mask compatibility; bait checks and other fishing conditions still apply.",
        },
        "mapSets": maps,
        "profiles": profiles,
        "evidence": build_evidence(rom, potato_offset, potato_mask),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("rom", type=Path, help="Path to the original Japanese .sfc ROM")
    parser.add_argument(
        "--output",
        type=Path,
        default=PUBLICATION_DIR / "data/rom-water-icons.json",
        help="Output JSON path (default: publication/data/rom-water-icons.json)",
    )
    args = parser.parse_args()
    data = extract(args.rom.read_bytes())
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    mapped = sum(bool(profile["mapStages"]) for profile in data["profiles"].values())
    print(f"Wrote {args.output}: {len(data['profiles'])} ROM profiles ({mapped} mapped) across 6 map sets.")


if __name__ == "__main__":
    main()
