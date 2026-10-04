#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Render three player-first equipment guides from original-ROM research."""
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / 'data/lure-coverage.json').read_text())
CATALOGUE = json.loads((ROOT / 'catalogue/gallery-data.json').read_text())
SHOP = json.loads((ROOT / 'data/shop-stock-rom.json').read_text())
ITEMS = {(item.get('category'), item.get('id')): item for item in CATALOGUE['items']}

COPY = {
 'th': {
  'title': 'เลือกเหยื่อและคันเบ็ดจากข้อมูล ROM — ตกปลาทาโร่ 2',
  'intro': 'สรุปสิ่งที่ผู้เล่นเอาไปใช้ได้: ควรพกลัวร์อะไร ซื้อคันไหน และต้องเติม HP ก่อนตกเมื่อไร',
  'scope': 'ชุดเหยื่อด้านล่างผ่านการตรวจความเข้ากันของลัวร์กับโปรไฟล์ปลา/สัตว์น้ำทั้ง 38 โปรไฟล์ที่มีลัวร์อย่างน้อยหนึ่งชนิดผ่านได้ใน ROM ญี่ปุ่นต้นฉบับ การผ่านด่านนี้ยังไม่รับประกันว่าปลาจะกิน ติดเบ็ด หรือดึงขึ้นสำเร็จ',
  'kit': 'เริ่มต้นด้วยชุดนี้',
  'starterTitle': 'สปูน 2E + ยางหนอน 23 · ¥55',
  'starter': 'ถ้าเริ่มที่พื้นที่ 1 ซื้อสปูน 2E กับยางหนอน 23 รวม ¥55 พกสองชิ้นนี้เพื่อให้ผ่านการตรวจชนิดปลาได้ครบทั้ง 38 โปรไฟล์ที่ลัวร์มีสิทธิ์ผ่าน นี่คือความครอบคลุมของเงื่อนไขในโค้ด ไม่ใช่อัตรากินเหยื่อหรือชุดที่รับประกันจับได้',
  'cheapest': 'ถ้าเริ่มซื้อใหม่ในพื้นที่ 4: จมน้ำ 17 + ยางหนอน 23 รวม ¥50 เป็นคู่ราคาถูกที่สุดที่ผ่านครบ 38 โปรไฟล์ ร้านพื้นที่ 4 มีขายทั้งคู่; จมน้ำ 17 มีขายพื้นที่ 2–5 และยางหนอน 23 มีขายพื้นที่ 1 กับ 4 ถ้าซื้อชุดพื้นที่ 1 ไปแล้ว ใช้ต่อได้เลย ไม่ต้องซื้อจมน้ำ 17 เพิ่มเพื่อประหยัด ¥5 เพราะความครอบคลุมเท่ากัน',
  'kitItems': {'17':'จมน้ำ', '23':'ยางหนอน', '2E':'สปูน'},
  'shop': 'ซื้อได้ที่',
  'rodTitle': 'แล้วคันไหนควรซื้อ?',
  'rodIntro': 'เลือกตามวิธีตกและสิ่งที่อยากให้ดีขึ้น: เวลาขยับช่องเป้าก่อนเกมตรวจจุดตก หรือระยะเผื่อก่อนเส้นทางหนีเฉพาะที่ทำให้อุปกรณ์หาย ค่าเหล่านี้ไม่ได้บอกโอกาสปลากินหรือจับขึ้นฝั่ง',
  'hpTitle': 'ทิปก่อนตกแบบคันเหวี่ยงหรือคันลัวร์',
  'hpTip': 'เติม HP ให้ถึง 100 ก่อนตกถ้าทำได้: คันเหวี่ยงและคันลัวร์มีเวลาปรับช่องเป้าสั้นลงเมื่อ HP ต่ำกว่า 100 ผลที่ยืนยันได้คือคืนเวลาสำหรับเล็ง ยังใช้ยืนยันโบนัสอัตรากินเหยื่อหรือพลังจับปลาไม่ได้',
  'rodGroups': [
   {'title':'สายทุ่น / ปลาอายุ','items':[
    {'id':'14','why':'ถ้าอยากได้เวลาปรับเป้านานที่สุดในกลุ่มนี้ เลือกคันนี้ ราคาเท่าคันอายุรุ่นเดิม ID 07 แต่ค่าที่ ROM ใช้กับเวลาปรับเป้าและขอบเขตก่อนเส้นทางเสียอุปกรณ์สูงกว่า และมีขายพื้นที่ 3, 4, 6'},
    {'id':'08','why':'ถ้าเป้าหมายคือเพิ่มระยะเผื่อก่อนเส้นทางเสียเบ็ดเฉพาะนี้ คันปลาคาร์ปเป็นหนึ่งในคันที่ถึงขอบเขตสูงสุดของกลุ่ม ขายในพื้นที่ 5'},
    {'id':'15','why':'คันนี้มีขอบเขตสูงสุดแบบเดียวกับ ID 08 และให้เวลาปรับเป้ามากกว่า แต่ราคาแพงกว่า ¥500; ขายในพื้นที่ 4–6'}]},
   {'title':'สายเหวี่ยง','items':[
    {'id':'10','why':'ถ้าต้องการเวลาปรับเป้าและขอบเขตก่อนเส้นทางเสียอุปกรณ์สูงสุดในกลุ่ม เลือกคันสองมือ ราคา ¥1,500 ขายในร้านคันเบ็ดพิเศษพื้นที่ 6 การเทียบนี้ไม่พิสูจน์ว่าจับปลาได้มากขึ้น'}]},
   {'title':'สายลัวร์','items':[
    {'id':'0D','why':'ตัวเลือกที่มีเวลาปรับเป้าและขอบเขตก่อนเส้นทางเสียอุปกรณ์สูงสุดในกลุ่ม ราคา ¥650 ขายในร้านคันเบ็ดพิเศษพื้นที่ 4 แพงกว่าคันลัวร์ใหญ่ ID 0C แค่ ¥50; ถ้าซื้อเพื่อสองประโยชน์นี้ ราคาเพิ่มมีเหตุผลจากค่าที่แกะได้ แต่ยังไม่พิสูจน์ว่าเพิ่มโอกาสจับปลา; ถ้ามี 0C แล้ว ซื้อ 0D ต้องจ่ายเต็ม ¥650'}]},
   {'title':'สายฟลาย','items':[
    {'id':'13','why':'ให้เวลาปรับเป้าและขอบเขตก่อนเส้นทางเสียอุปกรณ์สูงสุดในกลุ่ม ราคา ¥450 ขายในพื้นที่ 1–4 แพงกว่ารุ่นกลาง ID 12 แค่ ¥50 เมื่ออยากได้สองค่านี้ นี่คือตัวเลือกตามหลักฐาน ROM ไม่ใช่อันดับจับสำเร็จ; ถ้ามีคันกลางแล้ว ต้องจ่ายราคาเต็ม ¥450 ไม่ใช่ส่วนต่าง ¥50'}]}
  ],
  'technical': 'หลักฐานเทคนิคและตารางเต็ม',
  'technicalLead': 'ส่วนนี้เก็บตารางและรายละเอียดที่ใช้ตรวจสอบข้อสรุป ตัวเลขตัวนับภายใน ROM ไม่ใช่วินาที เมตร หรือคะแนนจับปลา',
  'flyTitle': 'ตัวกรองของฟลาย',
  'flynote': 'บอดี้ฟลายธรรมดา 64 ID ถูกแปลงเป็นเหยื่อ 3 ID แต่มี mask เพียง 2 กลุ่ม: 0020 ผ่าน mask ของ 33 โปรไฟล์ และ 0004 ผ่าน 17 โปรไฟล์ซึ่งอยู่ในกลุ่ม 33 อยู่แล้ว บอดี้กลุ่ม 0020 คือ 01–08 / 2B–33 / 4B–4F / 60–65; ปีกกับหางไม่เปลี่ยน mask ของบอดี้ เงื่อนไขเสริมจะปิดทางติดเบ็ดเมื่อ (BODY ID AND 3) ตรงกับ 7F:1E86 หรือ (WING ID AND 3) ตรงกับ 7F:1E88; ตัวกรองนี้ไม่อ่านหาง จึงยังยืนยันไม่ได้ว่าฟลายชิ้นเดียวครอบคลุมทุกตัวหรือมีอัตรากินสูงกว่า',
  'rodTechTitle':'คันเบ็ด: สิ่งที่ค่าวัตถุดิบใช้ทำจริง',
  'rodTech':'ค่า +2 เป็นขีดจำกัดตัวนับของช่วงเล็ง: ระหว่างกดปุ่มทิศทาง เป้าจะขยับ; ปล่อยปุ่มตกปลาหรือครบขีดจำกัดแล้วเกมตรวจช่องนั้น ค่า +3 กลายเป็นขอบเขตตำแหน่งปลาในเส้นทางเสียเบ็ด/ลัวร์/ฟลายเฉพาะทางหนึ่งเท่านั้น ค่าสูงขึ้นทำให้ปลาไปได้ไกลขึ้นก่อนเข้าเส้นทางนี้ แต่เส้นทางหนีอื่นยังมีอยู่ ค่า +7 เปลี่ยนสถานะเริ่มสู้ปลา คำอธิบายนี้ไม่ใช่คะแนนจับสำเร็จ',
  'namedLureTitle':'ลัวร์ที่มีแขนงตอบสนองต่อปลาบางชนิด',
  'namedLure':'ID 12 ตรวจ Black bass, ID 21 ตรวจ Namazu, ID 51 ตรวจ Akame; เมื่อ ID ตรง เกมหารค่าตอบสนองเริ่มต้นลงครึ่งหนึ่งและข้ามการปรับตามขนาดในแขนงของลัวร์นั้น คันยังปรับค่าต่อภายหลัง โค้ดไม่ได้ยืนยันว่าปลากินง่ายขึ้นหรือตกขึ้นง่ายขึ้น',
  'table':'การผ่านเงื่อนไขรายโปรไฟล์',
  'rodEvidenceTitle':'ตารางระเบียนคันเบ็ดทั้งหมด',
  'rodHeaders':['รูปแบบ','ID / ชื่อ','ราคา','ร้านที่ตรวจพบ','+2 เวลาค้างเล็ง','+3 ขอบเขต ×336','ID ปลาเฉพาะ','แขนงตอบสนอง','ออฟเซ็ต','ไบต์ดิบ'],
  'styleNames':{'1':'ทุ่น / อายุ','2':'เหวี่ยง','4':'ลัวร์','8':'ฟลาย'},
  'tablenote':'✓ หมายถึงผ่านเฉพาะการตรวจ mask ของเหยื่อคอลัมน์นั้น; — หมายถึงไม่ผ่าน ชื่อญี่ปุ่นถอดจากข้อความ ROM กรองด้วย ID หรือชื่อญี่ปุ่นได้',
  'search':'ค้นชื่อญี่ปุ่น หรือ ID', 'fish':'ID / ชื่อใน ROM', 'yes':'ผ่าน', 'no':'ไม่ผ่าน',
  'evidence':'เอกสารวิจัยจาก ROM',
  'links': [('fish-acceptance-research.md','เงื่อนไขรับเหยื่อและวิธีตรวจ'),('rod-lure-practical-research.md','ผลของคันเบ็ดและลัวร์ระหว่างเล่น'),('rod-response-research.md','ตารางและเส้นทางใช้ค่าคันเบ็ด'),('lure-response-research.md','แขนงตอบสนองของลัวร์'),('shop-stock-research.md','ร้านค้าและของที่ขายครบหกพื้นที่'),('fly-practical-research.md','บอดี้ ปีก หาง และฟลายสำเร็จรูป')],
  'catalogue':'กลับคลังไอเท็ม', 'area':'พื้นที่', 'special':'ร้านคันเบ็ดพิเศษ'
 },
 'en': {
  'title': 'Choose lures and rods from ROM research — Kawa no Nushi Tsuri 2',
  'intro': 'Player-ready answers: which lures to carry, which rod to buy, and when to heal before fishing.',
  'scope': 'The lure sets below pass the original Japanese ROM’s lure-compatibility check for all 38 fish/creature profiles that at least one lure can pass. Passing this gate does not guarantee a bite, hook-up, or landing.',
  'kit': 'A practical lure kit',
  'starterTitle': 'Spoon 2E + Soft Worm 23 · ¥55',
  'starter': 'Starting in Area 1? Buy Spoon 2E and Soft Worm 23 for ¥55 total. Carry both to cover the lure compatibility check for all 38 profiles any lure can pass. This is code-level coverage, not a bite rate or a guaranteed catch.',
  'cheapest': 'Starting from scratch in Area 4? Sinking 17 + Soft Worm 23 costs ¥50, the cheapest pair with the same 38-profile coverage. Both are sold in Area 4; Sinking 17 is sold in Areas 2–5 and Soft Worm 23 in Areas 1 and 4. If you already bought the Area 1 pair, keep using it; do not buy Sinking later just to save ¥5 on a kit that covers the same profiles.',
  'kitItems': {'17':'Sinking', '23':'Soft Worm', '2E':'Spoon'},
  'shop': 'Buy in',
  'rodTitle': 'Which rod should I buy?',
  'rodIntro': 'Choose by fishing style and the handling benefit you want: more time to move the target before the game checks the spot, or more room before one specific escape branch takes your tackle. These values do not measure bite or landing chance.',
  'hpTitle': 'Before using a casting or lure rod',
  'hpTip': 'Heal to 100 HP first when you can. Casting and lure rods give you less time to adjust the target below 100 HP. The demonstrated benefit is restored aiming time; this does not establish a bite-rate or catch-power bonus.',
  'rodGroups': [
   {'title':'Float / Ayu','items':[
    {'id':'14','why':'For the longest target-adjustment window in this style, choose this rod. It costs the same as the standard Ayu rod 07, while its ROM handling values provide more aiming time and a higher limit before this tackle-loss branch. Sold in Areas 3, 4, and 6.'},
    {'id':'08','why':'If your priority is more room before this specific tackle-loss branch, the Carp rod is tied for the highest limit in this style. Sold in Area 5.'},
    {'id':'15','why':'Tied with rod 08 for the highest limit, with more aiming time but ¥500 more cost. Sold in Areas 4–6.'}]},
   {'title':'Casting','items':[
    {'id':'10','why':'Choose this two-handed rod for the longest aim window and the highest limit before this tackle-loss branch in the style. ¥1,500 at the Area 6 special-rod shop. The ROM values do not show that it catches more fish.'}]},
   {'title':'Lure','items':[
    {'id':'0D','why':'The longest aim window and highest limit before this tackle-loss branch in the style. ¥650 at the Area 4 special-rod shop, only ¥50 above the Large Lure Rod 0C. If you want those two handling benefits, the ROM values support the premium; they do not prove a higher catch chance. If you already own 0C, buying 0D still costs the full ¥650.'}]},
   {'title':'Fly','items':[
    {'id':'13','why':'The longest aim window and highest limit before this tackle-loss branch in the style. ¥450 in Areas 1–4, only ¥50 above the Medium Fly Rod 12. Choose it for those handling benefits. If you already own 12, the purchase still costs ¥450, not ¥50. Improved landing odds are not established.'}]}
  ],
  'technical': 'Technical evidence and full compatibility table',
  'technicalLead': 'This section keeps the data needed to check the conclusions. Internal ROM counters are not seconds, metres, or catch scores.',
  'flyTitle': 'Fly-body filter',
  'flynote': 'The 64 ordinary fly-body IDs normalize to three bait IDs but use only two masks: 0020 passes 33 profile masks; 0004 passes 17, all already included in those 33. The 0020 bodies are IDs 01–08 / 2B–33 / 4B–4F / 60–65. Wings and tails do not change the body mask. An additional filter blocks this fly-hook path when (BODY ID & 3) equals 7F:1E86 or (WING ID & 3) equals 7F:1E88; this filter does not read the tail. One-fly coverage and a higher bite rate are not established.',
  'rodTechTitle':'Rod fields and their traced consumers',
  'rodTech':'+2 is the counter cutoff for aiming: while the direction input is held, the target moves; releasing the cast button or reaching the cutoff makes the game check that tile. +3 becomes a fish-position limit in one specific hook/lure/fly loss branch. A higher limit lets the fish travel farther before that branch, while other escape routes remain. +7 changes the initial fight state. These are not landing-success scores.',
  'namedLureTitle':'Lure responses keyed to named fish',
  'namedLure':'Lure 12 checks Black bass, lure 21 Namazu, and lure 51 Akame. On an exact match, the game halves the starting response value and skips that lure’s size-based transform; the rod still transforms the value afterward. The code does not establish an easier bite or landing.',
  'table':'Compatibility check by profile',
  'rodEvidenceTitle':'All rod records',
  'rodHeaders':['Style','ID / name','Price','Decoded shop offer','+2 aim cutoff','+3 boundary ×336','Fish match ID','Response branch','File offset','Raw bytes'],
  'styleNames':{'1':'Float / Ayu','2':'Casting','4':'Lure','8':'Fly'},
  'tablenote':'✓ means this lure mask check passes; — means it fails. Japanese names are decoded from ROM text. Filter by ID or Japanese name.',
  'search':'Japanese name or ID', 'fish':'ID / ROM name', 'yes':'passes', 'no':'fails',
  'evidence':'ROM research notes',
  'links': [('fish-acceptance-research.md','Bait/lure acceptance and gate'),('rod-lure-practical-research.md','Player-facing rod and lure effects'),('rod-response-research.md','Rod records and consumers'),('lure-response-research.md','Lure response branches'),('shop-stock-research.md','All six areas’ shop stock'),('fly-practical-research.md','Fly bodies, wings, tails and shop bundles')],
  'catalogue':'Item catalogue', 'area':'Area', 'special':'special-rod shop'
 },
 'ja': {
  'title': 'ROM調査からルアーと竿を選ぶ — 川のぬし釣り2',
  'intro': '持っていくルアー、買う竿、釣りの前に回復するタイミングをプレイヤー向けにまとめました。',
  'scope': '以下のルアーセットは、日本版ROMでルアーの種類判定を通過できる38プロフィールすべてをカバーします。対象には魚と水生生物が含まれます。この判定を通っても、食いつき・針掛かり・取り込みは保証されません。',
  'kit': '実用ルアーセット',
  'starterTitle': 'スプーン2E + ソフトワーム23 · 55円',
  'starter': 'エリア1から始めるなら、スプーン2Eとソフトワーム23を合計55円で購入。2個を持てば、いずれかのルアーが種類判定を通過できる38プロフィールをカバーします。これはコード上の適合範囲であり、食いつき率や釣果の保証ではありません。',
  'cheapest': 'エリア4から新たに買う場合、シンキング17 + ソフトワーム23が合計50円で最安です。2個ともエリア4で購入可能。シンキング17はエリア2～5、ソフトワーム23はエリア1と4で販売。エリア1のセットをすでに買っているなら、そのまま使いましょう。同じ適合範囲のために、5円節約だけを目的として17を買い足す必要はありません。',
  'kitItems': {'17':'シンキング', '23':'ソフトワーム', '2E':'スプーン'},
  'shop': '販売エリア',
  'rodTitle': 'どの竿を買う？',
  'rodIntro': '釣り方と欲しい操作上の利点で選びます。投げ先を動かせる時間か、特定の逃走分岐で仕掛けを失うまでの余裕です。食いつきや取り込み確率を示す値ではありません。',
  'hpTitle': '投げ竿・ルアー竿を使う前に',
  'hpTip': 'できればHPを100まで回復してください。投げ竿とルアー竿はHP100未満だと狙いを調整できる時間が短くなります。確認できた利点は照準時間の回復であり、食いつき率や釣る力のボーナスは証明していません。',
  'rodGroups': [
   {'title':'ウキ・アユ釣り','items':[
    {'id':'14','why':'この系統で照準時間を最長にしたいなら選択肢です。通常のアユ竿07と同じ価格ですが、ROM上の操作値では照準時間と、この仕掛け損失分岐までの境界が上回ります。エリア3・4・6で販売。'},
    {'id':'08','why':'特定の仕掛け損失分岐までの余裕を優先するなら、このコイ竿は系統内の最高境界と同値です。エリア5で販売。'},
    {'id':'15','why':'竿08と同じ最高境界で、照準時間は長いものの500円高価です。エリア4～6で販売。'}]},
   {'title':'投げ釣り','items':[
    {'id':'10','why':'系統内で最長の照準時間と、仕掛け損失分岐までの最大境界を求めるなら両手投げ竿。エリア6の専用竿店で1,500円。これで釣果が増えることはROMから確認されていません。'}]},
   {'title':'ルアー釣り','items':[
    {'id':'0D','why':'系統内で最長の照準時間と、仕掛け損失分岐までの最大境界を持ちます。エリア4の専用竿店で650円。大ルアーロッド0Cより50円高いだけです。この操作上の利点を求めるなら価格差はROM値で説明できますが、釣果向上は未確認。0Cを持っている場合も購入は650円です。'}]},
   {'title':'フライ釣り','items':[
    {'id':'13','why':'系統内で最長の照準時間と、仕掛け損失分岐までの最大境界を持ちます。エリア1～4で450円、中竿12より50円高いだけです。12を持っている場合も購入は450円で、差額50円ではありません。取り込み率の改善は未確認です。'}]}
  ],
  'technical': '技術的根拠と全適合表',
  'technicalLead': '以下に結論を確認するためのデータを残します。ROM内部のカウンターは秒・メートル・釣果スコアではありません。',
  'flyTitle': 'フライのボディ判定',
  'flynote': '通常ボディ64 IDは3種のエサIDに正規化されますが、判定maskは2種類です。0020は33プロフィール、0004は17プロフィールに適合し、後者はすべて前者に含まれます。0020のボディIDは01–08 / 2B–33 / 4B–4F / 60–65。ウイングとテールはボディmaskを変えません。さらに(BODY ID & 3)が7F:1E86、または(WING ID & 3)が7F:1E88と一致すると、このフライの針掛かり経路を遮断します。このフィルターはテールを読みません。フライ1個で全てに対応することや、食いつき率が高いことは未確認です。',
  'rodTechTitle':'竿の記録値と処理',
  'rodTech':'+2は照準中のカウンター上限です。方向入力中に狙い位置が動き、投げるボタンを離すか上限に達すると、そのタイルを判定します。+3は特定のハリ・ルアー・フライ損失分岐で魚位置の境界になります。値が高いとこの分岐まで魚が進める距離は増えますが、別の逃走経路は残ります。+7はファイト開始状態を変えます。いずれも取り込み成功率の点数ではありません。',
  'namedLureTitle':'魚種名を参照するルアー処理',
  'namedLure':'ルアー12はブラックバス、21はナマズ、51はアカメのIDを検査します。一致すると初期応答値を半分にし、そのルアーのサイズ別変換を飛ばします。その後に竿の変換は行われます。これで食いつきや取り込みが簡単になるとは確認されていません。',
  'table':'プロフィール別の適合判定',
  'rodEvidenceTitle':'全竿レコード',
  'rodHeaders':['釣り方','ID / 名称','価格','確認した販売店','+2照準上限','+3境界 ×336','魚種一致ID','応答分岐','ファイル位置','生バイト'],
  'styleNames':{'1':'ウキ・アユ','2':'投げ','4':'ルアー','8':'フライ'},
  'tablenote':'✓はこのルアーmask判定を通過、—は不適合。名前はROMの日本語文字列から復号。IDまたは日本語名で検索できます。',
  'search':'日本語名・ID', 'fish':'ID / ROM名', 'yes':'適合', 'no':'不適合',
  'evidence':'ROM調査ノート',
  'links': [('fish-acceptance-research.md','エサ・ルアーの適合判定'),('rod-lure-practical-research.md','竿とルアーのプレイ上の効果'),('rod-response-research.md','竿データと参照処理'),('lure-response-research.md','ルアー応答分岐'),('shop-stock-research.md','全6エリアの店頭在庫'),('fly-practical-research.md','フライ部品と完成品セット')],
  'catalogue':'アイテム一覧', 'area':'エリア', 'special':'専用竿店'
 }
}

CSS = '''body{margin:0;background:#f5f2e8;color:#183b34;font:18px/1.7 system-ui,sans-serif}main{max-width:1080px;margin:auto;padding:28px 20px}h1{font-size:clamp(28px,5vw,44px);line-height:1.3}h2{margin-top:36px}nav{display:flex;gap:22px;flex-wrap:wrap}a{color:#086d56}p{max-width:88ch}.note,.tip{background:#e7efdd;border-left:5px solid #47704c;padding:16px 20px;border-radius:5px}.tip{background:#fff1cc;border-color:#bd8517}.kit-grid,.rod-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.kit-card,.rod-card{background:white;border:1px solid #b8cbb7;border-radius:12px;padding:18px}.kit-card img{width:112px;height:130px;object-fit:contain;image-rendering:pixelated}.kit-pair{display:flex;gap:8px;align-items:center}.kit-pair img{width:92px;height:108px}.rod-card h3{margin:0 0 8px}.rod-item{display:grid;grid-template-columns:124px 1fr;gap:12px;padding:12px 0;border-top:1px solid #dbe3d8}.rod-item img{width:116px;height:120px;object-fit:contain;image-rendering:pixelated}.price{font-weight:700;color:#76520c}.shop{font-size:.92em;color:#52675e}.decision{font-size:1.06em}.scroll{overflow:auto}table{border-collapse:collapse;width:100%;background:white}th,td{padding:12px;border-bottom:1px solid #ccd8ca;text-align:left}th{position:sticky;top:0;background:#e7efdd}.yes{font-weight:bold;color:#006143}.no{color:#777}input{font:inherit;padding:12px;width:min(95%,420px);margin:15px 0}code{font-size:.9em}details{margin:28px 0;background:white;border:1px solid #b8cbb7;border-radius:12px;padding:14px 18px}details>summary{cursor:pointer;font-weight:700;color:#245d4d}footer{margin:36px 0;font-size:15px}@media(max-width:800px){.kit-grid,.rod-grid{grid-template-columns:1fr 1fr}}@media(max-width:600px){.kit-grid,.rod-grid{grid-template-columns:1fr}.kit-pair img{width:105px;height:120px}th,td{padding:9px;font-size:16px}}'''


def esc(value):
    return html.escape(str(value), quote=True)


def area_names(category, item_id, lang):
    offers = SHOP['items'].get(f'{category}:{item_id}', [])
    stages = [offer['stage'] for offer in offers]
    if lang == 'en':
        if len(stages) == 1:
            areas = f"Area {stages[0]}"
        elif len(stages) == 2 and stages[1] == stages[0] + 1:
            areas = f"Areas {stages[0]}–{stages[1]}"
        else:
            areas = 'Areas ' + ', '.join(map(str, stages[:-1])) + (' and ' if len(stages) > 1 else '') + (str(stages[-1]) if stages else '')
    elif lang == 'ja':
        areas = 'エリア' + '・'.join(map(str, stages))
    else:
        areas = 'พื้นที่ ' + ', '.join(map(str, stages[:-1])) + (' และ ' if len(stages) > 1 else '') + (str(stages[-1]) if stages else '')
    special = any(offer.get('shop') == 'special_rod_shop' for offer in offers)
    if special:
        if lang == 'en':
            return f'{areas} {COPY[lang]["special"]}'
        if lang == 'ja':
            return f'{areas}の{COPY[lang]["special"]}'
        return f'{areas} ({COPY[lang]["special"]})'
    return areas


def render_lure_cards(lang):
    c = COPY[lang]
    out = []
    for item_id in ['2E', '23', '17']:
        item = ITEMS[('lure', item_id)]
        name = item['nameEn'] if lang == 'en' else item['nameJa'] if lang == 'ja' else item.get('nameTh', c['kitItems'][item_id])
        area = area_names('lure', item_id, lang)
        if lang == 'en':
            shop_text = f"{c['shop']} {area}"
        elif lang == 'ja':
            shop_text = f"{area}で購入"
        else:
            shop_text = f"{c['shop']} {area}"
        out.append(
            f'<article class="kit-card"><img src="../catalogue/{esc(item["image"])}" alt="{esc(name)}">'
            f'<h3>{esc(name)} <code>{item_id}</code></h3>'
            f'<div class="price">¥{item["priceYen"]}</div><div class="shop">{esc(shop_text)}</div></article>'
        )
    return ''.join(out)


def render_rod_groups(lang):
    c = COPY[lang]
    groups = []
    for group in c['rodGroups']:
        rows = []
        for entry in group['items']:
            item_id = entry['id']
            item = ITEMS[('rod', item_id)]
            name = item['nameEn'] if lang == 'en' else item['nameJa'] if lang == 'ja' else item.get('nameTh', item['nameJa'])
            offer = area_names('rod', item_id, lang)
            rows.append(
                f'<div class="rod-item"><img src="../catalogue/{esc(item["image"])}" alt="{esc(name)}">'
                f'<div><strong>{esc(name)} · <code>{item_id}</code></strong>'
                f'<div class="price">¥{item["priceYen"]}</div><div class="shop">{esc(offer)}</div>'
                f'<p>{esc(entry["why"])}</p></div></div>'
            )
        groups.append(f'<article class="rod-card"><h3>{esc(group["title"])}</h3>{"".join(rows)}</article>')
    return ''.join(groups)


def render_rod_evidence_table(lang):
    c = COPY[lang]
    headers = ''.join(f'<th>{esc(header)}</th>' for header in c['rodHeaders'])
    rows = []
    rods = sorted((item for item in CATALOGUE['items'] if item.get('category') == 'rod'), key=lambda item: int(item['id'], 16))
    for item in rods:
        fields = item.get('decodedFields', {})
        item_id = item['id']
        style = str(fields.get('styleCode', ''))
        label = item['nameEn'] if lang == 'en' else item['nameJa'] if lang == 'ja' else item.get('nameTh', item['nameJa'])
        offers = area_names('rod', item_id, lang)
        if not SHOP['items'].get(f'rod:{item_id}'):
            offers = {'en':'No offer decoded in six-area stock', 'ja':'6エリアの在庫から販売確認できず', 'th':'ไม่พบรายการขายในข้อมูลร้านหกพื้นที่'}[lang]
        row = [
            c['styleNames'].get(style, style),
            f'<code>{esc(item_id)}</code> {esc(label)}',
            f'¥{item.get("priceYen", "—")}',
            esc(offers),
            esc(fields.get('castAimHoldCutoffInternal', '—')),
            f'{esc(fields.get("rangeMultiplier", "—"))} × 336 = {esc(fields.get("rangeInternalValueAtBase0x0150", "—"))}',
            esc(fields.get('fishIdMatchCode', '—')),
            esc(fields.get('fightResponseCode', '—')),
            f'<code>{esc(item.get("fileOffset", "—"))}</code>',
            f'<code>{esc(item.get("recordBytesHex", "—"))}</code>'
        ]
        rows.append('<tr>' + ''.join(f'<td>{cell}</td>' for cell in row) + '</tr>')
    return f'<div class="scroll"><table><thead><tr>{headers}</tr></thead><tbody>{"".join(rows)}</tbody></table></div>'


def build(lang):
    c = COPY[lang]
    suffix = '' if lang == 'en' else '.' + lang
    rows = []
    for fish in DATA['fish']:
        if fish['id_hex'] == '43':
            continue
        cells = []
        for mask in [0x0200, 0x0040, 0x0400, 0x0020, 0x0004]:
            yes = bool(int(fish['acceptance_mask_hex'], 16) & mask)
            cells.append(f'<td class="{"yes" if yes else "no"}" aria-label="{esc(c["yes" if yes else "no"])}">{"✓" if yes else "—"}</td>')
        rows.append(f'<tr><td><code>{esc(fish["id_hex"])}</code> {esc(fish["name_ja"])}</td>{"".join(cells)}</tr>')

    evidence = ''.join(
        f'<li><a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/{esc(name)}">{esc(label)}</a></li>'
        for name, label in c['links']
    )
    alternates = ''.join(
        f'<link rel="alternate" hreflang="{lang_code}" href="https://polaminggkub-debug.github.io/kawa-no-nushi-tsuri-2-research/research/index{page_suffix}.html">'
        for lang_code, page_suffix in [('en', ''), ('ja', '.ja'), ('th', '.th')]
    )
    kit_pair = (
        '<div class="kit-pair"><img src="../catalogue/sprites/lures-046.png" alt="Spoon 2E">'
        '<span aria-hidden="true">+</span><img src="../catalogue/sprites/lures-035.png" alt="Soft Worm 23"></div>'
        if lang == 'en' else
        '<div class="kit-pair"><img src="../catalogue/sprites/lures-046.png" alt="スプーン2E">'
        '<span aria-hidden="true">+</span><img src="../catalogue/sprites/lures-035.png" alt="ソフトワーム23"></div>'
        if lang == 'ja' else
        '<div class="kit-pair"><img src="../catalogue/sprites/lures-046.png" alt="สปูน 2E">'
        '<span aria-hidden="true">+</span><img src="../catalogue/sprites/lures-035.png" alt="ยางหนอน 23"></div>'
    )
    table = f'''<h3>{esc(c['table'])}</h3><p>{esc(c['tablenote'])}</p><input id="filter" aria-label="{esc(c['search'])}" placeholder="{esc(c['search'])}">
<div class="scroll"><table><thead><tr><th>{esc(c['fish'])}</th><th>17 / 18<br>2E–31</th><th>23 / 24</th><th>0400<br>73 IDs</th><th>Fly<br>0020</th><th>Fly<br>0004</th></tr></thead><tbody>{''.join(rows)}</tbody></table></div>'''
    text = f'''<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{esc(c['title'])}</title><meta name="description" content="{esc(c['intro'])}"><link rel="canonical" href="https://polaminggkub-debug.github.io/kawa-no-nushi-tsuri-2-research/research/index{suffix}.html">{alternates}<style>{CSS}</style></head><body><main>
<nav><a href="index.html">English</a><a href="index.ja.html">日本語</a><a href="index.th.html">ไทย</a><a href="../catalogue/index{suffix}.html">{esc(c['catalogue'])}</a></nav>
<h1>{esc(c['title'])}</h1><p class="decision"><strong>{esc(c['intro'])}</strong></p><p class="note">{esc(c['scope'])}</p>
<section><h2>{esc(c['kit'])}</h2><p class="decision"><strong>{esc(c['starter'])}</strong></p><article class="kit-card">{kit_pair}<h3>{esc(c['starterTitle'])}</h3></article><p>{esc(c['cheapest'])}</p><div class="kit-grid">{render_lure_cards(lang)}</div></section>
<section><h2>{esc(c['rodTitle'])}</h2><p>{esc(c['rodIntro'])}</p><div class="tip"><strong>{esc(c['hpTitle'])}:</strong> {esc(c['hpTip'])}</div><div class="rod-grid">{render_rod_groups(lang)}</div></section>
<details><summary>{esc(c['technical'])}</summary><p>{esc(c['technicalLead'])}</p>
<h3>{esc(c['flyTitle'])}</h3><p>{esc(c['flynote'])}</p>
<h3>{esc(c['rodTechTitle'])}</h3><p>{esc(c['rodTech'])}</p>
<h3>{esc(c['namedLureTitle'])}</h3><p>{esc(c['namedLure'])}</p>
<h3>{esc(c['rodEvidenceTitle'])}</h3>{render_rod_evidence_table(lang)}
{table}
<h3>{esc(c['evidence'])}</h3><ul>{evidence}<li><a href="../data/lure-coverage.json">Lure coverage JSON</a> · <a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/scripts/extract_lure_coverage.py">Extractor</a></li></ul>
<p><code>04:EBFD: (lure +6/+7) AND (fish +0F/+10) ≠ 0</code></p>
</details>
<footer>Original Japanese ROM SHA-1: <code>{esc(DATA['rom_sha1'])}</code><br>2026-10-04 · ROM-derived evidence; no ROM included. ID43 is a zero-field placeholder omitted from the table.</footer>
</main><script>document.getElementById('filter').addEventListener('input',e=>{{const q=e.target.value.toLocaleLowerCase();document.querySelectorAll('tbody tr').forEach(r=>r.hidden=!r.textContent.toLocaleLowerCase().includes(q))}})</script></body></html>'''
    (ROOT / 'research' / f'index{suffix}.html').write_text(text)


if __name__ == '__main__':
    (ROOT / 'research').mkdir(exist_ok=True)
    for language in COPY:
        build(language)
    print('Built player-first equipment guides in English, Japanese and Thai.')
