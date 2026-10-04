#!/usr/bin/env python3
"""Build the player-facing use summaries joined from the published research data."""

import json
import re
from collections import defaultdict
from pathlib import Path


PUBLICATION = Path(__file__).resolve().parents[1]
CATALOGUE = PUBLICATION / "catalogue"
DATA = PUBLICATION / "data"


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def save(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def loc(en, ja, th):
    return {"en": en, "ja": ja, "th": th}


def loc_lists(en=(), ja=(), th=()):
    return {"en": list(en), "ja": list(ja), "th": list(th)}


def key(category, item_id):
    return f"{category}:{item_id.upper()}"


def hx_number(value):
    return int(str(value).removeprefix("0x"), 16)


def stage_fish_names():
    names = {}
    for path in sorted((DATA / "stages").glob("*.json")):
        document = load(path)

        def visit(value):
            if isinstance(value, dict):
                ja = value.get("name_jp")
                th = value.get("name_th")
                if ja and th:
                    names.setdefault(ja, th)
                for child in value.values():
                    visit(child)
            elif isinstance(value, list):
                for child in value:
                    visit(child)

        visit(document)
    return names


STYLE = {
    1: loc("Float / Ayu", "ウキ・アユ", "สายทุ่น / ปลาอายุ"),
    2: loc("Casting", "投げ釣り", "ตีเหยื่อแบบคาสติ้ง"),
    4: loc("Lure", "ルアー", "ลัวร์"),
    8: loc("Fly", "毛バリ", "ฟลาย"),
}


GENERAL_TOOL_COPY = {
    "01": (loc("Quest exchange: a Hariyo is traded for this wash tub.", "クエスト交換用: ハリヨとタライを交換する。", "ของแลกเควสต์: นำปลาฮาริโยะมาแลกกะละมัง"), []),
    "02": (loc("Use the canoe to travel on water.", "水上移動に使うカヌー。", "ใช้เรือแคนูเดินทางทางน้ำ"), []),
    "03": (loc("Search cave areas with the magnifying glass; it is linked to finding mushrooms.", "虫メガネで洞窟を調べ、キノコを見つける。", "ใช้แว่นขยายสำรวจถ้ำ ซึ่งเชื่อมกับการหาเห็ด"), []),
    "04": (loc("A net item; its field action has not been identified.", "網の道具。フィールドでの使い方は未特定。", "อุปกรณ์ตาข่าย; ยังไม่พบวิธีใช้ในฉาก"), []),
    "05": (loc("Record caught species in the fishing notebook.", "釣った魚種を釣りノートに記録する。", "ใช้สมุดจดบันทึกชนิดปลาที่ตกได้"), []),
    "06": (loc("A received-postcard event item.", "届いた絵はがきのイベントアイテム。", "ไปรษณียบัตรที่ได้รับ เป็นไอเท็มเนื้อเรื่อง"), []),
    "07": (loc("A postcard used in an event.", "イベントで使う絵はがき。", "ไปรษณียบัตรที่ใช้ในเหตุการณ์เนื้อเรื่อง"), []),
    "08": (loc("Chum / groundbait item.", "寄せエサ。", "เหยื่อโปรยเรียกปลา"), [loc("The three IDs share the same Japanese label; their differences are not decoded.", "3つのIDは同じ日本語名で、違いは未解明。", "ทั้งสาม ID ใช้ชื่อญี่ปุ่นเดียวกัน; ยังไม่พบความต่างด้านการใช้งาน")]),
    "09": (loc("Chum / groundbait item.", "寄せエサ。", "เหยื่อโปรยเรียกปลา"), [loc("The three IDs share the same Japanese label; their differences are not decoded.", "3つのIDは同じ日本語名で、違いは未解明。", "ทั้งสาม ID ใช้ชื่อญี่ปุ่นเดียวกัน; ยังไม่พบความต่างด้านการใช้งาน")]),
    "0A": (loc("Chum / groundbait item.", "寄せエサ。", "เหยื่อโปรยเรียกปลา"), [loc("The three IDs share the same Japanese label; their differences are not decoded.", "3つのIDは同じ日本語名で、違いは未解明。", "ทั้งสาม ID ใช้ชื่อญี่ปุ่นเดียวกัน; ยังไม่พบความต่างด้านการใช้งาน")]),
    "0B": (loc("Keep caught fish in this basket; its printed capacity is 10 fish.", "釣った魚を入れるびく。表示容量は10匹。", "ใช้เก็บปลาที่ตกได้; ความจุตามชื่อคือ 10 ตัว"), []),
    "0C": (loc("Keep caught fish in this basket; its printed capacity is 20 fish.", "釣った魚を入れるびく。表示容量は20匹。", "ใช้เก็บปลาที่ตกได้; ความจุตามชื่อคือ 20 ตัว"), []),
    "0D": (loc("Keep caught fish in this basket; its printed capacity is 30 fish.", "釣った魚を入れるびく。表示容量は30匹。", "ใช้เก็บปลาที่ตกได้; ความจุตามชื่อคือ 30 ตัว"), []),
    "0E": (loc("A magnet inventory item.", "磁石のアイテム。", "ไอเท็มแม่เหล็ก"), []),
    "0F": (loc("Milk-bottle quest item.", "牛乳ビンのクエストアイテム。", "ขวดนมสำหรับเควสต์"), []),
    "10": (loc("Milk quest item.", "牛乳のクエストアイテム。", "นมสำหรับเควสต์"), []),
    "11": (loc("Lottery ticket; the prize result is not decoded.", "富くじ。賞品の内容は未解明。", "สลาก; ยังไม่พบผลรางวัล"), []),
    "12": (loc("Candle event item.", "ロウソクのイベントアイテム。", "เทียนสำหรับเหตุการณ์เนื้อเรื่อง"), []),
    "13": (loc("Stereo sound setting; not fishing tackle.", "ステレオ音声設定。釣り道具ではない。", "ตั้งค่าเสียงสเตอริโอ ไม่ใช่อุปกรณ์ตกปลา"), []),
    "14": (loc("Monaural sound setting; not fishing tackle.", "モノラル音声設定。釣り道具ではない。", "ตั้งค่าเสียงโมโน ไม่ใช่อุปกรณ์ตกปลา"), []),
    "15": (loc("Fried-tofu event item.", "油揚げのイベントアイテム。", "เต้าหู้ทอดสำหรับเหตุการณ์เนื้อเรื่อง"), []),
    "16": (loc("Fireworks event item.", "花火のイベントアイテム。", "ดอกไม้ไฟสำหรับเหตุการณ์เนื้อเรื่อง"), []),
    "17": (loc("Key item; its use depends on the event.", "カギのアイテム。使う場面はイベントによる。", "ไอเท็มกุญแจ; ใช้ตามเหตุการณ์ในเกม"), []),
}


BAIT_NAME_TH = {
    "01": "ไส้เดือน", "02": "หนอนแมลงวัน", "03": "หนอนแดง", "04": "แมลง",
    "05": "หนอนเลือด", "06": "หนอนทะเล", "07": "แมลงน้ำ", "08": "ตัวอ่อนแมลงหนอนปลอกน้ำ",
    "09": "ไข่ปลาแซลมอน", "0A": "ไส้เดือนใหญ่", "0B": "หนอนองุ่น", "0C": "ตัวอ่อนผึ้ง",
    "0D": "เหยื่อปั้น", "0E": "เหยื่อปั้นเฮระ", "0F": "เหยื่อปั้นปลาคาร์ป",
    "10": "เหยื่อปั้นข้าวกวน", "11": "เหยื่อหัวมัน", "12": "ปลาเล็ก", "13": "ปลาโดโจ",
    "14": "กบ", "15": "กุ้ง", "16": "เนื้อหอย", "17": "ปลาอายุเหยื่อล่อ",
}


TH_DIRECT_NAMES = {
    "rod": {"06": "คันมาบุนะ 3.3 ม."},
    "lure": {"0F": "เหยื่อสั่นจมน้ำ", "10": "เหยื่อสั่นจมน้ำ", "12": "สปินเนอร์เบต", "26": "สปินเนอร์เบต", "27": "สปินเนอร์เบต", "28": "สปินเนอร์เบต"},
    "bait": BAIT_NAME_TH,
    "hook": {
        "01": "เบ็ดชิบิ", "02": "เบ็ดปลาไหลญี่ปุ่น", "03": "เบ็ดปลาซึซึกิ", "04": "เบ็ดปลาคาร์ป",
        "05": "เบ็ดปลาเฮระบูนะ", "06": "เบ็ดทั่วไป", "07": "เบ็ดปลาฮิไก",
        "08": "เบ็ดปลาฮายะ / ยามาเบะ", "09": "เบ็ดปลาเทราต์", "0A": "ห่วงจมูกปลาอายุ",
        "0B": "เบ็ดปลาทานาโกะ", "0C": "เบ็ดปลาอิวานะ", "0D": "เบ็ดปลายามาเมะ",
    },
    "float_weight": {
        "01": "ทุ่นเฮระ", "02": "ทุ่นชิโมริทรงกลม", "03": "ทุ่นชิโมริทรงเรียว",
        "04": "ทุ่นลูกบอล", "05": "ทุ่นแท่ง", "06": "ทุ่นลูกโอ๊ก", "07": "ทุ่นพริก",
        "08": "เครื่องหมายบนสาย", "09": "ตะกั่วทรงรี", "0A": "ตะกั่วทรงนัตสึเมะ",
    },
    "general_tool": {
        "01": "กะละมัง", "02": "เรือแคนู", "03": "แว่นขยาย", "04": "ตาข่ายสีทอง",
        "05": "สมุดบันทึกการตกปลา", "06": "ไปรษณียบัตรที่ได้รับ", "07": "ไปรษณียบัตร",
        "08": "เหยื่อโปรยเรียกปลา 1", "09": "เหยื่อโปรยเรียกปลา 2", "0A": "เหยื่อโปรยเรียกปลา 3",
        "0B": "ข้องใส่ปลา ความจุ 10 ตัว", "0C": "ข้องใส่ปลา ความจุ 20 ตัว", "0D": "ข้องใส่ปลา ความจุ 30 ตัว",
        "0E": "แม่เหล็ก", "0F": "ขวดนม", "10": "นม", "11": "สลาก", "12": "เทียน",
        "13": "สเตอริโอ", "14": "โมโน", "15": "เต้าหู้ทอด", "16": "ดอกไม้ไฟ", "17": "กุญแจ",
    },
    "food": {"08": "ปลา"},
}


FLY_FAMILY_TH = {
    "Mayfly": "แมลงชีปะขาว", "Caddis": "แมลงหนอนปลอกน้ำ",
    "Diptera": "แมลงปีกคู่", "Stonefly": "แมลงสโตนฟลาย",
}


def display_name(category, item, fly_customizer=None):
    item_id = item["id"].upper()
    if category == "food" and item_id == "0A":
        return {"th": "เห็ด (ชนิดมีพิษ)"}, {"th": "คำขยายเพื่อแยกจากชื่อเมนูภาษาไทยที่แสดงว่า เห็ด"}
    # A Thai patch label exists for these records and remains the preferred wording.
    if item.get("nameTh"):
        return None, None
    if category == "fly":
        family = item["nameEn"].split()[0]
        wet_dry = "แบบเปียก" if "wet" in item["nameEn"].lower() else "แบบแห้ง"
        return {"th": f"บอดี้ฟลาย{FLY_FAMILY_TH.get(family, family)}{wet_dry} {item_id}"}, {"th": "คำแปลชื่อญี่ปุ่นโดยตรง ไม่ใช่ภาพป้ายจากแพตช์ไทย"}
    if category in ("fly_wing", "fly_tail"):
        family = item["nameEn"].split(" · ")[0]
        wet_dry = "แบบเปียก" if "Wet" in item["nameEn"] else "แบบแห้ง"
        part = "ปีกฟลาย" if category == "fly_wing" else "หางฟลาย"
        return {"th": f"{part} {FLY_FAMILY_TH.get(family, family)}{wet_dry} {item_id}"}, {"th": "คำแปลชื่อญี่ปุ่นโดยตรง ไม่ใช่ภาพป้ายจากแพตช์ไทย"}
    translated = TH_DIRECT_NAMES.get(category, {}).get(item_id)
    if translated:
        return {"th": translated}, {"th": "คำแปลชื่อญี่ปุ่นโดยตรง ไม่ใช่ภาพป้ายจากแพตช์ไทย"}
    return None, None


def build():
    catalogue = load(CATALOGUE / "gallery-data.json")
    acceptance = load(DATA / "fish-acceptance.json")
    lure_coverage = load(DATA / "lure-coverage.json")
    rod_research = load(DATA / "rod-response.json")
    food_research = load(DATA / "food-effects-confirmed.json")
    thai_fish_names = stage_fish_names()

    fish = {entry["id_hex"].upper(): entry for entry in acceptance["fish_profiles"]}
    valid_fish = {item_id for item_id, entry in fish.items() if not entry.get("name_has_unmapped_glyph") and int(item_id, 16) != 0x43}
    sinker_route_fish = {
        entry["id_hex"].upper()
        for entry in acceptance["fish_profiles"]
        if (hx_number(entry["mode1_prefilter_byte_+13_hex"]) & 0x08)
        and hx_number(entry["random_threshold_byte_+3_hex"]) != 0
        and entry["id_hex"].upper() in valid_fish
    }
    lures = {entry["id_hex"].upper(): entry for entry in lure_coverage["lures"]}
    baits = {entry["id_hex"].upper(): entry for entry in acceptance["baits"]}
    bodies = {entry["id_hex"].upper(): entry for entry in acceptance["fly_bodies"]}
    rods = {entry["id_hex"].upper(): entry for entry in rod_research["entries"]}
    food = {entry["id"].replace("0x", "").upper(): entry for entry in food_research["items"]}

    rod_groups = defaultdict(list)
    for entry in rod_research["entries"]:
        rod_groups[entry["style_code"]].append(entry)
    rod_ranks = {}
    for style_code, entries in rod_groups.items():
        for field, rank_name in (("cast_aim_hold_cutoff_raw", "aim"), ("range_multiplier_raw", "range")):
            ordered = sorted(entries, key=lambda row: row[field], reverse=True)
            for rank, entry in enumerate(ordered, 1):
                rod_ranks[(entry["id_hex"].upper(), rank_name)] = (rank, len(entries))

    hook_targets = {
        "01": "37", "02": "3B", "03": "36", "04": "0D", "05": "25",
        "0A": "38", "0B": "39", "0C": "01", "0D": "03",
    }
    item_data = {}
    for item in catalogue["items"]:
        category, item_id = item["category"], item["id"].upper()
        entry = {
            "summary": {},
            "facts": {"en": [], "ja": [], "th": []},
            "evidenceNotes": {"en": [], "ja": [], "th": []},
            "fishIds": [],
        }

        translated, source = display_name(category, item)
        if translated:
            entry["displayName"] = translated
            entry["displayNameSource"] = source

        if category == "rod":
            rod = rods[item_id]
            style_code = rod["style_code"]
            style = STYLE[style_code]
            group_key = rod["style"]
            aim_rank, group_count = rod_ranks[(item_id, "aim")]
            range_rank, _ = rod_ranks[(item_id, "range")]
            cutoff = rod["cast_aim_hold_cutoff_raw"]
            range_mult = rod["range_multiplier_raw"]
            range_units = rod["range_threshold_internal_at_base_0x0150"]
            if style_code in (2, 4):
                hp_detail = loc(
                    "Below 100 HP the automatic aim cutoff shrinks with current HP (minimum 10); at 100 HP it uses the full value.",
                    "HPが100未満では照準の自動移行上限がHPに応じて短くなる（最小10）。HP100以上では全値を使う。",
                    "ถ้า HP ต่ำกว่า 100 ช่วงเล็งก่อนเปลี่ยนอัตโนมัติจะสั้นลงตาม HP (ต่ำสุด 10); ที่ HP 100 ใช้ค่าเต็ม",
                )
            else:
                hp_detail = None
            entry["summary"] = loc(
                f"Use for {style['en']} fishing; a longer aim window gives you more time to position the cast.",
                f"{style['ja']}釣り用。照準時間が長いほど投げる位置を調整できる。",
                f"ใช้ตกแบบ{style['th']}; ช่วงเล็งที่นานขึ้นให้เวลาปรับจุดปล่อยเหยื่อมากขึ้น",
            )
            entry["facts"] = loc_lists(
                [f"Aim window ranks {aim_rank}/{group_count} among this style at full HP; rank 1 is longest."],
                [f"HP満タン時の照準時間は同系統{group_count}本中{aim_rank}位。1位が最長。"],
                [f"เมื่อ HP เต็ม ช่วงเล็งอยู่ลำดับ {aim_rank}/{group_count} ในคันชนิดเดียวกัน; อันดับ 1 นานที่สุด"],
            )
            if hp_detail:
                entry["facts"]["en"].append("Casting and lure rods give you a shorter aim window when HP is below 100.")
                entry["facts"]["ja"].append("キャスティング・ルアー竿はHP100未満で照準時間が短くなる。")
                entry["facts"]["th"].append("คันคาสติ้งและคันลัวร์มีช่วงเล็งสั้นลงเมื่อ HP ต่ำกว่า 100")
            entry["evidenceNotes"] = loc_lists(
                [f"At 100 HP the cutoff is {cutoff} game counter ticks. The later reach threshold is {range_units} internal position units ({range_mult} × 336), not meters. These are handling values, not catch power."],
                [f"HP100時の上限はゲーム内カウンター{cutoff}。後段の到達しきい値は{range_units}内部位置単位（{range_mult} × 336）で、メートルではない。釣果の強さを示す値ではない。"],
                [f"เมื่อ HP 100 เกณฑ์ค้างเล็งคือ {cutoff} หน่วยตัวนับ; เกณฑ์ระยะช่วงสู้ปลาคือ {range_units} หน่วยตำแหน่งภายในเกม ({range_mult} × 336) ไม่ใช่เมตร ทั้งสองค่าไม่ใช่พลังจับปลา"],
            )
            if hp_detail:
                for lang in ("en", "ja", "th"):
                    entry["evidenceNotes"][lang].append(hp_detail[lang])
            entry["rodMetrics"] = {
                "styleCode": style_code,
                "style": style,
                "aimCutoffRaw": cutoff,
                "aimCutoffAt100Hp": cutoff,
                "reachMultiplierRaw": range_mult,
                "reachThresholdInternalAtBase0150": range_units,
            }
            entry["comparisonGroup"] = group_key
            entry["comparison"] = {
                "group": style,
                "aimRankAt100Hp": aim_rank,
                "reachRank": range_rank,
                "of": group_count,
                "en": f"Within {style['en']} rods: aim window {aim_rank}/{group_count} at full HP; reach threshold {range_rank}/{group_count}. Rank 1 is longest/highest in that dimension.",
                "ja": f"{style['ja']}用の竿{group_count}本中、HP満タン時の照準時間は{aim_rank}位、到達しきい値は{range_rank}位。1位が最長・最大。",
                "th": f"ในกลุ่มคัน{style['th']} {group_count} คัน: ช่วงเล็ง {aim_rank}/{group_count} เมื่อ HP เต็ม; เกณฑ์ระยะ {range_rank}/{group_count}; อันดับ 1 คือเวลานาน/ค่าสูงสุด",
            }
            match_code = (rod.get("fish_id_match_label") or {}).get("id_hex")
            if match_code:
                target = fish.get(match_code.replace("0x", "").upper())
                if target:
                    target_obj = {"fishId": target["id_hex"], "nameJa": target["name_ja_from_rom"]}
                    if target["name_ja_from_rom"] in thai_fish_names:
                        target_obj["nameTh"] = thai_fish_names[target["name_ja_from_rom"]]
                    entry["targetMatches"] = [target_obj]
                    entry["targetMatchScope"] = loc(
                        "The game uses a different rod-response calculation for this fish; it does not establish an exclusive pairing or easier catch.",
                        "この魚では竿の応答計算が変わる。専用竿や釣りやすさを示すものではない。",
                        "เกมใช้การคำนวณตอบสนองของคันเบ็ดต่างออกไปกับปลาชนิดนี้; ไม่ได้แปลว่าเป็นคู่คันเฉพาะหรือจับง่ายกว่า",
                    )

        elif category == "lure":
            lure = lures[item_id]
            entry["fishIds"] = [fish_id for fish_id in lure["fish_ids_passing_gate"] if fish_id.upper() in valid_fish]
            entry["fishScope"] = loc(
                "The fish shown pass one lure check for this exact item; position, timing, and landing the fish still matter.",
                "表示された魚はこのルアーの判定を1つ通る。位置・タイミング・取り込みは別条件。",
                "ปลาที่แสดงผ่านเงื่อนไขหนึ่งของลัวร์ชิ้นนี้; ตำแหน่ง จังหวะ และการดึงขึ้นยังมีผล",
            )
            count = len(entry["fishIds"])
            entry["summary"] = loc(
                "Use with a lure rod; the pictures below show fish that pass this lure's check.",
                "ルアー竿で使う。下の魚画像は、このルアーの判定を通る魚。",
                "ใช้กับคันลัวร์; รูปปลาด้านล่างแสดงปลาที่ผ่านเงื่อนไขของลัวร์ชิ้นนี้",
            )
            same_name = [x for x in catalogue["items"] if x["category"] == "lure" and x["nameJa"] == item["nameJa"]]
            same_masks = {lures[x["id"].upper()]["hook_gate_mask_hex"] for x in same_name if x["id"].upper() in lures}
            if len(same_name) > 1 and len(same_masks) > 1:
                entry["facts"] = loc_lists(
                    ["Several lures share the same printed name; use the fish pictures on this exact card."],
                    ["同じ日本語名でも魚リストが異なるIDがある。このIDのリストを確認。"],
                    ["ลัวร์หลายชิ้นใช้ชื่อเหมือนกัน แต่รายชื่อปลาไม่เหมือนกัน ให้ดูรูปปลาของชิ้นนี้"],
                )
            entry["evidenceNotes"] = loc_lists(
                [f"{count} fish profiles pass this lure record's species-mask comparison."],
                [f"このルアーレコードは{count}種の魚プロフィールで魚種マスク判定を通る。"],
                [f"โปรไฟล์ปลา {count} ชนิดผ่านเงื่อนไข mask ของระเบียนลัวร์นี้"],
            )
            special_id = lure.get("special_fish_compare_id_hex", "00").upper()
            if special_id != "00" and special_id in fish:
                target = fish[special_id]
                target_obj = {"fishId": special_id, "nameJa": target["name_ja_from_rom"]}
                if target["name_ja_from_rom"] in thai_fish_names:
                    target_obj["nameTh"] = thai_fish_names[target["name_ja_from_rom"]]
                entry["specialResponseTarget"] = target_obj
                entry["specialResponseScope"] = loc(
                    "The game uses a separate lure-response calculation for this fish; no catch-rate advantage is established.",
                    "この魚ではルアーの応答計算が変わる。釣果率の優位性は未確認。",
                    "เกมใช้การคำนวณตอบสนองของลัวร์ต่างออกไปกับปลาชนิดนี้; ยังไม่พบว่าเพิ่มโอกาสจับ",
                )
                entry["evidenceNotes"]["en"].append("This is a conditional response branch, not an exclusive accepted-fish list.")
                entry["evidenceNotes"]["ja"].append("条件付きの応答分岐で、釣れる魚を限定するリストではない。")
                entry["evidenceNotes"]["th"].append("เป็นเงื่อนไขตอบสนองเฉพาะ ไม่ใช่รายชื่อปลาที่ตกได้เท่านั้น")

        elif category == "bait":
            bait = baits[item_id]
            entry["fishIds"] = [fish_id for fish_id in bait["fish_ids_passing_mask_gate"] if fish_id.upper() in valid_fish]
            entry["fishIdsByRoute"] = {
                "float": list(entry["fishIds"]),
                "sinker": [fish_id for fish_id in entry["fishIds"] if fish_id.upper() in sinker_route_fish],
            }
            if entry["fishIdsByRoute"]["sinker"]:
                entry["fishScope"] = loc(
                    "Fish shown pass this bait check with a float. The sinker route has a shorter target list; position, timing, and landing still matter.",
                    "表示された魚はウキ仕掛けでこのエサの判定を通る。オモリ仕掛けでは対象が少なく、位置・タイミング・取り込みも別条件。",
                    "ปลาที่แสดงผ่านเงื่อนไขของเหยื่อนี้เมื่อใช้ทุ่น; ชุดตะกั่วใช้ได้กับปลาบางชนิดกว่า และตำแหน่ง จังหวะ การดึงขึ้นยังมีผล",
                )
                entry["summary"] = loc(
                    "Use with a float or sinker; choose a fish from the pictures below. The sinker route has fewer targets.",
                    "ウキ・オモリ仕掛け用のエサ。下の魚画像から対象を選ぶ。オモリ仕掛けでは対象が少ない。",
                    "ใช้ตกแบบทุ่นหรือตะกั่ว; เลือกปลาจากรูปด้านล่าง โดยชุดตะกั่วมีเป้าหมายน้อยกว่า",
                )
            else:
                entry["fishScope"] = loc(
                    "Fish shown pass this bait check in the float route. No fish pass this bait's sinker-route check; position, timing, and landing still matter.",
                    "表示された魚はウキ仕掛けでこのエサの判定を通る。このエサはオモリ仕掛けの判定を通る魚がいない。位置・タイミング・取り込みも別条件。",
                    "ปลาที่แสดงผ่านเงื่อนไขของเหยื่อนี้ในเส้นทางทุ่น; ไม่มีปลาที่ผ่านเงื่อนไขเหยื่อนี้ในเส้นทางตะกั่ว และตำแหน่ง จังหวะ การดึงขึ้นยังมีผล",
                )
                entry["summary"] = loc(
                    "Use with a float; choose a fish from the pictures below.",
                    "ウキ仕掛け用のエサ。下の魚画像から対象を選ぶ。",
                    "ใช้ตกแบบทุ่น; เลือกปลาจากรูปด้านล่าง",
                )
            entry["evidenceNotes"] = loc_lists(
                ["The float list is based on the bait-record fish comparison. Sinker-route fish also need a separate profile flag and nonzero threshold."],
                ["ウキ経路の魚リストはエサレコードの魚判定に基づく。オモリ経路では魚プロフィールの別フラグと非ゼロしきい値も必要。"],
                ["รายชื่อเส้นทางทุ่นคำนวณจากการเทียบปลาในระเบียนเหยื่อ; เส้นทางตะกั่วยังต้องผ่านแฟล็กและเกณฑ์โปรไฟล์ปลาเพิ่ม"],
            )

        elif category == "fly":
            body = bodies[item_id]
            entry["fishIds"] = [fish_id for fish_id in body["fish_ids_passing_mask_gate"] if fish_id.upper() in valid_fish]
            entry["fishScope"] = loc(
                "Fish shown pass this body's check. The game also checks the body and wing together against a value that changes during play.",
                "表示された魚はこのボディの判定を通る。ゲーム中に変化する値に対して、ボディとウィングの組み合わせも判定される。",
                "ปลาที่แสดงผ่านเงื่อนไขของบอดี้นี้; เกมยังตรวจบอดี้กับปีกที่เลือกเทียบกับค่าซึ่งเปลี่ยนระหว่างเล่น",
            )
            entry["summary"] = loc(
                "Main body for a custom fly; the fish pictures show which fish pass its body check. The game checks the wing too.",
                "毛バリのボディ部品。魚画像はボディ判定を通る魚。ウィングも別に判定される。",
                "บอดี้หลักของฟลาย; รูปปลาด้านล่างคือปลาที่ผ่านเงื่อนไขบอดี้ และเกมตรวจปีกเพิ่มด้วย",
            )
            entry["evidenceNotes"] = loc_lists(
                ["Body eligibility is only one check; the game also compares the selected body and wing with a changing in-game value."],
                ["ボディの適合判定は一つだけ。選んだボディとウィングは変化するゲーム内値とも比較される。"],
                ["ด่านบอดี้เป็นเพียงเงื่อนไขหนึ่ง; เกมยังเทียบบอดี้และปีกที่เลือกกับค่าที่เปลี่ยนระหว่างเล่น"],
            )

        elif category == "fly_wing":
            wing_class = int(item_id, 16) & 3
            entry["summary"] = loc(
                "Wing piece for a custom fly; the chosen wing affects an extra fish check together with the body.",
                "毛バリのウィング部品。ボディと一緒に追加の魚判定へ影響する。",
                "ชิ้นส่วนปีกของฟลาย; ปีกที่เลือกมีผลต่อเงื่อนไขปลาเพิ่มเติมร่วมกับบอดี้",
            )
            entry["wingGateClass"] = wing_class
            entry["facts"] = loc_lists(
                ["No wing class is shown to be best for every fish or every cast."],
                ["すべての魚・キャストで最良と確認されたウィング分類はない。"],
                ["ยังไม่มีหลักฐานว่ากลุ่มปีกแบบใดดีที่สุดกับปลาทุกชนิดหรือทุกครั้งที่ตก"],
            )
            entry["evidenceNotes"] = loc_lists(
                [f"Its four-way ID class is {wing_class}; matching the changing runtime value blocks the traced fly event gate."],
                [f"4分類のID値は{wing_class}。変化する実行時値と一致すると追跡した毛バリ判定を止める。"],
                [f"กลุ่มจาก ID มี 4 แบบ; ชิ้นนี้อยู่กลุ่ม {wing_class}; ถ้าตรงกับค่าที่เปลี่ยนระหว่างเล่น ด่านฟลายที่แกะได้จะไม่ผ่าน"],
            )

        elif category == "fly_tail":
            entry["summary"] = loc(
                "Tail piece for custom flies; choose it as part of the fly's appearance and family.",
                "毛バリのテール部品。毛バリの見た目・系統を組み立てる部品。",
                "ชิ้นส่วนหางสำหรับประกอบฟลาย ใช้เลือกองค์ประกอบและรูปลักษณ์ของฟลาย",
            )
            entry["facts"] = loc_lists(
                ["The tracked fish check uses the body and wing; it does not read this tail part."],
                ["追跡した魚判定はボディとウィングを使い、このテール部品は読まない。"],
                ["เงื่อนไขปลาที่แกะได้ตรวจบอดี้กับปีก ไม่ได้อ่านชิ้นส่วนหางนี้"],
            )

        elif category == "hook":
            entry["summary"] = loc(
                "Hook part of your fishing tackle. Some hook IDs have a fish-specific response; see the fish picture on this card.",
                "仕掛けのハリ。魚別の応答があるIDは、このカードの魚画像を確認。",
                "ส่วนตะขอของชุดตกปลา; บาง ID มีการตอบสนองแยกตามปลา ดูรูปปลาบนการ์ดนี้",
            )
            target_id = hook_targets.get(item_id)
            if target_id and target_id in fish:
                target = fish[target_id]
                target_obj = {"fishId": target_id, "nameJa": target["name_ja_from_rom"]}
                if target["name_ja_from_rom"] in thai_fish_names:
                    target_obj["nameTh"] = thai_fish_names[target["name_ja_from_rom"]]
                entry["targetMatches"] = [target_obj]
                entry["targetMatchScope"] = loc(
                    "For this fish, the hook changes a fight-response calculation. Whether that makes the fish easier to land has not been measured.",
                    "この魚ではハリのファイト応答計算が変わる。取り込みやすくなるかは未測定。",
                    "กับปลาชนิดนี้ ตะขอเปลี่ยนการคำนวณตอบสนองตอนสู้ปลา; ยังไม่ได้วัดว่าดึงขึ้นง่ายกว่าไหม",
                )

        elif category == "float_weight":
            if item_id in {f"{n:02X}" for n in range(1, 9)}:
                entry["fishIds"] = sorted(valid_fish, key=lambda fish_id: int(fish_id, 16))
                entry["fishScope"] = loc(
                    "This float is not tied to a particular fish. The fish still has to pass the selected bait and fishing checks.",
                    "このウキに特定の魚種制限はない。魚は選んだエサなどの判定も通る必要がある。",
                    "ทุ่นนี้ไม่ได้จำกัดปลาชนิดใดเป็นพิเศษ; ปลายังต้องผ่านเงื่อนไขของเหยื่อและการตกปลาอื่นด้วย",
                )
            elif item_id in ("09", "0A"):
                entry["fishIds"] = sorted(sinker_route_fish, key=lambda fish_id: int(fish_id, 16))
                entry["fishScope"] = loc(
                    "Fish shown can enter the sinker route; the selected bait must also work for that fish.",
                    "表示された魚はオモリ経路の対象。選んだエサもその魚の判定を通る必要がある。",
                    "ปลาที่แสดงเข้าเงื่อนไขเส้นทางตะกั่ว; เหยื่อที่เลือกต้องผ่านเงื่อนไขของปลาตัวนั้นด้วย",
                )
            if item_id in ("09", "0A"):
                entry["summary"] = loc(
                    "Use with the sinker-equipped bait setup; the fish pictures below show which fish pass that route's extra check.",
                    "オモリを使うエサ釣り仕掛け用。下の魚画像は、この経路の追加判定を通る魚。",
                    "ใช้กับชุดเหยื่อติดตะกั่ว; รูปปลาด้านล่างแสดงปลาที่ผ่านเงื่อนไขเพิ่มของเส้นทางนี้",
                )
            elif item_id == "08":
                entry["summary"] = loc(
                    "Line marker; the ROM loads this item as the fixed marker when preparing a fly.",
                    "目印。毛バリ準備時にROMが固定マーカーとして読み込む。",
                    "เครื่องหมายบนสาย; ROM โหลดชิ้นนี้เป็นเครื่องหมายประจำตอนเตรียมฟลาย",
                )
            else:
                entry["summary"] = loc(
                    "Use in the float-equipped bait setup. This part does not narrow the target fish; the bait and other checks do.",
                    "ウキ付きエサ釣り仕掛けで使う。この部品自体は対象魚を絞らず、エサなどが判定する。",
                    "ใช้ในชุดเหยื่อติดทุ่น; ชิ้นส่วนนี้ไม่ได้จำกัดชนิดปลา เหยื่อและเงื่อนไขอื่นเป็นตัวตรวจ",
                )
            entry["facts"] = loc_lists(
                ["Float and sinker choices use different bait setups."],
                ["ウキとおもりではエサ釣りの仕掛け経路が異なる。"],
                ["การเลือกทุ่นกับตะกั่วจะใช้ชุดตกปลาแบบเหยื่อคนละเส้นทาง"],
            )
            if item_id == "08":
                entry["facts"]["en"].append("The ROM also loads Marker ID 08 as the fixed marker during fly setup.")
                entry["facts"]["ja"].append("ROMは毛バリ準備時にも固定の目印ID08を読み込む。")
                entry["facts"]["th"].append("ROM ยังโหลดเครื่องหมาย ID 08 นี้เป็นเครื่องหมายประจำตอนเตรียมฟลายด้วย")
            entry["evidenceNotes"] = loc_lists(
                ["Float IDs 01–08 select the float-equipped bait route; sinker IDs 09–0A select a separate route with an added fish-profile flag check. The manual says sinker weights can help casting distance; the numeric weight/depth effect was not measured."],
                ["ウキID01–08はウキ付きエサ釣り経路、おもりID09–0Aは魚プロフィール追加フラグを確認する別経路。説明書はおもりで飛距離を伸ばすとするが、数値の重さ・深さ効果は未測定。"],
                ["ทุ่น ID 01–08 เข้าชุดเหยื่อติดทุ่น; ตะกั่ว ID 09–0A เข้าเส้นทางแยกที่ตรวจแฟล็กปลาเพิ่ม คู่มือบอกว่าตะกั่วช่วยตีได้ไกลขึ้น แต่ยังไม่ได้วัดผลเชิงตัวเลขเรื่องน้ำหนักหรือความลึก"],
            )

        elif category == "food":
            effect = food[item_id]
            if item_id == "08":
                entry["summary"] = loc(
                    "Eat one fish from the keepnet; larger fish restore more HP.",
                    "びくの魚を1匹食べる。魚が大きいほどHP回復量が多い。",
                    "กินปลา 1 ตัวจากข้อง; ปลาตัวใหญ่ฟื้น HP ได้มากกว่า",
                )
                entry["facts"] = loc_lists(
                    ["A fish with stored size 30 restored 7 HP in the controlled run."],
                    ["保存サイズ30の魚では、管理した実行でHPを7回復。"],
                    ["การทดสอบปลาที่มีขนาดบันทึก 30 ฟื้น HP ได้ 7 หน่วย"],
                )
                entry["evidenceNotes"] = loc_lists(
                    ["Controlled runs fit the tested values to floor(stored fish size ÷ 4); one basket fish is consumed. The size unit was not identified."],
                    ["確認した実行では保存サイズ÷4の切り捨てと一致し、びくの魚を1匹消費。サイズの単位は未特定。"],
                    ["การทดลองตรงกับสูตรขนาดปลาที่บันทึกไว้หาร 4 แล้วปัดลง และใช้ปลาในข้อง 1 ตัว; ยังไม่ทราบหน่วยขนาด"],
                )
                entry["hpRecovery"] = {"formula": "floor(raw stored fish size / 4)", "sample": {"fishSize": 30, "hp": 7}}
            elif item_id == "0A":
                entry["summary"] = loc(
                    "Poison mushroom: eating it sets current HP to 0. The tested game menu shows the same label as the healing mushroom.",
                    "毒キノコ。食べると現在HPが0になる。確認したメニューでは回復キノコと同じ表示名。",
                    "เห็ดพิษ: กินแล้ว HP เหลือ 0; เมนูที่ทดสอบแสดงชื่อเหมือนเห็ดที่ฟื้นพลัง",
                )
                entry["hpRecovery"] = {"effect": "sets current HP to 0"}
            else:
                delta = effect.get("hp_delta")
                if delta is not None:
                    entry["summary"] = loc(
                        f"Eat it to restore {delta} HP.",
                        f"食べるとHPを{delta}回復。",
                        f"กินแล้วฟื้น HP {delta} หน่วย",
                    )
                    entry["hpRecovery"] = {"hp": delta}
            if item_id in ("09", "0A"):
                entry["facts"] = loc_lists(
                    ["In the tested menu, both IDs display “きのこ” but have opposite effects: +10 HP versus HP 0."],
                    ["確認したメニューでは両IDとも「きのこ」と表示されるが、効果は+10HPとHP0で異なる。"],
                    ["เมนูที่ทดสอบแสดงทั้งสอง ID ว่า “きのこ” แต่ผลต่างกัน: ฟื้น 10 HP กับทำให้ HP เหลือ 0"],
                )

        elif category == "general_tool":
            summary, facts = GENERAL_TOOL_COPY[item_id]
            entry["summary"] = summary
            entry["facts"] = {lang: [fact[lang] for fact in facts] for lang in ("en", "ja", "th")}

        elif category == "fly_wing":
            pass

        elif category == "fly_tail":
            pass

        else:
            entry["summary"] = loc(
                "Inventory item; use is described by its category and in-game name.",
                "所持アイテム。用途はカテゴリとゲーム内名称を参照。",
                "ไอเท็มในช่องเก็บของ; ดูประเภทและชื่อในเกมเพื่อระบุการใช้งาน",
            )

        # Every card gets a short actionable category fact where it helps; no invented
        # mechanics are attached to an item's ROM price or sprite.
        if category == "bait" and not entry["facts"]["en"]:
            pass
        if category == "lure" and not entry["facts"]["en"]:
            pass
        if category == "hook" and not entry["facts"]["en"]:
            entry["facts"] = loc_lists(
                ["Use as the hook part of fishing tackle."],
                ["仕掛けのハリとして使う。"],
                ["ใช้เป็นส่วนตะขอของชุดตกปลา"],
            )

        if category == "rod":
            entry["evidence"] = {"type": "rom_trace", "sources": ["data/rod-response.json", "docs/rod-response-research.md"]}
        elif category == "lure":
            entry["evidence"] = {"type": "rom_trace", "sources": ["data/lure-coverage.json", "data/lure-response.json", "docs/lure-response-research.md"]}
        elif category == "bait":
            entry["evidence"] = {"type": "rom_trace", "sources": ["data/fish-acceptance.json", "docs/fish-acceptance-research.md"]}
        elif category == "fly":
            entry["evidence"] = {"type": "rom_trace", "sources": ["data/fish-acceptance.json", "data/fly-customization.json"]}
        elif category in ("fly_wing", "fly_tail"):
            entry["evidence"] = {"type": "rom_trace", "sources": ["data/fish-acceptance.json", "data/fly-customization.json"]}
        elif category in ("hook", "float_weight"):
            entry["evidence"] = {"type": "rom_trace", "sources": ["data/hook-float-use.json"]}
        elif category == "food":
            entry["evidence"] = {"type": "controlled_runtime_observation", "sources": ["data/food-effects-confirmed.json"]}
        elif category == "general_tool":
            guide_ids = {"01", "02", "03", "05", "07", "0F", "10", "15", "16", "17"}
            event_ids = {"06", "12", "15", "16", "17"}
            if item_id in guide_ids:
                kind = "player_guide_report"
                sources = ["catalogue/gallery-data.json", "data/stages/stages-2-3.json"] if item_id == "01" else ["catalogue/gallery-data.json"]
            elif item_id in event_ids:
                kind, sources = "player_guide_report", ["catalogue/gallery-data.json"]
            elif item_id in {"0B", "0C", "0D", "13", "14"}:
                kind, sources = "in_game_label_or_menu_name", ["catalogue/gallery-data.json"]
            else:
                kind, sources = "item_name_only", ["catalogue/gallery-data.json"]
            entry["evidence"] = {"type": kind, "sources": sources}
        else:
            entry["evidence"] = {"type": "catalogue_label", "sources": ["catalogue/gallery-data.json"]}

        if entry.get("displayNameSource"):
            entry["evidence"]["displayNameType"] = "editorial_translation_or_clarification"

        item_data[key(category, item_id)] = entry

    output = {
        "schema_version": 1,
        "scope": loc(
            "Player-facing notes cite ROM traces, controlled runtime observations, player-guide reports, or item labels per item. Fish lists describe only the check named in that item's fishScope.",
            "道具ごとにROM追跡・実行時確認・プレイヤーガイド・アイテム名を区別した用途メモ。魚リストの意味は各アイテムのfishScopeを参照。",
            "คำอธิบายนี้แยกที่มารายชิ้นว่าเป็นการแกะ ROM การทดสอบในเกม คู่มือผู้เล่น หรือแปลจากชื่อไอเท็ม; รายชื่อปลาแสดงเฉพาะเงื่อนไขที่ระบุใน fishScope",
        ),
        "sources": [
            "data/fish-acceptance.json",
            "data/lure-coverage.json",
            "data/rod-response.json",
            "data/food-effects-confirmed.json",
            "data/hook-float-use.json",
            "data/stages/*.json (Thai fish names where recorded)",
            "catalogue/gallery-data.json",
        ],
        "items": item_data,
    }
    save(CATALOGUE / "item-use.json", output)
    print(f"Wrote {len(item_data)} item-use entries to {CATALOGUE / 'item-use.json'}")


if __name__ == "__main__":
    build()
