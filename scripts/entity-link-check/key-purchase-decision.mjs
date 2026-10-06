import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { data, render, root, unescapeHtml } from './shared.mjs'

const key = JSON.parse(fs.readFileSync(path.join(root, 'data/quest-tool-use.json'))).items['17']
const stock = JSON.parse(fs.readFileSync(path.join(root, 'data/shop-stock-rom.json')))
const rules = {
  en: [
    /do not buy another/i,
    /buy one for ¥100/i,
    /1, 2, 4 or 6/,
    /interact.*chest/i,
    /rather than selecting.*menu/i,
    /does not consume/i,
    /Leave room/i,
  ],
  th: [
    /ไม่ต้องซื้อซ้ำ/,
    /ซื้อราคา ¥100/,
    /1, 2, 4 หรือ 6/,
    /กดตรวจหีบ/,
    /ไม่ต้องเลือกใช้.*เมนู/,
    /กุญแจไม่หาย/,
    /เว้นช่องกระเป๋า/,
  ],
  ja: [
    /買い直さず/,
    /100円で購入/,
    /1・2・4・6/,
    /宝箱を調べ/,
    /メニュー.*ではなく/,
    /消費されません/,
    /所持欄に空き/,
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
  assert.equal(key.rawTrace.keyConsumed, false)
  assert.deepEqual(
    key.rawTrace.chests.map((chest) => [chest.visibleArea, chest.reward]),
    [
      [1, 'bait 11 potato bait'],
      [2, 'bait 0B grapevine larva'],
      [4, 'rod 0A small lure rod'],
      [6, 'candle 12'],
    ],
  )
  // Hashes were refreshed once for the wording change waxworm -> grapevine larva and magnet -> compass.
  const hashes = {
    facts: '03d7b1d05ebb300c006001760261855cf2e6efaa42e97402ce9e4666ede12e1e',
    evidence: '06c6f4c204f5004c4fe70c4b80bb75bb44659e96cce75bc9a540071b58e945e7',
    evidenceNotes: '2cb78a05430d9769817b684fa353e119a368e73d639ccb1dc5621c9652f59030',
    rawTrace: '432834687bc466185d466e6f0e558211e77cf7847aa5402b1bb980c94b5ad87b',
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
