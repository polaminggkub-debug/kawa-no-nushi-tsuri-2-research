// Which rod, hook and bait to preselect for a fish: the engine tells us how each choice changes the
// starting fight value, so the default is whatever starts lowest (matching tackle halves it).

import { createFight } from '../../entities/fight/index.js'

/** Rod style codes (rod table `style`) of the hook-and-bait methods this page covers. */
export const METHOD_STYLES = { float: 1, casting: 2 }
/** Bait id of the decoy ayu: it uses a separate game loop that the engine refuses. */
const DECOY_AYU = 23

export const methodOfRod = (rod) => (rod.style === METHOD_STYLES.casting ? 'casting' : 'float')

/** Fish profiles that start a fight at all (profile 67 is an empty placeholder). */
export const fightableFish = (tables) =>
  tables.fish.filter((fish) => fish.restBase !== 0 || fish.staminaBase !== 0)

export const rodsOfMethod = (tables, method) =>
  tables.rod.filter((rod) => rod.style === METHOD_STYLES[method])

export const usableBaits = (tables) => tables.bait.filter((bait) => bait.id !== DECOY_AYU)

/** Starting fight value of a tackle choice at a given fish size (the engine's own figure). */
export function startingFightValue(tables, setup, size) {
  return createFight({ ...setup, size }, tables).vars().fightBase
}

const middleSize = (fish) => (fish.sizeLow + fish.sizeHigh) >> 1

/** Order two sort keys (arrays of numbers) element by element. */
function compare(a, b) {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i]
  return 0
}

/** Highest-reach rod of a method; ties go to the rod that starts the fish lowest, then the lower id. */
export function bestRod(tables, fish, method) {
  const size = middleSize(fish)
  const score = (rod) => {
    const setup = { rodId: rod.id, fishId: fish.id, hookId: 6, baitId: 0 }
    return [-rod.reach, startingFightValue(tables, setup, size), rod.id]
  }
  const [best] = rodsOfMethod(tables, method)
    .map((rod) => ({ rod, key: score(rod) }))
    .sort((a, b) => compare(a.key, b.key))
  return best.rod
}

/**
 * Hook and bait with the lowest starting fight value for this fish and rod. Between equals the
 * matching hook wins, then a matching bait, then the lowest ids with no bait.
 */
export function bestHookAndBait(tables, fish, rod) {
  const size = middleSize(fish)
  const candidates = []
  for (const hook of tables.hook) {
    for (const bait of [{ id: 0, fishMatch: 0 }, ...usableBaits(tables)]) {
      if (bait.id !== 0 && bait.fishMatch !== fish.id) continue
      const setup = { rodId: rod.id, fishId: fish.id, hookId: hook.id, baitId: bait.id }
      candidates.push({
        setup,
        key: [
          startingFightValue(tables, setup, size),
          hook.fishMatch === fish.id ? 0 : 1,
          bait.id === 0 ? 1 : 0,
          hook.id,
          bait.id,
        ],
      })
    }
  }
  candidates.sort((a, b) => compare(a.key, b.key))
  return candidates[0].setup
}

/** The default tackle setup for a fish with the best rod of a method. */
export function defaultSetup(tables, fish, method) {
  const rod = bestRod(tables, fish, method)
  return bestHookAndBait(tables, fish, rod)
}

export const setupKey = (setup) =>
  [setup.fishId, setup.rodId, setup.hookId, setup.baitId ?? 0].join('|')
