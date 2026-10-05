import { foodAreaDecision } from '../../entities/item/index.js'

export function foodAreaMarker(lang, item, stage) {
  const decision = foodAreaDecision(lang, item, stage)
  return decision
    ? ` data-food-area-availability="${decision.stage}" data-stock="${decision.stocked ? 'available' : 'missing'}"`
    : ''
}

export function foodAreaAction(ctx, item, stage, returnPath) {
  const decision = foodAreaDecision(ctx.lang, item, stage)
  if (!decision || decision.stocked) return ''
  const query = new URLSearchParams({ category: 'food', stage: String(decision.stage) })
  if (returnPath) query.set('return', returnPath)
  const page = `index${ctx.lang === 'en' ? '' : `.${ctx.lang}`}.html`
  const label =
    ctx.lang === 'th'
      ? `เลือกอาหารที่ซื้อได้ในด่าน ${decision.stage}`
      : ctx.lang === 'ja'
        ? `エリア${decision.stage}で買える食料を選ぶ`
        : `Choose food sold in Area ${decision.stage}`
  return `<p><a data-local-food-choice href="${ctx.esc(`${page}?${query}#category-decisions`)}">${ctx.esc(label)} ↗</a></p>`
}
