export function purchaseSortCopy(lang, stage) {
  const area = /^[1-6]$/.test(String(stage || '')) ? Number(stage) : 0
  if (lang === 'th') {
    const scope = area ? `ด่าน ${area}` : 'ทุกด่าน (ยังไม่ได้เลือกด่าน)'
    return `เรียงจากของที่มีรายการขายปกติใน${scope} ราคาต่ำก่อน ตามด้วยของขายแบบมีเงื่อนไข แล้วจึงของที่ไม่มีข้อเสนอขายปกติพร้อมราคาที่เทียบได้ในขอบเขตนี้ ฟลายต้องซื้อเป็นชุดหรือประกอบ จึงไม่ใช้ราคาชิ้นส่วนมาเทียบ ตรวจเงื่อนไขและราคาในหน้าร้านก่อนซื้อ`
  }
  if (lang === 'ja') {
    const scope = area ? `エリア${area}` : '全エリア（エリア未指定）'
    return `${scope}の通常販売記録を安い順に表示し、条件付き販売、比較できる通常販売価格のないアイテムが続きます。フライはセット購入・作成が必要なため、部品価格で比較しません。購入前に店の条件と価格を確認してください。`
  }
  const scope = area ? `Area ${area}` : 'all areas (no area selected)'
  return `Regular shop offers in ${scope}, cheapest first; conditional offers follow, then entries without a comparable ordinary offer in this scope. Flies require a bundle or recipe, so component prices are not compared. Check the shop conditions and quote before buying.`
}

export function rawPriceSortCopy(lang) {
  if (lang === 'th')
    return 'เรียงช่องราคาใน ROM สำหรับตรวจหลักฐานเท่านั้น ไม่ใช่รายการที่ซื้อได้หรือราคาเต็มของชุดฟลาย หากกำลังเลือกซื้อ ให้ใช้ “มีขายก่อน แล้วเรียงราคา”'
  if (lang === 'ja')
    return 'ROM価格欄の検証用順序です。購入可能性やフライセットの総額を示しません。購入する道具を選ぶには「販売記録→価格」を使ってください。'
  return 'ROM price-field order is for inspecting evidence; it does not establish availability or a complete fly price. To choose a purchase, use “Shop availability, then price”.'
}
