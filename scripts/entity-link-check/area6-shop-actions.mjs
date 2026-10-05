import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const root = path.resolve(fileURLToPath(new URL('../..', import.meta.url)))
const gallery = readJson('catalogue/gallery-data.json')
const stock = readJson('data/shop-stock-rom.json')
const maps = readJson('catalogue/maps/rom-map-manifest.json')
const locations = readJson('data/shop-locations-rom.json')
const copy = {
  en: {
    regular: 'Regular equipment shop',
    entrance: 'Show this entrance on the field map ↗',
    linked:
      'Enter through entrance 2 (arrival at 7, 29). An original-ROM probe opened this seller from that arrival point; the route from other outdoor positions is not verified.',
    invalid: 'Some decoded positions fall outside the valid map bounds.',
    walkTitle: 'Walk to the Area 6 regular shop',
    walkStep: 'Use town entrance 2 at field X 2, Y 49; arrival is town X 7, Y 29.',
  },
  th: {
    regular: 'ร้านอุปกรณ์ตกปลาทั่วไป',
    entrance: 'ดูทางเข้านี้บนแผนที่ด่าน ↗',
    linked:
      'เข้าเมืองทางเข้า 2 (จุดมาถึงช่อง 7, 29) แล้วตามหมุดร้าน; การทดสอบบน ROM เปิดเมนูจากจุดมาถึงนี้ได้ แต่ยังไม่ยืนยันวิธีเดินมาถึงประตูจากทุกตำแหน่งกลางแจ้ง',
    invalid: 'พิกัดบางรายการอยู่นอกขอบเขตแผนที่ที่ใช้ได้',
    walkTitle: 'เดินไปถึงร้านปกติด่าน 6',
    walkStep: 'ใช้ทางเข้าเมืองหมายเลข 2 ที่แผนที่ด่าน 6: X 2, Y 49 จะถึงห้องเมืองที่ X 7, Y 29',
  },
  ja: {
    regular: '通常の釣り道具店',
    entrance: 'この入口をフィールドマップで見る ↗',
    linked:
      '入口2から町に入り（到着タイル 7, 29）、店のマーカーへ進みます。オリジナルROMのテストで、この到着地点から店のメニューが開くことを確認しました。屋外の他の場所から入口までの道順は確認していません。',
    invalid: '解析された座標の一部が有効なマップ範囲外',
    walkTitle: 'エリア6の通常店への歩き方',
    walkStep: 'フィールドX2、Y49の町入口2から入り、町のX7、Y29へ到着します。',
  },
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
}

function makeNode(id) {
  return {
    id,
    innerHTML: '',
    textContent: '',
    value: '',
    dataset: {},
    open: false,
    checked: false,
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    addEventListener() {},
    setAttribute() {},
    removeAttribute() {},
    appendChild() {},
    replaceChildren() {},
    insertAdjacentHTML() {},
    querySelectorAll() {
      return []
    },
  }
}

function makeDocument(lang, place) {
  const nodes = new Map()
  const node = (id) => {
    if (!nodes.has(id)) nodes.set(id, makeNode(id))
    return nodes.get(id)
  }
  const radios = ['outdoor', 'town'].map((value) =>
    Object.assign(makeNode(value), {
      value,
      checked: value === (place === 'area' ? 'outdoor' : 'town'),
    }),
  )
  const document = {
    documentElement: { dataset: { locale: lang } },
    querySelector(selector) {
      if (selector === 'input[name="place"]:checked') return radios.find((radio) => radio.checked)
      return null
    },
    querySelectorAll(selector) {
      if (selector === 'input[name="place"]') return radios
      return []
    },
    getElementById: node,
    createElement: (tag) => makeNode(tag),
  }
  return { document, nodes, radios }
}

function payloadFor(url, injectedLocations) {
  if (url.includes('gallery-data.json')) return gallery
  if (url.includes('shop-stock-rom.json')) return stock
  if (url.includes('rom-map-manifest.json')) return maps
  if (url.includes('shop-locations-rom.json')) return injectedLocations
  throw new Error(`Unexpected shops bundle fetch: ${url}`)
}

async function renderShop(lang, place, entrance = '', injectOutOfBounds = false) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const query = new URLSearchParams({ stage: '6', place })
  if (entrance) query.set('entrance', entrance)
  const url = new URL(
    `https://example.test/kawa-no-nushi-tsuri-2-research/catalogue/shops${suffix}.html?${query}#location-section`,
  )
  const { document, nodes } = makeDocument(lang, place)
  const selectedLocations = structuredClone(locations)
  if (injectOutOfBounds) addOutOfBoundsFixture(selectedLocations)
  const source = fs.readFileSync(path.join(root, 'catalogue/shops.js'), 'utf8')
  assert(/\}\)\(\);\s*$/.test(source), 'Expected generated shops bundle IIFE')
  const instrumented = source.replace(
    /\}\)\(\);\s*$/,
    'globalThis.__shopRuntime=runtimeContext;\n})();',
  )
  const context = {
    document,
    location: url,
    window: { location: url },
    history: { replaceState() {} },
    URL,
    URLSearchParams,
    console,
    setTimeout,
    clearTimeout,
    fetch: async (request) => ({
      ok: true,
      json: async () => payloadFor(String(request), selectedLocations),
    }),
  }
  vm.runInNewContext(instrumented, context)
  await new Promise((resolve) => setImmediate(resolve))
  return {
    html: nodes.get('location-visuals')?.innerHTML || '',
    summary: nodes.get('location-summary')?.textContent || '',
    url,
  }
}

function addOutOfBoundsFixture(data) {
  const area = data.areas.find((entry) => Number(entry.outdoorArea) === 6)
  area.interactions.push({ interactionSlotHex: 'FE', kind: 'other', townTile: { x: 99, y: 99 } })
}

function regularShopArticle(html, locale) {
  const marker = `<span class="shop-kind">${locale.regular}</span>`
  const index = html.indexOf(marker)
  assert(index >= 0, `Area 6 regular shop card missing: ${locale.regular}`)
  const start = html.lastIndexOf('<article class="location-card">', index)
  const end = html.indexOf('</article>', index) + '</article>'.length
  return html.slice(start, end)
}

function checkRegularShopAction(article, lang, locale) {
  assert(article.includes(locale.linked), `Missing verified entrance context/${lang}`)
  assert(!article.includes('walking route from an entrance has not been verified'))
  assert(!article.includes('入口からの徒歩ルートは未確認'))
  assert(!article.includes('ยังไม่ได้ยืนยันเส้นทางเดินจากทางเข้า'))
  assert(article.includes('data-area6-walk'))
  assert(article.includes(locale.walkTitle))
  assert(article.includes(locale.walkStep))
  const link = article.match(/<a class="route-button" href="([^"]+)">([^<]+)<\/a>/)
  assert(link, `Missing entrance-map action/${lang}`)
  assert.equal(unescapeHtml(link[2]), locale.entrance)
  const target = new URL(unescapeHtml(link[1]), `https://example.test${articlePath(lang)}`)
  assert.equal(target.searchParams.get('stage'), '6')
  assert.equal(target.searchParams.get('place'), 'area')
  assert.equal(target.searchParams.get('entrance'), '1')
}

function articlePath(lang) {
  return `/kawa-no-nushi-tsuri-2-research/catalogue/shops${lang === 'en' ? '' : `.${lang}`}.html`
}

function unescapeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function checkDataEvidence() {
  const area = locations.areas.find((entry) => Number(entry.outdoorArea) === 6)
  const shop = area.interactions.find((entry) => entry.interactionSlotHex === '08')
  const access = area.verifiedAccess.find((entry) => entry.interactionSlotHex === '08')
  assert.equal(shop.kind, 'regular-shop')
  assert.deepEqual([shop.townTile.x, shop.townTile.y], [8, 23])
  assert.equal(access.entranceOrdinal, 1)
  assert.deepEqual([access.probe.townArrival.x, access.probe.townArrival.y], [7, 29])
  assert.equal(access.probe.observedMode, 2)
  assert.equal(access.probe.observedSlotHex, '08')
  assert.match(access.probe.runtimeEvidence, /33 controller-only steps/)
  assert.equal(area.entrances.find((entry) => entry.ordinal === 1).fieldTile.x, 2)
  assert.equal(area.entrances.find((entry) => entry.ordinal === 1).fieldTile.y, 49)
}

async function checkLocale(lang) {
  const locale = copy[lang]
  const town = await renderShop(lang, 'town')
  const article = regularShopArticle(town.html, locale)
  checkRegularShopAction(article, lang, locale)
  const focused = await renderShop(lang, 'area', '1')
  assert(
    !focused.summary.includes(locale.invalid),
    `Focused valid entrance reports invalid coordinates/${lang}`,
  )
  assert(
    focused.html.includes('data-x="2" data-y="49"'),
    `Focused map omitted ROM entrance tile/${lang}`,
  )
  const injected = await renderShop(lang, 'area', '1', true)
  assert(
    injected.summary.includes(locale.invalid),
    `Injected out-of-bounds point did not warn/${lang}`,
  )
}

async function main() {
  checkDataEvidence()
  for (const lang of ['en', 'ja', 'th']) await checkLocale(lang)
  console.log(
    'PASS: Area 6 slot 08 route and localized shop action; focused valid entrance stays clean and an injected out-of-bounds point warns.',
  )
}

await main()
