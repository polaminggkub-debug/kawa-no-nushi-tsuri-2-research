import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// What can be fought with and what can be bought: the ROM acceptance masks (which baits, lures and fly
// bodies a fish can take), the shop stock of the six areas and the item prices, all by decimal id.

export const METHODS = ['float', 'casting', 'lure', 'fly']
const RODS_OF = { float: 1, casting: 2, lure: 4, fly: 8 }
/** Bait 23 (decoy ayu, hex 17) fights in a separate game loop that the engine does not port. */
const DECOY_AYU = 23
const PRICED = { rod: 'rod', hook: 'hook', bait: 'bait', lure: 'lure', float: 'float_weight' }

const hex = (id) => id.toString(16).toUpperCase().padStart(2, '0')
const dec = (text) => parseInt(text, 16)

export function readSources(root) {
  const json = (file) => JSON.parse(readFileSync(resolve(root, file), 'utf8'))
  return {
    tables: json('data/fight-tables.json'),
    acceptance: json('data/fish-acceptance.json'),
    shop: json('data/shop-stock-rom.json'),
    records: json('data/item-table-records.json'),
  }
}

/** Where each item is sold: { yen, areas, special } (special = fixed-rod merchant areas). */
function stockOf(shop, records) {
  const yen = {}
  for (const [kind, category] of Object.entries(PRICED))
    yen[kind] = Object.fromEntries(records[category].records.map((r) => [dec(r.id), r.price_field]))
  const sold = Object.fromEntries(Object.keys(PRICED).map((kind) => [kind, {}]))
  for (const area of shop.areas) {
    for (const item of area.items) {
      const kind = Object.keys(PRICED).find((name) => PRICED[name] === item.category)
      if (!kind) continue
      const entry = (sold[kind][dec(item.id)] ??= { yen: yen[kind][dec(item.id)], areas: [] })
      entry.areas.push(area.stage)
      if (item.section === 'special_rod_shop') (entry.special ??= []).push(area.stage)
    }
  }
  const bodies = {}
  for (const area of shop.areas)
    for (const b of area.flyBundles)
      (bodies[dec(b.body)] ??= []).push([
        area.stage,
        b.slot,
        b.shopPriceYen,
        dec(b.wing),
        dec(b.tail),
      ])
  return { sold, bodies, yen }
}

function bodyRows(acceptance, tables) {
  const bodyIds = new Set(acceptance.fly_bodies.map((b) => dec(b.id_hex)))
  return tables.fly.filter((row) => bodyIds.has(row.id))
}

/** Per fish and method the legal choices of the slots the fish's acceptance gates allow. */
function acceptanceOf(acceptance) {
  const bait = (field) =>
    Object.fromEntries(acceptance.baits.map((b) => [dec(b.id_hex), new Set(b[field])]))
  const set = (rows, field = 'fish_ids_passing_mask_gate') =>
    Object.fromEntries(rows.map((r) => [dec(r.id_hex), new Set(r[field])]))
  return {
    float: bait('mode0_fish_ids_with_nonzero_random_threshold'),
    casting: bait('mode1_fish_ids_with_nonzero_random_threshold_+3'),
    lure: set(acceptance.lures),
    fly: set(acceptance.fly_bodies),
  }
}

export function buildCatalog(sources) {
  const { tables, acceptance, shop, records } = sources
  const stock = stockOf(shop, records)
  const accepts = acceptanceOf(acceptance)
  const fishList = tables.fish.filter((fish) => fish.restBase !== 0 || fish.staminaBase !== 0)
  const bodies = bodyRows(acceptance, tables)
  const rodsOf = (method) => tables.rod.filter((rod) => rod.style === RODS_OF[method])
  const takers = (method, fishId) => {
    const ids = (rows) => rows.filter((row) => accepts[method][row.id]?.has(hex(fishId)))
    if (method === 'lure') return ids(tables.lure)
    if (method === 'fly') return ids(bodies)
    return ids(tables.bait).filter((bait) => bait.id !== DECOY_AYU)
  }
  return { tables, stock, fishList, bodies, rodsOf, takers, hex }
}
