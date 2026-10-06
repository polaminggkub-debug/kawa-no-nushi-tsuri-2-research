export function safeLocalRoute(ctx, raw) {
  if (!raw) return ''
  try {
    const url = new URL(raw, location.href)
    if (
      url.origin !== location.origin ||
      !(ctx.routeFiles.catalogue.test(url.pathname) || ctx.routeFiles.research.test(url.pathname))
    )
      return ''
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return ''
  }
}

function retainsFishingTarget(ctx) {
  return ['rod', 'hook', 'bait', 'lure', 'fly', 'fly_wing', 'fly_tail', 'float_weight'].includes(
    ctx.category,
  )
}

function addFishingTarget(ctx, params) {
  if (!retainsFishingTarget(ctx)) return
  if (ctx.selectedFish) params.set('fish', ctx.selectedFish)
  if (ctx.selectedRoute) params.set('route', ctx.selectedRoute)
}

export function fallbackBack(ctx) {
  const p = new URLSearchParams()
  if (ctx.category)
    p.set(
      'category',
      ['fly', 'fly_wing', 'fly_tail'].includes(ctx.category) ? 'flymaker' : ctx.category,
    )
  if (['fly', 'fly_wing', 'fly_tail'].includes(ctx.category)) p.set('part', ctx.category)
  addFishingTarget(ctx, p)
  if (ctx.selectedStage) p.set('stage', String(ctx.selectedStage))
  return `${ctx.cataloguePage[ctx.lang]}${p.size ? `?${p}` : ''}#catalogue`
}

export function currentLocalRoute(_ctx) {
  return `${location.pathname}${location.search}${location.hash}`
}

export function localizeReturn(ctx, raw, toLang, depth = 0) {
  const route = ctx.safeLocalRoute(raw)
  if (!route) return ''
  const url = new URL(route, location.href)
  const basename = url.pathname.split('/').pop()
  const root = basename.replace(/(?:\.(?:th|ja))?\.html$/, '')
  if (['index', 'maps', 'fish', 'item', 'shops', 'quests'].includes(root)) {
    const directory = url.pathname.slice(0, url.pathname.lastIndexOf('/') + 1)
    url.pathname = `${directory}${root}${toLang === 'en' ? '' : `.${toLang}`}.html`
  }
  if (url.searchParams.has('return')) {
    const nested =
      depth < 4 ? ctx.localizeReturn(url.searchParams.get('return'), toLang, depth + 1) : ''
    if (nested) url.searchParams.set('return', nested)
    else url.searchParams.delete('return')
  }
  return `${url.pathname}${url.search}${url.hash}`
}

export function setNavigation(ctx) {
  const rawReturn = ctx.params.get('return') || ''
  ctx.$('detail-back').href = ctx.safeLocalRoute(rawReturn) || ctx.fallbackBack()
  ctx.$('detail-back').textContent = ctx.copy.back
  document.querySelectorAll('.language-links a').forEach((link) => {
    const targetLang = link.getAttribute('hreflang')
    if (!targetLang) return
    const next = new URLSearchParams(location.search)
    const returned = ctx.localizeReturn(rawReturn, targetLang)
    if (returned) next.set('return', returned)
    link.href = `${ctx.localePage[targetLang]}${next.size ? `?${next}` : ''}${location.hash || ''}`
    if (targetLang === ctx.lang) link.setAttribute('aria-current', 'page')
    else link.removeAttribute('aria-current')
  })
}

export function currentCategoryLink(ctx) {
  const p = new URLSearchParams(),
    fly = ['fly', 'fly_wing', 'fly_tail'].includes(ctx.category)
  p.set('category', fly ? 'flymaker' : ctx.category || 'all')
  if (fly) p.set('part', ctx.category)
  addFishingTarget(ctx, p)
  if (ctx.selectedStage) p.set('stage', String(ctx.selectedStage))
  return `${ctx.cataloguePage[ctx.lang]}?${p}#catalogue`
}

export function mapLink(ctx, stage, fish = '') {
  const p = new URLSearchParams()
  p.set('stage', String(stage))
  if (fish) p.set('fish', fish)
  if (retainsFishingTarget(ctx) && ctx.selectedRoute) p.set('route', ctx.selectedRoute)
  const returnRoute = ctx.safeLocalRoute(ctx.currentLocalRoute())
  if (returnRoute) p.set('return', returnRoute)
  return `${ctx.mapsPage[ctx.lang]}?${p}${fish ? '#map-view' : ''}`
}

export function fishProfileLink(ctx, id, fishLocations) {
  const locations = fishLocations[id]?.locations || []
  const location = locations.find((loc) => Number(loc.stage) === ctx.selectedStage) || locations[0]
  const p = new URLSearchParams({ id })
  if (retainsFishingTarget(ctx) && ctx.selectedRoute) p.set('route', ctx.selectedRoute)
  if (location?.stage) p.set('stage', String(location.stage))
  const returnRoute = ctx.safeLocalRoute(ctx.currentLocalRoute())
  if (returnRoute) p.set('return', returnRoute)
  return `fish${ctx.lang === 'en' ? '' : `.${ctx.lang}`}.html?${p}`
}
