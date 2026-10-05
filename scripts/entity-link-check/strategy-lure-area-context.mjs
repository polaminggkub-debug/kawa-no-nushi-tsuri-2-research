import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { data, root, render, unescapeHtml } from './shared.mjs'

const stock = JSON.parse(fs.readFileSync(path.join(root, 'data/shop-stock-rom.json'), 'utf8'))
const expected = [
  ['1', ['2E', '23'], 55, '1'],
  ['2', ['17', '24'], 55, '2'],
  ['3', ['17', '24'], 55, '3'],
  ['4', ['17', '23'], 50, '4'],
  ['5', ['17', '23'], 50, '4'],
  ['6', ['17', '23'], 50, '4'],
]

for (const locale of ['en', 'th', 'ja']) {
  const suffix = locale === 'en' ? '' : `.${locale}`
  const html = fs.readFileSync(path.join(root, `research/index${suffix}.html`), 'utf8')
  checkStrategyLureAreaHtml(html, locale)
  checkRejectionProbes(html, locale)
  await checkKitNavigation(html, locale)
}
console.log(
  'PASS: six distinct strategy lure rows preserve exact purchase area, ROM stock, pair prices, and localized topic returns; malformed contexts are rejected.',
)

export function checkStrategyLureAreaHtml(html, locale) {
  const rows = [...html.matchAll(/<tr\b[^>]*data-lure-kit-area="([^"]+)"[^>]*>([\s\S]*?)<\/tr>/g)]
  assert.deepEqual(
    rows.map((row) => row[1]),
    expected.map((row) => row[0]),
    `${locale}: need six distinct area rows`,
  )
  for (const [index, row] of rows.entries()) checkRow(row[2], expected[index], locale)
}

function checkRow(html, [stage, ids, price, purchaseStage], locale) {
  assert.equal(html.match(/<th>(.*?)<\/th>/)?.[1], stage, `${locale}/${stage}: wrong area heading`)
  const hrefs = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((match) => match[1])
  assert.equal(hrefs.length, 2, `${locale}/${stage}: link both pair members exactly once`)
  const targets = hrefs.map((href) => checkItemLink(href, purchaseStage, locale))
  assert.deepEqual(
    targets.map((target) => target.searchParams.get('id')),
    ids,
  )
  assert.equal(
    ids.reduce((sum, id) => sum + lure(id).priceYen, 0),
    price,
  )
  for (const id of ids) assertStock(id, purchaseStage)
  assertCoverage(ids)
  if (Number(stage) <= 4) {
    assert(
      html.includes(locale === 'ja' ? `${price}円` : `¥${price}`),
      `${locale}/${stage}: price missing`,
    )
  } else {
    checkNoLocalPair(html, stage, locale)
  }
}

function checkItemLink(href, stage, locale) {
  const suffix = locale === 'en' ? '' : `.${locale}`
  const base = new URL(`https://example.test/research/index${suffix}.html`)
  const target = new URL(unescapeHtml(href), base)
  assert.equal(target.pathname, `/catalogue/item${suffix}.html`)
  assert.equal(target.searchParams.get('category'), 'lure')
  assert.equal(target.searchParams.get('stage'), stage, `${locale}: item lost its purchase area`)
  assert.equal(new URL(target.searchParams.get('return'), target).href, `${base.href}#lure-kit`)
  return target
}

function checkNoLocalPair(html, stage, locale) {
  const owned = { en: 'Keep a full pair you own', th: 'พกคู่ที่มี', ja: '所持中のセットを使う' }
  const seller = { en: 'Area 4', th: 'ด่าน 4', ja: 'エリア4' }
  assert(html.includes(owned[locale]), `${locale}/${stage}: carry-owned action missing`)
  assert(html.includes(seller[locale]), `${locale}/${stage}: fallback purchase area missing`)
  assert(
    /no complete|ไม่มีคู่ครบ|一式は揃いません/i.test(html),
    `${locale}/${stage}: local stock limit missing`,
  )
  const localIds = stock.areas
    .find((area) => String(area.stage) === stage)
    .items.filter((item) => item.category === 'lure')
    .map((item) => item.id)
  for (const first of localIds) {
    for (const second of localIds) {
      assert.notEqual(
        covered([first, second]).size,
        38,
        `Area ${stage}: stock now covers a full pair`,
      )
    }
  }
}

function assertStock(id, stage) {
  const area = stock.areas.find((candidate) => String(candidate.stage) === stage)
  assert(
    area.items.some((item) => item.category === 'lure' && item.id === id),
    `ROM stock lacks lure ${id} in area ${stage}`,
  )
  assert(lure(id).playerUse.shops.some((shop) => String(shop.stage) === stage && !shop.condition))
}

function lure(id) {
  const item = data.items.find((candidate) => candidate.category === 'lure' && candidate.id === id)
  assert(item, `Unknown lure ${id}`)
  return item
}

function covered(ids) {
  return new Set(ids.flatMap((id) => lure(id).playerUse.fishIds))
}

function assertCoverage(ids) {
  const full = new Set(
    data.items
      .filter((item) => item.category === 'lure')
      .flatMap((item) => item.playerUse?.fishIds || []),
  )
  assert.equal(full.size, 38)
  assert.deepEqual([...covered(ids)].sort(), [...full].sort())
}

function checkRejectionProbes(html, locale) {
  const row = html.match(/<tr\b[^>]*data-lure-kit-area="3"[^>]*>[\s\S]*?<\/tr>/)?.[0]
  assert(row, `${locale}: area 3 rejection fixture missing`)
  const rejected = (changed) =>
    assert.throws(() => checkStrategyLureAreaHtml(changed, locale), { code: 'ERR_ASSERTION' })
  rejected(html.replace(row, row.replaceAll('stage=3', 'stage=1')))
  rejected(html.replace(row, row.replaceAll('&amp;stage=3', '')))
  rejected(html.replace(row, row.replaceAll('%23lure-kit', '%23rod-choice')))
  rejected(html.replace(row, row.replace('data-lure-kit-area="3"', 'data-lure-kit-area="2,3"')))
  const fallback = html.match(/<tr\b[^>]*data-lure-kit-area="6"[^>]*>[\s\S]*?<\/tr>/)?.[0]
  assert(fallback)
  rejected(html.replace(fallback, fallback.replaceAll('stage=4', 'stage=6')))
}

async function checkKitNavigation(html, locale) {
  const standalone = await render(
    'item',
    locale,
    new URLSearchParams({ category: 'lure', id: '17', stage: '2' }),
  )
  assert(
    !standalone.html.includes('data-kit-item-comparison'),
    `${locale}: ordinary item advice was folded without kit intent`,
  )
  const suffix = locale === 'en' ? '' : `.${locale}`
  const base = new URL(`https://example.test/research/index${suffix}.html`)
  const rows = [...html.matchAll(/<tr\b[^>]*data-lure-kit-area="([^"]+)"[^>]*>([\s\S]*?)<\/tr>/g)]
  for (const row of rows) {
    for (const [, href] of row[2].matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      const target = new URL(unescapeHtml(href), base)
      const result = await render('item', locale, target.searchParams)
      const kit = target.searchParams.get('kit')
      const panel = result.html.match(
        /<section\b[^>]*data-lure-kit-context="([^"]+)"[^>]*>[\s\S]*?<\/section>/,
      )?.[0]
      assert(
        panel &&
          panel
            .match(/data-lure-kit-context="([^"]+)"/)?.[1]
            .split('+')
            .sort()
            .join('+') === kit,
        `${locale}/${row[1]}: pair intent lost after item click`,
      )
      assert(result.html.includes('<details class="detail-section" data-kit-item-comparison>'))
      const partnerHref = panel.match(/data-lure-kit-partner="[^"]+"[^>]*href="([^"]+)"/)?.[1]
      assert(partnerHref, `${locale}/${row[1]}: partner action missing`)
      const partner = new URL(unescapeHtml(partnerHref), result.url)
      assert.equal(partner.searchParams.get('kit').split('+').sort().join('+'), kit)
      assert.equal(partner.searchParams.get('stage'), target.searchParams.get('stage'))
      assert.notEqual(partner.searchParams.get('id'), target.searchParams.get('id'))
      assert.equal(partner.searchParams.has('fish'), false)
      const back = new URL(partner.searchParams.get('return'), result.url)
      assert.equal(back.searchParams.get('return'), target.searchParams.get('return'))
    }
  }
}
