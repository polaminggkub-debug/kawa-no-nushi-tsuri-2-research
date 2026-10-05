#!/usr/bin/env python3
"""Verify original-ROM town routing to the custom-fly maker."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

ROM_SIZE = 1_572_864
ROM_SHA1 = "c2103dd94e2a1a65a495fc02adc2e7d040f31212"
ROM_SHA256 = "e0594921a5a2ef1a2613b9d2e29fed066569e3793393c591bf4c4968a54c0b49"


def rom_offset(address: int) -> int:
    bank, cpu = address >> 16, address & 0xFFFF
    if not 0x8000 <= cpu <= 0xFFFF:
        raise ValueError(f"Invalid LoROM address: {address:06X}")
    return bank * 0x8000 + cpu - 0x8000


def fingerprint(rom: bytes, address: int, expected_hex: str) -> dict[str, str]:
    expected = bytes.fromhex(expected_hex)
    actual = rom[rom_offset(address):rom_offset(address) + len(expected)]
    if actual != expected:
        location = f"${address >> 16:02X}:{address & 0xFFFF:04X}"
        raise ValueError(f"ROM mismatch at {location}: {actual.hex(' ')}")
    return {
        "cpu": f"${address >> 16:02X}:{address & 0xFFFF:04X}",
        "fileOffset": f"0x{rom_offset(address):06X}",
        "bytes": actual.hex(" "),
    }


def word(rom: bytes, offset: int) -> int:
    return int.from_bytes(rom[offset:offset + 2], "little")


def pair(rom: bytes, offset: int) -> dict[str, int]:
    return {"x": word(rom, offset), "y": word(rom, offset + 2)}


def town_objects(rom: bytes) -> list[dict[str, object]]:
    records = []
    for town_map in range(7, 13):
        pointer_offset = 0x3D76 + 2 * (town_map - 1)
        pointer = word(rom, pointer_offset)
        object_offset = pointer - 0x8000
        records.append({
            "townMapId": town_map,
            "pointer": f"0x{pointer:04X}",
            "pointerFileOffset": f"0x{pointer_offset:06X}",
            "normalShopTile": pair(rom, object_offset),
            "slot10Tile": pair(rom, object_offset + 0x10),
            "slot10FileOffset": f"0x{object_offset + 0x10:06X}",
            "slot10Mode": 3 if town_map < 10 else 7,
            "slot10Handler": "03:9517" if town_map < 10 else "03:86E1",
        })
    return records


def fingerprints(rom: bytes) -> list[dict[str, str]]:
    checks = [
        (0x009E16, "ad 5a 08 69 06 00 8d 5a 08"),
        (0x00CF05, "c9 10 00 d0 13 ad 5a 08 c9 0a 00 b0 05 a9 03 00 80 03 a9 07 00 4c 25 cf"),
        (0x038085, "c9 03 00 d0 06 20 17 95 4c bc 80"),
        (0x0380B1, "c9 07 00 d0 06 20 e1 86 4c bc 80"),
        (0x039521, "ad 5a 08 29 01 00 f0 08 a9 21 00 8d 4e 08 80 06 a9 22 00 8d 4e 08"),
        (
            0x039581,
            "20 69 cc ad 33 1d c9 00 00 d0 13 ad 5a 08 29 01 00 f0 05 20 dd 95 80 03 20 ea 95",
        ),
        (0x03959F, "c9 01 00 d0 13 ad 5a 08 29 01 00 f0 05 20 e2 95 80 03 20 f2 95"),
        (0x0395B7, "c9 02 00 d0 06 20 fa 95 4c c2 95"),
        (0x0395DD, "9c 3b 1d"),
        (0x0395E2, "a9 01 00 8d 3b 1d"),
        (0x0395EA, "a9 02 00 8d 3b 1d"),
        (0x0395F2, "a9 03 00 8d 3b 1d"),
        (0x0395FA, "a9 04 00 8d 3b 1d"),
        (0x00BD82, "82 c0"),
        (0x00BD84, "c4 c0"),
        (0x00BD86, "dc c0"),
        (0x00C082, "07 00 18 00"),
        (0x00C092, "05 00 14 00"),
        (0x00C0C4, "07 00 17 00"),
        (0x00C0D4, "05 00 18 00"),
        (0x00C0EC, "0a 00 16 00"),
        (0x009FBD, "0c 00 b6 00"),
        (0x009FD5, "5b 00 19 00"),
        (0x009FED, "14 00 56 00"),
        (0x00A04D, "07 00 1d 00"),
    ]
    return [fingerprint(rom, address, expected) for address, expected in checks]


def validate_town_objects(towns: list[dict[str, object]]) -> None:
    pointers = [0xC082, 0xC0C4, 0xC0DC, 0xC0F4, 0xC10C, 0xC124]
    shops = [(7, 24), (7, 23), (7, 24), (7, 23), (7, 24), (8, 23)]
    slot10 = [(5, 20), (5, 24), (10, 22), (8, 74), (7, 74), (7, 74)]
    for index, town in enumerate(towns):
        if int(town["pointer"], 16) != pointers[index]:
            raise ValueError(f"Unexpected town-object pointer for map {town['townMapId']}")
        for key, expected in (("normalShopTile", shops[index]), ("slot10Tile", slot10[index])):
            tile = town[key]
            if (tile["x"], tile["y"]) != expected:
                raise ValueError(f"Unexpected {key} for map {town['townMapId']}")


def entrance_coordinates(
    rom: bytes,
) -> tuple[dict[str, int], dict[str, int], dict[str, int], dict[str, int]]:
    area1 = pair(rom, 0x1FBD)
    area2 = pair(rom, 0x1FD5)
    area3 = pair(rom, 0x1FED)
    arrival = pair(rom, 0x204D)
    if (area1["x"], area1["y"]) != (12, 182):
        raise ValueError("Area 1 entrance #2 coordinate changed")
    if (area2["x"], area2["y"]) != (91, 25):
        raise ValueError("Area 2 entrance #2 coordinate changed")
    if (area3["x"], area3["y"]) != (20, 86):
        raise ValueError("Area 3 entrance #2 coordinate changed")
    if (arrival["x"], arrival["y"]) != (7, 29):
        raise ValueError("Town arrival #2 coordinate changed")
    return area1, area2, area3, arrival


def access_entry(
    rom: bytes,
    town: dict[str, object],
    stage: int,
    entrance_tile: dict[str, int],
    arrival: dict[str, int],
    family_ids: list[int],
    family_names: list[str],
    captured_here: bool,
) -> dict[str, object]:
    pointer = int(town["pointer"], 16)
    tile = pair(rom, pointer - 0x8000 + 0x10)
    return {
        "stage": stage,
        "townMapId": stage + 6,
        "interactionSlotHex": "10",
        "makerTile": tile,
        "normalShopTile": town["normalShopTile"],
        "entrance": {"ordinal": 1, "entranceNumber": 2, "fieldTile": entrance_tile,
                     "townArrival": {"mapId": stage + 6, **arrival}},
        "familyIds": family_ids,
        "familyNames": family_names,
        "evidenceHref": "../docs/fly-maker-access-research.md",
        "limits": {
            "makerMenuCapturedAtThisStage": captured_here,
            "naturalWalkVerified": False,
            "storyUnlockVerified": False,
            "questGateFoundInMakerDispatch": False,
            "questGateScope": (
                "Maker dispatch and chooser only; campaign progression is not established."
            ),
        },
    }


def family_component_counts(rom: bytes) -> dict[str, dict[str, int]]:
    families = {}
    for family in (2, 3):
        counts = {}
        for part_name, part_id in (("body", 0), ("wing", 1), ("tail", 2)):
            counts[part_name] = sum(
                rom[0x2AA52 + row * 11] == family
                and rom[0x2AA52 + row * 11 + 1] == part_id
                for row in range(0x86)
            )
        families[f"{family:02X}"] = counts
    expected = {"02": {"body": 9, "wing": 8, "tail": 4},
                "03": {"body": 10, "wing": 4, "tail": 7}}
    if families != expected:
        raise ValueError("Diptera/Stonefly ROM component count changed")
    return families


def family_options() -> dict[str, object]:
    odd = [
        {"familyId": "00", "name": "Mayfly"},
        {"familyId": "01", "name": "Caddis"},
        {"familyId": "04", "name": "Terrestrial"},
    ]
    even = [
        {"familyId": "02", "name": "Diptera"},
        {"familyId": "03", "name": "Stonefly"},
        {"familyId": "04", "name": "Terrestrial"},
    ]
    return {
        "selector": "$085A & 1",
        "odd": odd,
        "even": even,
        "oddLabelCapture": "Area 1 original-ROM runtime capture",
        "evenLabelCapture": "Controlled $085A=02 fixture, not a natural Area 2 walk.",
        "cursorFamilyKeys": {
            "odd": ["00", "01", "04"],
            "even": ["02", "03", "04"],
            "source": "$03:9581..95FF writes family key $1D3B by cursor and map parity.",
        },
    }


def source_index(
    evidence: list[dict[str, str]], counts: dict[str, dict[str, int]]
) -> dict[str, object]:
    return {
        "townObjectPointerTable": (
            "$00:BD76; slot 08 starts at object record; slot 10 is +0x10 bytes."
        ),
        "fieldEntranceTable": (
            "$00:9FB9; groups are 0x18 bytes; Area 1/2/3 entrance #2 at "
            "$00:9FBD/$00:9FD5/$00:9FED."
        ),
        "townArrivalTable": "$00:A049; entrance #2 is $00:A04D.",
        "makerFamilyBranch": (
            "$03:9521 tests $085A bit 0; even sets chooser state $21, odd sets $22."
        ),
        "interactionModeDispatch": (
            "$03:8085 routes mode 3 to $03:9517; $03:80B1 routes mode 7 to $03:86E1."
        ),
        "townMapTransition": "$00:9E16 adds six to the outdoor map ID before storing $085A.",
        "townNpcModeDispatch": (
            "$00:CF05 sends slot 10 to mode 3 for map IDs below 10; otherwise mode 7."
        ),
        "dipteraStoneflyROMPartCounts": counts, "fingerprints": evidence,
    }


def build(rom: bytes) -> dict[str, object]:
    sha1, sha256 = hashlib.sha1(rom).hexdigest(), hashlib.sha256(rom).hexdigest()
    if len(rom) != ROM_SIZE or sha1 != ROM_SHA1 or sha256 != ROM_SHA256:
        raise ValueError("Requires the supplied headerless Japanese original ROM")
    towns = town_objects(rom)
    validate_town_objects(towns)
    area1_entrance, area2_entrance, area3_entrance, arrival = entrance_coordinates(rom)
    area1 = access_entry(
        rom, towns[0], 1, area1_entrance, arrival,
        [0, 1, 4], ["Mayfly", "Caddis", "Terrestrial"], True,
    )
    area2 = access_entry(
        rom, towns[1], 2, area2_entrance, arrival,
        [2, 3, 4], ["Diptera", "Stonefly", "Terrestrial"], False,
    )
    area2["familyOptionsAtEvenMaker"] = family_options()["even"]
    area3 = access_entry(
        rom, towns[2], 3, area3_entrance, arrival,
        [0, 1, 4], ["Mayfly", "Caddis", "Terrestrial"], False,
    )
    return {
        "schemaVersion": 1,
        "rom": {"sizeBytes": len(rom), "sha1": sha1, "sha256": sha256},
        "area1OddFamilyAccess": area1,
        "area2DipteraStoneflyAccess": area2,
        "area3OddFamilyAccess": area3,
        "accessByStage": {"1": area1, "2": area2, "3": area3},
        "townSlot10Routing": towns,
        "accessByFamily": {
            "0": area1,
            "1": area1,
            "4": area1,
            "2": area2,
            "3": area2,
        },
        "familyOptionsByParity": family_options(),
        "sources": source_index(fingerprints(rom), family_component_counts(rom)),
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
