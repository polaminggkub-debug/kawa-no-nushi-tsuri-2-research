import { createHash } from 'node:crypto'
import { readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'

// Fingerprints of everything data/gear-effects.json is computed from, so `npm run check:generated`
// can tell when it is stale without replaying thousands of fights.

const hashOf = (text) => createHash('sha256').update(text).digest('hex').slice(0, 16)
const read = (root, file) => readFileSync(resolve(root, file), 'utf8')

const sourcesOf = (root, directory) =>
  readdirSync(resolve(root, directory))
    .filter((name) => name.endsWith('.js') || name.endsWith('.mjs'))
    .sort()
    .map((name) => join(directory, name))

const digest = (root, files) =>
  hashOf(files.map((file) => `${file}\0${read(root, file)}`).join('\0'))

export function currentInputs(root) {
  const stored = JSON.parse(read(root, 'data/fight-policies.json'))
  const plain = Object.fromEntries(Object.entries(stored.combos).map(([k, v]) => [k, v.plain]))
  return {
    tables: hashOf(read(root, 'data/fight-tables.json')),
    engine: digest(root, [
      ...sourcesOf(root, 'src/entities/fight'),
      ...sourcesOf(root, 'src/features/fight-policy'),
    ]),
    data: digest(root, [
      'data/fish-acceptance.json',
      'data/shop-stock-rom.json',
      'data/item-table-records.json',
    ]),
    rhythms: hashOf(JSON.stringify(plain)),
    script: digest(root, [
      ...sourcesOf(root, 'scripts/gear-effects'),
      'scripts/build_gear_effects.mjs',
    ]),
  }
}
