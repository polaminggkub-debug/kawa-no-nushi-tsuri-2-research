function checklistStage(ctx, firstStage) {
  const selected = Number(ctx.requestedStage)
  return Number.isInteger(selected) && selected >= 1 && selected <= 6 ? selected : firstStage
}

function checklistCopy(ctx) {
  if (ctx.locale === 'th') return 'เปิดเช็กลิสต์บนเว็บของปลาชนิดนี้ (จดเอง แยกจากสมุดในเกม)'
  if (ctx.locale === 'ja') return 'この魚の手動チェックリストを開く（ゲーム内ノートとは別）'
  return 'Open this species’ manual web checklist (separate from the in-game notebook)'
}

export function notebookChecklistLink(ctx, firstStage) {
  const stage = checklistStage(ctx, firstStage)
  const query = new URLSearchParams({ stage: String(stage), fish: ctx.id })
  if (ctx.requestedMethod) query.set('route', ctx.requestedMethod)
  query.set('return', ctx.currentFishPath(stage))
  const href = `${ctx.mapPath()}?${query}#notebook-species-${ctx.id}`
  return `<a class="route-button" data-fish-notebook-checklist href="${ctx.escapeHtml(href)}">${ctx.escapeHtml(checklistCopy(ctx))} ↗</a>`
}
