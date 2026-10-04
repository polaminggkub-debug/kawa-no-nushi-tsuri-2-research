#!/usr/bin/env python3
"""Derive the notebook collection route from the supplied Japanese ROM."""

from __future__ import annotations

import argparse
import hashlib
import json
from collections import Counter, defaultdict
from pathlib import Path


ROM_SIZE = 1_572_864
ROM_SHA1 = "c2103dd94e2a1a65a495fc02adc2e7d040f31212"
FISH_TABLE_BASE = 0x064800
ROWS_PER_MAP = 256
MAP_STRIDE = ROWS_PER_MAP * 2
NOTEBOOK_LIMIT = 0x42
NOTEBOOK_UPDATER_OFFSET = 0x008B00
NOTEBOOK_UPDATER_BYTES = bytes.fromhex(
    "ad e8 11 c9 42 00 f0 03 90 01 60 3a 0a aa bd 4c 0e "
    "c9 e8 03 b0 04 1a 9d 4c 0e bd c8 0d cd b1 1e 90 01 60"
)
STAGE_NAMES = {
    "01": {"en": "Mountain Stream", "ja": "渓流", "th": "ลำธารบนภูเขา"},
    "02": {"en": "Mountain Lake", "ja": "山上湖", "th": "ทะเลสาบบนภูเขา"},
    "03": {"en": "Clear Stream", "ja": "清流", "th": "ลำธารใส"},
    "04": {"en": "Lake", "ja": "湖", "th": "ทะเลสาบ"},
    "05": {"en": "Downstream", "ja": "下流", "th": "แม่น้ำตอนล่าง"},
    "06": {"en": "River Mouth", "ja": "河口", "th": "ปากแม่น้ำ"},
}


def verify_rom(rom: bytes) -> None:
    digest = hashlib.sha1(rom).hexdigest()
    if len(rom) != ROM_SIZE or digest != ROM_SHA1:
        raise ValueError(
            f"Expected the supplied Japanese ROM ({ROM_SIZE} bytes, SHA-1 "
            f"{ROM_SHA1}); received {len(rom)} bytes, SHA-1 {digest}."
        )
    actual = rom[NOTEBOOK_UPDATER_OFFSET : NOTEBOOK_UPDATER_OFFSET + len(NOTEBOOK_UPDATER_BYTES)]
    if actual != NOTEBOOK_UPDATER_BYTES:
        raise ValueError("The ROM notebook eligibility/updater fingerprint changed.")


def load_names(path: Path) -> dict[str, str]:
    source = json.loads(path.read_text(encoding="utf-8"))
    if source.get("rom", {}).get("sha1") != ROM_SHA1:
        raise ValueError("Fish-name source is not derived from the expected ROM.")
    return {fish_id.upper(): fish["nameJa"] for fish_id, fish in source["fish"].items()}


def read_map_species(rom: bytes, names: dict[str, str]) -> list[dict]:
    stages = []
    for stage_number in range(1, 7):
        base = FISH_TABLE_BASE + (stage_number - 1) * MAP_STRIDE
        row_ids = [
            int.from_bytes(rom[base + row * 2 : base + row * 2 + 2], "little")
            for row in range(ROWS_PER_MAP)
        ]
        present = sorted({fish_id for fish_id in row_ids if fish_id}, key=int)
        unknown = [fish_id for fish_id in present if f"{fish_id:02X}" not in names]
        if unknown:
            raise ValueError(f"Map {stage_number:02d} has unmapped fish IDs: {unknown}")
        stages.append(
            {
                "stage": stage_number,
                "mapSet": f"{stage_number:02d}",
                "configuredSpawnRows": sum(fish_id != 0 for fish_id in row_ids),
                "speciesIds": [f"{fish_id:02X}" for fish_id in present],
                "rowCounts": dict(Counter(f"{fish_id:02X}" for fish_id in row_ids if fish_id)),
            }
        )
    return stages


def collect_memberships(stages: list[dict]) -> dict[str, list[dict]]:
    memberships: dict[str, list[dict]] = defaultdict(list)
    for stage in stages:
        for fish_id in stage["speciesIds"]:
            memberships[fish_id].append(
                {"stage": stage["stage"], "configuredSpawnRows": stage["rowCounts"][fish_id]}
            )
    return memberships


def build_species(names: dict[str, str], memberships: dict[str, list[dict]]) -> dict:
    species = {}
    for fish_id in sorted(memberships, key=lambda value: int(value, 16)):
        history = memberships[fish_id]
        species[fish_id] = {
            "nameJaFromRom": names[fish_id],
            "notebookEligible": int(fish_id, 16) <= NOTEBOOK_LIMIT,
            "stages": [entry["stage"] for entry in history],
            "configuredSpawnRowsByStage": {
                f"{entry['stage']:02d}": entry["configuredSpawnRows"] for entry in history
            },
            "firstOccurrenceStage": history[0]["stage"],
        }
    return species


def annotate_stages(stages: list[dict]) -> None:
    first_seen: set[str] = set()
    for stage in stages:
        all_ids = stage["speciesIds"]
        eligible = [fish_id for fish_id in all_ids if int(fish_id, 16) <= NOTEBOOK_LIMIT]
        additions = [fish_id for fish_id in eligible if fish_id not in first_seen]
        repeats = [fish_id for fish_id in eligible if fish_id in first_seen]
        excluded = [fish_id for fish_id in all_ids if int(fish_id, 16) > NOTEBOOK_LIMIT]
        stage.update(
            {
                "name": STAGE_NAMES[stage["mapSet"]],
                "recordableSpeciesCount": len(eligible),
                "allConfiguredProfileSpeciesCount": len(all_ids),
                "firstOccurrenceCount": len(additions),
                "firstOccurrenceSpecies": additions,
                "species": eligible,
                "repeatedFromEarlierStages": repeats,
                "excludedFromNotebook": excluded,
            }
        )
        first_seen.update(additions)


def make_result(rom: bytes, names: dict[str, str], stages: list[dict]) -> dict:
    species = build_species(names, collect_memberships(stages))
    annotate_stages(stages)
    eligible_ids = {fish_id for fish_id in species if int(fish_id, 16) <= NOTEBOOK_LIMIT}
    mapped_eligible = sorted(eligible_ids, key=lambda value: int(value, 16))
    expected_ids = [f"{fish_id:02X}" for fish_id in range(1, NOTEBOOK_LIMIT + 1)]
    if mapped_eligible != expected_ids:
        missing = sorted(set(expected_ids) - eligible_ids)
        raise ValueError(f"Configured map tables do not cover all notebook IDs; missing {missing}")
    return {
        "schemaVersion": 1,
        "rom": {"sizeBytes": len(rom), "sha1": ROM_SHA1},
        "scope": "Unique fish profiles in the six ROM spawn tables, filtered by the notebook record updater's accepted fish-ID range. Configured spawn rows are not a promise that each fish is active in every generated state.",
        "recordRule": {
            "notebookSlots": 66,
            "eligibleFishIds": "01-42",
            "updaterCpu": "01:8B00..8C8F",
            "updaterFileOffset": "0x008B00",
            "updaterFingerprint": NOTEBOOK_UPDATER_BYTES.hex(" "),
            "recordSlotIndex": "fishId - 1",
            "areaUpdate": "When the updater runs, it stores the current stage only if the current raw-size value strictly exceeds that species' previous recorded size. A later, larger value in another stage moves that species' single notebook entry to the later stage.",
            "repeatMeaning": "A species appearing in another stage does not create a second notebook slot. The stored stage changes only when the updater runs with a new raw-size record.",
            "triggerLimit": "The static caller trace does not prove whether the updater runs only after a landed catch or can run after another fishing outcome. This dataset identifies eligible species and spawn areas, not the exact in-game event needed to record them.",
        },
        "guideRule": "Use firstOccurrenceSpecies in stage order to find every notebook-eligible fish profile once. This covers the 66 IDs present in the six ROM maps; it is not a promise to keep every notebook page simultaneously filled, and static table data does not establish the exact event that writes a record.",
        "stages": stages,
        "species": species,
        "totals": {
            "notebookEligibleSpecies": len(mapped_eligible),
            "configuredSpeciesAcrossSixMaps": len(species),
            "uniqueFirstOccurrenceAdditions": sum(stage["firstOccurrenceCount"] for stage in stages),
            "nonNotebookSpeciesIds": sorted(
                [fish_id for fish_id in species if int(fish_id, 16) > NOTEBOOK_LIMIT],
                key=lambda value: int(value, 16),
            ),
            "unmappedNotebookIds": [],
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--rom", required=True, type=Path)
    parser.add_argument("--locations", type=Path, default=Path("data/rom-fish-locations.json"))
    parser.add_argument("--output", type=Path, default=Path("data/notebook-completion.json"))
    args = parser.parse_args()

    rom = args.rom.read_bytes()
    verify_rom(rom)
    names = load_names(args.locations)
    stages = read_map_species(rom, names)
    result = make_result(rom, names, stages)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(
        f"wrote {args.output}: {result['totals']['notebookEligibleSpecies']} notebook fish; "
        f"{result['totals']['configuredSpeciesAcrossSixMaps']} configured profiles across six maps"
    )


if __name__ == "__main__":
    main()
