import assert from 'node:assert/strict'
import fs from 'node:fs'
import { data, render, renderCatalogue, unescapeHtml } from './shared.mjs'

const source = JSON.parse(fs.readFileSync('data/general-tool-actions.json', 'utf8')).items['05']
const provenance = JSON.parse(fs.readFileSync('data/notebook-starting-inventory.json', 'utf8'))
const item = data.items.find((entry) => entry.category === 'general_tool' && entry.id === '05')
const starting = {
  en: [
    /All four characters start with the Fishing Notebook/,
    /no purchase or quest is needed for the initial copy/,
    /general tools.*Fishing Notebook/,
  ],
  ja: [/4人とも最初から釣りノート/, /最初の1冊に購入やイベントは不要/, /道具一覧で釣りノート/],
  th: [
    /ตัวละครทั้ง 4 คนมีสมุดตกปลาตั้งแต่เริ่ม/,
    /ไม่ต้องซื้อหรือทำเควสต์เพื่อรับเล่มแรก/,
    /รายการเครื่องมือ.*สมุดบันทึกการตกปลา/,
  ],
}
checkProvenance()
assert.deepEqual(item.playerUse.shops, [], 'Initial notebook grant must not fabricate a seller')
assert.deepEqual(item.playerUse.summary, source.summary)
assert.deepEqual(item.playerUse.facts, source.facts)
assert.deepEqual(item.playerUse.startingEquipment, {
  type: 'starting_equipment',
  characterIds: [1, 2, 3, 4],
  source: 'data/notebook-starting-inventory.json',
})
assert.deepEqual(item.playerUse.startingEquipment, source.startingEquipment)
for (const lang of ['en', 'ja', 'th']) {
  await checkLocale(lang)
  await checkAcquisitionPanels(lang)
}
console.log(
  'PASS: Tool05 starting-equipment advice is localized and visible, preserves journal actions/evidence, and traces to original-ROM initialization without fabricated stock.',
)

function checkProvenance() {
  assert.equal(provenance.evidenceType, 'rom_code_trace')
  assert.equal(provenance.rom.sha1, 'c2103dd94e2a1a65a495fc02adc2e7d040f31212')
  assert.equal(provenance.rom.sizeBytes, 1572864)
  assert.deepEqual(provenance.item, { category: 'general_tool', id: '05', nameJa: '釣りノート' })
  const acquisition = provenance.acquisition
  assert.equal(acquisition.type, 'starting_equipment')
  assert.deepEqual(acquisition.characterIds, [1, 2, 3, 4])
  assert.equal(acquisition.initializer, '01:B775')
  assert.equal(acquisition.saveInitializer, '01:B705')
  assert.equal(acquisition.grant.inventoryAddress, '7E:0B5A')
  assert.equal(acquisition.grant.value, '0005')
  assert.equal(acquisition.grant.widthBytes, 2)
  assert.equal(acquisition.grant.condition, 'unconditional in character initializer')
  assert.equal(acquisition.persistence.routine, '01:BD17')
  assert.deepEqual(acquisition.persistence.sramRecordBases, [
    '70:0010',
    '70:04E0',
    '70:09B0',
    '70:0E80',
  ])
  for (const phrase of ['not a new controller replay', 'Thai-patch', 'replacement', 'No shop'])
    assert(provenance.limitations.some((line) => line.includes(phrase)))
  for (const path of [
    'data/notebook-starting-inventory.json',
    'scripts/verify_notebook_starting_inventory.py',
  ])
    assert(source.evidence.sources.includes(path) && item.playerUse.evidence.sources.includes(path))
}

async function checkLocale(lang) {
  for (const rule of starting[lang]) assert.match(item.playerUse.summary[lang], rule)
  const catalogue = await renderCatalogue(lang, '?category=general_tool&stage=4#catalogue')
  const card = catalogue.runtime.renderItemCard(item)
  const detail = await render(
    'item',
    lang,
    new URLSearchParams({ category: 'general_tool', id: '05', stage: '4' }),
  )
  for (const html of [card, detail.html]) {
    const text = unescapeHtml(html)
    assert(
      unescapeHtml(html.split('<details')[0]).includes(source.summary[lang]),
      'Starting acquisition hidden or lost',
    )
    assert(text.includes(source.facts[lang][0]), 'Six-page use fact lost')
    assert.match(text, /#notebook-guide/, 'Journal collection action lost')
  }
  assert.match(detail.html, /66/, 'Detail collection scope lost')
  assert.doesNotMatch(
    detail.html,
    /class="detail-section purchase-section"|data-selected-area-missing/,
    'Known initial notebook must not repeat an unknown acquisition panel',
  )
  assert.doesNotMatch(
    detail.html,
    /data-shop-offer|data-offer="|class="purchase-card"/,
    'Notebook starting copy must not invent stock',
  )
  const evidence = unescapeHtml(
    detail.html.match(/<details class="evidence">[\s\S]*?<\/details>/)?.[0] || '',
  )
  assert(
    evidence.includes(source.evidenceNotes[lang].at(-1)),
    'Code/replay/patch evidence limits lost',
  )
  assert.doesNotMatch(evidence.split('>')[0], /\sopen/)
}

async function checkAcquisitionPanels(lang) {
  const unknown = data.items.find((entry) => entry.category === 'general_tool' && entry.id === '01')
  assert(!unknown.playerUse.startingEquipment)
  assert.deepEqual(unknown.playerUse.shops, [])
  for (const stage of ['', '1', '2', '3', '4', '5', '6']) {
    const query = new URLSearchParams({ category: 'general_tool', id: '05' })
    if (stage) query.set('stage', stage)
    const known = await render('item', lang, query)
    assert.doesNotMatch(
      known.html,
      /class="detail-section purchase-section"|data-selected-area-missing/,
      'Known initial acquisition must not become an unknown/no-stock panel',
    )
    query.set('id', '01')
    const control = await render('item', lang, query)
    assert.match(
      control.html,
      /class="detail-section purchase-section"/,
      'Generic nonstarting acquisition disclosure disappeared',
    )
    if (stage) assert.match(control.html, /data-selected-area-missing="true"/)
  }
}
