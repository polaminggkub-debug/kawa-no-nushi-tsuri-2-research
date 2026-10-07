import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { rodAreaDecision, rodRefName } from '../../src/entities/item/index.js'
import { data, root } from './shared.mjs'

// Advice names rods instead of quoting hex IDs, so assertions look for the rod's name.
export const rodName = (lang, id) => rodRefName(lang, id)
// An English name may open a sentence ("The large fly rod"), so names are matched ignoring case.
const mentions = (text, lang, id) => text.toLowerCase().includes(rodName(lang, id).toLowerCase())
export const requireValue = (value, message) => assert.ok(value, message)
export const requireEqual = (actual, expected, message) => assert.equal(actual, expected, message)
const shopStock = JSON.parse(fs.readFileSync(path.join(root, 'data/shop-stock-rom.json'), 'utf8'))
const rods = data.items.filter((item) => item.category === 'rod')
const byId = new Map(rods.map((item) => [item.id, item]))
const stockByStage = new Map(
  shopStock.areas.map((area) => [
    Number(area.stage),
    new Set(area.items.filter((entry) => entry.category === 'rod').map((entry) => entry.id)),
  ]),
)

assert.equal(rods.length, 21, 'ROM rod set should still contain 21 records')
assert.equal(stockByStage.size, 6, 'Selected-area advice needs all six shop records')

function styleOf(item) {
  return Number(item.decodedFields.styleCode)
}

function metrics(item) {
  return {
    id: item.id,
    item,
    price: Number(item.priceYen),
    aim: Number(item.decodedFields.castAimHoldCutoffInternal),
    boundary: Number(item.decodedFields.rangeMultiplier),
    start: -Number(item.rodDecision.startLoss),
  }
}

function sourceStages(id) {
  return [...stockByStage]
    .filter(([, ids]) => ids.has(id))
    .map(([stage]) => stage)
    .sort((a, b) => a - b)
}

function checkSourceMatchesCatalogue() {
  for (const item of rods) {
    const catalogue = [
      ...new Set((item.playerUse?.shops || []).map((offer) => Number(offer.stage))),
    ].sort((a, b) => a - b)
    assert.deepEqual(catalogue, sourceStages(item.id), `Shop source mismatch: ${item.id}`)
    requireValue(
      [
        item.priceYen,
        item.decodedFields.castAimHoldCutoffInternal,
        item.decodedFields.rangeMultiplier,
      ].every(Number.isFinite),
      `Missing rod metrics: ${item.id}`,
    )
  }
}

function offersAt(stage, style) {
  return [...(stockByStage.get(stage) || [])]
    .map((id) => byId.get(id))
    .filter((item) => item && styleOf(item) === style)
    .map(metrics)
    .sort((a, b) => a.id.localeCompare(b.id))
}

function dominates(first, second) {
  return (
    first.id !== second.id &&
    first.price <= second.price &&
    first.aim >= second.aim &&
    first.boundary >= second.boundary &&
    first.start >= second.start &&
    (first.price < second.price ||
      first.aim > second.aim ||
      first.boundary > second.boundary ||
      first.start > second.start)
  )
}

function nextStockStage(stage, style) {
  const stages = [...stockByStage.keys()]
    .filter((candidate) => offersAt(candidate, style).length)
    .sort((a, b) => a - b)
  return (
    stages.find((candidate) => candidate > stage) ||
    stages.filter((candidate) => candidate < stage).at(-1) ||
    0
  )
}

function expectedStatus(item, choices, styleStages) {
  if (!choices.length) return styleStages.length ? 'style-unstocked' : 'style-never-stocked'
  const candidate = choices.find((choice) => choice.id === item.id)
  if (!candidate) return 'item-unstocked'
  if (choices.length === 1) return 'only'
  if (choices.some((choice) => dominates(choice, candidate))) return 'dominated'
  const cheapest = Math.min(...choices.map((choice) => choice.price))
  const aim = Math.max(...choices.map((choice) => choice.aim))
  const boundary = Math.max(...choices.map((choice) => choice.boundary))
  if (candidate.price === cheapest && candidate.aim === aim && candidate.boundary === boundary)
    return 'dual'
  if (candidate.price === cheapest) return 'cheapest'
  if (candidate.aim === aim) return 'aim'
  if (candidate.boundary === boundary) return 'boundary'
  return 'tradeoff'
}

function expectedDecision(item, stage) {
  const style = styleOf(item)
  let choices = offersAt(stage, style)
  let next = 0
  if (!choices.length) {
    next = nextStockStage(stage, style)
    choices = next ? offersAt(next, style) : []
  }
  const styleStages = [...stockByStage.keys()].filter(
    (candidate) => offersAt(candidate, style).length,
  )
  const expectedStage = expectedStatus(item, offersAt(stage, style), styleStages)
  return {
    status: expectedStage,
    nextStockStage: next,
    localChoices: offersAt(stage, style),
    choices,
  }
}

function hasMetric(copy, lang, field, value) {
  if (field === 'price') return copy.includes(lang === 'ja' ? `${value}円` : `¥${value}`)
  if (field === 'boundary') return copy.includes(`×${value}`)
  const label = lang === 'th' ? 'เวลาเล็ง' : lang === 'ja' ? '狙う時間' : 'aim'
  let position = copy.indexOf(label)
  while (position >= 0) {
    const values = copy.slice(position, position + 32).match(/\d+(?:\.\d+)?/g) || []
    if (values.includes(String(value))) return true
    position = copy.indexOf(label, position + label.length)
  }
  return false
}

function hasMetricNearId(copy, lang, id, field, value) {
  const name = rodName(lang, id)
  const positions = [...copy.matchAll(new RegExp(escapeRegExp(name), 'gi'))].map(
    (match) => match.index,
  )
  return positions.some((position) =>
    hasMetric(copy.slice(position, position + 96), lang, field, value),
  )
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function directionPattern(lang, field, direction) {
  const patterns = {
    en: {
      aim: { more: /more time to aim/i, less: /less time to aim/i },
      boundary: {
        more: /breaks less easily|hardest-to-break/i,
        less: /breaks more easily/i,
      },
    },
    th: {
      aim: { more: /มีเวลาเล็งนานกว่า/, less: /มีเวลาเล็งน้อยกว่า/ },
      boundary: { more: /สายขาดยากกว่า/, less: /สายขาดง่ายกว่า/ },
    },
    ja: {
      aim: { more: /狙う時間が長/, less: /狙う時間が短/ },
      boundary: { more: /糸が切れにくい/, less: /糸が切れやすい/ },
    },
  }
  return patterns[lang][field][direction]
}

function cheaperPattern(lang) {
  return {
    en: /cheaper|lower.{0,20}price/i,
    th: /ราคาต่ำกว่า|ถูกกว่า/,
    ja: /安い|低価格/,
  }[lang]
}

function checkDirectionalDifference(copy, lang, subject, other, stage, subjectId) {
  for (const field of ['aim', 'boundary']) {
    if (subject[field] === other[field]) continue
    const direction = subject[field] > other[field] ? 'more' : 'less'
    requireValue(
      directionPattern(lang, field, direction).test(copy),
      `Wrong ${field} direction: ${lang}/${stage}/${subjectId}/${other.id}`,
    )
  }
}

function clauseAfterId(copy, lang, id) {
  const escaped = escapeRegExp(rodName(lang, id))
  const positions = [...copy.matchAll(new RegExp(escaped, 'gi'))]
  const position = positions.at(-1)?.index ?? -1
  if (position < 0) return ''
  const clause = copy.slice(position)
  // A full stop inside a rod name ("5.3 m") does not end the clause.
  const end = clause.search(/[.!?。！？](?=\s|$)/)
  return end < 0 ? clause : clause.slice(0, end)
}

function checkDecisionFields(decision, lang, item, stage, expected) {
  requireEqual(decision.stage, stage)
  assert.equal(decision.status, expected.status, `${lang}/${stage}/rod ${item.id} status`)
  requireEqual(decision.nextStockStage, expected.nextStockStage)
  for (const field of ['label', 'recommendation', 'reason', 'scope']) {
    requireEqual(typeof decision[field]?.[lang], 'string', `Missing ${field}.${lang}: ${item.id}`)
    requireValue(decision[field][lang].trim(), `Empty ${field}.${lang}: ${item.id}`)
  }
}

function checkLocalPriceClaims(decision, lang, item, stage, expected) {
  const copy = `${decision.label[lang]} ${decision.recommendation[lang]} ${decision.reason[lang]} ${decision.scope[lang]}`
  const allowedPrice = new Set(expected.choices.map((choice) => choice.price))
  const priceClaims = [...copy.matchAll(/¥(\d+)|(\d+)円/g)].map((match) =>
    Number(match[1] || match[2]),
  )
  for (const price of priceClaims)
    requireValue(
      allowedPrice.has(price),
      `Price outside same-style stock: ${lang}/${stage}/${item.id}/${price}`,
    )
}

function checkAlternativeSources(decision, lang, item, stage, expected) {
  const choiceIds = new Set(expected.choices.map((choice) => choice.id))
  for (const alternative of decision.alternatives) {
    requireEqual(alternative.category, 'rod')
    requireValue(
      choiceIds.has(alternative.id),
      `Unstocked alternative: ${lang}/${stage}/${item.id}/${alternative.id}`,
    )
    const validNextAreaSelfLink =
      expected.status.startsWith('style-') &&
      expected.nextStockStage > 0 &&
      expected.choices.some((choice) => choice.id === item.id)
    requireValue(
      alternative.id !== item.id || validNextAreaSelfLink,
      `Self alternative outside the next stocked area: ${lang}/${stage}/${item.id}`,
    )
  }
  requireEqual(
    new Set(decision.alternatives.map((alternative) => alternative.id)).size,
    decision.alternatives.length,
    `Duplicate alternative: ${lang}/${stage}/${item.id}`,
  )
}

function checkParetoAlternatives(decision, lang, item, stage, expected) {
  const candidate = expected.localChoices.find((choice) => choice.id === item.id)
  if (expected.status === 'dominated')
    assert(decision.alternatives.some((id) => dominates(metrics(byId.get(id.id)), candidate)))
  if (expected.status === 'item-unstocked' || expected.status.startsWith('style-')) {
    const frontier = expected.choices.filter(
      (choice) => !expected.choices.some((other) => dominates(other, choice)),
    )
    for (const choice of frontier)
      requireValue(
        decision.alternatives.some((alternative) => alternative.id === choice.id),
        `Pareto option omitted: ${lang}/${stage}/${item.id}/${choice.id}`,
      )
  }
}

function checkCandidateMetrics(decision, lang, item, stage, expected) {
  const candidate = expected.localChoices.find((choice) => choice.id === item.id)
  const copy = `${decision.label[lang]} ${decision.recommendation[lang]}`
  if (!candidate) return
  const fields = {
    only: ['price', 'aim', 'boundary'],
    dominated: ['price', 'aim', 'boundary'],
    dual: ['price', 'aim', 'boundary'],
    cheapest: ['price'],
    aim: [],
    boundary: [],
    tradeoff: ['price'],
  }[expected.status]
  for (const field of fields || [])
    requireValue(
      hasMetric(copy, lang, field, candidate[field]),
      `Chosen rod ${field} missing: ${lang}/${stage}/${item.id}/${candidate[field]}`,
    )
  if (expected.status === 'aim') checkAimRecommendation(decision, lang, stage, expected, candidate)
  if (expected.status === 'boundary') checkBoundaryRecommendation(decision, lang, stage, candidate)
}

function checkAimRecommendation(decision, lang, stage, expected, candidate) {
  const cheaper = [...expected.localChoices]
    .filter((choice) => choice.price < candidate.price)
    .sort((a, b) => a.price - b.price || a.id.localeCompare(b.id))[0]
  requireValue(cheaper, `Aim leader has no cheaper comparator: ${lang}/${stage}/${candidate.id}`)
  requireValue(
    mentions(decision.recommendation[lang], lang, cheaper.id) &&
      hasMetric(decision.recommendation[lang], lang, 'price', cheaper.price) &&
      directionPattern(lang, 'aim', 'more').test(decision.recommendation[lang]) &&
      !directionPattern(lang, 'aim', 'less').test(decision.recommendation[lang]),
    `Aim advice does not explain its advantage over the cheaper local option: ${lang}/${stage}/${candidate.id}/${cheaper.id}`,
  )
}

function checkBoundaryRecommendation(decision, lang, stage, candidate) {
  const copy = `${decision.label[lang]} ${decision.recommendation[lang]}`
  const farthest = {
    en: /least easily|hardest-to-break|strongest line/i,
    th: /สายขาดยากสุด/,
    ja: /最も切れにくい/,
  }[lang]
  requireValue(
    farthest.test(copy),
    `Boundary leader is not explained as the farthest option: ${lang}/${stage}/${candidate.id}`,
  )
}

function checkDominatedRecommendation(decision, lang, item, stage, expected) {
  const candidate = expected.localChoices.find((choice) => choice.id === item.id)
  if (expected.status !== 'dominated' || !candidate) return
  requireValue(
    decision.alternatives.some((alternative) => {
      const dominator = expected.localChoices.find((choice) => choice.id === alternative.id)
      return (
        dominator &&
        dominates(dominator, candidate) &&
        ['price', 'aim', 'boundary'].every((field) =>
          hasMetricNearId(
            decision.recommendation[lang],
            lang,
            dominator.id,
            field,
            dominator[field],
          ),
        )
      )
    }),
    `Dominating rod comparison missing: ${lang}/${stage}/${item.id}`,
  )
}

function priceNeighbor(choices, candidate, direction) {
  const isNeighbor = (choice) =>
    direction < 0 ? choice.price < candidate.price : choice.price > candidate.price
  return choices.filter(isNeighbor).sort((a, b) => direction * (a.price - b.price))[0]
}

function checkTradeoffRecommendation(decision, lang, item, stage, expected) {
  const candidate = expected.localChoices.find((choice) => choice.id === item.id)
  if (expected.status !== 'tradeoff' || !candidate) return
  const cheaper = priceNeighbor(expected.localChoices, candidate, -1)
  const dearer = priceNeighbor(expected.localChoices, candidate, 1)
  if (cheaper) {
    requireValue(
      mentions(decision.label[lang], lang, cheaper.id) &&
        cheaperPattern(lang).test(decision.label[lang]),
      `Cheaper local alternative not identified: ${lang}/${stage}/${item.id}/${cheaper.id}`,
    )
    checkDirectionalDifference(decision.label[lang], lang, candidate, cheaper, stage, item.id)
  }
  if (dearer) {
    const copy = decision.recommendation[lang]
    const comparison = clauseAfterId(copy, lang, dearer.id)
    requireValue(
      mentions(copy, lang, dearer.id) && hasMetric(comparison, lang, 'price', dearer.price),
      `Higher-priced rod omitted: ${lang}/${stage}/${item.id}/${dearer.id}`,
    )
    checkDirectionalDifference(comparison, lang, dearer, candidate, stage, item.id)
  }
}

function checkUnstockedRecommendations(decision, lang, item, stage, expected) {
  if (expected.status !== 'item-unstocked' && !expected.status.startsWith('style-')) return
  for (const choice of expected.choices)
    requireValue(
      mentions(decision.recommendation[lang], lang, choice.id),
      `Recorded local alternative omitted: ${lang}/${stage}/${item.id}/${choice.id}`,
    )
}

function checkMetricStatements(decision, lang, item, stage, expected) {
  checkCandidateMetrics(decision, lang, item, stage, expected)
  checkDominatedRecommendation(decision, lang, item, stage, expected)
  checkTradeoffRecommendation(decision, lang, item, stage, expected)
  checkUnstockedRecommendations(decision, lang, item, stage, expected)
  if (item.id === '04' && stage === 5) checkArea5Tradeoff(decision, lang, item)
}

function checkArea5Tradeoff(decision, lang, item) {
  const cheapRod = metrics(byId.get('09'))
  const copy = decision.label[lang]
  const candidate = metrics(item)
  const localCheapest = offersAt(5, styleOf(item)).sort((a, b) => a.price - b.price)[0]
  requireEqual(decision.status, 'tradeoff')
  requireEqual(localCheapest?.id, '09', 'Area 5 mixed-tradeoff baseline changed')
  requireValue(candidate.price > cheapRod.price && candidate.aim > cheapRod.aim)
  requireValue(candidate.boundary < cheapRod.boundary)
  requireValue(
    mentions(copy, lang, '09') &&
      directionPattern(lang, 'aim', 'more').test(copy) &&
      directionPattern(lang, 'boundary', 'less').test(copy) &&
      !directionPattern(lang, 'aim', 'less').test(copy) &&
      !directionPattern(lang, 'boundary', 'more').test(copy),
  )
}

function checkClaimScope(decision, lang, item, stage) {
  const copy = `${decision.recommendation[lang]} ${decision.reason[lang]} ${decision.scope[lang]}`
  requireValue(
    /Which fish a rod suits is on its own page|คันเหมาะกับปลาชนิดไหนดูในหน้าคันนั้น|どの魚に向くかは竿のページで確認できます/.test(
      decision.scope[lang],
    ),
    `Fish-suitability pointer missing: ${lang}/${stage}/${item.id}`,
  )
  requireValue(
    !/best for catching|easier to catch|จับปลาได้ง่ายกว่า|釣れやすい/.test(copy),
    `Unsupported catch claim: ${lang}/${stage}/${item.id}`,
  )
  if ([2, 4].includes(styleOf(item))) {
    const aimWords = {
      en: /aim/i,
      th: /เวลาเล็ง/,
      ja: /狙う時間/,
    }
    const hp100 = /HP\s*100/i
    requireValue(
      hp100.test(decision.recommendation[lang]),
      `Aim advice omits HP 100: ${lang}/${stage}/${item.id}`,
    )
    if (aimWords[lang].test(decision.label[lang]))
      requireValue(
        hp100.test(decision.label[lang]),
        `Visible aim label omits HP 100: ${lang}/${stage}/${item.id}`,
      )
  }
}

function checkLocalizedDecision(decision, lang, item, stage, expected) {
  checkDecisionFields(decision, lang, item, stage, expected)
  checkLocalPriceClaims(decision, lang, item, stage, expected)
  checkAlternativeSources(decision, lang, item, stage, expected)
  checkParetoAlternatives(decision, lang, item, stage, expected)
  checkMetricStatements(decision, lang, item, stage, expected)
  checkClaimScope(decision, lang, item, stage)
}

function checkInvalidStages() {
  for (const invalid of [0, 7, 3.5, 'not-a-stage', null]) {
    assert.equal(
      rodAreaDecision('th', byId.get('04'), data.items, invalid),
      null,
      `Invalid stage accepted: ${invalid}`,
    )
  }
}

checkSourceMatchesCatalogue()
checkInvalidStages()

export {
  data,
  rods,
  stockByStage,
  dominates,
  expectedDecision,
  checkLocalizedDecision,
  rodAreaDecision,
}
