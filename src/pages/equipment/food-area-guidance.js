function stageFoodItems(items, stage) {
  return items
    .filter((item) => {
      const hp = item.playerUse?.hpRecovery?.hp
      const stocked = (item.playerUse?.shops || []).some(
        (shop) => Number(shop.stage) === stage && !shop.condition,
      )
      return (
        item.category === 'food' &&
        Number.isSafeInteger(hp) &&
        hp > 0 &&
        Number.isFinite(item.priceYen) &&
        item.priceYen > 0 &&
        stocked
      )
    })
    .sort(
      (first, second) =>
        first.playerUse.hpRecovery.hp - second.playerUse.hpRecovery.hp ||
        first.priceYen - second.priceYen ||
        first.id.localeCompare(second.id),
    )
}

function foodItemNote(ctx, item) {
  const hp = item.playerUse.hpRecovery.hp
  const note =
    ctx.lang === 'ja'
      ? `${hp}HP回復 · ${item.priceYen}円`
      : ctx.lang === 'th'
        ? `ฟื้น ${hp} HP · ¥${item.priceYen}`
        : `Restores ${hp} HP · ¥${item.priceYen}`
  return { [ctx.lang]: note }
}

function foodValueNote(ctx, foods) {
  const samePricePerHp = foods.every((item) => item.priceYen === item.playerUse.hpRecovery.hp)
  if (!samePricePerHp) return ''
  if (ctx.lang === 'th') return 'ทุกชิ้นราคา ¥1 ต่อ HP'
  if (ctx.lang === 'ja') return 'すべて1HPあたり1円'
  return 'All cost ¥1 per HP'
}

function areaFoodRecommendation(ctx, stage, foods) {
  const valueNote = foodValueNote(ctx, foods)
  if (ctx.lang === 'th')
    return `อาหารที่มีขายปกติในด่าน ${stage}${valueNote ? ` ${valueNote}` : ''} ถ้ามีอาหารที่เหมาะอยู่แล้วให้ใช้ก่อน แล้วเลือกอาหารหรือรวมหลายชิ้นให้ฟื้นใกล้ HP ที่ขาดที่สุด เพราะส่วนที่ฟื้นเกินจะเสียเปล่า`
  if (ctx.lang === 'ja')
    return `エリア${stage}の通常販売食料${valueNote ? `：${valueNote}` : ''}。使える食料を持っていれば先に使い、不足HPに近い量を選ぶか組み合わせてください。超過分は無駄になります。`
  return `Regular foods stocked in Area ${stage}${valueNote ? `: ${valueNote}` : ''}. Use suitable food you already own first, then choose or combine servings close to your missing HP; excess recovery is wasted.`
}

export function contextualFoodDecision(ctx, decision) {
  if (decision.id !== 'food_hp_choice') return decision
  const stage = Number(ctx.locationStage)
  if (!Number.isInteger(stage) || stage < 1 || stage > 6) return decision
  const foods = stageFoodItems(ctx.allItems || [], stage)
  if (!foods.length) return decision
  return {
    ...decision,
    foodAreaStage: stage,
    recommendation: {
      ...decision.recommendation,
      [ctx.lang]: areaFoodRecommendation(ctx, stage, foods),
    },
    items: foods.map((item) => ({ category: 'food', id: item.id, note: foodItemNote(ctx, item) })),
  }
}
