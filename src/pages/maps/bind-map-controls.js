export function bindMapControls(ctx) {
  ctx.stageSelect.addEventListener('change', () => {
    ctx.activeSection = ctx.stageSelect.value
    ctx.render()
  })
  ctx.$('other-sections').addEventListener('click', (event) => {
    const button = event.target.closest('[data-other-section]')
    if (button) {
      ctx.activeSection = button.dataset.otherSection
      ctx.render()
    }
  })
  ctx.$('fish-scope').addEventListener('click', (event) => {
    const button = event.target.closest('[data-scope]')
    if (!button) return
    ctx.listScope = button.dataset.scope
    ctx.searchTerm = ''
    ctx.searchInput.value = ''
    ctx.render()
  })
  ctx.$('area-overview').addEventListener('click', (event) => {
    const button = event.target.closest('[data-section]')
    if (button) {
      ctx.activeSection = button.dataset.section
      ctx.render()
    }
  })
  ctx.$('zoom-out').addEventListener('click', () => {
    ctx.zoom = Math.max(0.6, ctx.zoom / 1.3)
    ctx.renderMap()
  })
  ctx.$('zoom-in').addEventListener('click', () => {
    ctx.zoom = Math.min(3, ctx.zoom * 1.3)
    ctx.renderMap()
  })
  ctx.$('zoom-fit').addEventListener('click', () => {
    ctx.zoom = 1
    ctx.renderMap()
  })
}
