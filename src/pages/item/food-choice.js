function foodCopy(ctx) {
  return {
    th: [
      'อาหารอื่นที่ซื้อได้ในด่านนี้',
      'เทียบอาหารร้านทั้งหมดและเหตุผลที่ควรเติม HP',
      'ถ้ามีอาหารจากร้านอยู่แล้ว ให้ใช้ก่อนซื้อเพิ่ม; อาหารร้านทั้ง 6 แบบราคา 1 เยนต่อ HP เลือกชิ้นที่ฟื้นใกล้ HP ที่ขาด เพราะส่วนที่เกิน HP สูงสุดจะถูกตัดทิ้ง',
    ],
    ja: [
      'このエリアで買える他の食料',
      '店の食料全体とHP補充の理由を比較',
      '店で買った食料を持っているなら、買い足す前に使ってください。店の食料6種はどれも1HPあたり1円。不足HPに近い回復量を選ぶと、最大HPを超えた分を無駄にしません。',
    ],
    en: [
      'Other foods sold in this area',
      'Compare all shop foods and why to restore HP',
      'Use shop food you already own before buying more. All six shop foods cost ¥1 per HP; choose an amount close to your missing HP to avoid recovery wasted above your maximum.',
    ],
  }[ctx.lang]
}

export function foodChoicePanel(ctx, item, allItems, sections) {
  const copy = foodCopy(ctx)
  const hpLabel = (hp) =>
    ctx.lang === 'th'
      ? `ฟื้น HP +${hp} หน่วย`
      : ctx.lang === 'ja'
        ? `HP+${hp}回復`
        : `Restores +${hp} HP`
  const foodOption = (other) => {
    const hp = other.playerUse?.hpRecovery?.hp
    if (!Number.isSafeInteger(hp) || hp <= 0) return ''
    return `<article data-food-option="${ctx.esc(other.id)}" data-food-hp="${hp}">${ctx.componentLink(other)}<p class="food-option-hp">${ctx.esc(hpLabel(hp))}</p><p>${ctx.esc(ctx.copy.price(other.priceYen))}</p></article>`
  }
  const alternatives = allItems.filter(
    (other) =>
      other.category === 'food' &&
      other.id !== item.id &&
      other.priceYen > 0 &&
      other.playerUse?.shops?.some((shop) => Number(shop.stage) === ctx.selectedStage),
  )
  const nearby = ctx.selectedStage
    ? `<h3>${ctx.esc(copy[0])} · ${ctx.selectedStage}</h3><div class="detail-grid" data-local-food-options>${alternatives.map(foodOption).join('')}</div>`
    : ''
  const catalogueOptions = allItems
    .filter((other) => other.category === 'food' && other.priceYen > 0 && other.id !== item.id)
    .map(foodOption)
    .join('')
  const full = sections
    .map(
      (section) =>
        `<h3>${ctx.esc(ctx.local(section.title))}</h3><p>${ctx.esc(ctx.local(section.recommendation))}</p><p class="muted">${ctx.esc(ctx.local(section.scope))}</p>`,
    )
    .join('')
  return `<section class="detail-section buying-decision" data-food-choice><p>${ctx.esc(copy[2])}</p>${nearby}<details><summary>${ctx.esc(copy[1])}</summary>${full}<div class="detail-grid" data-all-food-options>${catalogueOptions}</div></details></section>`
}
