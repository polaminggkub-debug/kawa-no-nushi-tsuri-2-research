import assert from 'node:assert/strict'
import fs from 'node:fs'
import { notebookAction } from '../../src/pages/item/notebook.js'
import { data, render, unescapeHtml } from './shared.mjs'

const root = new URL('../..', import.meta.url)
const actionSource = JSON.parse(
  fs.readFileSync(new URL('data/general-tool-actions.json', root), 'utf8'),
).items['05']
const playerCopy = {
  en: {
    summary:
      'All four characters start with the Fishing Notebook; no purchase or quest is needed for the initial copy. Open general tools and select 05 to check your recorded fish.',
    fact: 'Switch between the six area groups to view their fish records and overview pages.',
    hidden: [
      'Open the Fishing Notebook to consult the fish records organized into six area groups and the corresponding area-overview pages.',
      'The ROM sorts the entries within each group; this item is for looking up records and does not change fishing equipment.',
      'The ROM sorts the entries within each group',
    ],
    rule: [/one entry per species/, /equal or smaller duplicate does not add another entry/],
  },
  ja: {
    summary:
      '4人とも最初から釣りノートを持っています。最初の1冊に購入やイベントは不要です。道具一覧で05を選び、記録した魚を確認してください。',
    fact: '6エリアの各グループを切り替え、魚の記録と概要ページを確認できる。',
    hidden: [
      '釣りノートを開くと、魚の記録を6エリア別に整理した一覧と対応するエリア概要を参照できる。',
      'ROMは各一覧内の記録を並べ替える。記録を調べるための道具で、釣り道具は変更しない。',
      'ROMは各一覧内の記録を並べ替える',
    ],
    rule: [/魚種ごとに1件だけ記録/, /同じサイズ以下の同種では別の項目は増えません/],
  },
  th: {
    summary:
      'ตัวละครทั้ง 4 คนมีสมุดตกปลาตั้งแต่เริ่ม ไม่ต้องซื้อหรือทำเควสต์เพื่อรับเล่มแรก เปิดรายการเครื่องมือแล้วเลือก 05 เพื่อเช็กปลาที่บันทึกไว้',
    fact: 'สลับดูทั้ง 6 ด่านเพื่ออ่านบันทึกปลาและหน้าภาพรวมของแต่ละด่าน',
    hidden: [
      'เปิดสมุดตกปลาเพื่อดูบันทึกปลาที่จัดเป็นหกพื้นที่ พร้อมหน้าภาพรวมของพื้นที่ตามลำดับ',
      'เกมเรียงรายการปลาในแต่ละพื้นที่ ไอเท็มนี้ใช้เปิดดูข้อมูล ไม่ได้เปลี่ยนอุปกรณ์ตกปลา',
      'เกมเรียงรายการปลาในแต่ละพื้นที่',
    ],
    rule: [/หนึ่งรายการต่อชนิดปลา/, /ขนาดเท่าเดิมหรือเล็กกว่า.*ไม่เพิ่มรายการใหม่/],
  },
}

for (const lang of ['en', 'ja', 'th']) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const returned = `item${suffix}.html?category=general_tool&id=05&stage=3`
  const ctx = { lang, selectedStage: 3, currentLocalRoute: () => returned, esc: String }
  const html = notebookAction(ctx, { category: 'general_tool', id: '05' })
  const href = html.match(/href="([^"]+)"/)[1]
  const url = new URL(href, 'https://example.test/catalogue/')
  assert.equal(url.pathname, `/catalogue/maps${suffix}.html`)
  assert.equal(url.searchParams.get('stage'), '3')
  assert.equal(url.searchParams.get('return'), returned)
  assert.equal(url.hash, '#notebook-guide')
  assert.equal(notebookAction(ctx, { category: 'general_tool', id: '04' }), '')
  assert(
    fs
      .readFileSync(new URL(`../../src/pages/maps/ui/maps${suffix}.html`, import.meta.url), 'utf8')
      .includes('id="notebook-guide"'),
  )
  await checkPlayerCopy(lang)
}
console.log(
  'Notebook item action PASS: localized area guide, practical purpose, duplicate-record rule and retained technical evidence.',
)

async function checkPlayerCopy(lang) {
  const item = data.items.find((entry) => entry.category === 'general_tool' && entry.id === '05')
  const use = item.playerUse
  const copy = playerCopy[lang]
  checkSourceCopy(use, lang, copy)

  const query = new URLSearchParams({ category: 'general_tool', id: '05', stage: '4' })
  const { html } = await render('item', lang, query)
  checkRenderedCopy(html, lang, copy)
}

function checkSourceCopy(use, lang, copy) {
  assert.equal(actionSource.summary[lang], copy.summary)
  assert.deepEqual(actionSource.facts[lang], [copy.fact])
  for (const fact of copy.hidden.slice(0, 2))
    assert(actionSource.evidenceNotes[lang].includes(fact))
  assert.deepEqual(use.summary[lang], copy.summary)
  assert.deepEqual(use.facts[lang], [copy.fact])
  for (const fact of copy.hidden.slice(0, 2)) assert(use.evidenceNotes[lang].includes(fact))
}

function checkRenderedCopy(html, lang, copy) {
  const decoded = unescapeHtml(html)
  const visible = decoded.split('<details class="evidence">')[0]
  const evidence = decoded.match(/<details class="evidence">[\s\S]*?<\/details>/)?.[0]
  const action = decoded.match(
    /<aside class="detail-section" data-notebook-action>[\s\S]*?<\/aside>/,
  )?.[0]
  assert(visible.includes(copy.summary) && visible.includes(copy.fact))
  for (const fact of copy.hidden) {
    assert(
      !visible.includes(fact),
      `${lang}: technical sort/use claim leaked into the player summary`,
    )
    if (fact !== copy.hidden[2])
      assert(evidence?.includes(fact), `${lang}: technical evidence was lost`)
  }
  assert(evidence && !/<details\b[^>]*\sopen/.test(evidence))
  assert(action && /66/.test(action))
  for (const rule of copy.rule) assert(rule.test(action), `${lang}: duplicate-record rule was lost`)
  assert(action.includes('#notebook-guide'))
}
