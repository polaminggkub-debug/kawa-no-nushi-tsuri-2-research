import assert from 'node:assert/strict'
import { resolveProfileStage } from '../../src/pages/fish/render.js'

let resolvedUrl = ''
globalThis.location = { hash: '#starter-float' }
globalThis.history = {
  replaceState: (_state, _title, url) => {
    resolvedUrl = url
  },
}
for (const locale of ['en', 'th', 'ja']) {
  const suffix = locale === 'en' ? '' : `.${locale}`
  const ctx = {
    requestedStage: '4',
    currentFishPath: (stage) =>
      `fish${suffix}.html?id=0F&stage=${stage}&route=float&return=maps${suffix}.html%3Fstage%3D4`,
  }
  resolveProfileStage(ctx, '3')
  assert.equal(ctx.requestedStage, '3')
  const url = new URL(resolvedUrl, 'https://example.test/catalogue/')
  assert.equal(url.searchParams.get('stage'), '3')
  assert.equal(url.searchParams.get('id'), '0F')
  assert.equal(url.searchParams.get('route'), 'float')
  assert.equal(url.searchParams.get('return'), `maps${suffix}.html?stage=4`)
  assert.equal(url.hash, '#starter-float')
  resolvedUrl = 'unchanged'
  resolveProfileStage(ctx, '3')
  assert.equal(resolvedUrl, 'unchanged')
}
delete globalThis.history
delete globalThis.location
console.log(
  'Fish stage resolution PASS: unavailable area resolves once and preserves fish/method/return/starter context in three locales',
)
