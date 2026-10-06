import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { data, render, root, unescapeHtml } from './shared.mjs'
import { checkFlyMakerAccessEvidence, evidence, menuItems } from './fly-maker-access-evidence.mjs'

const maps = readJson('catalogue/maps/rom-map-manifest.json')
const stock = readJson('data/shop-stock-rom.json')
const locations = readJson('data/shop-locations-rom.json')
const rigRoutes = ['float', 'sinker', 'lure', 'fly']
const makerNames = {
  en: {
    title: (stage) => `Fly maker · Area ${stage} town`,
    family: ['Mayfly, Caddis and Terrestrial flies', 'Diptera, Stonefly and Terrestrial flies'],
  },
  ja: {
    title: (stage) => `毛バリ職人 · エリア${stage}の町`,
    family: ['メイフライ・カディス・テレストリアル', 'ディプテラ・ストーンフライ・テレストリアル'],
  },
  th: {
    title: (stage) => `คนทำฟลาย · เมืองด่าน ${stage}`,
    family: ['เมย์ฟลาย แคดดิส และแมลงบก', 'ดิปเทอรา สโตนฟลาย และแมลงบก'],
  },
}
const accessTitles = {
  en: (stage) => `Make this at the Area ${stage} town fly maker`,
  ja: (stage) => `エリア${stage}の町の毛バリ職人で作成する`,
  th: (stage) => `ไปประกอบที่เมืองด่าน ${stage}`,
}
const chooseFamily = {
  en: 'choose this family',
  ja: 'この系統を選んで',
  th: 'เลือกตระกูลนี้',
}
const familyNames = {
  en: {
    メイフライ: 'Mayfly',
    カディス: 'Caddis',
    テレストリアル: 'Terrestrial',
    ディプテラ: 'Diptera',
    ストーンフライ: 'Stonefly',
  },
  ja: {
    メイフライ: 'メイフライ',
    カディス: 'カディス',
    テレストリアル: 'テレストリアル',
    ディプテラ: 'ディプテラ',
    ストーンフライ: 'ストーンフライ',
  },
  th: {
    メイフライ: 'เมย์ฟลาย',
    カディス: 'แคดดิส',
    テレストリアル: 'แมลงบก',
    ディプテラ: 'ดิปเทอรา',
    ストーンフライ: 'สโตนฟลาย',
  },
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
}

function suffix(lang) {
  return lang === 'en' ? '' : `.${lang}`
}

function browseReturn(lang, stage, route) {
  const params = new URLSearchParams({
    category: 'flymaker',
    stage: String(stage),
    fish: '06',
    route,
  })
  params.set('map', '1')
  return `index${suffix(lang)}.html?${params}#catalogue`
}

function detailUrlParams(item, lang, route, selectedStage = item.flyMakerMenuChoice.access.stage) {
  const stage = String(selectedStage)
  return new URLSearchParams({
    category: item.category,
    id: item.id,
    stage,
    fish: '06',
    route,
    return: browseReturn(lang, stage, route),
  })
}

function accessAside(html, item, lang) {
  const marker = 'data-fly-maker-access'
  const start = html.indexOf(marker)
  assert(start >= 0, `Missing access action ${item.category}:${item.id}/${lang}`)
  const asideStart = html.lastIndexOf('<aside', start)
  const asideEnd = html.indexOf('</aside>', start) + '</aside>'.length
  return html.slice(asideStart, asideEnd)
}

function expectedMenuScope(item, lang) {
  const choice = item.flyMakerMenuChoice
  const family = familyNames[lang][choice.familyJa]
  if (choice.familyJa === 'メイフライ') {
    if (lang === 'ja') return `毛バリ作成で「${choice.familyJa}」を選択`
    if (lang === 'th') return `เลือก${family} (${choice.familyJa}) ตอนประกอบฟลาย`
    return `choose ${family} (${choice.familyJa}) at the fly maker`
  }
  if (lang === 'ja') return `「${choice.familyJa}」のフライを作成`
  if (lang === 'th') return `เลือก${family} (${choice.familyJa}) ตอนประกอบฟลาย`
  return `choose ${family} (${choice.familyJa}) at the fly maker`
}

function checkMenuScope(html, item, lang) {
  const marker = `data-fly-menu-position="${item.category}:${item.id}"`
  const start = html.indexOf(marker)
  assert(start >= 0, `Missing component menu section ${item.category}:${item.id}/${lang}`)
  const sectionStart = html.lastIndexOf('<section', start)
  const sectionEnd = html.indexOf('</section>', start) + '</section>'.length
  const section = html.slice(sectionStart, sectionEnd)
  const expected = expectedMenuScope(item, lang)
  assert(
    section.includes(expected),
    `Wrong family scope ${item.category}:${item.id}/${lang}: ${expected}`,
  )
}

function selectedAccess(item, stage) {
  return (
    item.flyMakerMenuChoice.availableAccess?.find((entry) => entry.stage === Number(stage)) ||
    item.flyMakerMenuChoice.access
  )
}

function checkDetailAction(item, lang, route, result) {
  const selectedStage = Number(result.url.searchParams.get('stage'))
  const access = selectedAccess(item, selectedStage)
  checkMenuScope(result.html, item, lang)
  const aside = accessAside(result.html, item, lang)
  assert(aside.includes(accessTitles[lang](access.stage)))
  assert(aside.includes(chooseFamily[lang]))
  assert(aside.includes(`X${access.makerTile.x},Y${access.makerTile.y}`))
  const href = aside.match(/data-fly-maker-location-link href="([^"]+)"/)?.[1]
  assert(href, `Missing location link ${item.category}:${item.id}/${lang}`)
  const target = new URL(unescapeHtml(href), result.url)
  assert(target.pathname.endsWith(`/shops${suffix(lang)}.html`))
  assert.deepEqual(
    ['stage', 'place', 'maker', 'entrance', 'fish', 'route'].map((key) =>
      target.searchParams.get(key),
    ),
    [String(access.stage), 'town', '1', '1', '06', route],
  )
  assert.equal(target.hash, '#fly-maker-location')
  checkReturnedDetail(target, result, item, lang, route, selectedStage)
  return target
}

function checkReturnedDetail(target, result, item, lang, route, selectedStage) {
  const returned = new URL(target.searchParams.get('return'), target)
  assert.equal(returned.pathname, result.url.pathname)
  assert.equal(returned.searchParams.get('category'), item.category)
  assert.equal(returned.searchParams.get('id'), item.id)
  assert.equal(returned.searchParams.get('stage'), String(selectedStage))
  assert.equal(returned.searchParams.get('fish'), '06')
  assert.equal(returned.searchParams.get('route'), route)
  assert.equal(returned.searchParams.get('return'), browseReturn(lang, selectedStage, route))
  assert.equal(returned.hash, result.url.hash)
}

async function checkAllDetailActions() {
  const shopTargets = new Map()
  for (const lang of ['en', 'ja', 'th']) {
    const items = menuItems()
    for (const [index, item] of items.entries()) {
      const route = rigRoutes[index % rigRoutes.length]
      const params = detailUrlParams(item, lang, route)
      const result = await render('item', lang, params)
      const target = checkDetailAction(item, lang, route, result)
      const key = `${lang}:${item.flyMakerMenuChoice.access.stage}`
      if (!shopTargets.has(key)) shopTargets.set(key, target)
    }
    assert(rigRoutes.every((route) => items.some((_, index) => rigRoutes[index % 4] === route)))
    await checkAreaSelection(lang, shopTargets)
  }
  return shopTargets
}

async function checkAreaSelection(lang, shopTargets) {
  const mayfly = menuItems().find((item) => item.rawFields['+0'] === 0)
  const terrestrial = menuItems().find((item) => item.rawFields['+0'] === 4)
  for (const [item, stage, route] of [
    [mayfly, 3, 'fly'],
    [terrestrial, 2, 'lure'],
  ]) {
    const result = await render('item', lang, detailUrlParams(item, lang, route, stage))
    const target = checkDetailAction(item, lang, route, result)
    assert.equal(target.searchParams.get('stage'), String(stage))
    shopTargets.set(`${lang}:${stage}`, target)
  }
}

function makeNode(id) {
  return {
    id,
    innerHTML: '',
    textContent: '',
    value: '',
    href: '',
    dataset: {},
    open: false,
    checked: false,
    addEventListener() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() {
      return null
    },
    scrollIntoView() {
      this.scrolled = true
    },
    appendChild() {},
    replaceChildren() {},
    insertAdjacentHTML() {},
  }
}

function shopDocument(lang, place) {
  const nodes = new Map()
  const node = (id) => {
    if (!nodes.has(id)) nodes.set(id, makeNode(id))
    return nodes.get(id)
  }
  const radios = ['area', 'town'].map((value) =>
    Object.assign(makeNode(value), { value, checked: value === place }),
  )
  return {
    nodes,
    document: {
      documentElement: { dataset: { locale: lang } },
      getElementById: node,
      querySelector(selector) {
        return selector === 'input[name="place"]:checked'
          ? radios.find((radio) => radio.checked)
          : null
      },
      querySelectorAll(selector) {
        return selector === 'input[name="place"]' ? radios : []
      },
      createElement: (tag) => makeNode(tag),
    },
  }
}

function shopPayload(url) {
  if (url.includes('gallery-data.json')) return data
  if (url.includes('shop-stock-rom.json')) return stock
  if (url.includes('rom-map-manifest.json')) return maps
  if (url.includes('shop-locations-rom.json')) return locations
  throw new Error(`Unexpected shops fetch: ${url}`)
}

async function renderShop(target) {
  const lang = target.pathname.endsWith('.th.html')
    ? 'th'
    : target.pathname.endsWith('.ja.html')
      ? 'ja'
      : 'en'
  const page = new URL(target.href)
  const { document, nodes } = shopDocument(
    lang,
    page.searchParams.get('place') === 'area' ? 'area' : 'town',
  )
  const source = fs.readFileSync(path.join(root, 'catalogue/shops.js'), 'utf8')
  assert(/\}\)\(\);\s*$/.test(source), 'Expected generated shops bundle IIFE')
  const instrumented = source.replace(
    /\}\)\(\);\s*$/,
    'globalThis.__shopRuntime=runtimeContext;\n})();',
  )
  const context = {
    document,
    location: page,
    window: { location: page, addEventListener() {} },
    history: { replaceState() {} },
    URL,
    URLSearchParams,
    console,
    setTimeout,
    clearTimeout,
    fetch: async (request) => ({ ok: true, json: async () => shopPayload(String(request)) }),
  }
  vm.runInNewContext(instrumented, context)
  await new Promise((resolve) => setImmediate(resolve))
  return { html: nodes.get('location-visuals')?.innerHTML || '', nodes, url: page, lang }
}

function mapCard(html, lang, access) {
  const start = html.indexOf('data-fly-maker-location')
  assert(start >= 0, `Missing maker map card/${lang}/Area ${access.stage}`)
  const end = html.indexOf('</div>', start)
  const card = html.slice(start, end)
  const family = makerNames[lang].family[(access.stage - 1) % 2]
  assert(card.includes(makerNames[lang].title(access.stage)))
  assert(
    card.includes(family),
    `Missing maker family ${lang}/Area ${access.stage}: ${family}; ${card}`,
  )
  const canvas = card.match(/<canvas\b[^>]*>/)?.[0]
  assert(canvas, `Missing coordinate canvas/${lang}/Area ${access.stage}`)
  const x = Number(canvas.match(/data-x="(\d+)"/)?.[1])
  const y = Number(canvas.match(/data-y="(\d+)"/)?.[1])
  const image = canvas.match(/data-image="([^"]+)"/)?.[1]
  assert.deepEqual([x, y], [access.makerTile.x, access.makerTile.y])
  assert(image?.endsWith(`rom-town-0${access.townMapId}.png`))
  return card
}

async function checkMakerMap(target) {
  const access = evidence.accessByStage[target.searchParams.get('stage')]
  const page = await renderShop(target)
  const card = mapCard(page.html, page.lang, access)
  assert.equal(page.nodes.get('shop-map-disclosure').open, true)
  const href = card.match(/data-maker-field-entrance href="([^"]+)"/)?.[1]
  assert(href, `Missing maker-to-entrance link/${page.lang}`)
  const field = new URL(unescapeHtml(href), page.url)
  assert.deepEqual(
    ['stage', 'place', 'maker', 'entrance'].map((key) => field.searchParams.get(key)),
    [String(access.stage), 'area', '1', '1'],
  )
  assert.equal(field.hash, '#location-section')
  assert.equal(field.searchParams.get('return'), target.searchParams.get('return'))
  const fieldPage = await renderShop(field)
  const expected = access.entrance.fieldTile
  assert(fieldPage.html.includes(`data-x="${expected.x}" data-y="${expected.y}"`))
  await checkTownReturn(fieldPage, access, target)
}

function pairedTownLink(html, lang) {
  const labels = {
    en: 'Show paired town arrival ↗',
    ja: '対応する町の到着地点を見る ↗',
    th: 'ดูจุดมาถึงในเมืองที่คู่กัน ↗',
  }
  const links = [...html.matchAll(/<a class="route-button" href="([^"]+)">([^<]+)<\/a>/g)]
  const link = links.find((entry) => unescapeHtml(entry[2]) === labels[lang])
  assert(link, `Missing paired town entrance link/${lang}`)
  return unescapeHtml(link[1])
}

async function checkTownReturn(fieldPage, access, origin) {
  const town = new URL(pairedTownLink(fieldPage.html, fieldPage.lang), fieldPage.url)
  assert.deepEqual(
    ['stage', 'place', 'maker', 'entrance', 'fish', 'route'].map((key) =>
      town.searchParams.get(key),
    ),
    [
      String(access.stage),
      'town',
      '1',
      '1',
      origin.searchParams.get('fish'),
      origin.searchParams.get('route'),
    ],
  )
  assert.equal(town.searchParams.get('return'), origin.searchParams.get('return'))
  const page = await renderShop(town)
  mapCard(page.html, fieldPage.lang, access)
}

async function checkMakerMaps(targets) {
  for (const lang of ['en', 'ja', 'th']) {
    for (const stage of [1, 2, 3]) await checkMakerMap(targets.get(`${lang}:${stage}`))
    const blocked = new URL(
      `https://example.test/kawa-no-nushi-tsuri-2-research/catalogue/shops${suffix(lang)}.html?stage=4&place=town#fly-maker-location`,
    )
    const page = await renderShop(blocked)
    assert(!page.html.includes('data-fly-maker-location'))
    assert(!page.html.includes(makerNames[lang].title(4)))
  }
}

checkFlyMakerAccessEvidence()
const targets = await checkAllDetailActions()
await checkMakerMaps(targets)
console.log(
  'PASS: original-ROM maker routes, 130 verified component links in three locales, all four rig contexts, map coordinates and return links.',
)
