const FILTER_IDS = ['stage-select', 'category-select', 'item-search', 'clear-filters']

export function enableShopControls(ctx) {
  FILTER_IDS.forEach((id) => {
    ctx.$(id).disabled = false
  })
  document.querySelectorAll('input[name="place"]').forEach((input) => {
    input.disabled = false
  })
}

export function showShopLoadFailure(ctx) {
  const returnHref = ctx.returnRoute || ctx.pages.index[ctx.lang]
  const returnLabel = ctx.returnRoute ? ctx.text.backToSource : ctx.text.openCatalogue
  const status = ctx.$('page-status')
  status.innerHTML = `
    <span>${ctx.esc(ctx.text.loadFailed)}</span>
    <nav aria-label="${ctx.esc(ctx.text.recoveryActions)}">
      <button class="route-button" type="button" data-shop-retry>${ctx.esc(ctx.text.retryLoad)} ↻</button>
      <a class="route-button" href="${ctx.esc(returnHref)}">${ctx.esc(returnLabel)} ↗</a>
    </nav>
  `
  status.querySelector('[data-shop-retry]')?.addEventListener('click', () => location.reload())
  ctx.$('shop-results').replaceChildren()
}
