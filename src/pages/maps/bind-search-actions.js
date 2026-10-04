export function bindSearchActions(ctx) {
  ctx.suggestionList.addEventListener('click', (event) => {
    const option = event.target.closest('[data-suggestion]')
    if (option) ctx.chooseSuggestion(option.dataset.suggestion)
  })
  ctx.$('clear-search').addEventListener('click', () => {
    ctx.searchInput.value = ''
    ctx.searchTerm = ''
    ctx.selectedFish = ''
    ctx.closeSuggestions(true)
    ctx.render()
    ctx.searchInput.focus()
  })
  ctx.$('show-all').addEventListener('click', () => {
    ctx.selectedFish = ''
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
}
