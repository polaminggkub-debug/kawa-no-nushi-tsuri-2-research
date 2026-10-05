import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { data, root } from './shared.mjs'
import { offerCard } from '../../src/pages/shops/shop-catalogue.js'
import { text_en } from '../../src/pages/shops/text_en.js'
import { text_ja } from '../../src/pages/shops/text_ja.js'
import { text_th } from '../../src/pages/shops/text_th.js'

const measured = JSON.parse(
  fs.readFileSync(path.join(root, 'data/food-effects-confirmed.json'), 'utf8'),
)
const labels = { en: text_en, ja: text_ja, th: text_th }
const shopFoods = data.items.filter(
  (item) =>
    item.category === 'food' &&
    Number.isSafeInteger(item.playerUse?.hpRecovery?.hp) &&
    item.playerUse.hpRecovery.hp > 0 &&
    item.playerUse.shops?.length,
)
assert.deepEqual(
  shopFoods.map((item) => item.id),
  ['01', '02', '03', '04', '05', '06'],
  'Only the six measured shop foods should advertise a fixed recovery amount',
)

for (const lang of ['en', 'ja', 'th']) {
  const ctx = context(lang)
  for (const item of shopFoods) checkMeasuredOffer(ctx, item, lang)
  checkUnmeasuredAndInvalidOffers(ctx)
}

console.log(
  'PASS: shop cards show evidence-backed, capped HP recovery in EN/JA/TH only for measured fixed-recovery foods.',
)

function checkMeasuredOffer(ctx, item, lang) {
  const trial = measured.items.find((record) => record.id === `0x${item.id}`)
  assert(trial?.runtime_confirmed, `Missing isolated-ROM trial for food ${item.id}`)
  assert.equal(item.playerUse.hpRecovery.hp, trial.hp_delta)
  const stage = item.playerUse.shops[0].stage
  const html = offerCard(ctx, item, { stage })
  const label = html.match(/<p class="food-recovery">([^<]+)<\/p>/)?.[1]
  assert.equal(label, ctx.text.foodRecovery(trial.hp_delta), `${item.id}/${lang}`)
  assert.equal(html.includes(`data-offer="food:${item.id}"`), true)
  assertQualifiedLabel(label, trial.hp_delta, lang)
}

function assertQualifiedLabel(label, hp, lang) {
  const qualified = {
    en: `Restores up to ${hp} HP`,
    ja: `最大${hp} HP回復`,
    th: `ฟื้นได้สูงสุด ${hp} HP`,
  }[lang]
  assert.equal(label, qualified)
}

function checkUnmeasuredAndInvalidOffers(ctx) {
  const food = data.items.find((item) => item.category === 'food' && item.id === '01')
  const fishMeal = data.items.find((item) => item.category === 'food' && item.id === '08')
  const poison = data.items.find((item) => item.category === 'food' && item.id === '0A')
  for (const candidate of [fishMeal, poison])
    assert.doesNotMatch(offerCard(ctx, candidate), /class="food-recovery"/)
  for (const hpRecovery of [undefined, { hp: 0 }, { hp: -1 }]) {
    const item = { ...food, playerUse: { ...food.playerUse, hpRecovery } }
    assert.doesNotMatch(offerCard(ctx, item), /class="food-recovery"/)
  }
  const nonFood = {
    ...food,
    category: 'rod',
    playerUse: { ...food.playerUse, hpRecovery: { hp: 10 } },
  }
  assert.doesNotMatch(offerCard(ctx, nonFood), /class="food-recovery"/)
}

function context(lang) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  return {
    lang,
    selectedFish: '',
    selectedRig: 'float',
    text: labels[lang],
    esc: (value) => String(value ?? '').replace(/[&<>"']/g, escapeCharacter),
    itemName: (item) =>
      item[`name${lang === 'en' ? 'En' : lang === 'ja' ? 'Ja' : 'Th'}`] || item.nameEn,
    imagePath: (value) => value,
    itemHref: (item) => `item${suffix}.html?category=${item.category}&id=${item.id}`,
    catName: (category) => category,
  }
}

function escapeCharacter(character) {
  return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]
}
