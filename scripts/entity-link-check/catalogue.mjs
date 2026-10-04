import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { data, root, renderCatalogue, unescapeHtml, validate } from './shared.mjs'

for (const lang of ['en', 'ja', 'th']) await checkCatalogue(lang)

async function checkCatalogue(lang) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const page = path.join(root, 'catalogue', `index${suffix}.html`)
  const staticHtml = fs.readFileSync(page, 'utf8')
  const base = new URL(`https://example.test/catalogue/index${suffix}.html`)
  validate(staticHtml, base)
  checkStaticAdvice(staticHtml, lang)
  await checkRenderedCatalogue(lang, base)
  await checkRodComparison(lang)
  await checkHookChoices(lang, suffix)
}

function checkStaticAdvice(html, lang) {
  const cards = html.slice(
    html.indexOf('<!-- prerender:cards -->'),
    html.indexOf('<!-- /prerender:cards -->'),
  )
  assert.equal(
    (cards.match(/class="item-card/g) || []).length,
    21,
    'Static catalogue should prerender the default 21 rods',
  )
  for (const item of data.items.filter((entry) => entry.category === 'rod')) {
    const card = cardFor(cards, item)
    assert(card, `Missing prerendered rod ${item.id}`)
    checkCardLinks(card, item)
    checkCardAdvice(card, item, lang, 'Static crawler HTML')
  }
}

async function checkRenderedCatalogue(lang, base) {
  const result = await renderCatalogue(lang, '?category=all')
  const cards = result.nodes.cards.innerHTML
  assert.equal((cards.match(/class="item-card/g) || []).length, 315)
  validate(cards, base)
  for (const item of data.items) {
    const card = cardFor(cards, item)
    checkCardLinks(card, item)
    if (itemAdvice(item)) checkCardAdvice(card, item, lang, 'Rendered catalogue')
    checkCardActions(card, item)
  }
}

function itemAdvice(item) {
  return item.rodDecision || item.baitLureDecision || item.gearDecision
}

function cardFor(html, item) {
  const identity = html.indexOf(`id="item-${item.category}-${item.id}"`)
  if (identity < 0) return ''
  const start = html.lastIndexOf('<article class="item-card', identity)
  const end = html.indexOf('<article class="item-card', identity + 1)
  return html.slice(start, end < 0 ? html.length : end)
}

function checkCardAdvice(card, item, lang, surface) {
  const advice = itemAdvice(item)
  const disclosureStart = card.indexOf('<details class="card-decision-disclosure"')
  assert(
    disclosureStart > 0,
    `${surface}: no collapsed decision details ${item.category}:${item.id}`,
  )
  const visible = unescapeHtml(card.slice(0, disclosureStart))
  const disclosure = unescapeHtml(card.slice(disclosureStart))
  const marker = item.rodDecision
    ? 'data-rod-decision'
    : item.baitLureDecision
      ? 'data-bait-lure-decision'
      : 'data-gear-decision'
  assert(
    visible.includes(`${marker}="${item.id}"`),
    `${surface}: decision kind missing ${item.category}:${item.id}`,
  )
  assert(
    visible.includes(advice.label[lang]),
    `${surface}: short verdict is hidden ${item.category}:${item.id}`,
  )
  for (const field of ['recommendation', 'reason']) {
    assert(
      disclosure.includes(advice[field][lang]),
      `${surface}: full ${field} missing ${item.category}:${item.id}`,
    )
  }
  if (item.category === 'rod') {
    assert(!visible.includes('fightResponseCode'))
    assert(!visible.includes('compatible-fish'))
  }
}

function checkCardLinks(card, item) {
  assert(card, `Missing rendered card ${item.category}:${item.id}`)
  assert(card.includes(`category=${item.category}&amp;id=${item.id}`))
  assert(/<figure class="sprite"><a /.test(card), `Unlinked portrait ${item.category}:${item.id}`)
  assert(/<h3><a class="entity-title"/.test(card), `Unlinked item name ${item.category}:${item.id}`)
}

function checkCardActions(card, item) {
  if (item.netGatherArea)
    assert(
      card.includes('data-bait-gather-choice') && card.includes('category=general_tool&amp;id=04'),
    )
  if (item.acquisitionOptions?.length)
    assert(card.includes('data-acquisition-choice') && card.includes('#use-locations'))
  if (item.category.startsWith('fly'))
    assert(card.includes('data-fly-maker') && card.includes('#fly-instructions'))
}

async function checkRodComparison(lang) {
  const result = await renderCatalogue(lang, '?category=rod#catalogue')
  const table = result.nodes['rod-comparison'].innerHTML
  assert.equal((table.match(/class="rod-table-advice"/g) || []).length, 21)
  for (const item of data.items.filter((entry) => entry.category === 'rod')) {
    assert(
      unescapeHtml(table).includes(item.rodDecision.label[lang]),
      `Missing rod table verdict ${item.id}/${lang}`,
    )
  }
  const noStock =
    lang === 'th' ? 'ไม่พบในร้าน' : lang === 'ja' ? '店頭在庫なし' : 'No recorded shop stock'
  assert.equal((table.match(new RegExp(`<td>${noStock}</td>`, 'g')) || []).length, 4)
}

async function checkHookChoices(lang, suffix) {
  const result = await renderCatalogue(lang, '?category=hook#catalogue')
  const table = result.nodes['category-decisions'].innerHTML
  const links = [...table.matchAll(/data-hook-budget-stage="([1-6])" href="([^"]+)"/g)]
  assert.equal(links.length, 6, `Missing hook replacement area choice ${lang}`)
  for (const match of links) {
    const next = new URL(
      unescapeHtml(match[2]),
      `https://example.test/catalogue/index${suffix}.html`,
    )
    const row = data.gearPriceGuide.hook[match[1]]
    assert.equal(next.searchParams.get('id'), row.id)
    assert.equal(next.searchParams.get('stage'), match[1])
  }
  validate(table, result.url)
}
