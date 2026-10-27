import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildGearBest } from './build.mjs'

const root = resolve(fileURLToPath(new URL('../../', import.meta.url)))
const readJson = (file) => JSON.parse(readFileSync(resolve(root, file), 'utf8'))

/** catalogue/gear-best.json: the proven best-gear plan for every fish. */
export function renderGearBest() {
  const best = buildGearBest(
    readJson('guide-data/gear-fish-matrix.json'),
    readJson('data/gear-effects.json'),
    readJson('guide-data/fish-max-size.json'),
  )
  return `${JSON.stringify(best)}\n`
}
