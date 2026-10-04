import assert from 'node:assert/strict'
import fs from 'node:fs'

const read = (file) => JSON.parse(fs.readFileSync(new URL(file, import.meta.url)))
const finding = read('../../data/quest-tool-use.json').items['0F']
const item = read('../../catalogue/gallery-data.json').items.find(
  (entry) => entry.category === 'general_tool' && entry.id === '0F',
)
for (const field of ['summary', 'facts', 'evidenceNotes']) {
  assert.deepEqual(item.playerUse[field], finding[field])
}
for (const lang of ['en', 'ja', 'th']) {
  assert(finding.facts[lang].length > 0)
}
console.log('Bottle capacity PASS: source prerequisites preserved in player-facing catalogue')
