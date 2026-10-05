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
  const visibleRule = html.match(/data-food-choice><p>([^<]+)<\/p>/)?.[1]
  assert(visibleRule, 'Food decision rule must be visible before any disclosure')
  const rules = {
    en: [/Use shop food/, /six shop foods/, /¥1 per HP/, /missing HP/, /maximum/],
    th: [/อาหารจากร้าน/, /อาหารร้านทั้ง 6 แบบ/, /1 เยนต่อ HP/, /HP ที่ขาด/, /HP สูงสุด/],
    ja: [/店で買った食料/, /店の食料6種/, /1HPあたり1円/, /不足HP/, /最大HP/],
  }
  for (const rule of rules[lang]) assert(rule.test(visibleRule))
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
  checkRecoveryOptions(options, expected)
  const allOptions = html.match(/data-all-food-options>([\s\S]*?)<\/div>/)?.[1]
  assert(allOptions !== undefined, 'Missing full food recovery comparison')
  checkRecoveryOptions(
    allOptions,
    shopFoods.filter((other) => other.id !== item.id),
  )
  assert(/<details><summary>/.test(html), 'Keep the full cross-area food guide in a disclosure')
}

function checkRecoveryOptions(html, expected) {
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
    assert(article[2].includes(`id=${item.id}`))
  }
}
