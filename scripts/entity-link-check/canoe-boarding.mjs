import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { data, render, root } from './shared.mjs'

const proof = JSON.parse(fs.readFileSync(path.join(root, 'data/canoe-boarding.json'), 'utf8'))
assert.equal(proof.romSha1, 'c2103dd94e2a1a65a495fc02adc2e7d040f31212')
assert.deepEqual(proof.before, { stage: 1, x: 4, y: 183, movementMode: 1 })
assert.deepEqual(proof.after, { stage: 1, x: 3, y: 187, movementMode: 4, fieldState: 2 })
assert.deepEqual(proof.approach.memoryWrites, [])
assert.deepEqual(
  proof.injectedSetup.map((setup) => [setup.address, setup.valueHex]),
  [['7E:0B5E', '02 00']],
)
const screenshot = fs.readFileSync(path.join(root, 'catalogue', proof.screenshot))
assert.equal(createHash('sha256').update(screenshot).digest('hex'), proof.screenshotSha256)
const canoe = data.items.find((item) => item.category === 'general_tool' && item.id === '02')
assert(canoe.playerUse.useLocations.some((loc) => loc.stage === 3))
assert.deepEqual(
  canoe.playerUse.useLocations.find((loc) => loc.kind === 'runtime_canoe_boarding'),
  proof.location,
)
for (const lang of ['en', 'ja', 'th']) {
  const result = await render(
    'item',
    lang,
    new URLSearchParams({ category: 'general_tool', id: '02', stage: '1' }),
  )
  assert(result.html.includes(proof.location.action[lang]))
  assert(result.html.includes(proof.location.description[lang]))
  assert(result.html.includes('data-canoe-boarding-choice'))
  assert(result.html.includes('href="#canoe-boarding-1"'))
  assert(result.html.includes('id="canoe-boarding-1"'))
  assert(result.html.includes(proof.location.runtimeImage))
}
console.log(
  'PASS: conditional owned-canoe boarding guidance, original screenshot hash, retained acquisition location and working example anchor in EN/JA/TH. Runtime replay is separate evidence.',
)
