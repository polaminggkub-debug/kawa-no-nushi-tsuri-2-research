import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { data, root, render, renderCatalogue, unescapeHtml } from './shared.mjs'

function readData(name) {
  return JSON.parse(fs.readFileSync(path.join(root, 'data', name), 'utf8'))
}

const measured = readData('food-effects-confirmed.json')
const practical = readData('food-practical-research.json')
const shopFoods = data.items.filter(
  (item) => item.category === 'food' && Number.parseInt(item.id, 16) <= 6,
)
assert.equal(shopFoods.length, 6)
for (const item of shopFoods) {
  const trial = measured.items.find((record) => record.id === `0x${item.id}`)
  assert(trial?.runtime_confirmed, `Missing food recovery trial ${item.id}`)
  assert.equal(item.priceYen, trial.hp_delta, `Food cost per recovered HP changed ${item.id}`)
  assert.deepEqual(item.playerUse.summary, practical.items[`food:${item.id}`].summary)
  for (const lang of ['en', 'ja', 'th']) {
    const summary = item.playerUse.summary[lang]
    assert(summary.includes(`¥${item.priceYen}`) || summary.includes(`${item.priceYen}円`))
    assert(summary.includes(String(trial.hp_delta)))
    assert(
      /already own|手持ち|ของเดิม/.test(summary),
      `Food ${item.id}/${lang} must explain using owned food before buying`,
    )
    assert(
      /Missing about|不足|ขาด HP/.test(summary),
      `Food ${item.id}/${lang} must relate recovery to missing HP`,
    )
  }
}

for (const lang of ['en', 'ja', 'th']) {
  for (const item of shopFoods) {
    for (const stage of [1, 2, 3, 4, 5, 6]) await checkLocalChoices(item, lang, stage)
  }
}
checkDuplicateIntroProbes()

const fishMeal = data.items.find((item) => item.category === 'food' && item.id === '08')
const mealClaims = {
  en: /(?=.*cm)(?=.*divided by four)(?=.*minimum 1 HP)(?=.*capped at missing HP)(?=.*first .*fish)(?=.*Kusafugu)(?=.*HP to zero)/,
  ja: /(?=.*表示サイズ.*cm)(?=.*4.*(?:割|cm))(?=.*最低1HP)(?=.*不足HP|最大値)(?=.*先頭.*(?:魚|を食べ))(?=.*クサフグ)(?=.*HPが0)/,
  th: /(?=.*ซม\.)(?=.*หาร 4)(?=.*ขั้นต่ำ 1 HP)(?=.*ไม่เกิน HP ที่ขาด|HP ไม่เกินค่าสูงสุด)(?=.*ปลาตัวแรก)(?=.*คุซะฟุกุ)(?=.*HP เหลือ 0)/,
}
const mealExamples = {
  en: /20 cm(?: restores| →) 5 HP.*40 cm(?: restores| →) 10 HP.*100 cm(?: restores| →) 25 HP/,
  ja: /20cm.*5HP.*40cm.*10HP.*100cm.*25HP/,
  th: /20 ซม\..*(?:ฟื้น 5 HP|→ 5 HP).*40 ซม\..*(?:ฟื้น 10 HP|→ 10 HP).*100 ซม\..*(?:ฟื้น 25 HP|→ 25 HP)/,
}
for (const lang of ['en', 'ja', 'th']) {
  const catalogue = await renderCatalogue(lang, '?category=food#catalogue')
  const card = catalogue.runtime.renderItemCard(fishMeal)
  const detail = await render('item', lang, new URLSearchParams({ category: 'food', id: '08' }))
  for (const [surface, html] of [
    [
      'card',
      card.slice(
        card.indexOf('<div class="use-block"'),
        card.indexOf('<details class="record-details">'),
      ),
    ],
    ['detail', detail.html.split('<details class="evidence"')[0]],
  ]) {
    const text = unescapeHtml(html)
    assert(mealClaims[lang].test(text), `Fish meal ${surface} guidance missing ${lang}`)
    assert(mealExamples[lang].test(text), `Fish meal ${surface} size examples missing ${lang}`)
  }
}

async function checkLocalChoices(item, lang, stage) {
  const result = await render(
    'item',
    lang,
    new URLSearchParams({
      category: 'food',
      id: item.id,
      stage: String(stage),
    }),
  )
  const html = unescapeHtml(result.html)
  assert(html.includes(item.playerUse.summary[lang]))
  const hero = html.match(/<section id="what-to-do"[\s\S]*?<\/section>/)?.[0]
  assert(hero, 'Food use advice must remain in the visible item hero')
  checkHeroFoodRules(hero, lang)
  const choicePanel = html.match(
    /<section class="detail-section buying-decision" data-food-choice>[\s\S]*?<\/section>/,
  )?.[0]
  assert(choicePanel, 'Food alternatives panel is missing')
  assertNoRepeatedFoodIntro(choicePanel, lang)
  const options = html.match(/data-local-food-options>([\s\S]*?)<\/div>/)?.[1]
  assert(options !== undefined, `Missing area-specific food choices ${item.id}/${stage}`)
  const links = [...options.matchAll(/href="([^"]+)"/g)].map(
    (match) => new URL(match[1], result.url),
  )
  const expected = shopFoods.filter(
    (other) =>
      other.id !== item.id && other.playerUse.shops.some((shop) => Number(shop.stage) === stage),
  )
  assert.deepEqual(
    links.map((url) => url.searchParams.get('id')),
    expected.map((other) => other.id),
  )
  for (const url of links) assert.equal(url.searchParams.get('stage'), String(stage))
  checkRecoveryOptions(options, expected, lang)
  const fullComparison = choicePanel.match(/<details>([\s\S]*?)<\/details>/)
  assert(fullComparison, 'Full-area comparison must stay in a collapsed disclosure')
  const allOptions = fullComparison[1].match(/data-all-food-options>([\s\S]*?)<\/div>/)?.[1]
  assert(allOptions !== undefined, 'Missing full food recovery comparison')
  checkRecoveryOptions(
    allOptions,
    shopFoods.filter((other) => other.id !== item.id),
    lang,
  )
}

function checkHeroFoodRules(hero, lang) {
  const rules = {
    en: [
      /Use food you already own before buying more/,
      /six shop foods cost 1 yen per HP/,
      /Missing about .* HP|missing HP/,
      /maximum/,
    ],
    ja: [/手持ちの食料があれば先に使/, /店の食料6種.*回復HPあたり1円/, /不足HP/, /最大HP/],
    th: [
      /มีอาหารอยู่แล้วใช้ของเดิมก่อน/,
      /อาหารร้านทั้ง 6 แบบ.*1 เยนต่อ HP/,
      /HP ที่ขาด/,
      /HP สูงสุด/,
    ],
  }
  for (const rule of rules[lang]) assert(rule.test(hero), `Food hero misses ${rule} (${lang})`)
}

function assertNoRepeatedFoodIntro(panel, lang) {
  const intro = {
    en: /Use shop food you already own before buying more|All six shop foods cost ¥1 per HP/,
    ja: /店で買った食料を持っているなら|店の食料6種はどれも1HPあたり1円/,
    th: /ถ้ามีอาหารจากร้านอยู่แล้ว|อาหารร้านทั้ง 6 แบบราคา 1 เยนต่อ HP/,
  }[lang]
  const visiblePrefix = panel.split('<details')[0]
  assert.doesNotMatch(
    visiblePrefix,
    intro,
    `Food hero guidance is duplicated above the full comparison (${lang})`,
  )
}

function checkDuplicateIntroProbes() {
  const oldIntros = {
    en: 'Use shop food you already own before buying more. All six shop foods cost ¥1 per HP; choose an amount close to your missing HP.',
    ja: '店で買った食料を持っているなら、買い足す前に使ってください。店の食料6種はどれも1HPあたり1円。',
    th: 'ถ้ามีอาหารจากร้านอยู่แล้ว ให้ใช้ก่อนซื้อเพิ่ม; อาหารร้านทั้ง 6 แบบราคา 1 เยนต่อ HP',
  }
  for (const lang of ['en', 'ja', 'th']) {
    const visiblePrefix = `<section data-food-choice><p>${oldIntros[lang]}</p><details><p>Full comparison</p></details></section>`
    assert.throws(
      () => assertNoRepeatedFoodIntro(visiblePrefix, lang),
      (error) => error.code === 'ERR_ASSERTION' && error.message.includes('duplicated'),
    )
  }
}

function checkRecoveryOptions(html, expected, lang) {
  const articles = [...html.matchAll(/<article\b([^>]*)>([\s\S]*?)<\/article>/g)]
  assert.equal(articles.length, expected.length)
  for (const item of expected) {
    const trial = measured.items.find((record) => record.id === `0x${item.id}`)
    const article = articles.find((match) => match[1].includes(`data-food-option="${item.id}"`))
    assert(article, `Missing comparison for food ${item.id}`)
    assert(
      article[0].includes(`data-food-hp="${trial.hp_delta}"`),
      `Wrong or missing independently measured recovery for food ${item.id}`,
    )
    assert(article[2].includes('HP'), 'Recovery must be visible player text')
    assert(article[2].includes(String(trial.hp_delta)))
    const label = {
      en: `Restores up to ${trial.hp_delta} HP`,
      ja: `最大${trial.hp_delta} HP回復`,
      th: `ฟื้นได้สูงสุด ${trial.hp_delta} HP`,
    }[lang]
    assert(article[2].includes(label), `Missing qualified recovery label ${item.id}/${lang}`)
    assert(article[2].includes(`id=${item.id}`))
  }
}
