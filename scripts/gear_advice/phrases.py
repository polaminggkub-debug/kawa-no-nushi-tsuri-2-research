"""Small phrase helpers shared by the rod, hook and float advice, in Thai, English and Japanese."""

from .facts import band_of

BAND = {
    "th": ["ปลาไม่เกิน 15 ซม.", "ปลา 16–35 ซม.", "ปลาเกิน 35 ซม."],
    "en": ["fish up to 15 cm", "fish of 16–35 cm", "fish over 35 cm"],
    "ja": ["15cm以下の魚", "16〜35cmの魚", "35cm超の魚"],
}
JOINER = {"th": ", ", "en": ", ", "ja": "、"}
AND = {"th": " และ ", "en": " and ", "ja": "と"}
METHOD = {
    "th": {"float": "สายทุ่น", "casting": "คันหวด", "lure": "ลัวร์", "fly": "ฟลาย"},
    "en": {"float": "float", "casting": "casting", "lure": "lure", "fly": "fly"},
    "ja": {"float": "ウキ", "casting": "投げ", "lure": "ルアー", "fly": "フライ"},
}
ROD_CUE = {"th": "คัน", "en": "rod", "ja": "竿"}
HOOK_CUE = {"th": "เบ็ด", "en": "hook", "ja": "ハリ"}
FLOAT_CUE = {"th": "ทุ่น", "en": "float", "ja": "ウキ"}
SINKER_CUE = {"th": "ตะกั่ว", "en": "sinker", "ja": "オモリ"}


def yen(lang, amount):
    text = f"{amount:,}"
    return f"{text}円" if lang == "ja" else f"¥{text}"


def species(lang, count):
    return {"th": f"{count} ชนิด", "en": f"{count} species", "ja": f"{count}種"}[lang]


def of_total(lang, count, total):
    return {
        "th": f"{count} จาก {total} ชนิด",
        "en": f"{count} of {total} species",
        "ja": f"{total}種中{count}種",
    }[lang]


def examples(lang, names):
    if not names:
        return ""
    joined = JOINER[lang].join(names)
    return {"th": f"เช่น {joined}", "en": f"e.g. {joined}", "ja": f"例：{joined}"}[lang]


def area_list(lang, areas):
    numbers = [str(area) for area in areas]
    if lang == "ja":
        return "エリア" + "・".join(numbers)
    return ("ด่าน " if lang == "th" else "area " if len(numbers) == 1 else "areas ") + ", ".join(numbers)


def rod_ref(lang, number):
    """A rod mention that the catalogue build turns into the rod's name."""
    sep = "" if lang == "ja" else " "
    return f"{ROD_CUE[lang]}{sep}{number:02X}"


def hook_ref(lang, number):
    """A hook mention the catalogue build turns into the hook's name.

    Japanese hook names carry no common word to absorb a cue, so the bare ID is used there."""
    if lang == "ja":
        return f"{number:02X}"
    return f"{HOOK_CUE[lang]} {number:02X}"


def ref_list(lang, refs, conj="or"):
    """'a, b or c' (conj "or") or 'a, b and c' (conj "and") for item references."""
    if len(refs) < 2:
        return "".join(refs)
    words = {"or": {"th": "หรือ", "en": "or", "ja": "か"}, "and": {"th": "และ", "en": "and", "ja": "と"}}[conj]
    if lang == "ja":
        return "、".join(refs[:-1]) + words[lang] + refs[-1]
    return JOINER[lang].join(refs[:-1]) + f" {words[lang]} " + refs[-1]


def describe_set(facts, lang, fids, shown=0):
    """'fish up to 15 cm and fish of 16-35 cm (46 species, e.g. ...)': the size bands most of the set lies in."""
    if not fids:
        return ""
    counts = [0, 0, 0]
    for fid in fids:
        counts[band_of(facts.fish[fid])] += 1
    total = len(fids)
    named = [band for band in range(3) if counts[band] * 4 >= total]
    bands = AND[lang].join(BAND[lang][band] for band in named)
    inside = [fid for fid in fids if band_of(facts.fish[fid]) in named]
    sample = examples(lang, facts.fish_names(lang, largest(facts, inside, shown), shown)) if shown else ""
    count = species(lang, total)
    return {
        "th": f"{bands} รวม {count}" + (f" {sample}" if sample else ""),
        "en": f"{bands} ({count}" + (f", {sample}" if sample else "") + ")",
        "ja": f"{bands}（計{count}" + (f"、{sample}" if sample else "") + "）",
    }[lang]


def largest(facts, fids, limit):
    """The biggest fish of a set, by top size, so examples name the fish a player recognises."""
    ordered = sorted(fids, key=lambda fid: (-facts.fish[fid]["size"][1], fid))
    return ordered[:limit]
