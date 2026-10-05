import { showCatalogueLoading, showCatalogueError } from './catalogue-load-state.js'
import { categoryNavigationHref, refreshCategoryNavigationLinks } from './category-navigation.js'

function installCatalogueData(ctx, data) {
  ctx.allItems = data.items
  ctx.decisions = data.playerDecisions?.sections || []
  ctx.gearPriceGuide = data.gearPriceGuide || {}
  ctx.fishVisuals = data.fishVisuals || {}
  ctx.fishLocations = data.fishLocations || {}
  for (const item of ctx.allItems) {
    ctx.categoryNames[item.category] =
      ctx.lang === 'th' ? item.categoryTh : ctx.lang === 'ja' ? item.categoryJa : item.categoryEn
  }
  ctx.set('#entry-count', ctx.copy.entries(ctx.allItems.length))
  ctx.set('[data-t="title"]', ctx.player.title)
  ctx.set('[data-t="lead"]', ctx.player.lead)
  ctx.set('#category-menu-title', ctx.player.menu)
  ctx.set('#fish-filter-label', ctx.player.fish)
  ctx.set('#kit-title', ctx.player.kit)
  ctx.set('#kit-copy', ctx.player.kitText)
  ctx.set('#kit-link', ctx.player.kitLink)
  ctx.renderSamples()
  ctx.renderNotes(data)
  ctx.renderFilters()
}

function readPageQuery() {
  if (typeof URLSearchParams === 'undefined' || typeof location === 'undefined') return null
  return new URLSearchParams(location.search)
}

function restoreCategoryAndPart(ctx, query) {
  let category = 'rod'
  const selectedCategory = query?.get('category')
  if (ctx.groups.includes(selectedCategory) || selectedCategory === 'all')
    category = selectedCategory
  document.getElementById('category-filter').value = category
  const part = query?.get('part')
  if (['fly', 'fly_wing', 'fly_tail'].includes(part)) ctx.flyPart = part
}

function restoreFishAndStage(ctx, query) {
  const fish = query?.get('fish')
  if (ctx.fishVisuals[fish]) document.getElementById('fish-filter').value = fish
  const stage = query?.get('stage')
  if (['1', '2', '3', '4', '5', '6'].includes(stage)) ctx.locationStage = stage
}

function restoreTextFilters(ctx, query) {
  if (!query) return
  document.getElementById('search').value = query.get('q') || ''
  if (['id', 'name', 'price'].includes(query.get('sort')))
    document.getElementById('sort-filter').value = query.get('sort')
  if (['1', '2', '4', '8'].includes(query.get('style')))
    document.getElementById('style-filter').value = query.get('style')
  if (['float', 'sinker'].includes(query.get('route'))) ctx.baitRoute = query.get('route')
  if (/^\d+$/.test(query.get('map') || '')) ctx.locationMapIndex = Number(query.get('map'))
}

function restoreInitialFilters(ctx) {
  const query = readPageQuery()
  restoreCategoryAndPart(ctx, query)
  restoreFishAndStage(ctx, query)
  restoreTextFilters(ctx, query)
}

function syncFishSearchText(ctx) {
  const fish = document.getElementById('fish-filter').value
  document.getElementById('fish-search').value = fish ? ctx.fishName(fish) : ''
}

function openFlyGuideFromHash() {
  if (
    typeof window === 'undefined' ||
    !['#fly-instructions', '#wing-palette-title'].includes(window.location.hash)
  )
    return
  const guide = document.getElementById('fly-instructions')
  if (!guide) return
  guide.open = true
  const target =
    window.location.hash === '#wing-palette-title'
      ? document.getElementById('wing-palette-title')
      : guide
  target?.scrollIntoView({ behavior: 'instant', block: 'start' })
}

function scrollCategoryAdviceFromHash() {
  if (typeof window === 'undefined' || window.location.hash !== '#category-decisions') return
  document.getElementById('category-decisions')?.scrollIntoView({ block: 'start' })
}

function openInitialContext() {
  openFlyGuideFromHash()
  scrollCategoryAdviceFromHash()
  if (typeof window !== 'undefined' && window.location.hash === '#fish-location-panel')
    document.getElementById('fish-location-panel')?.scrollIntoView({ block: 'start' })
}

function handleCategoryClick(ctx, event) {
  const link = event.target.closest('[data-category]')
  if (!link) return
  if (
    (event.button !== undefined && event.button !== 0) ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return
  event.preventDefault()
  document.getElementById('category-filter').value = link.dataset.category
  document.getElementById('search').value = ''
  document.getElementById('style-filter').value = ''
  ctx.renderCards()
  if (typeof history !== 'undefined')
    history.replaceState(
      null,
      '',
      categoryNavigationHref(
        ctx,
        link.dataset.category,
        document.getElementById('fish-filter').value,
      ),
    )
  ctx.refreshLanguageLinks?.()
  document.getElementById('catalogue').scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function handleBaitRouteClick(ctx, event) {
  const button = event.target.closest('[data-route]')
  if (!button) return
  ctx.baitRoute = button.dataset.route
  ctx.renderCards()
}

function handleEmptyBaitRouteSwitch(ctx, event) {
  const link = event.target.closest('[data-empty-bait-switch="float"]')
  if (!link) return
  event.preventDefault()
  ctx.baitRoute = 'float'
  ctx.renderCards()
  document.getElementById('catalogue').scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function handleFlyPartClick(ctx, event) {
  if (event.target.closest('[data-guide]')) {
    event.preventDefault()
    const guide = document.getElementById('fly-instructions')
    guide.open = true
    guide.scrollIntoView({ behavior: 'instant', block: 'start' })
    return
  }
  const button = event.target.closest('[data-part]')
  if (!button) return
  ctx.flyPart = button.dataset.part
  ctx.renderCards()
}

function handleLocationStageClick(ctx, event) {
  const button = event.target.closest('[data-location-stage]')
  if (!button) return
  ctx.locationStage = button.dataset.locationStage
  ctx.locationMapIndex = 0
  ctx.renderFishLocation(document.getElementById('fish-filter').value)
  ctx.renderDecisions(document.getElementById('category-filter').value)
  refreshCategoryNavigationLinks(ctx, document.getElementById('fish-filter').value)
}

function handleLocationMapChange(ctx, event) {
  if (event.target.id !== 'location-map-select') return
  ctx.locationMapIndex = Number(event.target.value)
  ctx.renderFishLocation(document.getElementById('fish-filter').value)
  refreshCategoryNavigationLinks(ctx, document.getElementById('fish-filter').value)
}

function bindFilterInputs(ctx) {
  const inputIds = ['search', 'category-filter', 'sort-filter', 'style-filter']
  for (const id of inputIds) {
    const eventName = id === 'search' ? 'input' : 'change'
    document.getElementById(id).addEventListener(eventName, ctx.renderCards)
    document.getElementById(id).disabled = false
  }
}

function bindCatalogueEvents(ctx) {
  document
    .getElementById('category-menu')
    .addEventListener('click', (event) => handleCategoryClick(ctx, event))
  document
    .getElementById('bait-route-menu')
    .addEventListener('click', (event) => handleBaitRouteClick(ctx, event))
  document
    .getElementById('cards')
    .addEventListener('click', (event) => handleEmptyBaitRouteSwitch(ctx, event))
  document
    .getElementById('fly-part-menu')
    .addEventListener('click', (event) => handleFlyPartClick(ctx, event))
  const locationPanel = document.getElementById('fish-location-panel')
  locationPanel.addEventListener('click', (event) => handleLocationStageClick(ctx, event))
  locationPanel.addEventListener('change', (event) => handleLocationMapChange(ctx, event))
  bindFilterInputs(ctx)
}

function renderInitialCatalogue(ctx) {
  syncFishSearchText(ctx)
  ctx.setupFishPicker()
  ctx.renderCards()
  openInitialContext()
  bindCatalogueEvents(ctx)
  document.getElementById('category-menu').hidden = false
}

function initializeLoadedCatalogue(ctx, data) {
  installCatalogueData(ctx, data)
  restoreInitialFilters(ctx)
  ctx.renderFrames(data)
  renderInitialCatalogue(ctx)
}

export function loadCatalogue(ctx) {
  showCatalogueLoading(ctx)
  fetch('gallery-data.json?v=compendium-20261005-29')
    .then((response) => {
      if (!response.ok) throw new Error('catalogue unavailable')
      return response.json()
    })
    .then((data) => initializeLoadedCatalogue(ctx, data))
    .catch((error) => {
      console.error(error)
      showCatalogueError(ctx)
    })
}
