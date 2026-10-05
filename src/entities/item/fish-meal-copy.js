const summaries = {
  th: 'ปลาอื่นเอาขนาดที่แสดงเป็นเซนติเมตรหาร 4 แล้วปัดเศษลง (ขั้นต่ำ 1 HP ไม่เกิน HP ที่ขาด). เมนูกินปลาตัวแรกในข้องและเอาออก—ตรวจชื่อก่อนยืนยัน; คุซะฟุกุทำ HP เหลือ 0',
  en: 'Other fish restore their displayed size in centimetres divided by four (round down, minimum 1 HP), capped at missing HP. The menu eats and removes the first fish in the keepnet; check its name because Kusafugu sets HP to zero.',
  ja: '通常の魚は表示サイズ(cm)を4で割って切り捨て（最低1HP、不足HPまで）回復する。びくの先頭を食べて取り除くため、名前を確認すること。クサフグはHPが0になる。',
}

export function fishMealSummary(lang) {
  return summaries[lang] || summaries.en
}
