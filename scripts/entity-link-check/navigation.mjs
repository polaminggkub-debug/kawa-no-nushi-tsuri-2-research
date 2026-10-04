import assert from 'node:assert/strict'
import { render, unescapeHtml } from './shared.mjs'

for (const lang of ['en', 'th', 'ja']) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  await checkPendingSwitches(lang, suffix)
  await checkCompassReturns(lang, suffix)
  await checkNestedReturns(lang, suffix)
  await checkInvalidIdentities(lang)
  await checkUnsafeReturns()
}

async function checkPendingSwitches(lang, suffix) {
  for (const kind of ['item', 'fish']) {
    const query = new URLSearchParams(
      kind === 'item'
        ? {
            category: 'bait',
            id: '01',
            fish: '01',
            stage: '3',
            route: 'sinker',
            return: `maps${suffix}.html?stage=3&fish=01`,
          }
        : {
            id: '01',
            stage: '3',
            return: `item${suffix}.html?category=bait&id=01&fish=01&stage=3&route=sinker`,
          },
    )
    const pending = await render(kind, lang, query, undefined, true)
    assert.equal(pending.html, '', 'Pending data must not masquerade as a rendered profile')
    for (const targetLang of ['en', 'th', 'ja']) checkPendingLocale(pending, kind, targetLang)
    assert(pending.nodes[kind === 'item' ? 'detail-back' : 'fish-back'].href)
  }
}

function checkPendingLocale(pending, kind, targetLang) {
  const suffix = targetLang === 'en' ? '' : `.${targetLang}`
  const language =
    kind === 'item'
      ? pending.languages.find((link) => link.getAttribute('hreflang') === targetLang)
      : pending.nodes[`language-${targetLang}`]
  const next = new URL(language.href, pending.url)
  assert(next.pathname.endsWith(`/${kind}${suffix}.html`))
  assert.equal(next.searchParams.get('id'), '01')
  assert.equal(next.searchParams.get('stage'), '3')
  if (kind === 'item') {
    assert.equal(next.searchParams.get('fish'), '01')
    assert.equal(next.searchParams.get('route'), 'sinker')
  }
  const back = new URL(next.searchParams.get('return'), pending.url)
  assert(back.pathname.endsWith(`/${kind === 'item' ? 'maps' : 'item'}${suffix}.html`))
}

async function checkCompassReturns(lang, suffix) {
  for (const entry of [`maps${suffix}.html?stage=2&fish=06`, '']) {
    let query = new URLSearchParams({
      category: 'general_tool',
      id: '0E',
      stage: '2',
      fish: '06',
      route: 'sinker',
    })
    if (entry) query.set('return', entry)
    let stableBack
    for (const stage of [2, 5, 1, 4]) {
      const result = await render('item', lang, query)
      const action = [...result.html.matchAll(/data-compass-location href="([^"]+)"/g)].find(
        (match) =>
          new URL(unescapeHtml(match[1]), result.url).searchParams.get('stage') === String(stage),
      )
      assert(action, 'Missing area switch action')
      const next = new URL(unescapeHtml(action[1]), result.url)
      const back = next.searchParams.get('return')
      if (stableBack === undefined) stableBack = back
      assert.equal(back, stableBack, 'Area switches must keep the entry-page return')
      assert(!new URL(back, result.url).searchParams.has('return'))
      assert.equal(next.searchParams.get('fish'), '06')
      assert.equal(next.searchParams.get('route'), 'sinker')
      query = next.searchParams
    }
  }
}

async function checkNestedReturns(lang, suffix) {
  const nestedReturn = `item${suffix}.html?category=food&id=07&return=${encodeURIComponent(`maps${suffix}.html?stage=3&fish=18`)}`
  const mapOrigin = `maps${suffix}.html?stage=3&fish=01`
  const fishOrigin = `fish${suffix}.html?id=01&stage=3&return=${encodeURIComponent(mapOrigin)}`
  const shopOrigin = `shops${suffix}.html?stage=3&fish=01&route=sinker&return=${encodeURIComponent(fishOrigin)}`
  const item = await render(
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
  checkNestedItemLocale(item, suffix)
  const fish = await render(
    'fish',
    lang,
    new URLSearchParams({ id: '18', stage: '3', return: nestedReturn }),
  )
  checkNestedFishLocale(fish)
}

function checkNestedItemLocale(item, originalSuffix) {
  for (const targetLang of ['en', 'th', 'ja']) {
    const suffix = targetLang === 'en' ? '' : `.${targetLang}`
    const language = item.languages.find((link) => link.getAttribute('hreflang') === targetLang)
    let route = new URL(language.href, item.url).searchParams.get('return')
    for (const basename of ['shops', 'fish', 'maps']) {
      const next = new URL(route, item.url)
      assert(next.pathname.endsWith(`/${basename}${suffix}.html`))
      assert.equal(next.searchParams.get('stage'), '3')
      assert.equal(next.searchParams.get('fish') || next.searchParams.get('id'), '01')
      route = next.searchParams.get('return')
    }
  }
  assert(originalSuffix || item.url.pathname.endsWith('item.html'))
}

function checkNestedFishLocale(fish) {
  for (const targetLang of ['en', 'th', 'ja']) {
    const suffix = targetLang === 'en' ? '' : `.${targetLang}`
    const switched = new URL(fish.nodes[`language-${targetLang}`].href, fish.url)
    const firstBack = new URL(switched.searchParams.get('return'), fish.url)
    const secondBack = new URL(firstBack.searchParams.get('return'), fish.url)
    assert(firstBack.pathname.endsWith(`/item${suffix}.html`))
    assert(secondBack.pathname.endsWith(`/maps${suffix}.html`))
    assert.equal(firstBack.searchParams.get('category'), 'food')
    assert.equal(firstBack.searchParams.get('id'), '07')
    assert.equal(secondBack.searchParams.get('fish'), '18')
    assert.equal(secondBack.searchParams.get('stage'), '3')
  }
}

async function checkInvalidIdentities(lang) {
  for (const kind of ['fish', 'item']) {
    for (const query of ['', 'id=GG', 'id=FF&category=lure']) {
      const result = await render(kind, lang, query)
      assert(result.html.includes('empty-state'), `Invalid entity lacks recovery ${kind} ${query}`)
    }
  }
}

async function checkUnsafeReturns() {
  for (const kind of ['fish', 'item']) {
    for (const prefix of ['', '/kawa-no-nushi-tsuri-2-research']) {
      const baseQuery = kind === 'fish' ? { id: '06' } : { category: 'lure', id: '2E' }
      for (const badReturn of [
        'https://evil.example/catalogue/index.html',
        '//evil.example/catalogue/index.html',
        'javascript:alert(1)',
        '../../other.html',
      ]) {
        const result = await render(
          kind,
          'en',
          new URLSearchParams({ ...baseQuery, return: badReturn }),
          prefix,
        )
        const back = result.nodes[kind === 'fish' ? 'fish-back' : 'detail-back'].href
        assert(
          !back.includes('evil') && !back.includes('javascript') && !back.includes('other.html'),
        )
      }
      const research = await render(
        kind,
        'en',
        new URLSearchParams({ ...baseQuery, return: '../research/index.html' }),
        prefix,
      )
      assert(
        research.nodes[kind === 'fish' ? 'fish-back' : 'detail-back'].href.includes(
          'research/index.html',
        ),
      )
      const fromShop = await render(
        kind,
        'th',
        new URLSearchParams({
          ...baseQuery,
          return: 'shops.th.html?stage=3&place=town&category=bait&id=17',
        }),
        prefix,
      )
      assert(
        fromShop.nodes[kind === 'fish' ? 'fish-back' : 'detail-back'].href.includes(
          'shops.th.html?stage=3',
        ),
      )
    }
  }
}
