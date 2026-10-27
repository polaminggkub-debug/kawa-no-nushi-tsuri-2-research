import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('../../', import.meta.url)))
const readJson = (file) => JSON.parse(readFileSync(resolve(root, file), 'utf8'))

const unique = (list) => [...new Set(list.filter(Boolean))]

function fishEntry(id, fish, locations) {
  const th = unique([fish.nameTh, ...(fish.nameThVariants || [])])
  const latin = unique([fish.nameLatin, ...(fish.nameLatinVariants || [])])
  const stages = unique((locations?.locations || []).map((entry) => entry.stage)).sort()
  return {
    k: 'fish',
    id,
    n: {
      th: th.join(' / ') || fish.nameJa || latin[0] || id,
      en: fish.nameEn || latin[0] || fish.nameJa || id,
      ja: fish.nameJa || latin[0] || id,
    },
    a: unique([...th, ...latin, fish.nameEn, fish.nameJa]).join(' '),
    i: fish.image || '',
    s: stages,
  }
}

function itemEntry(item) {
  const names = item.playerUse?.displayName || {}
  return {
    k: 'item',
    id: item.id,
    c: item.category,
    n: {
      th: item.nameTh || names.th || item.nameJa || item.nameEn,
      en: item.nameEn || names.en || item.nameJa,
      ja: names.ja || item.nameJa || item.nameEn,
    },
    t: { th: item.categoryTh, en: item.categoryEn, ja: item.categoryJa },
    a: unique([item.nameTh, item.nameEn, item.nameJa, names.th, names.en, names.ja]).join(' '),
    i: item.image || '',
  }
}

/** catalogue/search-index.json: every fish and item, for the search box in the menu. */
export function renderSearchIndex() {
  const gallery = readJson('catalogue/gallery-data.json')
  const locations = readJson('catalogue/fish-locations.json').fish || {}
  const fish = Object.entries(gallery.fishVisuals).map(([id, entry]) =>
    fishEntry(id, entry, locations[id]),
  )
  const items = gallery.items.map(itemEntry)
  return `${JSON.stringify({ entries: [...fish, ...items.sort((a, b) => a.id.localeCompare(b.id))] })}\n`
}
