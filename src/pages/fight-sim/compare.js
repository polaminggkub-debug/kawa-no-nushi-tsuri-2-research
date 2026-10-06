import { defaultSetup, setupKey } from '../../features/fight-policy/index.js'
import { escapeHtml, percent } from './format.js'
import { fishLabel, hookLabel, rodLabel } from './names.js'

/** The two fish of the tip box: an ordinary Area 1 fish and the giant eel. */
export const COMPARED = { yamame: 3, eel: 59 }

/** Stored record and tackle of one compared fish, with the best float rod and matching hook. */
export function comparedCase(ctx, fishId) {
  const fish = ctx.tables.fish.find((row) => row.id === fishId)
  const setup = defaultSetup(ctx.tables, fish, 'float')
  return { fishId, setup, record: ctx.policies.combos[setupKey(setup)] }
}

function tableRow(label, cells, css = '') {
  return `<tr class="${css}"><th scope="row">${escapeHtml(label)}</th>${cells
    .map((value) => `<td>${percent(value)}</td>`)
    .join('')}</tr>`
}

/** Hold, mash and the recommended rhythm for the Yamame and the giant eel. */
export function renderComparison(ctx) {
  const cases = Object.values(COMPARED).map((id) => comparedCase(ctx, id))
  const words = ctx.text.compare
  const head = cases.map(
    (item) => `<th scope="col">${escapeHtml(fishLabel(ctx, item.fishId))}</th>`,
  )
  const rows = [
    tableRow(
      words.hold,
      cases.map((item) => item.record.base.hold.c),
    ),
    tableRow(
      words.mash,
      cases.map((item) => item.record.base.mash.c),
    ),
    tableRow(
      words.rhythm,
      cases.map((item) => item.record.plain.m.c),
      'fs-rec',
    ),
  ]
  const tackle = cases
    .map((item) =>
      words.tackle(
        fishLabel(ctx, item.fishId),
        rodLabel(ctx, item.setup.rodId),
        hookLabel(ctx, item.setup.hookId),
      ),
    )
    .join(' ')
  ctx.$('fs-compare').innerHTML = `<div class="fs-scroll"><table class="fs-table">
<caption>${escapeHtml(words.caption)}</caption>
<thead><tr><th></th>${head.join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>
<p class="fs-note">${escapeHtml(tackle)}</p>`
}

/** Numbers quoted in the tip text, read from the stored results so the words cannot drift. */
export function tipNumbers(ctx) {
  const { record } = comparedCase(ctx, COMPARED.eel)
  return {
    'eel-plain': percent(record.plain.m.c),
    'eel-unfinished': percent(record.plain.m.s),
    'eel-trick': percent(record.trick?.m.c ?? record.plain.m.c),
    'eel-ceiling': percent(record.ceiling.m.c),
  }
}

export function fillTipNumbers(ctx) {
  const numbers = tipNumbers(ctx)
  document.querySelectorAll('[data-fill]').forEach((node) => {
    node.textContent = numbers[node.dataset.fill] ?? node.textContent
  })
}
