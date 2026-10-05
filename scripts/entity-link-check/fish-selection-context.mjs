import assert from 'node:assert/strict'
import { renderCatalogue } from './shared.mjs'

for (const lang of ['en', 'ja', 'th']) {
  for (const route of ['float', 'sinker']) await checkSelection(lang, route)
}
console.log(
  'Fish selection context PASS: fish, actual area, rig, map reset and return agree across URL, menu and locale links.',
)

async function checkSelection(lang, route) {
  const returnPath = 'maps.th.html?stage=4&fish=0D#map-view'
  const params = new URLSearchParams({
    category: 'bait',
    fish: '0D',
    stage: '4',
    route,
    return: returnPath,
    map: '3',
    q: 'old',
    style: '4',
  })
  const result = await renderCatalogue(lang, `?${params}`, false, true)
  result.runtime.selectFish('01')
  const url = result.url
  assert.equal(url.searchParams.get('fish'), '01')
  assert.equal(url.searchParams.get('stage'), '1')
  assert.equal(result.runtime.locationStage, '1')
  assert.equal(url.searchParams.get('route'), route)
  assert.equal(url.searchParams.get('return'), returnPath)
  assert.equal(url.searchParams.get('map'), '0')
  assert.equal(url.searchParams.has('q'), false)
  assert.equal(url.searchParams.has('style'), false)
  assert.equal(url.hash, '#fish-location-panel')
  assert.equal(result.nodes['fish-filter'].value, '01')
  for (const language of result.languages) {
    const target = new URL(language.href, url)
    assert.equal(target.searchParams.get('fish'), '01')
    assert.equal(target.searchParams.get('stage'), '1')
    assert.equal(target.searchParams.get('route'), route)
    assert.equal(target.searchParams.get('map'), '0')
    assert.equal(target.hash, '#fish-location-panel')
  }
  const reload = await renderCatalogue(lang, url.search + url.hash, false, true)
  assert.equal(reload.runtime.locationStage, result.runtime.locationStage)
  assert.equal(reload.runtime.baitRoute, route)
  assert.equal(reload.nodes['fish-filter'].value, '01')
}
