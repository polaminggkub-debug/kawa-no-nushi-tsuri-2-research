export function fishingContext(ctx, item) {
  return (
    ['rod', 'bait', 'lure', 'hook', 'float_weight', 'fly', 'fly_wing', 'fly_tail'].includes(
      item.category,
    ) ||
    (item.category === 'general_tool' && ['03', '04', '08', '09', '0A', '0E'].includes(item.id))
  )
}

export function detailItemLink(ctx, item, returnRoute = ctx.currentLocalRoute()) {
  const p = new URLSearchParams()
  p.set('category', item.category)
  p.set('id', item.id)
  if (ctx.fishingContext(item) && ctx.selectedFish) p.set('fish', ctx.selectedFish)
  if (ctx.selectedStage) p.set('stage', String(ctx.selectedStage))
  if (ctx.fishingContext(item) && ctx.selectedRoute) p.set('route', ctx.selectedRoute)
  const safe = ctx.safeLocalRoute(returnRoute)
  if (safe) p.set('return', safe)
  return `item${ctx.lang === 'en' ? '' : `.${ctx.lang}`}.html?${p}`
}

export function stageButton(ctx, stage, fishLocations, label = ctx.copy.shopMap) {
  const name = ctx.stageName(stage, fishLocations),
    p = new URLSearchParams({
      stage: String(stage),
      place: 'town',
      category: ctx.category,
      id: ctx.requestedId,
    })
  const context = ctx.fishingContext({ category: ctx.category, id: ctx.requestedId })
  if (context && ctx.selectedFish) p.set('fish', ctx.selectedFish)
  if (context && ctx.selectedRoute) p.set('route', ctx.selectedRoute)
  const returned = ctx.safeLocalRoute(ctx.currentLocalRoute())
  if (returned) p.set('return', returned)
  const shops = `shops${ctx.lang === 'en' ? '' : `.${ctx.lang}`}.html?${p}`
  return `<a class="route-button" href="${ctx.esc(shops)}">${ctx.esc(label)} · ${ctx.esc(name)} ↗</a>`
}

export function componentLink(ctx, item, label = '') {
  if (!item) return ''
  if (item.category === ctx.category && item.id === ctx.requestedId)
    return `<div class="entity-link" aria-current="true"><img loading="lazy" src="${ctx.esc(item.image)}" alt=""><span>${ctx.esc(label || ctx.imageName(item))}<small>${ctx.lang === 'th' ? 'ชิ้นที่กำลังดู' : ctx.lang === 'ja' ? '表示中の部品' : 'Part currently shown'}</small></span></div>`
  return `<a class="entity-link" href="${ctx.esc(ctx.detailItemLink(item))}"><img loading="lazy" src="${ctx.esc(item.image)}" alt=""><span>${ctx.esc(label || ctx.imageName(item))}<small>ID ${ctx.esc(item.id)} · ${ctx.esc(ctx.copy.component)}</small></span></a>`
}

export function fishTile(ctx, id, fishVisuals, fishLocations, stage) {
  const fish = fishVisuals[id] || {},
    record = fishLocations[id]
  const locs = (record?.locations || []).filter((l) => !stage || Number(l.stage) === Number(stage))
  const actualStage = locs[0]?.stage || (record?.locations || [])[0]?.stage || 0
  const src = fish.image || ''
  const main = `<a class="entity-link-name fish-profile-link" href="${ctx.esc(ctx.fishProfileLink(id, fishLocations))}">${src ? `<img loading="lazy" src="${ctx.esc(src)}" alt="">` : ''}<span><strong>${ctx.esc(ctx.fishName(id, fishVisuals))}</strong><small>ID ${ctx.esc(id)} · ${ctx.esc(ctx.copy.fishProfile)}</small></span></a>`
  const map = actualStage
    ? `<a class="route-button" href="${ctx.esc(ctx.mapLink(actualStage, id))}">${ctx.esc(ctx.copy.mapFish)} · ${ctx.esc(ctx.copy.area(actualStage))}</a>`
    : ''
  return `<article class="entity-link">${main}${map}</article>`
}
