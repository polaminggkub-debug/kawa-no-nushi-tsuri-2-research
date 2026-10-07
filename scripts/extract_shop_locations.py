#!/usr/bin/env python3
"""Extract town entrance/shop coordinates and render authentic town interiors.

Requires the user's own copy of the original Japanese ROM. Rendering also
requires a local Snes9x core and an outdoor area-1 save state. ROM, core and
emulator states stay local; only derived map images and coordinate evidence
are written to the publication.
"""
import argparse
import hashlib
import json
import shutil
import subprocess
import sys
from pathlib import Path
from types import SimpleNamespace

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SHA1 = "c2103dd94e2a1a65a495fc02adc2e7d040f31212"
ROM_SIZE = 1_572_864
TOWN_TILE_WIDTH = 16
TOWN_TILE_HEIGHT = 128
DISPLAY_TILE_HEIGHT = 80
DISPLAY_HEIGHT_PX = DISPLAY_TILE_HEIGHT * 16
ARRIVAL_TILES_FILE_OFFSET = 0x2049
ENTRANCES_FILE_OFFSET = 0x1FB9
ENTRANCE_GROUP_STRIDE = 0x18
OBJECT_POINTERS_FILE_OFFSET = 0x3D76


def word(data, offset):
    return int.from_bytes(data[offset:offset + 2], "little")


def pair(data, offset):
    return {"x": word(data, offset), "y": word(data, offset + 2)}


def object_position(rom, town_map_id, slot):
    pointer = word(rom, OBJECT_POINTERS_FILE_OFFSET + 2 * (town_map_id - 1))
    offset = pointer - 0x8000 + 2 * (slot - 8)
    return pair(rom, offset), pointer, offset


def checked_rom(path):
    data = path.read_bytes()
    if len(data) != ROM_SIZE or hashlib.sha1(data).hexdigest() != SHA1:
        raise ValueError("Requires the matching 1,572,864-byte Japanese ROM")
    return data


def capture_town_view(args, town_map_id, target_y, folder):
    """Run the original-ROM area setup and return its PPU-rendered background."""
    from render_field_snapshot import read_chunks, render

    previous = args.transition_dir / f"stage-{town_map_id - 1}.state"
    if not previous.is_file():
        raise FileNotFoundError(f"Missing local transition state: {previous}")
    folder.mkdir(parents=True, exist_ok=True)
    state_path = folder / "capture.state"
    shutil.copyfile(previous, state_path)

    x = 7
    camera_x = 0
    camera_y = max(0, min(TOWN_TILE_HEIGHT * 16 - 232, target_y * 16 - 104))

    def bytes16(value):
        return [value & 0xFF, (value >> 8) & 0xFF]

    request = folder / "request.json"
    request.write_text(json.dumps({
        "freezeAfterSteps": True,
        "steps": [
            {"write": [["0x1348", bytes16(0x8A80)], ["0x134A", bytes16(0)]],
             "buttons": [0, 4, 6, 8], "frames": 3},
            {"buttons": [0, 3, 4, 6, 8],
             "until": {"address": "0x0834", "equals": 1, "size": 2, "maxFrames": 600}},
            {"write": [
                ["0x0838", bytes16(camera_x)], ["0x083A", bytes16(camera_y)],
                ["0x085A", bytes16(town_map_id)], ["0x085C", bytes16(x)],
                ["0x085E", bytes16(target_y)], ["0x0500", bytes16(x * 16)],
                ["0x0502", bytes16(target_y * 16)], ["0x0504", bytes16(x)],
                ["0x0506", bytes16(target_y)],
            ], "until": {"address": "0x0834", "equals": 2, "size": 2, "maxFrames": 600}},
            {"frames": 2, "image": "game-frame.png"},
        ],
    }, indent=2) + "\n", encoding="utf-8")

    subprocess.run([
        sys.executable, str(ROOT / "scripts/capture.py"),
        "--rom", str(args.rom), "--core", str(args.core),
        "--request", str(request), "--state", str(state_path),
        "--output-dir", str(folder),
    ], check=True, cwd=ROOT, capture_output=True, text=True)

    state = state_path.read_bytes()
    ram = read_chunks(state)["RAM"]
    actual_map = word(ram, 0x085A)
    state_id = word(ram, 0x0834)
    descriptor = (word(ram, 0x024C) + 1, word(ram, 0x024E) + 1)
    if actual_map != town_map_id or state_id != 2:
        raise ValueError(f"Town map setup failed for map {town_map_id}: map={actual_map}, state={state_id}")
    if descriptor != (TOWN_TILE_WIDTH, TOWN_TILE_HEIGHT):
        raise ValueError(f"Unexpected town descriptor for map {town_map_id}: {descriptor}")
    image, meta = render(state, height=256, scanline_offset=0)
    return image, meta


def render_town_maps(args):
    """Render rows 0–79, which contain the five recorded entry/room bands."""
    if args.local_dir.resolve().is_relative_to(ROOT):
        raise ValueError("Keep emulator states and captures outside the publication")
    args.local_dir.mkdir(parents=True, exist_ok=True)
    args.transition_dir = args.local_dir / "transition-states"
    transition_args = SimpleNamespace(
        rom=args.rom, core=args.core, field_state=args.field_state,
        local_dir=args.local_dir, transition_dir=args.transition_dir,
    )
    # Reuse the same original-ROM area-cycle setup used for the six field maps.
    sys.path.insert(0, str(ROOT / "scripts"))
    from extract_rom_field_maps import prepare_transitions
    prepare_transitions(transition_args)

    args.maps_dir.mkdir(parents=True, exist_ok=True)
    rendered = {}
    sample_rows = [6, 18, 42, 54, 66]
    for town_map_id in range(7, 13):
        canvas = Image.new("RGB", (TOWN_TILE_WIDTH * 16, DISPLAY_HEIGHT_PX))
        coverage = Image.new("L", canvas.size)
        seen_cameras = set()
        captures = []
        for target_y in sample_rows:
            folder = args.local_dir / f"town-{town_map_id:02d}" / f"y-{target_y:03d}"
            view, meta = capture_town_view(args, town_map_id, target_y, folder)
            camera_x, camera_y = meta["cameraX"], meta["cameraY"]
            if camera_y in seen_cameras:
                continue
            seen_cameras.add(camera_y)
            height = min(view.height, DISPLAY_HEIGHT_PX - camera_y)
            if camera_x != 0 or height <= 0:
                raise ValueError(f"Unexpected town viewport for map {town_map_id}: {meta}")
            canvas.paste(view.crop((0, 0, canvas.width, height)), (0, camera_y))
            coverage.paste(255, (0, camera_y, canvas.width, camera_y + height))
            captures.append({"targetTileY": target_y, "cameraY": camera_y, "height": height})

        if coverage.getbbox() != (0, 0, canvas.width, canvas.height):
            raise ValueError(f"Uncovered displayed town pixels for map {town_map_id}: {coverage.getbbox()}")
        image_name = f"rom-town-{town_map_id:02d}.png"
        image_path = args.maps_dir / image_name
        canvas.save(image_path)
        rendered[str(town_map_id)] = {
            "image": f"maps/{image_name}",
            "sha256": hashlib.sha256(image_path.read_bytes()).hexdigest(),
            "widthPx": canvas.width,
            "heightPx": canvas.height,
            "captures": captures,
        }
        print(f"Rendered town map {town_map_id} → {image_path}", flush=True)
    return rendered


def area6_regular_access(entrances, interactions):
    evidence = json.loads((ROOT / "data/area6-shop-walk-evidence.json").read_text(encoding="utf-8"))
    entrance = next(entry for entry in entrances if entry["ordinal"] == 1)
    shop = next(entry for entry in interactions if entry["interactionSlotHex"] == "08")
    if evidence["romSha1"] != SHA1 or not evidence["independentReplayMatchedPriorScreenshot"]:
        raise ValueError("Area 6 walk has no matching independent ROM replay")
    expected = evidence["entrance"]
    if [entrance["fieldTile"][key] for key in ("x", "y")] != expected["fieldTile"]:
        raise ValueError("Area 6 entrance differs from the replay")
    if [entrance["townArrival"][key] for key in ("x", "y")] != expected["townArrival"]:
        raise ValueError("Area 6 arrival differs from the replay")
    if [shop["townTile"][key] for key in ("x", "y")] != evidence["shop"]["counterTile"]:
        raise ValueError("Area 6 shop differs from the replay")
    image = (ROOT / "data" / evidence["image"]).read_bytes()
    if hashlib.sha256(image).hexdigest() != evidence["imageSha256"]:
        raise ValueError("Area 6 replay image hash differs")
    return {
        "interactionSlotHex": "08", "entranceOrdinal": 1,
        "probe": {
            "townArrival": {"x": 7, "y": 29}, "result": "normal shop opened",
            "observedMode": 2, "observedSlotHex": "08",
            "runtimeEvidence": "33 controller-only steps from an Area 6 debug field fixture; independently replayed. Does not prove new-game progression.",
            "controls": ["Up 3 tiles", "Right 2 tiles", "Up 3 tiles", "Down 1 tile", "Left 1 tile", "Face Up", "A", "A after greeting"],
            "evidenceHref": "../docs/area6-shop-walking-research.md",
        },
    }


def make_area_data(rom, area, town_images, field_bounds):
    town_map_id = area + 6
    arrivals = [pair(rom, ARRIVAL_TILES_FILE_OFFSET + 4 * ordinal) for ordinal in range(5)]
    entrance_base = ENTRANCES_FILE_OFFSET + (area - 1) * ENTRANCE_GROUP_STRIDE
    entrances, unused = [], []
    for ordinal in range(5):
        offset = entrance_base + 4 * ordinal
        field_tile = pair(rom, offset)
        if field_tile["x"] >= field_bounds["widthTiles"] or field_tile["y"] >= field_bounds["heightTiles"]:
            unused.append({
                "ordinal": ordinal,
                "raw": [field_tile["x"], field_tile["y"]],
                "reason": "outside ROM-rendered field bounds",
            })
            continue
        entrances.append({
            "ordinal": ordinal,
            "fieldTile": field_tile,
            "townArrival": {"mapId": town_map_id, **arrivals[ordinal]},
            "source": {
                "fieldFileOffset": f"0x{offset:06X}",
                "fieldCpuAddress": f"00:{0x8000 + offset:04X}",
                "arrivalFileOffset": f"0x{ARRIVAL_TILES_FILE_OFFSET + 4 * ordinal:06X}",
                "arrivalCpuAddress": f"00:{0x8000 + ARRIVAL_TILES_FILE_OFFSET + 4 * ordinal:04X}",
            },
        })

    interactions = []
    for slot, kind in [(0x08, "regular-shop"), (0x10, "special-rod-shop")]:
        tile, pointer, offset = object_position(rom, town_map_id, slot)
        mode = 2 if slot == 0x08 else (7 if town_map_id >= 10 else 3)
        handler = {2: "03:8634", 3: "03:9517", 7: "03:86E1"}[mode]
        entry = {
            "interactionSlotHex": f"{slot:02X}",
            "mode": mode,
            "kind": kind if (slot == 0x08 or town_map_id >= 10) else "unclassified-interaction",
            "townTile": tile,
            "handler": handler,
            "source": {
                "pointerFileOffset": f"0x{OBJECT_POINTERS_FILE_OFFSET + 2 * (town_map_id - 1):06X}",
                "pointerValue": f"0x{pointer:04X}",
                "coordinateFileOffset": f"0x{offset:06X}",
                "dispatcher": "00:CED7..CF28",
            },
        }
        if slot == 0x10 and town_map_id < 10:
            # The same physical object slot runs another interaction in towns 7–9.
            entry["kind"] = "unclassified-interaction"
        interactions.append(entry)

    # These chest contents and key conditions are traced in quest-tool-use-research.md.
    chest_rewards = {
        7: {"itemCategory": "bait", "itemId": "11", "requiresKey": True, "itemName": "Potato bait"},
        8: {"itemCategory": "bait", "itemId": "0B", "requiresKey": True, "itemName": "Grapevine larva bait"},
        9: {"itemCategory": "general_tool", "itemId": "0F", "requiresKey": False, "itemName": "Empty milk bottle"},
        10: {"itemCategory": "rod", "itemId": "0A", "requiresKey": True, "itemName": "Small lure rod"},
        11: {"itemCategory": "general_tool", "itemId": "11", "requiresKey": False, "itemName": "Lottery ticket"},
        12: {"itemCategory": "general_tool", "itemId": "12", "requiresKey": True, "itemName": "Candle"},
    }
    chest_tile, _, chest_offset = object_position(rom, town_map_id, 0x0E)

    # Only link an entrance to an NPC where an original-ROM movement probe opened it.
    # Probes begin at the exact arrival coordinate selected by the ROM transition table.
    verified_access = []
    if area == 6:
        verified_access.append(area6_regular_access(entrances, interactions))
    if area in (1, 2, 3, 4, 5):
        verified_access.append({
            "interactionSlotHex": "08",
            "entranceOrdinal": 1,
            "probe": {
                "townArrival": {"x": 7, "y": 29},
                "result": "normal shop opened",
                "observedMode": 2,
                "observedSlotHex": "08",
                "runtimeEvidence": "original-ROM Snes9x field state and WRAM after directional input and A",
                "controls": {
                    1: ["Up×96", "A"], 2: ["Up×128", "A"], 3: ["Up×128", "A"],
                    4: ["Up×80", "Left×48", "Up×48", "Right×48", "Down×1", "A"],
                    5: ["Up×128", "A"],
                }[area],
            },
        })
    if area in (4, 5, 6):
        controls = {
            4: ["Up×64", "Right×16", "A"],
            5: ["Up×64", "A"],
            6: ["Up×64", "A"],
        }[area]
        verified_access.append({
            "interactionSlotHex": "10",
            "entranceOrdinal": 4,
            "probe": {
                "townArrival": {"x": 7, "y": 77},
                "result": "special rod menu opened",
                "observedMode": 7,
                "observedSlotHex": "10",
                "runtimeEvidence": "original-ROM Snes9x field state and WRAM after directional input and A",
                "controls": controls,
            },
        })

    terrain = town_images.get(str(town_map_id)) or {
        "image": f"maps/rom-town-{town_map_id:02d}.png",
        "widthPx": 256,
        "heightPx": DISPLAY_HEIGHT_PX,
    }
    return {
        "outdoorArea": area,
        "outdoorMapId": area,
        "outdoorFieldBoundsTiles": field_bounds,
        "townMapId": town_map_id,
        "townTerrain": {
            "image": terrain["image"],
            **({"sha256": terrain["sha256"]} if "sha256" in terrain else {}),
            "widthPx": terrain["widthPx"],
            "heightPx": terrain["heightPx"],
            "descriptorTiles": {"width": TOWN_TILE_WIDTH, "height": TOWN_TILE_HEIGHT},
            "displayBoundsTiles": {"x": [0, 15], "y": [0, 79]},
            "spritesIncluded": False,
        },
        "entrances": entrances,
        "unusedEntranceRecords": unused,
        "interactions": interactions,
        "townChests": [{
            "interactionSlotHex": "0E",
            "townTile": chest_tile,
            "handler": "00:CFB1..D059",
            "reward": chest_rewards[town_map_id],
            "source": {"coordinateFileOffset": f"0x{chest_offset:06X}"},
        }],
        "verifiedAccess": verified_access,
    }


def extract(args):
    rom = checked_rom(args.rom)
    manifest = json.loads((ROOT / "catalogue/maps/rom-map-manifest.json").read_text(encoding="utf-8"))
    if manifest.get("provenance", {}).get("romSha1") != SHA1:
        raise ValueError("Outdoor terrain manifest belongs to a different ROM")
    field_bounds = {}
    for area in range(1, 7):
        field = manifest["mapSets"][f"mapSet{area:02d}"]["fieldMap"]
        if field["width"] % 16 or field["height"] % 16:
            raise ValueError(f"Non-tile-aligned outdoor field map {area}")
        field_bounds[area] = {"widthTiles": field["width"] // 16, "heightTiles": field["height"] // 16}
    town_images = {}
    if args.core or args.field_state or args.local_dir:
        if not (args.core and args.field_state and args.local_dir):
            raise ValueError("Rendering requires --core, --field-state and --local-dir together")
        town_images = render_town_maps(args)

    areas = [make_area_data(rom, area, town_images, field_bounds[area]) for area in range(1, 7)]
    result = {
        "schemaVersion": 1,
        "rom": {"sha1": SHA1, "sizeBytes": ROM_SIZE},
        "method": "Original-ROM transition/object tables plus Snes9x PPU background captures; no external guide",
        "coordinateSystems": {
            "outdoorField": {
                "mapIds": [1, 2, 3, 4, 5, 6],
                "unit": "16-pixel map tile",
                "origin": "top-left",
                "sourceTerrain": "catalogue/maps/rom-field-01.png through rom-field-06.png",
            },
            "townInterior": {
                "mapIds": [7, 8, 9, 10, 11, 12],
                "associatedOutdoorMapId": "townMapId - 6",
                "unit": "16-pixel map tile",
                "origin": "top-left",
                "projection": {"pixelX": "tileX * 16 + 8", "pixelY": "tileY * 16 + 8"},
                "descriptorTiles": {"width": TOWN_TILE_WIDTH, "height": TOWN_TILE_HEIGHT},
                "displayBoundsTiles": {"x": [0, 15], "y": [0, 79]},
                "displayNote": "The displayed crop covers the five entrance/room bands used by recorded entrances and town objects; it does not claim the entire 128-row loader descriptor is authored town terrain.",
            },
        },
        "sources": {
            "entranceTransitionRoutine": "00:9CC0..9E09",
            "outdoorEntranceTable": {"cpuAddress": "00:9FB9", "fileOffset": "0x001FB9", "groupStrideBytes": ENTRANCE_GROUP_STRIDE},
            "townArrivalTable": {"cpuAddress": "00:A049", "fileOffset": "0x002049"},
            "townObjectPointerTable": {"cpuAddress": "00:BD76", "fileOffset": "0x003D76"},
            "shopDispatcher": "00:CED7..CF28",
            "normalShopHandler": "03:8634",
            "specialRodHandler": "03:86E1..8733",
            "chestHandler": "00:CFB1..D059",
            "relatedResearch": ["docs/shop-stock-research.md", "docs/quest-tool-use-research.md"],
        },
        "areas": areas,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {args.output}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--rom", type=Path, required=True)
    parser.add_argument("--core", type=Path, help="Optional compatible Snes9x libretro core for authentic town renders")
    parser.add_argument("--field-state", type=Path, help="Local outdoor area-1 Snes9x state; kept outside this repository")
    parser.add_argument("--local-dir", type=Path, help="Private working directory for emulator states and captures")
    parser.add_argument("--output", type=Path, default=ROOT / "data/shop-locations-rom.json")
    parser.add_argument("--maps-dir", type=Path, default=ROOT / "catalogue/maps")
    args = parser.parse_args()
    extract(args)


if __name__ == "__main__":
    main()
