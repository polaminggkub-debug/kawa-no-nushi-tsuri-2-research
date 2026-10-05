export function loadCatalogue(ctx) {
  ctx.flyMakerLink = (item) =>
    item.category.startsWith('fly')
      ? `<p><a class="route-button" data-fly-maker href="${ctx.esc(ctx.currentCategoryLink().split('#')[0] + '#fly-instructions')}">${ctx.lang === 'th' ? 'ดูขั้นตอนประกอบฟลายเองและตรวจราคาในเกม' : ctx.lang === 'ja' ? '自作フライの手順とゲーム内見積額を確認' : 'See custom fly steps and check the in-game quote'} ↗</a></p>`
      : ''
  ctx.setNavigation()
  fetch('gallery-data.json?v=compendium-20261005-25')
    .then((response) => {
      if (!response.ok) throw new Error('catalogue data unavailable')
      return response.json()
    })
    .then((data) => {
      if (ctx.selectedFish && !data.fishVisuals?.[ctx.selectedFish]) ctx.selectedFish = ''
      const item =
        (data.items || []).find(
          (candidate) => candidate.category === ctx.category && candidate.id === ctx.requestedId,
        ) || null
      if (!item) {
        ctx.emptyState()
        return
      }
      ctx.render(
        item,
        data.items || [],
        data.fishVisuals || {},
        data.fishLocations || {},
        data.playerDecisions?.sections || [],
      )
    })
    .catch((error) => {
      console.error('Item detail failed to load or render.', error)
      ctx.emptyState()
    })
}
