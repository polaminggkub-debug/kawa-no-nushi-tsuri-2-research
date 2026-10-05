import assert from 'node:assert/strict'
import fs from 'node:fs'
import { root } from './shared.mjs'

function read(file) {
  return JSON.parse(fs.readFileSync(`${root}/${file}`, 'utf8'))
}

export function checkKeyPurchase(action, stage) {
  const stock = read('data/shop-stock-rom.json').items['general_tool:17']
  assert.deepEqual(
    stock.map((offer) => offer.stage),
    [1, 2, 4, 6],
  )
  assert(stock.some((offer) => offer.stage === stage))
  const key = read('data/quest-tool-use.json').items['17'].record
  assert.equal(key.basePriceYen, 100)
  assert(
    action.evidence.some(
      (source) =>
        source.file === 'data/shop-stock-rom.json' && source.field.includes('general_tool:17'),
    ),
  )
  assert(
    action.evidence.some(
      (source) =>
        source.file === 'data/quest-tool-use.json' &&
        source.field.includes('17') &&
        source.field.includes('record'),
    ),
  )
  assert(
    action.links.some(
      (link) =>
        link.category === 'general_tool' &&
        link.id === '17' &&
        link.stage === stage &&
        link.hash === 'item-shops',
    ),
  )
  const text = [...action.steps, action.warning || ''].join(' ')
  assert(text.includes(String(key.basePriceYen)))
  assert.match(
    text,
    /if.*(?:have|own)|Already have.*Keep.*Otherwise|なければ|持っていない|ยังไม่มี|ไม่มี.*กุญแจ/i,
  )
  assert.doesNotMatch(
    action.limit || '',
    /key acquisition.*(?:not|unproved)|How the key.*not.*established|入手.*未確認|วิธี.*กุญแจ.*(?:ไม่|ยัง)/i,
  )
}
