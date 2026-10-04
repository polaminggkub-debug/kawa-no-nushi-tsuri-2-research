function foodCopy(ctx) {
  return {
    th: [
      'อาหารอื่นที่ซื้อได้ในด่านนี้',
      'เทียบอาหารร้านทั้งหมดและเหตุผลที่ควรเติม HP',
      'ถ้ามีอาหารเหลืออยู่ ใช้ของเดิมก่อนซื้อเพิ่ม',
    ],
    ja: [
      'このエリアで買える他の食料',
      '店の食料全体とHP補充の理由を比較',
      '食料が残っていれば、買い足す前に使う。',
    ],
    en: [
      'Other foods sold in this area',
      'Compare all shop foods and why to restore HP',
      'Use remaining food before buying more.',
    ],
  }[ctx.lang]
}

export function foodChoicePanel(ctx, item, allItems, sections) {
  const copy = foodCopy(ctx)
  const alternatives = allItems.filter(
    (other) =>
      other.category === 'food' &&
      other.id !== item.id &&
      other.priceYen > 0 &&
      other.playerUse?.shops?.some((shop) => Number(shop.stage) === ctx.selectedStage),
  )
  const nearby = ctx.selectedStage
    ? `<h3>${ctx.esc(copy[0])} · ${ctx.selectedStage}</h3><div class="detail-grid" data-local-food-options>${alternatives.map((other) => `<article>${ctx.componentLink(other)}<p>${ctx.esc(ctx.copy.price(other.priceYen))}</p></article>`).join('')}</div>`
    : ''
  const catalogueLinks = allItems
    .filter((other) => other.category === 'food' && other.priceYen > 0 && other.id !== item.id)
    .map((other) => ctx.componentLink(other))
    .join('')
  const full = sections
    .map(
      (section) =>
        `<h3>${ctx.esc(ctx.local(section.title))}</h3><p>${ctx.esc(ctx.local(section.recommendation))}</p><p class="muted">${ctx.esc(ctx.local(section.scope))}</p>`,
    )
    .join('')
  return `<section class="detail-section buying-decision" data-food-choice><p>${ctx.esc(copy[2])}</p>${nearby}<details><summary>${ctx.esc(copy[1])}</summary>${full}<div class="detail-grid">${catalogueLinks}</div></details></section>`
}
