#!/usr/bin/env python3
"""Player-facing bait and lure copy for catalogue/item-use.json (EN / JA / TH).

Facts come from the ROM audit of 2026-10-07 (rom-analysis/audit-2026-10-07/acceptance/report.md) and
data/gear-effects.json: a bait or lure bites when it is on the fish's list and the fish stands on the
exact tile of the float or lure; nothing else (time, weather, rod, hook, HP) is read.
"""


def loc(en, ja, th):
    return {"en": en, "ja": ja, "th": th}


def loc_lists(en=(), ja=(), th=()):
    return {"en": list(en), "ja": list(ja), "th": list(th)}


# Lure and fly-body size classes (selector 0 / 1 / 2) start the fight differently by fish length.
SELECTOR_FIGHT = {
    0: loc(
        "Its size class helps against fish up to 15 cm (the fight starts with half the mistakes counted) and hurts against fish over 35 cm.",
        "このサイズ区分は15cm以下の魚に有利（ファイトの開始値が半分）で、35cm超の魚には不利。",
        "กลุ่มขนาดนี้ช่วยตอนสู้กับปลาไม่เกิน 15 ซม. (ค่าเริ่มสู้ลดลงครึ่งหนึ่ง) แต่เสียเปรียบกับปลาใหญ่กว่า 35 ซม.",
    ),
    1: loc(
        "Its size class helps against fish of 16 to 35 cm (the fight starts with half the mistakes counted) and does nothing for other sizes.",
        "このサイズ区分は16〜35cmの魚に有利（ファイトの開始値が半分）で、他のサイズには効果なし。",
        "กลุ่มขนาดนี้ช่วยตอนสู้กับปลา 16–35 ซม. (ค่าเริ่มสู้ลดลงครึ่งหนึ่ง) ส่วนปลาขนาดอื่นไม่มีผล",
    ),
    2: loc(
        "Its size class helps against fish over 35 cm (the fight starts with half the mistakes counted) and hurts against fish up to 15 cm.",
        "このサイズ区分は35cm超の魚に有利（ファイトの開始値が半分）で、15cm以下の魚には不利。",
        "กลุ่มขนาดนี้ช่วยตอนสู้กับปลาใหญ่กว่า 35 ซม. (ค่าเริ่มสู้ลดลงครึ่งหนึ่ง) แต่เสียเปรียบกับปลาไม่เกิน 15 ซม.",
    ),
}

AUDIT = "docs/gear-effects.md"
AUDIT_REPORT = "rom-analysis/audit-2026-10-07/acceptance/report.md"


def bait_copy(has_sinker, matched_fish=None):
    """matched_fish: {'en','ja','th'} name of the fish a named bait helps against, or None."""
    # The summary feeds the catalogue search, so it carries no counts: searching an item ID must not match it.
    if has_sinker:
        summary = loc(
            "Fish on its list take this bait on a float rig, and the bottom fish among them on a sinker rig. Put your float on the tile the fish is on and it bites within seconds.",
            "リストの魚がウキ仕掛けで、その中の底の魚がオモリ仕掛けでこのエサを食べる。ウキを魚と同じマスに置けば、数秒以内に食いつく。",
            "ปลาในรายชื่อกินเหยื่อนี้ในชุดทุ่น และปลาหน้าดินในรายชื่อกินในชุดตะกั่ว วางทุ่นให้ตรงช่องที่ปลาอยู่ ปลากินภายในไม่กี่วินาที",
        )
    else:
        summary = loc(
            "Fish on its list take this bait on a float rig; it does not work on a sinker rig. Put your float on the tile the fish is on and it bites within seconds.",
            "リストの魚がウキ仕掛けでこのエサを食べる。オモリ仕掛けでは使えない。ウキを魚と同じマスに置けば、数秒以内に食いつく。",
            "ปลาในรายชื่อกินเหยื่อนี้ในชุดทุ่น (ใช้กับชุดตะกั่วไม่ได้) วางทุ่นให้ตรงช่องที่ปลาอยู่ ปลากินภายในไม่กี่วินาที",
        )
    facts = loc_lists(
        [
            "If the bait is on the fish's list and the float sits on the fish's tile, it bites within seconds: about 2 seconds on a float rig, about 10 seconds on a sinker rig.",
            "A fish that ignores you is on another tile or does not list this bait. Move the cast; do not swap the bait.",
            "Time of day, weather, rod, hook and HP do not change biting.",
        ],
        [
            "エサが魚のリストにあり、ウキが魚と同じマスにあれば数秒以内に食いつく。ウキ仕掛けは約2秒、オモリ仕掛けは約10秒。",
            "反応しない魚は別のマスにいるか、このエサがリストにない。エサではなく投げる位置を変える。",
            "時間帯・天気・竿・ハリ・HPは食いつきに影響しない。",
        ],
        [
            "เหยื่ออยู่ในรายชื่อของปลาและทุ่นอยู่ช่องเดียวกับปลา ปลากินภายในไม่กี่วินาที: ชุดทุ่นราว 2 วินาที ชุดตะกั่วราว 10 วินาที",
            "ปลาที่ไม่สนใจเหยื่ออยู่คนละช่อง หรือเหยื่อนี้ไม่อยู่ในรายชื่อของปลานั้น ให้ขยับจุดปล่อยทุ่น ไม่ต้องเปลี่ยนเหยื่อ",
            "เวลา อากาศ คัน เบ็ด และ HP ไม่มีผลต่อการกิน",
        ],
    )
    if has_sinker:
        facts["en"].append("The sinker rig only works on bottom fish; the sinker list on this card shows which.")
        facts["ja"].append("オモリ仕掛けは底の魚だけ。このカードのオモリ用リストが対象。")
        facts["th"].append("ชุดตะกั่วกินได้เฉพาะปลาหน้าดิน ดูรายชื่อชุดตะกั่วบนการ์ดนี้")
    if matched_fish:
        facts["en"].append(
            f"Named bait: against {matched_fish['en']} the fight starts with half the mistakes counted, like a hook named for that fish. The two do not stack."
        )
        facts["ja"].append(
            f"魚名つきのエサ：{matched_fish['ja']}とのファイトでは、その魚名つきのハリと同じく開始値が半分になる。ハリとは重ならない。"
        )
        facts["th"].append(
            f"เหยื่อระบุชื่อปลา: ตอนสู้กับ{matched_fish['th']} ค่าเริ่มสู้ลดลงครึ่งหนึ่งเหมือนตะขอที่ระบุชื่อปลานี้ แต่ไม่ซ้อนกับตะขอ"
        )
    scope = loc(
        "These fish take this bait once your float is on their tile. Float and sinker rigs have different lists.",
        "ここに出る魚は、ウキが同じマスにあればこのエサを食べる。ウキとオモリでは対象が異なる。",
        "ปลาเหล่านี้กินเหยื่อนี้เมื่อทุ่นอยู่ช่องเดียวกับปลา ชุดทุ่นกับชุดตะกั่วมีรายชื่อไม่เท่ากัน",
    )
    notes = loc_lists(
        [
            "ROM audit 2026-10-07, tested on an emulator: a bait on the fish's list bit in every float test (79 of 79) and sinker test (75 of 75) once the float was on the fish's tile; baits off the list never did. A float rig waits 128 frames after landing and a sinker rig 600 frames and also needs the fish's bottom-fish flag. Each fish is checked every 32 frames with a chance set by the fish. Time, weather, rod, hook, HP, cast distance and fish size are never read.",
        ],
        [
            "ROM監査2026-10-07（エミュレータで検証）：リストにあるエサは、ウキが魚と同じマスにあればウキ79/79回、オモリ75/75回すべて食いついた。リスト外のエサでは一度も食いつかない。ウキは着水後128フレーム、オモリは600フレーム待ち、オモリでは魚の底魚フラグも必要。魚は32フレームごとに判定され、確率は魚ごとに決まる。時間・天気・竿・ハリ・HP・投げた距離・魚のサイズは参照されない。",
        ],
        [
            "ตรวจ ROM ปี 2026-10-07 และทดสอบบนอีมูเลเตอร์: เหยื่อที่อยู่ในรายชื่อของปลากินครบทุกครั้งเมื่อทุ่นอยู่ช่องเดียวกับปลา (ชุดทุ่น 79/79 ชุดตะกั่ว 75/75) เหยื่อนอกรายชื่อไม่เคยถูกกิน ชุดทุ่นรอ 128 เฟรมหลังทุ่นตกน้ำ ชุดตะกั่วรอ 600 เฟรมและปลาต้องมีแฟล็กปลาหน้าดิน ปลาแต่ละตัวถูกตรวจทุก 32 เฟรม โอกาสต่อรอบตามค่าของปลา ไม่อ่านเวลา อากาศ คัน เบ็ด HP ระยะที่ปล่อย หรือขนาดปลา",
        ],
    )
    return summary, facts, scope, notes


def lure_copy(selector):
    summary = loc(
        "Fish on its list chase this lure. Keep tapping A or B while it is in the water, then press A once when the fish is level with the lure to hook it.",
        "リストの魚がこのルアーを追う。ルアーが水中にある間はAかBを連打し、魚がルアーと同じ高さに来たらAを1回押してかける。",
        "ปลาในรายชื่อว่ายตามลัวร์นี้ กด A หรือ B ถี่ ๆ ตอนลัวร์อยู่ในน้ำ แล้วกด A ครั้งเดียวเมื่อปลาอยู่ระดับเดียวกับลัวร์เพื่อเกี่ยวปลา",
    )
    facts = loc_lists(
        [
            "The lure's fish list decides which fish chase it, and the fish must be on the lure's tile. Without A or B presses nobody follows; holding B reels the lure in.",
            "Two lures cover all 38 lure fish: lure 17 or lure 2E, plus lure 23.",
            SELECTOR_FIGHT[selector]["en"],
            "Time of day, weather, rod and HP do not change who follows the lure.",
        ],
        [
            "ルアーのリストが、どの魚が追うかを決める。魚はルアーと同じマスにいる必要がある。AもBも押さなければ追わず、Bを押し続けるとルアーが巻き戻る。",
            "ルアー2つで全38種をカバーできる：ルアー17またはルアー2E、＋ルアー23。",
            SELECTOR_FIGHT[selector]["ja"],
            "時間帯・天気・竿・HPは、魚が追うかどうかに影響しない。",
        ],
        [
            "รายชื่อปลาของลัวร์ตัดสินว่าปลาตัวไหนว่ายตาม ปลาต้องอยู่ช่องเดียวกับลัวร์ ถ้าไม่กด A หรือ B เลยจะไม่มีปลาตาม และการค้างปุ่ม B คือม้วนลัวร์เข้ามา",
            "ลัวร์สองชิ้นก็ครอบคลุมปลาลัวร์ทั้ง 38 ชนิด: ลัวร์ 17 หรือลัวร์ 2E คู่กับลัวร์ 23",
            SELECTOR_FIGHT[selector]["th"],
            "เวลา อากาศ คัน และ HP ไม่มีผลต่อการที่ปลาว่ายตามลัวร์",
        ],
    )
    scope = loc(
        "These fish chase this lure when they are on its tile and you keep working it with A or B.",
        "ここに出る魚は、ルアーと同じマスにいて、AかBで操作し続ければこのルアーを追う。",
        "ปลาเหล่านี้ว่ายตามลัวร์ชิ้นนี้เมื่ออยู่ช่องเดียวกับลัวร์และคุณกด A หรือ B ต่อเนื่อง",
    )
    notes = loc_lists(
        [
            "ROM audit 2026-10-07, tested on an emulator: across 81 lures and 6 fish, every fish on the lure's list was attracted (245 of 245) and none off the list (0 of 241); one tile off, or no A/B press, gave no attraction. The lure waits 48 frames after landing. The chase and strike that follow are the lure fight described in docs/fight-model.md.",
        ],
        [
            "ROM監査2026-10-07（エミュレータで検証）：ルアー81種×魚6種で、リストにある魚はすべて寄った（245/245）。リスト外は0/241。1マスずれるか、A/Bを押さないと寄らない。ルアーは着水後48フレーム待つ。その後の追尾と食い込みは docs/fight-model.md のルアーファイト。",
        ],
        [
            "ตรวจ ROM ปี 2026-10-07 และทดสอบบนอีมูเลเตอร์: ลัวร์ 81 ชิ้น × ปลา 6 ชนิด ปลาที่อยู่ในรายชื่อว่ายตามครบ (245/245) ปลานอกรายชื่อไม่ตามเลย (0/241) ถ้าคลาดไปหนึ่งช่องหรือไม่กด A/B ปลาไม่ตาม ลัวร์รอ 48 เฟรมหลังตกน้ำ ขั้นไล่ตามและฟาดที่ตามมาคือการสู้แบบลัวร์ใน docs/fight-model.md",
        ],
    )
    return summary, facts, scope, notes


def lure_special_scope(fish_names):
    """A lure that names a fish (12 black bass, 21 namazu, 51 akame) does not change a real fight."""
    return loc(
        f"This lure names {fish_names['en']}. It changes nothing in a real fight: that fish is over 35 cm and the size class already helps it.",
        f"このルアーは{fish_names['ja']}の名前を持つが、実際のファイトは変わらない。この魚は35cm超で、サイズ区分がすでに有利に働く。",
        f"ลัวร์นี้ระบุชื่อ{fish_names['th']} แต่ไม่เปลี่ยนผลตอนสู้จริง เพราะปลานี้ใหญ่กว่า 35 ซม. และกลุ่มขนาดช่วยอยู่แล้ว",
    )
