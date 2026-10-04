function itemAdvice(item) {
  return item.rodDecision || item.baitLureDecision || item.gearDecision
}

function cardActionTitle(ctx, item, advice) {
  if (item.rodDecision) return ctx.rodAdviceTitle
  if (!advice) return ctx.player.use
  return ctx.lang === 'th'
    ? 'ควรซื้อหรือใช้ชิ้นนี้เมื่อไร?'
    : ctx.lang === 'ja'
      ? 'この道具を買う・使うときは？'
      : 'When should I buy or use this?'
}

function cardDecisionAttribute(ctx, item, advice) {
  if (!advice) return ''
  const key = item.rodDecision
    ? 'data-rod-decision'
    : item.baitLureDecision
      ? 'data-bait-lure-decision'
      : 'data-gear-decision'
  return `${key}="${ctx.esc(item.id)}"`
}

function renderCardIdentity(ctx, item, use, detailHref) {
  const image = `<a href="${ctx.esc(detailHref)}" aria-label="${ctx.esc(ctx.itemName(item))} — ${ctx.detailLabel}"><img loading="lazy" src="${ctx.esc(item.image)}" alt="${ctx.esc(ctx.itemName(item))}"></a>`
  const price =
    item.priceYen > 0 && use.shops?.length && !item.category.startsWith('fly')
      ? `<span class="price-badge">${ctx.esc(ctx.formatYen(item))}</span>`
      : ''
  const japanese =
    ctx.itemName(item) !== item.nameJa
      ? `<p class="jp-name" lang="ja">${ctx.esc(item.nameJa)}</p>`
      : ''
  return `<div class="card-main"><figure class="sprite">${image}</figure><div class="card-text"><span class="category-tag">${ctx.esc(ctx.categoryNames[item.category])}</span><h3><a class="entity-title" href="${ctx.esc(detailHref)}">${ctx.esc(ctx.itemName(item))}</a></h3>${ctx.thaiLabel(item)}${japanese}<div class="price-row">${price}<span class="item-id">ID ${ctx.esc(item.id)}</span></div><a class="card-detail-link" href="${ctx.esc(detailHref)}">${ctx.esc(ctx.cardUi.details)} ↗</a></div></div>`
}

function guideEvidenceNote(ctx, use) {
  if (use.evidence?.type !== 'player_guide_report') return ''
  return `<p class="fish-scope">${ctx.lang === 'th' ? 'คำอธิบายการใช้จากคู่มือผู้เล่น ยังไม่ได้ยืนยันจากโค้ดเกม' : ctx.lang === 'ja' ? '用途はプレイヤーガイドによる報告。ゲームコードでは未確認。' : 'Use reported by a player guide; not yet confirmed in game code.'}</p>`
}

function renderCardGuidance(ctx, item, use, summary, facts, advice) {
  const label = advice ? ctx.local(advice.label) : summary
  const factList = facts.length
    ? `<ul class="use-facts">${facts.map((fact) => `<li>${ctx.esc(fact)}</li>`).join('')}</ul>`
    : ''
  const recommendation = advice
    ? `<h5>${ctx.esc(ctx.cardUi.fullRecommendation)}</h5><p class="card-full-recommendation">${ctx.esc(ctx.local(advice.recommendation) || summary)}</p>${advice.reason ? `<p class="card-decision-reason">${ctx.esc(ctx.local(advice.reason))}</p>` : ''}`
    : ''
  const details = [
    recommendation,
    factList,
    guideEvidenceNote(ctx, use),
    advice ? ctx.rodAlternatives(item) : '',
    advice ? ctx.gearNextActions(item) : '',
    advice ? ctx.flyMakerLink(item) : '',
  ].join('')
  const disclosure = ctx.cardDisclosure(
    advice ? ctx.cardUi.decisionDetails : ctx.cardUi.useDetails,
    details,
    advice ? 'card-decision-disclosure' : 'card-use-disclosure',
  )
  const actionTitle = cardActionTitle(ctx, item, advice)
  const dataDecision = cardDecisionAttribute(ctx, item, advice)
  const summaryClass = advice ? 'card-verdict' : 'card-effect'
  return `<div class="use-block" ${dataDecision}><h4>${ctx.esc(actionTitle)}</h4><p class="use-summary ${summaryClass}">${ctx.esc(label)}</p><div class="card-more-content">${disclosure}</div></div>`
}

function renderCardAcquisition(ctx, item) {
  const actions = [
    ctx.baitLurePriceChoices(item),
    ctx.compassUseChoice(item),
    ctx.gatheredBaitChoices(item),
    ctx.baitGatherChoice(item),
    ctx.forageBaitChoice(item, ctx.allItems),
    ctx.mushroomAlternative(item),
    ctx.keepnetAlternatives(item, ctx.allItems),
    ctx.daikonFishChoice(item),
    ctx.acquisitionChoice(item),
  ].join('')
  const sellers = ctx.cardDisclosure(
    ctx.cardUi.buying,
    ctx.shopLocations(item),
    'card-shop-disclosure',
  )
  const choices = ctx.cardDisclosure(ctx.cardUi.moreActions, actions, 'card-actions-disclosure')
  const fish = ctx.cardDisclosure(
    `${ctx.fishHeading(item)} · ${ctx.fishIdsFor(item).length}`,
    ctx.fishList(item),
    'card-fish-disclosure',
  )
  return `${sellers}${choices}${fish}${ctx.toolUseLocations(item)}${ctx.detailedFields(item)}`
}

export function renderItemCard(ctx, item) {
  const use = ctx.useOf(item)
  const { summary, facts } = ctx.visibleUse(item)
  const advice = itemAdvice(item)
  const detailHref = ctx.itemHref(item)
  const identity = renderCardIdentity(ctx, item, use, detailHref)
  const guidance = renderCardGuidance(ctx, item, use, summary, facts, advice)
  const details = renderCardAcquisition(ctx, item)
  const poison = item.category === 'food' && item.id === '0A' ? 'poison-food' : ''
  return `<article class="item-card item-card-compact ${poison}" id="item-${item.category}-${item.id}">${identity}${guidance}${details}</article>`
}
