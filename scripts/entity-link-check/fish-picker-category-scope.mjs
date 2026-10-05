import assert from 'node:assert/strict'
import { renderCatalogue } from './shared.mjs'

const locales = ['en', 'ja', 'th']
const nestedReturn = 'maps.th.html?stage=4&fish=06&section=s4-c1-r2#map-view'
const hidden = ['food', 'general_tool']
const visible = ['bait', 'rod', 'lure', 'flymaker', 'all']

for (const locale of locales) {
  for (const category of hidden) await checkIncomingFish(locale, category)
  await checkCategoryTransitions(locale)
}
console.log(
  'PASS: target-fish picker hides only for food/tools, closes and restores across in-page category changes.',
)

async function checkIncomingFish(locale, category) {
  const result = await renderCatalogue(
    locale,
    `?category=${category}&fish=06&stage=3&route=sinker&sort=name&return=${encodeURIComponent(nestedReturn)}#catalogue`,
    false,
    true,
  )
  assert.equal(
    result.nodes['fish-picker'].hidden,
    true,
    `${locale}/${category}: picker should be hidden`,
  )
  assert.equal(
    result.nodes['category-filter'].value,
    category,
    `${locale}/${category}: category was coerced`,
  )
  assert.equal(
    result.nodes['fish-filter'].value,
    '',
    `${locale}/${category}: hidden target should be cleared`,
  )
  assert(
    result.nodes.cards.innerHTML.includes(`id="item-${category}-`),
    `${locale}/${category}: target left no usable items`,
  )
  assert.equal(result.url.searchParams.get('category'), category)
  assert.equal(result.url.searchParams.has('fish'), false)
  for (const [key, value] of Object.entries({
    stage: '3',
    route: 'sinker',
    sort: 'name',
    return: nestedReturn,
  }))
    assert.equal(result.url.searchParams.get(key), value, `${locale}/${category}: lost ${key}`)
  if (category === 'general_tool') {
    const tool = result.runtime.allItems.find(
      (item) => item.category === category && item.id === '08',
    )
    const card = result.runtime.renderItemCard(tool)
    assert(card.includes('class="fish-chip"') && card.includes('data-entity="fish"'))
  }
}

async function checkCategoryTransitions(locale) {
  const result = await renderCatalogue(
    locale,
    `?category=bait&stage=3&route=sinker&q=fish&sort=name&map=2&return=${encodeURIComponent(nestedReturn)}#catalogue`,
    false,
    true,
  )
  const { nodes, runtime, url } = result
  nodes['fish-search'].value = 'Nijimasu'
  runtime.showFishSuggestions()
  assert.equal(nodes['fish-suggestions'].hidden, false)
  for (const category of [...hidden, ...visible]) {
    nodes['category-filter'].value = category
    runtime.renderCards()
    assertCategoryState(nodes, url, locale, category)
  }
  nodes['category-filter'].value = 'bait'
  runtime.renderCards()
  runtime.showFishSuggestions()
  assert.equal(nodes['fish-picker'].hidden, false, `${locale}: picker did not restore`)
  assert.equal(nodes['fish-suggestions'].hidden, false, `${locale}: suggestions did not reopen`)
}

function assertCategoryState(nodes, url, locale, category) {
  const shouldHide = hidden.includes(category)
  assert.equal(nodes['fish-picker'].hidden, shouldHide, `${locale}/${category}: wrong visibility`)
  assert.equal(nodes['category-filter'].value, category, `${locale}/${category}: changed category`)
  assert.equal(nodes.search.value, 'fish')
  assert.equal(nodes['sort-filter'].value, 'name')
  for (const [key, value] of Object.entries({
    category,
    stage: '3',
    route: 'sinker',
    q: 'fish',
    sort: 'name',
    map: '2',
    return: nestedReturn,
  }))
    assert.equal(url.searchParams.get(key), value, `${locale}/${category}: lost ${key}`)
  if (shouldHide) {
    assert.equal(
      nodes['fish-suggestions'].hidden,
      true,
      `${locale}/${category}: suggestions stayed open`,
    )
    assert.equal(nodes['fish-search'].getAttribute('aria-expanded'), 'false')
  }
}
