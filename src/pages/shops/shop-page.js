export async function init(ctx) {
  const stageSelect = ctx.$('stage-select'),
    categorySelect = ctx.$('category-select'),
    search = ctx.$('item-search')
  stageSelect.value = String(ctx.startStage)
  categorySelect.value = ctx.startCategory || 'all'
  search.value = ctx.searchValue
  document
    .querySelectorAll('input[name="place"]')
    .forEach((input) => (input.checked = input.value === ctx.startPlace))
  ctx.updateLanguageLinks()
  const loc = await Promise.allSettled([
    fetch('gallery-data.json').then((r) => {
      if (!r.ok) throw new Error('gallery')
      return r.json()
    }),
    fetch('../data/shop-stock-rom.json').then((r) => {
      if (!r.ok) throw new Error('stock')
      return r.json()
    }),
    fetch('maps/rom-map-manifest.json').then((r) => {
      if (!r.ok) throw new Error('maps')
      return r.json()
    }),
    fetch('../data/shop-locations-rom.json').then((r) => {
      if (!r.ok) throw new Error('locations')
      return r.json()
    }),
  ])
  const [galleryResult, stockResult, mapResult, locationResult] = loc
  if (galleryResult.status !== 'fulfilled' || stockResult.status !== 'fulfilled') {
    ctx.$('page-status').textContent = ctx.text.loadFailed
    ctx.$('shop-results').innerHTML = `<p class="empty-state">${ctx.esc(ctx.text.loadFailed)}</p>`
    return
  }
  const items = galleryResult.value.items || []
  ctx.fishVisuals = galleryResult.value.fishVisuals || {}
  window.__shopItems = items
  const stock = stockResult.value
  const mapManifest = mapResult.status === 'fulfilled' ? mapResult.value : null
  const locations = locationResult.status === 'fulfilled' ? locationResult.value : null
  ctx.$('page-status').textContent = locations ? ctx.text.stockLoaded : ctx.text.stockOnly
  const view = { stageSelect, categorySelect, search, items, stock, mapManifest, locations }
  const render = () => ctx.renderShopView(view)
  ctx.bindShopFilters(view, render)
  render()
  scrollRequestedFishContext(ctx)
}

function scrollRequestedFishContext(ctx) {
  if (location.hash === '#shop-fish-context')
    ctx.$('shop-fish-context')?.scrollIntoView?.({ block: 'start' })
}

export function renderShopView(ctx, view) {
  const { stageSelect, categorySelect, search, items, stock, mapManifest, locations } = view
  const stage = Number(stageSelect.value),
    place = document.querySelector('input[name="place"]:checked')?.value || 'outdoor'
  const category = categorySelect.value,
    query = search.value
  ctx.refreshUrl()
  ctx.updateLanguageLinks()
  const mapPanel = ctx.$('shop-map-disclosure')
  if (mapPanel && (ctx.focusedEntrance !== null || location.hash === '#location-section'))
    mapPanel.open = true
  ctx.renderLocations(locations, mapManifest, stage, place, items)
  ctx.renderOffers(items, stock, stage, category, query)
}
export function bindShopFilters(ctx, view, render) {
  const { stageSelect, categorySelect, search } = view
  stageSelect.addEventListener('change', () => {
    ctx.focusedEntrance = null
    render()
  })
  document.querySelectorAll('input[name="place"]').forEach((input) =>
    input.addEventListener('change', () => {
      const mapPanel = ctx.$('shop-map-disclosure')
      if (mapPanel) mapPanel.open = true
      render()
    }),
  )
  categorySelect.addEventListener('change', () => {
    if (categorySelect.value !== ctx.targetCategory) {
      ctx.targetCategory = ''
      ctx.targetId = ''
      ctx.focusedEntrance = null
    }
    ctx.setQueryValue('category', categorySelect.value)
    render()
  })
  search.addEventListener('input', () => {
    ctx.setQueryValue('q', search.value)
    render()
  })
  ctx.$('clear-filters').addEventListener('click', () => {
    categorySelect.value = 'all'
    search.value = ''
    ctx.targetCategory = ''
    ctx.targetId = ''
    ctx.focusedEntrance = null
    ctx.params.delete('category')
    ctx.params.delete('id')
    ctx.params.delete('q')
    history.replaceState(
      null,
      '',
      `${location.pathname}?${ctx.stateParams({ category: 'all', id: '', q: '' }).toString()}${location.hash}`,
    )
    render()
  })
}
