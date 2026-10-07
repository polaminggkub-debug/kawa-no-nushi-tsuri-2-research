#!/usr/bin/env node
'use strict'

const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const assert = require('node:assert/strict')

const root = path.resolve(__dirname, '..')
const catalogue = readJson('catalogue/gallery-data.json')
const stock = readJson('data/shop-stock-rom.json')
const toolLocations = readJson('data/tool-use-locations.json')
const research = readText('docs/shop-stock-research.md')
const questResearch = readText('docs/quest-tool-use-research.md')
const itemBundle = readText('catalogue/item-detail.js')
const locales = ['en', 'th', 'ja']

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
}

function readText(file) {
  return fs.readFileSync(path.join(root, file), 'utf8')
}

function itemRecord(category, id) {
  return catalogue.items.find((item) => item.category === category && item.id === id)
}

function conditionalOffers() {
  return (stock.areas || []).flatMap((area) =>
    (area.items || [])
      .filter((item) => item.condition)
      .map((item) => ({ ...item, stage: area.stage })),
  )
}

function assertConditionalStock() {
  const offers = conditionalOffers()
  assert.equal(
    offers.length,
    1,
    'Update this focused check when more conditional offers are decoded',
  )
  assert.equal(offers[0].category, 'bait')
  assert.equal(offers[0].id, '17')
  assert.equal(offers[0].stage, 3)
  assert.match(offers[0].condition, /sell at least one Ayu before buying/)
  assert.match(research, /each stored fish with species ID `38` \(Ayu\) increments that counter/)
  assert.match(
    research,
    /fills its stack to nine and subtracts nine from the counter, floored at zero/,
  )

  const bait = itemRecord('bait', '17')
  assert(bait, 'Conditional ROM stock item is missing from the player catalogue')
  assert.equal(bait.playerUse.shops.length, 1)
  assert.equal(bait.playerUse.shops[0].stage, 3)
  assert.equal(bait.playerUse.shops[0].condition, offers[0].condition)
}

function assertMilkCanoeData() {
  const bottle = itemRecord('general_tool', '0F')
  const milk = itemRecord('general_tool', '10')
  const canoe = itemRecord('general_tool', '02')
  assert(bottle && milk && canoe, 'Milk bottle, milk, or canoe record is missing')
  assert.equal(milk.playerUse.shops.length, 0)
  assert.equal(canoe.playerUse.shops.length, 0)
  assert.equal(conditionalOffers().filter((item) => item.id === '02').length, 0)
  assert.match(milk.playerUse.summary.en, /restores? current HP to maximum/)
  assert.match(milk.playerUse.summary.en, /give fresh milk to the canoe maker/)
  assert.match(canoe.playerUse.summary.en, /No shop sells a canoe/)
  assert.match(canoe.playerUse.summary.en, /the trade uses up the milk/)

  const canoeSpot = toolLocations.items['02'].find((location) => location.tileX === 28)
  const milkSpot = toolLocations.items['10'].find((location) => location.tileX === 28)
  const bottleChest = toolLocations.items['0F'].find((location) => location.kind === 'town_chest')
  const cow = toolLocations.items['0F'].find((location) => location.tileY === 103)
  assert.equal(canoeSpot.stage, 3)
  assert.equal(canoeSpot.tileY, 39)
  assert.match(canoeSpot.name.en, /trade milk for a canoe/)
  assert.equal(milkSpot.stage, 3)
  assert.equal(milkSpot.tileY, 39)
  assert.equal(bottleChest.tileX, 6)
  assert.equal(bottleChest.tileY, 4)
  assert.equal(cow.tileX, 6)
  assert.equal(cow.tileY, 103)
  assert(questResearch.includes('checks for milk and grants canoe'))
  assert(questResearch.includes('replaces the bottle slot with milk'))
}

function mockNode(nodes, id) {
  if (!nodes[id]) {
    nodes[id] = {
      innerHTML: '',
      textContent: '',
      href: '',
      dataset: {},
      setAttribute() {},
      removeAttribute() {},
      getAttribute() {
        return null
      },
      addEventListener() {},
      scrollIntoView() {},
    }
  }
  return nodes[id]
}

function languageLinks(nodes) {
  return locales.map((locale) => ({
    ...mockNode(nodes, `language-${locale}`),
    getAttribute(name) {
      return name === 'hreflang' ? locale : null
    },
  }))
}

function vmContext(locale, url, nodes, errors) {
  const document = {
    documentElement: { dataset: { locale } },
    getElementById: (id) => mockNode(nodes, id),
    querySelectorAll: () => languageLinks(nodes),
    title: '',
  }
  const location = {
    href: url.href,
    origin: url.origin,
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
  }
  const pageConsole = Object.create(console)
  pageConsole.error = (...args) => errors.push(args)
  return {
    document,
    location,
    window: { location },
    URL,
    URLSearchParams,
    console: pageConsole,
    fetch: async () => ({ ok: true, json: async () => catalogue }),
  }
}

async function renderItem(locale, category, id) {
  const page = `item${locale === 'en' ? '' : `.${locale}`}.html`
  const url = new URL(`https://example.test/kawa-no-nushi-tsuri-2-research/catalogue/${page}`)
  url.searchParams.set('category', category)
  url.searchParams.set('id', id)
  const nodes = Object.create(null)
  const errors = []
  vm.runInNewContext(itemBundle, vmContext(locale, url, nodes, errors))
  await new Promise((resolve) => setImmediate(resolve))
  return { html: mockNode(nodes, 'detail-root').innerHTML, nodes, url, errors }
}

function assertRenderedItem(html, locale, id) {
  assert.match(
    html,
    /class="[^"]*\bdetail-hero\b[^"]*"/,
    `Item page did not render item ${id} in ${locale}`,
  )
}

function visiblePage(html) {
  return html.split('<details class="evidence"')[0]
}

function routeButtons(html, pageUrl) {
  return [...html.matchAll(/<a class="route-button" href="([^"]+)"/g)].map(
    (match) => new URL(match[1].replace(/&amp;/g, '&'), pageUrl),
  )
}

function assertShopLinks(html, pageUrl, locale) {
  const routes = routeButtons(html, pageUrl)
  const map = routes.find((route) => /\/catalogue\/shops(?:\.th|\.ja)?\.html$/.test(route.pathname))
  const fish = routes.find((route) => /\/catalogue\/fish(?:\.th|\.ja)?\.html$/.test(route.pathname))
  assert(fish, `Missing Ayu next-action link in ${locale}`)
  assert.equal(fish.searchParams.get('id'), '38')
  assert(map, `Area shop link missing in ${locale}`)
  assert.equal(map.searchParams.get('stage'), '3')
  assert.equal(map.searchParams.get('place'), 'town')
  assert.equal(map.searchParams.get('category'), 'bait')
  assert.equal(map.searchParams.get('id'), '17')
  const returnPage = new URL(map.searchParams.get('return'), pageUrl)
  assert.equal(returnPage.searchParams.get('id'), '17')
}

function assertMilkCanoePage(html, locale, id) {
  const visible = visiblePage(html)
  const expectations = {
    10: {
      en: ['Canoe maker: trade milk for a canoe', 'X 28, Y 39', 'restores current HP to maximum'],
      th: ['คนทำเรือ: นำนมมาแลกเรือแคนู', 'X 28, Y 39', 'ฟื้นจนเต็มตามค่าสูงสุด'],
      ja: ['カヌー職人：牛乳とカヌーを交換', 'X 28, Y 39', '最大HPまで回復'],
    },
    '02': {
      en: ['No shop sells a canoe', 'X 28, Y 39', '14 steps'],
      th: ['ไม่มีร้านขายแคนู', 'X 28, Y 39', 'ขยับ 14 ก้าว'],
      ja: ['カヌーを売る店はない', 'X 28, Y 39', '14歩進む'],
    },
  }
  for (const phrase of expectations[id][locale])
    assert(visible.includes(phrase), `Missing milk/canoe action in ${locale}: ${phrase}`)
  assert(visible.includes('id="use-locations"'), `Milk/canoe map section missing in ${locale}`)
}

async function checkShopPage(locale) {
  const { html, url, errors } = await renderItem(locale, 'bait', '17')
  assertRenderedItem(html, locale, '17')
  assert.deepEqual(errors, [], `Item bundle logged an error in ${locale}`)
  const visible = visiblePage(html)
  const expected = {
    en: [
      'How to unlock this offer:',
      'Sell at least one Ayu from your keepnet',
      'Area 3',
      'sets the stack to 9',
      'subtracts 9 from the sold-Ayu counter',
      'Find this shop',
      'town entrance, seller location',
    ],
    th: [
      'วิธีปลดล็อกรายการนี้:',
      'ขายปลาอายุจากข้องอย่างน้อย 1 ตัว',
      'ด่าน 3',
      'จำนวนในช่องจะเต็มเป็น 9 ชิ้น',
      'จำนวนปลาอายุที่ขายไปจะลดลง 9',
      'ดูร้านที่ขายของนี้',
      'ทางเข้าเมือง ตำแหน่งคนขาย',
    ],
    ja: [
      'この品を買えるようにするには：',
      'びくからアユを1匹以上売る',
      'エリア3',
      '所持数が9個になり',
      '売却アユ数のカウンターが9減ります',
      '販売店を見る',
      '町への入口、店員の位置',
    ],
  }
  for (const phrase of expected[locale])
    assert(visible.includes(phrase), `Missing localized shop instruction in ${locale}: ${phrase}`)
  assert(!visible.includes('7F:1E84'), 'Raw counter address leaked into player guidance')
  assert(/¥45|45 เยน|45円/.test(visible), `Shop price missing in ${locale}`)
  assertShopLinks(visible, url, locale)
}

async function checkMilkCanoePages(locale) {
  for (const id of ['10', '02']) {
    const { html, errors } = await renderItem(locale, 'general_tool', id)
    assertRenderedItem(html, locale, id)
    assert.deepEqual(errors, [], `Milk/canoe item bundle logged an error for ${id} in ${locale}`)
    assertMilkCanoePage(html, locale, id)
  }
}

async function main() {
  assertConditionalStock()
  assertMilkCanoeData()
  for (const locale of locales) {
    await checkShopPage(locale)
    await checkMilkCanoePages(locale)
  }
  console.log(
    'PASS: conditional bait stock has a localized unlock action, purchase effect, and seller path; the milk bottle, cow refill, and milk-for-canoe route remain visible in English, Thai, and Japanese.',
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
