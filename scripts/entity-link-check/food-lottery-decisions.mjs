import assert from 'node:assert/strict'
import fs from 'node:fs'
import { data, render, root, unescapeHtml } from './shared.mjs'

const foodProof = readData('food-effects-confirmed.json')
const lottery = readData('quest-tool-use.json').items['11']
const food = (id) => data.items.find((item) => item.category === 'food' && item.id === id)
const ticket = data.items.find((item) => item.category === 'general_tool' && item.id === '11')

checkOriginalEvidence()
for (const locale of ['en', 'th', 'ja']) await checkPlayerGuidance(locale)

function readData(file) {
  return JSON.parse(fs.readFileSync(`${root}/data/${file}`, 'utf8'))
}

function checkOriginalEvidence() {
  const healing = foodProof.items.find((item) => item.id === '0x09')
  const poison = foodProof.items.find((item) => item.id === '0x0A')
  assert(healing.runtime_confirmed && poison.runtime_confirmed)
  assert.equal(healing.hp_delta, 10)
  assert.equal(poison.hp_after, 0)
  assert.equal(healing.game_menu_label_ja, 'きのこ')
  assert.equal(poison.game_menu_label_ja, healing.game_menu_label_ja)
  assert.deepEqual(lottery.rawTrace.lotteryXY, [54, 22])
  assert.equal(lottery.rawTrace.foodOffering.cap, 255)
  assert.equal(lottery.rawTrace.foodOffering.threshold, '7E:0C22')
  assert.equal(lottery.rawTrace.foodOffering.foodTable, '05:B1DF')
  assert(lottery.rawTrace.thresholdComparison.includes('>= 7E:0C22 loses'))
  assert.deepEqual(lottery.rawTrace.prizeYen, [100, 1000, 5000])
  const jizo = ticket.playerUse.useLocations.find((point) => point.source?.objectSlotHex === '08')
  assert(jizo, 'Keep the existing, ROM-traced Jizo map action')
  assert.equal(jizo.stage, 5)
  assert.deepEqual([jizo.tileX, jizo.tileY], [49, 22])
  assert.equal(jizo.image, 'maps/tool-use-jizo.png')
}

async function checkPlayerGuidance(locale) {
  const healing = food('09').playerUse.summary[locale]
  const poison = food('0A').playerUse.summary[locale]
  assert.notEqual(healing, poison, `${locale}: safe and poison cards need distinct outcomes`)
  assert(/09/.test(healing) && /10/.test(healing) && /HP/.test(healing))
  assert(/0A/.test(poison) && /0/.test(poison) && /HP/.test(poison))
  assert(healing.includes('きのこ') && poison.includes('きのこ'))
  for (const id of ['09', '0A']) await checkItemRender(locale, 'food', id)
  await checkTicketRender(locale)
}

async function checkItemRender(locale, category, id) {
  const item = data.items.find((entry) => entry.category === category && entry.id === id)
  const result = await render('item', locale, new URLSearchParams({ category, id, stage: '5' }))
  const visible = unescapeHtml(result.html.split('<details class="evidence"')[0])
  assert(visible.includes(item.playerUse.summary[locale]), `${locale}/${category}/${id}: summary`)
  if (category === 'food')
    assert(visible.includes('data-mushroom-alternative'), `${locale}/${id}: safe-food action`)
  return result
}

async function checkTicketRender(locale) {
  const result = await checkItemRender(locale, 'general_tool', '11')
  const summary = ticket.playerUse.summary[locale]
  assert(summary.replace(/\s/g, '').includes('49,22'))
  assert(summary.replace(/\s/g, '').includes('54,22'))
  const before = { en: 'Before', th: 'ก่อน', ja: '前' }[locale]
  assert(summary.includes(before), `${locale}: offering must precede spending the ticket`)
  const notes = ticket.playerUse.evidenceNotes[locale].join(' ')
  for (const raw of ['40', '5', '255', '7E:0C22'])
    assert(notes.includes(raw), `${locale}: preserve threshold evidence ${raw}`)
  const visible = unescapeHtml(result.html.split('<details class="evidence"')[0])
  for (const amount of ['100', '1,000', '5,000'])
    assert(visible.includes(amount), `${locale}: preserve possible prize ${amount}`)
  assert(visible.includes('maps/tool-use-jizo.png'))
  assert(visible.includes('maps/tool-use-lottery-counter.png'))
}

console.log(
  'PASS: mushroom cards distinguish measured healing/poison effects with safe-food recovery; lottery advice orders spare-food offering before the draw and preserves maps, prizes and ROM threshold evidence in EN/TH/JA.',
)
