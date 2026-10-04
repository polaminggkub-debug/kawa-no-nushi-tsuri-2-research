export function setupCardLinks(ctx) {
  ctx.detailLabel =
    ctx.lang === 'th' ? 'ดูรายละเอียด' : ctx.lang === 'ja' ? '詳細を見る' : 'View details'
  ctx.decisionLink = (ref) => {
    const item = ctx.allItems.find((i) => i.category === ref.category && i.id === ref.id)
    return item
      ? `<a class="decision-item" href="${ctx.esc(ctx.itemHref(item))}"><img src="${ctx.esc(item.image)}" alt=""><span>${ctx.esc(ctx.itemName(item))}</span></a>`
      : ''
  }
  ctx.matchCategory = (item, category) =>
    category === 'all' ||
    (category === 'flymaker' ? item.category.startsWith('fly') : item.category === category)
  ctx.rodAdviceTitle =
    ctx.lang === 'th'
      ? 'ควรเลือกคันนี้เมื่อไร?'
      : ctx.lang === 'ja'
        ? 'この竿を選ぶときは？'
        : 'When should I choose this rod?'
  ctx.rodAlternatives = (item) =>
    (item.rodDecision || item.gearDecision || item.baitLureDecision)?.alternatives?.some(
      (ref) => ref.category !== item.category || ref.id !== item.id,
    )
      ? `<div class="rod-alternatives"><p>${ctx.lang === 'th' ? 'ตัวเลือกที่นำมาเทียบ:' : ctx.lang === 'ja' ? '比較する候補：' : 'Compare with:'}</p>${(
          item.rodDecision ||
          item.gearDecision ||
          item.baitLureDecision
        ).alternatives
          .filter((ref) => ref.category !== item.category || ref.id !== item.id)
          .map(ctx.decisionLink)
          .join('')}</div>`
      : ''
  ctx.flyMakerLink = (item) =>
    item.category.startsWith('fly')
      ? `<p><a class="route-button" data-fly-maker href="${ctx.esc(ctx.sourceReturn().split('#')[0] + '#fly-instructions')}">${ctx.lang === 'th' ? 'ดูขั้นตอนประกอบฟลายเองและตรวจราคาในเกม' : ctx.lang === 'ja' ? '自作フライの手順とゲーム内見積額を確認' : 'See custom fly steps and check the in-game quote'} ↗</a></p>`
      : ''
}
