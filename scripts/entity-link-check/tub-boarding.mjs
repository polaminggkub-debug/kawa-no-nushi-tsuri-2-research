import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { data, render, root, unescapeHtml } from './shared.mjs'

const proof = JSON.parse(fs.readFileSync(path.join(root, 'data/tub-boarding.json'), 'utf8'))
assert.equal(proof.romSha1, 'c2103dd94e2a1a65a495fc02adc2e7d040f31212')
assert.deepEqual(proof.before, { stage: 1, x: 4, y: 183, movementMode: 1 })
assert.deepEqual(proof.after, { stage: 1, x: 3, y: 187, movementMode: 3, fieldState: 2 })
assert.deepEqual(proof.approach.start, { stage: 1, x: 8, y: 183 })
assert.deepEqual(proof.approach.memoryWrites, [])
assert.equal(proof.injectedSetup.length, 1)
assert.equal(proof.injectedSetup[0].address, '7E:0B5E')
assert.equal(proof.injectedSetup[0].valueHex, '01 00')
const screenshot = fs.readFileSync(path.join(root, 'catalogue', proof.screenshot))
assert.equal(createHash('sha256').update(screenshot).digest('hex'), proof.screenshotSha256)
const tub = data.items.find((item) => item.category === 'general_tool' && item.id === '01')
assert(tub.playerUse.useLocations.some((loc) => loc.rewardItem?.id === '01'))
assert.deepEqual(
  tub.playerUse.useLocations.find((loc) => loc.kind === 'runtime_tub_boarding'),
  proof.location,
)
for (const lang of ['en', 'ja', 'th']) {
  const result = await render(
    'item',
    lang,
    new URLSearchParams({
      category: 'general_tool',
      id: '01',
      stage: '1',
    }),
  )
  const html = unescapeHtml(result.html)
  assert(proof.location.action[lang] && html.includes(proof.location.action[lang]))
  assert(proof.location.description[lang] && html.includes(proof.location.description[lang]))
  assert(html.includes(proof.location.image))
  assert(html.includes('data-tub-boarding-choice'))
  assert(html.includes('href="#tub-boarding-1"'))
  assert(html.includes('id="tub-boarding-1"'))
  assert(html.includes('docs/tub-boarding-research.md'))
}
