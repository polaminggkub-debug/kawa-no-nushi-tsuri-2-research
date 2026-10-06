#!/usr/bin/env python3
"""Build static Area 1–5 compass target maps from the supplied Japanese ROM."""
import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw

from extract_shop_stock import SHA1, word

ROOT = Path(__file__).resolve().parents[1]
TABLE_FILE_OFFSET = 0x2065
CROP_WIDTH = 384
CROP_HEIGHT = 384
TARGETS = {
    1: {"xy": (13, 239), "rowHex": "0D 00 EF 00"},
    2: {"xy": (56, 17), "rowHex": "38 00 11 00"},
    3: {"xy": (22, 5), "rowHex": "16 00 05 00"},
    4: {"xy": (32, 41), "rowHex": "20 00 29 00"},
    5: {"xy": (22, 2), "rowHex": "16 00 02 00"},
}
MARKER_ITEM = {"category": "general_tool", "id": "0E"}


def localized_location(stage, x, y, image_name, full_image, width, height, pin, row_hex, map_entry):
    return {
        "kind": "compass_exit",
        "stage": stage,
        "context": "field",
        "tileX": x,
        "tileY": y,
        "markerItem": MARKER_ITEM,
        "name": {
            "en": f"Compass stop tile · exit to connector",
            "ja": "磁石が止まる地点・連絡路の出口",
            "th": "จุดที่เข็มทิศหยุด · ทางออกสู่ทางเชื่อม",
        },
        "action": {
            "en": "Use the compass outdoors, move in its indicated direction, then use it again to update the heading. The needle stops at the marked exit tile, which leads to the connecting route.",
            "ja": "屋外で磁石を使い、示された方角へ移動してから再使用し、方角を確認します。針が止まるマーカーの地点が連絡路への出口です。",
            "th": "ใช้เข็มทิศกลางแจ้ง เดินตามทิศที่บอกแล้วใช้ซ้ำเพื่อดูทิศใหม่ เข็มจะหยุดตรงช่องที่รูปเข็มทิศชี้ ซึ่งเป็นจุดออกไปเส้นทางเชื่อม",
        },
        "description": {
            "en": f"Find tile ({x},{y}) in Area {stage} using the compass picture. The map shows the target, not a tested walking route or a path around obstacles.",
            "ja": f"磁石画像でエリア{stage}のタイル（{x},{y}）を確認します。目標地点を示す地図で、歩行経路や障害物を避ける道順は検証していません。",
            "th": f"ดูรูปเข็มทิศที่ช่อง ({x},{y}) ของด่าน {stage} เพื่อหาจุดทางเชื่อม แผนที่นี้แสดงเป้าหมาย ยังไม่ได้ยืนยันขั้นตอนเดินหรือเส้นทางหลบสิ่งกีดขวาง",
        },
        "image": image_name,
        "fullImage": full_image,
        "width": width,
        "height": height,
        "pin": pin,
        "source": {
            "romSha1": SHA1,
            "targetTableCpuAddress": "00:A065",
            "targetTableFileOffset": f"0x{TABLE_FILE_OFFSET:06X}",
            "rowOffsetBytes": (stage - 1) * 8,
            "rowTargetBytesHex": row_hex,
            "compassHandler": "03:C313..C3E8",
            "transitionConsumer": "00:9D94..9DD8",
            "transitionMapId": 13,
            "mapImage": map_entry["image"],
            "mapImageSha256": map_entry["sha256"],
            "mapProjection": map_entry["worldToMapPixel"],
        },
        "access": {
            "naturalWalkingRouteConfirmed": False,
            "route13Linkage": "inferred_from_traced_transition_consumer",
            "shortestPathConfirmed": False,
        },
    }


def build(rom_path):
    rom = rom_path.read_bytes()
    rom_sha1 = hashlib.sha1(rom).hexdigest()
    if rom_sha1 != SHA1:
        raise ValueError(f"Requires matching original Japanese ROM; got {rom_sha1}")

    action_data = json.loads((ROOT / "data/general-tool-actions.json").read_text(encoding="utf-8"))
    trace = action_data["items"]["0E"]["trace"]
    targets_from_data = trace["area1to6Targets"]
    if trace["targetTable"]["fileOffset"] != f"0x{TABLE_FILE_OFFSET:06X}":
        raise ValueError("Compass target table file offset differs from the documented ROM trace")

    shop_stock = json.loads((ROOT / "data/shop-stock-rom.json").read_text(encoding="utf-8"))
    compass_offers = sorted(row["stage"] for row in shop_stock["items"]["general_tool:0E"])
    if compass_offers != [1, 2, 3, 6]:
        raise ValueError(f"Compass shop stages changed: expected [1, 2, 3, 6], got {compass_offers}")
    code_index = json.loads((ROOT / "data/general-tool-code-index.json").read_text(encoding="utf-8"))
    if code_index["items"]["0E"]["basePriceYen"] != 300:
        raise ValueError("Compass's ROM item-record price changed from 300 yen")
    record = code_index["items"]["0E"]
    record_offset = int(record["recordFileOffset"], 16)
    record_bytes = bytes.fromhex(record["recordBytes"])
    if rom[record_offset:record_offset + len(record_bytes)] != record_bytes or word(rom, record_offset + 4) != 300:
        raise ValueError("Compass record bytes or price disagree with the supplied ROM")

    manifest = json.loads((ROOT / "catalogue/maps/rom-map-manifest.json").read_text(encoding="utf-8"))
    locations = []
    for stage, expected in TARGETS.items():
        x, y = expected["xy"]
        table_row = TABLE_FILE_OFFSET + (stage - 1) * 8
        row = rom[table_row : table_row + 4]
        expected_row = bytes.fromhex(expected["rowHex"])
        if row != expected_row:
            raise ValueError(
                f"Area {stage} compass target row changed: expected {expected_row.hex(' ')}, got {row.hex(' ')}"
            )
        decoded_xy = (word(rom, table_row), word(rom, table_row + 2))
        if decoded_xy != (x, y) or targets_from_data[str(stage)] != [x, y]:
            raise ValueError(f"Area {stage} target disagrees with the ROM table or general-tool-actions.json")

        map_entry = manifest["mapSets"][f"mapSet{stage:02}"]["fieldMap"]
        source_path = ROOT / "catalogue/maps" / map_entry["image"]
        actual_sha256 = hashlib.sha256(source_path.read_bytes()).hexdigest()
        if actual_sha256 != map_entry["sha256"]:
            raise ValueError(f"Area {stage} field map differs from the ROM map manifest")

        original = Image.open(source_path).convert("RGB")
        if original.size != (map_entry["width"], map_entry["height"]):
            raise ValueError(f"Area {stage} field map dimensions differ from the manifest")
        projection = map_entry["worldToMapPixel"]
        px = x * projection["scaleX"] + projection["offsetX"]
        py = y * projection["scaleY"] + projection["offsetY"]
        if not (0 <= px < original.width and 0 <= py < original.height):
            raise ValueError(f"Area {stage} compass target falls outside its manifest field map")

        out_w = min(CROP_WIDTH, original.width)
        out_h = min(CROP_HEIGHT, original.height)
        left = max(0, min(original.width - out_w, int(px - out_w // 2)))
        top = max(0, min(original.height - out_h, int(py - out_h // 2)))
        crop = original.crop((left, top, left + out_w, top + out_h))
        marker_x, marker_y = px - left, py - top
        draw = ImageDraw.Draw(crop)
        radius = 11
        box = (marker_x - radius, marker_y - radius, marker_x + radius, marker_y + radius)
        draw.ellipse(box, outline="#101820", width=4)
        draw.ellipse(box, outline="#ffe45c", width=2)
        draw.ellipse((marker_x - 3, marker_y - 3, marker_x + 3, marker_y + 3), fill="#ffe45c", outline="#101820")

        image_name = f"maps/tool-compass-area{stage}.png"
        crop.save(ROOT / "catalogue" / image_name)
        locations.append(
            localized_location(
                stage=stage,
                x=x,
                y=y,
                image_name=image_name,
                full_image=f"maps/{map_entry['image']}",
                width=out_w,
                height=out_h,
                pin={"x": marker_x / out_w, "y": marker_y / out_h},
                row_hex=row.hex(" ").upper(),
                map_entry=map_entry,
            )
        )

    sentinel_offset = TABLE_FILE_OFFSET + 5 * 8
    stage6_sentinel = rom[sentinel_offset : sentinel_offset + 4]
    if stage6_sentinel != bytes.fromhex("FF 00 FF 00"):
        raise ValueError("Area 6 no longer has the expected dynamic-target table sentinel")
    if targets_from_data["6"] != "table sentinel 0x00FF; dynamic target words $0C:DE02 and $0C:EA02":
        raise ValueError("Area 6 target description changed; keep it out of the static map set")

    output = {
        "schemaVersion": 1,
        "rom": {"sha1": SHA1},
        "playerSummary": {
            "en": (
                "If you use these maps, you do not need to buy the compass just to learn the fixed exit coordinates for Areas 1–5. "
                "Buy Compass 0E for ¥300 only if you want the game to give a heading from your current position; it is stocked in Areas 1, 2, 3 and 6. "
                "Area 6 has no fixed map pin here: before its story condition is met, the compass reports your area/section without a heading."
            ),
            "ja": (
                "この地図を使うなら、エリア1～5の固定出口座標を知るためだけに磁石を買う必要はありません。"
                "現在地からゲーム内の方角表示を使いたい場合だけ、磁石0E（300円）を購入してください。エリア1・2・3・6で販売されています。"
                "エリア6には固定マーカーを載せていません。物語条件が満たされる前は、磁石はエリア／区画のみを表示し、方角は出ません。"
            ),
            "th": (
                "ถ้าใช้แผนที่นี้ ไม่ต้องซื้อเข็มทิศเพื่อรู้พิกัดทางออกคงที่ของด่าน 1–5 ซื้อเข็มทิศ 0E ราคา ¥300 "
                "เฉพาะเมื่อต้องการให้เกมบอกทิศจากตำแหน่งปัจจุบัน มีขายในด่าน 1, 2, 3 และ 6 ด่าน 6 ไม่มีหมุดพิกัดคงที่ในหน้านี้: "
                "ก่อนผ่านเงื่อนไขเนื้อเรื่อง เข็มทิศจะแจ้งด่าน/ช่วงที่ยืน แต่ไม่บอกทิศ"
            ),
        },
        "scope": {
            "en": (
                "Static outdoor compass target tiles for Areas 1–5 only. The traced transition consumer uses each target "
                "to enter map 13, the connecting route; this relationship is inferred from code. It does not establish "
                "a tested natural walking route, an obstacle-aware route, or the shortest route. The compass message does not name the destination. "
                "Area 6 is omitted because its target is dynamic and heading is gated by story progress."
            ),
            "ja": (
                "エリア1～5の屋外磁石目標タイルのみを掲載。追跡した遷移処理は各目標地点を読み、連絡路マップ13へ進みます。"
                "この関係はコードから判断したもので、通常の歩行経路・障害物回避経路・最短経路は検証していません。磁石のメッセージは目的地名を示しません。"
                "エリア6は目標が動的で、方角表示に物語進行条件があるため掲載しません。"
            ),
            "th": (
                "แสดงเฉพาะช่องเป้าหมายกลางแจ้งของเข็มทิศในด่าน 1–5 ตัวตรวจทางออกที่ตามโค้ดได้อ่านเป้าหมายแต่ละจุดเพื่อไปแผนที่ 13 "
                "ซึ่งเป็นทางเชื่อม; ความสัมพันธ์นี้สรุปจากโค้ด ยังไม่ได้ทดสอบเส้นทางเดินจริง เส้นทางหลบสิ่งกีดขวาง หรือเส้นทางสั้นที่สุด "
                "ข้อความเข็มทิศไม่บอกชื่อปลายทาง ตัดด่าน 6 ออกเพราะเป้าหมายเปลี่ยนตามสถานะและการแสดงทิศขึ้นกับความคืบหน้าเนื้อเรื่อง"
            ),
        },
        "source": {
            "romSha1": SHA1,
            "compassData": "data/general-tool-actions.json",
            "targetTableCpuAddress": "00:A065",
            "targetTableFileOffset": f"0x{TABLE_FILE_OFFSET:06X}",
            "targetRowStrideBytes": 8,
            "transitionConsumer": trace["transitionConsumer"],
            "mapManifest": "catalogue/maps/rom-map-manifest.json",
            "mapProjection": "manifest fieldMap.worldToMapPixel; tile centers",
            "magnetShopStages": compass_offers,
            "magnetFullPriceYen": 300,
        },
        "items": {"general_tool:0E": locations},
    }
    (ROOT / "data/compass-locations.json").write_text(
        json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Built {len(locations)} compass target crops for outdoor Areas 1–5; Area 6 omitted (dynamic target).")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--rom", type=Path, required=True, help="Path to the matching headerless Japanese SFC ROM")
    build(parser.parse_args().rom)
