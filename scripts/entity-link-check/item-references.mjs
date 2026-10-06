import assert from 'node:assert/strict'
import { rodAreaDecision, rodRefName } from '../../src/entities/item/index.js'
import { data, itemRefs } from './shared.mjs'

const locales = ['en', 'th', 'ja']
const adviceFields = ['rodDecision', 'baitLureDecision', 'gearDecision']
const rods = data.items.filter((item) => item.category === 'rod')

// Advice names the item it points to; resolving it again must change nothing.
function checkAdviceHasNoBareIds() {
  let checked = 0
  for (const item of data.items) {
    for (const field of adviceFields) {
      for (const key of ['label', 'recommendation', 'reason']) {
        const value = item[field]?.[key]
        if (!value) continue
        assert.deepEqual(
          itemRefs.resolveValue(item, field, value),
          value,
          `Bare item ID in ${item.category}:${item.id}/${field}/${key}`,
        )
        checked += 1
      }
    }
    for (const key of ['summary', 'facts', 'comparison']) {
      const value = item.playerUse?.[key]
      if (!value) continue
      assert.deepEqual(
        itemRefs.resolveValue(item, 'playerUse', value),
        value,
        `Bare item ID in ${item.category}:${item.id}/playerUse/${key}`,
      )
      checked += 1
    }
  }
  for (const section of data.playerDecisions.sections)
    for (const key of ['recommendation', 'reason', 'scope']) {
      assert.deepEqual(itemRefs.resolveValue(section, 'section', section[key]), section[key])
      checked += 1
    }
  return checked
}

// The selected-area rod advice is built in the browser; it must name rods too.
function checkAreaAdviceNamesRods() {
  let checked = 0
  for (const lang of locales)
    for (const item of rods)
      for (const stage of [1, 2, 3, 4, 5, 6]) {
        const decision = rodAreaDecision(lang, item, data.items, stage)
        for (const key of ['label', 'recommendation', 'reason']) {
          const text = decision[key][lang]
          assert.equal(
            itemRefs.resolveValue({ category: 'rod', id: item.id }, 'rodDecision', {
              [lang]: text,
            })[lang],
            text,
            `Bare rod ID in ${lang}/area ${stage}/${item.id}/${key}`,
          )
          checked += 1
        }
      }
  return checked
}

// The build-time resolver and the browser-side rod names must agree.
function checkRodNamesMatchBuild() {
  for (const item of rods)
    for (const lang of locales)
      assert.equal(
        rodRefName(lang, item.id),
        itemRefs.table.get(`rod:${item.id}`)[lang],
        `Rod name differs between build and browser: ${lang}/${item.id}`,
      )
}

function checkSamples() {
  const rod01 = rods.find((item) => item.id === '01')
  assert(rod01.rodDecision.label.th.includes('คันคาร์บอนน้ำใส 5.3m'))
  assert(rod01.rodDecision.label.en.includes('Clear stream carbon rod 5.3 m'))
  assert(rod01.rodDecision.label.ja.includes('清流カーボン竿5.3m'))
  assert(!/(?<![\w×¥])04(?!\w)/.test(rod01.rodDecision.label.th))
}

// Building the selected-area advice registers each rod's name, as it does in the browser.
const total = checkAreaAdviceNamesRods() + checkAdviceHasNoBareIds()
checkRodNamesMatchBuild()
checkSamples()
console.log(
  `PASS: ${total} advice strings in EN/TH/JA name the items they point to; the browser's rod names match the build.`,
)
