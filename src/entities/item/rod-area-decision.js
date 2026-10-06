import { rodAreaCopy, rodAreaScope } from './rod-area-copy.js'
import { rememberRod, rodRefName } from './rod-ref-name.js'
import {
  areaRodLabel,
  boundaryPeerContext,
  dominatedReason,
  higherPriceDescription,
  tradeoffDescription,
} from './rod-area-label.js'

const LOCALES = ['en', 'th', 'ja']
const STYLES = { 1: 'Float/Ayu', 2: 'Casting', 4: 'Lure', 8: 'Fly' }

function validStage(value) {
  const stage = Number(value)
  return Number.isInteger(stage) && stage >= 1 && stage <= 6 ? stage : 0
}

function styleCode(item) {
  const style = Number(item.decodedFields?.styleCode)
  return Object.hasOwn(STYLES, style) ? style : 0
}

function rodMetrics(item) {
  const values = {
    price: Number(item.priceYen),
    aim: Number(item.decodedFields?.castAimHoldCutoffInternal),
    boundary: Number(item.decodedFields?.rangeMultiplier),
  }
  if (!Object.values(values).every(Number.isFinite)) return null
  rememberRod(item)
  return { ...values, id: item.id, item }
}

function localStyleOffers(item, allItems, stage) {
  const style = styleCode(item)
  return allItems
    .filter(
      (candidate) =>
        candidate.category === 'rod' &&
        styleCode(candidate) === style &&
        candidate.playerUse?.shops?.some((offer) => Number(offer.stage) === stage),
    )
    .map(rodMetrics)
    .filter(Boolean)
    .sort((a, b) => a.id.localeCompare(b.id))
}

function dominates(first, second) {
  return (
    first.id !== second.id &&
    first.price <= second.price &&
    first.aim >= second.aim &&
    first.boundary >= second.boundary &&
    (first.price < second.price || first.aim > second.aim || first.boundary > second.boundary)
  )
}

function dominators(candidate, choices) {
  return choices
    .filter((choice) => dominates(choice, candidate))
    .sort(
      (a, b) =>
        a.price - b.price || b.aim - a.aim || b.boundary - a.boundary || a.id.localeCompare(b.id),
    )
}

function extremes(choices) {
  return {
    cheapest: Math.min(...choices.map((choice) => choice.price)),
    aim: Math.max(...choices.map((choice) => choice.aim)),
    boundary: Math.max(...choices.map((choice) => choice.boundary)),
  }
}

function offerPrice(lang, price) {
  return lang === 'ja' ? `${price}円` : `¥${price}`
}

function offerStats(lang, choice) {
  const hpNote = aimCondition(lang, choice.item)
  if (lang === 'th')
    return `${offerPrice(lang, choice.price)} · เวลาเล็ง ${choice.aim}${hpNote} · สายขาดยาก ×${choice.boundary}`
  if (lang === 'ja')
    return `${offerPrice(lang, choice.price)}・狙う時間${choice.aim}${hpNote}・切れにくさ×${choice.boundary}`
  return `${offerPrice(lang, choice.price)} · aim ${choice.aim}${hpNote} · line strength ×${choice.boundary}`
}

function aimCondition(lang, item) {
  if (![2, 4].includes(styleCode(item))) return ''
  return lang === 'th' ? ' (ที่ HP 100)' : lang === 'ja' ? '（HP100のとき）' : ' (at HP 100)'
}

function localized(valueForLocale) {
  return Object.fromEntries(LOCALES.map((lang) => [lang, valueForLocale(lang)]))
}

function text(lang, type, key, values) {
  return rodAreaCopy(lang, type, key, values)
}

function leader(choices, field) {
  const value =
    field === 'price'
      ? Math.min(...choices.map((choice) => choice.price))
      : Math.max(...choices.map((choice) => choice[field]))
  return choices.find((choice) => choice[field] === value)
}

function leaderSentence(lang, field, candidate, choices) {
  const best = leader(choices, field)
  const key = field === 'aim' ? 'aim' : field === 'boundary' ? 'boundary' : 'budget'
  const sentenceKey = best.id === candidate.id ? `${key}Leader` : `${key}Other`
  return text(lang, 'recommendation', sentenceKey, {
    id: best.id,
    stats: offerStats(lang, best),
    hpNote: '',
  })
}

function tradeoffNeighbors(candidate, choices) {
  const lower = choices
    .filter((choice) => choice.price < candidate.price)
    .sort((a, b) => b.price - a.price || a.id.localeCompare(b.id))[0]
  const higher = choices
    .filter((choice) => choice.price > candidate.price)
    .sort((a, b) => a.price - b.price || a.id.localeCompare(b.id))[0]
  return { lower, higher }
}

function localStatus(candidate, choices, best) {
  if (choices.length === 1) return 'only'
  if (best) return 'dominated'
  const tops = extremes(choices)
  if (
    candidate.price === tops.cheapest &&
    candidate.aim === tops.aim &&
    candidate.boundary === tops.boundary
  )
    return 'dual'
  if (candidate.price === tops.cheapest) return 'cheapest'
  if (candidate.aim === tops.aim) return 'aim'
  if (candidate.boundary === tops.boundary) return 'boundary'
  return 'tradeoff'
}

function localRecommendation(lang, status, candidate, choices, stage, best) {
  const values = localRecommendationValues(lang, candidate, stage)
  const basic = simpleLocalRecommendation(lang, status, candidate, choices, best, values)
  return basic || tradeoffRecommendation(lang, candidate, choices, values)
}

function localRecommendationValues(lang, candidate, stage) {
  return {
    area: text(lang, 'recommendation', 'area', { stage }),
    stage,
    id: candidate.id,
    style: text(lang, 'styles', String(styleCode(candidate.item)), {}),
    price: offerPrice(lang, candidate.price),
    aim: candidate.aim,
    boundary: candidate.boundary,
    stats: offerStats(lang, candidate),
    hpNote: aimCondition(lang, candidate.item),
  }
}

function simpleLocalRecommendation(lang, status, candidate, choices, best, values) {
  if (status === 'only') return text(lang, 'recommendation', 'only', values)
  if (status === 'dominated')
    return text(lang, 'recommendation', 'dominated', {
      ...values,
      otherId: best.id,
      otherStats: offerStats(lang, best),
      betterReason: dominatedReason(lang, candidate, best),
    })
  if (status === 'dual') return text(lang, 'recommendation', 'dual', values)
  if (status === 'cheapest') return cheapestRecommendation(lang, candidate, choices, values)
  if (status === 'aim') return aimRecommendation(lang, candidate, choices, values)
  if (status === 'boundary') return boundaryRecommendation(lang, candidate, choices, values)
  return ''
}

function cheapestRecommendation(lang, candidate, choices, values) {
  return text(lang, 'recommendation', 'cheapest', {
    ...values,
    aimLine: leaderSentence(lang, 'aim', candidate, choices),
    boundaryLine: leaderSentence(lang, 'boundary', candidate, choices),
  })
}

function aimRecommendation(lang, candidate, choices, values) {
  const budget = leader(choices, 'price')
  if (budget.id !== candidate.id) {
    return text(lang, 'recommendation', 'aimChoice', {
      ...values,
      lowerId: budget.id,
      lowerPrice: offerPrice(lang, budget.price),
      comparison: tradeoffDescription(lang, candidate, budget),
    })
  }
  return text(lang, 'recommendation', 'aim', {
    ...values,
    budgetLine: leaderSentence(lang, 'price', candidate, choices),
    boundaryLine: leaderSentence(lang, 'boundary', candidate, choices),
  })
}

function boundaryRecommendation(lang, candidate, choices, values) {
  const maximum = Math.max(...choices.map((choice) => choice.boundary))
  const peer = boundaryPeerContext(choices, maximum)
  if (peer?.cheapest.id === candidate.id && peer.aimLeader.id !== candidate.id) {
    return text(lang, 'recommendation', 'boundaryPeerCheapest', {
      ...values,
      otherId: peer.aimLeader.id,
      otherPrice: offerPrice(lang, peer.aimLeader.price),
      otherAim: peer.aimLeader.aim,
      hpNote: aimCondition(lang, peer.aimLeader.item),
    })
  }
  if (peer?.aimLeader.id === candidate.id && peer.cheapest.id !== candidate.id) {
    return text(lang, 'recommendation', 'boundaryPeerAim', {
      ...values,
      otherId: peer.cheapest.id,
      otherPrice: offerPrice(lang, peer.cheapest.price),
      hpNote: aimCondition(lang, candidate.item),
    })
  }
  return text(lang, 'recommendation', 'boundary', {
    ...values,
    budgetLine: leaderSentence(lang, 'price', candidate, choices),
    aimLine: leaderSentence(lang, 'aim', candidate, choices),
  })
}

function tradeoffRecommendation(lang, candidate, choices, values) {
  const { lower, higher } = tradeoffNeighbors(candidate, choices)
  return text(lang, 'recommendation', 'tradeoffChoice', {
    ...values,
    lowerId: lower?.id || leader(choices, 'price').id,
    comparison: tradeoffDescription(lang, candidate, lower || leader(choices, 'price')),
    higherLine: higher
      ? higherPriceDescription(lang, higher, candidate)
      : leaderSentence(lang, 'aim', candidate, choices),
  })
}

function alternativesFor(candidate, choices, isStocked) {
  if (!isStocked) return choices.map((choice) => ({ category: 'rod', id: choice.id }))
  const alternatives = []
  const best = dominators(candidate, choices)[0]
  const add = (choice) => {
    if (choice && choice.id !== candidate.id && !alternatives.some((ref) => ref.id === choice.id))
      alternatives.push({ category: 'rod', id: choice.id })
  }
  add(best)
  add(leader(choices, 'price'))
  add(leader(choices, 'aim'))
  add(leader(choices, 'boundary'))
  const { lower, higher } = tradeoffNeighbors(candidate, choices)
  add(lower)
  add(higher)
  return alternatives
}

function stockAtStage(allItems, style, stage) {
  const source = allItems.find((item) => item.category === 'rod' && styleCode(item) === style)
  return source ? localStyleOffers(source, allItems, stage) : []
}

function nextRecordedStage(allItems, style, stage) {
  const stages = allItems
    .filter((item) => item.category === 'rod' && styleCode(item) === style)
    .flatMap((item) => (item.playerUse?.shops || []).map((offer) => Number(offer.stage)))
    .filter((area) => Number.isInteger(area) && area >= 1 && area <= 6)
    .sort((a, b) => a - b)
  const next = stages.find((area) => area > stage)
  return next || stages.filter((area) => area < stage).at(-1) || 0
}

function localeOptions(lang, choices) {
  return choices
    .map((choice) => `${rodRefName(lang, choice.id)} (${offerStats(lang, choice)})`)
    .join(lang === 'ja' ? '、' : '; ')
}

function decisionResult(
  status,
  stage,
  style,
  labelFor,
  recommendationFor,
  alternatives,
  nextStockStage = 0,
) {
  return {
    status,
    stage,
    label: localized(labelFor),
    recommendation: localized(recommendationFor),
    reason: localized((lang) => text(lang, 'recommendation', 'reason', {})),
    scope: localized((lang) => rodAreaScope(lang, style)),
    alternatives,
    nextStockStage,
  }
}

function areaValues(lang, stage) {
  return {
    stage,
    area: text(lang, 'recommendation', 'area', { stage }),
  }
}

function unstockedItem(item, choices, stage, style) {
  const status = 'item-unstocked'
  const area = localized((lang) => text(lang, 'recommendation', 'area', { stage }))
  const budget = leader(choices, 'price')
  return decisionResult(
    status,
    stage,
    style,
    (lang) =>
      text(lang, 'labels', 'itemMissing', {
        stage,
        area: area[lang],
        id: item.id,
        budgetId: budget.id,
        budgetPrice: offerPrice(lang, budget.price),
      }),
    (lang) =>
      text(lang, 'recommendation', 'itemMissing', {
        id: item.id,
        stage,
        area: area[lang],
        style: text(lang, 'styles', String(style), {}) || STYLES[style],
        options: localeOptions(lang, choices),
        hpNote: aimCondition(lang, item),
        budgetLine: leaderSentence(lang, 'price', budget, choices),
        aimLine: leaderSentence(lang, 'aim', leader(choices, 'aim'), choices),
        boundaryLine: leaderSentence(lang, 'boundary', leader(choices, 'boundary'), choices),
      }),
    alternativesFor(null, choices, false),
  )
}

function noStyleStock(item, allItems, stage, style) {
  const nextStage = nextRecordedStage(allItems, style, stage)
  const choices = nextStage ? stockAtStage(allItems, style, nextStage) : []
  const direction = nextStage > stage ? 'next' : 'previous'
  const status = choices.length ? 'style-unstocked' : 'style-never-stocked'
  const key = choices.length ? 'styleMissing' : 'styleNever'
  const labelKey = choices.length ? 'styleMissing' : 'styleNever'
  const result = decisionResult(
    status,
    stage,
    style,
    (lang) =>
      text(lang, 'labels', labelKey, {
        ...areaValues(lang, stage),
        nextStage,
        nextId: choices[0]?.id || '',
        direction: text(lang, 'recommendation', direction, {}),
      }),
    (lang) =>
      text(lang, 'recommendation', key, {
        id: item.id,
        ...areaValues(lang, stage),
        nextStage,
        nextId: choices[0]?.id || '',
        direction: text(lang, 'recommendation', direction, {}),
        style: text(lang, 'styles', String(style), {}) || STYLES[style],
        options: localeOptions(lang, choices),
        hpNote: aimCondition(lang, item),
      }),
    alternativesFor(null, choices, false),
    nextStage,
  )
  return result
}

export function rodAreaDecision(_lang, item, allItems, selectedArea) {
  rememberRod(item)
  const stage = validStage(selectedArea)
  const style = styleCode(item)
  if (!stage || item.category !== 'rod' || !style) return null
  const choices = localStyleOffers(item, allItems, stage)
  if (!choices.length) return noStyleStock(item, allItems, stage, style)
  const candidate = choices.find((choice) => choice.id === item.id)
  if (!candidate) return unstockedItem(item, choices, stage, style)
  const better = dominators(candidate, choices)[0]
  const status = localStatus(candidate, choices, better)
  return decisionResult(
    status,
    stage,
    style,
    (lang) => areaRodLabel(lang, status, candidate, choices, stage, better),
    (lang) => localRecommendation(lang, status, candidate, choices, stage, better),
    alternativesFor(candidate, choices, true),
  )
}
