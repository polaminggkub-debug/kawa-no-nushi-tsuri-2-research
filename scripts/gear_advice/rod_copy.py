"""Per-rod label, full advice and reason, generated in Thai, English and Japanese."""

from .phrases import area_list, describe_set, examples, ref_list, rod_ref, species, yen
from .rod_view import view

COPY = {
    "th": {
        "when_all": "เมื่อต้องตกปลาใหญ่: สาย ×{reach} ยาวพอกับปลาทุกชนิด",
        "when_part": "เมื่อตกปลาที่สาย ×{reach} พอ ({covered} จาก {n} ชนิด)",
        "start_best": "เริ่มสู้ดีสุดกับ {best} ชนิด",
        "start_bad": "เสียเปรียบ{bad}",
        "label": "{when}; {start}",
        "unsold": "ไม่มีขายที่ไหนเลย; ถ้ามีอยู่แล้ว: {start}",
        "skip": "ข้ามคันนี้: {other} {why} (ขายที่{areas})",
        "late": "ซื้อเฉพาะก่อนถึง{area}: ถึงแล้ว {other} {why}",
        "why": {
            "cheaper": "ถูกกว่า",
            "same_price": "ราคาเท่ากัน",
            "reach": "สายยาวกว่า",
            "aim": "เวลาเล็งนานกว่า",
            "start": "เริ่มสู้ดีกว่า",
        },
        "last": "และ",
        "line_all": "สายขาดยาก ×{reach}: ปลาวิ่งหนีได้ไกลแค่ไหนก่อนสายขาดและเสียตะขอ คันนี้ยาวพอกับปลาทุกชนิด",
        "line_part": "สายขาดยาก ×{reach}: ปลาวิ่งหนีได้ไกลแค่ไหนก่อนสายขาดและเสียตะขอ คันนี้พอกับปลา {covered} จาก {n} ชนิด ส่วนอีก {short} ({eg}) วิ่งไกลกว่านั้น ต้องใช้คันที่ยาวกว่า",
        "fight_ok": "ตอนเริ่มสู้ปลา คันนี้ได้เปรียบสุดกับปลา {best} จาก {n} ชนิด",
        "fight_bad": "ตอนเริ่มสู้ปลา คันนี้ได้เปรียบสุดกับปลา {best} จาก {n} ชนิด แต่เสียเปรียบ{bad_full} เฉลี่ยทุกชนิดพลาดได้น้อยลง {loss} จังหวะ",
        "aim_hp": "เวลาเล็ง {aim} เมื่อ HP เต็ม 100 ถ้า HP ต่ำกว่านั้นเวลาเล็งสั้นลง เติม HP ก่อนตก",
        "price": "ราคา {yen} ขายที่{areas}{special}",
        "special": " (ร้านคันเบ็ดพิเศษ)",
        "no_price": "ไม่มีขายในร้านทั้ง 6 ด่าน",
        "skip_do": "ถึง{area} แล้วซื้อ {other} แทน: {why}",
        "up": "ปลาที่สายไม่พอให้ใช้ {steps}",
        "keep": "ถ้ามีคันนี้อยู่แล้วใช้ต่อได้ ไม่ต้องซื้อใหม่",
        "reason": "ตัวเลขมาจากการจำลองการสู้ปลา: จุดเริ่มของมาตรวัดแรงตึงกำหนดว่าพลาดได้กี่จังหวะ คันนี้เฉลี่ยเสียไป {loss} จังหวะต่อชนิด (คันที่ดีที่สุดเสีย 0) ส่วนสายขาดยากกำหนดว่าปลาวิ่งไกลได้แค่ไหนก่อนสายขาด",
        "area": "ด่าน {n}",
        "end": ".",
    },
    "en": {
        "when_all": "For big fish: line strength ×{reach} is long enough for every species",
        "when_part": "For fish that line strength ×{reach} holds ({covered} of {n} species)",
        "start_best": "best start against {best} species",
        "start_bad": "worse against {bad}",
        "label": "{when}; {start}",
        "unsold": "Not sold anywhere; if you own it: {start}",
        "skip": "Skip: {other} {why} (sold in {areas})",
        "late": "Only buy before you reach {area}: from there {other} {why}",
        "why": {
            "cheaper": "costs less",
            "same_price": "costs the same",
            "reach": "has a line that breaks less easily",
            "aim": "gives more time to aim",
            "start": "starts the fight better",
        },
        "last": " and ",
        "line_all": "Line strength ×{reach} is how far a fish can run before the line breaks and the hook is lost. This rod is long enough for every species",
        "line_part": "Line strength ×{reach} is how far a fish can run before the line breaks and the hook is lost. This rod holds {covered} of {n} species; the other {short} ({eg}) run farther, so they need a longer rod",
        "fight_ok": "It gives the best fight start against {best} of {n} species",
        "fight_bad": "It gives the best fight start against {best} of {n} species but is worse against {bad_full}; averaged over all species it costs {loss} mistakes you could otherwise afford",
        "aim_hp": "Time to aim is {aim} at full 100 HP and shorter below that, so restore HP before you fish",
        "price": "Price {yen}; sold in {areas}{special}",
        "special": " (special rod seller)",
        "no_price": "It is not sold in any of the six areas",
        "skip_do": "Once you reach {area}, buy {other} instead: it {why}",
        "up": "For fish this line cannot hold, use {steps}",
        "keep": "If you already own this rod, keep using it",
        "reason": "The numbers come from simulated fights: the rod sets the fight meter's starting point, which decides how many mistakes you can afford. This rod costs {loss} mistakes per species on average (the best rod costs 0). Line strength decides how far a fish may run before the line breaks.",
        "area": "area {n}",
        "end": ".",
    },
    "ja": {
        "when_all": "大物向け。糸の切れにくさ×{reach}で全魚種に足りる",
        "when_part": "糸の切れにくさ×{reach}で足りる魚（{n}種中{covered}種）向け",
        "start_best": "{best}種で最良のスタート",
        "start_bad": "{bad}は不利",
        "label": "{when}。{start}",
        "unsold": "どの店にも売っていません。持っている場合：{start}",
        "skip": "{other}を選ぶ：{why}（{areas}で販売）",
        "late": "{area}に着く前だけ購入：着いたら{other}の方が{why}",
        "why": {
            "cheaper": "安い",
            "same_price": "同じ価格",
            "reach": "糸が切れにくい",
            "aim": "狙う時間が長い",
            "start": "スタートが有利",
        },
        "last": "・",
        "line_all": "糸の切れにくさ×{reach}は、魚がどこまで走っても糸が切れて針を失わない距離です。この竿はどの魚にも十分です",
        "line_part": "糸の切れにくさ×{reach}は、魚がどこまで走っても糸が切れて針を失わない距離です。この竿は{n}種中{covered}種に足ります。残り{short}（{eg}）はもっと走るので、長い竿が必要です",
        "fight_ok": "ファイトの出だしは、{n}種中{best}種で最良です",
        "fight_bad": "{n}種中{best}種でファイトの出だしが最良ですが、{bad_full}では不利です。全種の平均で、許されるミスを{loss}回分失います",
        "aim_hp": "狙う時間はHP100のとき{aim}で、HPが減ると短くなります。釣る前にHPを回復してください",
        "price": "価格{yen}。{areas}で販売{special}",
        "special": "（特別な竿の販売所）",
        "no_price": "全6エリアのどの店にも売っていません",
        "skip_do": "{area}に着いたら、代わりに{other}を買います：{why}",
        "up": "糸が足りない魚には{steps}を使います",
        "keep": "すでに持っているなら、そのまま使えます",
        "reason": "数値はファイトのシミュレーション結果です。竿はメーターの出だしを決め、許されるミスの数が変わります。この竿は1種あたり平均{loss}回分のミスを失います（最良の竿は0）。糸の切れにくさは、魚がどこまで走れるかを決めます。",
        "area": "エリア{n}",
        "end": "。",
    },
}


def _why(lang, keys):
    copy = COPY[lang]
    words = [copy["why"][key] for key in keys]
    if len(words) == 1:
        return words[0]
    joiner = "、" if lang == "ja" else ", " if lang == "en" else " "
    return joiner.join(words[:-1]) + copy["last"] + words[-1]


def _pieces(facts, lang, v):
    rod, use = v["rod"], v["use"]
    return {
        "reach": rod["reach"],
        "n": use["n"],
        "best": len(use["best"]),
        "covered": v["covered"],
        "short": species(lang, len(v["short"])),
        "eg": examples(lang, facts.fish_names(lang, v["short_names"], 3)),
        "bad": describe_set(facts, lang, use["bad"]),
        "bad_full": describe_set(facts, lang, use["bad"], 3),
        "loss": f"{use['loss']:g}",
        "aim": rod["aim"],
        "yen": yen(lang, rod["yen"] or 0),
        "areas": area_list(lang, rod["areas"]),
    }


def _start(lang, p):
    copy = COPY[lang]
    best = copy["start_best"].format(**p)
    if not p["bad"]:
        return best
    return best + ("、" if lang == "ja" else "; ") + copy["start_bad"].format(**p)


def label(facts, lang, number):
    v = view(facts, number)
    copy, p = COPY[lang], _pieces(facts, lang, v)
    if v["verdict"] == "skip":
        better = v["better"]
        key = "late" if v["late"] else "skip"
        return copy[key].format(
            other=rod_ref(lang, better["id"]),
            why=_why(lang, v["better_keys"]),
            areas=area_list(lang, better["areas"]),
            area=copy["area"].format(n=min(better["areas"])),
        )
    when = copy["when_all" if not v["short"] else "when_part"].format(**p)
    start = _start(lang, p)
    if v["verdict"] == "unsold":
        return copy["unsold"].format(start=start)
    return copy["label"].format(when=when, start=start)


def _step_ref(lang, step):
    detail = f"{yen(lang, step['yen'])}、{area_list(lang, step['areas'])}" if lang == "ja" else f"{yen(lang, step['yen'])}, {area_list(lang, step['areas'])}"
    bracket = f"（{detail}）" if lang == "ja" else f" ({detail})"
    return rod_ref(lang, step["id"]) + bracket


def _action(lang, v):
    copy = COPY[lang]
    if v["verdict"] == "skip":
        better = v["better"]
        done = copy["skip_do"].format(
            area=copy["area"].format(n=min(better["areas"])),
            other=rod_ref(lang, better["id"]),
            why=_why(lang, v["better_keys"]),
        )
        return [done, copy["keep"]]
    if v["steps"]:
        refs = [_step_ref(lang, step) for step in v["steps"]]
        return [copy["up"].format(steps=ref_list(lang, refs)), copy["keep"]]
    return [copy["keep"]]


def advice(facts, lang, number):
    v = view(facts, number)
    copy, p = COPY[lang], _pieces(facts, lang, v)
    rod = v["rod"]
    sentences = [copy["line_all" if not v["short"] else "line_part"].format(**p)]
    sentences.append(copy["fight_bad" if p["bad"] else "fight_ok"].format(**p))
    if rod["style"] in (2, 4):
        sentences.append(copy["aim_hp"].format(**p))
    special = copy["special"] if rod["special"] else ""
    sentences.append(copy["price"].format(special=special, **p) if rod["sold"] else copy["no_price"])
    sentences.extend(_action(lang, v))
    end = copy["end"]
    return ("" if lang == "ja" else " ").join(sentence + end for sentence in sentences)


def reason(facts, lang, number):
    v = view(facts, number)
    return COPY[lang]["reason"].format(loss=f"{v['use']['loss']:g}")


def alternatives(facts, number):
    v = view(facts, number)
    ids = [step["id"] for step in v["steps"]] + ([v["better"]["id"]] if v["better"] else [])
    return [{"category": "rod", "id": f"{rid:02X}"} for rid in dict.fromkeys(ids)]
