// The complete fishing guide is rendered at build time from the plan (scripts/complete-guide/plan.mjs).
import { METHODS_ORDER } from './order.js'
import { renderStage } from './stage.js'
import { badge, esc, hex, list, makeNamer, makePic } from './parts.js'

const SUFFIX = { en: '', th: '.th', ja: '.ja' }

function basics(ctx) {
  const { copy, lang } = ctx
  const lines = copy.basics.lines.map((line) => `<li>${esc(line)}</li>`).join('')
  return `<section id="basics" class="cg-section"><h2>${esc(copy.basics.title)} ${badge(lang, 'rom')}</h2><ol class="cg-lines">${lines}</ol></section>
<section id="big-fish" class="cg-section"><h2>${esc(copy.bigFish.title)} ${badge(lang, 'tested')}</h2>${list(copy.bigFish.lines.map(esc))}</section>`
}

function methodCards(ctx) {
  const { copy, lang } = ctx
  const cards = METHODS_ORDER.map((m) => {
    const c = copy.methods[m]
    const level = m === 'lure' ? 'tested' : 'rom'
    return `<article class="cg-card" id="method-${m}"><h3>${esc(c.name)} ${badge(lang, level)}</h3>
<p><strong>${copy.good}</strong> ${esc(c.good)}</p><p><strong>${copy.weak}</strong> ${esc(c.weak)}</p>
<h4>${copy.must}</h4>${list(c.must.map(esc))}</article>`
  })
  return `<section id="methods" class="cg-section"><h2>${esc(copy.methodsTitle)}</h2><div class="cg-cards">${cards.join('')}</div></section>`
}

function stageNav(ctx) {
  const links = [1, 2, 3, 4, 5, 6].map((n) => `<a href="#stage-${n}">${n}</a>`).join('')
  return `<nav class="cg-chips" aria-label="${esc(ctx.copy.stageNav)}"><span>${esc(ctx.copy.stageNav)}</span>${links}</nav>`
}

function how(ctx) {
  const { copy } = ctx
  return `<details id="how-we-know" class="cg-how"><summary>${esc(copy.how.title)}</summary>${list(copy.how.lines.map(esc))}
<p>${esc(copy.how.links)}: <a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/gear-fish-matrix.md">gear-fish-matrix</a>, <a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/big-fish-method-proof.md">big-fish-method-proof</a>, <a href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/fish-max-size.md">fish-max-size</a></p></details>`
}

function firstStages(plan) {
  const first = {}
  for (const stage of plan.stages)
    for (const m of METHODS_ORDER)
      if (stage.methods[m].available && !first[m]) first[m] = stage.stage
  return first
}

export function renderCompleteGuide({ plan, names, matrix, copy }) {
  const lang = copy.lang
  const name = makeNamer(names, lang)
  const suffix = SUFFIX[lang]
  const ctx = {
    copy,
    lang,
    name,
    pic: makePic(names, lang),
    matrix: { items: matrix.items, fishById: new Map(matrix.fish.map((f) => [f.id, f])) },
    fishName: (id) => names.fish[id]?.[lang] ?? names.fish[id]?.en ?? String(id),
    fishHref: (id) => `fish${suffix}.html?id=${hex(id)}&return=complete-guide${suffix}.html`,
  }
  const first = firstStages(plan)
  return [
    basics(ctx),
    methodCards(ctx),
    stageNav(ctx),
    ...plan.stages.map((s) => renderStage(ctx, s, first)),
    how(ctx),
  ].join('\n')
}
