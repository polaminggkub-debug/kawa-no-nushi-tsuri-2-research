// One stage (map 1-6): its fish and sizes, which method suits which fish, and every method's kit.
import { METHODS_ORDER } from './order.js'
import { renderMethod } from './method.js'
import { badge, esc, hex, table } from './parts.js'

function maxCell(copy, row) {
  const max = row.max
  if (max.status === 'quest-only') return esc(copy.stage.akame)
  if (max.status === 'story-only') return esc(copy.stage.eel)
  const base = esc(copy.stage.maxLine(max.max))
  if (!max.slow) return base
  return `${base} <span class="cg-tag">${esc(copy.stage.slow)}</span><small>${esc(copy.stage.slowNote(max.picks, max.nights))}</small>`
}

function fishTable(ctx, stage) {
  const { copy, lang } = ctx
  const rows = stage.fish.map((f) => [
    `<a href="${esc(ctx.fishHref(f.id))}">${ctx.pic('fish', f.id, 'fishrow')}</a>`,
    `${f.size[0]}–${f.size[1]}`,
    maxCell(copy, f),
  ])
  const head = [copy.stage.colFish, copy.stage.colSize, copy.stage.colMax]
  return `${table(head.map(esc), rows, copy.stage.fishHead, ' cg-table-fish')}<p class="cg-note">${esc(copy.stage.growNote)} ${badge(lang, 'rom')}</p>`
}

function whichTable(ctx, stage) {
  const { copy, lang } = ctx
  const head = [
    copy.stage.colFish,
    ...METHODS_ORDER.map((m) => copy.methodNames[m]),
    copy.stage.colEasy,
  ]
  const rows = stage.fish.map((f) => {
    const scores = METHODS_ORDER.map((m) => stage.methods[m].perFish?.[f.id]?.score ?? null)
    const known = scores.filter((s) => s != null)
    const low = known.length ? Math.min(...known) : null
    const cells = scores.map((s) =>
      s == null
        ? copy.stage.none
        : `<span class="${s === low ? 'cg-low' : ''}">${s.toFixed(1)}${s === low ? ' ✓' : ''}</span>`,
    )
    const easy =
      low == null
        ? copy.stage.none
        : METHODS_ORDER.filter((m, i) => scores[i] === low)
            .map((m) => copy.methodNames[m])
            .join(', ')
    return [
      `<a href="${esc(ctx.fishHref(f.id))}">${ctx.pic('fish', f.id, 'fishrow')}</a>`,
      ...cells,
      esc(easy),
    ]
  })
  return `<h3>${esc(copy.stage.whichHead)} ${badge(lang, 'rom')}</h3><p class="cg-note">${esc(copy.stage.whichLead)}</p>${table(head.map(esc), rows, copy.stage.whichHead)}`
}

function switchLines(ctx, stage) {
  const { copy } = ctx
  const lines = []
  const hasBig = stage.fish.some((f) => f.size[1] > 35)
  if (hasBig) lines.push(copy.stage.switches.big)
  if (hasBig && stage.methods.fly.available) lines.push(copy.stage.switches.fly)
  const unreached = stage.fish.some((f) =>
    METHODS_ORDER.some((m) => stage.methods[m].available && !stage.methods[m].perFish[f.id]),
  )
  if (unreached) lines.push(copy.stage.switches.unreach)
  return `<h3>${esc(copy.stage.switchHead)}</h3><ul>${lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>`
}

export function renderStage(ctx, stage, firstStage) {
  const { copy, lang } = ctx
  const name = stage.mapName[lang] ?? stage.mapName.en
  const methods = METHODS_ORDER.map((m) => renderMethod(ctx, stage, m, firstStage)).join('')
  return `<section class="cg-stage" data-keep-repeats id="stage-${stage.stage}" aria-labelledby="stage-${stage.stage}-title">
<h2 id="stage-${stage.stage}-title">${esc(copy.stage.head(stage.stage, name))}</h2>
<h3>${esc(copy.stage.fishHead)}</h3>${fishTable(ctx, stage)}
${whichTable(ctx, stage)}${switchLines(ctx, stage)}
<div class="cg-methods">${methods}</div>
</section>`
}

export { hex }
