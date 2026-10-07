"""Float and sinker advice: every float is the same in a fight, a sinker is the casting route."""

from .phrases import FLOAT_CUE, SINKER_CUE, area_list, yen

HERA, MARKER = 1, 8
SINKERS = (9, 10)
FLOATS = range(1, 9)

COPY = {
    "th": {
        "cheapest": "ทุ่นทุกแบบให้ผลเท่ากัน ตัวนี้ถูกสุด ซื้อตัวนี้ ({yen}, {areas})",
        "pricey": "ผลเท่ากับทุ่นตัวอื่นทุกแบบ ไม่ต้องจ่ายแพง ซื้อ {cheap} ({cheap_yen}) แทน",
        "hera": "ป้ายปลาเฮระของทุ่นนี้ไม่มีผลอะไร ผลเท่ากับทุ่นอื่น ซื้อ {cheap} ({cheap_yen}) แทน",
        "unsold": "ไม่มีขายที่ไหน ถ้ามีอยู่แล้วใช้ได้ ผลเท่ากับทุ่นอื่นทุกแบบ",
        "marker": "เครื่องหมายที่เกมใส่ให้เองตอนตกด้วยฟลาย ไม่มีขายและไม่ต้องซื้อ",
        "sinker": "สำหรับคันหวดเท่านั้น: ตกได้เฉพาะปลาก้นน้ำ รอประมาณ 10 วินาที และไม่ตกอะไรที่ทุ่นตกไม่ได้",
        "float_what": "ทุ่นเลือกเส้นทางตกเหยื่อ: คันทุ่นใช้ทุ่น คันหวดใช้ตะกั่ว ตอนสู้ปลาทุ่นทุกแบบให้ผลเท่ากัน ต่างกันแค่รูปแบบสัญญาณทุ่นที่แสดงบนจอ",
        "hera_what": "ป้ายปลาเฮระของทุ่นเฮระไม่ทำอะไร ตกปลาเฮระง่ายขึ้นไม่ได้",
        "marker_what": "เครื่องหมายสายนี้เกมโหลดให้เองเมื่อเตรียมฟลาย ไม่ต้องซื้อและไม่มีผลอะไรกับปลา",
        "buy": "ซื้อตัวที่ถูกสุดที่ร้านในด่านมี ทุ่นที่ถูกสุดคือ {cheap} ({cheap_yen}, {cheap_areas}) ด่านอื่นดูตารางราคาตามด่าน",
        "sinker_what": "ตะกั่วเลือกเส้นทางคันหวด: ตกได้ {count} จาก {total} ชนิด (เฉพาะปลาก้นน้ำ) รอประมาณ 10 วินาที และไม่มีปลาที่ตะกั่วตกได้แต่ทุ่นตกไม่ได้ ถ้าไม่มีเหตุผลพิเศษ ใช้คันทุ่นกับทุ่นถูกสุดจะง่ายกว่า",
        "sinker_cheapest": "ตะกั่วสองแบบให้ผลเท่ากัน ตัวนี้ถูกสุด ({yen}, {areas})",
        "sinker_scope": "ตะกั่วที่ถูกสุดคือ {cheap} ({cheap_yen}, {cheap_areas}) ตะกั่วสองแบบให้ผลเท่ากัน",
        "sinker_pricey": "ตะกั่วสองแบบให้ผลเท่ากัน {cheap} ({cheap_yen}) ถูกกว่า ซื้อตัวนั้นถ้าอยู่{cheap_areas} ด่านอื่นซื้อตัวนี้ได้",
        "reason": "ผลการจำลอง: ทุ่นและตะกั่วไม่อยู่ในข้อมูลการสู้ปลาเลย เปลี่ยนแล้วการสู้ปลาเหมือนเดิมทุกเฟรม (ทดสอบ 28 การสู้ ด้วยทุ่น 5 แบบและตะกั่ว 2 แบบ)",
        "title": "ทุ่นและตะกั่ว: ซื้อถูกสุดพอ",
        "end": ".",
    },
    "en": {
        "cheapest": "Every float does the same and this one is the cheapest: buy it ({yen}, {areas})",
        "pricey": "It does the same as every other float, so do not pay extra: buy {cheap} ({cheap_yen}) instead",
        "hera": "The Hera tag on this float does nothing and it does the same as the others: buy {cheap} ({cheap_yen}) instead",
        "unsold": "Not sold anywhere; if you own it, it works like every other float",
        "marker": "The marker the game fits for you when you fish with a fly; it is not sold and you do not need to buy it",
        "sinker": "For casting rods only: it catches bottom fish only, waits about 10 seconds, and catches nothing a float cannot",
        "float_what": "A float picks the bait route: float rods use floats, casting rods use sinkers. In a fight every float does the same; they differ only in the float signal shown on screen",
        "hera_what": "The Hera tag on the Hera float does nothing; it does not make Hera easier to catch",
        "marker_what": "The game loads this line marker by itself when it sets up a fly; you never need to buy it and it does nothing to the fish",
        "buy": "Buy the cheapest one your shop stocks. The cheapest float is {cheap} ({cheap_yen}, {cheap_areas}); for other areas see the price-by-area table",
        "sinker_what": "A sinker picks the casting route: it catches {count} of {total} species (bottom fish only), waits about 10 seconds, and catches nothing a float cannot. Unless you have a reason, a float rod with the cheapest float is easier",
        "sinker_cheapest": "Both sinkers do the same and this one is the cheapest ({yen}, {areas})",
        "sinker_scope": "The cheapest sinker is {cheap} ({cheap_yen}, {cheap_areas}); both sinkers do the same",
        "sinker_pricey": "Both sinkers do the same; {cheap} ({cheap_yen}) is cheaper, so buy that one if you are in {cheap_areas} and this one elsewhere",
        "reason": "Simulation result: floats and sinkers are not in the fight data at all, so swapping them leaves the fight identical frame for frame (28 fights tested with 5 floats and 2 sinkers)",
        "title": "Floats and sinkers: buy the cheapest",
        "end": ".",
    },
    "ja": {
        "cheapest": "どのウキも効果は同じで、これが最安です。これを買います（{yen}、{areas}）",
        "pricey": "どのウキとも効果は同じなので、高く払う必要はありません。代わりに{cheap}（{cheap_yen}）を買います",
        "hera": "このウキのヘラブナの表示は何も起こしません。ほかのウキと効果は同じなので、代わりに{cheap}（{cheap_yen}）を買います",
        "unsold": "どの店にも売っていません。持っているなら、ほかのウキと同じように使えます",
        "marker": "フライで釣るとき、ゲームが自動で付ける目印です。売っておらず、買う必要もありません",
        "sinker": "投げ竿専用です。底にいる魚だけが釣れ、約10秒待ち、ウキで釣れない魚は釣れません",
        "float_what": "ウキはエサ釣りの経路を決めます。ウキ竿はウキ、投げ竿はオモリを使います。ファイトではどのウキも効果は同じで、違うのは画面に出るウキの合図だけです",
        "hera_what": "ヘラウキのヘラブナの表示は何もしません。ヘラブナが釣りやすくなることはありません",
        "marker_what": "この目印は、フライの準備のときにゲームが自動で読み込みます。買う必要はなく、魚への効果もありません",
        "buy": "店にある中で最安のものを買います。最安のウキは{cheap}（{cheap_yen}、{cheap_areas}）で、ほかのエリアはエリア別の価格表を見ます",
        "sinker_what": "オモリは投げ竿の経路を決めます。{total}種中{count}種（底にいる魚だけ）が釣れ、約10秒待ち、ウキで釣れない魚は釣れません。特別な理由がなければ、最安のウキでウキ竿を使う方が簡単です",
        "sinker_cheapest": "2種類のオモリは効果が同じで、これが最安です（{yen}、{areas}）",
        "sinker_scope": "最安のオモリは{cheap}（{cheap_yen}、{cheap_areas}）で、2種類のオモリは効果が同じです",
        "sinker_pricey": "2種類のオモリは効果が同じです。{cheap}（{cheap_yen}）の方が安いので、{cheap_areas}にいるならそちらを、ほかのエリアではこれを買います",
        "reason": "シミュレーションの結果：ウキとオモリはファイトのデータに含まれず、替えてもファイトは1フレームも変わりません（ウキ5種とオモリ2種で28回のファイトを確認）",
        "title": "ウキとオモリ：最安で十分",
        "end": "。",
    },
}


def _cheapest(facts, ids):
    return min((facts.floats[i] for i in ids if facts.floats[i]["areas"]), key=lambda r: (r["yen"], r["id"]))


def _fill(facts, lang, number):
    row = facts.floats[number]
    pool = SINKERS if number in SINKERS else FLOATS
    cheap = _cheapest(facts, pool)
    cue = (SINKER_CUE if number in SINKERS else FLOAT_CUE)[lang]
    ref = f"{cue}{'' if lang == 'ja' else ' '}{cheap['hex']}"
    return row, cheap, {
        "yen": yen(lang, row["yen"]),
        "areas": area_list(lang, row["areas"]) if row["areas"] else "",
        "cheap": ref,
        "cheap_yen": yen(lang, cheap["yen"]),
        "cheap_areas": area_list(lang, cheap["areas"]),
        "count": len(facts.fish_with_method("casting")),
        "total": len(facts.fish_with_method("float")),
    }


def _join(lang, sentences):
    copy = COPY[lang]
    glue = "" if lang == "ja" else " "
    return glue.join(s + copy["end"] for s in sentences if s)


def label(facts, lang, number):
    copy = COPY[lang]
    row, cheap, p = _fill(facts, lang, number)
    if number in SINKERS:
        return copy["sinker"]
    if number == MARKER:
        return copy["marker"]
    if not row["areas"]:
        return copy["unsold"]
    if row["id"] == cheap["id"]:
        return copy["cheapest"].format(**p)
    return copy["hera" if number == HERA else "pricey"].format(**p)


def advice(facts, lang, number):
    copy = COPY[lang]
    row, cheap, p = _fill(facts, lang, number)
    if number in SINKERS:
        price = "sinker_cheapest" if row["id"] == cheap["id"] else "sinker_pricey"
        return _join(lang, [copy["sinker_what"].format(**p), copy[price].format(**p)])
    if number == MARKER:
        return _join(lang, [copy["marker_what"]])
    extra = copy["hera_what"] if number == HERA else ""
    return _join(lang, [copy["float_what"], extra, copy["buy"].format(**p)])


def reason(facts, lang, number):
    return COPY[lang]["reason"]


def alternatives(facts, number):
    pool = SINKERS if number in SINKERS else FLOATS
    cheap = _cheapest(facts, pool)
    return [] if cheap["id"] == number or number == MARKER else [{"category": "float_weight", "id": cheap["hex"]}]


def section(facts):
    out = {"id": "float_sinker_choice", "category": "float_weight", "title": {}, "recommendation": {}, "reason": {}, "scope": {}}
    cheap_float, cheap_sinker = _cheapest(facts, FLOATS), _cheapest(facts, SINKERS)
    for lang in ("th", "en", "ja"):
        copy = COPY[lang]
        _, _, p = _fill(facts, lang, cheap_float["id"])
        _, _, q = _fill(facts, lang, cheap_sinker["id"])
        out["title"][lang] = copy["title"]
        out["recommendation"][lang] = _join(lang, [copy["buy"].format(**p), copy["sinker_what"].format(**q)])
        out["reason"][lang] = copy["reason"] + copy["end"]
        out["scope"][lang] = _join(lang, [copy["hera_what"], copy["sinker_scope"].format(**q)])
    out["items"] = [
        {"category": "float_weight", "id": cheap_float["hex"]},
        {"category": "float_weight", "id": cheap_sinker["hex"]},
    ]
    return out
