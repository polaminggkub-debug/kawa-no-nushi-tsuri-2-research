import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { root } from './shared.mjs'

// The best-gear kits: every part of a stage's main kit is sold in a shop of that stage or an earlier
// one, the `buy` place it names is a real stock row, and a later-stage upgrade is really later and easier.
const json = (file) => JSON.parse(readFileSync(resolve(root, file), 'utf8'))
const best = json('catalogue/gear-best.json')
const stock = json('data/shop-stock-rom.json')
const hex = (id) => id.toString(16).toUpperCase().padStart(2, '0')
const SHOP = { shop: undefined, special: 'special_rod_shop', fly: 'fly_bundle' }
const CATEGORY = { rod: 'rod', hook: 'hook', bait: 'bait', lure: 'lure', fly: 'fly' }

function checkKit(label, kit, method, limit) {
  const second = method === 'float' ? 'bait' : method
  const parts = { rod: kit.rod, item: kit[second], ...(kit.hook != null && { hook: kit.hook }) }
  for (const [key, id] of Object.entries(parts)) {
    const [stage, shop] = kit.buy[key]
    const category = CATEGORY[key === 'item' ? second : key]
    assert(stage <= limit, `${label}: ${category} ${id} bought at stage ${stage}, after ${limit}`)
    const rows = stock.items[`${category}:${hex(id)}`] ?? []
    assert(
      rows.some((row) => row.stage === stage && row.shop === SHOP[shop]),
      `${label}: ${category} ${id} is not sold at stage ${stage} (${shop})`,
    )
  }
}

let kits = 0
for (const [fishId, fish] of Object.entries(best.fish)) {
  assert(fish.stages.length, `fish ${fishId}: no stage`)
  for (const [method, plan] of Object.entries(fish.methods))
    for (const stage of fish.stages) {
      const entry = plan.stages[stage]
      assert(entry, `fish ${fishId}/${method}: stage ${stage} missing`)
      for (const kit of entry.kits) {
        checkKit(`fish ${fishId}/${method}/${stage}`, kit, method, stage)
        kits += 1
      }
      if (!entry.later) continue
      assert(entry.later.stage > stage, `fish ${fishId}/${method}/${stage}: later is not later`)
      checkKit(
        `fish ${fishId}/${method}/${stage} later`,
        entry.later.kit,
        method,
        entry.later.stage,
      )
      if (entry.kits.length)
        assert(
          entry.later.kit.score < entry.kits[0].score,
          `fish ${fishId}/${method}/${stage}: later kit is not easier`,
        )
    }
}
assert(kits > 100, 'gear-best: too few kits checked')
