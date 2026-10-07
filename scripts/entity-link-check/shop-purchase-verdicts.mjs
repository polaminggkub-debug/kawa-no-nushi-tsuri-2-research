import assert from 'node:assert/strict'
import { data, unescapeHtml } from './shared.mjs'
import { rodAreaDecision } from '../../src/entities/item/index.js'
import { shopPurchaseDecision } from '../../src/pages/shops/shop-purchase-decision.js'
import { shopCategoryGuidance } from '../../src/pages/shops/shop-category-guidance.js'
import { offerCard } from '../../src/pages/shops/shop-catalogue.js'
import { text_en } from '../../src/pages/shops/text_en.js'
import { text_th } from '../../src/pages/shops/text_th.js'
import { text_ja } from '../../src/pages/shops/text_ja.js'

const labels = { en: text_en, th: text_th, ja: text_ja }
const scope = {
  en: 'Compares new-purchase price, time to aim, line strength and fight start; the rod page says which fish it suits.',
  th: 'เทียบราคาซื้อใหม่ เวลาเล็ง สายขาดยาก และจุดเริ่มสู้ คันเหมาะกับปลาชนิดไหนดูในหน้าคัน',
  ja: '新品価格・狙う時間・糸の切れにくさ・ファイトの出だしの比較です。どの魚に向くかは竿のページで確認できます。',
}
for (const locale of ['en', 'th', 'ja']) checkLocale(locale)
console.log(
  'PASS: all stocked rods/hooks/floats show canonical area purchase verdicts in shop cards across EN/TH/JA; other categories do not inherit gear advice.',
)

function checkLocale(locale) {
  const ctx = context(locale)
  const guidance = shopCategoryGuidance(locale, 'rod', '').text
  const required = {
    en: ['buying advice for this area', 'price', 'time to aim', 'line strength', 'fight start'],
    th: ['คำแนะนำซื้อ', 'ด่านนี้', 'ราคา', 'เวลาเล็ง', 'สายขาดยาก', 'จุดเริ่มสู้'],
    ja: ['このエリア', '購入アドバイス', '価格', '狙う時間', '糸の切れにくさ', 'ファイトの出だし'],
  }[locale]
  for (const phrase of required)
    assert(guidance.includes(phrase), `${locale}: common rod scope/action missing ${phrase}`)
  const rod = data.items.find((item) => item.category === 'rod' && item.id === '03')
  assert.equal(
    shopPurchaseDecision(ctx, rod, 1, []),
    '',
    'Missing comparison data must not imply no stock',
  )
  for (const item of data.items) {
    if (!['rod', 'hook', 'float_weight'].includes(item.category)) {
      assert.equal(shopPurchaseDecision(ctx, item, 1, data.items), '')
      continue
    }
    for (const shop of item.playerUse?.shops || []) checkOffer(ctx, item, shop.stage)
  }
}

function checkOffer(ctx, item, stage) {
  const decision =
    item.category === 'rod' ? rodAreaDecision(ctx.lang, item, data.items, stage) : item.gearDecision
  const label = local(decision?.label, ctx.lang)
  assert(label, `${ctx.lang}/${item.category}:${item.id}/${stage}: canonical decision missing`)
  const html = unescapeHtml(offerCard(ctx, item, { stage, items: data.items }))
  assert(html.includes(`data-shop-purchase-decision="${item.category}:${item.id}"`))
  assert(html.includes(`data-decision-stage="${stage}"`))
  assert(html.includes(`data-decision-status="${decision.status || 'gear'}"`))
  assert(html.includes(`<strong>${label}</strong>`))
  assert.equal((html.match(/data-shop-purchase-decision=/g) || []).length, 1)
  assert(
    html.includes(`<p><strong>${label}</strong></p><details`),
    'Visible decision must remain a concise verdict with folded reasons',
  )
  const details = html.match(/<details data-shop-decision-details>[\s\S]*?<\/details>/)?.[0]
  const paragraphs = [decision.recommendation, decision.reason, decision.scope]
    .map((value) => local(value, ctx.lang))
    .filter(Boolean)
  if (paragraphs.length) assert(details, 'Canonical reason must remain inspectable')
  for (const paragraph of paragraphs) {
    assert(details.includes(`<p>${paragraph}</p>`))
    assert.equal(
      html.split(`<p>${paragraph}</p>`).length - 1,
      1,
      'Do not duplicate comparison scope or reasons',
    )
  }
  if (item.category === 'rod' && !decision.scope) assert(details.includes(scope[ctx.lang]))
  assert(html.indexOf('data-shop-purchase-decision=') < html.indexOf('data-shop-decision-details'))
}

function local(value, lang) {
  return typeof value === 'string' ? value : value?.[lang] || value?.en || ''
}

function context(lang) {
  return {
    lang,
    selectedFish: '',
    selectedRig: 'float',
    text: labels[lang],
    esc: (value) =>
      String(value ?? '').replace(
        /[&<>"']/g,
        (character) =>
          ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character],
      ),
    itemName: (item) => item.nameEn,
    imagePath: (value) => value,
    itemHref: (item) => `item.html?category=${item.category}&id=${item.id}`,
    catName: (category) => category,
  }
}
