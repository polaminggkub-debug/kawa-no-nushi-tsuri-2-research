#!/usr/bin/env python3
"""Build the player-facing use summaries joined from the published research data."""

import json
import re
from collections import defaultdict
from pathlib import Path

from bait_lure_copy import bait_copy, lure_copy, lure_special_scope
from gear_advice.facts import Facts
from gear_advice.overlay import use_overlay


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
    2: loc("Casting", "投げ釣り", "หวด"),
    4: loc("Lure", "ルアー", "ลัวร์"),
    8: loc("Fly", "毛バリ", "ฟลาย"),
}


GENERAL_TOOL_COPY = {
    "04": (loc("A net item; its field action has not been identified.", "網の道具。フィールドでの使い方は未特定。", "อุปกรณ์ตาข่าย; ยังไม่พบวิธีใช้ในฉาก"), []),
    "08": (loc("Named groundbait in the ROM; its effect on fish has not yet been traced.", "ROM名は寄せエサ。魚への効果は未追跡。", "ชื่อใน ROM คือเหยื่อโปรย; ยังไม่ได้ถอดโค้ดผลต่อปลา"), [loc("The three IDs share the same Japanese label; their differences are not decoded.", "3つのIDは同じ日本語名で、違いは未解明。", "ทั้งสาม ID ใช้ชื่อญี่ปุ่นเดียวกัน; ยังไม่พบความต่างด้านการใช้งาน")]),
    "09": (loc("Named groundbait in the ROM; its effect on fish has not yet been traced.", "ROM名は寄せエサ。魚への効果は未追跡。", "ชื่อใน ROM คือเหยื่อโปรย; ยังไม่ได้ถอดโค้ดผลต่อปลา"), [loc("The three IDs share the same Japanese label; their differences are not decoded.", "3つのIDは同じ日本語名で、違いは未解明。", "ทั้งสาม ID ใช้ชื่อญี่ปุ่นเดียวกัน; ยังไม่พบความต่างด้านการใช้งาน")]),
    "0A": (loc("Named groundbait in the ROM; its effect on fish has not yet been traced.", "ROM名は寄せエサ。魚への効果は未追跡。", "ชื่อใน ROM คือเหยื่อโปรย; ยังไม่ได้ถอดโค้ดผลต่อปลา"), [loc("The three IDs share the same Japanese label; their differences are not decoded.", "3つのIDは同じ日本語名で、違いは未解明。", "ทั้งสาม ID ใช้ชื่อญี่ปุ่นเดียวกัน; ยังไม่พบความต่างด้านการใช้งาน")]),
    "0B": (loc("The ROM label specifies a 10-fish basket; its capacity check has not yet been traced.", "ROM名は10匹用のびく。容量判定は未追跡。", "ชื่อใน ROM ระบุว่าเป็นกระชัง 10 ตัว; ยังไม่ได้ถอดโค้ดตรวจความจุ"), []),
    "0C": (loc("The ROM label specifies a 20-fish basket; its capacity check has not yet been traced.", "ROM名は20匹用のびく。容量判定は未追跡。", "ชื่อใน ROM ระบุว่าเป็นกระชัง 20 ตัว; ยังไม่ได้ถอดโค้ดตรวจความจุ"), []),
    "0D": (loc("The ROM label specifies a 30-fish basket; its capacity check has not yet been traced.", "ROM名は30匹用のびく。容量判定は未追跡。", "ชื่อใน ROM ระบุว่าเป็นกระชัง 30 ตัว; ยังไม่ได้ถอดโค้ดตรวจความจุ"), []),
    "0E": (loc("A compass inventory item.", "磁石（方位磁石）のアイテム。", "ไอเท็มเข็มทิศ"), []),
    "11": (loc("Lottery ticket; the prize result is not decoded.", "富くじ。賞品の内容は未解明。", "สลาก; ยังไม่พบผลรางวัล"), []),
    "13": (loc("Menu label: stereo. The setting handler has not yet been traced.", "メニュー名はステレオ。設定処理は未追跡。", "ชื่อเมนูคือสเตอริโอ; ยังไม่ได้ถอดโค้ดการตั้งค่า"), []),
    "14": (loc("Menu label: monaural. The setting handler has not yet been traced.", "メニュー名はモノラル。設定処理は未追跡。", "ชื่อเมนูคือโมโน; ยังไม่ได้ถอดโค้ดการตั้งค่า"), []),
}


BAIT_NAME_TH = {
    "01": "ไส้เดือน", "02": "หนอนแมลงวัน", "03": "หนอนแดง", "04": "แมลง",
    "05": "หนอนเลือด", "06": "หนอนทะเล", "07": "แมลงน้ำ", "08": "ตัวอ่อนแมลงหนอนปลอกน้ำ",
    "09": "ไข่ปลาแซลมอน", "0A": "ไส้เดือนใหญ่", "0B": "หนอนองุ่น", "0C": "ตัวอ่อนผึ้ง",
    "0D": "เหยื่อปั้น", "0E": "เหยื่อปั้นเฮระ", "0F": "เหยื่อปั้นปลาคาร์ป",
    "11": "เหยื่อหัวมัน", "12": "ปลาเล็ก", "13": "ปลาโดโจ",
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
        "01": "ทุ่นเฮระ",
        "04": "ทุ่นลูกบอล", "05": "ทุ่นแท่ง", "06": "ทุ่นลูกโอ๊ก", "07": "ทุ่นพริก",
        "08": "เครื่องหมายบนสาย", "09": "ตะกั่วทรงรี",
    },
    "general_tool": {
        "01": "กะละมัง", "02": "เรือแคนู", "03": "แว่นขยาย", "04": "ตาข่ายสีทอง",
        "05": "สมุดบันทึกการตกปลา", "06": "ไปรษณียบัตรที่ได้รับ", "07": "ไปรษณียบัตร",
        "08": "เหยื่อโปรยเรียกปลา 1", "09": "เหยื่อโปรยเรียกปลา 2", "0A": "เหยื่อโปรยเรียกปลา 3",
        "0B": "ข้องใส่ปลา ความจุ 10 ตัว", "0C": "ข้องใส่ปลา ความจุ 20 ตัว", "0D": "ข้องใส่ปลา ความจุ 30 ตัว",
        "0F": "ขวดนม", "10": "นม", "11": "สลาก", "12": "เทียน",
        "13": "สเตอริโอ", "14": "โมโน", "15": "เต้าหู้ทอด", "16": "ดอกไม้ไฟ", "17": "กุญแจ",
    },
}


ITEM_NAMES = load(DATA / "item-names.json")["items"]
FIXED_NAME_NOTE = {
    "fly": "ชื่อกลุ่มตามป้ายในแพตช์ไทย ต่อท้ายด้วยรหัสเพื่อแยกชิ้นที่ชื่อซ้ำกัน",
    "fly_wing": "ในเกมไม่มีชื่อชิ้นส่วนนี้ คู่มือตั้งชื่อตามตระกูล แบบเปียก/แห้ง ประเภทชิ้นส่วน และลักษณะที่เห็นในภาพ",
    "fly_tail": "ในเกมไม่มีชื่อชิ้นส่วนนี้ คู่มือตั้งชื่อตามตระกูล แบบเปียก/แห้ง ประเภทชิ้นส่วน และลักษณะที่เห็นในภาพ",
}


def display_name(category, item):
    """Names from data/item-names.json win; then Thai patch labels; then direct translations."""
    item_id = item["id"].upper()
    fixed = ITEM_NAMES.get(key(category, item_id), {}).get("displayName")
    if fixed:
        note = FIXED_NAME_NOTE.get(category, "ชื่อที่คู่มือกำหนดให้ชัดเจนขึ้น ไม่ใช่ภาพป้ายจากแพตช์ไทย")
        return dict(fixed), {"th": note}
    # A Thai patch label exists for these records and remains the preferred wording.
    if item.get("nameTh"):
        return None, None
    translated = TH_DIRECT_NAMES.get(category, {}).get(item_id)
    if translated:
        return {"th": translated}, {"th": "คำแปลชื่อญี่ปุ่นโดยตรง ไม่ใช่ภาพป้ายจากแพตช์ไทย"}
    return None, None


def apply_name_fixes(entry, category, item_id):
    """Overrides from data/item-names.json: replace summary/facts/evidenceNotes, append factsAdd."""
    fixes = ITEM_NAMES.get(key(category, item_id), {})
    for field in ("summary", "facts", "evidenceNotes"):
        if field in fixes:
            entry[field] = fixes[field]
    for lang, extra in fixes.get("factsAdd", {}).items():
        entry.setdefault("facts", {}).setdefault(lang, [])
        entry["facts"][lang] = entry["facts"][lang] + [fact for fact in extra if fact not in entry["facts"][lang]]


def build():
    catalogue = load(CATALOGUE / "gallery-data.json")
    acceptance = load(DATA / "fish-acceptance.json")
    lure_coverage = load(DATA / "lure-coverage.json")
    rod_research = load(DATA / "rod-response.json")
    food_research = load(DATA / "food-effects-confirmed.json")
    shop_stock = load(DATA / "shop-stock-rom.json")["items"] if (DATA / "shop-stock-rom.json").exists() else {}
    practical_research = {}
    for filename in ("hook-practical-research.json", "rod-lure-practical.json", "fly-practical-research.json", "food-practical-research.json"):
        if (DATA / filename).exists():
            raw_findings = load(DATA / filename)["items"]
            findings = raw_findings if isinstance(raw_findings, dict) else {key(row["category"], row["id"]): row["playerUse"] for row in raw_findings}
            for item_key, finding in findings.items():
                if item_key in practical_research:
                    raise ValueError(f"Duplicate practical research: {item_key}")
                practical_research[item_key] = finding
    tool_research = {}
    for filename in ("general-tool-actions.json", "chum-basket-use.json", "quest-tool-use.json"):
        research_path = DATA / filename
        if research_path.exists():
            document = load(research_path)
            for item_id, finding in document["items"].items():
                if item_id in tool_research:
                    raise ValueError(f"Duplicate general-tool research for {item_id}")
                tool_research[item_id] = finding
    if tool_research:
        expected_tools = {f"{n:02X}" for n in range(1, 24)}
        if set(tool_research) != expected_tools:
            missing = sorted(expected_tools - set(tool_research))
            extra = sorted(set(tool_research) - expected_tools)
            raise ValueError(f"General-tool coverage incomplete: missing={missing}, extra={extra}")
        for item_id, finding in tool_research.items():
            for locale in ("en", "ja", "th"):
                if not finding.get("summary", {}).get(locale) or not finding.get("facts", {}).get(locale):
                    raise ValueError(f"Missing practical tool explanation: {item_id}/{locale}")
    tool_locations = load(DATA / "tool-use-locations.json")["items"] if (DATA / "tool-use-locations.json").exists() else {}
    if (DATA / "forage-locations.json").exists():
        tool_locations.update(load(DATA / "forage-locations.json")["items"])
    thai_fish_names = stage_fish_names()
    gear_effects = load(DATA / "gear-effects.json")
    fish_visuals = catalogue.get("fishVisuals", {})

    def fish_names(fish_id):
        visual = fish_visuals.get(fish_id, {})
        latin = visual.get("nameLatin") or ""
        ja = visual.get("nameJa") or fish_id
        return {
            "en": visual.get("nameEn") or latin or ja,
            "ja": ja,
            "th": visual.get("nameTh") or " / ".join(visual.get("nameThVariants") or []) or latin or ja,
        }
    gear_overlay = use_overlay(Facts())

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
            for entry in ordered:
                rank = 1 + sum(other[field] > entry[field] for other in entries)
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
                f"Use for {style['en']} fishing; more time to aim gives you longer to position the cast.",
                f"{style['ja']}釣り用。狙う時間が長いほど投げる位置を調整できる。",
                f"ใช้ตกแบบ{style['th']}; มีเวลาเล็งนานขึ้นจะมีเวลาปรับจุดปล่อยเหยื่อมากขึ้น",
            )
            entry["facts"] = loc_lists(
                [f"Time to aim ranks {aim_rank}/{group_count} among this style at full HP; rank 1 is longest."],
                [f"HP満タン時の狙う時間は同系統{group_count}本中{aim_rank}位。1位が最長。"],
                [f"เมื่อ HP เต็ม เวลาเล็งอยู่ลำดับ {aim_rank}/{group_count} ในคันแบบเดียวกัน; อันดับ 1 คือนานที่สุด"],
            )
            if hp_detail:
                entry["facts"]["en"].append("Casting and lure rods give you less time to aim when HP is below 100.")
                entry["facts"]["ja"].append("投げ竿・ルアー竿はHP100未満で狙う時間が短くなる。")
                entry["facts"]["th"].append("คันหวดและคันลัวร์มีเวลาเล็งสั้นลงเมื่อ HP ต่ำกว่า 100")
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
                "en": f"Within {style['en']} rods: time to aim ranks {aim_rank}/{group_count} at full HP; line strength ranks {range_rank}/{group_count}. Rank 1 is longest/highest in that dimension.",
                "ja": f"{style['ja']}用の竿{group_count}本中、HP満タン時の狙う時間は{aim_rank}位、糸の切れにくさは{range_rank}位。1位が最長・最大。",
                "th": f"ในกลุ่มคัน{style['th']} {group_count} คัน: เวลาเล็งอันดับ {aim_rank}/{group_count} เมื่อ HP เต็ม; สายขาดยากอันดับ {range_rank}/{group_count}; อันดับ 1 คือดีที่สุด",
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
            selector = gear_effects["items"]["lure"][str(int(item_id, 16))]["sel"]
            entry["summary"], entry["facts"], entry["fishScope"], entry["evidenceNotes"] = lure_copy(selector)
            special_id = lure.get("special_fish_compare_id_hex", "00").upper()
            if special_id != "00" and special_id in fish:
                target = fish[special_id]
                target_obj = {"fishId": special_id, "nameJa": target["name_ja_from_rom"]}
                if target["name_ja_from_rom"] in thai_fish_names:
                    target_obj["nameTh"] = thai_fish_names[target["name_ja_from_rom"]]
                entry["specialResponseTarget"] = target_obj
                entry["specialResponseScope"] = lure_special_scope(fish_names(special_id))

        elif category == "bait":
            bait = baits[item_id]
            entry["fishIds"] = [fish_id for fish_id in bait["fish_ids_passing_mask_gate"] if fish_id.upper() in valid_fish]
            entry["fishIdsByRoute"] = {
                "float": list(entry["fishIds"]),
                "sinker": [fish_id for fish_id in entry["fishIds"] if fish_id.upper() in sinker_route_fish],
            }
            matched = item["rawFields"].get("+1", 0)
            matched_fish = fish_names(f"{matched:02X}") if matched and item_id != "17" else None
            entry["summary"], entry["facts"], entry["fishScope"], entry["evidenceNotes"] = bait_copy(
                bool(entry["fishIdsByRoute"]["sinker"]), matched_fish
            )

        elif category == "fly":
            # Summary, facts and notes come from data/fly-practical-research.json (scripts/build_fly_advice.cjs).
            body = bodies[item_id]
            entry["fishIds"] = [fish_id for fish_id in body["fish_ids_passing_mask_gate"] if fish_id.upper() in valid_fish]

        elif category == "fly_wing":
            entry["wingGateClass"] = int(item_id, 16) & 3

        elif category == "fly_tail":
            pass

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
                ["Float IDs 01–08 select the float-equipped bait route; sinker IDs 09–0A select a separate route with an added fish-profile flag check."],
                ["ウキID01–08はウキ付きエサ釣り経路、おもりID09–0Aは魚プロフィール追加フラグを確認する別経路。"],
                ["ทุ่น ID 01–08 เข้าชุดเหยื่อติดทุ่น; ตะกั่ว ID 09–0A เข้าเส้นทางแยกที่ตรวจแฟล็กปลาเพิ่ม"],
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
            elif item_id == "09":
                entry["summary"] = loc(
                    "Tan flat mushroom: restores 10 HP, up to your maximum. In the food menu it has the same name as the poison mushroom (きのこ), but the icon is different: this one is tan and flat, the poison one is red with yellow spots. Check the icon before you eat. A search spot does not guarantee this type: the magnifier picks the mushroom type from the game's shared random sequence.",
                    "茶色く平たいキノコ：HPを10回復（最大HPまで）。食料メニューでは毒キノコと同じ名前（きのこ）だが、アイコンが違う：これは茶色で平たく、毒キノコは黄色い斑点のある赤。食べる前にアイコンを確認する。同じ探索地点へ戻っても、この種類が出るとは限らない。虫めがねはゲーム共通の乱数列からキノコの種類を選ぶ。",
                    "เห็ดสีน้ำตาลอ่อนทรงแบน: ฟื้น 10 HP แต่ไม่เกินค่าสูงสุด ในเมนูอาหารมีชื่อเดียวกับเห็ดพิษ (きのこ) แต่ไอคอนต่างกัน: ตัวนี้สีน้ำตาลอ่อนและแบน ส่วนเห็ดพิษสีแดงมีจุดเหลือง ก่อนกินให้ดูไอคอน กลับไปค้นจุดเดิมก็ไม่รับประกันว่าจะได้เห็ดชนิดนี้ เพราะแว่นขยายเลือกชนิดจากลำดับสุ่มร่วมของเกม",
                )
            elif item_id == "0A":
                entry["summary"] = loc(
                    "Poison mushroom, red with yellow spots. Eating it sets your HP to 0: you black out and wake up at your saved position with 1 HP, keeping your money, fish and tools. In the food menu it has the same name as the healing mushroom (きのこ), so look at the icon: tan and flat is safe, red with yellow spots is poison. If in doubt, eat shop food instead.",
                    "毒キノコ（黄色い斑点のある赤）。食べるとHPが0になる：気絶して保存位置で1HPの状態で目を覚まし、お金・魚・道具はそのまま。食料メニューでは回復キノコと同じ名前（きのこ）なので、アイコンを見る：茶色で平たいものは安全、黄色い斑点のある赤は毒。迷ったら店の食料を食べる。",
                    "เห็ดพิษ สีแดงมีจุดเหลือง กินแล้ว HP เหลือ 0: คุณจะสลบแล้วตื่นที่จุดเซฟด้วย HP 1 โดยเงิน ปลา และอุปกรณ์ยังอยู่ครบ ในเมนูอาหารมีชื่อเดียวกับเห็ดฟื้นพลัง (きのこ) จึงต้องดูไอคอน: สีน้ำตาลอ่อนและแบนปลอดภัย สีแดงมีจุดเหลืองคือเห็ดพิษ ถ้าไม่แน่ใจ ให้กินอาหารจากร้านแทน",
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
                    ["Both mushrooms show the same name, “きのこ”, in the food menu, but the icons differ: the tan flat one heals 10 HP and the red one with yellow spots sets HP to 0."],
                    ["食料メニューでは両方とも「きのこ」と表示されるが、アイコンが違う。茶色で平たいものはHP10回復、黄色い斑点のある赤いものはHPが0になる。"],
                    ["ในเมนูอาหาร เห็ดสองชนิดใช้ชื่อ “きのこ” เหมือนกัน แต่ไอคอนต่างกัน: เห็ดแบนสีน้ำตาลอ่อนฟื้น 10 HP ส่วนเห็ดสีแดงมีจุดเหลืองทำให้ HP เหลือ 0"],
                )

        elif category == "general_tool":
            summary, facts = GENERAL_TOOL_COPY.get(item_id, (loc("This item is present in the game; its actual use has not yet been traced in ROM code.", "ゲーム内のアイテム。用途を決めるROMコードはまだ未解読。", "มีไอเท็มนี้ในเกม แต่ยังไม่ได้ถอดโค้ดที่ยืนยันว่ามันใช้ทำอะไร"), []))
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
            entry["evidence"] = {"type": "rom_trace", "sources": ["data/lure-coverage.json", "data/lure-response.json", "docs/lure-response-research.md", "docs/gear-effects.md"]}
        elif category == "bait":
            entry["evidence"] = {"type": "rom_trace", "sources": ["data/fish-acceptance.json", "docs/fish-acceptance-research.md", "docs/gear-effects.md"]}
        elif category == "fly":
            entry["evidence"] = {"type": "rom_trace", "sources": ["data/fish-acceptance.json", "data/fly-customization.json"]}
        elif category in ("fly_wing", "fly_tail"):
            entry["evidence"] = {"type": "rom_trace", "sources": ["data/fish-acceptance.json", "data/fly-customization.json"]}
        elif category in ("hook", "float_weight"):
            entry["evidence"] = {"type": "rom_trace", "sources": ["data/hook-float-use.json"]}
        elif category == "food":
            entry["evidence"] = {"type": "controlled_runtime_observation", "sources": ["data/food-effects-confirmed.json"]}
        elif category == "general_tool":
            unresolved_ids = {"01", "02", "03", "05", "07", "0F", "10", "15", "16", "17"}
            event_ids = {"06", "12", "15", "16", "17"}
            if item_id in unresolved_ids:
                kind, sources = "rom_use_unresolved", ["data/items-rom.json"]
            elif item_id in event_ids:
                kind, sources = "rom_use_unresolved", ["data/items-rom.json"]
            elif item_id in {"0B", "0C", "0D", "13", "14"}:
                kind, sources = "in_game_label_or_menu_name", ["catalogue/gallery-data.json"]
            else:
                kind, sources = "item_name_only", ["catalogue/gallery-data.json"]
            entry["evidence"] = {"type": kind, "sources": sources}
        else:
            entry["evidence"] = {"type": "catalogue_label", "sources": ["catalogue/gallery-data.json"]}

        if entry.get("displayNameSource"):
            entry["evidence"]["displayNameType"] = "editorial_translation_or_clarification"

        # The owner's ROM-only requirement excludes guide-reported item purposes.
        if entry.get("evidence", {}).get("type") in {"player_guide_report", "rom_use_unresolved"}:
            entry["summary"] = loc(
                "This item is present in the game; its actual use has not yet been traced in ROM code.",
                "ゲーム内のアイテム。用途を決めるROMコードはまだ追跡できていない。",
                "มีไอเท็มนี้ในเกม แต่ยังไม่ได้ถอดโค้ดที่ยืนยันว่ามันใช้ทำอะไร",
            )
            entry["facts"] = loc_lists()
            entry["evidenceNotes"] = loc_lists()
            entry["evidence"] = {"type": "rom_use_unresolved", "sources": ["data/items-rom.json"]}

        if category == "general_tool" and item_id in tool_research:
            finding = tool_research[item_id]
            for field in ("summary", "facts", "evidence", "evidenceNotes", "displayName", "compatibleFishIds", "fishIds", "fishScope", "startingEquipment"):
                if field in finding:
                    entry[field] = finding[field]

        if category == "general_tool" and item_id in tool_locations:
            entry["useLocations"] = tool_locations[item_id]
        if key(category, item_id) in practical_research:
            finding = practical_research[key(category, item_id)]
            for field in ("summary", "facts", "evidence", "evidenceNotes", "comparison", "fishScope", "displayName"):
                if field in finding:
                    if field == "facts" and category == "lure":
                        entry[field] = {lang: list(dict.fromkeys(entry.get(field, {}).get(lang, []) + finding[field].get(lang, []))) for lang in ("en", "ja", "th")}
                    else:
                        entry[field] = finding[field]
        if key(category, item_id) in gear_overlay:
            # Measured fight effects replace the older rod, hook and float wording.
            entry.update(gear_overlay[key(category, item_id)])
        apply_name_fixes(entry, category, item_id)
        if (DATA / "shop-stock-rom.json").exists():
            entry["shops"] = shop_stock.get(key(category, item_id), [])
        item_data[key(category, item_id)] = entry

    output = {
        "schema_version": 1,
        "scope": loc(
            "Player-facing notes use ROM traces, controlled observations of the supplied game, and decoded item labels only. Guide-reported uses are excluded. Fish lists describe only the check named in that item's fishScope.",
            "ROM追跡・提供されたゲームの実行時確認・復号したアイテム名のみを使用。プレイヤーガイドの用途は除外。魚リストの意味は各アイテムのfishScopeを参照。",
            "คำอธิบายใช้เฉพาะการแกะ ROM การสังเกตเกมจากไฟล์ที่ให้มา และชื่อไอเท็มที่ถอดได้ โดยตัดการใช้งานจากไกด์ออก; รายชื่อปลาแสดงเฉพาะเงื่อนไขที่ระบุใน fishScope",
        ),
        "sources": [
            "data/fish-acceptance.json",
            "data/lure-coverage.json",
            "data/rod-response.json",
            "data/food-effects-confirmed.json",
            "data/hook-float-use.json",
            "data/shop-stock-rom.json",
            *[f"data/{filename}" for filename in ("hook-practical-research.json", "rod-lure-practical.json", "fly-practical-research.json", "food-practical-research.json") if (DATA / filename).exists()],
            "data/general-tool-actions.json",
            "data/chum-basket-use.json",
            "data/quest-tool-use.json",
            "data/general-tool-code-index.json",
            "data/tool-use-locations.json",
            "data/forage-locations.json",
            "data/stages/*.json (Thai fish names where recorded)",
            "catalogue/gallery-data.json",
        ],
        "items": item_data,
    }
    save(CATALOGUE / "item-use.json", output)
    print(f"Wrote {len(item_data)} item-use entries to {CATALOGUE / 'item-use.json'}")


if __name__ == "__main__":
    build()
