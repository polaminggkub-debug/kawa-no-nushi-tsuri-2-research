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
const nextActions = [
  'Land the fish, finish the landing messages, then open Tool 05 (Fishing Notebook) and check that its name appears on one of the six pages.',
  '魚を取り込み、取り込みメッセージを最後まで進めてから道具05「釣りノート」を開き、魚名が6ページのいずれかにあるか確認してください。',
  'ตกปลาให้ขึ้นและผ่านข้อความผลการตกจนจบ จากนั้นเปิดไอเท็ม 05 “สมุดบันทึกการตกปลา” แล้วดูว่าชื่อปลาปรากฏอยู่ในหน้าด่านใดด่านหนึ่งหรือไม่',
]
for (const [index, action] of nextActions.entries()) {
  assert(
    guideSource.includes(action),
    `Locale ${['en', 'ja', 'th'][index]} must instruct landing, finishing messages, then checking Tool 05 across all pages`,
  )
}
console.log(
  'Notebook natural evidence PASS: bounded positive update, first-message delay, escape comparison, original capture hashes and three-locale next action',
)
