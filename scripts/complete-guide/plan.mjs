import { BAND_OF, BAND_SIZE, startNotch } from '../gear-best/rule.mjs'

// Builds the complete-guide plan: for every stage (1-6) and every method, what the shops sell,
// the easiest kit for the stage's fish and the best kit per fish. Starts come from the proven
// rule in gear-best/rule.mjs (docs/gear-fish-matrix.md); the stock comes from data/shop-stock-rom.json.

export const METHODS = ['float', 'sinker', 'casting', 'lure', 'fly']
/** Rod style per method (matrix rod.style): float rods 1, casting rods 2, lure rods 4, fly rods 8. */
const STYLE = { float: 1, sinker: 2, casting: 2, lure: 4, fly: 8 }
/** Surface lures never took a big fish in 240 trials (docs/big-fish-method-proof.md). */
const SURFACE_LURES = ['Topwater', 'Shallow runner', 'Deep diver', 'Soft frog']
const SINKING_LURES = ['Spinner', 'Spoon', 'Sinking vibration', 'Jig', 'Soft claw', 'Spinnerbait']
const SLOW_PICKS = 40
/** A budget kit may start this many notches harder on average than the easiest kit. */
const BUDGET_SLACK = 0.5

const dec = (hex) => parseInt(hex, 16)

function stockOf(stock, stage) {
  const by = {}
  for (const [key, rows] of Object.entries(stock.items)) {
    const [category, hex] = key.split(':')
    const rows_ = rows.filter((row) => row.stage === stage)
    if (!rows_.length) continue
    ;(by[category] ??= []).push({ id: dec(hex), rows: rows_ })
  }
  return by
}

function weightsOf({ low, high }) {
  const weights = [0, 0, 0]
  for (let size = low; size <= high; size++) weights[BAND_OF(size)] += 1
  return weights
}

function rate(fish, rod, named, selector) {
  const weights = weightsOf(fish.size)
  const total = weights.reduce((sum, w) => sum + w, 0)
  const starts = BAND_SIZE.map((_s, band) =>
    weights[band] ? startNotch(fish, band, { rod, named, selector }) : null,
  )
  const score = starts.reduce((sum, n, band) => sum + (n ?? 0) * weights[band], 0) / total
  return { starts, score, worst: Math.max(...starts.filter((n) => n != null)) }
}

const better = (a, b) =>
  a.rating.score - b.rating.score || a.rating.worst - b.rating.worst || a.yen - b.yen

/** The stocked parts for one method at one stage, as matrix rows with prices. */
function parts(matrix, stocked, stage, method) {
  const pick = (category, table) =>
    (stocked[category] ?? []).map(({ id }) => ({ id, ...matrix.items[table][id] }))
  const rods = pick('rod', 'rod').filter((rod) => rod.style === STYLE[method])
  if (method === 'fly') {
    const flies = (stocked.fly ?? []).flatMap(({ rows }) => rows).map((row) => row.bundle)
    const bodies = new Map()
    for (const bundle of flies) {
      const id = dec(bundle.body)
      const yen = bundle.shopPriceYen
      if (!bodies.has(id) || bodies.get(id).price > yen)
        bodies.set(id, { id, ...matrix.items.fly[id], price: yen })
    }
    return { rods, items: [...bodies.values()], hooks: [], weights: [null] }
  }
  const weights = pick('float_weight', 'float').filter((w) =>
    method === 'float' ? w.route === 'float' : w.route === 'sinker',
  )
  const items = method === 'lure' ? pick('lure', 'lure') : pick('bait', 'bait')
  const hooks = method === 'lure' ? [] : pick('hook', 'hook')
  return { rods, items, hooks, weights: method === 'lure' ? [null] : weights }
}

const ACCEPT = {
  float: 'bait',
  sinker: 'baitSinker',
  casting: 'baitSinker',
  lure: 'lure',
  fly: 'fly',
}

function choicesFor(matrix, fish, method, p) {
  const accepted = new Set(fish.accepts[ACCEPT[method]])
  const items = p.items.filter((item) => accepted.has(item.id))
  const out = []
  for (const item of items) {
    if (method === 'lure')
      out.push({ item, hook: null, named: item.match === fish.id, selector: item.sel })
    else if (method === 'fly') out.push({ item, hook: null, named: false, selector: item.sel })
    else
      for (const hook of p.hooks)
        out.push({
          item,
          hook,
          named: hook.match === fish.id || item.match === fish.id,
          selector: hook.sel,
        })
  }
  return out
}

function entry(rod, choice, rating) {
  const yen = rod.price + choice.item.price + (choice.hook?.price ?? 0)
  return { rod, choice, rating, yen }
}

function bestFor(matrix, fish, method, p) {
  const all = []
  for (const rod of p.rods)
    for (const choice of choicesFor(matrix, fish, method, p))
      all.push(
        entry(
          { ...rod, class: rod.class, match: rod.match },
          choice,
          rate(fish, rod, choice.named, choice.selector),
        ),
      )
  return all.sort(better)[0] ?? null
}

const idOf = (e) => ({
  rod: e.rod.id,
  hook: e.choice.hook?.id ?? null,
  item: e.choice.item.id,
  starts: e.rating.starts,
  score: Math.round(e.rating.score * 100) / 100,
})

/** One kit for the whole stage: covers the most fish, then the easiest start on average, then the cheapest. */
function stageKit(matrix, fishList, method, p) {
  const combos = new Map()
  for (const rod of p.rods)
    for (const item of p.items)
      for (const hook of p.hooks.length ? p.hooks : [null]) {
        const key = `${rod.id}/${hook?.id ?? '-'}/${item.id}`
        let covered = 0
        let sum = 0
        for (const fish of fishList) {
          if (!fish.accepts[ACCEPT[method]].includes(item.id)) continue
          const named =
            method === 'fly'
              ? false
              : method === 'lure'
                ? item.match === fish.id
                : hook?.match === fish.id || item.match === fish.id
          const selector = method === 'lure' || method === 'fly' ? item.sel : hook.sel
          covered += 1
          sum += rate(fish, rod, named, selector).score
        }
        if (covered)
          combos.set(key, {
            rod,
            hook,
            item,
            covered,
            mean: sum / covered,
            yen: rod.price + item.price + (hook?.price ?? 0),
          })
      }
  const sorted = [...combos.values()].sort(
    (a, b) => b.covered - a.covered || a.mean - b.mean || a.yen - b.yen,
  )
  const top = sorted[0]
  if (!top) return null
  const budget = sorted
    .filter((c) => c.covered === top.covered && c.mean <= top.mean + BUDGET_SLACK)
    .sort((a, b) => a.yen - b.yen || a.mean - b.mean)[0]
  return { ...kitOf(top), budget: budget === top ? null : kitOf(budget) }
}

const kitOf = (c) => ({
  rod: c.rod.id,
  hook: c.hook?.id ?? null,
  item: c.item.id,
  covered: c.covered,
  mean: Math.round(c.mean * 100) / 100,
  yen: c.yen,
})

function lureKind(matrix, id) {
  const name = matrix.items.lure[id].name.en
  if (SINKING_LURES.includes(name)) return 'sinking'
  if (SURFACE_LURES.includes(name)) return 'surface'
  return 'untested'
}

function partsView(matrix, p, method) {
  const rods = p.rods.map((r) => ({
    id: r.id,
    yen: r.price,
    cls: r.class,
    reach: r.reach,
    match: r.match,
  }))
  const view = { rods, weights: p.weights.filter(Boolean).map((w) => ({ id: w.id, yen: w.price })) }
  view.items = p.items.map((i) => ({
    id: i.id,
    yen: i.price,
    sel: i.sel ?? null,
    kind: method === 'lure' ? lureKind(matrix, i.id) : null,
  }))
  view.hooks = p.hooks.map((h) => ({ id: h.id, yen: h.price, sel: h.sel, match: h.match }))
  return view
}

function methodPlan(matrix, fishList, method, p) {
  const missing = !p.rods.length
    ? 'rod'
    : !p.items.length
      ? 'item'
      : !p.weights.length
        ? 'weight'
        : null
  if (missing) return { available: false, missing }
  const per = {}
  for (const fish of fishList) {
    const best = bestFor(matrix, fish, method, p)
    if (best) per[fish.id] = idOf(best)
  }
  return {
    available: true,
    parts: partsView(matrix, p, method),
    kit: stageKit(matrix, fishList, method, p),
    perFish: per,
  }
}

export function maxView(rows) {
  const row = rows[0]
  const picks = row.passesFromNewFish
  const base = {
    max: row.wikiMax,
    status: row.status,
    picks: picks ? [picks.best, picks.worst] : null,
  }
  if (row.status !== 'ok') return { ...base, reachable: row.reachableMax }
  const slow = picks.best >= SLOW_PICKS
  const nights = (n) => Math.round((n * 256) / 30)
  return { ...base, slow, nights: slow ? [nights(picks.best), nights(picks.worst)] : null }
}

export function buildCompleteGuide(matrix, stock, maxSize) {
  const fishById = new Map(matrix.fish.map((f) => [f.id, f]))
  const stages = []
  for (let stage = 1; stage <= 6; stage++) {
    const rows = maxSize.rows.filter((row) => row.map === stage)
    const fishList = [...new Set(rows.map((r) => r.fish))]
      .map((id) => fishById.get(id))
      .filter(Boolean)
    const stocked = stockOf(stock, stage)
    const methods = {}
    for (const method of METHODS)
      methods[method] = methodPlan(matrix, fishList, method, parts(matrix, stocked, stage, method))
    const fish = fishList.map((f) => ({
      id: f.id,
      size: [f.size.low, f.size.high],
      record: [f.record.min, f.record.max],
      max: maxView(rows.filter((r) => r.fish === f.id)),
    }))
    stages.push({
      stage,
      mapName: rows[0].mapName,
      fish: fish.sort((a, b) => a.size[1] - b.size[1]),
      methods,
    })
  }
  return { schema: 1, stages }
}
