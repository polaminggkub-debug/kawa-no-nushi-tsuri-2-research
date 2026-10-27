import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { buildCompleteGuide, METHODS } from '../complete-guide/plan.mjs'
import { root } from './shared.mjs'

// The Complete guide: three localized pages, every method in every stage, kits that are really on sale in
// that stage and cost what the page says, and no wording that calls rod +2 a fight stat.
const read = (file) => readFileSync(resolve(root, file), 'utf8')
const json = (file) => JSON.parse(read(file))
const matrix = json('guide-data/gear-fish-matrix.json')
const stock = json('data/shop-stock-rom.json')
const plan = buildCompleteGuide(matrix, stock, json('guide-data/fish-max-size.json'))
const suffixes = { en: '', th: '.th', ja: '.ja' }
const KIND = { float: 'bait', sinker: 'bait', casting: 'bait', lure: 'lure', fly: 'fly' }
const hexId = (id) => Number(id).toString(16).toUpperCase().padStart(2, '0')
const stocked = (stage, category, id) =>
  stock.items[`${category}:${hexId(id)}`]?.some((row) => row.stage === stage)

function checkPlan() {
  assert.equal(plan.stages.length, 6)
  for (const stage of plan.stages)
    for (const method of METHODS) {
      const part = stage.methods[method]
      if (!part.available) continue
      for (const kit of [part.kit, part.kit.budget].filter(Boolean)) {
        assert(
          stocked(stage.stage, 'rod', kit.rod),
          `${stage.stage}/${method}: rod ${kit.rod} not on sale`,
        )
        if (kit.hook != null)
          assert(stocked(stage.stage, 'hook', kit.hook), `${stage.stage}/${method}: hook`)
        if (method !== 'fly')
          assert(
            stocked(stage.stage, KIND[method], kit.item),
            `${stage.stage}/${method}: item ${kit.item}`,
          )
        const price =
          matrix.items.rod[kit.rod].price +
          (kit.hook == null ? 0 : matrix.items.hook[kit.hook].price) +
          part.parts.items.find((item) => item.id === kit.item).yen
        assert.equal(kit.yen, price, `${stage.stage}/${method}: kit price`)
      }
      if (method === 'lure')
        for (const item of part.parts.items)
          assert(['sinking', 'surface', 'untested'].includes(item.kind), `lure ${item.id} kind`)
    }
}

function checkPages() {
  for (const [locale, suffix] of Object.entries(suffixes)) {
    const file = `catalogue/complete-guide${suffix}.html`
    const html = read(file)
    for (let stage = 1; stage <= 6; stage++) {
      assert(html.includes(`id="stage-${stage}"`), `${file}: stage ${stage}`)
      for (const method of METHODS)
        assert(html.includes(`id="stage-${stage}-${method}"`), `${file}: stage ${stage} ${method}`)
    }
    for (const method of METHODS)
      assert(html.includes(`id="method-${method}"`), `${file}: ${method} card`)
    assert(
      html.includes('trust trust-rom') && html.includes('trust trust-tested'),
      `${file}: trust badges`,
    )
    assert(html.includes('trust trust-unconfirmed'), `${file}: untested lure types are marked`)
    assert(!html.includes('เพดาน'), `${file}: plain Thai for size MAX`)
    assert(!/fight time|เวลาสู้ปลา.{0,6}\+2|戦闘時間/i.test(html), `${file}: +2 is not fight time`)
    const home = read(`catalogue/index${suffix}.html`)
    assert(home.includes(`href="complete-guide${suffix}.html"`), `${locale}: home link`)
    for (const page of ['maps', 'shops', 'quests', 'fight-sim', 'gear-guide'])
      assert(
        read(`catalogue/${page}${suffix}.html`).includes(`data-compendium-destination="7"`),
        `${page}${suffix}: navigation link`,
      )
  }
}

function checkMaxSize() {
  const best = json('catalogue/gear-best.json').fish
  assert.equal(best[55].max.status, 'quest-only', 'Akame MAX is quest-only')
  assert.equal(best[59].max.status, 'story-only', 'Giant eel MAX is story-only')
  assert(best[13].max.slow && best[13].max.picks[0] === 56, 'Koi MAX takes long to raise')
  assert(!best[1].max.slow, 'Iwana MAX is quick')
}

checkPlan()
checkPages()
checkMaxSize()
console.log(
  'Complete guide PASS: EN/TH/JA pages cover 5 methods in 6 stages; every kit is on sale in its stage at the stated price; trust badges, navigation and home links present.',
)
