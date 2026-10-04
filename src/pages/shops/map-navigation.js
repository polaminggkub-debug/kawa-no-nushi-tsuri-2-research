export function safeReturn(ctx, raw) {
  if (!raw) return ''
  try {
    const url = new URL(raw, location.href)
    return url.origin === location.origin && ctx.allowedReturn.test(url.pathname)
      ? `${url.pathname}${url.search}${url.hash}`
      : ''
  } catch {
    return ''
  }
}

export function localizeRoute(ctx, raw, locale, depth = 0) {
  const safe = ctx.safeReturn(raw)
  if (!safe) return ''
  const url = new URL(safe, location.origin)
  const match = url.pathname.match(
    /\/(?:catalogue|research)\/(index|maps|fish|item|shops)(?:\.th|\.ja)?\.html$/,
  )
  if (!match) return ''
  url.pathname = url.pathname.replace(
    /(index|maps|fish|item|shops)(?:\.th|\.ja)?\.html$/,
    ctx.pages[match[1]][locale],
  )
  if (url.searchParams.has('return')) {
    const nested =
      depth < 4 ? ctx.localizeRoute(url.searchParams.get('return'), locale, depth + 1) : ''
    if (nested) url.searchParams.set('return', nested)
    else url.searchParams.delete('return')
  }
  return `${url.pathname}${url.search}${url.hash}`
}

export function stateParams(ctx, overrides = {}) {
  const state = {
    stage: String(Number(ctx.$('stage-select')?.value || ctx.startStage)),
    place:
      (document.querySelector('input[name="place"]:checked')?.value || ctx.startPlace) === 'outdoor'
        ? 'area'
        : 'town',
    category: ctx.$('category-select')?.value || ctx.startCategory || 'all',
    id: ctx.targetCategory && ctx.targetId ? ctx.targetId : '',
    entrance: ctx.focusedEntrance === null ? '' : String(ctx.focusedEntrance),
    fish: ctx.selectedFish,
    route: ctx.selectedRig,
    q: ctx.$('item-search')?.value || '',
    return: ctx.returnRoute,
    ...overrides,
  }
  const out = new URLSearchParams()
  for (const [key, value] of Object.entries(state))
    if (value && !(key === 'category' && value === 'all')) out.set(key, value)
  return out
}

export function refreshUrl(ctx) {
  history.replaceState(
    null,
    '',
    `${location.pathname}?${ctx.stateParams().toString()}${location.hash}`,
  )
}

export function targetReturn(ctx) {
  return `${location.pathname}?${ctx.stateParams().toString()}${location.hash}`
}

export function itemHref(ctx, item) {
  const query = new URLSearchParams({
    category: item.category,
    id: item.id,
    return: ctx.targetReturn(),
  })
  query.set('stage', ctx.stateParams().get('stage'))
  const fishRelevant =
    ['rod', 'bait', 'lure', 'hook', 'float_weight', 'fly', 'fly_wing', 'fly_tail'].includes(
      item.category,
    ) ||
    (item.category === 'general_tool' && ['03', '04', '08', '09', '0A', '0E'].includes(item.id))
  if (fishRelevant && ctx.selectedFish) query.set('fish', ctx.selectedFish)
  if (fishRelevant && ctx.selectedRig) query.set('route', ctx.selectedRig)
  return `${ctx.pages.item[ctx.lang]}?${query}`
}

export function fishHref(ctx, id) {
  const query = new URLSearchParams({ id, stage: '3', return: ctx.targetReturn() })
  return `${ctx.pages.fish[ctx.lang]}?${query}`
}

export function itemName(ctx, item) {
  if (ctx.lang === 'th')
    return item.nameTh || item.playerUse?.displayName?.th || item.nameJa || item.nameEn || item.id
  if (ctx.lang === 'ja')
    return item.playerUse?.displayName?.ja || item.nameJa || item.nameEn || item.id
  return item.playerUse?.displayName?.en || item.nameEn || item.nameJa || item.id
}

export function imagePath(ctx, name) {
  if (!name) return ''
  return String(name).startsWith('catalogue/') ? `../${name}` : name
}

export function catName(ctx, category) {
  return ctx.text.types[category] || category
}

export function mapAsset(ctx, path) {
  if (!path) return ''
  const value = String(path)
  if (value.startsWith('catalogue/')) return `../${value}`
  if (value.startsWith('maps/')) return value
  return `maps/${value}`
}

export function cropCanvas(ctx, canvas, imagePathValue, point, imageBounds) {
  const image = new Image()
  image.onload = () => {
    const tilePx = 16
    const spanTiles = 16
    const span = spanTiles * tilePx
    canvas.width = span
    canvas.height = span
    const cx = point.x * tilePx + 8,
      cy = point.y * tilePx + 8
    const maxX = Number(imageBounds?.width || image.width),
      maxY = Number(imageBounds?.height || image.height)
    let sx = Math.max(0, Math.min(maxX - span, Math.round(cx - span / 2)))
    let sy = Math.max(0, Math.min(maxY - span, Math.round(cy - span / 2)))
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(
      image,
      sx,
      sy,
      Math.min(span, maxX - sx),
      Math.min(span, maxY - sy),
      0,
      0,
      span,
      span,
    )
    paintCanvasPin(ctx, pxPosition(cx, sx, span), pxPosition(cy, sy, span))
    canvas.dataset.ready = 'true'
  }
  image.onerror = () => {
    canvas.hidden = true
    const note = canvas.nextElementSibling
    if (note) note.textContent = ctx.text.mapUnavailable
  }
  image.src = imagePathValue
}

function pxPosition(center, origin, span) {
  return Math.max(0, Math.min(span, center - origin))
}
function paintCanvasPin(ctx, px, py) {
  ctx.save()
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.arc(px, py, 12, 0, Math.PI * 2)
  ctx.stroke()
  ctx.strokeStyle = '#d52610'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(px, py, 12, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = '#d52610'
  ctx.beginPath()
  ctx.arc(px, py, 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

export function mapCard(
  ctx,
  { heading, role = '', note = '', image, coord, bounds, source, tech = {}, extra = '' },
) {
  if (!coord) return ''
  const coordinate = ctx.text.coord(coord.x, coord.y)
  const evidence = source
    ? `<details class="technical-point"><summary>${ctx.esc(ctx.text.technical)}</summary><dl>${Object.entries(
        tech,
      )
        .filter(([, v]) => v !== undefined && v !== null && v !== '')
        .map(
          ([label, value]) => `<dt>${ctx.esc(label)}</dt><dd><code>${ctx.esc(value)}</code></dd>`,
        )
        .join(
          '',
        )}${source ? `<dt>${ctx.esc(ctx.text.source)}</dt><dd>${ctx.esc(source)}</dd>` : ''}</dl></details>`
    : ''
  return `<article class="location-card">
      <h3>${ctx.esc(heading)}</h3>${role ? `<span class="shop-kind">${ctx.esc(role)}</span>` : ''}
      <p class="coordinate">${ctx.esc(coordinate)}</p>
      ${image ? `<a class="map-open" href="${ctx.esc(image)}" target="_blank" rel="noopener"><canvas class="map-crop" data-image="${ctx.esc(image)}" data-x="${Number(coord.x)}" data-y="${Number(coord.y)}" data-width="${Number(bounds?.width || bounds?.widthPx || 0)}" data-height="${Number(bounds?.height || bounds?.heightPx || 0)}" aria-label="${ctx.esc(heading)} at ${ctx.esc(coordinate)}"></canvas><span>${ctx.esc(ctx.text.fullMap)}</span></a>` : `<p class="empty-state">${ctx.esc(ctx.text.mapUnavailable)}</p>`}
      ${note ? `<p class="seller-description">${ctx.esc(note)}</p>` : ''}${extra}${evidence}
    </article>`
}

export function pointWithin(ctx, coord, bounds) {
  if (!coord || !Number.isFinite(Number(coord.x)) || !Number.isFinite(Number(coord.y))) return false
  const x = Number(coord.x),
    y = Number(coord.y)
  const tileBounds = bounds?.displayBoundsTiles || bounds?.validTileBounds
  const xs = Array.isArray(tileBounds?.x) ? tileBounds.x : null
  const ys = Array.isArray(tileBounds?.y) ? tileBounds.y : null
  const widthTiles = Number(
    bounds?.tileWidth ||
      bounds?.descriptorTiles?.width ||
      (bounds?.widthPx ? bounds.widthPx / 16 : 0),
  )
  const heightTiles = Number(
    bounds?.tileHeight ||
      bounds?.descriptorTiles?.height ||
      (bounds?.heightPx ? bounds.heightPx / 16 : 0),
  )
  const minX = xs ? Number(xs[0]) : 0,
    maxX = xs ? Number(xs[1]) : widthTiles - 1
  const minY = ys ? Number(ys[0]) : 0,
    maxY = ys ? Number(ys[1]) : heightTiles - 1
  return widthTiles > 0 && heightTiles > 0 && x >= minX && x <= maxX && y >= minY && y <= maxY
}

export function drawMapCanvases(ctx) {
  document.querySelectorAll('canvas.map-crop[data-image]').forEach((canvas) => {
    const width = Number(canvas.dataset.width),
      height = Number(canvas.dataset.height)
    ctx.cropCanvas(
      canvas,
      canvas.dataset.image,
      { x: Number(canvas.dataset.x), y: Number(canvas.dataset.y) },
      { width, height },
    )
  })
}

export function updateLanguageLinks(ctx) {
  for (const locale of ['en', 'th', 'ja']) {
    const link = ctx.$(`language-${locale}`)
    if (!link) continue
    const query = ctx.stateParams()
    if (query.has('return'))
      query.set('return', ctx.localizeRoute(query.get('return'), locale) || query.get('return'))
    link.href = `${ctx.pages.shops[locale]}?${query.toString()}${location.hash}`
    if (locale === ctx.lang) link.setAttribute('aria-current', 'page')
    else link.removeAttribute('aria-current')
  }
  const back = ctx.$('back-link')
  if (back) {
    back.href = ctx.returnRoute || ctx.pages.index[ctx.lang]
    back.textContent = ctx.returnRoute ? ctx.text.returnItem : ctx.text.returnCatalogue
  }
}

export function setQueryValue(ctx, key, value) {
  const next = ctx.stateParams()
  if (!value || (key === 'category' && value === 'all')) next.delete(key)
  else next.set(key, value)
  history.replaceState(null, '', `${location.pathname}?${next.toString()}${location.hash}`)
}
