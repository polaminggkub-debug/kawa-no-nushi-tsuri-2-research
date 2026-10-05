import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { data, root, render, renderCatalogue, unescapeHtml } from './shared.mjs'

const actionSource = readJson('data/general-tool-actions.json')
const research = fs.readFileSync(path.join(root, 'docs/general-tool-actions-research.md'), 'utf8')
const actions = [
  {
    id: '13',
    current: { en: 'Stereo', ja: 'ステレオ', th: 'สเตอริโอ' },
    next: { en: 'Monaural', ja: 'モノラル', th: 'โมโน' },
    handler: '03:C548',
    handlerFileOffset: '0x01C548',
    handlerBytes:
      'a9 1c 00 8d a8 16 e2 20 a9 e3 8d 43 21 c2 20 ae cf 1b a9 14 00 9d d5 1b a9 01 00 8f 28 1e 7f',
    audioFlag: '$7F:1E28=1',
    slot: '$1BD5[$1BCF]=0x14',
    message: '0166 音楽をモノラルにしました。',
    idRow: '`13` ステレオ',
  },
  {
    id: '14',
    current: { en: 'Monaural', ja: 'モノラル', th: 'โมโน' },
    next: { en: 'Stereo', ja: 'ステレオ', th: 'สเตอริโอ' },
    handler: '03:C584',
    handlerFileOffset: '0x01C584',
    handlerBytes:
      'a9 1c 00 8d a8 16 e2 20 a9 e4 8d 43 21 c2 20 ae cf 1b a9 13 00 9d d5 1b a9 00 00 8f 28 1e 7f',
    audioFlag: '$7F:1E28=0',
    slot: '$1BD5[$1BCF]=0x13',
    message: '0164 音楽をステレオにしました。',
    idRow: '`14` モノラル',
  },
]

checkEvidence()
for (const lang of ['en', 'ja', 'th']) await checkLocale(lang)
console.log(
  'PASS: Stereo/Monaural guidance names the current mode, the opposite-mode action, and preserves ROM evidence and stock status in EN/JA/TH.',
)

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
}

function checkEvidence() {
  assert(research.includes('## Stereo and monaural: IDs 13 and 14'))
  assert(
    research.includes(
      'The tool label reflects the current mode. Using it toggles to the opposite mode',
    ),
  )
  for (const expected of actions) {
    const item = actionSource.items[expected.id]
    const galleryItem = data.items.find(
      (entry) => entry.category === 'general_tool' && entry.id === expected.id,
    )
    assert(item && galleryItem, `Missing audio-mode item ${expected.id}`)
    assert.deepEqual(galleryItem.playerUse.summary, item.summary)
    assert.deepEqual(galleryItem.playerUse.facts, item.facts)
    assert.equal(galleryItem.playerUse.evidence?.type, 'rom_trace')
    assert(galleryItem.playerUse.evidence.sources.includes('docs/general-tool-actions-research.md'))
    assert.deepEqual(galleryItem.playerUse.shops, [], `Do not invent shop stock for ${expected.id}`)
    checkTrace(item, expected)
    checkLocalizedAdvice(item, expected)
  }
}

function checkTrace(item, expected) {
  assert.equal(item.trace.selectedUseHandler, expected.handler)
  assert.equal(item.trace.handlerFileOffset, expected.handlerFileOffset)
  assert.equal(item.trace.handlerBytes, expected.handlerBytes)
  assert.equal(item.trace.result.audioFlag, expected.audioFlag)
  assert.equal(item.trace.result.selectedItemSlot, expected.slot)
  assert.equal(item.trace.result.message, expected.message)
  assert(item.trace.result.message.includes(expected.next.ja))
  assert(research.includes(expected.idRow))
  assert(research.includes(expected.message.replace(/^\d+ /, '')))
}

function checkLocalizedAdvice(item, expected) {
  const patterns = {
    en: [
      new RegExp(`Current music mode: ${expected.current.en}\\.`),
      new RegExp(
        `Use this item to switch to ${expected.next.en}; it then becomes ${expected.next.en}\\.`,
      ),
      /item name shows the current mode, not the mode it will switch to/i,
    ],
    ja: [
      new RegExp(`現在の音楽モードは${expected.current.ja}`),
      new RegExp(`使うと${expected.next.ja}に切り替わり、アイテムも${expected.next.ja}になる`),
      /アイテム名は現在のモードを示し、切り替え後のモードを示すものではない。/,
    ],
    th: [
      new RegExp(`โหมดเสียงเพลงปัจจุบันคือ${expected.current.th}`),
      new RegExp(
        `ใช้ไอเท็มนี้เพื่อสลับเป็น${expected.next.th} แล้วไอเท็มจะเปลี่ยนเป็น${expected.next.th}`,
      ),
      /ชื่อไอเท็มบอกโหมดที่ใช้อยู่ ไม่ใช่โหมดที่จะเปลี่ยนไป/,
    ],
  }
  for (const lang of ['en', 'ja', 'th']) {
    const summary = item.summary[lang]
    const fact = item.facts[lang]
    assert.equal(fact.length, 1, `Keep one concise mode-label clarification ${expected.id}/${lang}`)
    assert(patterns[lang][0].test(summary), `Current mode missing ${expected.id}/${lang}`)
    assert(patterns[lang][1].test(summary), `Opposite-mode action missing ${expected.id}/${lang}`)
    assert(
      patterns[lang][2].test(fact[0]),
      `Mode-label clarification missing ${expected.id}/${lang}`,
    )
    assert.notEqual(
      summary,
      fact[0],
      `Do not repeat the player action in facts ${expected.id}/${lang}`,
    )
  }
}

async function checkLocale(lang) {
  for (const expected of actions) {
    await checkDetail(lang, expected)
    await checkCard(lang, expected)
  }
}

async function checkDetail(lang, expected) {
  const result = await render(
    'item',
    lang,
    new URLSearchParams({ category: 'general_tool', id: expected.id }),
  )
  const hero = result.html.match(/<section id="what-to-do"[\s\S]*?<\/section>/)?.[0]
  assert(hero, `Missing visible action for ${expected.id}/${lang}`)
  checkVisibleCopy(unescapeHtml(hero), actionSource.items[expected.id], expected, lang)
  const purchase = result.html.match(
    /<section\b(?=[^>]*class="detail-section purchase-section")[^>]*>([\s\S]*?)<\/section>/,
  )?.[0]
  const noShop = {
    en: 'No shop stock for this item is recorded in the current ROM data.',
    ja: '現在のROMデータでは、この道具の店頭在庫を確認できません。',
    th: 'ไม่พบข้อมูลว่ามีร้านขายไอเท็มชิ้นนี้ใน ROM ที่ตรวจ',
  }[lang]
  assert(purchase?.includes(noShop), `Must retain honest no-stock status ${expected.id}/${lang}`)
  const evidence = result.html.match(/<details class="evidence">([\s\S]*?)<\/details>/)?.[0]
  assert(evidence?.includes('general-tool-actions-research.md'))
}

async function checkCard(lang, expected) {
  const { runtime } = await renderCatalogue(lang, '?category=general_tool#catalogue')
  const item = data.items.find(
    (entry) => entry.category === 'general_tool' && entry.id === expected.id,
  )
  const card = runtime.renderItemCard(item)
  const start = card.indexOf('<div class="use-block"')
  const end = card.indexOf('<details class="record-details">', start)
  const block = start < 0 || end < 0 ? '' : card.slice(start, end)
  assert(block, `Missing visible card action for ${expected.id}/${lang}`)
  checkVisibleCopy(unescapeHtml(block), actionSource.items[expected.id], expected, lang)
}

function checkVisibleCopy(text, item, expected, lang) {
  for (const piece of [item.summary[lang], item.facts[lang][0]]) {
    assert(text.includes(piece), `Visible action missing ${expected.id}/${lang}`)
    assert.equal(text.split(piece).length - 1, 1, `Repeated visible copy ${expected.id}/${lang}`)
  }
}
