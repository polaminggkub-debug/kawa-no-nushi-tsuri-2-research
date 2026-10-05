import assert from 'node:assert/strict'
import { renderCatalogue } from './shared.mjs'

const locales = ['en', 'ja', 'th']
const nestedReturn = 'maps.th.html?stage=2&section=s2-c1-r6&fish=0D#map-view'

for (const locale of locales) {
  await checkNavigation(locale, {
    query: `?category=bait&stage=4&route=sinker&map=2&return=${encodeURIComponent(nestedReturn)}#catalogue`,
    expected: { stage: '4', route: 'sinker', map: '2' },
    fish: '',
    nestedReturn,
  })
  await checkNavigation(locale, {
    query: `?category=bait&fish=34&stage=4&route=sinker&map=3&return=${encodeURIComponent(nestedReturn)}#catalogue`,
    expected: { stage: '6', route: 'sinker', map: '3' },
    fish: '34',
    nestedReturn,
  })
}

console.log(
  'PASS: catalogue map links retain the resolved area, fish, rig, map index, and full nested catalogue return in EN/JA/TH.',
)

async function checkNavigation(locale, scenario) {
  const result = await renderCatalogue(locale, scenario.query)
  const destination = new URL(result.nodes['map-browser-link'].href, result.url)
  const localeSuffix = locale === 'en' ? '' : `.${locale}`
  assert(destination.pathname.endsWith(`/maps${localeSuffix}.html`))
  assert.equal(destination.searchParams.get('fish') || '', scenario.fish)
  for (const [key, value] of Object.entries(scenario.expected))
    assert.equal(destination.searchParams.get(key), value, `${locale}: lost map ${key}`)

  const returned = new URL(destination.searchParams.get('return'), result.url)
  assert(returned.pathname.endsWith(`/index${localeSuffix}.html`))
  assert.equal(returned.searchParams.get('category'), 'bait')
  assert.equal(returned.searchParams.get('fish') || '', scenario.fish)
  assert.equal(returned.searchParams.get('stage'), scenario.expected.stage)
  assert.equal(returned.searchParams.get('route'), scenario.expected.route)
  assert.equal(returned.searchParams.get('map'), scenario.expected.map)
  assert.equal(returned.searchParams.get('return'), scenario.nestedReturn)
  assert.equal(returned.hash, '#catalogue')
}
