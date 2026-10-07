function foodCopy(ctx) {
  return {
    th: ['อาหารอื่นที่ซื้อได้ในด่านนี้', 'เทียบอาหารร้านทั้งหมดและเหตุผลที่ควรเติม HP'],
    ja: ['このエリアで買える他の食料', '店の食料全体とHP補充の理由を比較'],
    en: ['Other foods sold in this area', 'Compare all shop foods and why to restore HP'],
  }[ctx.lang]
}

export function foodChoicePanel(ctx, item, allItems, sections) {
  const copy = foodCopy(ctx)
  const hpLabel = (hp) =>
    ctx.lang === 'th'
      ? `ฟื้นได้สูงสุด ${hp} HP`
      : ctx.lang === 'ja'
        ? `最大${hp} HP回復`
        : `Restores up to ${hp} HP`
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
        `<h3>${ctx.esc(ctx.local(section.title))}</h3><p>${ctx.esc(ctx.local(section.recommendation))}</p>${section.reason ? `<p data-hp-basics>${ctx.esc(ctx.local(section.reason))}</p>` : ''}<p class="muted">${ctx.esc(ctx.local(section.scope))}</p>`,
    )
    .join('')
  return `<section class="detail-section buying-decision" data-food-choice>${nearby}<details><summary>${ctx.esc(copy[1])}</summary>${full}<div class="detail-grid" data-all-food-options>${catalogueOptions}</div></details></section>`
}
