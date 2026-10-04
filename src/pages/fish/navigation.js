export function normalizeId(ctx, value) {
  if (!value || !/^(?:0x)?[0-9a-f]{1,2}$/i.test(value.trim())) return ''
  return Number.parseInt(value.trim().replace(/^0x/i, ''), 16)
    .toString(16)
    .toUpperCase()
    .padStart(2, '0')
}

export function validStage(ctx, value) {
  return /^[1-6]$/.test(value || '') ? value : ''
}

export function safeLocalReturn(ctx, value) {
  if (
    !value ||
    value.startsWith('//') ||
    value.includes('\\') ||
    /^[a-z][a-z0-9+.-]*:/i.test(value)
  )
    return ''
  let target
  const catalogueDirectory = new URL('.', window.location.href)
  try {
    target = new URL(value, catalogueDirectory)
  } catch {
    return ''
  }
  if (target.origin !== window.location.origin) return ''
  const catalogueNames = [
    'index.html',
    'index.th.html',
    'index.ja.html',
    'maps.html',
    'maps.th.html',
    'maps.ja.html',
    'fish.html',
    'fish.th.html',
    'fish.ja.html',
    'item.html',
    'item.th.html',
    'item.ja.html',
    'shops.html',
    'shops.th.html',
    'shops.ja.html',
  ]
  const researchNames = ['index.html', 'index.th.html', 'index.ja.html']
  const allowed = new Set([
    ...catalogueNames.map((name) => new URL(name, catalogueDirectory).pathname),
    ...researchNames.map((name) => new URL(`../research/${name}`, catalogueDirectory).pathname),
  ])
  if (!allowed.has(target.pathname)) return ''
  const relativePath = target.pathname.startsWith(catalogueDirectory.pathname)
    ? target.pathname.slice(catalogueDirectory.pathname.length)
    : `../research/${target.pathname.split('/').pop()}`
  return `${relativePath}${target.search}${target.hash}`
}

export function localizeReturn(ctx, value, targetLocale, depth = 0) {
  const route = ctx.safeLocalReturn(value)
  if (!route) return ''
  const catalogueDirectory = new URL('.', window.location.href)
  let target
  try {
    target = new URL(route, catalogueDirectory)
  } catch {
    return ''
  }
  const basename = target.pathname.split('/').pop()
  const root = basename.replace(/(?:\.(?:th|ja))?\.html$/, '')
  if (['index', 'maps', 'fish', 'item', 'shops'].includes(root)) {
    const directory = target.pathname.slice(0, target.pathname.lastIndexOf('/') + 1)
    target.pathname = `${directory}${root}${targetLocale === 'en' ? '' : `.${targetLocale}`}.html`
  }
  const nestedReturn = target.searchParams.get('return')
  if (nestedReturn) {
    if (depth >= 4) {
      target.searchParams.delete('return')
    } else {
      const localizedNested = ctx.localizeReturn(nestedReturn, targetLocale, depth + 1)
      if (localizedNested) target.searchParams.set('return', localizedNested)
      else target.searchParams.delete('return')
    }
  }
  const relativePath = target.pathname.startsWith(catalogueDirectory.pathname)
    ? target.pathname.slice(catalogueDirectory.pathname.length)
    : `../research/${target.pathname.split('/').pop()}`
  return `${relativePath}${target.search}${target.hash}`
}

export function escapeHtml(ctx, value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch],
  )
}

export function currentFishPath(ctx, stage = ctx.requestedStage) {
  const query = new URLSearchParams()
  if (ctx.id) query.set('id', ctx.id)
  if (stage) query.set('stage', stage)
  if (ctx.requestedMethod) query.set('route', ctx.requestedMethod)
  if (ctx.localReturn) query.set('return', ctx.localReturn)
  return `${window.location.pathname.split('/').pop()}?${query.toString()}`
}

export function mapPath(ctx) {
  return ctx.locale === 'th' ? 'maps.th.html' : ctx.locale === 'ja' ? 'maps.ja.html' : 'maps.html'
}

export function cataloguePath(ctx) {
  return ctx.locale === 'th'
    ? 'index.th.html'
    : ctx.locale === 'ja'
      ? 'index.ja.html'
      : 'index.html'
}

export function itemPath(ctx) {
  return ctx.locale === 'th' ? 'item.th.html' : ctx.locale === 'ja' ? 'item.ja.html' : 'item.html'
}

export function fishMapLink(ctx, stage, section = '') {
  const query = new URLSearchParams({ fish: ctx.id })
  if (stage) query.set('stage', String(stage))
  if (/^s[1-6]-c\d+-r\d+$/.test(section)) query.set('section', section)
  query.set('return', ctx.currentFishPath(stage))
  return `${ctx.mapPath()}?${query.toString()}`
}

export function setNavigation(ctx, stage) {
  const mapHref = ctx.fishMapLink(stage)
  const back = document.getElementById('fish-back')
  back.href = ctx.localReturn || (stage ? mapHref : ctx.cataloguePath())
  back.textContent = ctx.localReturn ? ctx.copy.back : stage ? ctx.copy.map : ctx.copy.catalogue
  document.getElementById('fish-map-link').href = stage ? mapHref : ctx.cataloguePath()
  document.getElementById('fish-map-link').hidden = !stage
  for (const lang of ['en', 'th', 'ja']) {
    const href = lang === 'th' ? 'fish.th.html' : lang === 'ja' ? 'fish.ja.html' : 'fish.html'
    const link = document.getElementById(`language-${lang}`)
    const query = new URLSearchParams()
    if (ctx.id) query.set('id', ctx.id)
    if (stage) query.set('stage', stage)
    const localizedReturn = ctx.localizeReturn(ctx.localReturn, lang)
    if (localizedReturn) query.set('return', localizedReturn)
    link.href = `${href}${query.size ? `?${query.toString()}` : ''}${location.hash || ''}`
  }
}
