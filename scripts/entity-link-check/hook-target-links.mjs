import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import postcss from 'postcss'
import { data, renderCatalogue, unescapeHtml } from './shared.mjs'
import { hookTargetLinks } from '../../src/pages/equipment/hook-target-links.js'

checkHookLinkStyles()
const targetHooks = data.items.filter(
  (item) => item.category === 'hook' && item.playerUse?.targetMatches,
)
assert(targetHooks.length > 0, 'Expected hooks with ROM-record target matches')

for (const lang of ['en', 'ja', 'th']) await checkLocale(lang)

console.log(
  `PASS: ${targetHooks.length} target-matched hooks link to listed fish in EN/JA/TH; hook 01 returns to the filtered catalogue with stage, route and nested return intact.`,
)

async function checkLocale(lang) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const nestedReturn = `maps${suffix}.html?stage=4&section=s4-c1-r1&fish=06#notebook-guide`
  const query = new URLSearchParams({
    category: 'hook',
    q: '01',
    sort: 'id',
    stage: '4',
    route: 'sinker',
    map: '2',
    return: nestedReturn,
  })
  const { runtime, url } = await renderCatalogue(lang, `?${query}#catalogue`)
  const item = targetHooks.find((entry) => entry.id === '01')
  const card = runtime.renderItemCard(item)
  checkVisibleHookAction(card, item, lang)
  checkCatalogueTargetLinks(runtime, lang)
  checkTargetRoute(card, url, lang, nestedReturn)
  assert.equal(hookTargetLinks(runtime, { category: 'hook', id: '06' }), '')
  assert.equal(
    hookTargetLinks(runtime, {
      category: 'bait',
      id: '01',
      playerUse: { targetMatches: [{ fishId: '37' }] },
    }),
    '',
  )
}

function checkVisibleHookAction(card, item, lang) {
  const targetIndex = card.indexOf('data-hook-target-links')
  const disclosureIndex = card.indexOf('<details class="card-decision-disclosure"')
  assert(targetIndex >= 0, `${lang}/${item.id}: visible target action missing`)
  assert(
    disclosureIndex > targetIndex,
    `${lang}/${item.id}: target action must stay outside the collapsed disclosure`,
  )
  const targetMarkup = card.slice(targetIndex, card.indexOf('</div>', targetIndex))
  assertNoUnsupportedClaims(targetMarkup, lang, item.id)
}

function checkCatalogueTargetLinks(runtime, lang) {
  for (const item of targetHooks) {
    const card = runtime.renderItemCard(item)
    const expected = normalizeTargets(item.playerUse.targetMatches)
    const links = [...card.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].filter(([, attrs]) =>
      attrs.includes('data-hook-target-fish='),
    )
    assert.equal(links.length, expected.length, `${lang}/${item.id}: fish link count`)
    for (const [index, [, attributes]] of links.entries()) {
      assert(attributes.includes(`data-hook-target-fish="${expected[index]}"`))
    }
  }
}

function checkTargetRoute(card, base, lang, nestedReturn) {
  const anchor = card.match(/data-hook-target-fish="37"[^>]*href="([^"]+)"/)
  assert(anchor, `${lang}/01: Akame link missing`)
  const fishUrl = new URL(unescapeHtml(anchor[1]), base)
  const suffix = lang === 'en' ? '' : `.${lang}`
  assert.equal(fishUrl.pathname, `/catalogue/fish${suffix}.html`)
  assert.equal(fishUrl.searchParams.get('id'), '37')
  assert.equal(fishUrl.searchParams.get('stage'), '4')
  const returned = new URL(fishUrl.searchParams.get('return'), base)
  assert.equal(returned.pathname, `/catalogue/index${suffix}.html`)
  assert.equal(returned.searchParams.get('category'), 'hook')
  assert.equal(returned.searchParams.get('q'), '01')
  assert.equal(returned.searchParams.get('sort'), 'id')
  assert.equal(returned.searchParams.get('stage'), '4')
  assert.equal(returned.searchParams.get('route'), 'sinker')
  assert.equal(returned.searchParams.get('map'), '2')
  assert.equal(returned.searchParams.get('return'), nestedReturn)
  assert.equal(returned.hash, '#catalogue')
}

function assertNoUnsupportedClaims(html, lang, itemId) {
  const unsupported = {
    en: /compatible|catch bonus|bite rate|easier to catch/i,
    ja: /適合|釣果ボーナス|食いつき率|釣りやす/i,
    th: /เหยื่อที่ปลากินได้|โบนัสจับปลา|เพิ่มโอกาสกัด|จับง่าย/i,
  }[lang]
  assert(!unsupported.test(html), `${lang}/${itemId}: link copy implies an unproved benefit`)
}

function normalizeTargets(value) {
  const targets = Array.isArray(value) ? value : [value]
  return targets.map((target) => String(target.fishId).toUpperCase())
}

function checkHookLinkStyles() {
  const file = new URL('../../src/pages/equipment/styles/part-6.css', import.meta.url)
  const root = postcss.parse(readFileSync(file, 'utf8'), { from: file.pathname })
  const button = root.nodes.find(
    (node) =>
      node.type === 'rule' &&
      node.selector
        .split(',')
        .map((value) => value.trim())
        .includes('.item-card .route-button'),
  )
  const label = root.nodes.find(
    (node) => node.type === 'rule' && node.selector === '.hook-target-links > span',
  )
  assert(button, 'Missing scoped item-card route-button hit-target rule')
  assert.equal(declaration(button, 'display'), 'inline-flex')
  assert.equal(declaration(button, 'min-height'), '44px')
  assert.equal(declaration(button, 'max-width'), '100%')
  assert(label, 'Missing block label rule for hook target links')
  assert.equal(declaration(label, 'display'), 'block')
}

function declaration(rule, property) {
  return rule.nodes.find((node) => node.type === 'decl' && node.prop === property)?.value
}
