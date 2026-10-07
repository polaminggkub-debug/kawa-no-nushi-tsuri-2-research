"""Per-hook label, full advice and reason, and the hook category intro, in three languages."""

from .hook_view import class_hooks, view
from .phrases import AND, BAND, area_list, examples, hook_ref, ref_list, species, yen

BANDS = (0, 1, 2)
COPY = {
    "th": {
        "label": "ดีสุดกับ: {best}. ไม่เหมาะกับ: {bad}.",
        "named": "{fish} (ตะขอตรงชื่อปลา)",
        "band_good": "{band} {count} ({eg})",
        "bad_hurt": "{bands} (เสียไป 1 จังหวะ)",
        "bad_same": "{bands} (ไม่ช่วย)",
        "bad_none": "ปลาอื่นทุกชนิด (ไม่มีผล)",
        "effect_intro": "ตะขอตั้งจุดเริ่มของแรงตึงตามขนาดปลา: ",
        "effect": {1: "พลาดได้เพิ่ม 1 จังหวะ", 0: "ไม่ช่วย", -1: "พลาดได้น้อยลง 1 จังหวะ"},
        "effect_none": "ห่วงนี้ไม่มีผลกับการสู้ปลา ยกเว้นปลาอายุ",
        "named_effect": "ตะขอตรงชื่อ{fish}ช่วยให้พลาดได้เพิ่ม 1 จังหวะกับปลาชนิดนี้ทุกขนาด (ไม่ซ้อนกับผลตามขนาด)",
        "equal": "แต่ตะขอ {refs} ให้ผลเท่ากันกับ{fish} ไม่จำเป็นต้องซื้อตะขอตรงชื่อ",
        "price": "ราคา {yen} ขายที่{areas} ขายเป็นชุด 9 ตัว",
        "better": "ถ้าอยู่{areas} ซื้อ {other} ({price}) แทน: ถูกกว่าและให้ผลเท่ากันหรือดีกว่ากับปลาทุกชนิด ด่านอื่นซื้อตัวนี้ได้",
        "cheapest": "ตัวนี้ถูกที่สุดในกลุ่ม{klass}",
        "klass": {0: "ปลาไม่เกิน 15 ซม.", 1: "ปลา 16–35 ซม.", 2: "ปลาเกิน 35 ซม.", 3: "ห่วงจมูกปลาอายุ"},
        "reason": "จากการจำลองการสู้ปลา: ตะขอนี้ดีสุดกับ {best} จาก {n} ชนิดของคันทุ่น เฉลี่ยเสียไป {loss} จังหวะ (ตะขอที่ดีที่สุดเสีย 0)",
        "end": ".",
    },
    "en": {
        "label": "Best for: {best}. Bad for: {bad}.",
        "named": "{fish} (the hook is named for it)",
        "band_good": "{band} ({count}, {eg})",
        "bad_hurt": "{bands} (costs 1 mistake)",
        "bad_same": "{bands} (no help)",
        "bad_none": "every other fish (no effect)",
        "effect_intro": "A hook sets the fight meter's start by fish size: ",
        "effect": {1: "1 more mistake allowed", 0: "no difference", -1: "1 fewer mistake allowed"},
        "effect_none": "This ring has no effect on a fight except for Ayu",
        "named_effect": "The hook named for {fish} allows 1 more mistake against that fish at any size (it does not stack with the size effect)",
        "equal": "But {refs} do the same against {fish}, so you need not buy the named hook",
        "price": "Price {yen}; sold in {areas}; sold in stacks of 9",
        "better": "If you are in {areas}, buy {other} ({price}) instead: it costs less and does the same or better against every fish. Elsewhere this one is fine",
        "cheapest": "This is the cheapest hook for the group of {klass}",
        "klass": {0: "fish up to 15 cm", 1: "fish of 16–35 cm", 2: "fish over 35 cm", 3: "the Ayu nose ring"},
        "reason": "From simulated fights: this hook is the best choice for {best} of {n} float-rod species and costs {loss} mistakes on average (the best hook costs 0).",
        "end": ".",
    },
    "ja": {
        "label": "最適：{best}。不向き：{bad}。",
        "named": "{fish}（魚名の付いた針）",
        "band_good": "{band}（{count}、{eg}）",
        "bad_hurt": "{bands}（ミス1回分を失う）",
        "bad_same": "{bands}（効果なし）",
        "bad_none": "ほかのすべての魚（効果なし）",
        "effect_intro": "針は魚の大きさでファイトのメーターの出だしを決めます：",
        "effect": {1: "許されるミスが1回増える", 0: "変わらない", -1: "許されるミスが1回減る"},
        "effect_none": "この環はアユ以外のファイトには効果がありません",
        "named_effect": "{fish}の名前が付いた針は、その魚にはどの大きさでも許されるミスが1回増えます（大きさの効果とは重なりません）",
        "equal": "ただし{refs}も{fish}に同じ効果なので、名前付きの針を買う必要はありません",
        "price": "価格{yen}。{areas}で販売。9個1組で売っています",
        "better": "{areas}にいるなら、代わりに{other}（{price}）を買います。安く、どの魚にも同じかそれ以上の効果です。ほかのエリアではこの針で構いません",
        "cheapest": "{klass}向けの針の中で最安です",
        "klass": {0: "15cm以下の魚", 1: "16〜35cmの魚", 2: "35cm超の魚", 3: "アユ用の環"},
        "reason": "ファイトのシミュレーションでは、ウキ竿の{n}種中{best}種でこの針が最良で、平均{loss}回分のミスを失います（最良の針は0）。",
        "end": "。",
    },
}


def _band_phrase(facts, lang, band, skip):
    copy = COPY[lang]
    fids = facts.band_fish(band)
    sample = examples(lang, facts.fish_names(lang, [fid for fid in fids if fid != skip], 3))
    return copy["band_good"].format(band=BAND[lang][band], count=species(lang, len(fids)), eg=sample)


def _best_bad(facts, lang, v):
    copy = COPY[lang]
    best = []
    if v["named"]:
        best.append(copy["named"].format(fish=facts.fish_name(lang, v["named"])))
    best += [_band_phrase(facts, lang, b, v["named"]) for b in BANDS if v["effect"][b] > 0]
    hurt = [BAND[lang][b] for b in BANDS if v["effect"][b] < 0]
    same = [BAND[lang][b] for b in BANDS if v["effect"][b] == 0]
    bad = []
    if hurt:
        bad.append(copy["bad_hurt"].format(bands=AND[lang].join(hurt)))
    if same and v["hook"]["sel"] != 3:
        bad.append(copy["bad_same"].format(bands=AND[lang].join(same)))
    if v["hook"]["sel"] == 3:
        bad = [copy["bad_none"]]
    sep = "、" if lang == "ja" else AND[lang] if lang == "th" else "; "
    return sep.join(best), sep.join(bad)


def label(facts, lang, number):
    best, bad = _best_bad(facts, lang, view(facts, number))
    return COPY[lang]["label"].format(best=best, bad=bad)


def _effect_sentence(facts, lang, v):
    copy = COPY[lang]
    if v["hook"]["sel"] == 3:
        return copy["effect_none"]
    sep = "、" if lang == "ja" else "; "
    parts = [f"{BAND[lang][b]}: {copy['effect'][v['effect'][b]]}" if lang != "ja" else f"{BAND[lang][b]}は{copy['effect'][v['effect'][b]]}" for b in BANDS]
    return copy["effect_intro"] + sep.join(parts)


def _equal_sentence(facts, lang, v):
    if not v["named"] or not v["equal_cheaper"]:
        return ""
    refs = ref_list(lang, [hook_ref(lang, h["id"]) for h in v["equal_cheaper"][:4]])
    return COPY[lang]["equal"].format(refs=refs, fish=facts.fish_name(lang, v["named"]))


def advice(facts, lang, number):
    v = view(facts, number)
    copy, hook = COPY[lang], v["hook"]
    sentences = [_effect_sentence(facts, lang, v)]
    if v["named"]:
        sentences.append(copy["named_effect"].format(fish=facts.fish_name(lang, v["named"])))
    sentences.append(_equal_sentence(facts, lang, v))
    sentences.append(copy["price"].format(yen=yen(lang, hook["yen"]), areas=area_list(lang, hook["areas"])))
    if v["better"]:
        better = v["better"]
        sentences.append(
            copy["better"].format(
                areas=area_list(lang, better["areas"]),
                other=hook_ref(lang, better["id"]),
                price=yen(lang, better["yen"]),
            )
        )
    elif v["cheapest"]:
        sentences.append(copy["cheapest"].format(klass=copy["klass"][hook["sel"]]))
    end = copy["end"]
    return ("" if lang == "ja" else " ").join(s if s.endswith(end) else s + end for s in sentences if s)


def reason(facts, lang, number):
    v = view(facts, number)
    use = v["float"]
    return COPY[lang]["reason"].format(best=len(use["best"]), n=use["n"], loss=f"{use['loss']:g}")


def alternatives(facts, number):
    v = view(facts, number)
    cheapest = class_hooks(facts, v["hook"]["sel"])[0]["id"]
    ids = [v["better"]["id"]] if v["better"] else [cheapest] if cheapest != number else []
    return [{"category": "hook", "id": f"{i:02X}"} for i in ids]
