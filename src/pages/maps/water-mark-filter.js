export const WATER_MARKS = ['small', 'large', 'bubble']

export function normalizeWaterMark(mark) {
  return WATER_MARKS.includes(mark) ? mark : ''
}

export function fishMatchesWaterMark(ctx, id, mark = ctx.activeWaterMark) {
  if (!mark) return true
  return (ctx.waterIcons?.profiles?.[id]?.possibleClasses || []).includes(mark)
}

export function waterMarkFishIds(ctx, stage, mark = ctx.activeWaterMark) {
  const ids = ctx.stages[stage]?.species || []
  return [...ids].filter((id) => fishMatchesWaterMark(ctx, id, mark))
}

export function visibleMapFishIds(ctx, ids) {
  return ids.filter(
    (id) => (!ctx.selectedFish || id === ctx.selectedFish) && fishMatchesWaterMark(ctx, id),
  )
}

export function bindWaterMarkFilter(ctx) {
  const panel = ctx.$('water-icon-key')
  panel.addEventListener('click', (event) => {
    const markButton = event.target.closest('[data-water-mark]')
    if (markButton) return selectWaterMark(ctx, markButton.dataset.waterMark)
    const actionButton = event.target.closest('[data-action]'),
      action = actionButton?.dataset.action
    if (action === 'clear-water-mark') clearWaterMark(ctx)
    if (action === 'show-mark-candidates') showMarkCandidates(ctx)
  })
}

function selectWaterMark(ctx, mark) {
  if (!WATER_MARKS.includes(mark)) return
  ctx.lastWaterMark = mark
  ctx.activeWaterMark = ctx.activeWaterMark === mark ? '' : mark
  ctx.activeSection = ctx.chooseSection(ctx.activeStage)
  ctx.render()
  ctx.$(`water-mark-${mark}`)?.focus?.()
}

function clearWaterMark(ctx) {
  ctx.lastWaterMark = ctx.activeWaterMark || ctx.lastWaterMark || 'small'
  ctx.activeWaterMark = ''
  ctx.activeSection = ctx.chooseSection(ctx.activeStage)
  ctx.render()
  ctx.$(`water-mark-${ctx.lastWaterMark}`)?.focus?.()
}

function showMarkCandidates(ctx) {
  ctx.selectedFish = ''
  ctx.searchInput.value = ''
  ctx.searchTerm = ''
  ctx.listScope = 'area'
  ctx.closeSuggestions(true)
  ctx.activeSection = ctx.chooseSection(ctx.activeStage)
  ctx.render()
  ctx.$('fish-list').scrollIntoView?.({ block: 'start' })
  ctx.$('fish-title')?.focus?.()
}
