import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { questNextActions as itemActions } from '../../src/pages/item/quest-next-actions.js'
import { questNextActions as cardActions } from '../../src/pages/equipment/quest-next-actions.js'

const root = path.resolve(fileURLToPath(new URL('../..', import.meta.url)))
const gallery = readJson('catalogue/gallery-data.json')
const fishLocations = readJson('catalogue/fish-locations.json').fish
const stock = readJson('data/shop-stock-rom.json')
const candle = getItem('12')
const fireworks = getItem('16')
const akamePoint = fishLocations['37']?.locations
  ?.find((location) => Number(location.stage) === 6)
  ?.points?.find((point) => point.x === 37 && point.y === 29)

assert(akamePoint, 'Candle clue must link to the separately decoded Area 6 Akame point')
assert.equal(
  candle.playerUse?.useLocations?.some((location) => location.tileX === 47),
  true,
)
assert.equal(fireworks.priceYen, 50)
assert(fireworks.playerUse?.shops?.some((offer) => Number(offer.stage) === 4))
assert(
  stock.areas
    .find((area) => Number(area.stage) === 4)
    ?.items.some((entry) => entry.category === 'general_tool' && entry.id === '16'),
  'The Area 4 fireworks shop link must point to a stock-table listing',
)

for (const lang of ['en', 'ja', 'th']) await checkLocale(lang)
console.log(
  'Quest next actions PASS: candle clue separates dialogue from spawn evidence; fireworks recovery links to recorded Area 4 stock.',
)

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
}

function getItem(id) {
  const item = gallery.items.find((entry) => entry.category === 'general_tool' && entry.id === id)
  assert(item, `Missing general tool ${id}`)
  return item
}

function escaped(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[char],
  )
}

function itemContext(lang) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const current = `/catalogue/item${suffix}.html?category=general_tool&id=12`
  return {
    lang,
    localePage: { en: 'item.html', th: 'item.th.html', ja: 'item.ja.html' },
    mapsPage: { en: 'maps.html', th: 'maps.th.html', ja: 'maps.ja.html' },
    esc: escaped,
    fishName: () => ({ en: 'Akame', ja: 'アカメ', th: 'อาคาเมะ' })[lang],
    currentLocalRoute: () => current,
    safeLocalRoute: (route) => route,
    fishProfileLink: (id) => `fish${suffix}.html?id=${id}&stage=6`,
  }
}

function cardContext(lang) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  return {
    lang,
    fishLocations,
    fishVisuals: gallery.fishVisuals,
    esc: escaped,
    sourceReturn: () => `index${suffix}.html?category=general_tool#catalogue`,
    detailFile: (page) => `${page}${suffix}.html`,
    fishHref: (id) => `fish${suffix}.html?id=${id}&stage=6`,
  }
}

function assertMapLink(html, suffix, returnNeedle) {
  const url = findLink(html, 'data-quest-fish-map', suffix)
  assert.equal(url.pathname, `/catalogue/maps${suffix}.html`)
  assert.equal(url.searchParams.get('stage'), '6')
  assert.equal(url.searchParams.get('fish'), '37')
  assert.equal(url.searchParams.get('section'), 's6-c2-r2')
  assert(url.searchParams.get('return')?.includes(returnNeedle))
}

function assertShopLink(html, suffix, returnNeedle) {
  const url = findLink(html, 'data-quest-fireworks-shop', suffix)
  assert.equal(url.pathname, `/catalogue/shops${suffix}.html`)
  assert.equal(url.searchParams.get('stage'), '4')
  assert.equal(url.searchParams.get('place'), 'town')
  assert.equal(url.searchParams.get('category'), 'general_tool')
  assert.equal(url.searchParams.get('id'), '16')
  assert(url.searchParams.get('return')?.includes(returnNeedle))
}

function findLink(html, marker, suffix) {
  const encoded = html.match(new RegExp(`${marker} href="([^"]+)"`))?.[1]
  assert(encoded, `Missing ${marker}`)
  const href = encoded.replace(/&amp;/g, '&')
  return new URL(href, `https://example.test/catalogue/item${suffix}.html`)
}

async function checkLocale(lang) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const itemCtx = itemContext(lang)
  const detailCandle = itemActions(itemCtx, candle, fishLocations)
  const detailFireworks = itemActions(itemCtx, fireworks, fishLocations)
  const cardCtx = cardContext(lang)
  const cardCandle = cardActions(cardCtx, candle)
  const cardFireworks = cardActions(cardCtx, fireworks)
  assertCandleCopy(detailCandle, cardCandle, lang)
  assertFireworksCopy(detailFireworks, cardFireworks, lang)
  assertMapLink(detailCandle, suffix, 'category=general_tool')
  assertMapLink(cardCandle, suffix, 'category=general_tool')
  assertShopLink(detailFireworks, suffix, 'category=general_tool')
  assertShopLink(cardFireworks, suffix, 'category=general_tool')
  assert(
    itemActions(itemCtx, { category: 'general_tool', id: '10' }, fishLocations).includes(
      'data-milk-canoe-choice',
    ),
  )
  assert.equal(cardActions(cardCtx, { category: 'general_tool', id: '10' }), '')
}

function assertCandleCopy(detail, card, lang) {
  const combined = detail + card
  assert(combined.includes('data-quest-next-action="candle-akame"'))
  assert(combined.includes('data-quest-fish-profile'))
  assert(combined.includes('37') && combined.includes('29'))
  const dialogue = {
    en: 'dialogue points northwest',
    ja: '台詞は北西を示します',
    th: 'บทพูดชี้ไปทางตะวันตกเฉียงเหนือ',
  }[lang]
  const independent = {
    en: 'separately decoded ROM spawn table',
    ja: '別に解析したROMの出現表',
    th: 'ตารางจุดเกิดปลาใน ROM แยกต่างหาก',
  }[lang]
  assert(combined.includes(dialogue))
  assert(combined.includes(independent))
}

function assertFireworksCopy(detail, card, lang) {
  const combined = detail + card
  assert(combined.includes('data-quest-next-action="fireworks-recovery"'))
  assert(combined.includes('¥50') || combined.includes('50円'))
  const limited = {
    en: 'unlimited repeat purchases are not verified',
    ja: '無制限に買い直せるかは未確認',
    th: 'ยังยืนยันไม่ได้ว่าซื้อซ้ำได้ไม่จำกัด',
  }[lang]
  assert(combined.includes(limited))
}
