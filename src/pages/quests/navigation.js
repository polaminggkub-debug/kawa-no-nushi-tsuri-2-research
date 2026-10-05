export const pages = {
  index: 'index',
  quests: 'quests',
  item: 'item',
  fish: 'fish',
  maps: 'maps',
  shops: 'shops',
}
export function pageName(type, locale) {
  return `${pages[type] || 'index'}${locale === 'en' ? '' : `.${locale}`}.html`
}
export function safeReturn(raw, base) {
  if (!raw) return ''
  try {
    const url = new URL(raw, base)
    const current = new URL(base)
    const directory = current.pathname.slice(0, current.pathname.lastIndexOf('/') + 1)
    const research = directory.replace(/catalogue\/$/, 'research/')
    const allowed =
      Object.values(pages).some((name) =>
        ['en', 'th', 'ja'].some((locale) => url.pathname === directory + pageName(name, locale)),
      ) ||
      (['index.html', 'index.th.html', 'index.ja.html'].includes(
        url.pathname.slice(research.length),
      ) &&
        url.pathname.startsWith(research))
    return url.origin === current.origin && allowed ? `${url.pathname}${url.search}${url.hash}` : ''
  } catch {
    return ''
  }
}
export function localizeReturn(raw, locale, base, depth = 0) {
  const safe = safeReturn(raw, base)
  if (!safe) return ''
  const url = new URL(safe, base)
  url.pathname = url.pathname.replace(
    /(index|quests|item|fish|maps|shops)(?:\.th|\.ja)?\.html$/,
    (_, name) => pageName(name, locale),
  )
  if (url.searchParams.has('return')) {
    const nested =
      depth < 4 ? localizeReturn(url.searchParams.get('return'), locale, base, depth + 1) : ''
    if (nested) url.searchParams.set('return', nested)
    else url.searchParams.delete('return')
  }
  return `${url.pathname}${url.search}${url.hash}`
}
export function stateParams(ctx, stage = ctx.stage) {
  const query = new URLSearchParams({ stage: String(stage) })
  for (const key of ['fish', 'route']) if (ctx[key]) query.set(key, ctx[key])
  if (ctx.returnRoute) query.set('return', ctx.returnRoute)
  return query
}
export function actionHref(ctx, link, actionId = '') {
  const type = link.type === 'map' ? 'maps' : link.type
  if (!['maps', 'item', 'fish'].includes(type)) return ''
  const query = new URLSearchParams(link.params || {})
  query.set('stage', String(link.stage || ctx.stage))
  if (link.id) query.set('id', link.id)
  if (link.category) query.set('category', link.category)
  if (ctx.route && !query.has('route')) query.set('route', ctx.route)
  query.set(
    'return',
    `${ctx.pathname}?${stateParams(ctx)}${actionId ? `#${encodeURIComponent(actionId)}` : ctx.hash}`,
  )
  const hash = String(link.hash || '').replace(/^#/, '')
  return `${pageName(type, ctx.locale)}?${query}${hash ? `#${encodeURIComponent(hash)}` : ''}`
}
