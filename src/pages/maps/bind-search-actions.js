import { renderMapNavigation } from './map-render.js'

export function bindSearchActions(ctx) {
  ctx.suggestionList.addEventListener('click', (event) => {
    const option = event.target.closest('[data-suggestion]')
    if (option) ctx.chooseSuggestion(option.dataset.suggestion)
  })
  ctx.$('clear-search').addEventListener('click', () => {
    ctx.searchInput.value = ''
    ctx.searchTerm = ''
    ctx.selectedFish = ''
    ctx.notebookSpecies = ''
    ctx.closeSuggestions(true)
    ctx.render()
    ctx.searchInput.focus()
  })
  ctx.$('show-all').addEventListener('click', () => {
    ctx.selectedFish = ''
    ctx.notebookSpecies = ''
    ctx.lastWaterMark = ctx.activeWaterMark || ctx.lastWaterMark
    ctx.activeWaterMark = ''
    ctx.listScope = 'area'
    ctx.searchInput.value = ''
    ctx.searchTerm = ''
    ctx.closeSuggestions(true)
    ctx.activeSection = ctx.chooseSection(ctx.activeStage)
    ctx.render()
  })
  window.addEventListener('resize', () => ctx.renderMap())
  ctx.loadingParams = new URLSearchParams(location.search)
  if (ctx.returnPath) ctx.loadingParams.set('return', ctx.returnPath)
  else ctx.loadingParams.delete('return')
  ctx.updateLanguageLinks(ctx.loadingParams)
  renderPendingNavigation(ctx)
}

function renderPendingNavigation(ctx) {
  const stage = Number(ctx.loadingParams.get('stage'))
  const rawFish = ctx.loadingParams.get('fish') || ''
  const selectedFish = /^(?:0x)?[0-9a-f]{1,2}$/i.test(rawFish) ? ctx.idNorm(rawFish) : ''
  const rawRoute = ctx.loadingParams.get('route')
  const selectedRoute = ['float', 'sinker', 'lure', 'fly'].includes(rawRoute) ? rawRoute : ''
  renderMapNavigation({
    ...ctx,
    activeStage: Number.isInteger(stage) && stage >= 1 && stage <= 6 ? stage : 1,
    selectedFish,
    selectedRoute,
  })
}
