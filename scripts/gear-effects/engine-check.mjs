import { createFight } from '../../src/entities/fight/index.js'
import { METHODS } from './catalog.mjs'
import { kitMistakes, mistakesOf, slotsOf } from './enumerate.mjs'

// Cross-check of the closed-form kit scoring against the engine's own set-up: random kits of every
// method, every size band, must give the same starting fight value.
const CHECKS_PER_METHOD = 120
const BAND_SIZE = [15, 35, 36]
const OPTION = { rod: 'rodId', hook: 'hookId', bait: 'baitId', lure: 'lureId', fly: 'flyId' }

function stream(seed) {
  let x = seed
  return (limit) => {
    x = (Math.imul(x, 1103515245) + 12345) >>> 0
    return (x >>> 8) % limit
  }
}

function pool(catalog, fish, method, slot) {
  if (slot === 'rod') return catalog.rodsOf(method)
  if (slot === 'hook') return catalog.tables.hook
  return catalog.takers(method, fish.id)
}

/** Throws when the scoring and the engine disagree; returns how many kits were compared. */
export function checkAgainstEngine(catalog) {
  const draw = stream(20261008)
  let compared = 0
  for (const method of METHODS) {
    for (let n = 0; n < CHECKS_PER_METHOD; n++) {
      const fish = catalog.fishList[draw(catalog.fishList.length)]
      const slots = slotsOf(method)
      const rows = slots.map((slot) => {
        const choices = pool(catalog, fish, method, slot)
        return choices.length ? choices[draw(choices.length)] : null
      })
      if (rows.includes(null)) continue
      const mine = kitMistakes(catalog, fish, method, rows)
      BAND_SIZE.forEach((size, band) => {
        const options = { fishId: fish.id, size }
        slots.forEach((slot, i) => (options[OPTION[slot]] = rows[i].id))
        const engine = mistakesOf(createFight(options, catalog.tables).vars().fightBase)
        if (engine !== mine[band])
          throw new Error(
            `Scoring differs from the engine: ${method} fish ${fish.id} ${JSON.stringify(options)}`,
          )
        compared += 1
      })
    }
  }
  return compared
}
