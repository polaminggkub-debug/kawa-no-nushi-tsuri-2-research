import { maxView } from '../complete-guide/plan.mjs'
import { BAND_OF, BAND_SIZE, startNotch } from './rule.mjs'
import { priceIn } from './stock.mjs'

// Builds catalogue/gear-best.json: for every fish and every method the best kit (lowest fight
// start for the sizes the fish really has), a cheaper kit that is nearly as good, and the
// items that tie with the best one. Starts come from the proven rule in rule.mjs.

/** Rod styles per method: casting rods (2) fight like float rods, so bait kits may use either. */
const STYLES = { float: [1, 2], lure: [4], fly: [8] }
const ACCEPT = { float: 'bait', lure: 'lure', fly: 'fly' }
const NEAR = 1
/** A cheaper kit is only worth showing when it saves a fifth of the price. */
const SAVING = 0.8

/** Whole-centimetre sizes the fish really has, counted per band. */
function bandWeights({ low, high }) {
  const weights = [0, 0, 0]
  for (let size = low; size <= high; size++) weights[BAND_OF(size)] += 1
  return weights
}

function rodsFor(matrix, effects, price, fishId, method) {
  const need = effects.fish[fishId]?.methods[method]?.need ?? 0
  const sold = Object.entries(matrix.items.rod)
    .filter(([id, rod]) => STYLES[method].includes(rod.style) && price('rod', +id))
    .map(([id, rod]) => ({ id: +id, ...rod, ...price('rod', +id) }))
  const reaching = sold.filter((rod) => rod.reach >= need)
  return { need, rods: reaching.length ? reaching : sold }
}

/** Every second-slot candidate: { hook?, item, named, selector, yen }. */
function itemChoices(matrix, price, fish, method) {
  const slot = ACCEPT[method]
  const items = fish.accepts[slot]
    .map((id) => ({ id, ...price(slot, id) }))
    .filter((entry) => entry.yen != null)
  if (method !== 'float')
    return items.map(({ id, yen, at }) => ({
      item: id,
      at: { item: at },
      named: slot === 'lure' && matrix.items.lure[id].match === fish.id,
      selector: matrix.items[slot][id].sel,
      yen,
    }))
  const choices = []
  for (const [hookId, hook] of Object.entries(matrix.items.hook))
    for (const { id, yen, at } of items) {
      const named = hook.match === fish.id || matrix.items.bait[id].match === fish.id
      const hookPrice = price('hook', +hookId)
      if (!hookPrice) continue
      choices.push({
        hook: +hookId,
        item: id,
        named,
        selector: hook.sel,
        yen: yen + hookPrice.yen,
        at: { hook: hookPrice.at, item: at },
      })
    }
  return choices
}

function evaluate(fish, weights, rod, choice) {
  const starts = BAND_SIZE.map((_size, band) =>
    weights[band] ? startNotch(fish, band, { rod, ...choice }) : null,
  )
  const total = weights.reduce((sum, w) => sum + w, 0)
  const score = starts.reduce((sum, start, band) => sum + (start ?? 0) * weights[band], 0) / total
  return { starts, score, worst: Math.max(...starts.filter((n) => n != null)) }
}

const SIZE_CODE = ['small', 'medium', 'large']

/** Why each item is in the kit, as codes the page turns into one plain line each. */
function whyOf(matrix, fish, method, rod, choice) {
  const rodWhy = rod.match === fish.id ? 'named' : ['light', 'medium', 'heavy'][rod.class]
  const sizeWhy = SIZE_CODE[choice.selector] ?? 'plain'
  if (method !== 'float') return { rod: rodWhy, item: choice.named ? 'named' : sizeWhy }
  const baitNamed = matrix.items.bait[choice.item].match === fish.id
  const hookNamed = matrix.items.hook[choice.hook].match === fish.id
  return {
    rod: rodWhy,
    hook: hookNamed ? 'named' : baitNamed ? 'any' : sizeWhy,
    item: baitNamed ? 'named' : 'plain',
  }
}

function toKit(matrix, fish, method, { rod, choice, rating }) {
  const kit = { rod: rod.id, [ACCEPT[method]]: choice.item }
  const buy = { rod: rod.at, ...(choice.at.hook && { hook: choice.at.hook }), item: choice.at.item }
  if (choice.hook != null) kit.hook = choice.hook
  return {
    ...kit,
    reach: rod.reach,
    ...(fish.size.high > BIG && { big: true }),
    yen: rod.yen + choice.yen,
    starts: rating.starts,
    score: Math.round(rating.score * 100) / 100,
    why: whyOf(matrix, fish, method, rod, choice),
    buy,
  }
}

/** A fish that grows past the medium band runs far: among equal starts the longest line wins, then price. */
const BIG = BAND_SIZE[1]
const byReach = (a, b) => b.rod.reach - a.rod.reach

const betterFor = (fish) => (a, b) =>
  a.rating.score - b.rating.score ||
  a.rating.worst - b.rating.worst ||
  (fish.size.high > BIG ? byReach(a, b) : 0) ||
  a.yen - b.yen

function planMethod(matrix, effects, price, fish, method) {
  const choices = itemChoices(matrix, price, fish, method)
  if (!choices.length) return null
  const { need, rods } = rodsFor(matrix, effects, price, fish.id, method)
  const weights = bandWeights(fish.size)
  const all = []
  for (const rod of rods)
    for (const choice of choices)
      all.push({
        rod,
        choice,
        rating: evaluate(fish, weights, rod, choice),
        yen: rod.yen + choice.yen,
      })
  const better = betterFor(fish)
  const best = [...all].sort(better)[0]
  const cheap = all
    .filter(
      (entry) => entry.rating.score <= best.rating.score + NEAR && entry.yen <= best.yen * SAVING,
    )
    .sort((a, b) => a.yen - b.yen || better(a, b))[0]
  const kits = [toKit(matrix, fish, method, best)]
  if (cheap) kits.push(toKit(matrix, fish, method, cheap))
  return { need, kits, ties: ties(all, best, method) }
}

/** Items that keep the best score when swapped in alone, cheapest first (best item excluded). */
function ties(all, best, method) {
  const same = (entry) => entry.rating.score === best.rating.score
  const pick = (matches, key) =>
    [...new Map(matches.map((entry) => [key(entry), entry])).keys()].filter((id) => id != null)
  const sameRod = all.filter((e) => same(e) && e.choice === best.choice)
  const sameItem = all.filter((e) => same(e) && e.rod === best.rod)
  const result = {
    rod: pick(
      sameRod.sort((a, b) => a.rod.yen - b.rod.yen),
      (e) => e.rod.id,
    ),
    [ACCEPT[method]]: pick(
      sameItem.sort((a, b) => a.choice.yen - b.choice.yen),
      (e) => e.choice.item,
    ),
  }
  if (method === 'float') {
    const sameHook = all.filter(
      (e) => same(e) && e.rod === best.rod && e.choice.item === best.choice.item,
    )
    result.hook = pick(
      sameHook.sort((a, b) => a.choice.yen - b.choice.yen),
      (e) => e.choice.hook,
    )
  }
  for (const [slot, ids] of Object.entries(result)) {
    const own = best.rod.id
    result[slot] = ids
      .filter(
        (id) => id !== (slot === 'rod' ? own : best.choice[slot === 'hook' ? 'hook' : 'item']),
      )
      .slice(0, 6)
  }
  return result
}

/** The kit of a later stage worth showing under a stage's own kit: the first stage that reaches the overall best. */
function laterKit(plans, stage, own) {
  const target = plans[6]?.kits[0].score
  if (target == null || (own && target >= own.kits[0].score)) return null
  for (let later = stage + 1; later <= 6; later++)
    if (plans[later]?.kits[0].score <= target) return { stage: later, kit: plans[later].kits[0] }
  return null
}

function methodByStage(matrix, effects, prices, row, method, stages) {
  const plans = {}
  for (let stage = 1; stage <= 6; stage++)
    plans[stage] = planMethod(matrix, effects, prices[stage], row, method)
  if (!plans[6]) return null
  const byStage = {}
  for (const stage of stages)
    byStage[stage] = {
      ...(plans[stage] ?? { kits: [] }),
      later: laterKit(plans, stage, plans[stage]),
    }
  return { need: plans[6].need, stages: byStage }
}

export function buildGearBest(matrix, effects, maxSize, stock) {
  const prices = {}
  for (let stage = 1; stage <= 6; stage++) prices[stage] = priceIn(stock, effects, stage)
  const fish = {}
  for (const row of matrix.fish) {
    const rows = maxSize.rows.filter((entry) => entry.fish === row.id)
    const stages = [...new Set(rows.map((entry) => entry.map))].sort((a, b) => a - b)
    const methods = {}
    for (const method of Object.keys(STYLES)) {
      const plan = methodByStage(matrix, effects, prices, row, method, stages)
      if (plan) methods[method] = plan
    }
    fish[row.id] = {
      size: [row.size.low, row.size.high],
      weights: bandWeights(row.size),
      record: [row.record.min, row.record.max],
      base: row.baseNotch,
      rodFor: row.namedFor.rod,
      max: maxView(rows.slice(0, 1)),
      stages,
      methods,
    }
  }
  return { schema: 2, route: effects.routes.float, fish }
}
