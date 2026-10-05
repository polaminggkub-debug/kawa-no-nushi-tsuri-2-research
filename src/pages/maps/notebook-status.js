const copy = {
  en: {
    badge: 'No journal entry',
    reason: 'This species has no fish-journal entry. See the journal guide.',
  },
  ja: {
    badge: '図鑑の記録枠なし',
    reason: 'この魚種は図鑑の記録対象ではありません。図鑑ガイドを見る。',
  },
  th: {
    badge: 'ไม่มีช่องในสมุดปลา',
    reason: 'ปลาชนิดนี้ไม่มีช่องบันทึกในสมุดปลา ดูคำแนะนำสมุดปลา',
  },
}

export function notebookStatus(ctx, id, linked = true) {
  if (ctx.notebookCompletion?.species?.[id]?.notebookEligible !== false) return ''
  const text = copy[ctx.lang] || copy.en
  const marker = `class="notebook-excluded-badge" data-notebook-excluded="${ctx.esc(id)}"`
  if (!linked)
    return `<span ${marker} title="${ctx.esc(text.reason)}">${ctx.esc(text.badge)}</span>`
  return `<a class="notebook-excluded-badge" data-notebook-excluded="${ctx.esc(id)}" href="#notebook-guide" aria-label="${ctx.esc(text.reason)}">${ctx.esc(text.badge)}</a>`
}
