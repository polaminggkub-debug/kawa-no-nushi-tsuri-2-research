#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Render a three-language guide from the original-ROM lure gate extraction."""
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / 'data/lure-coverage.json').read_text())
COPY = {
 'th': {
  'title': 'ชุดเหยื่อจากโค้ดจริง — ตกปลาทาโร่ 2',
  'intro': 'ลัวร์ 2 รหัสครอบคลุมเงื่อนไขรับเหยื่อของปลาและสัตว์น้ำ 38 โปรไฟล์ที่ลัวร์ชนิดใดชนิดหนึ่งผ่านได้ใน ROM ญี่ปุ่นต้นฉบับ',
  'scope': 'นี่คือเงื่อนไขก่อนติดเบ็ด ยังต้องวางเหยื่อตรงตำแหน่งปลา กดปุ่มถูกจังหวะ และดึงขึ้นสำเร็จ จำนวน 38 รวมสัตว์น้ำ เช่น กบและเต่า ไม่ใช่จำนวนปลาทั้งเกมหรือคำรับประกันว่าจบเกมด้วยชุดนี้',
  'pack': 'ชุดที่ใช้เหยื่อน้อยที่สุด',
  'packnote': 'เลือกหนึ่งรหัสจาก 17 / 18 / 2E / 2F / 30 / 31 แล้วจับคู่กับ 23 หรือ 24 ชุดราคาตารางต่ำที่สุดคือ 17 + 23 = 50 เยน ส่วน 2E + 23 = 55 เยน ราคานี้ยังไม่ยืนยันว่าร้านไหนขาย',
  'names': ['จมน้ำ — Sinking', 'ยางหนอน — Soft worm', 'สปูน — Spoon (ตัวเลือกแทน 17)'],
  'warning': 'ID เป็นเลขฐานสิบหก ชื่อซ้ำไม่ได้แปลว่าใช้แทนกันได้: สปูน 2E–31 อยู่กลุ่มพิเศษ แต่สปูนรหัสอื่นอยู่กลุ่มทั่วไป เหยื่อกลุ่มทั่วไป 73 รหัสไม่เพิ่มชนิดที่ผ่านเงื่อนไขนอกชุดสองกลุ่มนี้ แต่ยังอาจต่างกันด้านการเคลื่อนไหวหรือการดึงปลา',
  'rods': 'คันเบ็ด: แก้ความหมายค่าที่เคยตีความผิด',
  'rodnote': 'ค่า +2 ควบคุมงบตัวนับในช่วงเล็ง/ปล่อยเหยื่อ จากการตามโค้ดการขยับเป้าและปล่อยปุ่ม B จึงไม่ควรเรียกพลังสู้ปลา คันลัวร์/ตีเหยื่อปรับค่านี้ตาม HP เมื่อ HP ต่ำกว่า 100 ค่า +3 เป็นขอบเขตระยะภายในที่ใช้ในแขนงการเสียปลา/อุปกรณ์ ส่วน +7 เปลี่ยนสถานะเริ่มสู้ปลา ยังจัดอันดับคันที่จับสำเร็จดีที่สุดไม่ได้',
  'table': 'ตารางรับเหยื่อรายโปรไฟล์',
  'tablenote': '✓ = ผ่านเฉพาะการตรวจ mask; — = ไม่ผ่าน ใช้ชื่อญี่ปุ่นที่ถอดจากข้อความใน ROM เพื่อไม่เดาชื่อแปล กรองด้วย ID หรือชื่อญี่ปุ่นได้',
  'search': 'ค้นชื่อญี่ปุ่น หรือ ID', 'fish': 'ID / ชื่อใน ROM', 'yes': 'ผ่าน', 'no': 'ไม่ผ่าน',
  'evidence': 'หลักฐานและวิธีทำซ้ำ', 'unknown': 'ร้านที่ขายเหยื่อชุดนี้และอัตราจับสำเร็จจากการทดลองเทียบยังไม่ยืนยัน ตารางร้านปัจจุบันยืนยันเพียงคัน 8 รายการในเมนูที่มีหัวข้อ 渓流',
  'catalogue': 'กลับคลังไอเท็ม',
 },
 'en': {
  'title': 'An equipment shortlist from ROM code — Kawa no Nushi Tsuri 2',
  'intro': 'Two lure IDs cover the hook-acceptance gate for all 38 fish/creature profiles that any lure can pass in the original Japanese ROM.',
  'scope': 'This is a gate before hooking. Lure position, timing, input and landing the catch still matter. The 38 includes creatures such as frogs and turtles; it is not every fish in the game or a guaranteed completion kit.',
  'pack': 'The minimum lure set',
  'packnote': 'Pick one of 17 / 18 / 2E / 2F / 30 / 31 and pair it with 23 or 24. The cheapest table-price pair is 17 + 23 = ¥50; 2E + 23 = ¥55. Which shop sells them remains unconfirmed.',
  'names': ['Sinking', 'Soft worm', 'Spoon (alternative to 17)'],
  'warning': 'IDs are hexadecimal. Repeated names do not imply interchangeability: Spoon 2E–31 has the special mask; other Spoon IDs use the ordinary mask. The 73 ordinary-mask lures add no exclusive compatible profile beyond these two groups, but can still differ in movement or fighting behavior.',
  'rods': 'Rods: correcting an earlier interpretation',
  'rodnote': 'Byte +2 controls a counter budget in the aiming/release phase, traced through target movement and release of B. It should not be called fight power. Lure/casting styles scale it down below 100 HP. Byte +3 supplies an internal distance boundary used in a fish/tackle-loss branch. Byte +7 changes initial fight state. A best rod by measured landing success has not been established.',
  'table': 'Acceptance by profile',
  'tablenote': '✓ means this mask check passes; — means it does not. Japanese names are decoded from the ROM, without guessed translations. Filter by ID or Japanese name.',
  'search': 'Japanese name or ID', 'fish': 'ID / ROM name', 'yes': 'passes', 'no': 'fails',
  'evidence': 'Evidence and reproduction', 'unknown': 'Shop availability of the minimal lure pair and matched landing-rate trials remain unconfirmed. The shop record currently establishes only eight rod offers in a menu headed 渓流.',
  'catalogue': 'Item catalogue',
 },
 'ja': {
  'title': 'ROMコードに基づく装備候補 — 川のぬし釣り2',
  'intro': '日本版ROMでは、ルアーで針掛かり判定を通過できる魚・水生生物の38プロフィールを、ルアー2個で網羅できる。',
  'scope': '針掛かり前の条件であり、位置・タイミング・入力・取り込みも必要。38にはカエルやカメも含まれる。全魚種の数や、この装備で必ずクリアできるという意味ではない。',
  'pack': '最少のルアー構成',
  'packnote': '17 / 18 / 2E / 2F / 30 / 31から1個と、23または24を組み合わせる。ROM価格欄で最安は17 + 23 = 50円。2E + 23 = 55円。販売店舗は未確認。',
  'names': ['シンキング', 'ソフト・ワーム', 'スプーン（17の代替候補）'],
  'warning': 'IDは16進数。同じ表示名でも互換とは限らない。スプーン2E–31は特別なマスク、それ以外のスプーンは一般マスク。一般マスクの73個はこの2系統にない対応種を追加しないが、動作やファイト処理は異なる可能性がある。',
  'rods': '竿：以前の解釈を訂正',
  'rodnote': '+2は照準移動とBボタン解放に続く投げ・照準段階のカウンター値。ファイトの強さとは呼べない。ルアー・投げ釣りではHP100未満で値が減る。+3は魚・仕掛けを失う分岐に使われる内部距離の境界。+7はファイト初期状態を変える。取り込み成功率で最良の竿はまだ確定していない。',
  'table': 'プロフィール別の適合判定',
  'tablenote': '✓はこのマスク判定を通過、—は不適合。魚名はROMの文字列から復号した日本語名。ID・日本語名で絞り込める。',
  'search': '日本語名・ID', 'fish': 'ID / ROM名', 'yes': '適合', 'no': '不適合',
  'evidence': '根拠と再現方法', 'unknown': '最少ルアー構成の販売店と、同条件での取り込み成功率比較は未確認。店舗記録で確認したのは「渓流」と表示されたメニューの竿8件のみ。',
  'catalogue': 'アイテム一覧',
 }
}
for lang, text in {
 'th': 'ฟลาย: บอดี้ธรรมดา 64 รหัสถูกแปลงเป็นเหยื่อ 3 รหัส แต่มี mask เพียง 2 กลุ่ม กลุ่ม 0020 ผ่านการตรวจ mask ของ 33 โปรไฟล์ ส่วนกลุ่ม 0004 ผ่าน 17 ซึ่งเป็นส่วนหนึ่งของ 33 อยู่แล้ว บอดี้กลุ่ม 0020 ได้แก่: 01–08 / 2B–33 / 4B–4F / 60–65 ปีกและหางไม่เปลี่ยน mask ของบอดี้ แต่มีเงื่อนไขเพิ่ม: ถ้า ID บอดี้ AND 3 ตรงกับ 7F:1E86 หรือ ID ปีก AND 3 ตรงกับ 7F:1E88 เกมตั้ง 1FA7 เป็น 0 ซึ่งปิดทางติดเบ็ดนี้ หางไม่ถูกอ่านในตัวกรองนี้ จึงยังแนะนำว่าพกฟลายตัวเดียวพอไม่ได้ และนี่ไม่ใช่อัตรากินเหยื่อ',
 'en': 'Fly bodies: 64 ordinary body IDs normalize to three bait IDs but only two masks. Mask 0020 passes 33 profile masks; mask 0004 passes 17, all already in those 33. The 0020 bodies are IDs 01–08 / 2B–33 / 4B–4F / 60–65. Wings and tails do not change the body mask. However, BODY ID & 3 matching 7F:1E86, or WING ID & 3 matching 7F:1E88, sets 1FA7 to zero and blocks this fly-hook path. TAIL is not read by this filter. The actual fly-hook path also ANDs with 1FA7. A one-fly loadout is therefore not established by this profile-only table; this is not a bite-rate result.',
 'ja': 'フライ：通常ボディ64件はエサ3IDに変換されるが、判定マスクは2種類。0020は33プロフィール、0004はその部分集合の17件に適合。0020のボディID：01–08 / 2B–33 / 4B–4F / 60–65。ウイングとテールはボディのマスクを変更しない。ただしBODY ID & 3が7F:1E86と一致、またはWING ID & 3が7F:1E88と一致すると1FA7が0になり、この針掛かり処理を阻止する。このフィルターはTAILを読まない。したがってフライ1個で十分とはまだ言えず、ヒット率を示す結果でもない。'
}.items():
 COPY[lang]['flynote'] = text

CSS = '''body{margin:0;background:#f5f2e8;color:#183b34;font:18px/1.7 system-ui,sans-serif}main{max-width:1000px;margin:auto;padding:28px 20px}h1{font-size:clamp(28px,5vw,44px);line-height:1.3}h2{margin-top:42px}nav{display:flex;gap:22px;flex-wrap:wrap}a{color:#086d56}p{max-width:85ch}.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.card{background:white;border:1px solid #b8cbb7;border-radius:12px;padding:20px;text-align:center}.card img{width:192px;height:224px;max-width:100%;object-fit:contain;image-rendering:pixelated}.card strong{display:block}.note{background:#e7efdd;border-left:5px solid #47704c;padding:18px}.scroll{overflow:auto}table{border-collapse:collapse;width:100%;background:white}th,td{padding:12px;border-bottom:1px solid #ccd8ca;text-align:left}th{position:sticky;top:0;background:#e7efdd}.yes{font-weight:bold;color:#006143}.no{color:#777}input{font:inherit;padding:12px;width:min(95%,420px);margin:15px 0}code{font-size:.9em}footer{margin:36px 0;font-size:15px}@media(max-width:700px){.cards{grid-template-columns:1fr}.card img{width:256px}th,td{padding:9px;font-size:16px}}'''

def build(lang):
    c = COPY[lang]
    e = html.escape
    suffix = '' if lang == 'en' else '.' + lang
    cards = ''.join(f'<article class="card"><img src="../catalogue/sprites/lures-{int(i,16):03d}.png" alt="{e(n)}"><strong>{e(n)}</strong><div>ID <code>{i}</code> · ¥{price}</div></article>' for i, n, price in zip(['17','23','2E'],c['names'],[20,30,25]))
    rows = ''
    for fish in DATA['fish']:
        if fish['id_hex'] == '43':
            continue
        cells = ''
        for mask in [0x0200,0x0040,0x0400,0x0020,0x0004]:
            yes = bool(int(fish['acceptance_mask_hex'],16) & mask)
            cells += f'<td class="{"yes" if yes else "no"}" aria-label="{c["yes" if yes else "no"]}">{"✓" if yes else "—"}</td>'
        rows += f'<tr><td><code>{fish["id_hex"]}</code> {e(fish["name_ja"])}</td>{cells}</tr>\n'
    links = [('fish-acceptance-research.md','Bait / fly acceptance'),('rod-response-research.md','Rod consumers'),('lure-response-research.md','Lure fight setup'),('shop-inventory-research.md','Observed shop inventory')]
    evidence = ''.join(f'<li><a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/{name}">{label}</a></li>' for name,label in links)
    alternates = ''.join(f'<link rel="alternate" hreflang="{l}" href="https://polaminggkub-debug.github.io/kawa-no-nushi-tsuri-2-research/research/index{sf}.html">' for l, sf in [('en',''),('ja','.ja'),('th','.th')])
    text = f'''<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{e(c['title'])}</title><meta name="description" content="{e(c['intro'])}"><link rel="canonical" href="https://polaminggkub-debug.github.io/kawa-no-nushi-tsuri-2-research/research/index{suffix}.html">{alternates}<style>{CSS}</style></head><body><main>
<nav><a href="index.html">English</a><a href="index.ja.html">日本語</a><a href="index.th.html">ไทย</a><a href="../catalogue/index{suffix}.html">{c['catalogue']}</a></nav>
<h1>{c['title']}</h1><p><strong>{c['intro']}</strong></p><p class="note">{c['scope']}</p>
<h2>{c['pack']}</h2><p>{c['packnote']}</p><div class="cards">{cards}</div><p>{c['warning']}</p>
<p class="note">{c['flynote']}</p><h2>{c['rods']}</h2><p>{c['rodnote']}</p><h2>{c['table']}</h2><p>{c['tablenote']}</p><input id="filter" aria-label="{c['search']}" placeholder="{c['search']}">
<div class="scroll"><table><thead><tr><th>{c['fish']}</th><th>17 / 18<br>2E–31</th><th>23 / 24</th><th>0400<br>73 IDs</th><th>Fly<br>0020</th><th>Fly<br>0004</th></tr></thead><tbody>{rows}</tbody></table></div>
<h2>{c['evidence']}</h2><p>{c['unknown']}</p><ul>{evidence}<li><a href="../data/lure-coverage.json">Lure coverage JSON</a> · <a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/scripts/extract_lure_coverage.py">Extractor</a></li></ul>
<p><code>04:EBFD: (lure +6/+7) AND (fish +0F/+10) ≠ 0</code></p><footer>Original Japanese ROM SHA-1: <code>{DATA['rom_sha1']}</code><br>2026-10-04 · ROM-derived compatibility; no ROM included. ID43 is a zero-field placeholder and is omitted.</footer>
</main><script>document.getElementById('filter').addEventListener('input',e=>{{const q=e.target.value.toLocaleLowerCase();document.querySelectorAll('tbody tr').forEach(r=>r.hidden=!r.textContent.toLocaleLowerCase().includes(q))}})</script></body></html>'''
    (ROOT / 'research' / f'index{suffix}.html').write_text(text)

if __name__ == '__main__':
    (ROOT / 'research').mkdir(exist_ok=True)
    for lang in COPY:
        build(lang)
    print('Built equipment guides in English, Japanese and Thai.')
