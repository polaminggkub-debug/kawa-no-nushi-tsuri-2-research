#!/usr/bin/env python3
"""Project the ROM-traced Stage 2 tub maker onto its original-ROM field map."""
import argparse
import hashlib
import json
import struct
from pathlib import Path

from PIL import Image

from build_tool_use_locations import save_crop_if_changed

ROOT = Path(__file__).resolve().parents[1]
ROM_SHA1 = "c2103dd94e2a1a65a495fc02adc2e7d040f31212"
ROM_SIZE = 1_572_864


def word(data, offset):
    return struct.unpack_from("<H", data, offset)[0]


def build(rom_path):
    raw = rom_path.read_bytes()
    if len(raw) != ROM_SIZE or hashlib.sha1(raw).hexdigest() != ROM_SHA1:
        raise ValueError("Requires the matching original Japanese SFC ROM")

    source = json.loads((ROOT / "data/tub-acquisition.json").read_text(encoding="utf-8"))
    if source["romSha1"] != ROM_SHA1 or source["romSizeBytes"] != ROM_SIZE:
        raise ValueError("Tub trace does not identify the expected ROM")

    fish = json.loads((ROOT / "data/fish-acceptance.json").read_text(encoding="utf-8"))
    locations = json.loads((ROOT / "data/rom-fish-locations.json").read_text(encoding="utf-8"))
    if fish["rom"]["sha1"] != ROM_SHA1 or locations["rom"]["sha1"] != ROM_SHA1:
        raise ValueError("Fish source data belongs to a different ROM")
    fish_profile = next(entry for entry in fish["fish_profiles"] if entry["id_hex"] == "22")
    if fish_profile["name_ja_from_rom"] != source["fish"]["nameJa"]:
        raise ValueError("Hariyo profile name mismatch")
    if fish_profile["profile_file_offset"] != source["fish"]["profileFileOffset"]:
        raise ValueError("Hariyo profile offset mismatch")
    fish_locations = locations["fish"]["22"]["locations"]
    stage_fish = next(entry for entry in fish_locations if entry["mapSet"] == "02")
    if len(stage_fish["points"]) != source["fish"]["spawnEntryCount"]:
        raise ValueError("Hariyo Stage 2 spawn count mismatch")
    if fish_profile["matching_bait_ids"] != source["fish"]["matchingBaitIds"]:
        raise ValueError("Hariyo bait acceptance mismatch")

    npc = source["npc"]
    stage = npc["stage"]
    slot = int(npc["objectSlotHex"], 16)
    pointer_file_offset = 0x3D76 + 2 * (stage - 1)
    pointer = word(raw, pointer_file_offset)
    if pointer != 0xBE3E or f"00:{pointer:04X}" != npc["romObjectRecord"]["stage2PointerCpu"]:
        raise ValueError("Stage 2 object-table pointer mismatch")
    x_offset = pointer - 0x8000 + 2 * (slot - 8)
    y_offset = pointer - 0x8000 + 2 * (slot + 1 - 8)
    x, y = word(raw, x_offset), word(raw, y_offset)
    if (x, y) != (npc["tile"]["x"], npc["tile"]["y"]):
        raise ValueError("Tub maker coordinate mismatch")
    if (x_offset, y_offset) != (0x3E72, 0x3E74):
        raise ValueError("Unexpected Stage 2 coordinate-record offsets")

    handler = raw[0x47B2:0x4800]
    if bytes.fromhex("C9 22 00 D0 49 AD 1A 0C 29 10 00") not in handler:
        raise ValueError("Tub exchange slot/flag signature mismatch")
    fish_call = bytes.fromhex("A9 22 00 8D E8 11 20 41 C6")
    grant_call = bytes.fromhex("A9 01 00 8D 94 12 20 D4 D1")
    flag_write = bytes.fromhex("AD 1A 0C 09 10 00 8D 1A 0C")
    if not (handler.find(fish_call) < handler.find(grant_call) < handler.find(flag_write)):
        raise ValueError("Tub exchange transaction ordering mismatch")
    if bytes.fromhex("A0 A0 02 20 D8 D9") not in handler or bytes.fromhex("A0 A2 02 20 D8 D9") not in handler:
        raise ValueError("Tub exchange dialogue signature mismatch")

    grant = raw[0x51D4:0x5208]
    if bytes.fromhex("AD 78 0B F0 0A A0 96 01 20 D8 D9 80 1F") not in grant:
        raise ValueError("General-tool full-inventory signature mismatch")
    if bytes.fromhex("AD 94 12 99 5A 0B A9 00 00 60") not in grant:
        raise ValueError("General-tool slot-insertion signature mismatch")
    if bytes.fromhex("CD 94 12 D0 02 80 12") not in grant:
        raise ValueError("General-tool duplicate-detection signature mismatch")

    manifest = json.loads((ROOT / "catalogue/maps/rom-map-manifest.json").read_text(encoding="utf-8"))
    if manifest["provenance"]["romSha1"] != ROM_SHA1:
        raise ValueError("Field map manifest belongs to a different ROM")
    map_data = manifest["mapSets"][f"mapSet{stage:02}"]["fieldMap"]
    terrain = ROOT / "catalogue/maps" / map_data["image"]
    if hashlib.sha256(terrain.read_bytes()).hexdigest() != map_data["sha256"]:
        raise ValueError("Stage 2 terrain image differs from the ROM map manifest")

    image = Image.open(terrain).convert("RGB")
    projection = map_data["worldToMapPixel"]
    px = x * projection["scaleX"] + projection["offsetX"]
    py = y * projection["scaleY"] + projection["offsetY"]
    if not (0 <= px < image.width and 0 <= py < image.height):
        raise ValueError("Tub maker tile is outside the rendered field")
    width, height = min(384, image.width), min(384, image.height)
    left = max(0, min(image.width - width, px - width // 2))
    top = max(0, min(image.height - height, py - height // 2))
    crop_name = "maps/tool-tub-exchange.png"
    crop_path = ROOT / "catalogue" / crop_name
    save_crop_if_changed(image.crop((left, top, left + width, top + height)), crop_path)

    location = {
        "stage": stage,
        "mapId": npc["mapId"],
        "tileX": x,
        "tileY": y,
        "image": crop_name,
        "fullImage": "maps/" + map_data["image"],
        "width": width,
        "height": height,
        "pin": {"x": (px - left) / width, "y": (py - top) / height},
        "name": {
            "en": "Tub exchange: bring Hariyo (22); leave one general-tool slot free",
            "ja": "タライ交換：ハリヨ（22）を持参し、道具欄を1枠空ける",
            "th": "จุดแลกกะละมัง: นำฮาริโยะ (22) มา และเว้นช่องอุปกรณ์ทั่วไป 1 ช่อง"
        },
        "requiredFish": {"id": "22", "nameJa": "ハリヨ"},
        "rewardItem": {"category": "general_tool", "id": "01", "nameJa": "タライ"},
        "source": {
            "data": "data/tub-acquisition.json",
            "consumer": "00:C7B2..C7FF",
            "objectSlotHex": "22",
            "coordinateRecordFileOffsets": ["0x003E72", "0x003E74"],
            "grantConsumer": "00:D1D4..D207"
        }
    }
    output = {"schemaVersion": 1, "romSha1": ROM_SHA1, "location": location}
    (ROOT / "data/tub-location.json").write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {ROOT / 'data/tub-location.json'} and {crop_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--rom", type=Path, required=True)
    build(parser.parse_args().rom)
