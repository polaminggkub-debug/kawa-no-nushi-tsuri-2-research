import assert from 'node:assert/strict'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { root } from './shared.mjs'

const proof = JSON.parse(
  fs.readFileSync(`${root}/data/notebook-natural-landing-evidence.json`, 'utf8'),
)
assert.equal(proof.provenance.kind, 'natural-controller-only')
assert.equal(proof.provenance.ramWritesInSuccessRequests, 0)
assert.equal(proof.fish.idHex, '03')
assert.equal(proof.fish.nameJa, 'ヤマメ')
assert.deepEqual(proof.positiveObservation.before, { counter: 0, bestSize: 0, area: 0 })
assert.deepEqual(proof.positiveObservation.intermediateAfterA1, proof.positiveObservation.before)
assert.deepEqual(proof.positiveObservation.afterNext60NeutralFrames, {
  counter: 1,
  bestSize: 23,
  area: 1,
})
assert.equal(proof.positiveObservation.onlyChangedSpeciesId, '03')
assert.equal(proof.escapeComparison.bestSize, 0)
assert.equal(proof.escapeComparison.area, 0)
assert(proof.limits.some((text) => text.includes('not proof that every landing')))
for (const image of proof.images) {
  assert.equal(
    crypto
      .createHash('sha256')
      .update(fs.readFileSync(`${root}/${image.image}`))
      .digest('hex'),
    image.sha256,
  )
}
const guideSource = fs.readFileSync(`${root}/src/pages/maps/notebook-guide.js`, 'utf8')
for (const sentence of [
  'Land the fish and finish the landing messages',
  '取り込みメッセージを進めてから',
  'ตกปลาขึ้นและผ่านข้อความตกสำเร็จให้จบ',
])
  assert(guideSource.includes(sentence))
console.log(
  'Notebook natural evidence PASS: bounded positive update, first-message delay, escape comparison, original capture hashes and three-locale next action',
)
