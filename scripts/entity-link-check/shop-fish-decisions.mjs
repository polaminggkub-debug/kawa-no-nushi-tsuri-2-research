import assert from 'node:assert/strict'
import { data, unescapeHtml } from './shared.mjs'
import { shopCompatibility, shopFishContext } from '../../src/pages/shops/player-decision.js'
import { offerCard, bundleCard } from '../../src/pages/shops/shop-catalogue.js'

const stock = JSON.parse((await import('node:fs')).readFileSync('data/shop-stock-rom.json', 'utf8'))
for (const lang of ['en', 'th', 'ja']) {
  for (const route of ['float', 'sinker', 'lure', 'fly']) {
    const ctx = context(lang, route)
    for (const id of Object.keys(data.fishVisuals)) {
      ctx.selectedFish = id
      for (const item of data.items) {
        const expected = expectedState(item, id, route)
        assert.equal(
          shopCompatibility(ctx, item),
          expected,
          `${item.category}:${item.id}/${id}/${route}`,
        )
      }
    }
    ctx.selectedFish = '06'
    checkPanel(ctx)
    for (const item of data.items.filter((entry) => ['bait', 'lure'].includes(entry.category))) {
      const html = offerCard(ctx, item, { stage: 1 })
      assert.match(
        html,
        new RegExp(`data-shop-compatibility="${expectedState(item, '06', route)}"`),
      )
      assert.match(html, /data-offer=/)
    }
    for (const area of stock.areas)
      for (const bundle of area.flyBundles || []) {
        const body = data.items.find((item) => item.category === 'fly' && item.id === bundle.body)
        const html = bundleCard(ctx, bundle, area.stage, data.items, {})
        assert.match(
          html,
          new RegExp(`data-shop-compatibility="${expectedState(body, '06', route)}"`),
        )
      }
    ctx.selectedFish = 'FF'
    assert.equal(shopFishContext(ctx), '')
    assert.equal(
      shopCompatibility(
        ctx,
        data.items.find((item) => item.category === 'lure'),
      ),
      '',
    )
    ctx.selectedFish = ''
    assert.equal(shopFishContext(ctx), '')
    assert.equal(shopCompatibility(ctx, data.items[0]), '')
    assert.doesNotMatch(
      offerCard(
        ctx,
        data.items.find((item) => item.category === 'lure'),
      ),
      /data-shop-compatibility/,
    )
  }
}
checkDistinctThaiShopName()
checkCategoryAwareBaitNote()
console.log(
  'Shop fish decisions PASS: all item profiles, both bait routes, three locales, bundle-body checks and contextual actions.',
)

function checkDistinctThaiShopName() {
  const fish = data.fishVisuals['3A']
  assert.deepEqual(fish.nameThVariants, ['อูนางิ / ปลาไหลญี่ปุ่น', 'อูนางิ'])
  const labelFor = (lang) => {
    const ctx = context(lang, 'lure')
    ctx.selectedFish = '3A'
    const html = shopFishContext(ctx)
    return unescapeHtml(html.match(/<strong>([^<]+)<\/strong>/)?.[1] || '')
  }
  assert.equal(labelFor('th'), 'อูนางิ / ปลาไหลญี่ปุ่น')
  assert.equal(labelFor('ja'), 'ウナギ')
  assert.equal(labelFor('en'), 'Unagi')
  assert.deepEqual(fish.nameThVariants, ['อูนางิ / ปลาไหลญี่ปุ่น', 'อูนางิ'])
}

function checkCategoryAwareBaitNote() {
  const copy = {
    en: {
      bait: 'Bait labels use the sinker route when selected; otherwise they use float.',
      profile:
        'Check the marks before buying: not every listed item passes this fish check. Passing does not guarantee a bite or landing.',
    },
    th: {
      bait: 'ป้ายเหยื่อจริงใช้เส้นทางตะกั่วเมื่อเลือกตะกั่ว; วิธีอื่นหรือยังไม่เลือกจะใช้ทุ่น',
      profile:
        'ดูป้ายก่อนซื้อ: ของที่แสดงไม่ได้ผ่านเงื่อนไขปลานี้ทุกชิ้น และการผ่านเงื่อนไขไม่รับประกันว่าปลากินหรือตกขึ้นได้',
    },
    ja: {
      bait: 'エサの判定はオモリ仕掛けを選んだ場合はオモリ、それ以外はウキで表示します。',
      profile:
        '購入前に印を確認してください。表示品がすべてこの魚の判定を通るわけではなく、判定を通っても食いつきや取り込みは保証されません。',
    },
  }
  for (const lang of ['en', 'th', 'ja']) {
    for (const category of ['all', 'bait']) {
      const html = fishContextFor(lang, 'sinker', category)
      assert(
        html.includes(copy[lang].bait),
        `${lang}/${category}: missing category-aware bait explanation`,
      )
      assertCategoryProfile(html, lang, category, copy[lang].profile)
    }
    for (const category of ['lure', 'fly']) {
      const html = fishContextFor(lang, 'sinker', category)
      assert(
        !html.includes(copy[lang].bait),
        `${lang}/${category}: bait-only explanation should be omitted`,
      )
      assertCategoryProfile(html, lang, category, copy[lang].profile)
    }
  }
}

function fishContextFor(lang, route, category) {
  const ctx = context(lang, route)
  ctx.$ = (id) => ({ value: id === 'category-select' ? category : '1' })
  return shopFishContext(ctx)
}

function expectedState(item, fish, route) {
  if (!item || !['bait', 'lure', 'fly'].includes(item.category)) return ''
  const ids =
    item.category === 'bait'
      ? item.playerUse?.fishIdsByRoute?.[route === 'sinker' ? 'sinker' : 'float'] || []
      : item.playerUse?.fishIds || []
  return ids.includes(fish) ? 'accepted' : 'rejected'
}

function checkPanel(ctx) {
  const html = shopFishContext(ctx)
  assert.match(html, /06/)
  const href = html.match(/href="([^"]*fish[^"]*)"/)?.[1]
  assert(href, 'Target has no fish profile action')
  const next = new URL(unescapeHtml(href), 'https://example.test/catalogue/shops.html')
  assert.equal(next.searchParams.get('id'), '06')
  assert.equal(next.searchParams.get('stage'), '1')
  assert.equal(next.searchParams.get('route'), ctx.selectedRig)
  assert.equal(next.searchParams.get('return'), ctx.targetReturn())
}

function context(lang, route) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  return {
    lang,
    selectedFish: '06',
    selectedRig: route,
    fishVisuals: data.fishVisuals,
    startStage: 1,
    $: () => ({ value: '1' }),
    targetReturn: () => `shops${suffix}.html?stage=1&fish=06&route=${route}#regular-stock`,
    stateParams: () => new URLSearchParams({ stage: '1' }),
    pages: { fish: { [lang]: `fish${suffix}.html` } },
    esc: (value) =>
      String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;'),
    imagePath: (value) => value,
    itemName: (item) => item.nameEn || item.nameJa,
    itemHref: (item) => `item${suffix}.html?category=${item.category}&id=${item.id}`,
    catName: (value) => value,
    findItem: (items, category, id) =>
      items.find((item) => item.category === category && item.id === id),
    itemTargetLink: (category, id) =>
      `<a href="item${suffix}.html?category=${category}&id=${id}">${id}</a>`,
    text: { price: (value) => `${value}`, noPrice: '', stageWord: (value) => `${value}` },
  }
}

function assertCategoryProfile(html, lang, category, profile) {
  if (category !== 'all') {
    assert(html.includes(profile), `${lang}/${category}: profile guidance missing`)
    return
  }
  const rules = {
    en: [
      /Fish-check badges apply to bait, lures and fly bodies/,
      /passing does not guarantee a bite or landing/,
    ],
    ja: [/魚の判定表示はエサ・ルアー・毛バリのボディ/, /食いつきや取り込みは保証/],
    th: [
      /ป้ายเงื่อนไขปลามีเฉพาะเหยื่อจริง ลัวร์ และบอดี้ฟลาย/,
      /ไม่รับประกันว่าปลากินหรือตกขึ้นได้/,
    ],
  }[lang]
  for (const rule of rules) assert.match(html, rule, `${lang}/all: scoped check guidance missing`)
}
