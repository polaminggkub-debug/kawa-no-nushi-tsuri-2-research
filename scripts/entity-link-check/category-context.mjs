import assert from 'node:assert/strict'
import { renderCatalogue, unescapeHtml } from './shared.mjs'

for (const lang of ['en', 'ja', 'th']) {
  for (const route of ['float', 'sinker']) await checkCategoryTransition(lang, route)
  for (const fish of ['01', '0D']) await checkExplicitGear(lang, fish)
}

async function checkExplicitGear(lang, fish) {
  for (const [category, marker, count] of [
    ['rod', 'rod', 21],
    ['hook', 'gear', 13],
  ]) {
    const result = await renderCatalogue(
      lang,
      `?category=${category}&fish=${fish}&stage=4&route=sinker`,
      false,
      true,
    )
    assert.equal(
      result.nodes['category-filter'].value,
      category,
      'Selected generic gear category must remain selected',
    )
    assert(result.nodes['category-filter'].innerHTML.includes(`value="${category}"`))
    assert.equal(
      [...result.nodes.cards.innerHTML.matchAll(new RegExp(`data-${marker}-decision="`, 'g'))]
        .length,
      count,
    )
    assert(result.nodes['category-menu'].innerHTML.includes(`data-category="${category}"`))
    assert(!result.nodes['category-menu'].innerHTML.includes('data-category="food"'))
    assert(!result.nodes['category-menu'].innerHTML.includes('data-category="general_tool"'))
    const status = result.nodes['fish-status'].textContent
    assert(status, 'Generic gear needs an honest player-facing scope explanation')
    assert(!status.includes('that pass the selected fish’s ROM compatibility check'))
    assert(!status.includes('แสดงรายการในหมวดนี้ที่ผ่านเงื่อนไขจาก ROM'))
    assert(!status.includes('選択した魚のROM条件を通るカテゴリー内アイテム'))
  }
  const all = await renderCatalogue(lang, `?category=all&fish=${fish}&stage=4`)
  assert(!all.nodes.cards.innerHTML.includes('id="item-rod-'))
  assert(
    !all.nodes.cards.innerHTML.includes('id="item-hook-'),
    'Compatible-all must not label generic hooks as fish-specific matches',
  )
}
console.log(
  'Category context PASS: menu links and clicks retain fish, area, rig and return in three locales.',
)

async function checkCategoryTransition(lang, route) {
  const returnPath = 'maps.th.html?stage=4&fish=0D#map-view'
  const params = new URLSearchParams({
    category: 'float_weight',
    fish: '0D',
    stage: '4',
    route,
    return: returnPath,
    q: 'old-search',
    style: '4',
  })
  const result = await renderCatalogue(lang, `?${params}#catalogue`, false, true)
  const menu = result.nodes['category-menu'].innerHTML
  const match = menu.match(/href="([^"]+)" data-category="bait"/)
  assert(match, 'Missing bait category menu link')
  const href = unescapeHtml(match[1])
  checkContext(new URL(href, result.url), route, returnPath)
  const link = { dataset: { category: 'bait' }, href }
  checkModifiedClicks(result, link)
  let prevented = false
  result.nodes['category-menu'].listeners.click({
    target: { closest: () => link },
    preventDefault() {
      prevented = true
    },
  })
  assert(prevented, 'Plain click should update the catalogue')
  checkContext(result.url, route, returnPath)
  assert.equal(result.nodes['category-filter'].value, 'bait')
  assert.equal(result.nodes.search.value, '')
  assert.equal(result.nodes['style-filter'].value, '')
  checkLanguageLinks(result, route, returnPath)
}

function checkContext(url, route, returnPath) {
  for (const [key, value] of Object.entries({
    category: 'bait',
    fish: '0D',
    stage: '4',
    route,
    return: returnPath,
  }))
    assert.equal(url.searchParams.get(key), value, `Lost ${key} in category transition`)
  assert.equal(url.searchParams.has('q'), false)
  assert.equal(url.searchParams.has('style'), false)
  assert.equal(url.hash, '#catalogue')
}

function checkModifiedClicks(result, link) {
  for (const modifier of [
    { ctrlKey: true },
    { metaKey: true },
    { shiftKey: true },
    { altKey: true },
    { button: 1 },
  ]) {
    const before = result.url.href
    result.nodes['category-menu'].listeners.click({
      ...modifier,
      target: { closest: () => link },
      preventDefault() {
        assert.fail('Modified click must allow browser navigation')
      },
    })
    assert.equal(result.url.href, before)
  }
}

function checkLanguageLinks(result, route, returnPath) {
  for (const language of result.languages) {
    const localized = new URL(language.href, result.url)
    const expected = new URL(returnPath, result.url)
    expected.pathname = expected.pathname.replace(
      /maps(?:\.th|\.ja)?\.html$/,
      `maps${language.getAttribute('hreflang') === 'en' ? '' : '.' + language.getAttribute('hreflang')}.html`,
    )
    checkContext(localized, route, localized.searchParams.get('return'))
    const back = new URL(localized.searchParams.get('return'), result.url)
    assert.equal(back.pathname, expected.pathname)
    assert.equal(back.search, expected.search)
    assert.equal(back.hash, expected.hash)
  }
}
