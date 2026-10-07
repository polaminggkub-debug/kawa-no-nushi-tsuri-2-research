const summaries = {
  th: 'กินปลาตัวแรกในข้อง ปลาทั่วไปฟื้น HP เท่ากับขนาดที่แสดงเป็นเซนติเมตรหาร 4 ปัดเศษลง (ขั้นต่ำ 1 HP ไม่เกิน HP ที่ขาด): 20 ซม. ฟื้น 5, 40 ซม. ฟื้น 10, 100 ซม. ฟื้น 25 เมนูจะข้ามปลาไหลยักษ์ตัวแรกของคุณ จึงเผลอกินทิ้งไม่ได้ (ปลาไหลยักษ์ตัวที่สองจะถูกกิน) คุซะฟุกุทำให้ HP เหลือ 0: คุณจะสลบแล้วตื่นที่จุดเซฟด้วย HP 1 ของที่มีอยู่ครบ แต่ปลาตัวนั้นหายไป รายการ "ปลา" จะโผล่ในเมนูอาหารก็ต่อเมื่อช่องอาหารจาก 16 ช่องมีที่ว่างอย่างน้อยหนึ่งช่อง',
  en: 'Eats the first fish in your keepnet. Other fish restore their displayed size in centimetres divided by four (round down, minimum 1 HP), capped at missing HP: 20 cm heals 5, 40 cm heals 10, 100 cm heals 25. The menu skips your first giant eel, so you cannot lose it by accident (a second giant eel would be eaten). Kusafugu sets HP to zero: you black out and wake up at your saved position with 1 HP and keep everything, but the fish is gone. The Fish entry only shows if one of your 16 food slots is free.',
  ja: 'びくの先頭の魚を食べる。通常の魚は表示サイズ(cm)を4で割って切り捨て（最低1HP、不足HPまで）回復する：20cmで5、40cmで10、100cmで25。最初のオオウナギは食べる対象から外されるので、うっかり失うことはない（2匹目のオオウナギは食べられてしまう）。クサフグはHPが0になる：気絶して保存位置で1HPの状態で目を覚まし、持ち物はそのままだが、その魚は失われる。「魚」の項目は、食料16枠のどこかに空きがあるときだけ表示される。',
}

export function fishMealSummary(lang) {
  return summaries[lang] || summaries.en
}

const facts = {
  th: [
    'ตัวอย่าง: 20 ซม. ฟื้น 5 HP, 40 ซม. ฟื้น 10 HP, 100 ซม. ฟื้น 25 HP',
    'ก่อนจบเรื่อง เมนูจะข้ามปลาไหลยักษ์ตัวแรกของคุณ จึงเผลอกินไม่ได้ และไม่จำเป็นต้องเก็บปลาไหลไว้เพื่อดูฉากจบ ปลาไหลยักษ์ตัวที่สองจะไม่ถูกข้าม',
    'คุซะฟุกุทำให้ HP เหลือ 0 คุณจะสลบแล้วตื่นที่จุดเซฟด้วย HP 1 โดยเงิน ปลา และอุปกรณ์ยังอยู่ครบ ตรวจชื่อปลาก่อนกดยืนยัน',
    'รายการ "ปลา" จะโผล่ในเมนูอาหารก็ต่อเมื่อช่องอาหารจาก 16 ช่องมีที่ว่างอย่างน้อยหนึ่งช่อง',
  ],
  en: [
    'Examples: 20 cm restores 5 HP, 40 cm restores 10 HP, and 100 cm restores 25 HP.',
    'The menu skips your first giant eel while the ending is not done, so you cannot eat it by accident. You do not need to keep the eel for the ending. A second giant eel is not skipped.',
    'Kusafugu takes your HP to 0. You black out and wake up at your saved position with 1 HP, and you keep your money, fish and tools. Check the fish name before you confirm.',
    'The Fish entry only appears in the food menu if one of your 16 food slots is free.',
  ],
  ja: [
    '例：20cmなら5HP、40cmなら10HP、100cmなら25HP。',
    'エンディングが済むまでは、最初のオオウナギは食べる対象から外される。うっかり食べてしまうことはない。エンディングのためにオオウナギを残しておく必要はない。2匹目のオオウナギは外されない。',
    'クサフグを食べるとHPが0になる。気絶して保存位置で1HPの状態で目を覚まし、お金・魚・道具はそのまま。決定する前に魚の名前を確認する。',
    '「魚」の項目は、食料16枠のどこかに空きがあるときだけ食料メニューに表示される。',
  ],
}

export function fishMealFacts(lang) {
  return facts[lang] || facts.en
}
