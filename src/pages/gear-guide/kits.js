// Pure kit logic over data/gear-effects.json: no DOM, no names.

const SLOTS = ['rod', 'hook', 'bait', 'lure', 'fly']
/** A fresh save's hidden fly lock: bodies with id % 4 == 1 and wings with id % 4 == 2 never bite. */
const DEAD_BODY_CLASS = 1
const DEAD_WING_CLASS = 2
/** Ready-made fly bundles that pass the fresh-save lock, as [area, slot, yen, wing, tail]. */
export function liveBundles(effects, flyId) {
  if (flyId % 4 === DEAD_BODY_CLASS) return []
  return effects.items.fly[flyId].bundles.filter((bundle) => bundle[3] % 4 !== DEAD_WING_CLASS)
}

const cheapest = (bundles) => Math.min(...bundles.map((bundle) => bundle[2]))

/** The band (<=15, 16..35, >35 cm) that most of the fish's sizes fall in. */
export function mainBand(fish) {
  return fish.n.indexOf(Math.max(...fish.n))
}

/** Lowest and highest mistakes allowed over the size bands the fish actually has. */
export function mistakeRange(fish, kit) {
  const values = kit.m.filter((value, band) => value != null && fish.n[band] > 0)
  return [Math.min(...values), Math.max(...values)]
}

/** Simulated landing outcome for a kit's starting point (float and casting only). */
export function catchStats(effects, fish, method, kit) {
  const sim = fish.methods[method].sim
  if (!sim) return null
  const m = kit.m[mainBand(fish)] ?? mistakeRange(fish, kit)[0]
  const row = sim.curve[String(effects.meta.startOf[m])]
  if (!row) return null
  const total = effects.sample.starts
  const [caught, escaped, lost, unfinished] = row.map((count) => (count / total) * 100)
  return { caught, escaped, lost, unfinished }
}

/** Swap a fly that a fresh save blocks for the cheapest working fly of the best group. */
export function workingFlyKit(effects, fish, kit) {
  if (liveBundles(effects, kit.fly).length) return { kit, swappedFrom: null }
  const rodYen = effects.items.rod[kit.rod].yen
  for (const [m, ids] of fish.methods.fly.slots.fly) {
    const options = ids
      .filter((id) => liveBundles(effects, id).length)
      .map((id) => ({ id, yen: cheapest(liveBundles(effects, id)) }))
      .sort((a, b) => a.yen - b.yen || a.id - b.id)
    if (options.length)
      return {
        kit: { ...kit, fly: options[0].id, yen: rodYen + options[0].yen, m },
        swappedFrom: kit.fly,
      }
  }
  return { kit, swappedFrom: kit.fly }
}

/** Where an item is sold: areas, plus the special rod merchants' areas. */
function placeOf(effects, slot, id, flyId = id) {
  const item = effects.items[slot][id]
  if (slot !== 'fly') return { yen: item.yen, areas: item.areas, special: item.special ?? [] }
  const bundles = liveBundles(effects, flyId)
  const pool = bundles.length ? bundles : item.bundles
  const yen = cheapest(pool)
  const areas = [...new Set(pool.filter((bundle) => bundle[2] === yen).map((bundle) => bundle[0]))]
  return { yen, areas: areas.sort((a, b) => a - b), special: [] }
}

export function kitRows(effects, kit) {
  return SLOTS.filter((slot) => kit[slot] != null).map((slot) => ({
    slot,
    id: kit[slot],
    ...placeOf(effects, slot, kit[slot]),
  }))
}

/** The float or sinker the route needs: not in the kit price. */
export function routeItem(effects, method) {
  const route = effects.routes[method]
  return route ? { slot: method === 'float' ? 'float_weight' : 'sinker', ...route } : null
}

/** Rods that would give the most room but are never sold (only when no sold rod is as good). */
export function neverSoldRods(effects, fish, method) {
  const best = fish.methods[method].slots.rod[0]?.[1] ?? []
  return best.every((id) => effects.items.rod[id].yen == null) ? best : []
}

/** Recommended kits for each way to catch a fish: the best buy, and a cheaper one when it is close. */
export function planFish(effects, fishId) {
  const fish = effects.fish[fishId]
  return effects.meta.methods
    .filter((method) => fish.methods[method])
    .map((method) => {
      const data = fish.methods[method]
      let swappedFrom = null
      let best = data.buy
      if (method === 'fly') ({ kit: best, swappedFrom } = workingFlyKit(effects, fish, best))
      const kits = [{ role: 'buy', kit: best }]
      if (data.enough && data.enough.yen < best.yen) kits.push({ role: 'enough', kit: data.enough })
      return {
        method,
        need: data.need,
        swappedFrom,
        neverSold: neverSoldRods(effects, fish, method),
        kits: kits.map(({ role, kit }) => ({
          role,
          kit,
          rows: kitRows(effects, kit),
          range: mistakeRange(fish, kit),
          stats: catchStats(effects, fish, method, kit),
        })),
      }
    })
}
