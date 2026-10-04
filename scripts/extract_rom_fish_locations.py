#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Extract fish IDs and map-tile coordinates from the supplied Japanese ROM.

This reports the original ROM tables only. It does not consume the legacy
third-party map-placement notes in publication/data/fish-guides/.
"""
import argparse
import hashlib
import json
from collections import defaultdict
from pathlib import Path


ROM_SIZE = 1_572_864
ROM_SHA1 = "c2103dd94e2a1a65a495fc02adc2e7d040f31212"
FISH_PROFILE_BASE = 0x28018
FISH_PROFILE_STRIDE = 23
FISH_PROFILE_COUNT = 0x49
ROWS_PER_MAP = 256
TABLE_STRIDE = ROWS_PER_MAP * 2
FISH_TABLE_BASE = 0x64800
X_TABLE_BASE = 0x65400
Y_TABLE_BASE = 0x66000

KATAKANA = (
    "アイウエオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトド"
    "ナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロワヲン"
)
FISH_GLYPHS = {0x5E + index: char for index, char in enumerate(KATAKANA)}
FISH_GLYPHS[0xAA] = "ー"


def read_word(rom, offset):
    return int.from_bytes(rom[offset:offset + 2], "little")


def rom_names(rom):
    names = {}
    for index in range(FISH_PROFILE_COUNT):
        fish_id = index + 1
        record = FISH_PROFILE_BASE + index * FISH_PROFILE_STRIDE
        name_pointer = read_word(rom, record + 17)
        name_offset = 0x20000 + name_pointer
        name_end = rom.index(0, name_offset, min(name_offset + 64, len(rom)))
        names[fish_id] = "".join(
            FISH_GLYPHS.get(value, f"<{value:02X}>")
            for value in rom[name_offset:name_end]
        )
    return names


def cpu_address(file_offset):
    bank = file_offset // 0x8000
    within_bank = file_offset % 0x8000
    return f"{bank:02X}:{0x8000 + within_bank:04X}"


def extract(rom):
    digest = hashlib.sha1(rom).hexdigest()
    if len(rom) != ROM_SIZE or digest != ROM_SHA1:
        raise ValueError(
            "Requires the matching headerless Japanese original ROM "
            f"({ROM_SIZE} bytes; SHA-1 {ROM_SHA1})."
        )

    names = rom_names(rom)
    map_sets = []
    locations_by_fish = defaultdict(lambda: defaultdict(list))
    for map_number in range(6):
        fish_offset = FISH_TABLE_BASE + map_number * TABLE_STRIDE
        x_offset = X_TABLE_BASE + map_number * TABLE_STRIDE
        y_offset = Y_TABLE_BASE + map_number * TABLE_STRIDE
        points = []
        for index in range(ROWS_PER_MAP):
            fish_id = read_word(rom, fish_offset + index * 2)
            x = read_word(rom, x_offset + index * 2)
            y = read_word(rom, y_offset + index * 2)
            if fish_id == 0:
                continue
            if fish_id not in names:
                raise ValueError(
                    f"Map set {map_number + 1}, row {index} points to "
                    f"unknown fish profile 0x{fish_id:04X}."
                )
            point = {"index": index, "fishId": f"{fish_id:02X}", "x": x, "y": y}
            points.append(point)
            locations_by_fish[fish_id][map_number + 1].append(
                {"index": index, "x": x, "y": y}
            )

        map_sets.append({
            "mapSet": f"{map_number + 1:02d}",
            "name": None,
            "pointCount": len(points),
            "coordinateUnit": "16px map tile",
            "tables": {
                "fishId": {
                    "cpuBase": cpu_address(fish_offset),
                    "fileOffset": f"0x{fish_offset:06X}",
                    "strideBytes": 2,
                },
                "x": {
                    "cpuBase": cpu_address(x_offset),
                    "fileOffset": f"0x{x_offset:06X}",
                    "strideBytes": 2,
                },
                "y": {
                    "cpuBase": cpu_address(y_offset),
                    "fileOffset": f"0x{y_offset:06X}",
                    "strideBytes": 2,
                },
            },
            "points": points,
        })

    fish = {}
    for fish_id, map_points in sorted(locations_by_fish.items()):
        fish[f"{fish_id:02X}"] = {
            "nameJa": names[fish_id],
            "locations": [
                {
                    "mapSet": f"{map_number:02d}",
                    "points": points,
                }
                for map_number, points in sorted(map_points.items())
            ],
        }

    return {
        "schemaVersion": 1,
        "rom": {
            "description": "User-supplied headerless Japanese SFC original",
            "sizeBytes": len(rom),
            "sha1": digest,
        },
        "coordinateUnit": "16px map tile",
        "coordinateEvidence": {
            "romTables": "Six parallel 256-row tables: fish ID, X tile, Y tile.",
            "runtimeFishIdUse": "04:C369 loads the fish ID for the selected shared index from the active row of the 0C:C800 fish-ID block.",
            "runtimeCoordinateUse": "04:C334 reads X/Y for that same selected index from WRAM 7F:0306 and 7F:0F06; 04:C369 creates the fish object at those coordinates.",
            "dynamicAvailability": "04:C334 skips a row when its per-row WRAM value at 7F:1E8A is zero. The selector initialization at 03:8393..83EA derives or increments these values from the selected fish profile, so a configured ROM point need not be active in every generated runtime state.",
            "tileScale": "04:E80C..E824 adds 8 to the player's pixel position and shifts right four bits before comparing it with a fish position, establishing 16-pixel map tiles.",
            "stageOneRamMatch": "The field-stage-1 WRAM capture matched the first 32 X and Y words in the first ROM coordinate tables byte-for-byte.",
        },
        "romDispatchEvidence": {
            "cpuRange": "01:873C..01:8781",
            "description": "Internal selectors 07..0C dispatch to the six fish-ID tables in order: 0C:C800, 0C:CA00, 0C:CC00, 0C:CE00, 0C:D000, 0C:D200.",
            "tableSelectionNote": "The six mapSet labels here are table order. Friendly map names are intentionally left blank until matched to the ROM's own map art/text.",
        },
        "mapSets": map_sets,
        "fish": fish,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("rom", type=Path, help="Path to the original Japanese .sfc ROM")
    parser.add_argument(
        "--output", type=Path,
        default=Path("data/rom-fish-locations.json"),
        help="Output JSON path (default: data/rom-fish-locations.json)",
    )
    args = parser.parse_args()
    data = extract(args.rom.read_bytes())
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    counts = [row["pointCount"] for row in data["mapSets"]]
    print(f"Wrote {args.output}: {len(data['fish'])} fish profiles, point rows {counts}.")


if __name__ == "__main__":
    main()
