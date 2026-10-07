"""The rod category's intro sections: which rod to buy, by stage, for which fish."""

from .phrases import area_list, examples, largest, ref_list, rod_ref, species, yen

SECTION_ID = {
    "float": "float_rod_path",
    "casting": "casting_rod_path",
    "lure": "lure_rod_path",
    "fly": "fly_rod_path",
}

COPY = {
    "th": {
        "title": {
            "float": "คันทุ่น: เลือกคันตามปลาที่จะตก",
            "casting": "คันหวด: เลือกคันตามปลาที่จะตก",
            "lure": "คันลัวร์: เลือกคันตามปลาที่จะตก",
            "fly": "คันฟลาย: เลือกคันตามปลาที่จะตก",
        },
        "intro": "ปลาใหญ่ต้องใช้คันที่สายยาว ปลาเล็กคันไหนก็พอ ซื้อตามนี้:",
        "tier": "ปลา {count} ({eg}) ต้องสาย ×{need} ขึ้นไป: {first}{later}",
        "need_range": "{low}–{high}",
        "later": "; ถ้ารอถึง{area} {rod} ถูกกว่า",
        "capped": "ปลา {count} ({eg}) อยากได้สาย ×{need} แต่คันที่ยาวสุดมีแค่ {rod} (×{max}) ใช้ได้แต่เสี่ยงสายขาด",
        "sep": " ",
        "reason": "สายขาดยาก ×N คือระยะที่ปลาวิ่งได้ก่อนสายขาดและเสียตะขอ ปลาใหญ่ชี้ขาดที่ตรงนี้{eel} คันยังกำหนดจุดเริ่มของมาตรวัดแรงตึง ซึ่งคือพลาดได้กี่จังหวะ: {rules}",
        "eel": " (ปลาไหลยักษ์ต้อง ×{need})",
        "rule0": "{refs} ได้เปรียบสุดกับปลาไม่เกิน 15 ซม.",
        "rule1": "{refs} ได้เปรียบสุดกับปลา 16–35 ซม.",
        "rule1_most": "คันอื่นส่วนใหญ่ได้เปรียบสุดกับปลา 16–35 ซม.",
        "rule2": "{refs} เสียเปรียบปลาเล็กถึงกลางเฉลี่ย {loss} จังหวะ ใช้กับปลาเกิน 35 ซม. เท่านั้น",
        "rule_big": "ปลาเกิน 35 ซม. คันไหนก็เกือบเท่ากัน",
        "unsold": "ไม่มีขายที่ไหนเลย: {refs}",
        "special": "ขายเฉพาะร้านคันเบ็ดพิเศษ: {refs}",
        "aim": "คันหวดและคันลัวร์มีเวลาเล็งสั้นลงเมื่อ HP ต่ำกว่า 100 เติม HP ก่อนตก",
        "end": ".",
    },
    "en": {
        "title": {
            "float": "Float rods: pick the rod by the fish",
            "casting": "Casting rods: pick the rod by the fish",
            "lure": "Lure rods: pick the rod by the fish",
            "fly": "Fly rods: pick the rod by the fish",
        },
        "intro": "Big fish need a rod with a long line; small fish take any rod. Buy by the fish:",
        "tier": "{count} ({eg}) need line strength ×{need} or more: {first}{later}",
        "need_range": "{low}–{high}",
        "later": "; if you can wait until {area}, {rod} is cheaper",
        "capped": "{count} ({eg}) want line strength ×{need}, but the longest rod is {rod} (×{max}); it works, with some risk of the line breaking",
        "sep": " ",
        "reason": "Line strength ×N is how far a fish may run before the line breaks and the hook is lost; big fish are decided here{eel}. The rod also sets where the fight meter starts, which is how many mistakes you can afford: {rules}",
        "eel": " (the giant eel needs ×{need})",
        "rule0": "{refs} gives the best start against fish up to 15 cm",
        "rule1": "{refs} gives the best start against fish of 16–35 cm",
        "rule1_most": "most of the other rods give the best start against fish of 16–35 cm",
        "rule2": "using {refs} on small and mid-size fish loses {loss} mistakes on average, so keep it for fish over 35 cm",
        "rule_big": "for fish over 35 cm almost any rod is the same",
        "unsold": "Never sold anywhere: {refs}",
        "special": "Only sold by the special rod seller: {refs}",
        "aim": "Casting and lure rods give you less time to aim below 100 HP; restore HP before you fish",
        "end": ".",
    },
    "ja": {
        "title": {
            "float": "ウキ竿：狙う魚で竿を選ぶ",
            "casting": "投げ竿：狙う魚で竿を選ぶ",
            "lure": "ルアー竿：狙う魚で竿を選ぶ",
            "fly": "フライ竿：狙う魚で竿を選ぶ",
        },
        "intro": "大物には糸の長い竿が必要で、小物はどの竿でも足ります。魚に合わせて買います。",
        "tier": "{count}（{eg}）は糸の切れにくさ×{need}以上：{first}{later}",
        "need_range": "{low}–{high}",
        "later": "。{area}まで待てるなら{rod}の方が安い",
        "capped": "{count}（{eg}）は糸の切れにくさ×{need}がほしいところですが、最長の竿は{rod}（×{max}）です。使えますが、糸が切れる危険があります",
        "sep": " ",
        "reason": "糸の切れにくさ×Nは、魚が走っても糸が切れて針を失わない距離です。大物はここで決まります{eel}。竿はファイトのメーターの出だしも決め、許されるミスの数が変わります：{rules}",
        "eel": "（オオウナギは×{need}が必要）",
        "rule0": "{refs}は15cm以下の魚で最良のスタート",
        "rule1": "{refs}は16〜35cmの魚で最良のスタート",
        "rule1_most": "ほかの竿の大半は16〜35cmの魚で最良のスタート",
        "rule2": "{refs}は小〜中型の魚で平均{loss}回分のミスを失うので、35cm超の魚専用にします",
        "rule_big": "35cm超の魚はほとんどどの竿でも同じです",
        "unsold": "どの店にも売っていません：{refs}",
        "special": "特別な竿の販売所だけで売っています：{refs}",
        "aim": "投げ竿とルアー竿は、HPが100未満だと狙う時間が短くなります。釣る前にHPを回復してください",
        "end": "。",
    },
}


def _rods(facts, method, **where):
    return [r for _, r in sorted(facts.rods.items()) if r["method"] == method and all(r[k] == v for k, v in where.items())]


def _rod_text(lang, rod):
    detail = f"{yen(lang, rod['yen'])}、{area_list(lang, rod['areas'])}" if lang == "ja" else f"{yen(lang, rod['yen'])}, {area_list(lang, rod['areas'])}"
    bracket = f"（{detail}）" if lang == "ja" else f" ({detail})"
    return rod_ref(lang, rod["id"]) + bracket


def _loss(rod):
    return rod["use"][rod["method"]]["loss"]


def _pick(rods):
    """Cheapest first, then the rod that starts fights best, then the longer line."""
    return min(rods, key=lambda r: (r["yen"], _loss(r), -r["reach"], r["id"]))


def _tiers(facts, method, sold):
    """Fish grouped by the line they need, each with the rod to buy first and the cheapest rod overall."""
    groups = {}
    for fid in facts.fish_with_method(method):
        groups.setdefault(facts.fish[fid]["methods"][method]["need"], []).append(fid)
    tiers = []
    for need, fids in sorted(groups.items()):
        reaching = [r for r in sold if r["reach"] >= need]
        if not reaching:
            tiers.append({"need": need, "fish": fids, "first": None, "cheap": None})
            continue
        first_area = min(min(r["areas"]) for r in reaching)
        first = _pick([r for r in reaching if min(r["areas"]) == first_area])
        tiers.append({"need": need, "fish": fids, "first": first, "cheap": _pick(reaching)})
    return tiers


def _merge(tiers):
    """Neighbouring tiers that end in the same two rods read as one line."""
    merged = []
    for tier in tiers:
        key = (tier["first"] or {}).get("id"), (tier["cheap"] or {}).get("id")
        if merged and merged[-1]["key"] == key and tier["first"]:
            merged[-1]["fish"] += tier["fish"]
            merged[-1]["high"] = tier["need"]
        else:
            merged.append({**tier, "key": key, "low": tier["need"], "high": tier["need"]})
    return merged


def _tier_line(facts, lang, tier, sold):
    copy = COPY[lang]
    eg = examples(lang, facts.fish_names(lang, largest(facts, tier["fish"], 3), 3))
    count = species(lang, len(tier["fish"]))
    if not tier["first"]:
        top = max(sold, key=lambda r: (r["reach"], -r["yen"]))
        return copy["capped"].format(count=count, eg=eg, need=tier["need"], rod=_rod_text(lang, top), max=top["reach"])
    need = str(tier["low"]) if tier["low"] == tier["high"] else copy["need_range"].format(low=tier["low"], high=tier["high"])
    first, cheap = tier["first"], tier["cheap"]
    later = ""
    if cheap["id"] != first["id"] and cheap["yen"] < first["yen"]:
        area = area_list(lang, [min(cheap["areas"])])
        later = copy["later"].format(area=area, rod=rod_ref(lang, cheap["id"]) + (f"（{yen(lang, cheap['yen'])}）" if lang == "ja" else f" ({yen(lang, cheap['yen'])})"))
    return copy["tier"].format(count=count, eg=eg, need=need, first=_rod_text(lang, first), later=later)


def _rules(facts, lang, method, sold):
    copy = COPY[lang]
    parts = []
    refs = lambda rods: ref_list(lang, [rod_ref(lang, r["id"]) for r in rods])
    low = [r for r in sold if r["sel"] == 0]
    mid = [r for r in sold if r["sel"] == 1]
    heavy = [r for r in sold if r["sel"] == 2]
    if low:
        parts.append(copy["rule0"].format(refs=refs(low)))
    if mid:
        parts.append(copy["rule1"].format(refs=refs(mid)) if len(mid) <= 3 else copy["rule1_most"])
    parts.append(copy["rule_big"])
    if heavy:
        loss = sum(_loss(r) for r in heavy) / len(heavy)
        parts.append(copy["rule2"].format(refs=refs(heavy), loss=f"{loss:.1f}"))
    return ("。" if lang == "ja" else "; ").join(parts)


def _scope(lang, facts, method):
    copy, parts = COPY[lang], []
    unsold = _rods(facts, method, sold=False)
    if unsold:
        parts.append(copy["unsold"].format(refs=ref_list(lang, [rod_ref(lang, r["id"]) for r in unsold])))
    special = [r for r in _rods(facts, method, sold=True) if r["special"]]
    if special:
        parts.append(copy["special"].format(refs=ref_list(lang, [rod_ref(lang, r["id"]) for r in special])))
    if method in ("casting", "lure"):
        parts.append(copy["aim"])
    return ("" if lang == "ja" else " ").join(part + copy["end"] for part in parts)


def section(facts, method):
    sold = _rods(facts, method, sold=True)
    out = {"id": SECTION_ID[method], "category": "rod", "title": {}, "recommendation": {}, "reason": {}, "scope": {}}
    for lang in ("th", "en", "ja"):
        copy = COPY[lang]
        tiers = _merge(_tiers(facts, method, sold))
        lines = [_tier_line(facts, lang, tier, sold) for tier in tiers]
        picked = [r for tier in tiers for r in (tier["first"], tier["cheap"]) if r]
        eel = facts.fish.get(59, {}).get("methods", {}).get(method)
        eel_text = copy["eel"].format(need=eel["need"]) if eel else ""
        joined = "\n".join(f"• {line}" if lang != "ja" else line + copy["end"] for line in lines)
        out["title"][lang] = copy["title"][method]
        out["recommendation"][lang] = f"{copy['intro']}\n{joined}"
        out["reason"][lang] = copy["reason"].format(eel=eel_text, rules=_rules(facts, lang, method, sold)) + copy["end"]
        out["scope"][lang] = _scope(lang, facts, method)
    ids = list(dict.fromkeys(r["id"] for r in picked))
    out["items"] = [{"category": "rod", "id": f"{rid:02X}"} for rid in ids]
    return out


def sections(facts):
    return [section(facts, method) for method in ("float", "lure", "casting", "fly")]
