export function initializeNotebookFocus(ctx, hash) {
  const id = hash.match(/^#notebook-species-([0-9a-f]{2})$/i)?.[1]?.toUpperCase()
  const entry = ctx.notebookCompletion?.species?.[id]
  ctx.notebookSpecies = ''
  ctx.notebookFocusNeedsReveal = false
  if (entry?.notebookEligible !== true) return
  const stage = Number(entry.firstOccurrenceStage)
  if (!Number.isInteger(stage) || stage < 1 || stage > 6) return
  ctx.notebookSpecies = id
  ctx.notebookFocusNeedsReveal = true
  ctx.notebookRouteStage = stage
  ctx.openNotebookGuide = true
}

export function notebookFocusAnchor(ctx) {
  return ctx.notebookSpecies ? `#notebook-species-${ctx.notebookSpecies}` : ''
}

export function scrollToNotebookSpecies(ctx) {
  if (!ctx.notebookSpecies) return false
  const card = ctx.$(`notebook-species-${ctx.notebookSpecies}`)
  if (!card) return false
  card.scrollIntoView?.({ block: 'start' })
  return true
}
