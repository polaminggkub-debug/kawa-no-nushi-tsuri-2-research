import assert from 'node:assert/strict'
import {
  eligibleNotebookIds,
  normalizeMarks,
  readNotebookMarks,
  writeNotebookMarks,
  progressMarkup,
} from '../../src/pages/maps/notebook-progress.js'
import { data } from './shared.mjs'

const eligible = eligibleNotebookIds(data.notebookCompletion)
assert.equal(eligible.size, 66)
assert(!eligible.has('46'))
const valid = [...eligible][0]
assert.deepEqual(normalizeMarks([valid, valid, '46', 'NO', null, 1], eligible), [valid])
assert.deepEqual(normalizeMarks({ [valid]: true }, eligible), [])
const values = new Map()
const storage = {
  getItem: (key) => values.get(key),
  setItem: (key, value) => values.set(key, value),
}
assert.equal(writeNotebookMarks(storage, [valid, valid, '46'], eligible), true)
assert.deepEqual(readNotebookMarks(storage, eligible), { ids: [valid], persistent: true })
assert.deepEqual(readNotebookMarks(storage, eligible).ids, [valid], 'Reload loses selected fish')
assert.equal(writeNotebookMarks(storage, [], eligible), true)
assert.deepEqual(readNotebookMarks(storage, eligible).ids, [])
values.set('kawa-notebook-manual-v1', JSON.stringify([valid, '46', valid]))
assert.deepEqual(readNotebookMarks(storage, eligible).ids, [valid])
values.set('kawa-notebook-manual-v1', '{malformed')
assert.equal(readNotebookMarks(storage, eligible).persistent, false)
assert.equal(writeNotebookMarks(null, [valid], eligible), false)
assert.deepEqual(readNotebookMarks(null, eligible), { ids: [valid], persistent: false })
for (const lang of ['en', 'ja', 'th']) {
  const html = progressMarkup({ lang, esc: String })
  assert(html.includes('data-notebook-remaining'))
  assert(html.includes('aria-live="polite"'))
  assert(
    html.includes(
      { en: 'does not read or change', ja: '読み書きしません', th: 'ไม่อ่านหรือแก้เซฟเกม' }[lang],
    ),
  )
}
console.log(
  'PASS: manual notebook marks persist uniquely, exclude non-journal species, handle unavailable/malformed storage and disclose separate browser-only tracking in 3 languages.',
)
