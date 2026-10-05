import { distinctFishNames } from './fish-names.js'

export function localizedFishName(ctx, fish, profileId) {
  const latin =
    fish.nameLatin || (fish.nameLatinVariants || []).slice().sort((a, b) => b.length - a.length)[0]
  if (ctx.locale === 'th')
    return (
      fish.nameTh ||
      distinctFishNames(fish.nameThVariants || []).join(' / ') ||
      latin ||
      fish.nameJa ||
      ctx.copy.unknownName(profileId)
    )
  if (ctx.locale === 'ja') return fish.nameJa || ctx.copy.unknownFish(profileId)
  return fish.nameEn || latin || fish.nameJa || ctx.copy.unknownFish(profileId)
}

export function localizedItemName(ctx, item) {
  if (ctx.locale === 'th')
    return item.nameTh || item.playerUse?.displayName?.th || item.nameJa || item.nameEn || item.id
  if (ctx.locale === 'ja') return item.nameJa || item.nameEn || item.id
  return item.nameEn || item.nameJa || item.id
}

export function getLocations(ctx, locationData) {
  const table = locationData?.fish || locationData || {}
  return table[ctx.id]?.locations || []
}

export function matchingItems(ctx, items) {
  const found = new Map()
  for (const item of items) {
    const use = item.playerUse || {}
    if (!['bait', 'lure', 'fly'].includes(item.category)) continue
    if (item.category === 'bait') {
      const routes = use.fishIdsByRoute || {}
      const allowedRoutes = ['float', 'sinker'].filter((route) =>
        (routes[route] || []).includes(ctx.id),
      )
      if (allowedRoutes.length)
        found.set(`${item.category}:${item.id}`, { item, routes: allowedRoutes })
    } else if ((use.fishIds || []).includes(ctx.id)) {
      found.set(`${item.category}:${item.id}`, { item, routes: [] })
    }
  }
  return [...found.values()].sort(
    (a, b) =>
      ctx.localizedItemName(a.item).localeCompare(ctx.localizedItemName(b.item), ctx.locale) ||
      a.item.id.localeCompare(b.item.id),
  )
}

export function itemLink(ctx, entry, stage) {
  const item = entry.item
  const query = new URLSearchParams({ category: item.category, id: item.id })
  if (!['food', 'general_tool'].includes(item.category)) query.set('fish', ctx.id)
  if (stage) query.set('stage', stage)
  query.set('return', ctx.currentFishPath(stage))
  const itemHref = `${ctx.itemPath()}?${query.toString()}`
  const image = item.image
    ? `<a class="entity-link-image" href="${ctx.escapeHtml(itemHref)}" aria-label="${ctx.escapeHtml(ctx.copy.viewItem)}: ${ctx.escapeHtml(ctx.localizedItemName(item))}"><img loading="lazy" src="${ctx.escapeHtml(item.image)}" alt=""></a>`
    : ''
  const routeLinks = entry.routes.length
    ? `<span class="item-routes">${entry.routes
        .map((route) => {
          const routeQuery = new URLSearchParams(query)
          routeQuery.set('route', route)
          return `<a href="${ctx.escapeHtml(ctx.itemPath())}?${routeQuery.toString()}" class="route-button item-route">${ctx.escapeHtml(route === 'float' ? ctx.copy.float : ctx.copy.sinker)}</a>`
        })
        .join('')}</span>`
    : ''
  return `<article class="entity-link">${image}<a class="entity-link-name" href="${ctx.escapeHtml(itemHref)}"><strong>${ctx.escapeHtml(ctx.localizedItemName(item))}</strong><span class="muted">ID ${ctx.escapeHtml(item.id)}</span></a>${routeLinks}</article>`
}

export function starterOffers(ctx, entries, stage) {
  const methods = [
    ['float', ctx.copy.float],
    ['sinker', ctx.copy.sinker],
    ['lure', ctx.copy.lure],
    ['fly', ctx.copy.fly],
  ]
  return methods.flatMap(([method, label]) => {
    const candidates = []
    for (const entry of entries) {
      const item = entry.item
      if (method === 'float' || method === 'sinker') {
        if (item.category !== 'bait' || !entry.routes.includes(method)) continue
      } else if (item.category !== method) continue
      for (const shop of item.playerUse?.shops || []) {
        if (String(shop.stage) !== stage || shop.condition) continue
        const price = method === 'fly' ? shop.bundle?.shopPriceYen : item.priceYen
        if (!Number.isFinite(price) || price < 0) continue
        candidates.push({ entry, method, label, price, bundle: shop.bundle || null })
      }
    }
    candidates.sort((a, b) => a.price - b.price || a.entry.item.id.localeCompare(b.entry.item.id))
    return candidates.length ? [candidates[0]] : []
  })
}
