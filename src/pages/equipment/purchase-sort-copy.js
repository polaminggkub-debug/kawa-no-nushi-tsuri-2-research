export function purchaseSortCopy(lang, stage) {
  const area = /^[1-6]$/.test(String(stage || '')) ? Number(stage) : 0
  if (lang === 'th') {
    const scope = area ? `ด่าน ${area}` : 'ทุกด่าน (ยังไม่ได้เลือกด่าน)'
    return `เรียงจากของที่มีรายการขายปกติใน${scope} ราคาต่ำก่อน ตามด้วยของขายแบบมีเงื่อนไข แล้วจึงของที่ไม่มีรายการขายปกติให้เทียบราคา ฟลายต้องซื้อเป็นชุดหรือประกอบ จึงไม่ใช้ราคาชิ้นส่วนมาเทียบ ตรวจเงื่อนไขและราคาในหน้าร้านก่อนซื้อ`
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
    return 'เรียงตามราคาในข้อมูลเกม ใช้ตรวจสอบเท่านั้น ไม่ได้บอกว่าซื้อได้จริงหรือราคาเต็มของชุดฟลาย หากกำลังเลือกซื้อ ให้ใช้ “มีขายก่อน แล้วเรียงราคา”'
  if (lang === 'ja')
    return 'ゲームデータ内の価格順で、確認用です。実際に買えるかやフライセットの総額は示しません。購入する道具を選ぶには「販売記録→価格」を使ってください。'
  return 'Sorted by the price stored in the game data, for checking only; it does not show what you can really buy or a complete fly price. To choose a purchase, use “Shop availability, then price”.'
}
