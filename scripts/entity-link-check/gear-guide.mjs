import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { goatCounterScript } from '../code-quality/analytics.mjs'
import cardsEn from '../../src/pages/gear-guide/cards_en.js'
import cardsTh from '../../src/pages/gear-guide/cards_th.js'
import cardsJa from '../../src/pages/gear-guide/cards_ja.js'
import { copy } from '../../src/pages/gear-guide/copy.js'
import { renderPlans } from '../../src/pages/gear-guide/kit-view.js'
import { liveBundles, planFish } from '../../src/pages/gear-guide/kits.js'
import { root } from './shared.mjs'

// The Gear guide page: three localized renders, a navigation entry and a home-intro link on every page,
// the numbers quoted in the cards against the measured data, and the kit finder for every fish.
const read = (file) => readFileSync(resolve(root, file), 'utf8')
const json = (file) => JSON.parse(read(file))
const effects = json('data/gear-effects.json')
const tables = json('data/fight-tables.json')
const acceptance = json('data/fish-acceptance.json')
const names = json('catalogue/gear-guide-names.json')
const suffixes = { en: '', th: '.th', ja: '.ja' }
const cards = { en: cardsEn, th: cardsTh, ja: cardsJa }
const allCards = (locale) => cards[locale].groups.flatMap((group) => group.cards)
const card = (locale, id) => allCards(locale).find((entry) => entry.id === id)
const tokens = (text, kind) =>
  [...text.matchAll(new RegExp(`\\{\\{(?:name|yen):${kind}:(\\d+)\\}\\}`, 'g'))].map((m) => +m[1])
const fishTokens = (text) => [...text.matchAll(/\{\{fish:(\d+)\}\}/g)].map((m) => +m[1])
const passing = (list) =>
  Object.fromEntries(
    list.map((row) => [parseInt(row.id_hex, 16), new Set(row.fish_ids_passing_mask_gate)]),
  )

checkNavigation()
for (const [locale, suffix] of Object.entries(suffixes)) checkPage(locale, suffix)
checkNames()
checkSitemap()
checkNumbers()
checkHookLists()
checkNamedTackle()
checkCoverage()
checkFlyLock()
checkKits()

console.log(
  'Gear guide PASS: EN/TH/JA pages render with navigation, home-intro link and visitor statistics; card numbers match the measured data; every fish has a working kit finder result in every language.',
)

function checkNavigation() {
  const pages = ['index', 'maps', 'shops', 'quests', 'item', 'fish', 'fight-sim', 'gear-guide']
  for (const [, suffix] of Object.entries(suffixes)) {
    const files = [
      ...pages.map((name) => `catalogue/${name}${suffix}.html`),
      `research/index${suffix}.html`,
    ]
    for (const file of files) {
      const html = read(file)
      const links = html.match(/data-compendium-destination="6"[^>]*>/g) ?? []
      assert.equal(links.length, 1, `${file}: exactly one gear guide link in the main navigation`)
      const prefix = file.startsWith('research/') ? '../catalogue/' : ''
      assert(links[0].includes(`href="${prefix}gear-guide${suffix}.html"`), `${file}: ${links[0]}`)
      const at = (destination) =>
        html.search(new RegExp(`data-compendium-destination="${destination}"`))
      assert(at(0) < at(6) && at(6) < at(1), `${file}: gear guide follows the item catalogue`)
    }
    const home = read(`catalogue/index${suffix}.html`)
    assert(
      new RegExp(`class="quick-guide-link" href="gear-guide${suffix}\\.html"`).test(home),
      `catalogue/index${suffix}.html: link in the home intro`,
    )
  }
}

function checkPage(locale, suffix) {
  const file = `catalogue/gear-guide${suffix}.html`
  const html = read(file)
  assert(html.includes(`<html lang="${locale}" data-locale="${locale}">`), `${file}: locale`)
  assert.equal(html.split(goatCounterScript()).length, 2, `${file}: visitor statistics once`)
  for (const id of ['steps', 'finder', 'cards', 'gg-fish', 'gg-results', 'gg-facts', 'gg-status'])
    assert(html.includes(`id="${id}"`), `${file}: missing #${id}`)
  assert.equal((html.match(/<li class="gg-step">/g) ?? []).length, 3, `${file}: three steps`)
  assert.equal((html.match(/<article class="gg-card"/g) ?? []).length, allCards(locale).length)
  assert.equal(allCards(locale).length, 14, `${locale}: one card per item kind`)
  assert.equal((html.match(/<h4>/g) ?? []).length, 28, `${file}: choose and avoid on every card`)
  assert(/<details id="how-we-know"/.test(html), `${file}: collapsed evidence note`)
  assert(!/<details id="how-we-know"[^>]* open/.test(html), `${file}: evidence must start closed`)
  for (const doc of ['gear-effects', 'fight-model', 'fish-acceptance-research'])
    assert(html.includes(`blob/main/docs/${doc}.md`), `${file}: link to ${doc}.md`)
  assert(/gear-guide\.js\?v=[0-9a-f]{16}/.test(html), `${file}: script version`)
  assert(!/undefined|NaN|\[object|\{\{/.test(html), `${file}: placeholder text leaked`)
  const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ')
  assert(!/0x[0-9a-f]{2,}|\$[0-9a-f]{4}\b|\b[0-9a-f]{2}:[0-9a-f]{4}\b/i.test(text), `${file}: hex`)
  if (locale === 'en')
    assert(!/\b(selector|mask|profile|branch)\b/i.test(text), `${file}: engine words in text`)
  for (const [other, otherSuffix] of Object.entries(suffixes))
    assert(
      html
        .replace(/\s+/g, ' ')
        .includes(
          `hreflang="${other}" href="https://polaminggkub-debug.github.io/kawa-no-nushi-tsuri-2-research/catalogue/gear-guide${otherSuffix}.html"`,
        ),
      `${file}: alternate ${other}`,
    )
  for (const doc of html.matchAll(/blob\/main\/(docs\/[a-z-]+\.md)/g))
    assert(existsSync(resolve(root, doc[1])), `${file}: ${doc[1]} does not exist`)
}

function checkNames() {
  const counts = { fish: 72, rod: 21, hook: 13, bait: 23, lure: 81, fly: 64 }
  for (const [kind, count] of Object.entries(counts)) {
    assert.equal(Object.keys(names[kind]).length, count, `names: ${kind}`)
    for (const record of Object.values(names[kind]))
      for (const locale of Object.keys(suffixes)) assert(record[locale], `names: ${kind} ${locale}`)
  }
  for (const route of Object.values(effects.routes)) assert(names.float_weight[route.id].th)
  for (const record of Object.values(names.fly))
    for (const name of Object.values(record)) assert(!/\s[0-9A-F]{2}$/.test(name), `id in ${name}`)
}

function checkSitemap() {
  const sitemap = read('sitemap.xml')
  for (const suffix of Object.values(suffixes))
    assert(sitemap.includes(`/catalogue/gear-guide${suffix}.html</loc>`), `sitemap: ${suffix}`)
}

// Numbers quoted in the steps and cards.
function checkNumbers() {
  const fish = Object.values(effects.fish)
  const count = (method) => fish.filter((entry) => entry.methods[method]).length
  assert.deepEqual([count('float'), count('lure'), count('fly')], [72, 38, 33])
  const needs = fish.map((entry) => entry.methods.float.need)
  assert.equal(needs.filter((need) => need <= 3).length, 38, 'any float rod suits 38 fish')
  assert.equal(needs.filter((need) => need === 24).length, 15, '15 fish need reach 24')
  assert.equal(needs.filter((need) => need <= 12).length, 47, 'reach 12 covers 47 fish')
  const eel = effects.fish[59].methods.float.sim
  const lostShare = (reach) => (eel.reach[reach][2] / effects.sample.starts) * 100
  assert(Math.round(lostShare(12)) === 85 && Math.round(lostShare(24)) === 14, 'eel reach figures')
  const yamame = effects.fish[3].methods.float.sim.curve
  assert.equal(yamame[3][0], 400, 'Yamame lands every time at start 3')
  assert(yamame[7][0] / 4 > 5 && yamame[7][0] / 4 < 15, 'Yamame at start 7 lands 6 to 14 %')
  checkStartCurve()
  const shop = effects.items
  assert.deepEqual([shop.rod[9].yen, shop.rod[9].reach, shop.rod[9].areas], [200, 12, [4, 5]])
  assert.deepEqual([shop.hook[9].yen, shop.hook[9].areas], [10, [2, 3]])
  assert.deepEqual(effects.routes.float, { id: 2, yen: 10, areas: [2, 4, 5] })
  assert.deepEqual(effects.routes.casting, { id: 10, yen: 30, areas: [5, 6] })
  const never = Object.entries(shop.rod).filter(([, rod]) => rod.yen == null)
  assert.deepEqual(
    never.map(([id]) => +id),
    [2, 6, 11, 17],
    'never-sold rods',
  )
  const special = Object.entries(shop.rod).filter(([, rod]) => rod.special?.length)
  assert.deepEqual(
    special.map(([id, rod]) => [+id, ...rod.special]),
    [
      [1, 5],
      [8, 5],
      [13, 4],
      [16, 6],
    ],
  )
  const others = Object.values(effects.fish).filter((entry) => entry.methods.float.need === 24)
  assert.equal(others.length, 15)
  const rod21Only = Object.entries(effects.fish).filter(([, entry]) => {
    const groups = entry.methods.float.slots.rod
    const group = (rod) => groups.findIndex((row) => row[1].includes(rod))
    return entry.methods.float.need === 24 && group(8) !== group(21)
  })
  assert.deepEqual(
    rod21Only.map(([id]) => +id),
    [7],
    'rod 21 beats rod 8 only for fish 7',
  )
}

// "Start 0, 1 or 3 almost every time, 7 about 6 in 10, 15 almost everything gets away."
function checkStartCurve() {
  const shares = {}
  for (const entry of Object.values(effects.fish))
    for (const method of ['float', 'casting']) {
      const curve = entry.methods[method]?.sim?.curve
      if (!curve || Math.max(...Object.values(curve).map((row) => row[0])) < 360) continue
      for (const [start, row] of Object.entries(curve)) (shares[start] ||= []).push(row[0] / 4)
    }
  const good = (start) => shares[start].filter((value) => value >= 90).length / shares[start].length
  const median = (start) => [...shares[start]].sort((a, b) => a - b)[shares[start].length >> 1]
  assert(good(0) === 1 && good(1) === 1 && good(3) >= 0.9, 'starts 0, 1, 3 land almost always')
  assert(good(7) > 0.55 && good(7) < 0.7, 'start 7 works for about 6 in 10')
  assert(median(15) < 3, 'start 15: almost everything gets away (about 1 in 70)')
}

// Hook lists by size class come from the selectors in the ROM tables.
function checkHookLists() {
  const bySelector = (selector) =>
    tables.hook.filter((hook) => hook.selector === selector).map((h) => h.id)
  const small = bySelector(0),
    medium = bySelector(1),
    big = bySelector(2)
  assert.deepEqual(
    [small, medium, big],
    [
      [7, 8, 11],
      [2, 5, 6, 9, 12, 13],
      [1, 3, 4],
    ],
  )
  for (const locale of Object.keys(suffixes)) {
    const hooks = card(locale, 'hook')
    const order = tokens(hooks.choose[1], 'hook')
    const seen = order.filter((id, index) => order.indexOf(id) === index)
    assert.deepEqual(seen.slice(0, 3).sort(), [...small].sort(), `${locale}: small hooks`)
    assert.deepEqual(
      seen.slice(3, 9).sort((a, b) => a - b),
      medium,
      `${locale}: medium hooks`,
    )
    assert.deepEqual(
      seen.slice(9).sort((a, b) => a - b),
      big,
      `${locale}: big hooks`,
    )
  }
}

// Every "named for the fish" claim matches the fish-match column of the ROM tables.
function checkNamedTackle() {
  const match = (kind, id) => tables[kind].find((row) => row.id === id).fishMatch
  for (const locale of Object.keys(suffixes)) {
    const named = card(locale, 'hook').choose[0]
    const found = [...named.matchAll(/\{\{(name:hook|fish):(\d+)\}\}/g)].map((m) => [m[1], +m[2]])
    assert.equal(found.length % 2, 0)
    for (let i = 0; i < found.length; i += 2) {
      const [hook, fish] =
        found[i][0] === 'name:hook' ? [found[i], found[i + 1]] : [found[i + 1], found[i]]
      assert.equal(
        match('hook', hook[1]),
        fish[1],
        `${locale}: hook ${hook[1]} is named for ${fish[1]}`,
      )
    }
    const baitText = card(locale, 'bait').matters
    const baits = new Set(tokens(baitText, 'bait'))
    const matched = tables.bait.filter((row) => row.fishMatch && row.id !== 23).map((row) => row.id)
    assert.deepEqual(
      [...baits].sort((a, b) => a - b),
      matched,
      `${locale}: named baits`,
    )
    for (const fish of fishTokens(baitText))
      assert(
        matched.some((id) => match('bait', id) === fish),
        `${locale}: bait fish ${fish}`,
      )
  }
}

// Which fish each bait, lure and fly passes (fish-acceptance.json, hex fish ids).
function checkCoverage() {
  const baits = passing(acceptance.baits),
    lures = passing(acceptance.lures)
  const flies = passing(acceptance.fly_bodies)
  assert(
    [...baits[9]].every((fish) => baits[18].has(fish)),
    'roe fish are all on the small-fish list',
  )
  assert.deepEqual([baits[1].size, baits[7].size, baits[8].size, baits[18].size], [44, 33, 33, 32])
  const union = (...sets) => new Set(sets.flatMap((set) => [...set]))
  for (const pair of [
    [23, 35],
    [46, 35],
  ])
    assert.equal(union(...pair.map((id) => lures[id])).size, 38)
  assert.equal(flies[43].size, 33, 'wet bodies take 33 fish')
  assert.equal(flies[62].size, 17, 'dry bodies take 17 fish')
  assert(
    [...flies[62]].every((fish) => flies[43].has(fish)),
    'dry fish are wet fish too',
  )
  assert.deepEqual(
    [23, 35, 46].map((id) => effects.items.lure[id].yen),
    [20, 30, 25],
  )
  const counts = { 2: 38, 1: 37, 0: 6 }
  const selectors = Object.values(effects.items.lure).map((lure) => lure.sel)
  for (const [selector, count] of Object.entries(counts))
    assert.equal(
      selectors.filter((value) => value === +selector).length,
      count,
      'lure size classes',
    )
}

// The hidden fly lock of a fresh save: body class 1, wing class 2.
function checkFlyLock() {
  const [mayfly, caddisWet, caddisDry] = [1, 43, 62]
  assert.equal(
    liveBundles(effects, mayfly).length,
    0,
    'the 5 yen Mayfly wet never bites on a fresh save',
  )
  assert(liveBundles(effects, caddisWet).length && liveBundles(effects, caddisDry).length)
  assert.equal(effects.items.fly[caddisWet].bundles[0][2], 15)
  assert.equal(effects.items.fly[caddisDry].bundles[0][2], 5)
  const set = [1, 43, 2].map((id) => effects.items.fly[id].bundles[0])
  assert.equal(
    set.reduce((sum, bundle) => sum + bundle[2], 0),
    30,
    'the three-fly set costs 30 yen',
  )
  for (let body = 0; body < 4; body++)
    for (let wing = 0; wing < 4; wing++) {
      const works = [1, 43, 2].filter((id, index) => id % 4 !== body && set[index][3] % 4 !== wing)
      assert(works.length >= 1, `the three-fly set survives the lock pair ${body}/${wing}`)
    }
}

function context(locale) {
  const nodes = {}
  return { locale, text: copy[locale], effects, names, $: (id) => (nodes[id] ||= {}) }
}

// Every fish gets kits in every language, with prices that add up and a simulator link that opens.
function checkKits() {
  const eel = planFish(effects, '59')[0].kits[0]
  assert.deepEqual([eel.kit.rod, eel.kit.hook, eel.kit.bait, eel.kit.yen], [8, 4, 18, 1555])
  assert.equal(Math.round(eel.stats.caught * 10) / 10, 11.5)
  const yamame = planFish(effects, '3')[0].kits[0]
  assert.deepEqual([yamame.kit.yen, yamame.stats.caught, yamame.range], [215, 100, [6, 6]])
  for (const fishId of Object.keys(effects.fish)) {
    const plans = planFish(effects, fishId)
    assert.equal(plans[0].method, 'float', `fish ${fishId}: float first`)
    for (const plan of plans)
      for (const entry of plan.kits) {
        const sum = entry.rows.reduce((total, row) => total + row.yen, 0)
        assert.equal(sum, entry.kit.yen, `fish ${fishId} ${plan.method}: kit price adds up`)
        if (plan.method === 'fly')
          assert(liveBundles(effects, entry.kit.fly).length, `fish ${fishId}: working fly`)
      }
    for (const locale of Object.keys(suffixes)) {
      const html = renderPlans(context(locale), fishId, plans)
      assert(!/undefined|NaN|\[object/.test(html), `${locale} fish ${fishId}: placeholder text`)
      assert(html.includes(names.rod[plans[0].kits[0].kit.rod][locale].replace(/&/g, '&amp;')))
      for (const [, query] of html.matchAll(/fight-sim[^"]*\.html\?([^"]*)"/g)) {
        const params = new URLSearchParams(query)
        for (const kind of ['rod', 'hook', 'bait'])
          assert(
            tables[kind].some((row) => row.id === +params.get(kind)),
            `sim link ${kind}`,
          )
      }
    }
  }
}
