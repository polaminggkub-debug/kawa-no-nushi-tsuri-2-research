import assert from 'node:assert/strict'
import { data, renderCatalogue, unescapeHtml } from './shared.mjs'

const locales = ['en', 'ja', 'th']
const stages = {
  1: ['01', '02'],
  2: ['02', '03'],
  3: ['02', '04'],
  4: ['02', '05'],
  5: ['03', '06'],
  6: ['03', '06'],
}
const foods = data.items.filter((item) => item.category === 'food' && item.id <= '06')
// The payload carries the source advice with item IDs already replaced by item names.
const canonical = data.playerDecisions.sections.find((entry) => entry.id === 'food_hp_choice')

assert.equal(foods.length, 6)
checkShopMatrix()
for (const lang of locales) {
  for (const [stage, ids] of Object.entries(stages)) await checkArea(lang, Number(stage), ids)
  await checkFallback(lang, '')
  for (const invalid of ['0', '7', '99']) await checkFallback(lang, invalid)
}
console.log(
  'PASS: area food advice is local, measured, linked back safely, and keeps the canonical fallback in EN/JA/TH.',
)

function checkShopMatrix() {
  for (const [stage, expected] of Object.entries(stages)) {
    const actual = foods
      .filter((item) =>
        item.playerUse?.shops?.some(
          (shop) => Number(shop.stage) === Number(stage) && !shop.condition,
        ),
      )
      .map((item) => item.id)
      .sort()
    assert.deepEqual(actual, [...expected].sort(), `ROM food stock changed in area ${stage}`)
  }
}

async function categoryState(lang, stage) {
  const query = new URLSearchParams({ category: 'food', route: 'float' })
  if (stage) query.set('stage', String(stage))
  const result = await renderCatalogue(lang, `?${query}#catalogue`)
  result.nodes['category-filter'].value = 'food'
  result.nodes['fish-filter'].value = ''
  result.runtime.renderCards()
  return { html: result.nodes['category-decisions'].innerHTML, url: result.url }
}

async function checkArea(lang, stage, ids) {
  const { html, url } = await categoryState(lang, stage)
  const card = html.match(
    new RegExp(`<article\\b[^>]*data-food-area-choice="${stage}"[^>]*>[\\s\\S]*?<\\/article>`),
  )?.[0]
  assert(card, `${lang}/area${stage}: local food choice is missing`)
  const links = foodLinks(card, url, lang)
  assert.deepEqual(
    links.map((link) => link.id).sort(),
    [...ids].sort(),
    `${lang}/area${stage}: wrong local food set`,
  )
  const copy = unescapeHtml(card.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ')
  checkAdvice(copy, lang, stage)
  for (const link of links) checkReturn(link, url, lang, stage)
}

function foodLinks(card, base, lang) {
  return [...card.matchAll(/<a class="decision-item" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(
    (match) => {
      const target = new URL(unescapeHtml(match[1]), base)
      const id = target.searchParams.get('id')
      const item = foods.find((food) => food.id === id)
      assert(item, `Non-food or non-fixed food recommendation: ${target}`)
      const name = item[`name${lang === 'en' ? 'En' : lang === 'ja' ? 'Ja' : 'Th'}`]
      const hp = item.playerUse.hpRecovery.hp
      const price = item.priceYen
      const label = unescapeHtml(match[2])
      const hpText =
        lang === 'ja' ? `${hp}HP回復` : lang === 'th' ? `ฟื้น ${hp} HP` : `restores ${hp} HP`
      const priceText = lang === 'ja' ? `${price}円` : `¥${price}`
      assert(
        label.includes(name) && label.toLocaleLowerCase().includes(hpText.toLocaleLowerCase()),
        `Food name/recovery missing: ${id}`,
      )
      assert(label.includes(priceText), `Food price missing: ${id}`)
      return { id, href: match[1] }
    },
  )
}

function checkAdvice(copy, lang, stage) {
  const rules = {
    en: [/Use suitable food you already own first/, /missing HP/i, /excess recovery is wasted/i],
    ja: [/食料を持っていれば先に使い/, /不足HP/, /超過分は無駄/],
    th: [/มีอาหารที่เหมาะอยู่แล้วให้ใช้ก่อน/, /HP ที่ขาด/, /ฟื้นเกินจะเสียเปล่า/],
  }[lang]
  for (const rule of rules)
    assert(rule.test(copy), `${lang}/area${stage}: missing practical food advice ${rule}`)
  assert.doesNotMatch(
    copy,
    /\bbest\b|ดีที่สุด|最適/,
    `${lang}/area${stage}: unsupported universal winner`,
  )
}

function checkReturn(link, base, lang, stage) {
  const target = new URL(unescapeHtml(link.href), base)
  const suffix = lang === 'en' ? '' : `.${lang}`
  assert(target.pathname.endsWith(`/item${suffix}.html`))
  assert.equal(target.searchParams.get('category'), 'food')
  assert.equal(target.searchParams.get('stage'), String(stage))
  const back = new URL(target.searchParams.get('return'), base)
  assert(back.pathname.endsWith(`/index${suffix}.html`))
  assert.equal(back.searchParams.get('category'), 'food')
  assert.equal(back.searchParams.get('stage'), String(stage))
  assert.equal(back.searchParams.get('route'), 'float')
  assert.equal(back.hash, '#catalogue')
}

async function checkFallback(lang, stage) {
  const { html } = await categoryState(lang, stage || null)
  assert(
    !html.includes('data-food-area-choice='),
    `${lang}/${stage || 'no stage'}: unsafe area-specific fallback`,
  )
  const card = html.match(/<article\b[^>]*class="decision-card"[^>]*>[\s\S]*?<\/article>/)?.[0]
  assert(
    card?.includes(canonical.recommendation[lang]),
    `${lang}/${stage || 'no stage'}: canonical HP advice lost`,
  )
  const expected = canonical.items.map((item) => `${item.category}:${item.id}`).sort()
  const actual = [...card.matchAll(/<a class="decision-item" href="([^"]+)"/g)]
    .map((match) => {
      const target = new URL(unescapeHtml(match[1]), 'https://example.test/catalogue/index.html')
      return `${target.searchParams.get('category')}:${target.searchParams.get('id')}`
    })
    .sort()
  assert.deepEqual(
    actual,
    expected,
    `${lang}/${stage || 'no stage'}: canonical food decision choices changed`,
  )
}
