import assert from 'node:assert/strict'
import { render, renderCatalogue } from './shared.mjs'

for (const locale of ['en', 'ja', 'th']) {
  await checkCatalogueAction(locale)
  await checkFishAction(locale, '06', '3', 'lure')
  await checkFishAction(locale, '05', '3', 'sinker')
}

console.log(
  'HP recovery actions PASS: catalogue, lure and sinker paths open food choices and return to source.',
)

async function checkCatalogueAction(locale) {
  const sourceReturn = `maps${suffix(locale)}.html?stage=3&fish=06#map-view`
  const query = new URLSearchParams({
    category: 'rod',
    stage: '3',
    route: 'sinker',
    map: '1',
    return: sourceReturn,
  })
  const result = await renderCatalogue(locale, `?${query}#catalogue`)
  const link = action(result.nodes['player-decisions'].innerHTML, 'catalogue')
  const target = foodTarget(link, result.url, locale, '3')
  const returned = new URL(target.searchParams.get('return'), target)
  assert.equal(returned.pathname.split('/').pop(), `index${suffix(locale)}.html`)
  assert.equal(returned.searchParams.get('category'), 'rod')
  assert.equal(returned.searchParams.get('stage'), '3')
  assert.equal(returned.searchParams.get('route'), 'sinker')
  assert.equal(returned.searchParams.get('map'), '1')
  assert.equal(returned.searchParams.get('return'), sourceReturn)
  assert.equal(returned.hash, '#catalogue')
}

async function checkFishAction(locale, fishId, stage, method) {
  const sourceReturn = `maps${suffix(locale)}.html?stage=${stage}&fish=${fishId}&route=${method}#fish-area-map`
  const query = new URLSearchParams({ id: fishId, stage, route: method, return: sourceReturn })
  const result = await render('fish', locale, query)
  const section = detailsSection(result.html, `starter-${method}`)
  assert(section, `${locale}/${fishId}/${stage}/${method}: starter card missing`)
  const link = action(section, `fish-${method}`)
  const target = foodTarget(link, result.url, locale, stage)
  const returned = new URL(target.searchParams.get('return'), target)
  assert.equal(returned.pathname.split('/').pop(), `fish${suffix(locale)}.html`)
  assert.equal(returned.searchParams.get('id'), fishId)
  assert.equal(returned.searchParams.get('stage'), stage)
  assert.equal(returned.searchParams.get('route'), method)
  assert.equal(returned.searchParams.get('return'), sourceReturn)
  assert.equal(returned.hash, `#starter-${method}`)
}

function detailsSection(html, id) {
  const startTag = html.match(new RegExp(`<details\\b[^>]*\\bid="${id}"[^>]*>`))
  assert(startTag, `${id}: starter card missing`)
  const start = startTag.index
  const tags = /<\/?details\b[^>]*>/g
  tags.lastIndex = start
  let depth = 0
  let tag
  while ((tag = tags.exec(html))) {
    depth += tag[0].startsWith('</') ? -1 : 1
    if (depth === 0) return html.slice(start, tags.lastIndex)
  }
  assert.fail(`${id}: unclosed starter card`)
}

function action(html, source) {
  const matches = [...html.matchAll(/<a\b([^>]*data-hp-food-action[^>]*)>/g)]
  const selected = matches.find((match) => match[1].includes(`data-hp-source="${source}"`))
  assert(selected, `${source}: actionable food link missing`)
  const href = selected[1].match(/\bhref="([^"]+)"/)?.[1]
  assert(href, `${source}: food action has no destination`)
  return href.replaceAll('&amp;', '&')
}

function foodTarget(href, base, locale, stage) {
  const target = new URL(href, base)
  assert.equal(target.pathname.split('/').pop(), `index${suffix(locale)}.html`)
  assert.equal(target.searchParams.get('category'), 'food')
  assert.equal(target.searchParams.get('stage'), stage)
  for (const filter of ['fish', 'id', 'route'])
    assert.equal(target.searchParams.has(filter), false, `Food destination kept ${filter}`)
  assert.equal(target.hash, '#category-decisions')
  assert(target.searchParams.get('return'), 'Food destination must preserve a source return')
  return target
}

function suffix(locale) {
  return locale === 'en' ? '' : `.${locale}`
}
