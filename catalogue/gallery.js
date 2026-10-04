(() => {
  const lang = ['ja','th'].includes(document.documentElement.dataset.locale) ? document.documentElement.dataset.locale : 'en';
  const copy = {
    en: {
      title: 'Kawa no Nushi Tsuri 2 — Item Catalogue & ROM Research', lead: 'A searchable catalogue of the game’s rods, lures, fly parts, baits, hooks, floats, food and tools—with ROM fields we could verify and clear notes where a stat is still a mystery.',
      edition: 'SFC / SNES · JAPAN VERSION', entries: n => `${n} listed entries`, sampleKicker: 'A FEW DECODED EXAMPLES', sampleTitle: 'The numbers finally have context', sampleCopy: 'The ROM stores real numeric fields, but many are internal selectors rather than familiar “power” or “bite rate” stats. These examples show exact values and what the game code does with them.',
      item: 'Item', rom: 'ROM fields we can explain', price: 'ROM price field', flyKicker: 'THE CUSTOM FLY MAKER', flyTitle: 'Body, wing, tail… and a real price quote', flyCopy: 'These are direct captures of the original Japanese game. In the first-stage shop, we followed the full Mayfly sequence and checked one order against the money counter.', flyFact: 'Observed Mayfly palette: 20 wing choices; 9 tail sprites plus a separate “None”. One first-body + first-wing + first-tail order cost ¥25 (¥5 + ¥5 + ¥15). That is one measured combination, not a universal price.',
      catalogueKicker: 'THE FULL INDEX', catalogueTitle: 'Browse all 315 listed entries', catalogueCopy: 'Search either language, an item ID, or a stat. Open any card for its raw ROM bytes and record offset.', search: 'Search', searchPlaceholder: 'Try “rod”, “トップウォータ”, or “0D”', category: 'Category', sort: 'Sort', all: 'All categories', sortId: 'Item ID', sortName: 'Name', sortPrice: 'Price field', results: n => `${n} entries shown`, empty: 'No matching entries. Try another name or ID.',
      noPrice: 'No price field', yen: '¥', imageNote: 'Authentic game capture', openFrame: 'Open full game-screen capture ↗', details: 'ROM record and field notes', offset: 'File offset', bytes: 'Raw bytes', decoded: 'Decoded fields', none: 'No table record supplied for this entry.', confidence: 'Evidence', japanese: 'Japanese game label', priceField: 'ROM price field', zeroPrice: '0 yen in the ROM table; not evidence that it is free or sold in a shop.',
      methodKicker: 'HOW TO READ THIS', methodTitle: 'Confirmed, translated, and still unknown', sourcesTitle: 'Sources and method', footer: 'Independent fan research. No ROM file is included.', readme: 'Project notes', langLink: '日本語',
      customFrames: [
        'First-stage shop: fly-family choice.', 'Mayfly body palette.', 'After choosing a body: wing palette.', 'After choosing a wing: tail sprites plus a separate “None” choice.', 'One combination quoted at ¥25.', 'After the order was accepted.'
      ],
      quick: {
        'rod:0A': 'Cast/aim hold-time cutoff 70; reach multiplier 15 × 336 = 5,040 internal units. Under 100 HP the cutoff scales with current HP (minimum 10).',
        'rod:0D': 'Cast/aim hold-time cutoff 120; reach multiplier 24 × 336 = 8,064 internal units. Under 100 HP the cutoff scales with current HP (minimum 10).',
        'lure:12': 'Action branch 9; conditional fish-ID comparison value 11 → Black bass. Changes a behavior path; does not prove an exclusive target or bonus.',
        'lure:21': 'Action branch 7; conditional fish-ID comparison value 38 → Namazu. Changes a behavior path; does not prove an exclusive target or bonus.',
        'lure:51': 'Action branch 5; conditional fish-ID comparison value 55 → Akame. Changes a behavior path; does not prove an exclusive target or bonus.',
        'food:01': 'Runtime-measured recovery: 5 HP.',
        'food:0A': 'Runtime-measured result: HP becomes 0.'
      },
      fieldNames: { styleCode: 'Rod style code', castAimHoldCutoffInternal: 'Cast/aim hold-time cutoff', rangeMultiplier: 'Reach multiplier', rangeInternalValueAtBase0x0150: 'Reach threshold (internal units)', fishIdMatchCode: 'Fish-ID comparison code', fightResponseCode: 'Fight-response branch selector', specialFishComparisonID: 'Fish-ID comparison value', fishHookGateMaskHex: 'Lure-hook gate mask (16 bit)', flyBaitMaskHex: 'Fly body acceptance mask' },
      noteNoJs: 'Enable JavaScript to load the searchable catalogue.'
    },
    // THAI_COPY_START
    th: {"title":"ตกปลาทาโร่ 2 (Kawa no Nushi Tsuri 2) — คลังไอเท็มและข้อมูลจาก ROM","lead":"แค็ตตาล็อกค้นหาเบ็ด เหยื่อปลอม ชิ้นส่วนฟลาย เหยื่อ ตะขอ ทุ่น อาหาร และอุปกรณ์ พร้อมค่าจาก ROM ที่ตรวจสอบได้ และระบุชัดเจนว่าส่วนใดยังไม่ทราบความหมาย","edition":"SFC / SNES · ฉบับญี่ปุ่น","entries":"มีข้อมูล {n} รายการ","sampleKicker":"ตัวอย่างค่าที่ถอดความหมายได้","sampleTitle":"ดูค่าตัวเลขพร้อมความหมายที่ตรวจสอบแล้ว","sampleCopy":"ROM เก็บตัวเลขไว้หลายแบบ แต่หลายค่าเป็นตัวควบคุมภายใน ไม่ใช่ค่าสถานะอย่าง “พลัง” หรือ “โอกาสปลากินเหยื่อ” ตัวอย่างนี้แสดงค่าจริงและสิ่งที่โค้ดเกมทำกับมัน","item":"ไอเท็ม","rom":"ช่องข้อมูล ROM ที่อธิบายได้","price":"ช่องราคาใน ROM","flyKicker":"เมนูประกอบฟลาย","flyTitle":"เลือกบอดี้ ปีก หาง พร้อมตรวจราคาจริง","flyCopy":"ภาพเหล่านี้จับจากเกมญี่ปุ่นต้นฉบับโดยตรง เราตามขั้นตอนเมนูประกอบฟลายในร้านด่านแรกจนจบ และตรวจสอบราคาหนึ่งรายการกับเงินที่ลดลง","flyFact":"จากหน้าจอเมย์ฟลายที่ตรวจ: ปีก 20 แบบ และภาพหาง 9 แบบ พร้อมตัวเลือก “ไม่มี” แยกต่างหาก ชุดบอดี้แรก + ปีกแรก + หางแรก คิดราคา 25 เยน (5 + 5 + 15) เป็นราคาจากชุดที่ทดลองหนึ่งชุด ไม่ใช่ราคาทุกชุด","catalogueKicker":"รายการไอเท็มทั้งหมด","catalogueTitle":"ค้นหาข้อมูลทั้ง 315 รายการ","catalogueCopy":"ค้นด้วยชื่อภาษาไทยที่ถอดจากภาพแล้ว ภาษาอังกฤษ ญี่ปุ่น หรือเลข ID ได้ เปิดการ์ดเพื่อดูไบต์ดิบและตำแหน่งระเบียนใน ROM","search":"ค้นหา","searchPlaceholder":"ลองพิมพ์ชื่อไอเท็ม หรือ ID เช่น 0D","category":"ประเภท","sort":"เรียงตาม","all":"ทุกประเภท","sortId":"ID ไอเท็ม","sortName":"ชื่อ","sortPrice":"ช่องราคา","results":"แสดง {n} รายการ","empty":"ไม่พบรายการที่ตรงกัน ลองค้นด้วยชื่อหรือ ID อื่น","noPrice":"ไม่มีช่องราคา","yen":"¥","imageNote":"ภาพจากเกมจริง","openFrame":"เปิดภาพหน้าจอเกมเต็ม ↗","details":"ระเบียน ROM และคำอธิบายฟิลด์","offset":"ตำแหน่งในไฟล์","bytes":"ไบต์ดิบ","decoded":"ฟิลด์ที่อธิบายความหมายได้","none":"ไม่มีระเบียนตารางสำหรับรายการนี้","confidence":"หลักฐาน","japanese":"ชื่อที่แสดงในเกมภาษาญี่ปุ่น","priceField":"ช่องราคาใน ROM","zeroPrice":"ค่าในตาราง ROM เป็น 0 เยน แต่ยังยืนยันไม่ได้ว่าไอเท็มนี้ฟรีหรือมีขายในร้าน","methodKicker":"วิธีอ่านข้อมูล","methodTitle":"แยกข้อมูลที่ยืนยัน คำแปล และค่าที่ยังไม่รู้","sourcesTitle":"แหล่งข้อมูลและวิธีค้นคว้า","footer":"งานค้นคว้าอิสระของแฟนเกม ไม่มีไฟล์ ROM รวมอยู่ด้วย","readme":"รายละเอียดโครงการ","langLink":"English / 日本語","customFrames":["ร้านในด่านแรก: เลือกประเภทฟลาย","หน้าจอเลือกบอดี้เมย์ฟลาย","หลังเลือกบอดี้: หน้าจอเลือกปีก","หลังเลือกปีก: ภาพหางและตัวเลือก “ไม่มี” แยกต่างหาก","ตัวอย่างชุดที่ประเมินราคา 25 เยน","หลังยืนยันการสั่งทำ"],"quick":{"rod:0A":"ตัวนับค้างเล็ง/ปล่อยเหยื่อ 70; เกณฑ์ระยะ 15 × 336 = 5,040 หน่วยภายใน หาก HP ต่ำกว่า 100 ตัวนับช่วงเล็งจะลดตาม HP (ขั้นต่ำ 10) ไม่ใช่พลังสู้ปลา","rod:0D":"ตัวนับค้างเล็ง/ปล่อยเหยื่อ 120; เกณฑ์ระยะ 24 × 336 = 8,064 หน่วยภายใน หาก HP ต่ำกว่า 100 ตัวนับช่วงเล็งจะลดตาม HP (ขั้นต่ำ 10) ไม่ใช่พลังสู้ปลา","lure:12":"รหัสแขนงการทำงาน 9; มีการเทียบ ID ปลาแบบมีเงื่อนไขกับค่า 11 → Black bass (ブラックバス) ทำให้เข้าเส้นทางการทำงานอีกแบบ ไม่ได้ยืนยันว่าใช้ได้เฉพาะปลานี้หรือมีโบนัส","lure:21":"รหัสแขนงการทำงาน 7; มีการเทียบ ID ปลาแบบมีเงื่อนไขกับค่า 38 → Namazu (ナマズ) ทำให้เข้าเส้นทางการทำงานอีกแบบ ไม่ได้ยืนยันว่าใช้ได้เฉพาะปลานี้หรือมีโบนัส","lure:51":"รหัสแขนงการทำงาน 5; มีการเทียบ ID ปลาแบบมีเงื่อนไขกับค่า 55 → Akame (アカメ) ทำให้เข้าเส้นทางการทำงานอีกแบบ ไม่ได้ยืนยันว่าใช้ได้เฉพาะปลานี้หรือมีโบนัส","food:01":"ผลที่วัดในเกม: ฟื้น HP 5 หน่วย","food:0A":"ผลที่วัดในเกม: HP กลายเป็น 0"},"fieldNames":{"styleCode":"รหัสรูปแบบการตกของคันเบ็ด","castAimHoldCutoffInternal":"เกณฑ์ตัวนับค้างเล็ง/ปล่อยเหยื่อ","rangeMultiplier":"ตัวคูณระยะ","rangeInternalValueAtBase0x0150":"เกณฑ์ระยะ (หน่วยภายในเกม)","fishIdMatchCode":"รหัสเทียบ ID ปลา","fightResponseCode":"รหัสแขนงการตอบสนองช่วงสู้ปลา","specialFishComparisonID":"ค่า ID ปลาที่ใช้เทียบ","fishHookGateMaskHex":"มาสก์เงื่อนไขรับลัวร์ (16 บิต)","flyBaitMaskHex":"mask รับเหยื่อจากบอดี้ฟลาย"},"noteNoJs":"เปิด JavaScript เพื่อโหลดแค็ตตาล็อกแบบค้นหาได้","researchNotes":["แค็ตตาล็อกนี้ลงรายการที่มีชื่อหรือภาพให้ตรวจสอบได้ครบ 315 รายการ: คันเบ็ด 21, เหยื่อปลอม 81, บอดี้ฟลาย 64, ปีก 47, หาง 23, เหยื่อ 23, ตะขอ 13, ทุ่น/ตะกั่ว 10, อาหาร 10 และอุปกรณ์/ไอเท็มเควสต์ 23 ชิ้นส่วนบอดี้ 64 + ปีก 47 + หาง 23 ครบระเบียนฟลายทั้ง 134 รายการในตาราง ROM","แสดงระเบียนตารางฟลายทั้ง 134 รายการ แบ่งเป็นบอดี้ 64 ปีก 47 และหาง 23 โดยตัด ID 87 ซึ่งเป็นรหัสว่าไม่มีไอเท็มออก","ช่องราคาใน ROM ไม่ได้ยืนยันว่าร้านใดมีไอเท็มขาย และช่องราคา 0 ก็ไม่ได้ยืนยันว่าได้มาฟรี ค่าราคาของชิ้นส่วนฟลายเป็นราคาของชิ้นส่วน ไม่ใช่ราคาขายปลีกของฟลายที่ประกอบเสร็จแล้ว","คู่มือ SFC ภาษาญี่ปุ่นอธิบายประเภทคันเบ็ด ทุ่น เครื่องหมายบนสาย ตะกั่ว ตะขอ เหยื่อ และตระกูลฟลาย ชื่อภาษาอังกฤษในรายการเป็นคำแปล ส่วนชื่อญี่ปุ่นคงข้อความที่พบในเกม","ตรวจเมนูช่างประกอบฟลายในร้านด่านแรกโดยตรง: เลือกประเภท บอดี้ ปีก หางหรือ “ไม่มี” แล้วจึงยืนยัน หน้าจอเมย์ฟลายที่ตรวจมีปีก 20 แบบ และภาพหาง 9 แบบพร้อมตัวเลือก “ไม่มี” แยกต่างหาก ราคาหนึ่งชุดที่วัดได้คือ 25 เยน (5 + 5 + 15) ไม่ใช่ราคากลางของทุกชุด","ภาพจับจาก ROM ญี่ปุ่นที่ผู้ใช้ให้มา ซึ่งไม่ได้ดัดแปลง ในการจำลอง Snes9x แบบแยกสำหรับไอเท็มที่ซ่อนอยู่ เราเขียน ID ของไอเท็มที่ถูกต้องลง WRAM ชั่วคราวเพื่อให้ตัวเกมเป็นผู้วาดภาพ ไม่ได้ใช้ภาพที่สร้างด้วย AI","ชื่อไทยที่มีภาพประกอบใต้ชื่อไอเท็ม จับจากแพตช์ไทย V1.2 โดยตรง หากยังอ่านตัวสะกดจากภาพไม่ชัด จะคงชื่อญี่ปุ่นไว้ให้เทียบกับภาพ ชื่อปลาที่ถือในเมนูอาหารเปลี่ยนตามปลาตัวนั้น ส่วนคำอธิบายค่าต่าง ๆ เป็นคำแปลสำหรับเว็บไซต์จากผลวิจัย ROM ญี่ปุ่นต้นฉบับ"],"customizerFrames":["ร้านในด่านแรก: เลือกประเภทฟลาย","หน้าจอเลือกบอดี้เมย์ฟลาย","หลังเลือกบอดี้: หน้าจอเลือกปีก","หลังเลือกปีก: ภาพหางและตัวเลือก “ไม่มี” แยกต่างหาก","ตัวอย่างชุดที่ประเมินราคา 25 เยน","หลังยืนยันการสั่งทำ"],"sources":[{"title":"คู่มือ SFC ต้นฉบับ: 川のぬし釣り2","detail":"ภาพสแกนคู่มือ ใช้อ้างอิงหน้าที่ทั่วไปของอุปกรณ์และคำเรียกประเภทฟลาย"},{"title":"รายการไอเท็มและการสำรวจหน่วยความจำโดยชุมชนผู้เล่น","detail":"ข้อมูลประกอบสำหรับ ID ชื่อไอเท็ม และจำนวนที่ถือได้ รายการนี้ตรวจทานกับระเบียน ROM และชื่อภาษาญี่ปุ่นในเกม"},{"title":"ข้อมูลระบุ ROM ที่ใช้ในการค้นคว้า","detail":"ROM ญี่ปุ่นต้นฉบับที่ผู้ใช้แนบมา ขนาด 1,572,864 ไบต์; SHA-1 c2103dd94e2a1a65a495fc02adc2e7d040f31212"}]},
    // THAI_COPY_END
    ja: {
      title: '川のぬし釣り2 — アイテム一覧・ROM解析', lead: '竿、ルアー、毛バリ部品、餌、針、ウキ、食料、道具を検索できる一覧。ROMで確認できた数値と、まだ意味が分からない値を分けて掲載。',
      edition: 'SFC · 日本版', entries: n => `掲載 ${n} 件`, sampleKicker: '解読できた数値の例', sampleTitle: '数字の意味をゲーム処理と照合', sampleCopy: 'ROMには数値が保存されていますが、「強さ」や「ヒット率」のような単純な能力値とは限りません。実際の値と、ゲーム内コードでの使われ方を例示します。',
      item: 'アイテム', rom: '意味を確認できたROM値', price: 'ROM価格欄', flyKicker: '毛バリ作成NPC', flyTitle: 'ボディ、ウィング、テール、そして見積もり', flyCopy: '日本版ゲームを直接撮影した画面です。ステージ1の店でメイフライ作成を最後まで進め、所持金の変化で一例の価格を確認しました。', flyFact: '確認したメイフライ画面: ウィング20種、テール画像9種と別枠の「無し」。最初のボディ+最初のウィング+最初のテールは25円（5+5+15円）。これは実測した一例で、全組み合わせ共通ではありません。',
      catalogueKicker: '全アイテム一覧', catalogueTitle: '掲載315件を検索', catalogueCopy: '英語・日本語、アイテムID、数値で検索できます。各カードを開くとROM生データとファイル位置を確認できます。', search: '検索', searchPlaceholder: '例: 「rod」「トップウォータ」「0D」', category: 'カテゴリ', sort: '並び順', all: 'すべてのカテゴリ', sortId: 'アイテムID', sortName: '名前', sortPrice: '価格欄', results: n => `${n}件を表示`, empty: '一致するアイテムはありません。名前かIDを変えてください。',
      noPrice: '価格欄なし', yen: '¥', imageNote: 'ゲーム画面から取得', openFrame: 'ゲーム画面全体を開く ↗', details: 'ROMレコードとフィールド', offset: 'ファイル位置', bytes: '生バイト列', decoded: '解読済みフィールド', none: 'この項目のテーブルレコードはありません。', confidence: '根拠', japanese: 'ゲーム内の日本語表記', priceField: 'ROM価格欄', zeroPrice: 'ROMの値は0円。無料・店頭販売を意味すると確認されたわけではありません。',
      methodKicker: '読み方', methodTitle: '確認済み、翻訳、未解読を区別', sourcesTitle: '出典と調査方法', footer: 'ファンによる独立調査。ROMファイルは含みません。', readme: 'プロジェクトノート', langLink: 'English',
      customFrames: ['ステージ1の店: 毛バリの系統選択。', 'メイフライのボディ選択。', 'ボディ選択後: ウィング選択。', 'ウィング選択後: テール画像と別枠の「無し」。', 'ある組み合わせの見積もり: 25円。', '注文を確定した後。'],
      quick: {
        'rod:0A': '投げ・照準の保持時間上限70。距離判定係数15 × 336 = 内部値5,040。HP100未満ではHPに応じて上限が縮小（最低10）。',
        'rod:0D': '投げ・照準の保持時間上限120。距離判定係数24 × 336 = 内部値8,064。HP100未満ではHPに応じて上限が縮小（最低10）。',
        'lure:12': '動作分岐9。魚ID比較値11 → ブラックバス。一致時は別処理に入る。対象魚専用やボーナスとは確認されていない。',
        'lure:21': '動作分岐7。魚ID比較値38 → ナマズ。一致時は別処理に入る。対象魚専用やボーナスとは確認されていない。',
        'lure:51': '動作分岐5。魚ID比較値55 → アカメ。一致時は別処理に入る。対象魚専用やボーナスとは確認されていない。',
        'food:01': 'ゲーム内で測定した回復量: HP5。',
        'food:0A': 'ゲーム内で確認した結果: HPが0になる。'
      },
      fieldNames: { styleCode: '竿の釣り方コード', castAimHoldCutoffInternal: '投げ・照準の保持時間上限', rangeMultiplier: '距離判定係数', rangeInternalValueAtBase0x0150: '距離判定値（内部単位）', fishIdMatchCode: '魚ID比較コード', fightResponseCode: 'ファイト応答分岐', specialFishComparisonID: '魚ID比較値', fishHookGateMaskHex: '針掛かり判定マスク（16ビット）', flyBaitMaskHex: 'フライボディ適合マスク' },
      noteNoJs: '検索カタログを表示するにはJavaScriptを有効にしてください。'
    }
  }[lang];
  if (typeof copy.entries === 'string') { const template=copy.entries; copy.entries=n=>template.replace('{n}',n); }
  if (typeof copy.results === 'string') { const template=copy.results; copy.results=n=>template.replace('{n}',n); }
  const itemName=item=>item.category==='general_tool'&&['08','09','0A','0B','0C','0D'].includes(item.id)&&item.playerUse?.displayName?.[lang]?item.playerUse.displayName[lang]:lang==='th'?(item.nameTh||item.playerUse?.displayName?.th||item.nameJa):lang==='ja'?item.nameJa:item.nameEn;
  const itemNotes=item=>lang==='th'?(item.notesTh||item.notesEn):lang==='ja'?item.notesJa:item.notesEn;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const set = (selector, text) => { const node = document.querySelector(selector); if (node) node.textContent = text; };
  document.title = lang === 'th' ? 'ตกปลาทาโร่ 2 — ไอเท็ม คันเบ็ด เหยื่อ และข้อมูล ROM | Kawa no Nushi Tsuri 2' : lang === 'ja' ? '川のぬし釣り2（SFC）アイテム一覧・竿・ルアー・ROM解析' : 'Kawa no Nushi Tsuri 2 (SNES/SFC) — Items, Rods, Lures & ROM Research';
  document.querySelectorAll('[data-t]').forEach(node => { const key=({'th-item':'item','th-rom':'rom','th-price':'price','search-label':'search','category-label':'category','sort-label':'sort','readme-link':'readme'})[node.dataset.t]||node.dataset.t.replace(/-([a-z])/g,(_,c)=>c.toUpperCase()); const value=copy[key]; if (typeof value === 'string') node.textContent = value; });
  document.querySelectorAll('[data-t-placeholder]').forEach(node => { const value = copy[node.dataset.tPlaceholder] ?? copy[node.dataset.tPlaceholder.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]; if (value) node.placeholder = value; });

  const itemLabel = document.querySelector('thead th'); if (itemLabel) itemLabel.textContent = copy.item;
  const headers = document.querySelectorAll('thead th'); if (headers[1]) headers[1].textContent = copy.rom; if (headers[2]) headers[2].textContent = copy.price;
  const imageText = item => lang === 'th' ? item.imageNoteTh : lang === 'ja' ? item.imageNoteJa : item.imageNoteEn;
  const formatYen = item => item.priceYen === null || item.priceYen === undefined ? copy.noPrice : `${copy.yen}${item.priceYen}`;
  const exampleIds = ['rod:0A','rod:0D','lure:12','lure:21','lure:51','food:01','food:0A'];
  const categoryNames = {};
  let allItems = [];

  function renderSamples() {
    const tbody = document.getElementById('sample-rows');
    const selected = exampleIds.map(key => allItems.find(item => `${item.category}:${item.id}` === key)).filter(Boolean);
    tbody.innerHTML = selected.map(item => {
      const summary = copy.quick[`${item.category}:${item.id}`] || itemNotes(item)[0];
      return `<tr><td><div class="sample-item"><img src="${esc(item.image)}" alt=""><div><span class="item-id">${esc(item.id)}</span><strong>${esc(itemName(item))}</strong><small>${esc(item.nameJa)}</small></div></div></td><td>${esc(summary)}</td><td><span class="price-badge">${esc(formatYen(item))}</span></td></tr>`;
    }).join('');
  }
  function renderFrames(data) {
    const box=document.getElementById('customizer-frames');
    box.innerHTML=data.customizerFrames.map((frame,index)=>`<figure class="custom-frame"><a href="${esc(frame.src)}" target="_blank" rel="noopener"><img loading="lazy" src="${esc(frame.src)}" alt="${esc(lang==='th'?frame.captionTh:lang==='ja'?frame.captionJa:frame.captionEn)}"></a><figcaption><span>${String(index+1).padStart(2,'0')}</span>${esc(lang==='th'?frame.captionTh:lang==='ja'?frame.captionJa:frame.captionEn)}</figcaption></figure>`).join('');
  }
  function renderNotes(data) {
    const list=data.researchNotes[lang]||data.researchNotes.en;
    document.getElementById('research-notes').innerHTML=list.map(text=>`<p>${esc(text)}</p>`).join('');
    document.getElementById('sources').innerHTML=data.sources.map(src=>`<p>${src.url?`<a href="${esc(src.url)}" target="_blank" rel="noopener">${esc(lang==='th'?src.titleTh:lang==='ja'?src.titleJa:src.titleEn)} ↗</a>`:`<strong>${esc(lang==='th'?src.titleTh:lang==='ja'?src.titleJa:src.titleEn)}</strong>`}<br><span>${esc(lang==='th'?src.detailTh:lang==='ja'?src.detailJa:src.detailEn)}</span></p>`).join('');
  }
  const player = {
    th:{title:'คู่มือเลือกอุปกรณ์ตกปลา',lead:'เลือกหมวดอุปกรณ์ หรือเลือกปลาที่อยากตก เพื่อดูของที่ใช้ด้วยกันได้และผลที่รู้แล้วจากเกม',menu:'เลือกหมวดอุปกรณ์',all:'ทุกหมวด',fish:'อยากตกปลาอะไร',allFish:'ยังไม่ได้เลือกปลา',use:'ใช้ทำอะไร',compatible:'ปลาที่ใช้ด้วยได้',more:'ดูรายชื่อทั้งหมด',evidence:'หลักฐานทางเทคนิค',compare:'เทียบคันในรูปแบบเดียวกัน',aim:'เวลาเล็ง',reach:'ขอบเขตก่อนเสียอุปกรณ์',style:'รูปแบบการตก',titleByCategory:'อุปกรณ์ในหมวดนี้',noFish:'หมวดนี้ไม่ได้เลือกตามชนิดปลา',fishOnly:'แสดงเหยื่อที่ผ่านเงื่อนไขของปลาที่เลือก',basePrice:'ราคาพื้นฐาน',kit:'ชุดเหยื่อที่ครอบคลุมชนิดปลา',kitText:'ด่าน 1 ซื้อสปูน 2E + ยางหนอน 23 รวม 55 เยน แล้วพกคู่นี้ต่อได้ ไม่ต้องซื้อจมน้ำเพิ่ม ถ้าเริ่มซื้อชุดใหม่ที่ด่าน 4 เลือกจมน้ำ 17 + ยางหนอน 23 รวม 50 เยนได้ ทั้งสองคู่ครอบคลุมเงื่อนไขลัวร์ 38 โปรไฟล์ ไม่ใช่การรับประกันจับสำเร็จ',kitLink:'ดูชุดพร้อมภาพและตารางปลา',guide:'วิธีประกอบฟลายในเกม',research:'รายละเอียดและที่มาของข้อมูล',cat:{rod:'คันเบ็ด',lure:'เหยื่อปลอม',flymaker:'ประกอบฟลาย',bait:'เหยื่อจริง',hook:'ตะขอ / ห่วงปลาอายุ',float_weight:'ทุ่น / เครื่องหมาย / ตะกั่ว',food:'อาหาร / ฟื้น HP',general_tool:'อุปกรณ์และของเควสต์'},desc:{rod:'เลือกวิธีตกก่อน แล้วเลือกคันที่ให้เวลาเล็งหรือขอบเขตก่อนเสียอุปกรณ์ตามที่ต้องการ',lure:'เลือกปลาที่อยากตก เพื่อกรองเหยื่อที่ผ่านเงื่อนไขรับลัวร์',flymaker:'ดูบอดี้ ปีก และหาง พร้อมเงื่อนไขที่มีผลต่อการติดเบ็ด',bait:'เลือกปลาเพื่อดูเหยื่อที่ผ่านเงื่อนไขของการตกด้วยเหยื่อจริง',hook:'ดูตะขอและห่วงที่ใช้กับรูปแบบการตกต่างกัน',float_weight:'ดูอุปกรณ์ทุ่น เครื่องหมายบนสาย และตะกั่ว',food:'ดูผลฟื้น HP และอาหารที่ทำให้ HP หมด',general_tool:'ดูวิธีใช้ ผลที่เกิดขึ้น และเงื่อนไขสถานที่หรือเควสต์จากโค้ดเกม'}},
    en:{title:'Choose your fishing equipment',lead:'Choose an equipment category or a target fish to see compatible items and the effects established from the game.',menu:'Equipment categories',all:'All categories',fish:'Target fish',allFish:'Any fish',use:'What it does',compatible:'Compatible fish',more:'Show all fish',evidence:'Technical evidence',compare:'Compare rods within a fishing style',aim:'Aim window',reach:'Fish-position loss limit',style:'Fishing style',titleByCategory:'Equipment in this category',noFish:'This category is not filtered by fish species',fishOnly:'Showing baits that pass the selected fish’s conditions',basePrice:'Base price',kit:'A lure set covering the compatible species',kitText:'Buy Spoon 2E + Soft worm 23 for ¥55 in area 1 and keep the pair. If starting a new kit in area 4, Sinking 17 + Soft worm 23 costs ¥50. Both cover 38 compatible profiles; buying Sinking after you own Spoon does not save money. Compatibility is not guaranteed landing.',kitLink:'See the illustrated set and fish table',guide:'Make a fly in the game',research:'Research details and sources',cat:{rod:'Rods',lure:'Lures',flymaker:'Fly maker',bait:'Baits',hook:'Hooks / Ayu rings',float_weight:'Floats / markers / sinkers',food:'Food / HP recovery',general_tool:'Tools / quest items'},desc:{rod:'Choose a fishing style, then compare time to aim and the fish-position limit before the traced tackle-loss escape.',lure:'Choose a target fish to filter lures by the hook-acceptance condition.',flymaker:'Browse bodies, wings and tails, with conditions that affect hooking.',bait:'Choose a fish to see baits that pass the bait-mode conditions.',hook:'Hooks and rings used by different fishing styles.',float_weight:'Floats, line markers and sinkers.',food:'Measured recovery and food that drains HP.',general_tool:'How to use each tool, its effects, and location or quest conditions traced from game code.'}},
    ja:{title:'釣り道具を選ぶ',lead:'装備の種類や釣りたい魚を選び、対応する道具とゲームから確認できた効果を見る。',menu:'装備メニュー',all:'全種類',fish:'釣りたい魚',allFish:'指定なし',use:'用途',compatible:'対応する魚',more:'全魚名を見る',evidence:'技術的根拠',compare:'釣り方別に竿を比較',aim:'照準時間',reach:'道具を失う魚位置の境界',style:'釣り方',titleByCategory:'この種類の装備',noFish:'この種類は魚種では絞り込まない',fishOnly:'選んだ魚の条件に合うエサを表示',basePrice:'基本価格',kit:'対応魚を網羅するルアー構成',kitText:'エリア1でスプーン2E＋ソフト・ワーム23を55円で買い、そのまま持ち続ける。エリア4で新しく揃えるなら17＋23は50円。どちらも適合38プロフィールを網羅するが、取り込み保証ではない。スプーン所持後のシンキング追加購入は節約にならない。',kitLink:'画像付き構成と魚別表',guide:'ゲーム内でフライを作る',research:'調査詳細と出典',cat:{rod:'竿',lure:'ルアー',flymaker:'フライ作成',bait:'エサ',hook:'ハリ / アユ鼻カン',float_weight:'ウキ / 目印 / オモリ',food:'食べ物 / HP回復',general_tool:'道具 / イベント品'},desc:{rod:'釣り方を選び、照準時間と道具喪失の魚位置境界を比較。',lure:'魚を選んでルアー針掛かり条件で絞り込む。',flymaker:'ボディ・ウイング・テールと針掛かり条件。',bait:'魚を選んでエサ釣り条件に合うエサを見る。',hook:'釣り方別のハリ・鼻カン。',float_weight:'ウキ・目印・オモリ。',food:'確認済みのHP回復とHPが0になる食べ物。',general_tool:'道具の使い方・効果・場所やイベント条件をゲームコードから確認。'}}
  }[lang];
  const groups=['rod','lure','flymaker','bait','hook','float_weight','food','general_tool'];
  let fishVisuals={};
  let fishLocations={};
  let locationStage='';
  let locationMapIndex=0;
  let flyPart='fly';
  let baitRoute='float';
  let decisions=[];
  let gearPriceGuide={};
  const fishCategories=['all','bait','lure','flymaker','float_weight'];
  let suggestionIds=[], activeSuggestion=-1;
  const pickerCopy={th:{placeholder:'พิมพ์ชื่อปลา เช่น เรนโบว์ หรือ rainbow',clear:'ล้างปลาเป้าหมาย',none:'ไม่พบปลา ลองชื่อไทย อังกฤษ ญี่ปุ่น หรือ ID',count:n=>`พบ ${n} ชนิด ใช้ปุ่มลูกศรแล้วกด Enter หรือกดชื่อปลา`},en:{placeholder:'Type a fish name, e.g. rainbow trout',clear:'Clear target fish',none:'No fish found. Try a Thai, English, Japanese name or ID.',count:n=>`${n} fish found. Use arrow keys and Enter, or click a fish.`},ja:{placeholder:'魚名を入力（例：ニジマス、rainbow）',clear:'魚の指定を解除',none:'見つかりません。日本語・英語・タイ語の名前やIDで検索。',count:n=>`${n}件。矢印キーとEnter、または魚名をクリック。`}}[lang];
  const fishSearchText=id=>[id,...Object.entries(fishVisuals[id]||{}).filter(([key])=>key.startsWith('name')).flatMap(([,value])=>Array.isArray(value)?value:[value])].filter(Boolean).join(' ').normalize('NFKC').toLocaleLowerCase();
  function closeFishSuggestions(){
    document.getElementById('fish-suggestions').hidden=true;
    document.getElementById('fish-search').setAttribute('aria-expanded','false');
    document.getElementById('fish-search').removeAttribute('aria-activedescendant');
    activeSuggestion=-1;
  }
  function showFishSuggestions(){
    const input=document.getElementById('fish-search'),box=document.getElementById('fish-suggestions');
    const selected=document.getElementById('fish-filter').value;
    const term=selected&&input.value===fishName(selected)?'':input.value.normalize('NFKC').trim().toLocaleLowerCase();
    suggestionIds=Object.keys(fishVisuals).filter(id=>id!=='43'&&(!term||fishSearchText(id).includes(term))).sort((a,b)=>fishName(a).localeCompare(fishName(b),lang));
    activeSuggestion=-1;
    box.innerHTML=suggestionIds.map(id=>`<div id="fish-option-${id}" role="option" aria-selected="false" data-fish-choice="${id}"><img src="${esc(fishVisuals[id].image)}" alt=""><span><strong>${esc(fishName(id))}</strong><small>${esc(lang==='ja'?fishVisuals[id].nameLatin||fishVisuals[id].nameLatinVariants?.[0]||'':fishVisuals[id].nameJa||'')}</small></span></div>`).join('')||`<p class="fish-no-match">${esc(pickerCopy.none)}</p>`;
    box.hidden=false;input.setAttribute('aria-expanded','true');input.removeAttribute('aria-activedescendant');
    document.getElementById('fish-search-status').textContent=suggestionIds.length?pickerCopy.count(suggestionIds.length):pickerCopy.none;
  }
  function setupFishPicker(){
    const input=document.getElementById('fish-search'),box=document.getElementById('fish-suggestions');
    input.disabled=false;document.getElementById('fish-clear').disabled=false;input.placeholder=pickerCopy.placeholder;document.getElementById('fish-clear').setAttribute('aria-label',pickerCopy.clear);
    input.addEventListener('input',()=>{if(!input.value.trim())selectFish('');showFishSuggestions();});
    input.addEventListener('focus',showFishSuggestions);
    input.addEventListener('blur',()=>{input.value=document.getElementById('fish-filter').value?fishName(document.getElementById('fish-filter').value):'';closeFishSuggestions();});
    input.addEventListener('keydown',event=>{
      if(event.key==='Escape'){input.value=document.getElementById('fish-filter').value?fishName(document.getElementById('fish-filter').value):'';closeFishSuggestions();return;}
      if(event.key==='ArrowDown'||event.key==='ArrowUp'){
        event.preventDefault();if(box.hidden)showFishSuggestions();if(!suggestionIds.length)return;
        activeSuggestion=event.key==='ArrowDown'?(activeSuggestion+1)%suggestionIds.length:(activeSuggestion<0?suggestionIds.length-1:(activeSuggestion-1+suggestionIds.length)%suggestionIds.length);
        box.querySelectorAll('[role="option"]').forEach((option,index)=>option.setAttribute('aria-selected',index===activeSuggestion?'true':'false'));
        const option=document.getElementById('fish-option-'+suggestionIds[activeSuggestion]);input.setAttribute('aria-activedescendant',option.id);option.scrollIntoView({block:'nearest'});
      }else if(event.key==='Enter'&&!box.hidden){
        event.preventDefault();const id=suggestionIds[activeSuggestion]||(suggestionIds.length===1?suggestionIds[0]:null);if(id)selectFish(id);
      }else if(event.key==='Tab')closeFishSuggestions();
    });
    box.addEventListener('mousedown',event=>event.preventDefault());
    box.addEventListener('click',event=>{const option=event.target.closest('[data-fish-choice]');if(option)selectFish(option.dataset.fishChoice);});
    document.getElementById('fish-clear').addEventListener('click',()=>{selectFish('');input.focus();showFishSuggestions();});
    document.addEventListener('click',event=>{if(!event.target.closest('.fish-combobox'))closeFishSuggestions();});
  }
  function renderTargetCategories(fish){
    const available=fish?groups.filter(c=>fishCategories.includes(c)):groups;
    const select=document.getElementById('category-filter'),current=select.value;
    select.innerHTML=`<option value="all">${esc(player.all)}</option>`+available.map(c=>`<option value="${c}">${esc(player.cat[c])}</option>`).join('');
    select.value=(!fish||fishCategories.includes(current))?current:'all';
    document.getElementById('category-menu').innerHTML=available.map(c=>{const item=allItems.find(i=>groupOf(i)===c);return `<a class="category-button" href="?category=${c}${fish?'&fish='+fish:''}#catalogue" data-category="${c}"><img src="${esc(item?.image)}" alt=""><span><strong>${esc(player.cat[c])}</strong><small>${allItems.filter(i=>groupOf(i)===c&&(!fish||fishIdsFor(i).includes(fish)||(['fly_wing','fly_tail'].includes(i.category)&&flyBundlePartFor(i,fish)))).length}</small></span></a>`;}).join('');
  }
  const groupOf=item=>item.category.startsWith('fly')?'flymaker':item.category;
  const local=value=>typeof value==='string'?value:value?.[lang]||value?.en||'';
  const useOf=item=>item.playerUse||{};
  const fishName=id=>{const f=fishVisuals[id]||{};const latin=f.nameLatin||(f.nameLatinVariants||[]).slice().sort((a,b)=>b.length-a.length)[0];return lang==='th'?(f.nameTh||(f.nameThVariants||[]).join(' / ')||latin||f.nameJa||id):lang==='en'?(f.nameEn||latin||f.nameJa||id):(f.nameJa||id);};
  const fishIdsFor=item=>item.category==='bait'?(useOf(item).fishIdsByRoute?.[baitRoute]||useOf(item).fishIds||[]):(useOf(item).fishIds||[]);
  const detailFile=type=>`${type}${lang==='en'?'':'.'+lang}.html`;
  const sourceReturn=()=>{
    if(typeof location==='undefined')return `index${lang==='en'?'':'.'+lang}.html#catalogue`;
    const query=new URLSearchParams(location.search);
    for(const [param,id] of [['q','search'],['sort','sort-filter'],['style','style-filter']]){
      const value=document.getElementById(id).value;
      if(value)query.set(param,value);else query.delete(param);
    }
    if(locationStage)query.set('stage',locationStage);else query.delete('stage');
    query.set('route',baitRoute);query.set('map',String(locationMapIndex));
    return location.pathname.split('/').pop()+'?'+query+location.hash;
  };
  const itemHref=item=>`${detailFile('item')}?category=${encodeURIComponent(item.category)}&id=${encodeURIComponent(item.id)}${document.getElementById('fish-filter').value?'&fish='+document.getElementById('fish-filter').value:''}${locationStage?'&stage='+locationStage:''}&return=${encodeURIComponent(sourceReturn())}`;
  const fishHref=id=>`${detailFile('fish')}?id=${encodeURIComponent(id)}${locationStage?'&stage='+locationStage:''}&return=${encodeURIComponent(sourceReturn())}`;
  const detailLabel=lang==='th'?'ดูรายละเอียด':lang==='ja'?'詳細を見る':'View details';
  const decisionLink=ref=>{const item=allItems.find(i=>i.category===ref.category&&i.id===ref.id);return item?`<a class="decision-item" href="${esc(itemHref(item))}"><img src="${esc(item.image)}" alt=""><span>${esc(itemName(item))}</span></a>`:'';};
  function decisionCard(d) {
    return `<article class="decision-card"><h3>${esc(local(d.title))}</h3><p class="decision-action">${esc(local(d.recommendation))}</p>${d.reason?`<p>${esc(local(d.reason))}</p>`:''}<div class="decision-items">${(d.items||[]).map(decisionLink).join('')}</div>${d.scope?`<small>${esc(local(d.scope))}</small>`:''}</article>`;
  }
  function renderDecisions(category) {
    const title=lang==='th'?'ซื้ออะไร พกอะไร ทำอะไรก่อนตก':lang==='ja'?'買う・持つ・釣る前にすること':'What to buy, carry and do before fishing';
    const tip=lang==='th'?'ใช้ลัวร์หรือตีเหยื่อ: เติม HP ให้ถึง 100 ก่อน ถ้าอยากได้เวลาเล็งเต็มของคัน':lang==='ja'?'ルアー・投げ釣り：照準時間を最大にするには、先にHPを100まで回復する。':'Lure / casting: restore HP to 100 first to get your rod’s full aiming time.';
    const scope=lang==='th'?'หลักฐานนี้ยืนยันผลเรื่องเวลาเล็ง ยังไม่ได้ยืนยันโบนัสโอกาสปลากินเหยื่อ':lang==='ja'?'照準時間への効果を確認。食いつき率ボーナスは未確認。':'This restores aiming time; a bite-rate bonus is not established.';
    document.getElementById('player-decisions').hidden=!!document.getElementById('fish-filter').value;
    document.getElementById('player-decisions').innerHTML=`<h2>${title}</h2><aside class="play-tip"><strong>${tip}</strong><p>${scope}</p></aside><div class="decision-grid">${decisions.map(decisionCard).join('')}</div>`;
    const style=document.getElementById('style-filter').value;
    const decisionStyles={float_rod_path:'1',casting_rod_path:'2',lure_rod_path:'4',fly_rod_path:'8'};
    const selectedFish=document.getElementById('fish-filter').value;
    const categoryChoices=decisions.filter(d=>!selectedFish&&d.category===category&&(category!=='rod'||!style||decisionStyles[d.id]===style)&&!(category==='flymaker'&&selectedFish));
    document.getElementById('category-decisions').innerHTML=(category==='all'?'':categoryChoices.map(decisionCard).join(''))+flyDecision(category)+(category==='float_weight'?floatPriceGuide():'');
  }
  function floatPriceGuide(){
    const title=lang==='th'?'ซื้อทุ่นหรือตะกั่วที่ไหนให้ถูกสุดในด่านนี้':lang==='ja'?'現在のエリアで最安のウキ・オモリを買う':'Cheapest stocked float or sinker in your area';
    const note=lang==='th'?'มีรุ่นเดิมอยู่แล้วใช้ต่อได้ ตารางนี้เลือกจากราคาของที่มีขาย ไม่ใช่อันดับจับปลา ทุ่นกับตะกั่วใช้คนละชุดปลา: เปิดรายละเอียดเพื่อตรวจปลาเป้าหมายก่อนซื้อ':lang==='ja'?'所持品はそのまま使えます。店頭価格による選択であり釣果順位ではありません。ウキとオモリの対応魚は違うため、購入前に詳細で魚を確認してください。':'Keep the model you own. These choices use recorded shop prices, not catch rankings. Float and sinker routes accept different fish; check the item profile for your target before buying.';
    const none=lang==='th'?'ไม่พบในสต็อกด่านนี้':lang==='ja'?'店頭記録なし':'No recorded stock';
    const choice=(kind,stage)=>{const row=gearPriceGuide[kind]?.[stage];if(!row)return none;const item=allItems.find(i=>i.category===row.category&&i.id===row.id);return `<a href="${esc(itemHref(item))}">${esc(itemName(item))} (${row.id}) · ¥${row.priceYen}</a>`;};
    return `<section class="decision-card" id="float-price-guide"><h3>${title}</h3><p>${note}</p><div class="table-wrap"><table><thead><tr><th>${lang==='th'?'ด่าน':lang==='ja'?'エリア':'Area'}</th><th>${lang==='th'?'ทุ่น':lang==='ja'?'ウキ':'Float'}</th><th>${lang==='th'?'ตะกั่ว':lang==='ja'?'オモリ':'Sinker'}</th></tr></thead><tbody>${[1,2,3,4,5,6].map(stage=>`<tr><td>${stage}</td><td>${choice('float',stage)}</td><td>${choice('sinker',stage)}</td></tr>`).join('')}</tbody></table></div></section>`;
  }
  function flyDecision(category) {
    const fish=document.getElementById('fish-filter').value;
    if(!['flymaker','all'].includes(category)||!fish)return '';
    const stage=Number(locationStage||(fishLocations[fish]?.locations||[])[0]?.stage);
    const offers=allItems.filter(i=>i.category==='fly'&&(useOf(i).fishIds||[]).includes(fish)).flatMap(i=>(useOf(i).shops||[]).filter(s=>s.bundle).map(s=>({body:i,...s}))).sort((a,b)=>a.bundle.shopPriceYen-b.bundle.shopPriceYen||a.stage-b.stage);
    const sameArea=offers.filter(o=>o.stage===stage),offer=(sameArea.length?sameArea:offers)[0];
    if(!offer)return `<article class="decision-card"><h3>${lang==='th'?'ปลานี้ควรใช้อะไร':lang==='ja'?'この魚には何を使うか':'What to use for this fish'}</h3><p>${lang==='th'?'ยังไม่มีชุดฟลายสำเร็จรูปที่ผ่านเงื่อนไขบอดี้ให้แนะนำ ลองเลือกหมวดเหยื่อจริงหรือลัวร์สำหรับปลานี้':lang==='ja'?'ボディ判定に合う店売り毛バリは案内できない。この魚のエサ・ルアーを選ぶ。':'No qualifying ready-made fly is listed. Switch to bait or lure for this target.'}</p></article>`;
    const b=offer.bundle,refs=[{category:'fly',id:b.body},{category:'fly_wing',id:b.wing},{category:'fly_tail',id:b.tail}].filter(r=>r.id!=='00');
    const action=lang==='th'?`สำหรับ${fishName(fish)} เริ่มลองชุดนี้ได้: ร้านฟลายด่าน ${offer.stage} ราคา ${b.shopPriceYen} เยนทั้งชุด` :lang==='ja'?`${fishName(fish)}なら、この構成から試せる。エリア${offer.stage}の毛バリ店、完成品${b.shopPriceYen}円。`:`For ${fishName(fish)}, start with this ready-made fly: area ${offer.stage} fly shop, ¥${b.shopPriceYen} for the complete bundle.`;
    const reason=lang==='th'?`เลือกชุดราคาต่ำสุดที่บอดี้ผ่านเงื่อนไขปลานี้${sameArea.length?'ในด่านของแผนที่ที่เลือก':''} เพื่อลดเงินที่ต้องจ่าย ไม่ใช่เพราะพิสูจน์ว่าจับง่ายที่สุด`:lang==='ja'?`ボディ判定に合う${sameArea.length?'選択エリア内の':''}最安の店売り構成を選び、出費を抑える。釣果の最良構成ではない。`:`Lowest listed price among qualifying bodies${sameArea.length?' in the selected fishing area':''}, to limit your spending; not a proven best-catching fly.`;
    const scope=lang==='th'?'ยังมีเงื่อนไขซ่อนของบอดี้กับปีก ถ้าปลาไม่กิน การตีซ้ำไม่สุ่มค่านั้นใหม่ อย่าเหมาว่าราคาสูงกว่าจะดีกว่า':lang==='ja'?'隠しボディ・ウィング条件も残る。投げ直しでは再抽選されず、高価なほど良いとは限らない。':'Hidden body/wing conditions still apply. Recasting does not reroll them; paying more is not an established advantage.';
    return decisionCard({title:lang==='th'?'ชุดฟลายสำหรับปลาที่เลือก':lang==='ja'?'選んだ魚の毛バリ候補':'Fly to try for your selected fish',recommendation:action,reason,scope,items:refs});
  }
  const matchCategory=(item,category)=>category==='all'||(category==='flymaker'?item.category.startsWith('fly'):item.category===category);
  function renderFilters() {
    document.getElementById('category-filter').innerHTML=`<option value="all">${esc(player.all)}</option>`+groups.map(c=>`<option value="${c}">${esc(player.cat[c])}</option>`).join('');
    document.getElementById('style-filter').innerHTML=`<option value="">${esc(player.all)}</option>`+Object.entries(lang==='th'?{1:'ทุ่น / อายุ',2:'ตีเหยื่อ',4:'ลัวร์',8:'ฟลาย'}:lang==='ja'?{1:'ウキ・アユ',2:'投げ',4:'ルアー',8:'フライ'}:{1:'Float / Ayu',2:'Casting',4:'Lure',8:'Fly'}).map(([k,v])=>`<option value="${k}">${esc(v)}</option>`).join('');
    set('#style-filter-label',player.style);
    document.getElementById('sort-filter').innerHTML=`<option value="id">${esc(copy.sortId)}</option><option value="name">${esc(copy.sortName)}</option>`;

    document.getElementById('category-menu').innerHTML=groups.map(c=>{const i=allItems.find(i=>groupOf(i)===c);return `<a class="category-button" href="?category=${c}#catalogue" data-category="${c}"><img src="${esc(i?.image)}" alt=""><span><strong>${esc(player.cat[c])}</strong><small>${allItems.filter(i=>groupOf(i)===c).length}</small></span></a>`;}).join('');
  }
  function detailedFields(item) {
    const originalEvidence=useOf(item).evidence||{};
    const evidence={...originalEvidence,sources:[...new Set([...(originalEvidence.sources||[]),...(item.rodDecision?.sources||[]),...(item.gearDecision?.sources||[])])]};
    const sourceInfo=evidence.type?`<p>${esc(lang==='th'?'ที่มาของคำอธิบาย':lang==='ja'?'説明の根拠':'Explanation source')}: ${esc(evidence.type)}</p>${(evidence.sources||[]).map(s=>`<p><a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/${esc(s)}" target="_blank" rel="noopener"><code>${esc(s)}</code> ↗</a></p>`).join('')}`:'';
    const bytes=item.recordBytesHex?`<p><b>${esc(copy.offset)}:</b> <code>${esc(item.fileOffset||'—')}</code></p><p><b>${esc(copy.bytes)}:</b> <code>${esc(item.recordBytesHex)}</code></p>`:`<p>${esc(copy.none)}</p>`;
    const decoded=Object.entries(item.decodedFields||{}).filter(([key])=>!['nameJapanese','nameEnglish','condition'].includes(key)).map(([key,value])=>`<dt>${esc(copy.fieldNames[key]||key)}</dt><dd>${esc(typeof value==='object'?JSON.stringify(value):value)}</dd>`).join('');
    const use=useOf(item),targets=use.targetMatches?(Array.isArray(use.targetMatches)?use.targetMatches:[use.targetMatches]):[];
    const response=targets.length?`<p>${lang==='th'?'มีการคำนวณตอบสนองเฉพาะปลา แต่ยังใช้จัดอันดับจับง่ายไม่ได้':lang==='ja'?'魚別の応答計算。取り込みやすさの順位には未使用。':'Fish-specific response calculation; not a landing recommendation.'}: ${targets.map(t=>esc(fishName(t.fishId))).join(', ')}</p>`:'';
    const hookTrace=(item.category==='rod'||['hook','fly_wing','fly_tail','float_weight'].includes(item.category)||(item.category==='food'&&item.id==='08')||use.specialResponseTarget)?`<p>${esc(local(use.summary))}</p><ul>${(use.facts?.[lang]||[]).map(f=>`<li>${esc(f)}</li>`).join('')}</ul>`:'';
    return `<details class="record-details"><summary>${esc(player.evidence)}</summary>${sourceInfo}${response}${hookTrace}${use.comparison?`<p>${esc(local(use.comparison))}</p>`:''}<p>${esc(copy.priceField)}: ${esc(formatYen(item))}</p><ul class="stat-list">${(useOf(item).evidenceNotes?.[lang]||[]).map(n=>`<li>${esc(n)}</li>`).join('')}</ul>${lang==='th'&&!item.nameTh&&useOf(item).displayName?.th?'<p>ชื่อไทย: คำแปลชื่อภาษาญี่ปุ่นสำหรับคู่มือนี้</p>':''}${bytes}${decoded?`<h4>${esc(copy.decoded)}</h4><dl>${decoded}</dl>`:''}<a class="frame-link" href="${esc(item.frame)}" target="_blank" rel="noopener">${esc(copy.openFrame)}</a></details>`;
  }
  function thaiLabel(item) {
    return lang==='th'&&item.labelImageTh?`<img class="thai-rom-label" loading="lazy" src="${esc(item.labelImageTh)}" alt="${esc(item.nameTh||'ชื่อในเกมไทย')}">`:'';
  }
  function visibleUse(item) {
    const use=useOf(item);
    if(item.category==='food'&&item.id==='08')return {summary:lang==='th'?'ตรวจชื่อปลาที่เมนูแสดงก่อนกิน เพราะเกมกินตัวแรกในข้อง ถ้าเป็นคุซะฟุกุอย่ากิน: HP จะเหลือ 0':lang==='ja'?'食べる前に表示された魚名を確認する。びくの先頭を食べる。クサフグなら食べない：HPが0になる。':'Check the displayed fish name before eating: the game eats the first keepnet fish. Do not eat Kusafugu; it sets HP to zero.',facts:[lang==='th'?'ถ้าต้องการฟื้น HP โดยไม่เสียปลาตัวแรก ให้ซื้ออาหารแทน ปลาปกติฟื้นตามขนาด แต่กินแล้วปลาตัวนั้นหายไป':lang==='ja'?'先頭の魚を残して回復したいなら食料を買う。普通の魚はサイズに応じて回復するが、食べると失う。':'Buy food instead if you want to keep the first fish. Ordinary fish restore HP by size, but eating removes that fish.']};
    if(item.gearDecision)return {summary:local(item.gearDecision.recommendation),facts:[local(item.gearDecision.reason)].filter(Boolean)};
    if(item.category==='rod'&&item.rodDecision)return {summary:local(item.rodDecision.recommendation),facts:[local(item.rodDecision.reason)].filter(Boolean)};
    if(item.category==='hook')return {summary:local(use.summary),facts:use.facts?.[lang]||[]};
    if(item.category==='fly_wing')return {summary:lang==='th'?'ประกอบเองให้เริ่มจากปีกที่มีอยู่และตรวจราคาเสนอก่อนจ่าย ไม่ต้องซื้อปีกแพงเพื่อหวังโบนัสจับปลา เพราะยังไม่มีหลักฐานรองรับ':lang==='ja'?'作成するなら手持ちのウィングから始め、確定前に見積額を確認する。釣果ボーナスを期待して高価なウィングを買う根拠はない。':'For a custom fly, start with a wing you have and check the quote before paying. There is no established catch bonus that justifies buying an expensive wing.',facts:[lang==='th'?'เกมมีเงื่อนไขซ่อนที่ตรวจบอดี้กับปีก ถ้าปลาไม่กิน การตีชุดเดิมซ้ำไม่ได้สุ่มเงื่อนไขนี้ใหม่ รายละเอียดอยู่ในหลักฐาน':lang==='ja'?'隠しボディ・ウィング条件は同じ構成の投げ直しでは再抽選されない。詳細は根拠を参照。':'Recasting the same setup does not reroll the hidden body/wing condition; details are in the evidence.']};
    if(item.category==='fly_tail')return {summary:lang==='th'?'เลือกหางนี้ถ้าชอบรูปและยอมรับราคาเสนอ หรือเลือก “ไม่มี” ในเมนูประกอบที่มีตัวเลือกนั้น ยังไม่มีหลักฐานว่าหางนี้เพิ่มโอกาสจับปลา':lang==='ja'?'見た目と見積額で選ぶ。「無し」がある作成画面では省略できる。このテールの釣果ボーナスは確認していない。':'Choose this tail for its appearance and quoted price, or choose “None” where the maker offers it. A catch advantage from this tail is not established.',facts:[]};
    if(item.category==='float_weight')return {summary:local(use.summary),facts:use.facts?.[lang]||[]};
    return {summary:local(use.summary)||player.desc[groupOf(item)],facts:use.specialResponseTarget?[]:(use.facts?.[lang]||use.facts?.en||[])};
  }
  function fishList(item) {
    if(item.category==='rod')return '';
    const use=useOf(item),ids=fishIdsFor(item);
    const targets=use.targetMatches?(Array.isArray(use.targetMatches)?use.targetMatches:[use.targetMatches]):[];
    if(!ids.length&&!targets.length)return '';
    const chip=id=>{id=String(id).replace(/^0x/i,'').toUpperCase().padStart(2,'0');const f=fishVisuals[id]||{};return `<a class="fish-chip" data-entity="fish" href="${esc(fishHref(id))}" aria-label="${esc(fishName(id))} — ${detailLabel}">${f.image?`<img loading="lazy" src="${esc(f.image)}" alt="">`:''}<span>${esc(fishName(id))}</span><small>${detailLabel} ↗</small></a>`;};
    if(!ids.length)return '';
    const fishHeading=item.category==='general_tool'&&['08','09','0A'].includes(item.id)?(lang==='th'?'ปลาและสัตว์ที่ชี้ทิศเข้าหาจุดโปรยได้':lang==='ja'?'寄せエサへ誘導できる魚・生き物':'Creatures steered toward groundbait'):player.compatible;
    return `<div class="compatible-fish"><h4>${esc(fishHeading)} · ${ids.length}</h4><p class="fish-scope">${esc(item.category==='bait'?(lang==='th'?`สำหรับ${baitRoute==='float'?'ชุดทุ่น':'ชุดตะกั่ว'} — ผ่านเงื่อนไขรับเหยื่อ ยังต้องวางเหยื่อให้เจอปลาและดึงขึ้นสำเร็จ`:lang==='ja'?`${baitRoute==='float'?'ウキ':'オモリ'}仕掛けのエサ判定に適合。位置・タイミング・取り込みも必要。`:`${baitRoute==='float'?'Float':'Sinker'} rig: passes bait-acceptance conditions; position, timing and landing still matter.`):local(use.fishScope))}</p><div class="fish-chips">${ids.slice(0,6).map(chip).join('')}</div>${ids.length>6?`<details class="more-fish"><summary>${esc(player.more)} (${ids.length})</summary><div class="fish-chips">${ids.slice(6).map(chip).join('')}</div></details>`:''}</div>`;
  }
  function shopLocations(item) {
    const shops=useOf(item).shops||[];
    if(!shops.length){
      if(!Object.hasOwn(useOf(item),'shops')||!['rod','float_weight'].includes(item.category))return '';
      return `<div class="shop-locations"><p>${lang==='th'?'ไม่พบรหัสนี้ในสต็อกร้านทั้ง 6 ด่านที่ถอดได้ จึงยังไม่มีจุดซื้อให้แนะนำสำหรับชิ้นนี้':lang==='ja'?'復号した全6エリアの店の在庫にはこのIDがなく、この部品の購入場所は案内できない。':'This ID is absent from the decoded stocks of all six area shops, so no purchase location is listed for this record.'}</p></div>`;
    }
    const title=lang==='th'?'ซื้อที่ไหน':lang==='ja'?'購入場所':'Where to buy';
    const area=lang==='th'?'ด่าน':lang==='ja'?'エリア':'Area';
    const shopLink=stage=>{const q=new URLSearchParams({stage:String(stage),place:'town',category:item.category,id:item.id,return:sourceReturn()});return `<a href="${esc(detailFile('shops')+'?'+q)}">${esc(area+' '+stage)} ↗</a>`;};
    const regular=[...new Set(shops.filter(s=>s.shop!=='special_rod_shop').map(s=>s.stage))].map(shopLink).join(' · ');
    const regularLabel=item.category.startsWith('fly')?(lang==='th'?'ชิ้นส่วนนี้อยู่ในชุดฟลายสำเร็จรูปที่ร้านขาย':lang==='ja'?'この部品を含む店売り毛バリ':'Part included in a ready-made fly sold by the shop'):(lang==='th'?'ร้านค้าในเมือง':lang==='ja'?'町の店':'Town shop');
    const special=[...new Set(shops.filter(s=>s.shop==='special_rod_shop').map(s=>s.stage))].map(shopLink).join(' · ');
    const condition=shops.some(s=>s.condition)?(lang==='th'?'ขายปลาอายุจากข้องอย่างน้อย 1 ตัวก่อนเพื่อให้เหยื่อล่อปลาอายุปรากฏในร้านด่าน 3 เมื่อซื้อ จำนวนในช่องเต็มเป็น 9 ชิ้น และจำนวนปลาอายุที่ขายสะสมลดลง 9 (ต่ำสุด 0) ถ้าสินค้าหายจากเมนู ให้ขายปลาอายุเพิ่ม':lang==='ja'?'びくからアユを1匹以上売るとエリア3でオトリアユが販売される。購入で所持数は9個、売却数カウンターは9減る（最低0）。消えたらアユを追加で売る。':'Sell at least one Ayu from your keepnet to enable decoy Ayu in area 3. Buying sets the stack to 9 and reduces the sold-Ayu counter by 9 (minimum 0). If the offer disappears, sell more Ayu.') : '';
    const bundleTitle=lang==='th'?'ดูชุดฟลายสำเร็จรูปและราคาทั้งชุด':lang==='ja'?'店売り毛バリの組み合わせと価格':'Ready-made fly combinations and full prices';
    const bundles=item.category.startsWith('fly')?`<details class="bundle-offers"><summary>${bundleTitle}</summary>${shops.filter(s=>s.bundle).map(s=>{
      const b=s.bundle,parts=[['fly',b.body],['fly_wing',b.wing],['fly_tail',b.tail]].filter(([c,id])=>id!=='00').map(([c,id])=>allItems.find(i=>i.category===c&&i.id===id)).filter(Boolean);
      return `<div><strong>${area} ${s.stage} · ¥${b.shopPriceYen}</strong><p>${parts.map(p=>`<a href="${esc(itemHref(p))}"><img loading="lazy" src="${esc(p.image)}" alt="${esc(itemName(p))}" title="${esc(itemName(p))} ID ${p.id}"></a>`).join('')}</p><small>${parts.map(p=>`<a href="${esc(itemHref(p))}">${esc(itemName(p))} (${p.id})</a>`).join(' + ')}</small></div>`;
    }).join('')}</details>`:'';
    return `<div class="shop-locations"><h4>${title}</h4>${regular?`<p>${regularLabel} · ${regular}</p>`:''}${special?`<p>${lang==='th'?'ร้านคันเบ็ดพิเศษในเมือง':lang==='ja'?'町の専用竿店':'Special rod merchant in town'} · ${special}</p>`:''}${condition?`<p>${condition}</p>`:''}${bundles}</div>`;
  }
  function gatheredBaitChoices(item){
    if(!item.gatheredBaitByArea)return '';
    const title=lang==='th'?'เหยื่อที่ตาข่ายหาได้: เลือกดูว่าใช้ตกปลาอะไร':lang==='ja'?'金アミで採れるエサ：対応魚を見る':'Baits gathered with the net: see which fish accept them';
    return `<section class="detail-section gathered-bait"><h3>${title}</h3>${Object.entries(item.gatheredBaitByArea).map(([stage,id])=>{const bait=allItems.find(i=>i.category==='bait'&&i.id===id);return `<p>${lang==='th'?'ด่าน':lang==='ja'?'エリア':'Area'} ${stage} · <a data-gathered-bait href="${esc(itemHref(bait))}">${esc(itemName(bait))} (${id}) ↗</a></p>`;}).join('')}</section>`;
  }
  function baitGatherChoice(item){
    if(!item.netGatherArea)return '';
    const note=lang==='th'?`ถ้ามีตาข่ายสีทองอยู่แล้ว หาเหยื่อนี้ได้ในด่าน ${item.netGatherArea}: ยืนในน้ำตื้น ใช้ตาข่าย แล้วขยับช่องก่อนใช้ซ้ำ แทนการซื้อเหยื่อเพิ่ม` :lang==='ja'?`金アミを持っているならエリア${item.netGatherArea}の浅瀬でこのエサを採れます。浅瀬に立って使い、次は別のタイルへ移動してください。追加購入の代わりになります。`:`If you already own the gold net, gather this bait in area ${item.netGatherArea} instead of buying more: stand in shallow water, use the net, then move to a new tile before using it again.`;
    const label=lang==='th'?'ดูวิธีใช้ตาข่ายและจำนวนที่เก็บได้':lang==='ja'?'金アミの使い方と採れる個数を見る':'See net use and gathering amounts';
    return `<aside class="detail-section bait-gather-choice" data-bait-gather-choice><p>${esc(note)}</p><a href="${esc(itemHref(allItems.find(i=>i.category==='general_tool'&&i.id==='04')))}">${label} ↗</a></aside>`;
  }
  function mushroomAlternative(item){
    if(item.category!=='food'||!['09','0A'].includes(item.id))return '';
    return `<p><a class="route-button" data-mushroom-alternative href="${esc(itemHref(allItems.find(i=>i.category==='food'&&i.id==='01')))}">${lang==='th'?'ดูส้ม: ฟื้น 5 HP ราคา ¥5 พร้อมร้านที่ขาย':lang==='ja'?'みかんを見る：5HP回復・5円、販売場所付き':'See oranges: restore 5 HP for ¥5, with shops'} ↗</a></p>`;
  }
  function acquisitionChoice(item){
    const entries=item.acquisitionOptions||[];
    if(!entries.length)return '';
    const title=item.playerUse?.shops?.length?(lang==='th'?'รับจากหีบก่อนซื้อซ้ำ':lang==='ja'?'重複購入の前に宝箱から入手':'Check the chest before buying another copy'):(lang==='th'?'รับไอเท็มนี้จากหีบ':lang==='ja'?'この道具を宝箱から入手':'Get this item from a chest');
    const open=lang==='th'?'ดูจุดรับของและทางเข้าเมือง':lang==='ja'?'入手地点と町の入口を見る':'See the reward location and town entrance';
    return `<aside class="shop-locations acquisition-choice" data-acquisition-choice><h4>${title}</h4>${entries.map(loc=>`<p><strong>${lang==='th'?'ด่าน':lang==='ja'?'エリア':'Area'} ${loc.stage}</strong> · ${esc(local(loc.name))}</p><p>${esc(local(loc.action))}</p>`).join('')}<a href="${esc(itemHref(item))}#use-locations">${open} ↗</a></aside>`;
  }
  function toolUseLocations(item) {
    const locations=useOf(item).useLocations||[];
    if(!locations.length)return '';
    const heading=lang==='th'?'ดูจุดรับและใช้ไอเท็ม':lang==='ja'?'入手・使用場所を地図で見る':'See where to obtain or use this item';
    const area=lang==='th'?'ด่าน':lang==='ja'?'エリア':'Area';
    const open=lang==='th'?'ดูแผนที่ทั้งด่าน':lang==='ja'?'エリア全体の地図':'Full area map';
    function section(l) {
      const markers=(l.markerItems||(l.markerItem?[l.markerItem]:[{category:item.category,id:item.id}])).map(m=>allItems.find(i=>i.category===m.category&&i.id===m.id)||item);
      const names=markers.map(itemName).join(lang==='th'?' หรือ ':lang==='ja'?' または ':' or ');
      const note=l.forage?(lang==='th'?'เดินไปยืนตรงรูปเหยื่อแล้วใช้แว่นขยาย สองรูปหมายถึงได้อย่างใดอย่างหนึ่ง ถ้าค้นซ้ำต้องขยับช่องก่อน':lang==='ja'?'エサ画像の地点へ歩き、虫メガネを使う。2画像はどちらか1種。再度探すときは移動する。':'Walk to the bait image and use the magnifying glass. Two images mean either result, not both. Move before searching again.'):(lang==='th'?'รูปไอเท็มชี้จุดคุยหรือจุดใช้บนภาพฉากจากเกม':lang==='ja'?'道具画像はゲーム地形上の会話・使用地点を示します。':'The item image marks the interaction or use point on game terrain.');
      const context=l.context==='town'?(lang==='th'?'ในเมือง':lang==='ja'?'町内':'In town'):(lang==='th'?'กลางแจ้ง':lang==='ja'?'屋外':'Outdoors');
      const fullLabel=l.context==='town'?(lang==='th'?'เปิดภาพในเมืองทั้งห้าห้อง':lang==='ja'?'町の5室の地形を見る':'Open town terrain for all five rooms'):open;
      const stepLabel=lang==='th'?'เปิดขั้นตอนรับ/ใช้ของและทางเข้า':lang==='ja'?'入手・使用手順と入口を見る':'Open acquisition/use steps and entrance';
      return `<section class="location-map"><h4>${area} ${l.stage} · ${context} · ${esc(l.forage?names:local(l.name))}</h4><div class="map-canvas" style="aspect-ratio:${l.width}/${l.height}"><img class="map-background" loading="lazy" src="${esc(l.image)}" alt="${esc(local(l.name))}"><span class="map-pin" style="left:${l.pin.x*100}%;top:${l.pin.y*100}%">${markers.map(m=>`<a href="${esc(m.category===item.category&&m.id===item.id?l.image:itemHref(m))}" aria-label="${esc(itemName(m))} — ${m.category===item.category&&m.id===item.id?(lang==='th'?'เปิดภาพจุดนี้':lang==='ja'?'この場所の画像を開く':'Open this location image'):detailLabel}"><img src="${esc(m.image)}" alt="${esc(itemName(m))}"></a>`).join('')}</span></div><p class="fish-scope">${esc(note)} · X ${l.tileX}, Y ${l.tileY}</p>${l.action?`<p class="acquisition-action">${esc(local(l.action))}</p>`:''}${l.useWindow?`<p>${lang==='th'?'ใช้ดอกไม้ไฟขณะยืนในช่วง':lang==='ja'?'花火の使用範囲':'Fireworks activation tiles'} X ${l.useWindow.xMin}–${l.useWindow.xMax}, Y ${l.useWindow.yMin}–${l.useWindow.yMax}</p>`:''}<a href="${esc(l.fullImage)}" target="_blank" rel="noopener">${fullLabel} ↗</a>${l.context==='town'?` · <a href="${esc(itemHref(item))}#use-locations">${esc(stepLabel)} ↗</a>`:''}</section>`;
    }
    const content=locations.some(l=>l.forage)?[...new Set(locations.map(l=>l.stage))].map(stage=>`<details class="forage-stage"><summary>${area} ${stage}</summary>${locations.filter(l=>l.stage===stage).map(section).join('')}</details>`).join(''):locations.map(section).join('');
    return `<details class="tool-use-map"><summary>${heading}</summary>${content}</details>`;
  }
  function renderFishLocation(id) {
    const box=document.getElementById('fish-location-panel');
    const mapPage=lang==='th'?'maps.th.html':lang==='ja'?'maps.ja.html':'maps.html';
    const mapPageLabel=lang==='th'?'เปิดหน้าแผนที่และปลา':lang==='ja'?'地図と魚のページを開く':'Open maps and fish browser';
    const title=lang==='th'?'ปลาตัวนี้อยู่ที่ไหน':lang==='ja'?'この魚はどこにいる？':'Where to find this fish';
    if(!id){box.innerHTML=`<h2>${title}</h2><p>${lang==='th'?'เลือกปลาในช่องด้านบน หรือกดรูปปลาบนการ์ดเหยื่อ เพื่อดูด่าน แผนที่ และจุดตก':lang==='ja'?'上の魚選択欄、またはエサの魚画像を押すと、エリア・地図・釣り場が見られます。':'Choose a fish above or click a fish portrait on a bait card to see its area, map and fishing spots.'}</p><a class="map-browser-cta" href="${mapPage}">${mapPageLabel} ↗</a>`;return;}
    const fish=fishVisuals[id]||{},entry=fishLocations[id]||{},locations=entry.locations||[];
    if(!locations.some(l=>String(l.stage)===locationStage))locationStage=String(locations[0]?.stage||'');
    const chosen=locations.find(l=>String(l.stage)===locationStage);
    document.getElementById('map-browser-link').href=`${lang==='th'?'maps.th.html':lang==='ja'?'maps.ja.html':'maps.html'}?fish=${id}${chosen?'&stage='+chosen.stage:''}`;
    const stageWord=lang==='th'?'ด่าน':lang==='ja'?'エリア':'Area';
    const openMap=lang==='th'?'เปิดแผนที่ขนาดเต็ม':lang==='ja'?'地図を原寸で開く':'Open full-size map';
    const sourceWord=lang==='th'?'แผนที่ต้นฉบับ / ที่มา':lang==='ja'?'元の地図・出典':'Original map / source';
    const unknown=lang==='th'?'ยังไม่มีตำแหน่งที่ตรวจสอบได้สำหรับปลานี้ จะไม่เดาตำแหน่งจากรายชื่อเหยื่อ':lang==='ja'?'この魚の釣り場はまだ確認できていません。エサの適合表から場所は推測しません。':'No verified location is available yet. Bait compatibility does not establish a habitat.';
    const mapChoices=chosen?.maps||[];
    if(locationMapIndex>=mapChoices.length)locationMapIndex=0;
    const overview=chosen?.overview,viewBox=mapChoices[locationMapIndex]?.overviewBox;
    const overviewHtml=overview&&viewBox?`<figure class="area-overview"><figcaption>${lang==='th'?'ภาพรวมทั้งด่าน · กรอบแสดงส่วนที่เปิดอยู่':lang==='ja'?'エリア全体 · 枠は下の拡大範囲':'Full area · outline marks the view below'}${overview.rotated?` · ${lang==='th'?'ด้านบนของฉากอยู่ทางซ้าย':lang==='ja'?'元の画面の上方向は左':'Original top is on the left'}`:''}</figcaption><div style="aspect-ratio:${overview.width}/${overview.height};max-width:${Math.min(900,overview.width/overview.height*400)}px"><img src="${esc(overview.image)}" alt="${esc(local(chosen.stageName))}"><span style="left:${viewBox.x*100}%;top:${viewBox.y*100}%;width:${viewBox.width*100}%;height:${viewBox.height*100}%"></span></div></figure>`:'';
    const mapMenu=mapChoices.length>1?`<label class="location-map-select">${lang==='th'?'เลือกส่วนของแผนที่':lang==='ja'?'地図の部分を選ぶ':'Map section'}<select id="location-map-select">${mapChoices.map((m,i)=>`<option value="${i}" ${i===locationMapIndex?'selected':''}>${esc(local(m.name))} · ${m.pins?.length||0} ${lang==='th'?'จุด':lang==='ja'?'地点':'points'}</option>`).join('')}</select></label>`:'';
    const maps=mapChoices.filter((m,i)=>i===locationMapIndex).map((map,index)=>{
      const pins=map.pins||[];
      const mapTitle=local(map.name)||`${lang==='th'?'แผนที่':lang==='ja'?'地図':'Map'} ${index+1}`;
      const pinNote=lang==='th'?'รูปปลาและหมายเลขชี้บริเวณที่ควรลองตก พิกัดจุดเกิดที่กำหนดใน ROM; บางจุดอาจไม่มีปลาในรอบที่เกมสร้างปลา':lang==='ja'?'魚画像と番号は狙う目安です。ROMの地図データから抽出した座標です。魚の生成状態によって無効な地点があります。':'Fish portraits and numbers mark places to try. Coordinates are extracted from ROM map data; some configured points can be inactive in a generated game state.';
      return `<article class="location-map"><h4>${esc(mapTitle)}</h4>${map.tileBounds?`<p class="fish-scope">X ${map.tileBounds.xMin}–${map.tileBounds.xMax} · Y ${map.tileBounds.yMin}–${map.tileBounds.yMax}</p>`:''}${map.image?`<div class="map-scroll"><div class="map-canvas" style="aspect-ratio:${Number(map.width)||1}/${Number(map.height)||1}"><img class="map-background" loading="lazy" src="${esc(map.image)}?v=terrain-context-20261004" alt="${esc(mapTitle)}">${pins.map((pin,i)=>`<span class="map-pin" style="left:${Number(pin.x)*100}%;top:${Number(pin.y)*100}%" title="${esc(fishName(id))} · X ${pin.tileX}, Y ${pin.tileY}">${fish.image?`<a href="${esc(fishHref(id))}" aria-label="${esc(fishName(id))} — ${detailLabel}"><img src="${esc(fish.image)}" alt="${esc(fishName(id))}"></a>`:''}<b>${i+1}</b></span>`).join('')}</div></div><p class="fish-scope">${esc(pinNote)}</p><a href="${esc(map.image)}" target="_blank" rel="noopener">${openMap} ↗</a>${map.fullImage?` · <a href="${esc(map.fullImage)}" target="_blank" rel="noopener">${lang==='th'?'ดูแผนที่ทั้งด่าน':lang==='ja'?'全体地図':'Full area map'} ↗</a>`:''}`:`<p>${esc(unknown)}</p>`}${map.sourceUrl?` · <a href="${esc(map.sourceUrl)}" target="_blank" rel="noopener">${sourceWord} ↗</a>`:''}${map.note?`<p>${esc(local(map.note))}</p>`:''}</article>`;
    }).join('');
    box.innerHTML=`<div class="location-heading">${fish.image?`<a href="${esc(fishHref(id))}" aria-label="${esc(fishName(id))} — ${detailLabel}"><img src="${esc(fish.image)}" alt=""></a>`:''}<div><h2>${esc(title)} — ${esc(fishName(id))}</h2><p>${lang==='th'?'ดูจุดตก แล้วเลือกเหยื่อจากรายการด้านล่าง':lang==='ja'?'釣り場を確認してから、下の対応エサを選びます。':'Find a fishing spot, then choose compatible tackle below.'}</p></div></div><a class="map-browser-cta" href="${mapPage}?fish=${id}${chosen?'&stage='+chosen.stage:''}">${mapPageLabel} ↗</a>${locations.length?`<nav class="part-menu location-stages" aria-label="${stageWord}">${locations.map(l=>`<button type="button" data-location-stage="${l.stage}" aria-pressed="${String(l.stage)===locationStage}">${stageWord} ${l.stage} · ${esc(local(l.stageName))}</button>`).join('')}</nav><h3>${stageWord} ${chosen.stage} · ${esc(local(chosen.stageName))}</h3><p>${esc(local(chosen.description))}</p>${chosen.accessNote?`<p class="location-access">${esc(local(chosen.accessNote))}</p>`:''}${overviewHtml}${mapMenu}<div class="location-maps">${maps}</div>${!maps?`<p>${lang==='th'?'พบพิกัดใน ROM แล้ว อยู่ระหว่างถอดภาพแผนที่':lang==='ja'?'ROM座標を抽出済み。地図画像を復号中。':'ROM coordinates extracted; map rendering is in progress.'}</p>`:''}<details class="spawn-coordinates"><summary>${lang==='th'?'ดูพิกัดจุดเกิดจากเกม':lang==='ja'?'出現座標':'Spawn coordinates'}</summary><p>${(chosen.points||[]).map(p=>`(${p.x}, ${p.y})`).join(' · ')}</p></details><p class="location-provenance">${lang==='th'?'ตำแหน่งและชนิดปลาถอดจาก ROM; เปิดรายละเอียดเพื่อดูตารางและโค้ดที่ใช้ตรวจสอบ':lang==='ja'?'場所と魚種はROMから抽出。根拠の表とコードは調査詳細を参照。':'Locations and species are extracted from ROM; research notes identify the source tables and code.'}</p>`:`<p>${esc(unknown)}</p>`}`;
  }
  function flyBundlePartFor(item,fish){
    const part=item.category==='fly_wing'?'wing':'tail';
    return allItems.some(body=>body.category==='fly'&&(useOf(body).fishIds||[]).includes(fish)&&(useOf(body).shops||[]).some(shop=>shop.bundle?.[part]===item.id));
  }
  function selectFish(id) {
    if(document.getElementById('fish-filter').value!==id){document.getElementById('search').value='';document.getElementById('style-filter').value='';flyPart='fly';}
    document.getElementById('fish-filter').value=id;
    document.getElementById('fish-search').value=id?fishName(id):'';
    document.getElementById('fish-search-status').textContent='';
    closeFishSuggestions();
    const category=document.getElementById('category-filter').value;
    if(id&&!fishCategories.includes(category))document.getElementById('category-filter').value='all';
    locationStage='';locationMapIndex=0;renderCards();
    if(typeof history!=='undefined')history.replaceState(null,'',`?category=${document.getElementById('category-filter').value}${id?'&fish='+encodeURIComponent(id):''}#fish-location-panel`);
  }
  const rodAdviceTitle=lang==='th'?'ควรเลือกคันนี้เมื่อไร?':lang==='ja'?'この竿を選ぶときは？':'When should I choose this rod?';
  const rodAdviceExtras=item=>item.rodDecision||item.gearDecision?`<p class="rod-verdict">${esc(local((item.rodDecision||item.gearDecision).label))}</p>`:'';
  const rodAlternatives=item=>(item.rodDecision||item.gearDecision)?.alternatives?.some(ref=>ref.category!==item.category||ref.id!==item.id)?`<div class="rod-alternatives"><p>${lang==='th'?'ตัวเลือกที่นำมาเทียบ:':lang==='ja'?'比較する候補：':'Compare with:'}</p>${(item.rodDecision||item.gearDecision).alternatives.filter(ref=>ref.category!==item.category||ref.id!==item.id).map(decisionLink).join('')}</div>`:'';
  function gearNextActions(item){
    if(!item.gearDecision)return '';
    if(item.category==='float_weight')return `<p><a class="route-button" data-float-price-guide href="index${lang==='en'?'':'.'+lang}.html?category=float_weight#category-decisions">${lang==='th'?'ดูทุ่นและตะกั่วราคาต่ำสุดแยกทั้งหกด่าน':lang==='ja'?'6エリアの最安ウキ・オモリを見る':'See the cheapest float and sinker in each of six areas'} ↗</a></p>`;

    const ids=(item.gearDecision.targetFish||[]).filter(id=>fishVisuals[id]);
    if(item.category==='hook'&&ids.length)return `<p>${lang==='th'?'ดูเหยื่อและจุดตกของปลาที่ชื่อเบ็ดอ้างถึง':lang==='ja'?'ハリ名の魚のエサ・場所を見る':'Bait and locations for the fish named by this hook'}: ${ids.map(id=>`<a href="${esc(fishHref(id))}">${esc(fishName(id))} ↗</a>`).join(' · ')}</p>`;
    if(item.category.startsWith('fly')){
      const id=document.getElementById('fish-filter').value;
      if(id&&!allItems.some(candidate=>candidate.category==='fly'&&useOf(candidate).fishIds?.includes(id)))return `<p><a data-fly-next href="${esc(fishHref(id))}">${lang==='th'?'ปลานี้ไม่ผ่านเงื่อนไขฟลาย: ดูเหยื่อและวิธีอื่น':lang==='ja'?'この魚はフライ判定に不適合：他の釣法を見る':'This fish fails the fly profile check: see other methods'} ↗</a></p>`;
      if(!id&&item.category==='fly')return `<p>${lang==='th'?'เลือกปลาในรายชื่อด้านล่าง แล้วดูจุดตกและชุดฟลายในหน้าปลา':lang==='ja'?'下の魚一覧から選び、魚ページで場所と毛バリ候補を見る。':'Choose a fish below, then see locations and flies on its profile.'}</p>`;
      return `<p><a data-fly-next href="${esc(id?fishHref(id)+'#fly-backup':detailFile('item')+'?category=fly&id=01&return='+encodeURIComponent(sourceReturn()))}">${lang==='th'?(id?'ดูชุดฟลายเริ่มต้นและชุดสำรองของปลานี้':'เลือกปลาจากบอดี้ แล้วดูชุดฟลายในหน้าปลา'):lang==='ja'?(id?'この魚の最初の毛バリ・予備を見る':'ボディで魚を選び、魚ページで毛バリを見る'):(id?'See starter and backup flies for this fish':'Choose a fish from a body, then see flies on its profile')} ↗</a></p>`;
    }
    return '';
  }
  function renderComparison(items,category) {
    const box=document.getElementById('rod-comparison');
    if(category!=='rod'){box.innerHTML='';return;}
    const styles=lang==='th'?{1:'ทุ่น / อายุ',2:'ตีเหยื่อ',4:'ลัวร์',8:'ฟลาย'}:lang==='ja'?{1:'ウキ・アユ',2:'投げ',4:'ルアー',8:'フライ'}:{1:'Float / Ayu',2:'Casting',4:'Lure',8:'Fly'};
    box.innerHTML=`<details class="comparison"><summary>${esc(player.compare)}</summary><p>${lang==='th'?'เวลาเล็งสูง = ขยับจุดเป้าหมายได้นานขึ้น; ขอบเขตสูง = ปลาออกไปไกลกว่าเดิมก่อนเข้าเงื่อนไขหนีและเสียอุปกรณ์ที่แกะได้ ตัวเลขเป็นหน่วยเปรียบเทียบภายใน ไม่ใช่เมตรหรือคะแนนพลัง และปลาอาจหนีด้วยเงื่อนไขอื่น':lang==='ja'?'照準時間が大きいほど狙いを動かせる時間が長い。魚位置の境界が大きいほど、追跡した道具喪失分岐に入るまで魚が遠くに行ける。内部比較値であり、メートル・強さではない。別条件の逃げもある。':'More aim time lets you move the target longer. A higher fish-position limit allows the fish farther out before the traced tackle-loss escape condition. Values are internal comparisons, not metres or power. Other escape conditions still apply.'}</p><div class="table-wrap"><table><thead><tr><th>${esc(copy.item)}</th><th>${esc(player.style)}</th><th>${esc(player.aim)}</th><th>${esc(player.reach)}</th><th>${lang==='th'?'ราคาซื้อ':lang==='ja'?'購入価格':'Purchase price'}</th><th>${lang==='th'?'คำแนะนำ':lang==='ja'?'選び方':'Recommendation'}</th></tr></thead><tbody>${items.slice().sort((a,b)=>a.decodedFields.styleCode-b.decodedFields.styleCode||b.decodedFields.rangeMultiplier-a.decodedFields.rangeMultiplier).map(i=>`<tr><td><a href="${esc(itemHref(i))}">${esc(itemName(i))}</a></td><td>${esc(styles[i.decodedFields.styleCode])}</td><td>${i.decodedFields.castAimHoldCutoffInternal}</td><td>${i.decodedFields.rangeMultiplier}</td><td>${esc(useOf(i).shops?.length?formatYen(i):lang==='th'?'ไม่พบในร้าน':lang==='ja'?'店頭在庫なし':'No recorded shop stock')}</td><td class="rod-table-advice"><strong>${esc(local(i.rodDecision?.label))}</strong></td></tr>`).join('')}</tbody></table></div></details>`;
  }
  function renderCards() {
    const term=document.getElementById('search').value.trim().toLocaleLowerCase();
    const fish=document.getElementById('fish-filter').value;
    renderTargetCategories(fish);
    document.getElementById('map-browser-link').href=`${lang==='th'?'maps.th.html':lang==='ja'?'maps.ja.html':'maps.html'}${fish?'?fish='+fish:''}`;
    document.getElementById('generic-lure-kit').hidden=!!fish;
    const category=document.getElementById('category-filter').value;
    if(typeof history!=='undefined'&&typeof URLSearchParams!=='undefined'&&typeof location!=='undefined'){const query=new URLSearchParams(location.search);query.set('category',category);if(fish)query.set('fish',fish);else query.delete('fish');if(category==='flymaker')query.set('part',flyPart);else query.delete('part');history.replaceState(null,'',`?${query.toString()}${location.hash||'#catalogue'}`);}
    const order=document.getElementById('sort-filter').value;
    const style=document.getElementById('style-filter').value;
    const routes=lang==='th'?{float:'ชุดทุ่น',sinker:'ชุดตะกั่ว / หน้าดิน'}:lang==='ja'?{float:'ウキ仕掛け',sinker:'オモリ仕掛け'}:{float:'Float rig',sinker:'Sinker rig'};
    document.getElementById('bait-route-menu').innerHTML=['bait','all'].includes(category)?Object.entries(routes).map(([k,v])=>`<button type="button" data-route="${k}" aria-pressed="${baitRoute===k}">${v}</button>`).join(''):'';
    document.getElementById('style-label').hidden=category!=='rod';
    const parts=lang==='th'?{fly:'บอดี้',fly_wing:'ปีก',fly_tail:'หาง'}:lang==='ja'?{fly:'ボディ',fly_wing:'ウイング',fly_tail:'テール'}:{fly:'Body',fly_wing:'Wing',fly_tail:'Tail'};
    document.getElementById('fly-part-menu').innerHTML=category==='flymaker'?Object.entries(parts).map(([k,v])=>`<button type="button" data-part="${k}" aria-pressed="${flyPart===k}">${v}</button>`).join('')+`<a href="#fly-instructions" data-guide> ${lang==='th'?'ดูขั้นตอนประกอบ':lang==='ja'?'作成手順':'Assembly steps'} ↗</a>`:'';
    let shown=allItems.filter(item=>matchCategory(item,category)&&(category!=='bait'||baitRoute!=='sinker'||fishIdsFor(item).length>0)&&(category!=='flymaker'||item.category===flyPart)&&(category!=='rod'||!style||String(item.decodedFields.styleCode)===style)&&(!fish||(['bait','lure','fly','float_weight'].includes(item.category)&&fishIdsFor(item).includes(fish))||(category==='flymaker'&&flyPart!=='fly'&&flyBundlePartFor(item,fish)))&&(!term||[item.search,itemName(item),local(useOf(item).summary),...fishIdsFor(item).map(fishName)].join(' ').toLocaleLowerCase().includes(term)));
    if(order==='name')shown.sort((a,b)=>itemName(a).localeCompare(itemName(b),lang)||a.id.localeCompare(b.id));
    else if(order==='price')shown.sort((a,b)=>(a.priceYen??Infinity)-(b.priceYen??Infinity)||a.id.localeCompare(b.id));
    set('#result-count',copy.results(shown.length));
    set('#category-title',fish&&category==='all'?(lang==='th'?`เหยื่อและชุดตกสำหรับ${fishName(fish)}`:lang==='ja'?`${fishName(fish)}に対応するエサ・仕掛け`:`Baits and rigs for ${fishName(fish)}`):player.cat[category]||player.all);
    set('#category-description',fish&&category==='all'?(lang==='th'?'แสดงเฉพาะรายการที่ผ่านเงื่อนไขปลานี้จาก ROM':lang==='ja'?'この魚のROM適合判定を通るアイテムのみ表示。':'Only items that pass this fish’s ROM compatibility checks are shown.'):player.desc[category]||player.lead);
    set('#fish-status',fish?`${fishName(fish)} — ${category==='flymaker'&&flyPart!=='fly'?(lang==='th'?'ชิ้นส่วนในชุดที่ร้านขายพร้อมบอดี้ซึ่งผ่านเงื่อนไขปลานี้ ไม่ได้ยืนยันว่าปีกหรือหางเพิ่มโอกาสกิน':lang==='ja'?'対応ボディと一緒に販売される構成部品。ウイング・テールの食いつき向上は未確認。':'Parts sold with a body that passes this fish’s compatibility check; a wing or tail bite bonus is not established.'):player.fishOnly}`:'');
    document.querySelectorAll('[data-category]').forEach(n=>n.setAttribute('aria-current',n.dataset.category===category?'true':'false'));
    renderFishLocation(fish);
    renderComparison(shown,category);
    renderDecisions(category);
    const box=document.getElementById('cards');
    if(!shown.length){box.innerHTML=`<p class="empty-state">${esc(fish?(lang==='th'?'ไม่มีรายการที่ยืนยันว่าใช้กับปลานี้ได้ในหมวดและคำค้นที่เลือก ลองหมวดอื่น หรือกด × เพื่อล้างปลาเป้าหมาย':lang==='ja'?'選択した種類・検索条件では、この魚に対応する確認済みアイテムがありません。別の種類、または×で魚の指定を解除。':'No verified compatible item matches this category and search. Try another category, or clear the target with ×.'):copy.empty)}</p>`;return;}
    box.innerHTML=shown.map(item=>{const use=useOf(item);const {summary,facts}=visibleUse(item);return `<article class="item-card ${item.category==='food'&&item.id==='0A'?'poison-food':''}" id="item-${item.category}-${item.id}"><div class="card-main"><figure class="sprite"><a href="${esc(itemHref(item))}" aria-label="${esc(itemName(item))} — ${detailLabel}"><img loading="lazy" src="${esc(item.image)}" alt="${esc(itemName(item))}"></a></figure><div class="card-text"><span class="category-tag">${esc(categoryNames[item.category])}</span><h3><a class="entity-title" href="${esc(itemHref(item))}">${esc(itemName(item))}</a></h3>${thaiLabel(item)}${itemName(item)!==item.nameJa?`<p class="jp-name" lang="ja">${esc(item.nameJa)}</p>`:''}<div class="price-row">${item.priceYen>0&&use.shops?.length&&!item.category.startsWith('fly')?`<span class="price-badge">${esc(formatYen(item))}</span>`:''}<span class="item-id">ID ${esc(item.id)}</span></div></div></div><div class="use-block" ${item.rodDecision||item.gearDecision?(item.rodDecision?'data-rod-decision':'data-gear-decision')+'="'+esc(item.id)+'"':''}><h4>${esc(item.rodDecision?rodAdviceTitle:item.gearDecision?(lang==='th'?'ควรซื้อหรือใช้ชิ้นนี้เมื่อไร?':lang==='ja'?'この道具を買う・使うときは？':'When should I buy or use this?'):player.use)}</h4>${rodAdviceExtras(item)}<p class="use-summary">${esc(summary)}</p>${use.evidence?.type==='player_guide_report'?`<p class="fish-scope">${lang==='th'?'คำอธิบายการใช้จากคู่มือผู้เล่น ยังไม่ได้ยืนยันจากโค้ดเกม':lang==='ja'?'用途はプレイヤーガイドによる報告。ゲームコードでは未確認。':'Use reported by a player guide; not yet confirmed in game code.'}</p>`:''}${facts.length?`<ul class="use-facts">${facts.map(n=>`<li>${esc(n)}</li>`).join('')}</ul>`:''}${rodAlternatives(item)}${gearNextActions(item)}</div>${gatheredBaitChoices(item)}${baitGatherChoice(item)}${mushroomAlternative(item)}${acquisitionChoice(item)}${shopLocations(item)}${toolUseLocations(item)}${fishList(item)}${detailedFields(item)}</article>`;}).join('');
  }
  fetch('gallery-data.json?v=player-usefulness-20261004-6').then(r=>{if(!r.ok)throw new Error('catalogue unavailable');return r.json();}).then(data=>{
    allItems=data.items;decisions=data.playerDecisions?.sections||[];gearPriceGuide=data.gearPriceGuide||{};fishVisuals=data.fishVisuals||{};fishLocations=data.fishLocations||{};
    for(const item of allItems)categoryNames[item.category]=lang==='th'?item.categoryTh:lang==='ja'?item.categoryJa:item.categoryEn;
    set('#entry-count',copy.entries(allItems.length));
    set('[data-t="title"]',player.title);set('[data-t="lead"]',player.lead);
    set('#category-menu-title',player.menu);set('#fish-filter-label',player.fish);
    set('#kit-title',player.kit);set('#kit-copy',player.kitText);set('#kit-link',player.kitLink);
    renderSamples();renderFrames(data);renderNotes(data);renderFilters();
    let chosen='rod';if(typeof URLSearchParams!=='undefined'&&typeof location!=='undefined'){const q=new URLSearchParams(location.search).get('category');if(groups.includes(q)||q==='all')chosen=q;const part=new URLSearchParams(location.search).get('part');if(['fly','fly_wing','fly_tail'].includes(part))flyPart=part;}
    document.getElementById('category-filter').value=chosen;
    if(typeof URLSearchParams!=='undefined'&&typeof location!=='undefined'){const f=new URLSearchParams(location.search).get('fish');if(fishVisuals[f])document.getElementById('fish-filter').value=f;const stage=new URLSearchParams(location.search).get('stage');if(['1','2','3','4','5','6'].includes(stage))locationStage=stage;}
    if(typeof location!=='undefined'){
      const q=new URLSearchParams(location.search);
      document.getElementById('search').value=q.get('q')||'';
      if(['id','name','price'].includes(q.get('sort')))document.getElementById('sort-filter').value=q.get('sort');
      if(['1','2','4','8'].includes(q.get('style')))document.getElementById('style-filter').value=q.get('style');
      if(['float','sinker'].includes(q.get('route')))baitRoute=q.get('route');
      if(/^\d+$/.test(q.get('map')||''))locationMapIndex=Number(q.get('map'));
    }
    document.getElementById('fish-search').value=document.getElementById('fish-filter').value?fishName(document.getElementById('fish-filter').value):'';
    setupFishPicker();
    renderCards();
    if(typeof window!=='undefined'&&window.location.hash==='#category-decisions')document.getElementById('category-decisions')?.scrollIntoView({block:'start'});
    document.getElementById('category-menu').addEventListener('click',event=>{const a=event.target.closest('[data-category]');if(!a)return;event.preventDefault();document.getElementById('category-filter').value=a.dataset.category;document.getElementById('search').value='';document.getElementById('style-filter').value='';renderCards();if(typeof history!=='undefined')history.replaceState(null,'',`?category=${a.dataset.category}${document.getElementById('fish-filter').value?'&fish='+document.getElementById('fish-filter').value:''}#catalogue`);document.getElementById('catalogue').scrollIntoView({behavior:'smooth',block:'start'});});
    document.getElementById('bait-route-menu').addEventListener('click',event=>{const b=event.target.closest('[data-route]');if(!b)return;baitRoute=b.dataset.route;renderCards();});
    document.getElementById('fly-part-menu').addEventListener('click',event=>{if(event.target.closest('[data-guide]')){event.preventDefault();const guide=document.getElementById('fly-instructions');guide.open=true;guide.scrollIntoView({behavior:'smooth'});return;}const b=event.target.closest('[data-part]');if(!b)return;flyPart=b.dataset.part;renderCards();});


    document.getElementById('fish-location-panel').addEventListener('click',event=>{const b=event.target.closest('[data-location-stage]');if(!b)return;locationStage=b.dataset.locationStage;locationMapIndex=0;renderFishLocation(document.getElementById('fish-filter').value);renderDecisions(document.getElementById('category-filter').value);});
    document.getElementById('fish-location-panel').addEventListener('change',event=>{if(event.target.id!=='location-map-select')return;locationMapIndex=Number(event.target.value);renderFishLocation(document.getElementById('fish-filter').value);});
    for(const id of ['search','category-filter','sort-filter','style-filter'])document.getElementById(id).addEventListener(id==='search'?'input':'change',renderCards);
    for(const id of ['search','category-filter','sort-filter','style-filter'])document.getElementById(id).disabled=false;
  }).catch(error=>{console.error(error);});
})();
