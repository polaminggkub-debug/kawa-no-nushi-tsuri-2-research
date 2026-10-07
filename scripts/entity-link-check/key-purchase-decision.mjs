import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { data, render, root, unescapeHtml } from './shared.mjs'

const key = JSON.parse(fs.readFileSync(path.join(root, 'data/quest-tool-use.json'))).items['17']
const stock = JSON.parse(fs.readFileSync(path.join(root, 'data/shop-stock-rom.json')))
const rules = {
  en: [
    /uses up one key/i,
    /¥100/,
    /1, 2, 4 and 6/,
    /examine the chest/i,
    /do not pick the key from the item menu/i,
    /free a slot/i,
  ],
  th: [
    /กุญแจหมดไปหนึ่งดอก/,
    /¥100/,
    /1, 2, 4 และ 6/,
    /กดตรวจหีบ/,
    /ไม่ต้องเลือกกุญแจจากเมนู/,
    /ให้เว้นช่อง/,
  ],
  ja: [
    /カギが1個なくなる/,
    /100円/,
    /1・2・4・6/,
    /宝箱を調べ/,
    /カギを選んでも開かない/,
    /欄を1つ空け/,
  ],
}

checkEvidence()
for (const locale of ['en', 'th', 'ja']) {
  checkSummary(key.summary[locale], locale)
  for (const stage of ['', '1', '2', '3', '4', '5', '6', '99', 'invalid']) {
    await checkDetail(locale, stage)
  }
  const other = await render('item', locale, 'category=bait&id=17')
  assert(!other.html.includes('data-key-purchase-action'), 'Key action must not match a bait ID')
}
console.log(
  'Key purchase decision PASS: buy once, verified sellers, chest action and preserved evidence in three locales.',
)

export function checkSummary(text, locale) {
  for (const rule of rules[locale]) assert.match(text, rule)
  assert.doesNotMatch(text, /shop.*(?:3 or 5|every area)|ร้านทุกด่าน|全エリア.*店/i)
}

function checkEvidence() {
  assert.deepEqual(
    stock.items['general_tool:17'].map((offer) => offer.stage),
    [1, 2, 4, 6],
  )
  const rawOffers = stock.areas.filter((area) =>
    area.items.some((entry) => entry.category === 'general_tool' && entry.id === '17'),
  )
  assert.deepEqual(
    rawOffers.map((area) => area.stage),
    [1, 2, 4, 6],
  )
  assert.equal(key.record.basePriceYen, 100)
  assert.equal(key.rawTrace.keyConsumed, true)
  assert.deepEqual(
    key.rawTrace.chests.map((chest) => [chest.visibleArea, chest.reward]),
    [
      [1, 'bait 11 potato bait'],
      [2, 'bait 0B waxworm'],
      [4, 'rod 0A small lure rod'],
      [6, 'candle 12'],
    ],
  )
  const hashes = {
    facts: '7bca5b02184515dad29b00e304095cd524a5deb2eecf90c15d0dcc531905d88d',
    evidence: '06c6f4c204f5004c4fe70c4b80bb75bb44659e96cce75bc9a540071b58e945e7',
    evidenceNotes: 'f92be430806d6ca1c303ff095dc47f1aa5dad270cec5682488637018390da9f8',
    rawTrace: '72d24a79fc1a487958bf2249992d1b893823e755df56db2a6f124538bbdbd86f',
    record: 'ff4ad40e868729be445eb008d4b2f0ce51f13e7a7e93348624eebaf89a1105b9',
  }
  for (const [field, expected] of Object.entries(hashes)) {
    assert.equal(
      createHash('sha256').update(JSON.stringify(key[field])).digest('hex'),
      expected,
      `Preserve established key ${field}`,
    )
  }
  const generated = data.items.find((item) => item.category === 'general_tool' && item.id === '17')
  for (const field of ['summary', ...Object.keys(hashes)]) {
    if (field === 'record' || field === 'rawTrace') continue
    assert.deepEqual(generated.playerUse[field], key[field], `Canonical/generated key ${field}`)
  }
}

async function checkDetail(locale, stage) {
  const result = await render(
    'item',
    locale,
    new URLSearchParams({ category: 'general_tool', id: '17', stage, fish: '03', route: 'float' }),
  )
  const text = unescapeHtml(result.html)
  assert(text.includes(key.summary[locale]), 'Visible key summary must answer whether to buy')
  const actions = [
    ...result.html.matchAll(/<a\b[^>]*data-key-purchase-action[^>]*href="([^"]+)"[^>]*>/g),
  ]
  assert.equal(actions.length, 1, 'Exactly one key seller action')
  const target = new URL(unescapeHtml(actions[0][1]), result.url)
  assert.equal(target.pathname, result.url.pathname)
  assert.equal(target.search, result.url.search)
  assert.equal(target.hash, '#item-shops')
  assert(result.html.includes('id="item-shops"'), 'Seller action needs a real target')
  const offers = [...result.html.matchAll(/data-purchase-stage="(\d+)"/g)].map((match) =>
    Number(match[1]),
  )
  assert.deepEqual([...new Set(offers)].sort(), [1, 2, 4, 6], 'Never invent selected-area stock')
  for (const fact of key.facts[locale]) assert(text.includes(fact))
  for (const note of key.evidenceNotes[locale]) assert(text.includes(note))
  assert(
    !result.html.includes('class="detail-section play-target"'),
    'Chest key is not fish equipment',
  )
}
