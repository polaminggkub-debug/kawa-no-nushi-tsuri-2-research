import assert from 'node:assert/strict'
import { render, renderCatalogue, unescapeHtml } from './shared.mjs'
import {
  checkLocalizedDecision,
  data,
  dominates,
  expectedDecision,
  rodAreaDecision,
  rods,
  stockByStage,
  requireEqual,
  requireValue,
} from './selected-rod-area-model.mjs'

const locales = ['th', 'en', 'ja']
function attributeCount(html, name) {
  return [...html.matchAll(new RegExp(`${name}="([^"]*)"`, 'g'))].map((match) => match[1])
}

function localizeEscape(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character],
  )
}

function checkAreaMarkers(html, lang, item, stage, expected, decision) {
  requireValue(
    html.includes(`data-rod-area-decision="${stage}"`),
    `Missing stage: ${lang}/${item.id}`,
  )
  requireValue(
    html.includes(`data-rod-area-status="${expected.status}"`),
    `Wrong status: ${lang}/${item.id}`,
  )
  requireEqual(
    attributeCount(html, 'data-selected-area-offer').includes('true'),
    stockByStage.get(stage).has(item.id),
    `Stock marker: ${lang}/${stage}/${item.id}`,
  )
  requireValue(
    html.includes(localizeEscape(decision.label[lang])),
    `Area label missing: ${lang}/${stage}/${item.id}`,
  )
}

function checkFullAreaCopy(html, lang, item, decision) {
  requireValue(
    html.includes(localizeEscape(decision.recommendation[lang])),
    `Recommendation missing: ${lang}/${item.id}`,
  )
  requireValue(
    html.includes(localizeEscape(decision.reason[lang])),
    `Reason missing: ${lang}/${item.id}`,
  )
}

function renderedAlternatives(html, lang, item, stage, expected) {
  const alternatives = attributeCount(html, 'data-rod-area-alternative')
  const sourceOffers = expected.choices.map((choice) => choice.id)
  for (const id of alternatives)
    requireValue(
      sourceOffers.includes(id),
      `Unrecorded alternative: ${lang}/${stage}/${item.id}/${id}`,
    )
  if (expected.status === 'item-unstocked' || expected.status.startsWith('style-')) {
    const frontier = expected.choices.filter(
      (choice) => !expected.choices.some((other) => dominates(other, choice)),
    )
    for (const choice of frontier)
      requireValue(
        alternatives.includes(choice.id),
        `Pareto option omitted: ${lang}/${stage}/${item.id}/${choice.id}`,
      )
  }
  return alternatives
}

function checkAlternativeLinks(html, lang, item, stage, expected, base) {
  for (const tag of html.matchAll(/<a\b[^>]*>/g)) {
    const id = tag[0].match(/data-rod-area-alternative="([^"]+)"/)?.[1]
    if (!id) continue
    const href = tag[0].match(/href="([^"]+)"/)?.[1]
    requireValue(href, `Alternative without href: ${lang}/${stage}/${item.id}/${id}`)
    const target = new URL(unescapeHtml(href), base)
    const targetStage = expected.status === 'style-unstocked' ? expected.nextStockStage : stage
    requireEqual(target.searchParams.get('category'), 'rod')
    requireEqual(target.searchParams.get('id'), id)
    requireEqual(
      target.searchParams.get('stage'),
      String(targetStage),
      `Wrong area: ${lang}/${stage}/${item.id}/${id}`,
    )
    if (expected.status === 'style-unstocked')
      requireValue(
        stockByStage.get(targetStage)?.has(id),
        `Fallback item not sold there: ${lang}/${stage}/${item.id}/${id}`,
      )
  }
}

function checkNextStockMarker(html, lang, item, stage, expected) {
  if (!expected.nextStockStage) return
  requireValue(
    html.includes('data-rod-area-next-stock'),
    `Next-stock route missing: ${lang}/${stage}/${item.id}`,
  )
  requireValue(
    html.includes(`data-stage="${expected.nextStockStage}"`),
    `Wrong next-stock area: ${lang}/${stage}/${item.id}`,
  )
  if (expected.status !== 'style-unstocked') return
  const area = { en: 'Area', th: 'ด่าน', ja: 'エリア' }[lang]
  const fallback = html.match(
    new RegExp(
      `<[^>]+data-rod-area-next-stock="${expected.nextStockStage}"[^>]*>([\\s\\S]*?)<\\/[^>]+>`,
    ),
  )?.[1]
  requireValue(fallback, `Fallback label missing: ${lang}/${stage}/${item.id}`)
  const visible = unescapeHtml(fallback.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ')
  requireValue(
    visible.includes(`${area}${lang === 'ja' ? '' : ' '}${expected.nextStockStage}`),
    `Fallback area not localized: ${lang}/${stage}/${item.id}`,
  )
  requireValue(
    !/\bfunction\b|[A-Za-z_$][\w$]*\s*=>/.test(visible),
    `Function source leaked into fallback label: ${lang}/${stage}/${item.id}`,
  )
}

function checkAreaMarkup(html, lang, item, stage, expected, base, fullAdvice = true) {
  const decision = rodAreaDecision(lang, item, data.items, stage)
  checkLocalizedDecision(decision, lang, item, stage, expected)
  checkAreaMarkers(html, lang, item, stage, expected, decision)
  if (fullAdvice) checkFullAreaCopy(html, lang, item, decision)
  renderedAlternatives(html, lang, item, stage, expected)
  checkAlternativeLinks(html, lang, item, stage, expected, base)
  checkNextStockMarker(html, lang, item, stage, expected)
}

function comparisonRow(table, item, base) {
  const rows = [...table.matchAll(/<tr\b[^>]*data-rod-area-decision="[^"]+"[^>]*>[\s\S]*?<\/tr>/g)]
  return rows
    .map((match) => match[0])
    .find((row) => {
      const href = row.match(/<a\b[^>]*href="([^"]+)"/)?.[1]
      if (!href) return false
      const target = new URL(unescapeHtml(href), base)
      return (
        target.searchParams.get('category') === 'rod' && target.searchParams.get('id') === item.id
      )
    })
}

function comparisonCells(row) {
  return [...row.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/g)].map((match) =>
    unescapeHtml(match[1].replace(/<[^>]*>/g, ' '))
      .replace(/\s+/g, ' ')
      .trim(),
  )
}

function checkComparisonFacts(row, lang, stage, item) {
  const cells = comparisonCells(row)
  requireEqual(cells[2], String(item.decodedFields.castAimHoldCutoffInternal))
  requireEqual(cells[3], String(item.decodedFields.rangeMultiplier))
  const local = stockByStage.get(stage).has(item.id)
  if (local)
    requireEqual(cells[4], `¥${item.priceYen}`, `Wrong local quote: ${lang}/${stage}/${item.id}`)
  else
    requireValue(
      !/¥\d+/.test(cells[4]),
      `Unstocked rod has a local price: ${lang}/${stage}/${item.id}`,
    )
}

function checkItemLinkStage(html, lang, stage, item, base) {
  const link = [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g)].find((match) => {
    const target = new URL(unescapeHtml(match[1]), base)
    return (
      target.searchParams.get('category') === 'rod' && target.searchParams.get('id') === item.id
    )
  })
  requireValue(link, `Rod detail link missing: ${lang}/${stage}/${item.id}`)
  requireEqual(new URL(unescapeHtml(link[1]), base).searchParams.get('stage'), String(stage))
}

function checkComparisonArea(table, lang, stage, url) {
  for (const item of rods) {
    const expected = expectedDecision(item, stage)
    const row = comparisonRow(table, item, url)
    assert(row, `Comparison row missing: ${lang}/${stage}/${item.id}`)
    checkComparisonFacts(row, lang, stage, item)
    assert(row.includes(`data-rod-area-decision="${stage}"`))
    assert(row.includes(`data-rod-area-status="${expected.status}"`))
    checkAreaMarkup(row, lang, item, stage, expected, url, false)
    checkItemLinkStage(row, lang, stage, item, url)
  }
}

function detailQuery(lang, item, stage) {
  const locale = lang === 'en' ? '' : `.${lang}`
  const returnRoute = `maps${locale}.html?stage=${stage}&section=s1-c1-r6`
  return new URLSearchParams({
    category: 'rod',
    id: item.id,
    stage: String(stage),
    fish: '06',
    route: 'float',
    return: returnRoute,
  })
}

function checkDetailLinkContext(html, lang, item, stage, base) {
  const returnRoute = `maps${lang === 'en' ? '' : `.${lang}`}.html?stage=${stage}&section=s1-c1-r6`
  const locale = lang === 'en' ? '' : `.${lang}`
  for (const tag of html.matchAll(/<a\b[^>]*>/g)) {
    const id = tag[0].match(/data-rod-area-alternative="([^"]+)"/)?.[1]
    if (!id) continue
    const href = tag[0].match(/href="([^"]+)"/)?.[1]
    requireValue(href)
    const target = new URL(unescapeHtml(href), base)
    requireEqual(
      target.searchParams.get('fish'),
      '06',
      `Fish context lost: ${lang}/${stage}/${item.id}`,
    )
    requireEqual(
      target.searchParams.get('route'),
      'float',
      `Route context lost: ${lang}/${stage}/${item.id}`,
    )
    const returnHref = target.searchParams.get('return')
    requireValue(returnHref, `Return lost: ${lang}/${stage}/${item.id}`)
    const returned = new URL(returnHref, base)
    requireEqual(
      returned.pathname,
      `/kawa-no-nushi-tsuri-2-research/catalogue/item${locale}.html`,
      `Return route changed: ${lang}/${stage}/${item.id}`,
    )
    requireEqual(returned.searchParams.get('category'), 'rod')
    requireEqual(returned.searchParams.get('id'), item.id)
    requireEqual(returned.searchParams.get('stage'), String(stage))
    requireEqual(returned.searchParams.get('fish'), '06')
    requireEqual(returned.searchParams.get('route'), 'float')
    requireEqual(returned.searchParams.get('return'), returnRoute)
  }
}

async function checkDetailArea(lang, stage) {
  for (const item of rods) {
    const result = await render('item', lang, detailQuery(lang, item, stage).toString())
    checkAreaMarkup(result.html, lang, item, stage, expectedDecision(item, stage), result.url)
    checkDetailLinkContext(result.html, lang, item, stage, result.url)
  }
}

async function checkRenderedArea(lang, stage) {
  const { runtime, url, nodes } = await renderCatalogue(
    lang,
    `?category=rod&stage=${stage}#catalogue`,
  )
  runtime.allItems = data.items
  runtime.locationStage = String(stage)
  for (const item of rods) checkCardArea(runtime, lang, stage, item, url)
  runtime.renderComparison('rod')
  checkComparisonArea(nodes['rod-comparison'].innerHTML, lang, stage, url)
  await checkDetailArea(lang, stage)
}

function checkCardArea(runtime, lang, stage, item, url) {
  const card = runtime.renderItemCard(item)
  checkAreaMarkup(card, lang, item, stage, expectedDecision(item, stage), url)
  checkItemLinkStage(card, lang, stage, item, url)
}

async function checkRenderedMatrix() {
  for (const lang of locales)
    for (let stage = 1; stage <= 6; stage += 1) await checkRenderedArea(lang, stage)
}

function checkInvalidCard(runtime, lang, item) {
  const card = runtime.renderItemCard(item)
  requireValue(
    !card.includes('data-rod-area-decision='),
    `Invalid stage changed card: ${lang}/${item.id}`,
  )
  requireValue(card.includes(localizeEscape(item.rodDecision.label[lang])))
  requireValue(card.includes(item.recordBytesHex), `Card evidence lost: ${lang}/${item.id}`)
}

async function checkInvalidDetail(lang, item) {
  const query = new URLSearchParams({ category: 'rod', id: item.id, stage: '7' })
  const detail = await render('item', lang, query.toString())
  requireValue(
    !detail.html.includes('data-rod-area-decision='),
    `Invalid stage changed detail: ${lang}/${item.id}`,
  )
  requireValue(detail.html.includes(localizeEscape(item.rodDecision.label[lang])))
  requireValue(
    detail.html.includes(item.recordBytesHex),
    `Detail evidence lost: ${lang}/${item.id}`,
  )
}

function checkGlobalComparison(table, lang, item, base) {
  const rows = [...table.matchAll(/<tr\b[^>]*>[\s\S]*?<\/tr>/g)]
  const row = rows
    .map((match) => match[0])
    .find((value) => {
      const href = value.match(/<a\b[^>]*href="([^"]+)"/)?.[1]
      return href && new URL(unescapeHtml(href), base).searchParams.get('id') === item.id
    })
  requireValue(row, `Global comparison row lost: ${lang}/${item.id}`)
  requireValue(row.includes(localizeEscape(item.rodDecision.label[lang])))
  for (const value of [
    item.decodedFields.castAimHoldCutoffInternal,
    item.decodedFields.rangeMultiplier,
  ])
    requireValue(row.includes(String(value)), `Global evidence lost: ${lang}/${item.id}/${value}`)
}

async function checkGlobalFallback() {
  for (const lang of locales) {
    const { runtime, url, nodes } = await renderCatalogue(lang, '?category=rod&stage=7#catalogue')
    runtime.allItems = data.items
    runtime.locationStage = ''
    for (const item of rods) {
      checkInvalidCard(runtime, lang, item)
      await checkInvalidDetail(lang, item)
    }
    runtime.renderComparison('rod')
    const table = nodes['rod-comparison'].innerHTML
    requireValue(
      !table.includes('data-rod-area-decision='),
      `Invalid stage changed comparison: ${lang}`,
    )
    for (const item of rods) checkGlobalComparison(table, lang, item, url)
  }
}

await checkRenderedMatrix()
await checkGlobalFallback()

console.log(
  'PASS: rod-area advice is independently checked against ROM shop stock, prices and decoded metrics for 21 rods, six areas and TH/EN/JA cards, details and comparison rows; invalid areas preserve global advice.',
)
