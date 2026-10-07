"""Write the generated rod, hook and float advice into the decision files the catalogue build reads."""

import json

from . import float_copy, hook_copy, hook_section, rod_copy, rod_sections
from .facts import LANGS, ROOT, Facts

ROD_FILE = "data/rod-item-decisions.json"
GEAR_FILE = "data/gear-item-decisions.json"
PLAYER_FILE = "data/player-decisions.json"
SOURCES = ["data/gear-effects.json", "docs/gear-effects.md", "docs/fight-model.md", "scripts/build_gear_advice.py"]
HOOK_SECTION_OLD = "hook_purchase_caution"

ROD_SCOPE = {
    "th": "คำแนะนำนี้มาจากการจำลองการสู้ปลา (data/gear-effects.json) และรายการสินค้าของร้านทั้ง 6 ด่าน คันกำหนดสองอย่าง: สายขาดยาก คือปลาวิ่งไกลได้แค่ไหนก่อนสายขาดและเสียตะขอ (ชี้ขาดกับปลาใหญ่) และจุดเริ่มของมาตรวัดแรงตึง คือพลาดได้กี่จังหวะ เวลาเล็งสั้นลงเมื่อ HP ต่ำกว่า 100 กับคันหวดและคันลัวร์ ราคาที่ใช้คือราคาเต็มซื้อใหม่ ไม่ใช่ส่วนต่างตอนอัปเกรด",
    "en": "These choices come from simulated fights (data/gear-effects.json) and the six areas' shop lists. A rod decides two things: line strength, how far a fish can run before the line breaks and the hook is lost (decisive for big fish), and the fight meter's start, how many mistakes you can afford. Casting and lure rods give less time to aim below 100 HP. Prices are full new-purchase prices, not upgrade costs.",
    "ja": "この案内は、ファイトのシミュレーション（data/gear-effects.json）と全6エリアの店の品ぞろえに基づきます。竿が決めるのは2つです。糸の切れにくさ（魚が走っても糸が切れて針を失わない距離。大物はここで決まります）と、ファイトのメーターの出だし（許されるミスの数）です。投げ竿とルアー竿は、HPが100未満だと狙う時間が短くなります。価格は新品の全額で、強化費用ではありません。",
}


def _json(path):
    return json.loads((ROOT / path).read_text(encoding="utf-8"))


def _text(value):
    return json.dumps(value, ensure_ascii=False, indent=2) + "\n"


def _loc(build):
    return {lang: build(lang) for lang in LANGS}


def _decision(facts, module, number, extra):
    entry = {
        "label": _loc(lambda lang: module.label(facts, lang, number)),
        "recommendation": _loc(lambda lang: module.advice(facts, lang, number)),
        "reason": _loc(lambda lang: module.reason(facts, lang, number)),
        "alternatives": module.alternatives(facts, number),
    }
    entry.update(extra)
    entry["sources"] = list(SOURCES)
    return entry


def rod_decisions(facts, current):
    current["scope"] = dict(ROD_SCOPE)
    for number in facts.rods:
        use = facts.rods[number]["use"][facts.rods[number]["method"]]
        # Fish ids (decimal, as in the gear-effects data) the fish pages check a rod against.
        fight = {key: use.get(key, []) for key in ("best", "bad", "short")}
        current["items"][f"{number:02X}"] = _decision(
            facts, rod_copy, number, {"startLoss": use["loss"], "fight": fight}
        )
    return current


def gear_decisions(facts, current):
    for number in facts.hooks:
        key = f"hook:{number:02X}"
        keep = {"targetFish": current["items"][key]["targetFish"]} if "targetFish" in current["items"].get(key, {}) else {}
        current["items"][key] = _decision(facts, hook_copy, number, keep)
    for number in facts.floats:
        current["items"][f"float_weight:{number:02X}"] = _decision(facts, float_copy, number, {})
    return current


def player_decisions(facts, current):
    fresh = {s["id"]: s for s in rod_sections.sections(facts)}
    fresh["hook_by_size"] = hook_section.section(facts)
    fresh["float_sinker_choice"] = float_copy.section(facts)
    sections, seen = [], set()
    for section in current["sections"]:
        key = "hook_by_size" if section["id"] == HOOK_SECTION_OLD else section["id"]
        if key in fresh:
            sections.append(fresh[key])
            seen.add(key)
        else:
            sections.append(section)
    sections += [fresh[key] for key in fresh if key not in seen]
    current["sections"] = sections
    return current


def outputs():
    """{relative path: new file text} for every file this generator owns a part of."""
    facts = Facts()
    return {
        ROD_FILE: _text(rod_decisions(facts, _json(ROD_FILE))),
        GEAR_FILE: _text(gear_decisions(facts, _json(GEAR_FILE))),
        PLAYER_FILE: _text(player_decisions(facts, _json(PLAYER_FILE))),
    }


def stale():
    """Paths whose stored text differs from what the generator now produces."""
    return [path for path, text in outputs().items() if (ROOT / path).read_text(encoding="utf-8") != text]


def write_all():
    for path, text in outputs().items():
        (ROOT / path).write_text(text, encoding="utf-8")
    return list(outputs())
