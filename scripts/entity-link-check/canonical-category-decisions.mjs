import assert from 'node:assert/strict'
import { data } from './shared.mjs'
import { renderDecisions } from '../../src/pages/equipment/player-guidance.js'

const canonical = data.playerDecisions.sections
for (const lang of ['en', 'ja', 'th']) {
  const all = renderCase(lang, 'all')
  assertDecisionIds(
    all.categoryHtml,
    canonical.map((decision) => decision.id),
  )
  assert(all.playerHtml.includes('href="#category-decisions"'))
  assert.doesNotMatch(all.playerHtml, /class="decision-card"/)

  for (const [style, decisionId] of [
    ['1', 'float_rod_path'],
    ['2', 'casting_rod_path'],
    ['4', 'lure_rod_path'],
    ['8', 'fly_rod_path'],
  ]) {
    const result = renderCase(lang, 'rod', { style })
    assertDecisionIds(result.categoryHtml, [decisionId])
  }

  assertDecisionIds(renderCase(lang, 'food').categoryHtml, ['food_hp_choice'])
  assertDecisionIds(renderCase(lang, 'general_tool').categoryHtml, [
    'quest_items_do_not_waste',
    'key_and_lottery',
  ])
  const noAdvice = renderCase(lang, 'bait')
  assert.equal(noAdvice.categoryHtml, '')
  assert.doesNotMatch(noAdvice.playerHtml, /data-player-decisions-link/)
}

const canonicalIds = canonical.map((decision) => decision.id)
const canonicalHtml = canonicalIds
  .map((id) => `<article data-canonical="${id}"></article>`)
  .join('')
assert.throws(
  () =>
    assertDecisionIds(
      canonicalHtml.replace(/<article data-canonical="[^"]+"><\/article>$/, ''),
      canonicalIds,
    ),
  (error) => error.code === 'ERR_ASSERTION' && error.message.includes('lost or added'),
)
assert.throws(
  () =>
    assertDecisionIds(
      `${canonicalHtml}${canonicalHtml.match(/<article data-canonical="[^"]+"><\/article>/)?.[0]}`,
      canonicalIds,
    ),
  (error) => error.code === 'ERR_ASSERTION' && error.message.includes('duplicated'),
)
console.log(
  'PASS: category guidance preserves one canonical copy per decision, filters rod styles, and omits a dead link when no advice exists.',
)

function renderCase(lang, category, filters = {}) {
  const { categoryBox, node, restore } = installDom(filters)
  const ctx = {
    lang,
    decisions: canonical,
    cardUi: { categoryAdvice: (count) => `Advice · ${count}` },
    esc: (value) => String(value ?? ''),
    local: (value) => value?.[lang] || '',
    decisionLink: () => '<a href="#item">item</a>',
    decisionCard: (decision) =>
      `<article class="decision-card" data-canonical="${decision.id}"></article>`,
    flyDecision: () => '',
    floatPriceGuide: () => '',
    hookPriceGuide: () => '',
  }
  try {
    renderDecisions(ctx, category)
    return {
      categoryHtml: categoryBox.innerHTML,
      playerHtml: node('player-decisions').innerHTML,
      playerHidden: node('player-decisions').hidden,
    }
  } finally {
    restore()
  }
}

function installDom(filters) {
  const nodes = new Map()
  const disclosure = { open: false }
  const node = (id) => {
    if (!nodes.has(id)) nodes.set(id, { id, value: '', innerHTML: '', hidden: false })
    return nodes.get(id)
  }
  const categoryBox = node('category-decisions')
  categoryBox.querySelector = (selector) =>
    selector === '#category-recommendations-disclosure' &&
    categoryBox.innerHTML.includes('id="category-recommendations-disclosure"')
      ? disclosure
      : null
  const previousDocument = globalThis.document
  const previousLocation = globalThis.location
  globalThis.document = {
    getElementById(id) {
      if (id === 'category-recommendations-disclosure') return categoryBox.querySelector(`#${id}`)
      return node(id)
    },
    querySelector: () => null,
  }
  globalThis.location = { hash: '' }
  node('style-filter').value = filters.style || ''
  node('fish-filter').value = filters.fish || ''
  return { categoryBox, node, restore: () => restoreGlobals(previousDocument, previousLocation) }
}

function restoreGlobals(previousDocument, previousLocation) {
  if (previousDocument === undefined) delete globalThis.document
  else globalThis.document = previousDocument
  if (previousLocation === undefined) delete globalThis.location
  else globalThis.location = previousLocation
}

function assertDecisionIds(html, expected) {
  const actual = [...html.matchAll(/data-canonical="([^"]+)"/g)].map((match) => match[1])
  assert.equal(new Set(actual).size, actual.length, 'Canonical advice is duplicated')
  assert.deepEqual(
    actual.sort(),
    [...expected].sort(),
    'Canonical category advice was lost or added',
  )
}
