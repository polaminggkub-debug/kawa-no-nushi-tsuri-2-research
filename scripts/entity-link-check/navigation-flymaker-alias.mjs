import assert from 'node:assert/strict'
import { updateNavigation } from '../../src/pages/navigation/context-links.js'

const baseHref = 'index.th.html?category=all&fish=99#catalogue'
const sourcePaths = ['item.th.html', 'shops.th.html']

for (const sourcePath of sourcePaths) {
  for (const [category, part] of [
    ['fly', 'fly'],
    ['fly_wing', 'fly_wing'],
    ['fly_tail', 'fly_tail'],
  ]) {
    const source = sourceUrl(sourcePath, category, part)
    const target = runNavigation(source)
    assert.equal(target.pathname, '/kawa-no-nushi-tsuri-2-research/catalogue/index.th.html')
    assert.equal(target.searchParams.get('category'), 'flymaker')
    assert.equal(target.searchParams.get('part'), part)
    assertSharedContext(target, source, 'fly')
  }
}

for (const [category, part] of [
  ['flymaker', 'fly_tail'],
  ['flymaker', 'fly_wing'],
  ['lure', null],
  ['rod', null],
]) {
  const source = sourceUrl('item.th.html', category, part)
  const target = runNavigation(source)
  assert.equal(target.searchParams.get('category'), category)
  assert.equal(target.searchParams.get('part'), part)
  const route = category === 'flymaker' ? 'fly' : category === 'lure' ? 'lure' : 'float'
  assertSharedContext(target, source, route)
}

function sourceUrl(path, category, part) {
  const query = new URLSearchParams({
    category,
    id: '48',
    fish: '06',
    stage: '2',
    route: 'float',
    return: 'maps.th.html?stage=2&fish=06#fish-location-panel',
  })
  if (part) query.set('part', part)
  return `https://example.test/kawa-no-nushi-tsuri-2-research/catalogue/${path}?${query}#details`
}

function runNavigation(source) {
  const link = {
    dataset: { compendiumDestination: '0' },
    getAttribute(name) {
      assert.equal(name, 'href')
      return baseHref
    },
  }
  const previousLocation = globalThis.location
  const previousDocument = globalThis.document
  try {
    globalThis.location = { href: source }
    globalThis.document = {
      querySelector: () => null,
      querySelectorAll: (selector) => {
        assert.equal(selector, '[data-compendium-destination]')
        return [link]
      },
    }
    updateNavigation({})
    return new URL(link.href, source)
  } finally {
    restoreGlobal('location', previousLocation)
    restoreGlobal('document', previousDocument)
  }
}

function restoreGlobal(name, value) {
  if (value === undefined) delete globalThis[name]
  else globalThis[name] = value
}

function assertSharedContext(target, source, route) {
  const current = new URL(source)
  assert.equal(target.searchParams.get('fish'), '06')
  assert.equal(target.searchParams.get('stage'), '2')
  assert.equal(target.searchParams.get('route'), route)
  assert.equal(
    target.searchParams.get('return'),
    current.pathname.split('/').pop() + current.search + current.hash,
  )
  const nestedReturn = new URL(target.searchParams.get('return'), current)
  assert.equal(
    nestedReturn.searchParams.get('return'),
    'maps.th.html?stage=2&fish=06#fish-location-panel',
  )
  assert.equal(nestedReturn.hash, '#details')
}

console.log(
  'PASS: fly-maker aliases retain their part and player context in the global equipment link.',
)
