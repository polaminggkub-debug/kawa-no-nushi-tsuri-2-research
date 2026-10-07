"""The hook category's intro: which hook to buy for which fish size."""

from .hook_view import class_hooks, same_effect
from .phrases import BAND, area_list, hook_ref, ref_list, rod_ref, yen

EEL = 59
YAMAME_HOOK_ROD = 16
BAND_CLASS = (0, 1, 2)

COPY = {
    "th": {
        "title": "ตะขอ: เลือกตามขนาดปลา",
        "intro": "ตะขอตั้งจุดเริ่มของมาตรวัดแรงตึงตอนสู้ปลา ยิ่งเริ่มต่ำยิ่งพลาดได้หลายจังหวะ ตะขอถูกขนาดปลาให้พลาดได้เพิ่ม 1 จังหวะ ผิดขนาดเสียไป 1 จังหวะ ต่างกันได้ถึง 2 จังหวะ ซื้อตามขนาดปลา:",
        "class": "• {band}: {first}{later}",
        "later": "; ถ้ารอถึง{area} {hook} ถูกกว่า",
        "early": "; ก่อนถึง{area} ยังไม่มีขาย ใช้ตะขอของปลา 16–35 ซม. แทน (ไม่เสียอะไร) แต่อย่าใช้ตะขอของปลาไม่เกิน 15 ซม. กับปลาใหญ่ (เสีย 1 จังหวะ)",
        "named": "• ตะขอที่มีชื่อปลา ใช้ได้ดีสุดกับปลานั้น แต่ตะขอตามขนาดราคาถูกกว่าให้ผลเท่ากันเกือบทุกกรณี",
        "eel": "• ปลาไหลยักษ์: {refs} ให้ผลเท่ากันหมด ไม่ต้องใช้ตะขอปลาไหล",
        "stack": "ตะขอขายเป็นชุด 9 ตัว",
        "reason": "ตัวอย่างที่วัดได้: ยามาเมะบน{rod} ถ้าตะขอถูกขนาด ตกได้ 100% ถ้าผิดขนาดตกได้ 6% การตกได้แล้วตะขอก็ยังหักได้ (สูงสุดราว 6%) จึงควรพกสำรอง",
        "scope": "ขนาดที่ใช้คือขนาดจริงของปลาแต่ละตัว ปลาบางชนิดมีหลายขนาด ตะขอใช้กับคันทุ่นและคันหวด ส่วนลัวร์และฟลายไม่ใช้",
        "end": ".",
    },
    "en": {
        "title": "Hooks: pick by fish size",
        "intro": "A hook sets where the fight meter starts: the lower it starts, the more mistakes you can afford. A hook that fits the fish's size allows 1 more mistake, one that does not costs 1, so the gap is up to 2. Buy by fish size:",
        "class": "• {band}: {first}{later}",
        "later": "; if you can wait until {area}, {hook} is cheaper",
        "early": "; none is sold before {area}, so use a hook for fish of 16–35 cm (it costs nothing) and never a hook for fish up to 15 cm on big fish (it costs 1 mistake)",
        "named": "• A hook named for a fish works best on that fish, but a cheaper hook of the right size does the same in almost every case",
        "eel": "• Giant eel: {refs} all do the same, so you do not need the eel hook",
        "stack": "Hooks are sold in stacks of 9",
        "reason": "Measured example: Yamame on {rod} is landed in 100% of fights with a hook that fits its size and in 6% with one that does not. A landed fish can still break the hook (up to about 6%), so carry spares",
        "scope": "The size that counts is each fish's own size; some species come in several sizes. Hooks are used with float and casting rods, not with lures or flies",
        "end": ".",
    },
    "ja": {
        "title": "針：魚の大きさで選ぶ",
        "intro": "針はファイトのメーターの出だしを決めます。低く始まるほど、許されるミスが増えます。魚の大きさに合う針はミスを1回分増やし、合わない針は1回分減らすので、差は最大2回です。魚の大きさで買います。",
        "class": "{band}：{first}{later}",
        "later": "。{area}まで待てるなら{hook}の方が安い",
        "early": "。{area}より前は売っていないので、16〜35cmの魚用の針で代用します（損はありません）。15cm以下用の針を大物に使うとミス1回分を失います",
        "named": "魚名の付いた針はその魚に最良ですが、大きさの合う安い針でもほぼ同じ効果です",
        "eel": "オオウナギ：{refs}はどれも同じ効果で、ウナギ用の針は不要です",
        "stack": "針は9個1組で売っています",
        "reason": "測定例：{rod}でヤマメは、大きさに合う針なら100%、合わない針なら6%で釣り上げられました。釣り上げた後でも針が折れることがある（最大約6%）ので、予備を持ちます",
        "scope": "基準は魚1匹ごとの実際の大きさで、複数の大きさがある魚もいます。針はウキ竿と投げ竿用で、ルアーとフライには使いません",
        "end": "。",
    },
}


def _first_and_cheapest(facts, size_class):
    hooks = class_hooks(facts, size_class)
    first_area = min(min(h["areas"]) for h in hooks)
    first = min((h for h in hooks if min(h["areas"]) == first_area), key=lambda h: (h["yen"], h["id"]))
    return first, hooks[0]


def _hook_text(lang, hook):
    detail = f"{yen(lang, hook['yen'])}、{area_list(lang, hook['areas'])}" if lang == "ja" else f"{yen(lang, hook['yen'])}, {area_list(lang, hook['areas'])}"
    return hook_ref(lang, hook["id"]) + (f"（{detail}）" if lang == "ja" else f" ({detail})")


def _class_line(facts, lang, size_class):
    copy = COPY[lang]
    first, cheap = _first_and_cheapest(facts, size_class)
    later = ""
    if cheap["id"] != first["id"] and cheap["yen"] * 4 <= first["yen"] * 3:
        price = f"（{yen(lang, cheap['yen'])}）" if lang == "ja" else f" ({yen(lang, cheap['yen'])})"
        later = copy["later"].format(area=area_list(lang, [min(cheap["areas"])]), hook=hook_ref(lang, cheap["id"]) + price)
    if min(first["areas"]) > 1:
        later = copy["early"].format(area=area_list(lang, [min(first["areas"])]))
    return copy["class"].format(band=BAND[lang][size_class], first=_hook_text(lang, first), later=later), first, cheap


def section(facts):
    out = {"id": "hook_by_size", "category": "hook", "title": {}, "recommendation": {}, "reason": {}, "scope": {}}
    picked = []
    eel_hook = next(h for h in facts.hooks.values() if h["match"] == EEL)
    eel_ids = sorted([eel_hook["id"]] + [h["id"] for h in same_effect(facts, eel_hook, EEL)])
    for lang in ("th", "en", "ja"):
        copy = COPY[lang]
        lines = []
        for size_class in BAND_CLASS:
            line, first, cheap = _class_line(facts, lang, size_class)
            lines.append(line)
            picked += [first["id"], cheap["id"]]
        refs = ref_list(lang, [hook_ref(lang, i) for i in eel_ids], "and")
        extras = [copy["named"], copy["eel"].format(refs=refs)]
        # One line per rule: the page turns the line breaks into <br>.
        body = "\n".join(line + copy["end"] for line in lines + extras + [copy["stack"]])
        out["title"][lang] = copy["title"]
        out["recommendation"][lang] = copy["intro"] + "\n" + body
        out["reason"][lang] = copy["reason"].format(rod=rod_ref(lang, YAMAME_HOOK_ROD)) + copy["end"]
        out["scope"][lang] = copy["scope"] + copy["end"]
    out["items"] = [{"category": "hook", "id": f"{i:02X}"} for i in dict.fromkeys(picked)]
    return out
