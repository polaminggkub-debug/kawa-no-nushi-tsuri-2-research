const pageRoots = ['index', 'maps', 'fish', 'item', 'shops']
const locales = ['en', 'th', 'ja']

function routeForTarget(target, base) {
  if (target.pathname.startsWith(base.pathname))
    return target.pathname.slice(base.pathname.length) + target.search + target.hash
  return `../research/${target.pathname.split('/').pop()}${target.search}${target.hash}`
}

export function safeLocalReturn(raw, baseHref) {
  if (!raw || raw.startsWith('//') || raw.includes('\\') || /^[a-z][a-z0-9+.-]*:/i.test(raw))
    return ''
  try {
    const base = new URL('.', baseHref)
    const target = new URL(raw, base)
    if (target.origin !== base.origin) return ''
    const allowed = pageRoots.flatMap((root) =>
      locales.map(
        (locale) => new URL(`${root}${locale === 'en' ? '' : `.${locale}`}.html`, base).pathname,
      ),
    )
    allowed.push(
      ...locales.map(
        (locale) =>
          new URL(`../research/index${locale === 'en' ? '' : `.${locale}`}.html`, base).pathname,
      ),
    )
    return allowed.includes(target.pathname) ? routeForTarget(target, base) : ''
  } catch {
    return ''
  }
}

export function localizeSafeReturn(raw, targetLocale, baseHref, depth = 0) {
  if (!locales.includes(targetLocale)) return ''
  const safe = safeLocalReturn(raw, baseHref)
  if (!safe) return ''
  const base = new URL('.', baseHref)
  const target = new URL(safe, base)
  const root = target.pathname
    .split('/')
    .pop()
    .match(/^(index|maps|fish|item|shops)(?:\.(?:th|ja))?\.html$/)?.[1]
  if (root) {
    const directory = target.pathname.slice(0, target.pathname.lastIndexOf('/') + 1)
    target.pathname = `${directory}${root}${targetLocale === 'en' ? '' : `.${targetLocale}`}.html`
  }
  const nested = target.searchParams.get('return')
  if (nested) {
    const localized = depth < 4 ? localizeSafeReturn(nested, targetLocale, baseHref, depth + 1) : ''
    if (localized) target.searchParams.set('return', localized)
    else target.searchParams.delete('return')
  }
  return safeLocalReturn(routeForTarget(target, base), baseHref)
}

function isMapRoute(raw, baseHref) {
  const safe = safeLocalReturn(raw, baseHref)
  if (!safe) return false
  return /^maps(?:\.(?:th|ja))?\.html(?:[?#]|$)/.test(safe)
}

function backLabel(locale) {
  return locale === 'th'
    ? '← กลับไปแผนที่ปลา'
    : locale === 'ja'
      ? '← 魚マップに戻る'
      : '← Back to fish map'
}

function updateLanguageLinks(rawReturn, baseHref) {
  const current = new URL(baseHref)
  document.querySelectorAll('.language-links a').forEach((link) => {
    const locale = link.getAttribute('hreflang')
    if (!locales.includes(locale)) return
    const route = link.dataset.route || link.getAttribute('href').split(/[?#]/)[0]
    link.dataset.route = route
    const query = new URLSearchParams(current.search)
    query.set('return', localizeSafeReturn(rawReturn, locale, baseHref))
    link.href = `${route}?${query}${current.hash}`
  })
}

export function mapReturnAction(rawReturn, locale, baseHref) {
  const safe = localizeSafeReturn(rawReturn, locale, baseHref)
  if (!safe || !isMapRoute(safe, baseHref)) return null
  return { href: safe, label: backLabel(locale) }
}

export function setupReturnAction(ctx) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  const rawReturn = new URLSearchParams(window.location.search).get('return') || ''
  const action = mapReturnAction(rawReturn, ctx.lang, window.location.href)
  if (!action) return
  const nav = document.querySelector('.hero-meta')
  if (nav && !document.querySelector('[data-map-return]')) {
    const link = document.createElement('a')
    link.className = 'back-link map-return-link'
    link.dataset.mapReturn = 'true'
    link.href = action.href
    link.textContent = action.label
    nav.prepend(link)
  }
  updateLanguageLinks(action.href, window.location.href)
}

export function mapReturnMarkup(ctx) {
  if (typeof window === 'undefined') return ''
  const raw = new URLSearchParams(window.location.search).get('return') || ''
  const action = mapReturnAction(raw, ctx.lang, window.location.href)
  return action
    ? `<p><a class="route-button" data-map-panel-return href="${ctx.esc(action.href)}">${ctx.esc(action.label)}</a></p>`
    : ''
}
