#!/usr/bin/env python3
"""Build the one runtime-confirmed gold-net location from original-ROM terrain."""
import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw

from extract_shop_stock import decompress, word, SHA1

ROOT = Path(__file__).resolve().parents[1]
STAGE = 1
TILE_X, TILE_Y = 9, 105
IMAGE_NAME = "maps/tool-net-area1.png"


def classify_ground(value, thresholds):
    return next((kind for kind in range(9, 0, -1) if value >= thresholds[kind]), 0)


def classify_water_or_depth(value, thresholds):
    return next((kind + 1 for kind in range(len(thresholds) - 1, -1, -1) if value >= thresholds[kind]), 0)


def build(rom_path):
    rom = rom_path.read_bytes()
    rom_sha1 = hashlib.sha1(rom).hexdigest()
    if rom_sha1 != SHA1:
        raise ValueError(f"Requires matching original ROM; got {rom_sha1}")

    stage_ptr = 0x74A + STAGE * 8
    block = decompress(rom, (word(rom, stage_ptr + 2) & 0x7F) * 0x8000 + (word(rom, stage_ptr) & 0x7FFF))
    width = word(rom, 0x9E7 + block[0x300] * 2) + 1
    height = word(rom, 0x9E7 + block[0x301] * 2) + 1
    if not (0 <= TILE_X < width and 0 <= TILE_Y < height):
        raise ValueError("Runtime-confirmed tile is outside the stage dimensions")

    index = TILE_Y * width + TILE_X
    ground_thresholds = [word(block, 0x4B4D + i * 2) for i in range(10)]
    water_thresholds = [word(block, 0x4B63 + i * 2) for i in range(13)]
    depth_thresholds = [word(block, 0x4B7F + i * 2) for i in range(3)]
    ground_class = classify_ground(block[0x0B02 + index], ground_thresholds)
    water_class = classify_water_or_depth(block[0x2304 + index], water_thresholds)
    depth_class = classify_water_or_depth(block[0x3B06 + index], depth_thresholds)
    if not (ground_class < 8 and water_class != 0 and depth_class == 0):
        raise ValueError(
            "Tile no longer matches the ROM's runtime shallow-net predicate: "
            f"ground={ground_class}, water={water_class}, depth={depth_class}"
        )

    manifest = json.loads((ROOT / "catalogue/maps/rom-map-manifest.json").read_text())
    map_entry = manifest["mapSets"]["mapSet01"]["fieldMap"]
    source = ROOT / "catalogue/maps" / map_entry["image"]
    if hashlib.sha256(source.read_bytes()).hexdigest() != map_entry["sha256"]:
        raise ValueError("Area 1 field image differs from its original-ROM manifest")

    original = Image.open(source).convert("RGB")
    projection = map_entry["worldToMapPixel"]
    px = TILE_X * projection["scaleX"] + projection["offsetX"]
    py = TILE_Y * projection["scaleY"] + projection["offsetY"]
    out_w, out_h = min(384, original.width), min(384, original.height)
    left = max(0, min(original.width - out_w, int(px - out_w // 2)))
    top = max(0, min(original.height - out_h, int(py - out_h // 2)))
    crop = original.crop((left, top, left + out_w, top + out_h))

    # A double-outline locator marks the exact tile center while keeping the
    # ROM's terrain pixels visible beneath it.
    marker_x, marker_y = px - left, py - top
    draw = ImageDraw.Draw(crop)
    radius = 10
    box = (marker_x - radius, marker_y - radius, marker_x + radius, marker_y + radius)
    draw.ellipse(box, outline="#101820", width=4)
    draw.ellipse(box, outline="#ffe45c", width=2)
    draw.ellipse((marker_x - 2, marker_y - 2, marker_x + 2, marker_y + 2), fill="#ffe45c", outline="#101820")
    crop.save(ROOT / "catalogue" / IMAGE_NAME)

    output = {
        "schemaVersion": 1,
        "rom": {"sha1": SHA1},
        "scope": (
            "One runtime-confirmed use of Gold Net (general_tool 04) in Area 1. "
            "The location is confirmed for the recorded field state; normal-route access is not established. "
            "Two controlled uses from the recorded field tile both increased the existing bait 07 stack from zero to three. "
            "The test injected the tool inventory entry and does not establish normal-route access."
        ),
        "items": {
            "general_tool:04": [
                {
                    "kind": "runtime_net_use",
                    "stage": STAGE,
                    "context": "field",
                    "tileX": TILE_X,
                    "tileY": TILE_Y,
                    "status": "runtime_confirmed_controlled_inventory",
                    "markerItem": {"category": "bait", "id": "07"},
                    "action": {
                        "th": "ถ้ามีตาข่ายสีทองและไปถึงช่องน้ำตื้นนี้แล้ว เปิดเมนูอุปกรณ์ เลือกตาข่ายแล้วใช้เพื่อเก็บแมลงน้ำ 07 ขยับไปช่องน้ำตื้นอื่นก่อนใช้ซ้ำ; ถ้าถือเหยื่อนี้ครบ 9 ชิ้นแล้ว ไม่ต้องเก็บเพิ่ม",
                        "en": "If you own the gold net and reach this shallow tile, open General Tools, select the net and use it to gather aquatic insect bait 07. Move to another eligible shallow tile before gathering again; do not gather more if you already carry nine.",
                        "ja": "金アミを持ってこの浅瀬に到達したら、道具メニューで金アミを選び、カワムシ07を採ります。再使用前に別の使用可能な浅瀬へ移動します。9個所持しているなら追加採集は不要です。",
                    },
                    "description": {
                        "th": "รูปเหยื่อชี้ช่องที่ทดลองใช้สำเร็จ ได้แมลงน้ำ 3 ชิ้นในสองรอบควบคุม จำนวนปกติอยู่ที่ 1–4 ชิ้น ไม่ได้คงที่ 3 การทดสอบใส่ตาข่ายในกระเป๋าเพื่อทดลอง; ยังไม่ยืนยันเส้นทางเดินจากทางเข้า จึงยังใช้ภาพนี้เป็นคู่มือเดินไปถึงไม่ได้",
                        "en": "The bait portrait marks a successful use tile. Two controlled runs gathered three pieces; normal amounts are 1–4, not a fixed three. The test inserted the net into inventory. A walking route from the entrance remains unconfirmed, so this is not yet a route guide.",
                        "ja": "エサ画像は使用に成功したタイルを示します。管理下の2回で3個採れましたが通常個数は1〜4で、3個固定ではありません。テストでは金アミを所持欄に設定しました。入口からの歩行経路は未確認のため、到達経路の案内にはまだ使えません。",
                    },
                    "name": {
                        "en": "Confirmed shallow-water net spot",
                        "ja": "浅瀬でアミを使えた地点",
                        "th": "จุดน้ำตื้นที่ยืนยันว่าใช้สวิงได้",
                    },
                    "image": IMAGE_NAME,
                    "fullImage": "maps/rom-field-01.png",
                    "width": out_w,
                    "height": out_h,
                    "pin": {"x": marker_x / out_w, "y": marker_y / out_h},
                    "terrain": {
                        "groundClass": ground_class,
                        "waterClass": water_class,
                        "depthClass": depth_class,
                    },
                    "runtimeObservation": {
                        "movementMode": 1,
                        "recordedAtTile": {"x": TILE_X, "y": TILE_Y},
                    },
                    "observedResult": {
                        "item": {"category": "bait", "id": "07"},
                        "count": 3,
                        "countScope": "same result in two controlled uses; not asserted as a fixed amount",
                        "recordedUses": 2,
                    },
                    "source": {
                        "romSha1": SHA1,
                        "terrainClassifier": "00:8F7D..90C3",
                        "groundPlane": "7E:2B02",
                        "waterPlane": "7E:4304",
                        "depthPlane": "7E:5B06",
                        "thresholds": {"ground": "7E:6B4D", "water": "7E:6B63", "depth": "7E:6B7F"},
                        "useDispatch": "03:BC4A",
                        "goldNetHandler": "03:BF2A",
                        "runtimeEvidence": [
                            "rom-analysis/gold-net-shallow-spots/area1-net-use.json",
                            "rom-analysis/gold-net-shallow-spots/root-area1-net-confirm.json",
                        ],
                        "screenshot": "rom-analysis/gold-net-shallow-spots/runs/area1-net-use-after13.png",
                        "coreSha256": "8ed333ac04544cc6ab67ceb445d095f7600bb17586d4887d99117fbd1ef776f6",
                    },
                    "testConditions": {
                        "netItemId": "04",
                        "netInventoryWordInjectedAt": "0B5E",
                        "baitItemIdAlreadyPresentAt": "088C",
                        "baitStackCountAddress": "08B8",
                        "baitStackCountBefore": 0,
                        "baitStackCountAfter": 3,
                        "normalMenuControls": ["A", "Left", "Down", "A", "Down", "Down", "A"],
                    },
                    "access": {
                        "naturalWalkingRouteConfirmed": False,
                        "note": "Do not treat this marker as proof that the tile is naturally reachable from an area's entrance.",
                    },
                }
            ]
        },
    }
    (ROOT / "data/gold-net-location.json").write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n")
    print(f"Built Area 1 Gold Net spot at ({TILE_X},{TILE_Y}); terrain classes {ground_class}/{water_class}/{depth_class}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--rom", type=Path, required=True)
    build(parser.parse_args().rom)
