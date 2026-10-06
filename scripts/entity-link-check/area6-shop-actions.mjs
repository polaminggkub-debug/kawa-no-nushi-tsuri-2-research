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
    invalid: 'พิกัดบางรายการอยู่นอกแผนที่ที่ใช้ได้',
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
    disabled: ['stage-select', 'category-select', 'item-search', 'clear-filters'].includes(id),
    dataset: {},
    open: false,
    checked: false,
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    listeners: {},
    addEventListener(name, callback) {
      this.listeners[name] = callback
    },
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
      disabled: true,
    }),
  )
  for (const id of ['stage-select', 'category-select', 'item-search', 'clear-filters']) node(id)
  const retry = node('shop-retry')
  node('page-status').querySelector = (selector) =>
    selector === '[data-shop-retry]' ? retry : null
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

async function renderShop(lang, place, entrance = '', injectOutOfBounds = false, fetcher) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const query = new URLSearchParams({ stage: '6', place })
  if (entrance) query.set('entrance', entrance)
  const url = new URL(
    `https://example.test/kawa-no-nushi-tsuri-2-research/catalogue/shops${suffix}.html?${query}#location-section`,
  )
  const selectedLocations = structuredClone(locations)
  if (injectOutOfBounds) addOutOfBoundsFixture(selectedLocations)
  return renderShopAt(url, lang, fetcher, selectedLocations)
}

async function renderShopAt(url, lang, fetcher, selectedLocations = locations) {
  const { document, nodes, radios } = makeDocument(lang, url.searchParams.get('place'))
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
    history: {
      replaceState(_state, _title, nextUrl) {
        url.href = new URL(nextUrl, url).href
      },
    },
    URL,
    URLSearchParams,
    console,
    setTimeout,
    clearTimeout,
    fetch:
      fetcher ||
      (async (request) => ({
        ok: true,
        json: async () => payloadFor(String(request), selectedLocations),
      })),
  }
  vm.runInNewContext(instrumented, context)
  await new Promise((resolve) => setImmediate(resolve))
  return {
    html: nodes.get('location-visuals')?.innerHTML || '',
    nodes,
    radios,
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

async function checkFishRouteCategoryDefaults() {
  const lang = 'en'
  for (const [query, category, fish, route] of [
    ['stage=5&fish=10&route=float', 'bait', '10', 'float'],
    ['stage=5&fish=10&route=sinker', 'bait', '10', 'sinker'],
    ['stage=5&fish=10&route=lure', 'lure', '10', 'lure'],
    ['stage=5&fish=10&route=fly', 'fly', '10', 'fly'],
    ['stage=5&fish=10', 'bait', '10', ''],
    ['category=all&stage=5&fish=10&route=lure', 'all', '10', 'lure'],
    ['category=float_weight&stage=5&fish=10&route=lure', 'float_weight', '10', 'lure'],
    ['category=general_tool&id=05&stage=5&fish=10&route=float', 'general_tool', '10', 'float'],
    ['id=05&stage=5&fish=10&route=float', 'all', '10', 'float'],
    ['stage=5&fish=10&route=float&q=17', 'all', '10', 'float'],
    ['stage=5&fish=10&route=fly&maker=1', 'all', '10', 'fly'],
    ['stage=5&fish=FF&route=lure', 'all', 'FF', 'lure'],
  ]) {
    const page = await renderShopAt(
      new URL(`${articlePath(lang)}?${query}`, 'https://example.test'),
      lang,
    )
    const values = { category, fish, stage: '5', route: route || null }
    assert.equal(page.nodes.get('category-select').value, category)
    for (const [key, value] of Object.entries(values))
      assert.equal(page.url.searchParams.get(key), value)
  }
  await checkManualAllClearReload(lang)
}

async function checkManualAllClearReload(lang) {
  for (const action of ['manual', 'clear']) {
    const page = await renderShopAt(
      new URL(`${articlePath(lang)}?stage=5&fish=10&route=float`, 'https://example.test'),
      lang,
    )
    if (action === 'manual') {
      page.nodes.get('category-select').value = 'all'
      page.nodes.get('category-select').listeners.change()
    } else page.nodes.get('clear-filters').listeners.click()
    for (const current of [page, await renderShopAt(new URL(page.url.href), lang)]) {
      assert.equal(current.nodes.get('category-select').value, 'all')
      for (const [key, value] of Object.entries({
        category: 'all',
        fish: '10',
        stage: '5',
        route: 'float',
      }))
        assert.equal(current.url.searchParams.get(key), value)
      for (const locale of ['en', 'th', 'ja'])
        assert.equal(
          new URL(current.nodes.get(`language-${locale}`).href, current.url).searchParams.get(
            'category',
          ),
          'all',
        )
    }
  }
}

function shopUrl(lang, includeReturn = true) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const params = new URLSearchParams({ stage: '6', place: 'town', fish: '06', route: 'sinker' })
  if (includeReturn) params.set('return', `index${suffix}.html?category=bait&fish=06#catalogue`)
  return new URL(`${articlePath(lang)}?${params}#regular-stock`, 'https://example.test')
}

async function deferredShop(lang, includeReturn = true) {
  const url = shopUrl(lang, includeReturn)
  let reloadCalls = 0
  url.reload = () => reloadCalls++
  const requests = []
  const page = await renderShopAt(url, lang, (request) => {
    let resolve
    const promise = new Promise((done) => (resolve = done))
    requests.push({ request: String(request), promise, resolve })
    return promise
  })
  assert.equal(requests.length, 4, `Shop data requests missing/${lang}`)
  return { page, requests, url, reloadCalls: () => reloadCalls }
}

async function resolveShopData(requests, failures = []) {
  for (const entry of requests) {
    const filename = entry.request.split('/').at(-1)
    entry.resolve({
      ok: !failures.includes(filename),
      json: async () => payloadFor(entry.request, locations),
    })
  }
  await Promise.all(requests.map((entry) => entry.promise))
  await new Promise((resolve) => setImmediate(resolve))
}

function assertShopControlState(page, disabled, context) {
  const controls = ['stage-select', 'category-select', 'item-search', 'clear-filters']
  for (const id of controls) {
    const control = page.nodes.get(id)
    assert(control, `${context}: missing ${id}; nodes=${[...page.nodes.keys()].join(',')}`)
    assert.equal(control.disabled, disabled, `${context}/${id}`)
  }
  for (const radio of page.radios)
    assert.equal(radio.disabled, disabled, `${context}/${radio.value}`)
}

function checkStaticShopControls(lang) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const html = fs.readFileSync(path.join(root, `src/pages/shops/ui/shops${suffix}.html`), 'utf8')
  for (const id of ['stage-select', 'category-select', 'item-search', 'clear-filters']) {
    const control = html.match(new RegExp(`<[^>]+\\bid="${id}"[^>]*>`))?.[0] || ''
    assert.match(control, /\sdisabled(?:\s|=|>)/, `${lang}: ${id} starts enabled`)
  }
  for (const value of ['outdoor', 'town'])
    assert.match(
      html,
      new RegExp(`<input[^>]*name="place"[^>]*value="${value}"[^>]*\\sdisabled`),
      `${lang}: ${value} location toggle starts enabled`,
    )
}

function checkShopRetry(page, expectedBack) {
  const status = page.nodes.get('page-status')
  assert(status.innerHTML.includes('data-shop-retry'), 'Missing actionable shop retry button')
  const retry = page.nodes.get('shop-retry')
  assert.equal(typeof retry.listeners.click, 'function', 'Shop retry button is not bound')
  const href = status.innerHTML.match(/data-shop-retry[\s\S]*?<a[^>]*href="([^"]+)"/)?.[1]
  assert(href, 'Shop error state has no safe return action')
  assert.equal(new URL(unescapeHtml(href), page.url).href, expectedBack)
  retry.listeners.click()
}

async function checkShopLoading(lang) {
  const pending = await deferredShop(lang)
  assertShopControlState(pending.page, true, `${lang}: pending`)
  await resolveShopData(pending.requests)
  assertShopControlState(pending.page, false, `${lang}: ready`)
  assert.match(pending.page.nodes.get('shop-results').innerHTML, /data-offer=/)

  for (const [failedFile, includeReturn] of [
    ['gallery-data.json', true],
    ['shop-stock-rom.json', false],
  ]) {
    const failed = await deferredShop(lang, includeReturn)
    await resolveShopData(failed.requests, [failedFile])
    assertShopControlState(failed.page, true, `${lang}: ${failedFile} failed`)
    assert.equal(failed.page.nodes.get('shop-results').innerHTML, '')
    const fallback = includeReturn
      ? new URL(
          `index${lang === 'en' ? '' : `.${lang}`}.html?category=bait&fish=06#catalogue`,
          failed.url,
        ).href
      : new URL(`index${lang === 'en' ? '' : `.${lang}`}.html`, failed.url).href
    const originalUrl = failed.url.href
    checkShopRetry(failed.page, fallback)
    assert.equal(failed.reloadCalls(), 1, `${lang}: retry did not reload the exact shop URL`)
    assert.equal(failed.url.href, originalUrl, `${lang}: retry changed query or hash`)
  }

  for (const optionalFile of ['rom-map-manifest.json', 'shop-locations-rom.json']) {
    const partial = await deferredShop(lang)
    await resolveShopData(partial.requests, [optionalFile])
    assertShopControlState(partial.page, false, `${lang}: optional ${optionalFile} failed`)
    assert.match(partial.page.nodes.get('shop-results').innerHTML, /data-offer=/)
  }
  if (lang === 'en') await checkShopBindingFailure()
}

async function checkShopBindingFailure() {
  const failed = await deferredShop('en', false)
  failed.page.nodes.get('item-search').addEventListener = () => {
    throw new Error('simulated event binding failure')
  }
  await resolveShopData(failed.requests)
  assertShopControlState(failed.page, true, 'en: binding failed')
  const originalUrl = failed.url.href
  checkShopRetry(failed.page, new URL(`index.html`, failed.url).href)
  assert.equal(failed.reloadCalls(), 1)
  assert.equal(failed.url.href, originalUrl)
}

async function main() {
  checkDataEvidence()
  for (const lang of ['en', 'ja', 'th']) {
    checkStaticShopControls(lang)
    await checkLocale(lang)
    await checkShopLoading(lang)
  }
  await checkFishRouteCategoryDefaults()
  console.log(
    'PASS: Area 6 shop routes plus localized load recovery, disabled controls, and stock-only fallback across EN/JA/TH.',
  )
}

await main()
