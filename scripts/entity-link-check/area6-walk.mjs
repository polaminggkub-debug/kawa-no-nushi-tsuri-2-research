import assert from 'node:assert/strict'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { area6Walk } from '../../src/pages/shops/area6-walk.js'

const evidence = JSON.parse(
  fs.readFileSync(new URL('../../data/area6-shop-walk-evidence.json', import.meta.url)),
)
assert.equal(evidence.controllerOnlySteps, 33)
assert.equal(evidence.independentReplayMatchedPriorScreenshot, true)
assert.deepEqual(evidence.routeSteps.at(-1).mapTile, [12, 8, 24])
const image = fs.readFileSync(
  new URL('../../catalogue/images/shop-routes/area6-regular-shop.png', import.meta.url),
)
assert.equal(crypto.createHash('sha256').update(image).digest('hex'), evidence.imageSha256)
for (const lang of ['en', 'ja', 'th']) {
  const ctx = { lang, esc: String }
  const regular = { kind: 'regular-shop' }
  const html = area6Walk(ctx, { stage: 6 }, regular)
  assert(html.includes('data-area6-walk'))
  assert(html.includes('area6-regular-shop.png'))
  assert.equal(area6Walk(ctx, { stage: 5 }, regular), '')
  assert.equal(area6Walk(ctx, { stage: 6 }, { kind: 'special-rod-shop' }), '')
}
console.log(
  'Area6 walking guide PASS: scoped shop, original screenshot hash, separate debug-fixture evidence',
)
