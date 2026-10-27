import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildGuideNames } from '../gear-guide/render.mjs'
import { imageName } from '../../src/pages/item/names.js'
import { renderCompleteGuide } from '../../src/pages/complete-guide/index.js'
import copyEn from '../../src/pages/complete-guide/copy_en.js'
import copyTh from '../../src/pages/complete-guide/copy_th.js'
import copyJa from '../../src/pages/complete-guide/copy_ja.js'
import { buildCompleteGuide } from './plan.mjs'

const root = resolve(fileURLToPath(new URL('../../', import.meta.url)))
const COPY = { en: copyEn, th: copyTh, ja: copyJa }
const readJson = (file) => JSON.parse(readFileSync(resolve(root, file), 'utf8'))

/** Names for every float and sinker too (the kit finder only names the two cheapest routes). */
function namesWithWeights(gallery, effects) {
  const names = buildGuideNames(gallery, effects)
  names.float_weight = {}
  for (const item of gallery.items.filter((entry) => entry.category === 'float_weight'))
    names.float_weight[item.idDecimal] = Object.fromEntries(
      ['en', 'th', 'ja'].map((lang) => [lang, imageName({ lang }, item)]),
    )
  return names
}

/** The complete-guide pages: the shell template with the generated guide in place of the marker. */
export function renderCompleteGuidePage(file, source) {
  const lang = file.includes('.th.') ? 'th' : file.includes('.ja.') ? 'ja' : 'en'
  const matrix = readJson('guide-data/gear-fish-matrix.json')
  const plan = buildCompleteGuide(
    matrix,
    readJson('data/shop-stock-rom.json'),
    readJson('guide-data/fish-max-size.json'),
  )
  const names = namesWithWeights(
    readJson('catalogue/gallery-data.json'),
    readJson('data/gear-effects.json'),
  )
  const body = renderCompleteGuide({ plan, names, matrix, copy: COPY[lang] })
  return source.replace('<!-- complete-guide -->', () => body)
}
