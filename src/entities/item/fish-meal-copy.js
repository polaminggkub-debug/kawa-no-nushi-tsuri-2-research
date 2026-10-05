const summaries = {
  th: 'ปลาอื่นเอาขนาดที่แสดงเป็นเซนติเมตรหาร 4 แล้วปัดเศษลง (ขั้นต่ำ 1 HP ไม่เกิน HP ที่ขาด). เมนูกินปลาตัวแรกในข้องและเอาออก—ตรวจชื่อก่อนยืนยัน; คุซะฟุกุทำ HP เหลือ 0',
  en: 'Other fish restore their displayed size in centimetres divided by four (round down, minimum 1 HP), capped at missing HP. The menu eats and removes the first fish in the keepnet; check its name because Kusafugu sets HP to zero.',
  ja: '通常の魚は表示サイズ(cm)を4で割って切り捨て（最低1HP、不足HPまで）回復する。びくの先頭を食べて取り除くため、名前を確認すること。クサフグはHPが0になる。',
}

export function fishMealSummary(lang) {
  return summaries[lang] || summaries.en
}

const facts = {
  th: [
    'ตัวอย่าง: 20 ซม. ฟื้น 5 HP, 40 ซม. ฟื้น 10 HP, 100 ซม. ฟื้น 25 HP.',
    'ถ้าจะเก็บโออูนางิ / ปลาไหลยักษ์ไว้ให้หมอ อย่าเลือกกินปลาเมื่อมันเป็นปลาตัวแรกในข้อง เมนูกินปลาไม่ได้กันปลาไหลยักษ์ไว้ให้; ใช้อาหารอื่นฟื้น HP แทน',
  ],
  en: [
    'Examples: 20 cm restores 5 HP, 40 cm restores 10 HP, and 100 cm restores 25 HP.',
    'To keep the giant eel for the doctor’s request, do not eat the first keepnet fish when it is the giant eel. The fish-meal menu does not protect the giant eel; use other food to restore HP.',
  ],
  ja: [
    '例：20cmなら5HP、40cmなら10HP、100cmなら25HP。',
    '医者の依頼用にオオウナギを残すなら、びくの先頭がオオウナギのときは食べない。食べる処理はオオウナギを保護しないため、HP回復には別の食料を使う。',
  ],
}

export function fishMealFacts(lang) {
  return facts[lang] || facts.en
}
