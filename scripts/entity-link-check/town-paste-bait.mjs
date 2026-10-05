import assert from 'node:assert/strict'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { townPasteBaitAction } from '../../src/pages/item/bait-acquisition.js'
import { data, root } from './shared.mjs'

const evidence = JSON.parse(fs.readFileSync(`${root}/data/town-paste-bait-evidence.json`, 'utf8'))
assert.deepEqual(evidence.yBand, [16, 31])
assert.deepEqual(evidence.townMapIds, [7, 8, 9, 10, 11, 12])
assert.deepEqual(evidence.runtime.before, { id: 0, count: 0 })
assert.deepEqual(evidence.runtime.after, { id: 13, count: 3 })
assert.equal(evidence.kind, 'controlled-debug-fixture')
assert.deepEqual(evidence.runtime.injectedWrites, [['0x0B5E', [3, 0]]])
assert.equal(
  crypto
    .createHash('sha256')
    .update(fs.readFileSync(`${root}/${evidence.runtime.image}`))
    .digest('hex'),
  evidence.runtime.imageSha256,
)
const item = data.items.find((entry) => entry.category === 'bait' && entry.id === '0D')
assert(item.baitLureDecision.sources.includes('docs/town-paste-bait-research.md'))
for (const lang of ['en', 'th', 'ja'])
  for (let stage = 1; stage <= 6; stage++) {
    const suffix = lang === 'en' ? '' : `.${lang}`
    const returned = `item${suffix}.html?category=bait&id=0D&stage=${stage}&fish=06&route=float`
    const ctx = {
      lang,
      selectedStage: stage,
      selectedFish: '06',
      selectedRoute: 'float',
      esc: String,
      currentLocalRoute: () => returned,
      detailItemLink: () => `item${suffix}.html?category=general_tool&id=03`,
    }
    const html = townPasteBaitAction(ctx, item)
    const href = html.match(/data-paste-town href="([^"]+)"/)[1]
    const url = new URL(href, 'https://example.test/catalogue/')
    assert.equal(url.pathname, `/catalogue/shops${suffix}.html`)
    assert.equal(url.searchParams.get('stage'), String(stage))
    assert.equal(url.searchParams.get('entrance'), '1')
    assert.equal(url.searchParams.get('place'), 'town')
    assert.equal(url.searchParams.get('fish'), '06')
    assert.equal(url.searchParams.get('route'), 'float')
    assert.equal(url.searchParams.get('return'), returned)
    assert.equal(url.hash, '#town-arrival-1')
    assert(html.includes('X7,Y29'))
    assert.equal(townPasteBaitAction(ctx, { category: 'bait', id: '0E' }), '')
    assert(!item.baitLureDecision.recommendation[lang].includes('no other acquisition route'))
  }
console.log(
  'Town paste bait PASS: bounded acquisition evidence, fixture limits, six town links and three locales',
)
