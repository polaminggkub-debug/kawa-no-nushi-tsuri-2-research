import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderNotebookGuide } from '../../src/pages/maps/notebook-guide.js'
import { data, validate } from './shared.mjs'

const root = path.resolve(fileURLToPath(new URL('../..', import.meta.url)))
const guide = JSON.parse(fs.readFileSync(path.join(root, 'data/notebook-completion.json'), 'utf8'))
const firstCounts = [6, 10, 11, 17, 11, 11]
const routeCounts = [6, 16, 27, 44, 55, 66]

checkDataset()
for (const lang of ['en', 'ja', 'th']) await checkLocale(lang)
console.log(
  'Notebook route guide PASS: 66 unique IDs, six area counts, excludes, repeats, links, and EN/JA/TH.',
)

function checkDataset() {
  assert.equal(guide.rom.sha1, 'c2103dd94e2a1a65a495fc02adc2e7d040f31212')
  assert.equal(guide.recordRule.notebookSlots, 66)
  assert.equal(guide.totals.notebookEligibleSpecies, 66)
  assert.equal(guide.stages.length, 6)
  assert.deepEqual(
    guide.stages.map((stage) => stage.firstOccurrenceCount),
    firstCounts,
  )
  assert.deepEqual(
    guide.stages.map((stage) => stage.firstOccurrenceCount),
    routeCounts.map((n, i) => n - (routeCounts[i - 1] || 0)),
  )
  const seen = new Set()
  for (const stage of guide.stages) {
    for (const id of stage.firstOccurrenceSpecies) {
      assert(!seen.has(id), `Fish ${id} is listed as new more than once`)
      assert.equal(guide.species[id]?.notebookEligible, true)
      seen.add(id)
    }
    for (const id of stage.repeatedFromEarlierStages)
      assert(seen.has(id), `Repeated fish ${id} has no earlier route entry`)
    for (const id of stage.excludedFromNotebook)
      assert.equal(guide.species[id]?.notebookEligible, false)
  }
  assert.equal(seen.size, 66)
}

async function checkLocale(lang) {
  let through = 0
  for (const stage of guide.stages) {
    through += stage.firstOccurrenceCount
    const ctx = makeContext(lang, stage.stage)
    renderNotebookGuide(ctx)
    const html = ctx.mount.innerHTML
    assert.equal(ctx.mount.hidden, false)
    assert.match(html, /class="notebook-new"/)
    assert.match(html, new RegExp(`data-stage="${stage.stage}"`))
    assert(
      html.includes(`${through}/${guide.totals.notebookEligibleSpecies}`),
      `${lang} route total is wrong at Area ${stage.stage}`,
    )
    assert(html.includes('notebook-completion-research.md'))
    const newList = html.match(/<details class="notebook-new"[\s\S]*?<\/details>/)?.[0] || ''
    assert.equal((newList.match(/class="notebook-fish"/g) || []).length, stage.firstOccurrenceCount)
    if (stage.repeatedFromEarlierStages.length)
      assert(
        html.includes('notebook-repeated'),
        `${lang} repeats are not rendered in Area ${stage.stage}`,
      )
    else assert(!html.includes('notebook-repeated'))
    validate(
      html,
      new URL(`https://example.test/catalogue/maps${lang === 'en' ? '' : `.${lang}`}.html`),
    )
    checkFishTargets(html, stage)
  }
}

function makeContext(lang, stage) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const fishVisuals = data.fishVisuals
  const species = Object.fromEntries(
    Object.entries(fishVisuals).map(([id, visual]) => [
      id,
      {
        name: visual[`name${lang === 'en' ? 'Latin' : lang === 'ja' ? 'Ja' : 'Th'}`] || id,
        visual,
      },
    ]),
  )
  const mount = { innerHTML: '', hidden: true }
  return {
    lang,
    activeStage: stage,
    notebookCompletion: guide,
    species,
    mount,
    c: {
      area: (number) => `${lang === 'th' ? 'ด่าน' : lang === 'ja' ? 'エリア' : 'Area'} ${number}`,
    },
    idNorm: (id) => String(id).toUpperCase().padStart(2, '0'),
    fishHref: (id) =>
      `fish${suffix}.html?id=${id}&stage=${stage}&return=${encodeURIComponent(`maps${suffix}.html?stage=${stage}`)}`,
    $: (id) => (id === 'notebook-guide' ? mount : null),
    esc: (value) =>
      String(value ?? '').replace(
        /[&<>"']/g,
        (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
      ),
  }
}

function checkFishTargets(html, stage) {
  const newList = html.match(/<details class="notebook-new"[\s\S]*?<\/details>/)?.[0] || ''
  const targets = [
    ...newList.matchAll(/href="fish(?:\.th|\.ja)?\.html\?id=([0-9A-F]{2})&amp;stage=(\d+)/g),
  ]
    .map((match) => ({ id: match[1], stage: Number(match[2]) }))
    .filter((target) => target.stage === stage.stage)
    .map((target) => target.id)
  assert.deepEqual(targets.sort(), [...stage.firstOccurrenceSpecies].sort())
}
