import assert from 'node:assert/strict'
import { render, renderCatalogue, unescapeHtml } from './shared.mjs'

for (const lang of ['en', 'ja', 'th']) {
  for (const [category, id, marker] of [
    ['float_weight', '01', 'float'],
    ['hook', '01', 'hook'],
  ]) {
    const params = new URLSearchParams({
      category,
      id,
      fish: '0D',
      stage: '4',
      route: 'sinker',
      return: 'maps.html?stage=4&fish=0D#map-view',
    })
    const detail = await render('item', lang, params)
    check(detail.html, detail.url, marker, category, '4', '0D', 'sinker')
    const catalogue = await renderCatalogue(
      lang,
      `?category=${category}&fish=0D&stage=4&route=sinker`,
    )
    const card = catalogue.runtime.allItems.find(
      (item) => item.category === category && item.id === id,
    )
    check(
      catalogue.runtime.gearNextActions(card),
      catalogue.url,
      marker,
      category,
      '4',
      '0D',
      'sinker',
    )
  }
}
console.log(
  'Gear guide context PASS: item and catalogue actions retain target fish, stage, rig and return across three locales.',
)

function check(html, base, marker, category, stage, fish, route) {
  const match = html.match(new RegExp(`data-${marker}-price-guide href="([^"]+)"`))
  assert(match, `${marker} has no price guide action`)
  const url = new URL(unescapeHtml(match[1]), base)
  assert.equal(url.searchParams.get('category'), category)
  assert.equal(url.searchParams.get('stage'), stage)
  assert.equal(url.searchParams.get('fish'), fish)
  assert.equal(url.searchParams.get('route'), route)
  assert.equal(url.hash, '#category-decisions')
  const back = new URL(url.searchParams.get('return'), base)
  assert.equal(back.pathname, base.pathname)
  assert.equal(back.searchParams.get('stage'), stage)
  assert.equal(back.searchParams.get('fish'), fish)
  assert.equal(back.searchParams.get('route'), route)
}
