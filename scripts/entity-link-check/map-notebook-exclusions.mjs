import assert from 'node:assert/strict'
import { data } from './shared.mjs'
import { fishChoice, renderSuggestions } from '../../src/pages/maps/fish-search.js'
import { showPinDetails } from '../../src/pages/maps/map-render.js'

for (const lang of ['en', 'th', 'ja']) {
  for (const id of Object.keys(data.fishVisuals)) {
    const eligible = data.notebookCompletion.species[id]?.notebookEligible
    const ctx = context(lang, id)
    const row = fishChoice(ctx, id, '', new Set([id]))
    check(row, id, eligible)
    showPinDetails(ctx, [id, id], 1, 2)
    check(ctx.box.innerHTML, id, eligible)
    const previousDocument = globalThis.document
    globalThis.document = { activeElement: ctx.searchInput }
    renderSuggestions(ctx)
    globalThis.document = previousDocument
    if (eligible === false)
      assert.match(ctx.suggestionList.innerHTML, new RegExp(`data-notebook-excluded="${id}"`))
    else assert.doesNotMatch(ctx.suggestionList.innerHTML, /data-notebook-excluded/)
    assert.doesNotMatch(
      ctx.suggestionList.innerHTML,
      /<a\b/,
      'Suggestion options must not contain nested navigation',
    )
    assert.match(row, /data-fish=/)
    assert.match(ctx.box.innerHTML, /data-fish=/)
  }
}
console.log(
  'Map notebook exclusions PASS: exact ROM eligibility across all profiles and locales; fish actions retained.',
)

function check(html, id, eligible) {
  if (eligible === false) {
    assert.match(html, new RegExp(`data-notebook-excluded="${id}"`))
    assert.match(html, /href="[^"]*#notebook-guide"/)
  } else assert.doesNotMatch(html, /data-notebook-excluded/)
}

function context(lang, id) {
  const box = { innerHTML: '', hidden: true }
  return {
    searchInput: { value: id },
    suggestionList: { innerHTML: '' },
    fishList: {},
    matchingSuggestions: () => [id],
    suggestionLimit: 8,
    setSuggestionsExpanded() {},
    lang,
    notebookCompletion: data.notebookCompletion,
    box,
    species: { [id]: { visual: data.fishVisuals[id], name: `Fish ${id}`, stages: [1] } },
    activeStage: 1,
    listScope: 'area',
    selectedFish: id,
    stages: {},
    detailLabel: 'Details',
    fishHref: (value) => `fish.html?id=${value}`,
    esc: (value) =>
      String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;'),
    c: { area: (value) => String(value), point: (value) => String(value), species: 'species' },
    $: () => box,
  }
}
