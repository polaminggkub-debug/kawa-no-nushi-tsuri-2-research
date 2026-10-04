import assert from 'node:assert/strict'
import { fishIds, render, unescapeHtml } from './shared.mjs'

for (const lang of ['en', 'ja', 'th']) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  await checkFishPages(lang, suffix)
  await checkNestedItemReturns(lang, suffix)
  await checkNestedFishReturns(lang, suffix)
  await checkInvalidFishPages(lang)
}

async function checkFishPages(lang, suffix) {
  for (const id of fishIds) {
    const result = await render(
      'fish',
      lang,
      new URLSearchParams({ id, stage: '3', return: `maps${suffix}.html?stage=3&fish=${id}` }),
    )
    assert(/class="detail-hero(?:\s|")/.test(result.html), `Fish render failed ${id}`)
    assert(result.nodes['fish-back'].href.includes(`fish=${id}`))
    for (const targetLang of ['en', 'th', 'ja']) checkFishLanguageReturn(result, targetLang)
    if (id === '43') checkUnconfirmedFish(result)
  }
}

function checkFishLanguageReturn(result, targetLang) {
  const suffix = targetLang === 'en' ? '' : `.${targetLang}`
  const target = result.nodes[`language-${targetLang}`]
  const switched = new URL(target.href, result.url)
  const back = switched.searchParams.get('return')
  assert(back && new URL(back, result.url).pathname.endsWith(`/maps${suffix}.html`))
}

function checkUnconfirmedFish(result) {
  assert(!/class="route-button"[^>]*maps[^>]*>/.test(result.html))
  assert(result.html.includes('data-unconfirmed-profile-action'))
  assert(!result.html.includes('id="all-compatible"'))
  assert(result.html.includes('fish-acceptance-research.md'))
  const next = new URL(
    unescapeHtml(result.html.match(/class="route-button" href="([^"]+)"/)?.[1]),
    result.url,
  )
  assert.equal(next.searchParams.get('fish'), null)
}

async function checkNestedItemReturns(lang, suffix) {
  const mapOrigin = `maps${suffix}.html?stage=3&fish=01`
  const fishOrigin = `fish${suffix}.html?id=01&stage=3&return=${encodeURIComponent(mapOrigin)}`
  const shopOrigin = `shops${suffix}.html?stage=3&fish=01&route=sinker&return=${encodeURIComponent(fishOrigin)}`
  const result = await render(
    'item',
    lang,
    new URLSearchParams({
      category: 'bait',
      id: '01',
      stage: '3',
      fish: '01',
      route: 'sinker',
      return: shopOrigin,
    }),
  )
  for (const targetLang of ['en', 'th', 'ja']) {
    const suffix = targetLang === 'en' ? '' : `.${targetLang}`
    const language = result.languages.find((link) => link.getAttribute('hreflang') === targetLang)
    let back = new URL(language.href, result.url).searchParams.get('return')
    for (const basename of ['shops', 'fish', 'maps']) {
      const page = new URL(back, result.url)
      assert(page.pathname.endsWith(`/${basename}${suffix}.html`))
      assert.equal(page.searchParams.get('stage'), '3')
      assert.equal(page.searchParams.get('fish') || page.searchParams.get('id'), '01')
      back = page.searchParams.get('return')
    }
  }
}

async function checkNestedFishReturns(lang, suffix) {
  const nestedReturn = `item${suffix}.html?category=food&id=07&return=${encodeURIComponent(`maps${suffix}.html?stage=3&fish=18`)}`
  const result = await render(
    'fish',
    lang,
    new URLSearchParams({ id: '18', stage: '3', return: nestedReturn }),
  )
  for (const targetLang of ['en', 'th', 'ja']) {
    const suffix = targetLang === 'en' ? '' : `.${targetLang}`
    const switched = new URL(result.nodes[`language-${targetLang}`].href, result.url)
    const firstBack = new URL(switched.searchParams.get('return'), result.url)
    const secondBack = new URL(firstBack.searchParams.get('return'), result.url)
    assert(firstBack.pathname.endsWith(`/item${suffix}.html`))
    assert(secondBack.pathname.endsWith(`/maps${suffix}.html`))
    assert.equal(firstBack.searchParams.get('category'), 'food')
    assert.equal(firstBack.searchParams.get('id'), '07')
    assert.equal(secondBack.searchParams.get('fish'), '18')
    assert.equal(secondBack.searchParams.get('stage'), '3')
  }
}

async function checkInvalidFishPages(lang) {
  for (const query of ['', 'id=GG', 'id=FF&category=lure']) {
    const result = await render('fish', lang, query)
    assert(result.html.includes('empty-state'), `Invalid fish lacks recovery ${query}`)
  }
}
