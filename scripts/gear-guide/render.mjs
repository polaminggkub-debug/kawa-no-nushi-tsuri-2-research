import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fishName, imageName as catalogueName } from '../../src/pages/item/names.js'
import { renderCards } from '../../src/pages/gear-guide/cards.js'
import cardsEn from '../../src/pages/gear-guide/cards_en.js'
import cardsTh from '../../src/pages/gear-guide/cards_th.js'
import cardsJa from '../../src/pages/gear-guide/cards_ja.js'

const root = resolve(fileURLToPath(new URL('../../', import.meta.url)))
const LANGS = ['en', 'th', 'ja']
const CARDS = { en: cardsEn, th: cardsTh, ja: cardsJa }
// Kinds whose names and prices come straight from gear-effects; everything else uses the catalogue price.
const GEAR_KINDS = ['rod', 'hook', 'bait', 'lure', 'fly']
const hexId = (id) => Number(id).toString(16).toUpperCase().padStart(2, '0')
const readJson = (file) => JSON.parse(readFileSync(resolve(root, file), 'utf8'))

/** Plain-language gloss for the one fish whose catalogue name is a bare Japanese word (as on the simulator page). */
const FISH_GLOSS = { 59: { en: 'Giant eel (Oo-unagi)' } }

/** Fly bodies carry their game id as a suffix in some languages ("... 01"); players should not see it. */
const imageName = (ctx, item) =>
  catalogueName(ctx, item).replace(item.category === 'fly' ? /\s+[0-9A-F]{2}$/ : /$^/, '')

const label = (build) => Object.fromEntries(LANGS.map((lang) => [lang, build({ lang })]))

function findItem(gallery, kind, id) {
  const item = gallery.items.find((entry) => entry.category === kind && entry.idDecimal === +id)
  if (!item) throw new Error(`Gear guide: no catalogue item ${kind}:${id}`)
  return item
}

/** Localized names for the kit finder, from the same catalogue rules the other pages use. */
export function buildGuideNames(gallery, effects) {
  const names = { fish: {}, float_weight: {} }
  for (const id of Object.keys(effects.fish))
    names.fish[id] = label(
      (ctx) => FISH_GLOSS[id]?.[ctx.lang] ?? fishName(ctx, hexId(id), gallery.fishVisuals),
    )
  for (const kind of GEAR_KINDS) {
    names[kind] = {}
    for (const id of Object.keys(effects.items[kind]))
      names[kind][id] = label((ctx) => imageName(ctx, findItem(gallery, kind, id)))
  }
  for (const route of Object.values(effects.routes))
    names.float_weight[route.id] = label((ctx) =>
      imageName(ctx, findItem(gallery, 'float_weight', route.id)),
    )
  return names
}

function yenOf(effects, gallery, kind, id) {
  const gear = effects.items[kind]?.[id]
  let yen = gear?.yen
  if (kind === 'fly') yen = Math.min(...gear.bundles.map((bundle) => bundle[2]))
  if (!gear) yen = findItem(gallery, kind, id).priceYen
  if (!yen) throw new Error(`Gear guide: ${kind}:${id} has no price`)
  return `¥${yen.toLocaleString('en-US')}`
}

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"]/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char],
  )

/** {{name:kind:id}}, {{yen:kind:id}} and {{fish:id}} become the catalogue name or price. */
export function fillTokens(html, lang, gallery, effects) {
  const filled = html.replace(
    /\{\{(?:(name|yen):([a-z_]+):(\d+)|fish:(\d+))\}\}/g,
    (_match, what, kind, id, fishId) => {
      if (fishId)
        return escapeHtml(
          FISH_GLOSS[fishId]?.[lang] ?? fishName({ lang }, hexId(fishId), gallery.fishVisuals),
        )
      if (what === 'yen') return yenOf(effects, gallery, kind, id)
      return escapeHtml(imageName({ lang }, findItem(gallery, kind, id)))
    },
  )
  if (filled.includes('{{')) throw new Error(`Gear guide: unresolved token in ${lang} page`)
  return filled
}

export function renderGearGuide(file, source) {
  const lang = file.includes('.th.') ? 'th' : file.includes('.ja.') ? 'ja' : 'en'
  const gallery = readJson('catalogue/gallery-data.json')
  const effects = readJson('data/gear-effects.json')
  const html = source.replace('<!-- gear-cards -->', renderCards(CARDS[lang]))
  return fillTokens(html, lang, gallery, effects)
}

export function renderGuideNames() {
  const names = buildGuideNames(
    readJson('catalogue/gallery-data.json'),
    readJson('data/gear-effects.json'),
  )
  return `${JSON.stringify(names)}\n`
}
