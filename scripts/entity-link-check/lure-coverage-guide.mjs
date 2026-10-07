import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { data, root, renderCatalogue, unescapeHtml, validate } from './shared.mjs'

const lureItems = data.items.filter((item) => item.category === 'lure')
const lureProfiles = new Set(lureItems.flatMap((item) => item.playerUse?.fishIds || []))
const fullPairs = getFullPairs()

for (const lang of ['en', 'ja', 'th']) await checkLocale(lang)

console.log(
  'PASS: lure kit illustration link remains available exactly once as categories and fish filters change in EN/JA/TH.',
)

async function checkLocale(lang) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const staticPage = fs.readFileSync(path.join(root, `catalogue/index${suffix}.html`), 'utf8')
  const href = staticPage.match(/id="kit-link" href="([^"]+)"/)?.[1]
  assert.equal(href, `../research/index${suffix}.html`, `Wrong localized kit destination (${lang})`)
  const result = await renderCatalogue(lang, '?category=rod#catalogue')
  result.nodes['kit-link'].href = href

  const all = renderState(result, 'all')
  assertCanonicalLureLink(all, href, result.url)
  checkRejectionProbes(all, href, result.url)
  const lure = renderState(result, 'lure')
  assertCanonicalLureLink(lure, href, result.url)
  const other = renderState(result, 'rod')
  assert.equal(other.kitHidden, false, `Other category hid the generic kit (${lang})`)
  assert.equal(other.coverageCards, 0)
  assert.equal(other.genericHref, href)

  for (const category of ['all', 'lure']) {
    const targeted = renderState(result, category, '06')
    assert.equal(targeted.kitHidden, true, `Fish-targeted view should hide generic kit (${lang})`)
    assert.equal(targeted.coverageCards, 0)
    assert.equal(targeted.guideLinks, 0)
  }

  await checkAllAreaSummary(lang)
  for (let stage = 1; stage <= 6; stage++) await checkAreaRecommendation(lang, stage)
  checkResearchAreaRecommendations(lang)
}

async function checkAllAreaSummary(lang) {
  const result = await renderCatalogue(lang, '?category=lure&route=float#catalogue')
  const state = renderState(result, 'lure')
  const card = state.html.match(
    /<article class="decision-card" data-lure-coverage-pair>([\s\S]*?)<\/article>/,
  )?.[0]
  assert(card, `${lang}: all-area lure summary missing`)
  const linkedIds = [
    ...new Set(
      [...card.matchAll(/<a class="decision-item" href="([^"]+)"/g)].map(
        ([, href]) => getLinkedLure(href, result.url).id,
      ),
    ),
  ].sort()
  assert.deepEqual(
    linkedIds,
    ['17', '23', '24', '2E'],
    `${lang}: all-area kit lacks direct item links`,
  )
  for (const [, href] of card.matchAll(/<a class="decision-item" href="([^"]+)"/g))
    checkNoStageCatalogueReturn(href, result.url, lang)
  const expectations = {
    en: ['Complete pairs by area', 'Area 1', 'Areas 2 and 3', 'Area 4', 'Areas 5 and 6', '17+24'],
    ja: ['エリア別に店頭で揃うセット', 'エリア1', 'エリア2・3', 'エリア4', 'エリア5・6', '17+24'],
    th: ['ชุดครบที่ซื้อได้ตามด่าน', 'ด่าน 1', 'ด่าน 2, 3', 'ด่าน 4', 'ด่าน 5, 6', '17+24'],
  }[lang]
  for (const text of expectations)
    assert(card.includes(text), `${lang}: all-area summary omitted ${text}`)
}

function checkNoStageCatalogueReturn(href, base, lang) {
  const target = new URL(unescapeHtml(href), base)
  const returned = new URL(target.searchParams.get('return'), base)
  assert.equal(returned.pathname.split('/').pop(), `index${lang === 'en' ? '' : `.${lang}`}.html`)
  assert.equal(returned.searchParams.get('category'), 'lure')
  assert.equal(returned.searchParams.get('route'), 'float')
  assert.equal(returned.searchParams.has('stage'), false)
  assert.equal(returned.hash, '#catalogue')
}

function getFullPairs() {
  const expected = [...lureProfiles].sort()
  const pairs = []
  for (let first = 0; first < lureItems.length; first++) {
    for (let second = first + 1; second < lureItems.length; second++) {
      const pair = [lureItems[first], lureItems[second]]
      const covered = [...new Set(pair.flatMap((item) => item.playerUse?.fishIds || []))].sort()
      if (JSON.stringify(covered) === JSON.stringify(expected)) pairs.push(pair)
    }
  }
  assert.equal(lureProfiles.size, 38)
  return pairs
}

async function checkAreaRecommendation(lang, stage) {
  const result = await renderCatalogue(lang, `?category=lure&stage=${stage}&route=float#catalogue`)
  const state = renderState(result, 'lure')
  const card = state.html.match(
    /<article class="decision-card" data-lure-coverage-pair>([\s\S]*?)<\/article>/,
  )?.[0]
  assert(card, `${lang}/area${stage}: stage-aware lure kit card missing`)
  const expected = expectedPairsForArea(stage)
  const links = [...card.matchAll(/<a class="decision-item" href="([^"]+)"/g)]
  const pair = links.map((link) => getLinkedLure(link[1], result.url))
  assert.equal(pair.length, 2, `${lang}/area${stage}: recommendation must link both lures`)
  assert(
    expected.some((candidate) => samePair(candidate, pair)),
    `${lang}/area${stage}: wrong kit pair`,
  )
  assert(
    card.includes(priceLabel(lang, pairPrice(pair))),
    `${lang}/area${stage}: kit price is not stated`,
  )
  for (const link of links) checkCatalogueItemReturn(link[1], result.url, lang, stage)
  if (stage >= 5) checkNoLocalPairAdvice(card, lang, stage)
  else checkLocalPairAdvice(card, lang, stage)
}

function expectedPairsForArea(stage) {
  const local = fullPairs.filter((pair) => pair.every((item) => stocked(item, stage)))
  const candidates = local.length ? local : fullPairs
  const cheapest = Math.min(...candidates.map(pairPrice))
  return candidates.filter((pair) => pairPrice(pair) === cheapest)
}

function getLinkedLure(href, base) {
  const url = new URL(unescapeHtml(href), base)
  assert.equal(url.searchParams.get('category'), 'lure')
  const item = lureItems.find((candidate) => candidate.id === url.searchParams.get('id'))
  assert(item, `Unknown lure in recommendation link: ${url}`)
  return item
}

function checkCatalogueItemReturn(href, base, lang, stage) {
  const target = new URL(unescapeHtml(href), base)
  assert.equal(target.searchParams.get('stage'), String(stage))
  const returned = new URL(target.searchParams.get('return'), base)
  assert.equal(returned.pathname.split('/').pop(), `index${lang === 'en' ? '' : `.${lang}`}.html`)
  assert.equal(returned.searchParams.get('category'), 'lure')
  assert.equal(returned.searchParams.get('stage'), String(stage))
  assert.equal(returned.searchParams.get('route'), 'float')
  assert.equal(returned.hash, '#catalogue')
}

function checkLocalPairAdvice(card, lang, stage) {
  const expected = {
    en: `Area ${stage} stocks the complete pair`,
    ja: `エリア${stage}では`,
    th: `ด่าน ${stage} ซื้อคู่`,
  }
  assert(card.includes(expected[lang]), `${lang}/area${stage}: local availability is not stated`)
}

function checkNoLocalPairAdvice(card, lang, stage) {
  const missing = {
    en: `Area ${stage} has no complete local pair.`,
    ja: `エリア${stage}では一式が揃いません。`,
    th: `ด่าน ${stage} ไม่มีคู่ครบขายในด่าน`,
  }
  const seller = { en: 'Area 4', ja: 'エリア4', th: 'ด่าน 4' }
  assert(
    card.includes(missing[lang]),
    `${lang}/area${stage}: missing local-stock limitation is vague`,
  )
  assert(card.includes(seller[lang]), `${lang}/area${stage}: no seller action for complete kit`)
}

function checkResearchAreaRecommendations(lang) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const html = fs.readFileSync(path.join(root, `research/index${suffix}.html`), 'utf8')
  const section = html.match(/<section id="lure-kit">([\s\S]*?)<section id="rod-choice">/)?.[1]
  assert(section, `${lang}: research lure-kit section missing`)
  assert(
    /data-shop-item="lure:24"/.test(section),
    `${lang}: area2/3 lure 24 purchase route missing`,
  )
  assert(/38/.test(section), `${lang}: 38-profile coverage is not visible`)
  assert(
    !/notebook|สมุด|ノート|66/.test(section),
    `${lang}: compatibility kit confused with notebook count`,
  )
  assert(
    /bite|catch|食いつき|釣果|อัตรากิน|จับได้/i.test(section),
    `${lang}: compatibility limit missing`,
  )
  const rows = new Map(
    [...section.matchAll(/<tr\b[^>]*data-lure-kit-area="([1-6,]+)"[^>]*>([\s\S]*?)<\/tr>/g)].map(
      ([, areas, content]) => [areas, content],
    ),
  )
  assert.deepEqual([...rows.keys()].sort(), ['1', '2', '3', '4', '5', '6'])
  checkResearchMatrixRows(rows, lang)
  for (const stage of [2, 3]) assertResearchLureSale(section, lang, stage)
}

function checkResearchMatrixRows(rows, lang) {
  const singleRows = [
    ['1', ['2E', '23'], 55],
    ['2', ['17', '24'], 55],
    ['3', ['17', '24'], 55],
    ['4', ['17', '23'], 50],
  ]
  for (const [area, ids, price] of singleRows) {
    const row = rows.get(area)
    for (const id of ids) assert(row.includes(id), `${lang}/areas${area}: lure ${id} missing`)
    assert(row.includes(priceLabel(lang, price)), `${lang}/areas${area}: pair price missing`)
  }
  for (const area of ['5', '6']) checkResearchNoLocalRow(rows.get(area), lang)
}

function checkResearchNoLocalRow(noLocal, lang) {
  assert(
    noLocal.includes('17') && noLocal.includes('23'),
    `${lang}/areas5,6: fallback pair missing`,
  )
  assert(
    /no|not|揃|販売|店頭|ไม่มี|ไม่ครบ/i.test(noLocal),
    `${lang}/areas5,6: lack of local pair is unclear`,
  )
  const seller = { en: 'Area 4', ja: 'エリア4', th: 'ด่าน 4' }
  assert(noLocal.includes(seller[lang]), `${lang}/areas5,6: fallback seller location missing`)
}

function assertResearchLureSale(section, lang, stage) {
  const shop = section.match(
    new RegExp(`<div class="shop" data-shop-item="lure:24">([\\s\\S]*?)<\\/div>`),
  )?.[1]
  assert(shop, `${lang}/area${stage}: area2/3 lure 24 sale row missing`)
  const suffix = lang === 'en' ? '' : `.${lang}`
  const base = new URL(`https://example.test/research/index${suffix}.html`)
  const hrefs = [...shop.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*aria-label="([^"]+)"/g)]
  const seller = hrefs.find(
    ([, href]) => new URL(unescapeHtml(href), base).searchParams.get('stage') === String(stage),
  )
  assert(seller, `${lang}/area${stage}: lure 24 seller action missing`)
  const target = new URL(unescapeHtml(seller[1]), base)
  assert.equal(target.pathname, `/catalogue/shops${suffix}.html`)
  assert.equal(target.searchParams.get('category'), 'lure')
  assert.equal(target.searchParams.get('id'), '24')
  assert.equal(target.searchParams.get('place'), 'town')
  assert.equal(new URL(target.searchParams.get('return'), target).href, `${base.href}#lure-kit`)
}

function stocked(item, stage) {
  return item.playerUse.shops.some((shop) => Number(shop.stage) === stage && !shop.condition)
}

function pairPrice(pair) {
  return pair.reduce((sum, item) => sum + item.priceYen, 0)
}

function samePair(left, right) {
  return (
    left
      .map((item) => item.id)
      .sort()
      .join('+') ===
    right
      .map((item) => item.id)
      .sort()
      .join('+')
  )
}

function priceLabel(lang, price) {
  return lang === 'ja' ? `${price}円` : `¥${price}`
}

function checkRejectionProbes(state, href, base) {
  const linkMarkup = state.html.match(
    /<p><a class="route-button" data-lure-coverage-guide[\s\S]*?<\/a><\/p>/,
  )?.[0]
  assert(linkMarkup, 'Lure guide test fixture did not contain a complete link')
  const rejectedLink = (error) =>
    error.code === 'ERR_ASSERTION' && error.message.includes('lost or duplicated')
  assert.throws(
    () =>
      assertCanonicalLureLink({ ...state, html: state.html.replace(linkMarkup, '') }, href, base),
    rejectedLink,
  )
  assert.throws(
    () => assertCanonicalLureLink({ ...state, html: `${state.html}${linkMarkup}` }, href, base),
    rejectedLink,
  )
  assert.throws(
    () => assertCanonicalLureLink({ ...state, kitHidden: false }, href, base),
    (error) => error.code === 'ERR_ASSERTION' && error.message.includes('should hide'),
  )
}

function renderState(result, category, fish = '') {
  result.nodes['category-filter'].value = category
  result.nodes['fish-filter'].value = fish
  result.runtime.renderCards()
  const html = result.nodes['category-decisions'].innerHTML
  return {
    html,
    kitHidden: result.nodes['generic-lure-kit'].hidden,
    genericHref: result.nodes['kit-link'].href,
    coverageCards: (html.match(/data-lure-coverage-pair/g) || []).length,
    guideLinks: (html.match(/data-lure-coverage-guide/g) || []).length,
  }
}

function assertCanonicalLureLink(state, href, base) {
  const coverageCards = (state.html.match(/data-lure-coverage-pair/g) || []).length
  const guideLinks = (state.html.match(/data-lure-coverage-guide/g) || []).length
  assert.equal(
    state.kitHidden,
    true,
    'Inline kit should hide when the canonical lure card is shown',
  )
  assert.equal(coverageCards, 1, 'Expected one canonical lure coverage card')
  assert.equal(guideLinks, 1, 'Canonical lure card lost or duplicated its illustrated-kit link')
  assert(
    state.html.indexOf('data-lure-coverage-pair') < state.html.indexOf('data-lure-coverage-guide'),
  )
  const match = state.html.match(/data-lure-coverage-guide href="([^"]+)"/)
  assert.equal(match?.[1], href)
  const target = new URL(match[1], base)
  assert(
    target.pathname.endsWith(
      `/research/index${base.pathname.includes('.th.html') ? '.th' : base.pathname.includes('.ja.html') ? '.ja' : ''}.html`,
    ),
  )
  validate(state.html, base)
}
