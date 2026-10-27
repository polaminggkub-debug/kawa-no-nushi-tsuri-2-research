import { liveBundles } from '../../src/pages/gear-guide/kits.js'
import { maxView } from '../complete-guide/plan.mjs'
import { BAND_OF, BAND_SIZE, startNotch } from './rule.mjs'

// Builds catalogue/gear-best.json: for every fish and every method the best kit (lowest fight
// start for the sizes the fish really has), a cheaper kit that is nearly as good, and the
// items that tie with the best one. Starts come from the proven rule in rule.mjs.

const STYLE = { float: 1, lure: 4, fly: 8 }
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

/** Cheapest ready-made fly set that passes a fresh save's lock, or null. */
function flyYen(effects, id) {
  const bundles = liveBundles(effects, id)
  return bundles.length ? Math.min(...bundles.map((bundle) => bundle[2])) : null
}

function slotYen(effects, slot, id) {
  return slot === 'fly' ? flyYen(effects, id) : (effects.items[slot][id]?.yen ?? null)
}

function rodsFor(matrix, effects, fishId, method) {
  const need = effects.fish[fishId]?.methods[method]?.need ?? 0
  const sold = Object.entries(matrix.items.rod)
    .filter(([id, rod]) => rod.style === STYLE[method] && effects.items.rod[id].yen != null)
    .map(([id, rod]) => ({ id: +id, ...rod, yen: effects.items.rod[id].yen }))
  const reaching = sold.filter((rod) => rod.reach >= need)
  return { need, rods: reaching.length ? reaching : sold }
}

/** Every second-slot candidate: { hook?, item, named, selector, yen }. */
function itemChoices(matrix, effects, fish, method) {
  const slot = ACCEPT[method]
  const items = fish.accepts[slot]
    .map((id) => ({ id, yen: slotYen(effects, slot, id) }))
    .filter((entry) => entry.yen != null)
  if (method !== 'float')
    return items.map(({ id, yen }) => ({
      item: id,
      named: slot === 'lure' && matrix.items.lure[id].match === fish.id,
      selector: matrix.items[slot][id].sel,
      yen,
    }))
  const choices = []
  for (const [hookId, hook] of Object.entries(matrix.items.hook))
    for (const { id, yen } of items) {
      const named = hook.match === fish.id || matrix.items.bait[id].match === fish.id
      const hookYen = effects.items.hook[hookId].yen
      choices.push({ hook: +hookId, item: id, named, selector: hook.sel, yen: yen + hookYen })
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
  if (choice.hook != null) kit.hook = choice.hook
  return {
    ...kit,
    yen: rod.yen + choice.yen,
    starts: rating.starts,
    score: Math.round(rating.score * 100) / 100,
    why: whyOf(matrix, fish, method, rod, choice),
  }
}

const better = (a, b) =>
  a.rating.score - b.rating.score || a.rating.worst - b.rating.worst || a.yen - b.yen

function planMethod(matrix, effects, fish, method) {
  const choices = itemChoices(matrix, effects, fish, method)
  if (!choices.length) return null
  const { need, rods } = rodsFor(matrix, effects, fish.id, method)
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

export function buildGearBest(matrix, effects, maxSize) {
  const fish = {}
  for (const row of matrix.fish) {
    const methods = {}
    for (const method of Object.keys(STYLE)) {
      const plan = planMethod(matrix, effects, row, method)
      if (plan) methods[method] = plan
    }
    fish[row.id] = {
      size: [row.size.low, row.size.high],
      weights: bandWeights(row.size),
      record: [row.record.min, row.record.max],
      base: row.baseNotch,
      rodFor: row.namedFor.rod,
      max: maxView(maxSize.rows.filter((entry) => entry.fish === row.id).slice(0, 1)),
      methods,
    }
  }
  return { schema: 1, route: effects.routes.float, fish }
}
