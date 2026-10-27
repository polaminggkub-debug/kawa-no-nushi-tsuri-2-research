const PADDING = 70

function pinBounds(pins) {
  const box = { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
  for (const pin of pins) {
    box.left = Math.min(box.left, pin.offsetLeft - pin.offsetWidth / 2)
    box.right = Math.max(box.right, pin.offsetLeft + pin.offsetWidth / 2)
    box.top = Math.min(box.top, pin.offsetTop - pin.offsetHeight / 2)
    box.bottom = Math.max(box.bottom, pin.offsetTop + pin.offsetHeight / 2)
  }
  return { ...box, width: box.right - box.left, height: box.bottom - box.top }
}

function ensureMapVisible(ctx) {
  const rect = ctx.$('map-title').getBoundingClientRect()
  if (rect.top < 0 || rect.top > window.innerHeight * 0.5)
    ctx.$('map-title').scrollIntoView({ block: 'start' })
}

/** After a fish is chosen: zoom the map until the fish's points fill the view, then centre on them. */
export function focusSelectedFish(ctx) {
  const view = ctx.$('map-view'),
    scroller = view.parentElement
  if (!ctx.selectedFish || !view.querySelector?.('.fish-pin')) return
  let box = pinBounds(view.querySelectorAll('.fish-pin'))
  const fit = Math.min(
    scroller.clientWidth / (box.width + PADDING * 2),
    scroller.clientHeight / (box.height + PADDING * 2),
  )
  const zoom = Math.min(3, Math.max(1, ctx.zoom * Math.min(fit, 3)))
  if (Math.abs(zoom - ctx.zoom) > 0.05) {
    ctx.zoom = zoom
    ctx.renderMap()
    box = pinBounds(view.querySelectorAll('.fish-pin'))
  }
  scroller.scrollTo({
    left: Math.max(0, (box.left + box.right) / 2 - scroller.clientWidth / 2),
    top: Math.max(0, (box.top + box.bottom) / 2 - scroller.clientHeight / 2),
  })
  ensureMapVisible(ctx)
}

const label = {
  th: 'กลับไปหน้าปลา',
  ja: '魚のページに戻る',
  en: 'Back to the fish page',
}

/** Link back to the selected fish with the same area, map section and fishing method. */
export function renderBackToFish(ctx) {
  if (typeof ctx.$('map-zoom-bar')?.before !== 'function') return
  let link = ctx.$('back-to-fish')
  if (!ctx.selectedFish) {
    link?.remove()
    return
  }
  if (!link) {
    link = document.createElement('a')
    link.id = 'back-to-fish'
    link.className = 'back-to-fish'
    ctx.$('map-zoom-bar').before(link)
  }
  const query = new URLSearchParams({ id: ctx.selectedFish, stage: String(ctx.activeStage) })
  if (ctx.selectedRoute) query.set('route', ctx.selectedRoute)
  if (ctx.activeSection) query.set('section', ctx.activeSection)
  const original =
    ctx.returnPath && new URL(ctx.returnPath, location.href).searchParams.get('return')
  if (original) query.set('return', original)
  const name = ctx.fishName(ctx.selectedFish)
  link.href = `fish${ctx.lang === 'en' ? '' : '.' + ctx.lang}.html?${query}#fish-area-map`
  link.textContent = `← ${label[ctx.lang] || label.en} · ${name}`
}

/** Two fingers on the map zoom the map (not the page); the new zoom applies when they lift. */
export function bindMapPinch(ctx) {
  const scroller = ctx.$('map-view').parentElement
  if (typeof scroller?.addEventListener !== 'function') return
  const fingers = new Map()
  let startGap = 0,
    lastGap = 0,
    baseZoom = 1
  const gap = () => {
    const [a, b] = [...fingers.values()]
    return Math.hypot(a.x - b.x, a.y - b.y)
  }
  scroller.addEventListener('pointerdown', (event) => {
    fingers.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (fingers.size === 2) {
      startGap = lastGap = gap()
      baseZoom = ctx.zoom
    }
  })
  scroller.addEventListener('pointermove', (event) => {
    if (!fingers.has(event.pointerId)) return
    fingers.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (fingers.size === 2) lastGap = gap()
  })
  const lift = (event) => {
    if (fingers.size === 2 && startGap > 0) {
      ctx.zoom = Math.min(3, Math.max(0.6, baseZoom * (lastGap / startGap)))
      ctx.renderMap()
    }
    fingers.delete(event.pointerId)
    startGap = 0
  }
  scroller.addEventListener('pointerup', lift)
  scroller.addEventListener('pointercancel', lift)
}
