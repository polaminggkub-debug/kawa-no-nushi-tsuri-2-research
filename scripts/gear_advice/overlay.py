"""Item-page text for rods, hooks and floats: summary, facts and evidence notes in three languages.

build_item_use.py lays this over the older research text so the item pages say what the measured
fight effects say. Technical lines (addresses, record fields) stay in `evidenceNotes`.
"""

from .hook_view import view as hook_view
from .phrases import BAND, METHOD, area_list, examples, species, yen
from .rod_view import view as rod_view

SOURCES = ["data/gear-effects.json", "docs/gear-effects.md", "docs/fight-model.md"]
LANGS = ("th", "en", "ja")

ROD = {
    "th": {
        "summary": "คัน{method}: สายขาดยาก ×{reach} พอกับปลา {covered} จาก {n} ชนิด และเริ่มสู้ได้ดีสุดกับปลา {best} ชนิด",
        "line_all": "สายขาดยาก ×{reach} ยาวพอกับปลาทุกชนิด รวมปลาใหญ่",
        "line_part": "สายขาดยาก ×{reach} ใช้ได้กับปลา {covered} จาก {n} ชนิด อีก {short} ({eg}) วิ่งไกลกว่านี้ สายจะขาดและเสียตะขอ ต้องใช้คันที่ยาวกว่า",
        "start": "จุดเริ่มของมาตรวัดแรงตึงตามขนาดปลา: คันนี้ดีสุดกับปลา {best} จาก {n} ชนิด เฉลี่ยพลาดได้น้อยลง {loss} จังหวะ",
        "aim": "เวลาเล็ง {aim} เมื่อ HP เต็ม 100 ถ้า HP ต่ำกว่านั้นเวลาเล็งสั้นลง",
        "match": "คันนี้ตรงกับ{fish}: ตอนตกปลาชนิดนี้ คันไม่โดนผลปรับตามขนาดปลา",
        "match_scope": "คันนี้ตรงกับ{fish}: ตอนตกปลาชนิดนี้ จุดเริ่มสู้ไม่ถูกปรับตามขนาดปลา ปลาชนิดอื่นยังตกด้วยคันนี้ได้",
        "evidence": [
            "ที่ HP 100 ช่วงเล็งก่อนเปลี่ยนอัตโนมัติคือ {aim} หน่วยตัวนับ ระยะสายคือ {units} หน่วยตำแหน่งภายใน ({reach} × 336) ไม่ใช่เมตร: เกมใช้ค่านี้ตัดสินว่าปลาถูกลากไกลเกินสายหรือไม่",
            "จุดเริ่มของมาตรวัดแรงตึงคำนวณโดยรูทีน 04:8D2A..8EC1 จากกลุ่มของคัน (selector {sel}) ขนาดปลา และ ID ปลาที่ตรงกัน ผลที่วัดอยู่ใน docs/gear-effects.md",
        ],
        "hp": "ถ้า HP ต่ำกว่า 100 ช่วงเล็งก่อนเปลี่ยนอัตโนมัติสั้นลงตาม HP (ต่ำสุด 10) ที่ HP 100 ใช้ค่าเต็ม",
    },
    "en": {
        "summary": "A {method} rod: line strength ×{reach} holds {covered} of {n} species, and it gives the best fight start against {best} of them.",
        "line_all": "Line strength ×{reach} is long enough for every species, including the biggest.",
        "line_part": "Line strength ×{reach} holds {covered} of {n} species. The other {short} ({eg}) run farther than that, so the line breaks and the hook is lost; they need a longer rod.",
        "start": "Fight start by fish size: this rod is best for {best} of {n} species and costs {loss} mistakes on average.",
        "aim": "Time to aim is {aim} at full 100 HP and gets shorter below that.",
        "match": "This rod is matched to {fish}: when you fish for it, the rod skips the size adjustment.",
        "match_scope": "This rod is matched to {fish}: against that fish its fight start is not adjusted by size. Other fish can still be caught with it.",
        "evidence": [
            "At 100 HP the automatic aim cutoff is {aim} counter ticks. The line range is {units} internal position units ({reach} × 336), not meters: the game uses it to decide whether the fish was dragged past the line.",
            "The fight meter's start is computed by the routine at 04:8D2A..8EC1 from the rod's class (selector {sel}), the fish's size and a matching fish ID. The measured effect is in docs/gear-effects.md.",
        ],
        "hp": "Below 100 HP the automatic aim cutoff shrinks with current HP (minimum 10); at 100 HP it uses the full value.",
    },
    "ja": {
        "summary": "{method}竿：糸の切れにくさ×{reach}は{n}種中{covered}種に足り、{best}種で最良のスタートになります。",
        "line_all": "糸の切れにくさ×{reach}は、最大の魚を含む全魚種に十分な長さです。",
        "line_part": "糸の切れにくさ×{reach}は{n}種中{covered}種に足ります。残り{short}（{eg}）はそれ以上走るため、糸が切れて針を失います。もっと長い竿が必要です。",
        "start": "魚の大きさごとのファイトの出だし：この竿は{n}種中{best}種で最良で、平均{loss}回分のミスを失います。",
        "aim": "狙う時間はHP100のとき{aim}で、HPが減ると短くなります。",
        "match": "この竿は{fish}に対応しています。この魚を釣るとき、大きさによる調整を受けません。",
        "match_scope": "この竿は{fish}に対応しています。この魚では出だしが大きさで調整されません。ほかの魚もこの竿で釣れます。",
        "evidence": [
            "HP100のとき、照準の自動移行上限はゲーム内カウンター{aim}です。糸の範囲は内部位置単位で{units}（{reach} × 336）で、メートルではありません。魚がその先まで引かれたかをゲームが判定します。",
            "ファイトのメーターの出だしは04:8D2A..8EC1のルーチンが、竿の区分（selector {sel}）、魚の大きさ、一致する魚IDから計算します。測定結果はdocs/gear-effects.mdにあります。",
        ],
        "hp": "HPが100未満だと、照準の自動移行上限はHPに応じて短くなります（最小10）。HP100以上では全値を使います。",
    },
}


def rod_overlay(facts, lang, number):
    v = rod_view(facts, number)
    rod, use, copy = v["rod"], v["use"], ROD[lang]
    p = {
        "method": METHOD[lang][rod["method"]],
        "reach": rod["reach"],
        "covered": v["covered"],
        "n": use["n"],
        "best": len(use["best"]),
        "short": species(lang, len(v["short"])),
        "eg": examples(lang, facts.fish_names(lang, v["short_names"], 3)),
        "loss": f"{use['loss']:g}",
        "aim": rod["aim"],
        "units": rod["reach"] * 336,
        "sel": rod["sel"],
    }
    lines = [copy["line_all" if not v["short"] else "line_part"].format(**p), copy["start"].format(**p)]
    notes = [line.format(**p) for line in copy["evidence"]]
    if rod["style"] in (2, 4):
        lines.append(copy["aim"].format(**p))
        notes.append(copy["hp"])
    out = {"summary": copy["summary"].format(**p), "facts": lines, "evidenceNotes": notes}
    if rod["match"] and rod["match"] in facts.fish:
        fish = facts.fish_name(lang, rod["match"])
        out["facts"].append(copy["match"].format(fish=fish))
        out["targetMatchScope"] = copy["match_scope"].format(fish=fish)
    return out


HOOK = {
    "th": {
        "summary": "ตะขอตั้งจุดเริ่มของมาตรวัดแรงตึงตามขนาดปลา: {effect}",
        "effect": {1: "พลาดได้เพิ่ม 1 จังหวะ", 0: "ไม่ช่วย", -1: "พลาดได้น้อยลง 1 จังหวะ"},
        "per_band": "{band} {effect}",
        "none": "ห่วงนี้ไม่มีผลกับการสู้ปลา ยกเว้นปลาอายุ",
        "named": "ตะขอนี้ตรงกับ{fish}: ตกปลาชนิดนี้พลาดได้เพิ่ม 1 จังหวะไม่ว่าขนาดไหน (ไม่ซ้อนกับผลตามขนาด)",
        "named_scope": "ตกปลา{fish}: พลาดได้เพิ่ม 1 จังหวะไม่ว่าขนาดไหน วัดแล้วด้วยการจำลองการสู้ปลา ปลาชนิดอื่นก็ตกด้วยตะขอนี้ได้",
        "stack": "ราคา {yen} ขายที่{areas} ขายเป็นชุด 9 ตัว ตะขอยังหักได้หลังตกปลาสำเร็จ (สูงสุดราว 6%) ควรพกสำรอง",
        "measured": "ในการจำลองการสู้ปลา ตะขอนี้ดีสุดกับ {best} จาก {n} ชนิดของคันทุ่น เฉลี่ยเสียไป {loss} จังหวะ",
        "evidence": [
            "จุดเริ่มของมาตรวัดแรงตึงคำนวณโดยรูทีน 04:8D2A..8EC1: ถ้า ID ปลาในข้อมูลตะขอ (+1) ตรงกับปลาที่สู้ จะหารค่าตั้งต้นด้วย 2 และข้ามส่วนที่ดูตามขนาด (04:8D53–8D99, 04:8F6F) ถ้าไม่ตรง ใช้กลุ่มของตะขอ (+0 = {sel}) ตามขนาดปลา",
            "ค่าเดียวกันไปตั้งสถานะการสู้ 1EC9 และตำแหน่งวาดปลา 1F65 ผลที่วัดอยู่ใน docs/gear-effects.md",
            "ข้อความจาก ROM: เส้นทางเหยื่อทั่วไปที่เข้าแฟล็กเหตุการณ์แสดงว่า “เบ็ดถูกขโมย/ปลาหนี/เสียแต้ม” (00:0096) อีกเส้นทางแสดงว่า “ปลาหนี/เหยื่อถูกขโมย” (00:009A)",
        ],
    },
    "en": {
        "summary": "A hook sets the fight meter's start by fish size: {effect}.",
        "effect": {1: "1 more mistake allowed", 0: "no help", -1: "1 fewer mistake allowed"},
        "per_band": "{band}: {effect}",
        "none": "This ring has no effect on a fight except for Ayu.",
        "named": "This hook is named for {fish}: against that fish it allows 1 more mistake at any size (it does not stack with the size effect).",
        "named_scope": "Against {fish} it allows 1 more mistake at any size, measured with the fight simulation. Other fish can still be caught with this hook.",
        "stack": "Price {yen}; sold in {areas}; sold in stacks of 9. A landed fish can still break the hook (up to about 6%), so carry spares.",
        "measured": "In simulated fights this hook is best for {best} of {n} float-rod species and costs {loss} mistakes on average.",
        "evidence": [
            "The fight meter's start is computed by the routine at 04:8D2A..8EC1. If the fish ID in the hook record (+1) equals the fish being fought, the starting value is halved and the size branch is skipped (04:8D53–8D99, 04:8F6F). Otherwise the hook's class (+0 = {sel}) acts by fish size.",
            "The same value seeds fight state 1EC9 and the fish display offset 1F65. The measured effect is in docs/gear-effects.md.",
            "ROM outcome messages: the flagged ordinary-bait path says the hook is stolen, the fish escapes and points are damaged (00:0096); the fallback says the fish escapes and bait is stolen (00:009A).",
        ],
    },
    "ja": {
        "summary": "針は魚の大きさでファイトのメーターの出だしを決めます：{effect}。",
        "effect": {1: "許されるミスが1回増える", 0: "効果なし", -1: "許されるミスが1回減る"},
        "per_band": "{band}は{effect}",
        "none": "この環はアユ以外のファイトには効果がありません。",
        "named": "この針は{fish}に対応しています。この魚には大きさに関係なく許されるミスが1回増えます（大きさの効果とは重なりません）。",
        "named_scope": "{fish}にはどの大きさでも許されるミスが1回増えます。ファイトのシミュレーションで測定しました。ほかの魚もこの針で釣れます。",
        "stack": "価格{yen}。{areas}で販売。9個1組で売っています。釣り上げた後でも針が折れることがある（最大約6%）ので、予備を持ちます。",
        "measured": "ファイトのシミュレーションでは、ウキ竿の{n}種中{best}種でこの針が最良で、平均{loss}回分のミスを失います。",
        "evidence": [
            "ファイトのメーターの出だしは04:8D2A..8EC1のルーチンが計算します。針レコードの魚ID（+1）が戦う魚と一致すると出だしの値を半分にし、大きさの分岐を飛ばします（04:8D53–8D99、04:8F6F）。一致しなければ針の区分（+0 = {sel}）が魚の大きさに応じて働きます。",
            "同じ値がファイト状態1EC9と魚の表示位置1F65に使われます。測定結果はdocs/gear-effects.mdにあります。",
            "ROMメッセージ: 通常エサで判定フラグありは「針を盗られた／魚に逃げられた／ポイントダメージ」(00:0096)、別経路は「魚に逃げられた／エサを盗られた」(00:009A)。",
        ],
    },
}


def hook_overlay(facts, lang, number):
    v = hook_view(facts, number)
    hook, copy = v["hook"], HOOK[lang]
    effects = copy["effect"]
    parts = [f"{BAND[lang][b]}: {effects[v['effect'][b]]}" if lang != "ja" else copy["per_band"].format(band=BAND[lang][b], effect=effects[v["effect"][b]]) for b in range(3)]
    sep = "、" if lang == "ja" else "; "
    use = v["float"]
    p = {
        "yen": yen(lang, hook["yen"]),
        "areas": area_list(lang, hook["areas"]),
        "best": len(use["best"]),
        "n": use["n"],
        "loss": f"{use['loss']:g}",
        "sel": hook["sel"],
    }
    summary = copy["none"] if hook["sel"] == 3 else copy["summary"].format(effect=sep.join(parts))
    facts_list = []
    out = {"summary": summary, "evidenceNotes": [line.format(**p) for line in copy["evidence"]]}
    if v["named"]:
        fish = facts.fish_name(lang, v["named"])
        facts_list.append(copy["named"].format(fish=fish))
        out["targetMatchScope"] = copy["named_scope"].format(fish=fish)
    facts_list += [copy["stack"].format(**p), copy["measured"].format(**p)]
    out["facts"] = facts_list
    return out


FLOAT = {
    "th": {
        "summary": "ทุ่นเลือกเส้นทางตกเหยื่อ (คันทุ่นใช้ทุ่น คันหวดใช้ตะกั่ว) ตอนสู้ปลาทุ่นทุกแบบให้ผลเท่ากัน",
        "summary_sinker": "ตะกั่วเลือกเส้นทางคันหวด: ตกได้เฉพาะปลาก้นน้ำ {count} จาก {total} ชนิด รอประมาณ 10 วินาที และไม่ตกอะไรที่ทุ่นตกไม่ได้",
        "summary_marker": "เครื่องหมายสายที่เกมโหลดให้เองเมื่อเตรียมฟลาย ไม่มีขายและไม่ต้องซื้อ",
        "facts": [
            "ทุ่นทุกแบบ (ID 01–08) ให้ผลเท่ากันตอนสู้ปลา ต่างกันแค่รูปแบบสัญญาณทุ่นที่แสดงบนจอ ซื้อตัวที่ถูกสุด",
            "ทุ่นไม่ได้จำกัดชนิดปลา เหยื่อและเงื่อนไขอื่นเป็นตัวตรวจ",
        ],
        "facts_hera": "ป้ายปลาเฮระของทุ่นเฮระไม่ทำอะไร ตกปลาเฮระง่ายขึ้นไม่ได้",
        "facts_sinker": [
            "ตะกั่ว (ID 09–0A) ให้ผลเท่ากันตอนสู้ปลา ซื้อตัวที่ถูกสุด",
            "ปลาที่ตะกั่วตกได้ทั้งหมดตกด้วยทุ่นได้เช่นกัน คันหวดต้องใช้ตะกั่ว คันทุ่นใช้ทุ่น",
        ],
        "evidence": [
            "ข้อมูลการสู้ปลา (createFight) ไม่มีช่องทุ่นหรือตะกั่ว รูทีนคำนวณจุดเริ่มอ่านเฉพาะคัน ปลา ตะขอ และเหยื่อ (หรือลัวร์/ฟลาย)",
            "ในเกมจริง ข้อมูลทุ่นโหลดไปที่ $1250..$125E (03:D17D) สแกนตัวถูกดำเนินการแบบสัมบูรณ์ไม่พบการอ่านที่อยู่เหล่านี้ในโค้ดการสู้ปลา (04:8000..B7FF) ผู้อ่านเดียวคือโค้ดตั้งค่าอุปกรณ์ (04:D2EB..D4D3) และโค้ดสัญญาณทุ่น (04:E5C8..E86B)",
            "เมื่อรัน ROM จริงในตัวแปล 65816: 28 การสู้ (ตั้งค่าคัน ปลา ตะขอ 4 แบบ ทุ่น ID 1, 2, 4, 5, 8 และตะกั่ว ID 9, 10) ได้ค่าตัวแปรเหมือนกันทุกเฟรมไม่ว่าจะเขียนทุ่นหรือตะกั่วตัวไหนลง RAM",
        ],
    },
    "en": {
        "summary": "A float picks the bait route (float rods use floats, casting rods use sinkers). In a fight every float does the same.",
        "summary_sinker": "A sinker picks the casting route: it catches {count} of {total} species (bottom fish only), waits about 10 seconds, and catches nothing a float cannot.",
        "summary_marker": "The line marker the game loads by itself when it sets up a fly; it is not sold and you never need to buy it.",
        "facts": [
            "Every float (IDs 01–08) does the same in a fight; they differ only in the float signal shown on screen. Buy the cheapest.",
            "A float does not limit which fish you can catch; the bait and other checks do.",
        ],
        "facts_hera": "The Hera tag on the Hera float does nothing; it does not make Hera easier to catch.",
        "facts_sinker": [
            "Both sinkers (IDs 09–0A) do the same in a fight. Buy the cheapest.",
            "Every fish a sinker can catch can also be caught with a float. Casting rods need a sinker; float rods use a float.",
        ],
        "evidence": [
            "The fight data (createFight) has no float or sinker field; the routine that computes the start reads only the rod, fish, hook and bait (or lure or fly).",
            "In the real ROM the float record loads to $1250..$125E (03:D17D). A scan of absolute-address operands finds no read of those addresses inside the fight code (04:8000..B7FF); the only readers are the equipment set-up (04:D2EB..D4D3) and the float indicator and bite code (04:E5C8..E86B).",
            "Running the real ROM in a 65816 interpreter, 28 fights (four rod, fish and hook set-ups, float IDs 1, 2, 4, 5, 8 and sinker IDs 9, 10) gave frame-for-frame identical variables whichever float or sinker was written to RAM.",
        ],
    },
    "ja": {
        "summary": "ウキはエサ釣りの経路を決めます（ウキ竿はウキ、投げ竿はオモリ）。ファイトではどのウキも効果は同じです。",
        "summary_sinker": "オモリは投げ竿の経路を決めます。{total}種中{count}種（底にいる魚だけ）が釣れ、約10秒待ち、ウキで釣れない魚は釣れません。",
        "summary_marker": "フライの準備のときにゲームが自動で読み込む目印です。売っておらず、買う必要もありません。",
        "facts": [
            "どのウキ（ID 01–08）もファイトでは効果が同じで、違うのは画面に出るウキの合図だけです。最安のものを買います。",
            "ウキで釣れる魚が絞られることはありません。エサなどの判定が決めます。",
        ],
        "facts_hera": "ヘラウキのヘラブナの表示は何もしません。ヘラブナが釣りやすくなることはありません。",
        "facts_sinker": [
            "どちらのオモリ（ID 09–0A）もファイトでは効果が同じです。最安のものを買います。",
            "オモリで釣れる魚はすべてウキでも釣れます。投げ竿はオモリ、ウキ竿はウキを使います。",
        ],
        "evidence": [
            "ファイトのデータ（createFight）にウキ・オモリの項目はなく、出だしを計算するルーチンは竿・魚・針・エサ（またはルアー・フライ）だけを読みます。",
            "実機ROMではウキのレコードが$1250..$125E（03:D17D）に読み込まれます。絶対アドレスのオペランドを走査しても、ファイトのコード（04:8000..B7FF）にこれらのアドレスの読み出しはなく、読むのは装備のセットアップ（04:D2EB..D4D3）とウキの合図・アタリのコード（04:E5C8..E86B）だけです。",
            "65816インタープリタで実機ROMを動かした28回のファイト（竿・魚・針の組み合わせ4通り、ウキID 1・2・4・5・8、オモリID 9・10）は、どのウキやオモリをRAMに書いても変数がフレーム単位で一致しました。",
        ],
    },
}


def float_overlay(facts, lang, number):
    copy = FLOAT[lang]
    p = {"count": len(facts.fish_with_method("casting")), "total": len(facts.fish_with_method("float"))}
    if number in (9, 10):
        return {"summary": copy["summary_sinker"].format(**p), "facts": list(copy["facts_sinker"]), "evidenceNotes": list(copy["evidence"])}
    if number == 8:
        return {"summary": copy["summary_marker"], "facts": [copy["summary_marker"]], "evidenceNotes": list(copy["evidence"])}
    lines = list(copy["facts"]) + ([copy["facts_hera"]] if number == 1 else [])
    return {"summary": copy["summary"], "facts": lines, "evidenceNotes": list(copy["evidence"])}


def use_overlay(facts):
    """{'rod:01': {summary, facts, evidenceNotes, ...}}, each field a {th, en, ja} dict or list-dict."""
    out = {}
    for category, numbers, make in (
        ("rod", facts.rods, rod_overlay),
        ("hook", facts.hooks, hook_overlay),
        ("float_weight", facts.floats, float_overlay),
    ):
        for number in numbers:
            per_lang = {lang: make(facts, lang, number) for lang in LANGS}
            entry = {}
            for field in per_lang["th"]:
                entry[field] = {lang: per_lang[lang][field] for lang in LANGS}
            entry["evidence"] = {"type": "rom_trace", "sources": list(SOURCES)}
            out[f"{category}:{number:02X}"] = entry
    return out
