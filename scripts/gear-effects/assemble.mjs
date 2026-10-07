import { METHODS } from './catalog.mjs'
import { STARTS } from './curves.mjs'
import { START_OF, analyse, bandCounts, slotsOf } from './enumerate.mjs'

// Turns the kit analyses into the compact stored document: per fish and method the best mistakes
// allowed, what each item of each slot can reach, the cheapest kits; per item where it is best or bad.

export const SIM_METHODS = ['float', 'casting']
const ITEM_KIND = { rod: 'rod', hook: 'hook', bait: 'bait', lure: 'lure', fly: 'fly' }
const BAD_LOSS = 1

const round1 = (value) => Math.round(value * 10) / 10
/** Bands without any size of the fish are reported as null. */
const bandsOf = (m, counts) => m.map((value, band) => (counts[band] ? value : null))
const lossOf = (vec, max, counts) =>
  counts.reduce((sum, n, band) => sum + n * (max[band] - vec[band]), 0) /
  counts.reduce((a, b) => a + b, 0)

function groupSlot(entries, counts) {
  const groups = new Map()
  for (const [id, vec] of entries) {
    const key = bandsOf(vec, counts).join()
    groups.set(key, [bandsOf(vec, counts), [...(groups.get(key)?.[1] ?? []), id]])
  }
  const score = ([vec]) => vec.reduce((sum, m, band) => sum + (m ?? 0) * counts[band], 0)
  return [...groups.values()]
    .map(([vec, ids]) => [vec, ids.sort((a, b) => a - b)])
    .sort((a, b) => score(b) - score(a) || a[1][0] - b[1][0])
}

function kitOut(kit, slots, counts) {
  if (!kit) return undefined
  const out = Object.fromEntries(slots.map((slot, i) => [slot, kit.ids[i]]))
  return { ...out, yen: kit.yen, reach: kit.reach, m: bandsOf(kit.m, counts) }
}

function methodRecord(result, { minReach, needFrom }) {
  const { counts, slots } = result
  const record = {
    max: bandsOf(result.max, counts),
    min: bandsOf(result.min, counts),
    starts: result.values.map((m) => START_OF[m]).sort((a, b) => a - b),
    slots: Object.fromEntries(slots.map((s) => [s, groupSlot(result.items[s], counts)])),
    buy: kitOut(result.buy, slots, counts),
    buyAny: kitOut(result.buyAny, slots, counts),
    enough: kitOut(result.enough, slots, counts),
    cheap: kitOut(result.cheap, slots, counts),
  }
  if (minReach) record.need = minReach
  if (needFrom) record.needFrom = needFrom
  return record
}

function itemTable(catalog) {
  const { tables, stock } = catalog
  const base = (kind, row) => ({
    yen: stock.sold[kind]?.[row.id]?.yen ?? null,
    areas: stock.sold[kind]?.[row.id]?.areas ?? [],
  })
  const items = { rod: {}, hook: {}, bait: {}, lure: {}, fly: {} }
  for (const rod of tables.rod)
    items.rod[rod.id] = {
      ...base('rod', rod),
      special: stock.sold.rod[rod.id]?.special ?? [],
      reach: rod.reach,
      sel: rod.selector,
      match: rod.fishMatch,
    }
  for (const hook of tables.hook)
    items.hook[hook.id] = { ...base('hook', hook), sel: hook.selector, match: hook.fishMatch }
  for (const bait of tables.bait)
    items.bait[bait.id] = { ...base('bait', bait), match: bait.fishMatch }
  for (const lure of tables.lure)
    items.lure[lure.id] = { ...base('lure', lure), sel: lure.selector, match: lure.fishMatch }
  for (const body of catalog.bodies) {
    const bundles = stock.bodies[body.id] ?? []
    const yen = bundles.length ? Math.min(...bundles.map((b) => b[2])) : null
    items.fly[body.id] = { yen, bundles, sel: body.selector, flag: body.flag }
  }
  return items
}

function addUsage(items, slot, method, fishId, result, { minReach = 0 }) {
  const { counts, max } = result
  for (const [id, vec] of result.items[slot]) {
    const entry = items[ITEM_KIND[slot]][id]
    const use = ((entry.use ??= {})[method] ??= { n: 0, loss: 0, best: [], bad: [] })
    if (slot === 'rod' && entry.reach < minReach) (use.short ??= []).push(fishId)
    const loss = lossOf(vec, max, counts)
    use.n += 1
    use.loss += loss
    if (loss === 0) use.best.push(fishId)
    else if (loss >= BAD_LOSS) use.bad.push(fishId)
  }
}

function finishUsage(items) {
  for (const group of Object.values(items))
    for (const entry of Object.values(group))
      for (const use of Object.values(entry.use ?? {})) use.loss = round1(use.loss / use.n)
}

/** Cheapest float (ids 1..8, used by float rods) and sinker (ids 9..10, used by casting rods) on sale. */
function routeItems(catalog) {
  const cheapest = (ids) =>
    ids
      .map((id) => ({ id, ...catalog.stock.sold.float[id] }))
      .filter((item) => item.yen !== undefined)
      .sort((a, b) => a.yen - b.yen || a.id - b.id)[0]
  return { float: cheapest([1, 2, 3, 4, 5, 6, 7, 8]), casting: cheapest([9, 10]) }
}

/** The reach a fish needs: simulated for float and casting, borrowed from them for lures and flies. */
function reachOptions(sims, fishId, method) {
  const sim = sims[`${fishId}|${method}`]
  if (sim) return { minReach: sim.need, catchAt: (start) => sim.curve[start][0] / STARTS }
  const from = SIM_METHODS.find((other) => sims[`${fishId}|${other}`])
  return from ? { minReach: sims[`${fishId}|${from}`].need, needFrom: from } : {}
}

/** `sims` maps "fishId|method" to { need, curve } (see curves.mjs). */
export function assemble(catalog, sims) {
  const fish = {}
  const items = itemTable(catalog)
  for (const row of catalog.fishList) {
    const methods = {}
    for (const method of METHODS) {
      const options = reachOptions(sims, row.id, method)
      const result = analyse(catalog, row, method, options)
      if (!result) continue
      methods[method] = methodRecord(result, options)
      for (const slot of slotsOf(method)) addUsage(items, slot, method, row.id, result, options)
    }
    if (Object.keys(methods).length)
      fish[row.id] = {
        size: [row.sizeLow, row.sizeHigh],
        n: bandCounts(row),
        base: row.fightStart,
        methods,
      }
  }
  finishUsage(items)
  return { routes: routeItems(catalog), fish, items }
}
