import assert from 'node:assert/strict'
import { notebookGuideMarkup } from '../../src/pages/maps/notebook-guide.js'
import { data, unescapeHtml, validate } from './shared.mjs'

const guide = data.notebookCompletion
let checked = 0
for (const lang of ['en', 'ja', 'th']) {
  for (const stage of guide.stages) checkStage(lang, stage)
}
console.log(
  `PASS: ${checked} notebook fish cards link to details, filtered maps and tackle with exact notebook return.`,
)

function checkStage(lang, stage) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const origin = new URL(`https://example.test/catalogue/maps${suffix}.html`)
  const nested = `item${suffix}.html?category=general_tool&id=05`
  const source = `maps${suffix}.html?stage=${stage.stage}&section=s${stage.stage}-c1-r1&return=${encodeURIComponent(nested)}`
  const ctx = makeContext(lang, stage.stage, source)
  const html = notebookGuideMarkup(ctx)
  assert(html.includes(`data-notebook-total="${stage.recordableSpeciesCount}"`))
  assert(html.includes(`data-notebook-new="${stage.firstOccurrenceCount}"`))
  assert(html.includes(`data-notebook-repeated="${stage.repeatedFromEarlierStages.length}"`))
  assert.equal(
    stage.recordableSpeciesCount,
    stage.firstOccurrenceCount + stage.repeatedFromEarlierStages.length,
  )
  validate(html, origin)
  checkVerification(html, origin, stage.stage, source, suffix)
  checkAreaLinks(html, origin, nested)
  const group =
    html.match(
      new RegExp(`<details id="notebook-route-${stage.stage}"[^>]*>([\\s\\S]*?)<\\/details>`),
    )?.[1] || ''
  const cards = [
    ...group.matchAll(
      /<article\b(?=[^>]*class="notebook-fish notebook-route-fish")(?=[^>]*data-notebook-card="([0-9A-F]{2})")[^>]*>([\s\S]*?)<\/article>/g,
    ),
  ]
  assert.equal(cards.length, stage.firstOccurrenceCount)
  assert.deepEqual(
    cards.map(([, id]) => id),
    stage.firstOccurrenceSpecies,
  )
  for (const [, id, card] of cards) checkCard(card, id, stage.stage, source, origin, suffix)
}

function checkVerification(html, origin, stage, source, suffix) {
  const section = html.match(
    /<section[^>]*data-notebook-verification[^>]*>([\s\S]*?)<\/section>/,
  )?.[1]
  assert(section, 'Missing visible journal verification instruction')
  const help = html.match(/<details class="notebook-help"[^>]*>([\s\S]*?)<\/details>/)?.[0]
  assert(help, 'Missing collapsed journal help')
  assert(!/^<details\b[^>]*\sopen(?:\s|>)/.test(help), 'Journal help must start collapsed')
  assert(help.includes(section), 'Journal verification must be inside collapsed help')
  const link = section.match(/data-notebook-open[^>]*href="([^"]+)"/)
  assert(link, 'Journal verification must link to the notebook item')
  const url = new URL(unescapeHtml(link[1]), origin)
  assert(url.pathname.endsWith(`/item${suffix}.html`))
  assert.equal(url.searchParams.get('category'), 'general_tool')
  assert.equal(url.searchParams.get('id'), '05')
  assert.equal(url.searchParams.get('stage'), String(stage))
  assert.equal(url.searchParams.get('return'), `${source}#notebook-guide`)
  assert(!section.includes('<details'), 'The player instruction must not be collapsed evidence')
}

function makeContext(lang, stage, source) {
  return {
    lang,
    activeStage: stage,
    notebookCompletion: guide,
    openNotebookGuide: true,
    species: Object.fromEntries(
      Object.entries(data.fishVisuals).map(([id, visual]) => [id, { name: visual.nameJa, visual }]),
    ),
    sourceReturn: () => source,
    returnPath: new URL(source, 'https://example.test/catalogue/').searchParams.get('return'),
    fishHref: () => '',
    c: { area: (number) => `Area ${number}` },
    esc: (value) =>
      String(value ?? '').replace(
        /[&<>"']/g,
        (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
      ),
  }
}

function checkCard(html, id, stage, source, origin, suffix) {
  const links = [...html.matchAll(/<a[^>]*data-notebook-action="([^"]+)"[^>]*href="([^"]+)"/g)]
  assert.equal(links.length, 3)
  assert(!/<a\b[^>]*>[\s\S]*?<a\b/.test(html.split('</a>')[0]), 'Nested notebook anchor')
  for (const [, action, raw] of links) {
    const target = new URL(unescapeHtml(raw), origin)
    const page = action === 'details' ? 'fish' : action === 'map' ? 'maps' : 'index'
    assert(target.pathname.endsWith(`/${page}${suffix}.html`))
    assert.equal(target.searchParams.get(action === 'details' ? 'id' : 'fish'), id)
    assert.equal(target.searchParams.get('stage'), String(stage))
    assert.equal(target.searchParams.get('return'), `${source}#notebook-route-${stage}`)
    if (action === 'map') assert.equal(target.hash, '#map-view')
    if (action === 'equipment') {
      assert.equal(target.searchParams.has('category'), false)
      assert.equal(target.hash, '#fish-location-panel')
    }
  }
  checked += 1
}

function checkAreaLinks(html, origin, returned) {
  const links = [
    ...html.matchAll(/data-notebook-area="(\d)" data-notebook-count="(\d+)" href="([^"]+)"/g),
  ]
  assert.equal(links.length, 6)
  for (const [, stage, count, raw] of links) {
    const target = new URL(unescapeHtml(raw), origin)
    assert.equal(target.searchParams.get('stage'), stage)
    assert.equal(target.searchParams.get('return'), returned)
    assert.equal(target.hash, '#notebook-guide')
    assert.equal(Number(count), [6, 12, 15, 22, 27, 15][Number(stage) - 1])
  }
}
