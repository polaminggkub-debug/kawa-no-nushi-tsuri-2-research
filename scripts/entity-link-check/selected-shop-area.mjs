import assert from 'node:assert/strict'
import { copy_en } from '../../src/pages/item/copy_en.js'
import { copy_ja } from '../../src/pages/item/copy_ja.js'
import { copy_th } from '../../src/pages/item/copy_th.js'
import { flyAssemblies, shopCondition, shopSection } from '../../src/pages/item/purchases.js'
import { data, locations, render, unescapeHtml } from './shared.mjs'

const copyByLocale = { en: copy_en, th: copy_th, ja: copy_ja }
const areaBadges = { en: 'Selected area', th: 'ด่านที่เลือก', ja: '選択中のエリア' }
const labels = { en: 'Area', th: 'ด่าน', ja: 'エリア' }
const contextualNoStock = {
  en: {
    ordinary:
      'No offers for this item are recorded in Area 6 or any other area in the checked ROM data.',
    fly: 'No ready-made fly sets are recorded in Area 6 or any other area in the checked ROM data.',
  },
  ja: {
    ordinary: '確認したROMデータにはエリア6にも他エリアにもこの道具の店頭在庫の記録がありません。',
    fly: '確認したROMデータにはエリア6にも他エリアにも店売り毛バリセットの記録がありません。',
  },
  th: {
    ordinary: 'ไม่พบรายการขายไอเท็มนี้ที่บันทึกไว้ในด่าน 6 หรือด่านอื่นจากข้อมูล ROM ที่ตรวจ',
    fly: 'ไม่พบชุดฟลายสำเร็จรูปที่บันทึกไว้ในด่าน 6 หรือด่านอื่นจากข้อมูล ROM ที่ตรวจ',
  },
}

function countExact(text, phrase) {
  return text.split(phrase).length - 1
}

async function checkNoStockDetails(lang, category, id, isFly) {
  for (const stage of ['', '6']) {
    const query = new URLSearchParams({ category, id })
    if (stage) query.set('stage', stage)
    const { html } = await render('item', lang, query)
    const decoded = unescapeHtml(html)
    const purchase = decoded.match(
      /<section\b(?=[^>]*class="[^"]*purchase-section")[\s\S]*?<\/section>/,
    )?.[0]
    assert(purchase, `Missing purchase section ${category}:${id}/${lang}/${stage}`)
    const message = stage
      ? contextualNoStock[lang][isFly ? 'fly' : 'ordinary']
      : copyByLocale[lang].noShop
    assert.equal(countExact(purchase, message), 1)
    assert.equal(countExact(decoded, message), 1)
    if (stage) {
      assert.equal(countExact(purchase, copyByLocale[lang].noShop), 0)
      assert.equal((purchase.match(/data-selected-area-missing="true"/g) || []).length, 1)
    } else {
      assert.equal((purchase.match(/data-selected-area-missing="true"/g) || []).length, 0)
    }
    const evidence = decoded.match(/<details class="evidence">[\s\S]*?<\/details>/)?.[0]
    assert(evidence && /<code>0x[0-9A-F]+<\/code>/.test(evidence))
    assert(/<code>[0-9A-F]{2}(?: [0-9A-F]{2}){6,}<\/code>/.test(evidence))
    if (!isFly) assert(evidence.includes('0x02A801'))
    if (isFly) {
      assert(decoded.includes('id="fly-menu-position"'))
      assert(
        decoded.includes(
          'https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/fly-maker-access-research.md',
        ),
      )
      assert(evidence.includes('0x02AAD6'))
    }
  }
}

function makeContext(lang, selectedStage, item) {
  const ctx = {
    lang,
    selectedStage,
    category: item.category,
    requestedId: item.id,
    copy: copyByLocale[lang],
    esc: (value) =>
      String(value ?? '').replace(
        /[&<>"']/g,
        (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
      ),
    stageName: (stage) => copyByLocale[lang].shopArea(stage),
    stageButton: (stage) =>
      `<a data-test-map-link="${stage}" href="shops.${lang}.html?stage=${stage}">${labels[lang]} ${stage}</a>`,
    componentLink: (part) =>
      `<a data-test-component="${part.category}:${part.id}" href="item.${lang}.html?category=${part.category}&amp;id=${part.id}">${part.id}</a>`,
    detailItemLink: (part) => `item.${lang}.html?category=${part.category}&id=${part.id}`,
    fishProfileLink: (id) => `fish.${lang}.html?id=${id}`,
  }
  ctx.flyAssemblies = (part, allItems) => flyAssemblies(ctx, part, allItems)
  ctx.shopCondition = (part, offer, fishLocations) => shopCondition(ctx, part, offer, fishLocations)
  return ctx
}

function renderPurchase(lang, selectedStage, item, allItems = data.items) {
  const ctx = makeContext(lang, selectedStage, item)
  return unescapeHtml(shopSection(ctx, item, allItems, locations))
}

function purchaseCards(html) {
  return [
    ...html.matchAll(/<article\b(?=[^>]*data-purchase-stage="(\d+)")[^>]*>[\s\S]*?<\/article>/g),
  ].map((match) => ({ stage: Number(match[1]), html: match[0] }))
}

function checkSelection(html, selectedStage, expectedOrder, lang) {
  const cards = purchaseCards(html)
  assert.deepEqual(
    cards.map((card) => card.stage),
    expectedOrder,
  )
  const selected =
    Number.isInteger(Number(selectedStage)) &&
    Number(selectedStage) >= 1 &&
    Number(selectedStage) <= 6
  const selectedCount = selected
    ? expectedOrder.filter((stage) => stage === Number(selectedStage)).length
    : 0
  assert.equal((html.match(/data-selected-area-offer="true"/g) || []).length, selectedCount)
  assert.equal(
    (html.match(/data-selected-area-missing="true"/g) || []).length,
    selected && !selectedCount ? 1 : 0,
  )
  assert.equal((html.match(/data-selected-area-badge/g) || []).length, selectedCount)
  for (const selectedCard of cards
    .filter((card) => card.stage === Number(selectedStage))
    .slice(0, selectedCount)) {
    assert(selectedCard.html.includes('data-selected-area-offer="true"'))
    assert(selectedCard.html.includes('data-selected-area-badge'))
    assert(selectedCard.html.includes(areaBadges[lang]))
  }
  if (selected && !selectedCount) {
    assert(html.includes(copyByLocale[lang].shopArea(Number(selectedStage))))
    assert(!/can't buy|cannot buy|unavailable|購入できない|買えない|ซื้อไม่ได้/i.test(html))
  }
  return cards
}

function expectedFlyRows(item, allItems = data.items) {
  const rows = []
  for (const body of allItems.filter((entry) => entry.category === 'fly')) {
    for (const offer of body.playerUse?.shops || []) {
      const bundle = offer.bundle
      const matches =
        bundle &&
        ((item.category === 'fly' && bundle.body === item.id) ||
          (item.category === 'fly_wing' && bundle.wing === item.id) ||
          (item.category === 'fly_tail' && bundle.tail === item.id))
      if (matches) rows.push({ stage: Number(offer.stage), bundle, body })
    }
  }
  const unique = new Map(
    rows.map((row) => [
      [row.stage, row.bundle.body, row.bundle.wing, row.bundle.tail, row.bundle.shopPriceYen].join(
        '|',
      ),
      row,
    ]),
  )
  return [...unique.values()].sort(
    (a, b) => a.stage - b.stage || a.bundle.shopPriceYen - b.bundle.shopPriceYen,
  )
}

function selectedFirst(rows, selectedStage) {
  return [...rows].sort(
    (a, b) =>
      (a.stage === Number(selectedStage) ? -1 : 0) - (b.stage === Number(selectedStage) ? -1 : 0) ||
      a.stage - b.stage ||
      a.bundle.shopPriceYen - b.bundle.shopPriceYen,
  )
}

function flySignature(card) {
  const parts = [...card.html.matchAll(/data-test-component="([^"]+)"/g)].map((match) => match[1])
  return `${card.stage}|${card.html.match(/Complete set|ราคาทั้งชุด|セット価格/)?.[0] || ''}|${parts.join(',')}`
}

function checkFly(lang, item, selectedStage, expectedRows, allItems = data.items) {
  const html = renderPurchase(lang, selectedStage, item, allItems)
  const cards = checkSelection(
    html,
    selectedStage,
    selectedFirst(expectedRows, selectedStage).map((row) => row.stage),
    lang,
  )
  assert.equal(cards.length, expectedRows.length, 'Keep every ROM-recorded fly offer')
  for (const [index, row] of selectedFirst(expectedRows, selectedStage).entries()) {
    const card = cards[index].html
    assert(card.includes(copyByLocale[lang].price(row.bundle.shopPriceYen)))
    assert(card.includes(`data-test-map-link="${row.stage}"`))
    for (const [category, id] of [
      ['fly', row.bundle.body],
      ['fly_wing', row.bundle.wing],
      ['fly_tail', row.bundle.tail],
    ]) {
      if (id && id !== '00') assert(card.includes(`data-test-component="${category}:${id}"`))
    }
  }
  const expected = selectedFirst(expectedRows, selectedStage).map((row) => {
    const parts = [
      ['fly', row.bundle.body],
      ['fly_wing', row.bundle.wing],
      ['fly_tail', row.bundle.tail],
    ]
      .filter(([, id]) => id && id !== '00')
      .map(([category, id]) => `${category}:${id}`)
    return `${row.stage}|${copyByLocale[lang].completePrice}|${parts.join(',')}`
  })
  assert.deepEqual(cards.map(flySignature), expected)
}

const itemBy = (category, id) =>
  data.items.find((item) => item.category === category && item.id === id)
const ordinary = itemBy('lure', '0A')
const ordinaryStages = [
  ...new Set(ordinary.playerUse.shops.map((offer) => Number(offer.stage))),
].sort((a, b) => a - b)
const flyWithArea6AndTie = itemBy('fly_wing', '52')
const flyRows = expectedFlyRows(flyWithArea6AndTie)
assert(flyRows.some((row) => row.stage === 3 && row.bundle.shopPriceYen === 30))
assert(flyRows.some((row) => row.stage === 6 && row.bundle.shopPriceYen === 50))
const equalPriceFly = itemBy('fly_wing', '50')
const equalPriceRows = expectedFlyRows(equalPriceFly)
assert.deepEqual(
  equalPriceRows.map((row) => row.bundle.shopPriceYen),
  [20, 20],
)
const tiedFlyRows = [
  ...data.items,
  ...['Z1', 'Z2'].map((id) => ({
    ...itemBy('fly', '4B'),
    id,
    playerUse: {
      ...itemBy('fly', '4B').playerUse,
      shops: [{ stage: 4, bundle: { body: id, wing: '50', tail: '00', shopPriceYen: 20 } }],
    },
  })),
]
const tiedRows = expectedFlyRows(equalPriceFly, tiedFlyRows)
assert.deepEqual(
  tiedRows.map((row) => [row.stage, row.body.id]),
  [
    [1, '4B'],
    [4, '4B'],
    [4, 'Z1'],
    [4, 'Z2'],
  ],
)

for (const lang of ['th', 'en', 'ja']) {
  for (const selectedStage of [4, 6, 7, 3.5, 0, 'not-a-stage']) {
    const html = renderPurchase(lang, selectedStage, ordinary)
    const expected =
      selectedStage === 4 ? [4, ...ordinaryStages.filter((stage) => stage !== 4)] : ordinaryStages
    const cards = checkSelection(html, selectedStage, expected, lang)
    assert.equal(cards.length, ordinaryStages.length)
    assert(html.includes(copyByLocale[lang].price(ordinary.priceYen)))
    for (const card of cards) {
      assert(card.html.includes(copyByLocale[lang].price(ordinary.priceYen)))
      assert(card.html.includes(`data-test-map-link="${card.stage}"`))
    }
  }
  for (const selectedStage of [6, 5, 7, 3.5, 0, 'not-a-stage']) {
    checkFly(lang, flyWithArea6AndTie, selectedStage, flyRows)
  }
  checkFly(lang, equalPriceFly, 4, equalPriceRows)
  checkFly(lang, equalPriceFly, 4, tiedRows, tiedFlyRows)

  const decoy = itemBy('bait', '17')
  for (const [selectedStage, exists] of [
    [3, true],
    [4, false],
    [7, false],
  ]) {
    const html = renderPurchase(lang, selectedStage, decoy)
    const cards = checkSelection(html, selectedStage, [3], lang)
    assert.equal(cards.length, 1)
    assert(html.includes(copyByLocale[lang].price(decoy.priceYen)))
    assert(html.includes(copyByLocale[lang].ayuOffer))
    assert(html.includes(`data-test-map-link="3"`))
    assert(html.includes(`href="fish.${lang}.html?id=38"`))
    assert.equal(exists, selectedStage === 3)
  }

  const noStock = renderPurchase(lang, 6, itemBy('rod', '02'))
  assert.deepEqual(checkSelection(noStock, 6, [], lang), [])
  await checkNoStockDetails(lang, 'rod', '02', false)
  await checkNoStockDetails(lang, 'fly_wing', '0D', true)
}

console.log(
  'PASS: selected-area shop ordering and badges cover ordinary items, conditional bait, and ready-made flies in TH/EN/JA; missing/invalid areas keep recorded offers, prices, conditions, bundle links, and map links.',
)
