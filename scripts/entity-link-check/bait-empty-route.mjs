import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { data, renderCatalogue, root, unescapeHtml } from './shared.mjs'

const css = fs.readFileSync(path.join(root, 'src/pages/equipment/styles/part-6.css'), 'utf8')
const hitArea = css.match(/\.empty-state \.route-button\s*\{([^}]+)\}/)?.[1] || ''
assert(
  /display:\s*inline-flex/.test(hitArea),
  'Wrapped recovery link must have a continuous hit area',
)
assert(/min-height:\s*44px/.test(hitArea), 'Recovery action must remain touch sized')

const bait = data.items.find((item) => item.category === 'bait' && item.id === '17')
assert.deepEqual(bait.playerUse.fishIdsByRoute.sinker, [])
assert(bait.playerUse.fishIdsByRoute.float.includes('38'))

for (const lang of ['en', 'ja', 'th']) {
  await checkClickAndReload(lang)
  const suffix = lang === 'en' ? '' : `.${lang}`
  for (const fish of ['', '38']) {
    const query = new URLSearchParams({
      category: 'bait',
      stage: '3',
      route: 'sinker',
      q: '17',
      return: `maps${suffix}.html?stage=3#notebook-guide`,
    })
    if (fish) query.set('fish', fish)
    const result = await renderCatalogue(lang, `?${query}`)
    const html = result.nodes.cards.innerHTML
    assert(
      !html.includes('class="item-card'),
      'An incompatible bait must not become a recommended card',
    )
    assert(
      html.includes('data-empty-bait-route'),
      'Matching bait disappeared without a rig explanation',
    )
    const match = html.match(/data-empty-bait-switch="float" href="([^"]+)"/)
    assert(match, 'No useful route recovery')
    const target = new URL(unescapeHtml(match[1]), result.url)
    for (const key of ['category', 'stage', 'q', 'return', 'fish'])
      assert.equal(target.searchParams.get(key), query.get(key), `Rig recovery dropped ${key}`)
    assert.equal(target.searchParams.get('route'), 'float')
    const recovered = await renderCatalogue(lang, target.search)
    assert(recovered.nodes.cards.innerHTML.includes('id="item-bait-17"'))
  }
  const absent = await renderCatalogue(lang, '?category=bait&route=sinker&q=nonexistent-bait')
  assert(
    !absent.nodes.cards.innerHTML.includes('data-empty-bait-switch'),
    'Unknown search misclassified as a rig problem',
  )
  const incompatible = await renderCatalogue(lang, '?category=bait&route=sinker&q=17&fish=06')
  assert(
    !incompatible.nodes.cards.innerHTML.includes('data-empty-bait-switch'),
    'Rig switch suggested a bait incompatible with target',
  )
}
console.log(
  'PASS: empty sinker search explains matched bait and recovers its float route without losing player context or recommending incompatible fish.',
)

async function checkClickAndReload(lang) {
  const result = await renderCatalogue(
    lang,
    '?category=bait&stage=3&route=sinker&q=17',
    false,
    true,
  )
  let prevented = false
  const handler = result.nodes.cards.listeners.click
  assert.equal(typeof handler, 'function', 'Recovery has no bound click action')
  handler({
    target: {
      closest: (selector) =>
        selector === '[data-empty-bait-switch="float"]'
          ? { dataset: { emptyBaitSwitch: 'float' } }
          : null,
    },
    preventDefault() {
      prevented = true
    },
  })
  assert(prevented)
  assert.equal(result.runtime.baitRoute, 'float')
  assert.equal(result.url.searchParams.get('route'), 'float')
  assert.equal(result.url.searchParams.get('q'), '17')
  assert(result.nodes.cards.innerHTML.includes('id="item-bait-17"'))
  const reloaded = await renderCatalogue(lang, result.url.search)
  assert.equal(reloaded.runtime.baitRoute, 'float')
  assert(reloaded.nodes.cards.innerHTML.includes('id="item-bait-17"'))
  const routeHandler = result.nodes['bait-route-menu'].listeners.click
  routeHandler({ target: { closest: () => ({ dataset: { route: 'sinker' } }) } })
  assert.equal(result.url.searchParams.get('route'), 'sinker')
}
