import { raiseBase } from '../../src/entities/fight/fight-core.js'
import { startingFightValue } from '../../src/entities/fight/fight-setup.js'

// Every legal tackle for one fish and method, scored by the engine's own starting-value routine.

/** Start value that leaves `m` mistakes (the meter climbs 0, 1, 3, 7, 15, 31, 63). */
export const START_OF = [63, 31, 15, 7, 3, 1, 0]

/** One size from each band (<= 15 cm, 16..35 cm, > 35 cm): the start value only depends on the band. */
const BAND_SIZE = [15, 35, 36]
const SLOTS = {
  float: ['rod', 'hook', 'bait'],
  casting: ['rod', 'hook', 'bait'],
  lure: ['rod', 'lure'],
  fly: ['rod', 'fly'],
}
export const slotsOf = (method) => SLOTS[method]

/** Wasted beats that fill the meter from a start value (start 0 -> 6, start 3 -> 4, start 63 -> 0). */
export function mistakesOf(start) {
  let count = 0
  for (let value = start; value !== 63; value = raiseBase(value)) count += 1
  return count
}

/** How many whole-centimetre sizes of the fish fall in each band. */
export function bandCounts(fish) {
  const counts = [0, 0, 0]
  for (let size = fish.sizeLow; size <= fish.sizeHigh; size++)
    counts[size <= 15 ? 0 : size <= 35 ? 1 : 2] += 1
  return counts
}

function* product(lists, prefix = []) {
  if (!lists.length) yield prefix
  else for (const row of lists[0]) yield* product(lists.slice(1), [...prefix, row])
}

const priceOf = (catalog, slot, row) =>
  slot === 'fly'
    ? Math.min(...(catalog.stock.bodies[row.id] ?? [[0, 0, Infinity]]).map((b) => b[2]))
    : (catalog.stock.sold[slot][row.id]?.yen ?? Infinity)

function choicesOf(catalog, fish, method) {
  const { tables } = catalog
  const pool = {
    rod: catalog.rodsOf(method),
    hook: tables.hook,
    bait: catalog.takers(method, fish.id),
    lure: catalog.takers('lure', fish.id),
    fly: catalog.takers('fly', fish.id),
  }
  return slotsOf(method).map((slot) => pool[slot])
}

/** The mistakes vector of a kit, one entry per size band. */
export function kitMistakes(catalog, fish, method, rows) {
  const records = { fish }
  slotsOf(method).forEach((slot, i) => (records[slot] = rows[i]))
  return BAND_SIZE.map((size) => mistakesOf(startingFightValue(records, fish.id, size)))
}

const weighted = (counts, m) => counts.reduce((sum, n, band) => sum + n * m[band], 0)

const sameKit = (a, b) => a && b && a.ids.join() === b.ids.join()

/** Order two kits: the shorter key wins; `byPrice` puts the price before the score. */
function better(a, b, byPrice) {
  const key = (k) => [...(byPrice ? [k.yen, -k.score] : [-k.score, k.yen]), -k.reach, ...k.ids]
  const [x, y] = [key(a), key(b)]
  for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] < y[i]
  return false
}

const best = (kits, byPrice) =>
  kits.reduce((top, kit) => (!top || better(kit, top, byPrice) ? kit : top), null)

function track(state, slots, rows, m) {
  state.max = state.max.map((top, band) => Math.max(top, m[band]))
  state.min = state.min.map((low, band) => Math.min(low, m[band]))
  slots.forEach((slot, i) => {
    const seen = state.items[slot].get(rows[i].id) ?? [0, 0, 0]
    state.items[slot].set(
      rows[i].id,
      seen.map((top, band) => Math.max(top, m[band])),
    )
  })
}

/** Share of fights caught by a kit: its start value in each band, weighted by the fish's sizes. */
const expectedCatch = (counts, m, catchAt) =>
  counts.reduce((sum, n, band) => sum + (n ? n * catchAt(START_OF[m[band]]) : 0), 0) /
  counts.reduce((a, b) => a + b, 0)

/** Within this many points of the best simulated catch share counts as "enough". */
const ENOUGH_POINTS = 0.03

/** The purchasable picks: highest score (rods long enough), same with any rod, cheapest, "enough". */
function choose(kits, counts, options) {
  const { minReach = 0, catchAt } = options
  const long = kits.filter((kit) => kit.reach >= minReach)
  const top = best(kits, false)
  const buy = best(long.length ? long : kits, false)
  const picks = { buy, buyAny: sameKit(buy, top) ? null : top, cheap: best(kits, true) }
  if (catchAt && long.length) {
    const rated = long.map((kit) => ({ ...kit, expect: expectedCatch(counts, kit.m, catchAt) }))
    const floor = Math.max(...rated.map((kit) => kit.expect)) - ENOUGH_POINTS
    // cheapest first; among equal prices the higher catch share (as a score) wins
    const near = rated.filter((kit) => kit.expect >= floor)
    picks.enough = best(
      near.map((kit) => ({ ...kit, score: Math.round(kit.expect * 1e6) })),
      true,
    )
  }
  return picks
}

/**
 * Scores every legal kit of a fish and method and returns
 * - `max` / `min`: the best and worst mistakes-allowed per band, `items`: the best each item can still reach,
 * - `values`: every start value a kit can give (for sizes the fish really has),
 * - `buy`: the cheapest purchasable kit with the highest size-weighted score, using only rods of at
 *   least `minReach` (the rod range the fish needs); `buyAny`: the same with any rod when that
 *   gives a different kit; `cheap`: the cheapest purchasable kit of all; `enough`: the cheapest
 *   purchasable kit with a long enough rod whose simulated catch share (`catchAt(start)`) is
 *   within 3 points of the best such kit.
 * Returns null when no bait, lure or fly body of the fish's acceptance masks exists for the method.
 */
export function analyse(catalog, fish, method, options = {}) {
  const counts = bandCounts(fish)
  const slots = slotsOf(method)
  const state = {
    max: [0, 0, 0],
    min: [6, 6, 6],
    items: Object.fromEntries(slots.map((s) => [s, new Map()])),
  }
  const values = new Set()
  const buyable = []
  let any = false
  for (const rows of product(choicesOf(catalog, fish, method))) {
    const m = kitMistakes(catalog, fish, method, rows)
    any = true
    track(state, slots, rows, m)
    counts.forEach((n, band) => n && values.add(m[band]))
    const prices = slots.map((slot, i) => priceOf(catalog, slot, rows[i]))
    if (prices.every((yen) => yen !== Infinity))
      buyable.push({
        ids: rows.map((row) => row.id),
        m,
        score: weighted(counts, m),
        yen: prices.reduce((a, b) => a + b, 0),
        reach: rows[0].reach,
      })
  }
  if (!any) return null
  const picks = buyable.length ? choose(buyable, counts, options) : {}
  return { counts, slots, ...state, values: [...values].sort((a, b) => b - a), ...picks }
}
