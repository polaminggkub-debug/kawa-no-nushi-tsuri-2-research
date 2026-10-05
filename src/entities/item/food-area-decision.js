function recommendation(lang, stage, hp, price, stocked) {
  if (lang === 'th')
    return stocked
      ? `ด่าน ${stage} มีขายชิ้นนี้ราคา ¥${price} ฟื้นได้สูงสุด ${hp} HP ถ้ามีอาหารที่เหมาะอยู่แล้วใช้ก่อนซื้อเพิ่ม เลือกปริมาณให้ใกล้ HP ที่ขาด เพราะส่วนที่เกินจะเสียเปล่า`
      : `ถ้ามีชิ้นนี้อยู่แล้ว ใช้ฟื้นได้สูงสุด ${hp} HP โดยไม่เกิน HP ที่ขาด ด่าน ${stage} ไม่มีรายการขายชิ้นนี้ ถ้าจะซื้อใหม่ ให้เลือกอาหารที่มีขายในด่านนี้แทน`
  if (lang === 'ja')
    return stocked
      ? `エリア${stage}では${price}円で購入でき、最大${hp}HP回復。使える食料を持っていれば先に使い、不足HPに近い量を選んで超過分を無駄にしないでください。`
      : `持っていれば不足HPを上限に最大${hp}HP回復できます。エリア${stage}の販売記録にはありません。買うならこのエリアで売られている食料を選んでください。`
  return stocked
    ? `Sold in Area ${stage} for ¥${price}; restores up to ${hp} HP. Use suitable food you already own before buying more. Match recovery to missing HP because excess is wasted.`
    : `If you already own this, use it to restore up to ${hp} HP, capped at missing HP. It is not in Area ${stage}'s recorded stock. If buying food, choose a locally stocked option instead.`
}

export function foodAreaDecision(lang, item, selectedStage) {
  const stage = Number(selectedStage)
  const hp = item.playerUse?.hpRecovery?.hp
  if (item.category !== 'food' || !/^0[1-6]$/.test(item.id)) return null
  if (!Number.isInteger(stage) || stage < 1 || stage > 6) return null
  if (!Number.isSafeInteger(hp) || hp <= 0 || !(item.priceYen > 0)) return null
  const stocked = (item.playerUse?.shops || []).some(
    (shop) => Number(shop.stage) === stage && !shop.condition,
  )
  return { stage, stocked, summary: recommendation(lang, stage, hp, item.priceYen, stocked) }
}
