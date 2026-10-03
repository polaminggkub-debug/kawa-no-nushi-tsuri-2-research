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
  const itemName=item=>lang==='th'?(item.nameTh||item.nameJa):lang==='ja'?item.nameJa:item.nameEn;
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
  function renderFilters() {
    const cats=[...new Set(allItems.map(x=>x.category))];
    const select=document.getElementById('category-filter');
    select.innerHTML=`<option value="all">${esc(copy.all)}</option>`+cats.map(c=>`<option value="${esc(c)}">${esc(categoryNames[c])}</option>`).join('');
    document.getElementById('sort-filter').innerHTML=`<option value="id">${esc(copy.sortId)}</option><option value="name">${esc(copy.sortName)}</option><option value="price">${esc(copy.sortPrice)}</option>`;
  }
  function detailedFields(item) {
    const bytes=item.recordBytesHex?`<p><b>${esc(copy.offset)}:</b> <code>${esc(item.fileOffset||'—')}</code></p><p><b>${esc(copy.bytes)}:</b> <code>${esc(item.recordBytesHex)}</code></p>`:`<p>${esc(copy.none)}</p>`;
    const decoded=Object.entries(item.decodedFields||{}).filter(([key])=>!['nameJapanese','nameEnglish','condition'].includes(key)).map(([key,value])=>`<dt>${esc(copy.fieldNames[key]||key)}</dt><dd>${esc(typeof value==='object'?JSON.stringify(value):value)}</dd>`).join('');
    const raw=Object.entries(item.rawFields||{}).map(([key,value])=>`<dt>${esc(key)}</dt><dd>${Number(value).toString(16).toUpperCase().padStart(2,'0')} <span class="decimal">(${esc(value)})</span></dd>`).join('');
    return `<details class="record-details"><summary>${esc(copy.details)}</summary>${bytes}${decoded?`<h4>${esc(copy.decoded)}</h4><dl>${decoded}</dl>`:''}${raw?`<h4>${esc(copy.bytes)}</h4><dl>${raw}</dl>`:''}</details>`;
  }
  function thaiLabel(item) {
    return lang==='th'&&item.labelImageTh?`<a href="${esc(item.labelImageTh)}" target="_blank" rel="noopener"><img class="thai-rom-label" loading="lazy" src="${esc(item.labelImageTh)}" alt="${esc(item.nameTh||'ชื่อไอเท็มจาก ROM ไทย · ID '+item.id)}"></a><span class="thai-label-note">${esc(item.labelContextTh||'ภาพชื่อจากแพตช์ไทย V1.2')}</span>`:'';
  }
  function renderCards() {
    const term=document.getElementById('search').value.trim().toLocaleLowerCase();
    const category=document.getElementById('category-filter').value;
    const order=document.getElementById('sort-filter').value;
    let shown=allItems.filter(item=>(category==='all'||item.category===category)&&(!term||item.search.toLocaleLowerCase().includes(term)||item.notesEn.join(' ').toLocaleLowerCase().includes(term)||item.notesJa.join(' ').toLocaleLowerCase().includes(term)||(item.nameTh||'').toLocaleLowerCase().includes(term)||(item.notesTh||[]).join(' ').toLocaleLowerCase().includes(term)));
    if(order==='name') shown.sort((a,b)=>itemName(a).localeCompare(itemName(b),lang)||a.id.localeCompare(b.id));
    else if(order==='price') shown.sort((a,b)=>(a.priceYen??Infinity)-(b.priceYen??Infinity)||a.category.localeCompare(b.category)||a.id.localeCompare(b.id));
    else shown.sort((a,b)=>a.category.localeCompare(b.category)||a.id.localeCompare(b.id));
    set('#result-count',copy.results(shown.length));
    const box=document.getElementById('cards');
    if(!shown.length){box.innerHTML=`<p class="empty-state">${esc(copy.empty)}</p>`;return;}
    box.innerHTML=shown.map(item=>{
      const name=itemName(item);
      const notes=itemNotes(item);
      const confidence=lang==='th'?item.confidenceLabelTh:lang==='ja'?item.confidenceLabelJa:item.confidenceLabelEn;
      return `<article class="item-card"><div class="card-main"><figure class="sprite"><img loading="lazy" src="${esc(item.image)}" alt="${esc(name)}"><figcaption>${esc(imageText(item))}</figcaption></figure><div class="card-text"><div class="card-topline"><span class="category-tag">${esc(lang==='th'?item.categoryTh:lang==='ja'?item.categoryJa:item.categoryEn)}</span><span class="item-id">ID ${esc(item.id)}</span></div><h3>${esc(name)}</h3>${thaiLabel(item)}<p class="jp-name" lang="ja">${esc(item.nameJa)}</p><div class="price-row"><span class="price-badge">${esc(formatYen(item))}</span><span class="confidence">${esc(confidence)}</span></div></div></div><ul class="stat-list">${notes.map(note=>`<li>${esc(note)}</li>`).join('')}</ul><div class="card-actions"><a class="frame-link" href="${esc(item.frame)}" target="_blank" rel="noopener">${esc(copy.openFrame)}</a></div>${detailedFields(item)}</article>`;
    }).join('');
  }
  fetch('gallery-data.json?v=equipment-20261004').then(response=>{if(!response.ok)throw new Error('catalogue unavailable');return response.json();}).then(data=>{
    allItems=data.items;
    for (const item of allItems) categoryNames[item.category]=lang==='th'?item.categoryTh:lang==='ja'?item.categoryJa:item.categoryEn;
    set('#entry-count',copy.entries(allItems.length));
    renderSamples();renderFrames(data);renderNotes(data);renderFilters();renderCards();
    document.getElementById('search').addEventListener('input',renderCards);
    document.getElementById('category-filter').addEventListener('change',renderCards);
    document.getElementById('sort-filter').addEventListener('change',renderCards);
  }).catch(()=>{
    /* Keep the pre-rendered catalogue visible if interactive loading fails. */
  });
})();
