export function bindFishSearch(ctx) {
  ctx.searchInput.addEventListener('input', () => {
    ctx.searchTerm = ctx.searchInput.value
    ctx.suggestionsDismissed = false
    ctx.renderFishList()
  })
  ctx.searchInput.addEventListener('focus', () => {
    ctx.suggestionsDismissed = false
    ctx.renderSuggestions()
  })
  ctx.searchInput.addEventListener('blur', () => ctx.closeSuggestions(false))
  ctx.searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' && ctx.suggestionIds.length) {
      event.preventDefault()
      if (ctx.suggestionList.hidden) {
        ctx.suggestionsDismissed = false
        ctx.renderSuggestions()
      }
      ctx.setActiveSuggestion(ctx.activeSuggestion < 0 ? 0 : ctx.activeSuggestion + 1)
    } else if (event.key === 'ArrowUp' && ctx.suggestionIds.length) {
      event.preventDefault()
      if (ctx.suggestionList.hidden) {
        ctx.suggestionsDismissed = false
        ctx.renderSuggestions()
      }
      ctx.setActiveSuggestion(
        ctx.activeSuggestion < 0 ? ctx.suggestionIds.length - 1 : ctx.activeSuggestion - 1,
      )
    } else if (event.key === 'Enter' && !ctx.suggestionList.hidden && ctx.suggestionIds.length) {
      event.preventDefault()
      ctx.chooseSuggestion(ctx.suggestionIds[ctx.activeSuggestion < 0 ? 0 : ctx.activeSuggestion])
    } else if (event.key === 'Escape' && !ctx.suggestionList.hidden) {
      event.preventDefault()
      ctx.closeSuggestions(true)
    }
  })
  ctx.suggestionList.addEventListener('pointerdown', (event) => {
    if (event.target.closest('[data-suggestion]')) event.preventDefault()
  })
}
