import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { bindMapTargets } from '../../src/pages/maps/bind-map-targets.js'
import { data, render, root, unescapeHtml } from './shared.mjs'

const locales = ['en', 'ja', 'th']
const story = readJson('data/magnet-story-gate.json')
const notebook = readJson('data/notebook-completion.json')
const quest = readJson('data/quest-tool-use.json')
const copy = {
  en: {
    title: 'No Magnet heading in Area 6: what next?',
    buy: 'Do not buy another Magnet yet.',
    count: 'At least 65 distinct species records out of 66 are required, not 65 catches.',
    prerequisite: '65 records alone do not guarantee a heading.',
    readerAction: 'After checking the notebook, read Received postcard 06 in the game.',
    trigger:
      'If the doctor’s giant-eel request appears, that read enables the Area 6 Magnet heading.',
    missing:
      'If it does not appear, do the village scene first: catch your character’s own special fish, then walk into the Area 1 village at field (8,183).',
    pages: 'all six in-game notebook pages',
    limit: 'chain from a fresh save',
  },
  ja: {
    title: 'エリア6で磁石が方角を示さないときは？',
    buy: '磁石をもう一つ買う必要はまだありません。',
    count: '66種類のうち異なる65種類以上の記録が必要です。65回釣るという意味ではありません。',
    prerequisite: '65種類だけで方角が出るとは限りません。',
    readerAction: '図鑑を確認したら、ゲーム内で受け取ったハガキ06を読んでください。',
    trigger:
      '医者のオオウナギ依頼が出たとき、その読み取りでエリア6の磁石の方角表示が有効になります。',
    missing:
      '出ない場合は、先に村の場面を済ませてください：自分のキャラクター専用の魚を釣り、フィールド（8,183）からエリア1の村へ入ります。',
    pages: '図鑑6ページ',
    limit: '新規セーブからの全工程',
  },
  th: {
    title: 'ด่าน 6 ใช้แม่เหล็กแล้วไม่บอกทิศ: ทำอะไรต่อ?',
    buy: 'ยังไม่ต้องซื้อแม่เหล็กเพิ่ม',
    count: 'ต้องบันทึกอย่างน้อย 65 ชนิดที่ต่างกันจาก 66 ชนิด ไม่ใช่ตก 65 ครั้ง',
    prerequisite: 'ครบ 65 ชนิดอย่างเดียวจึงไม่รับประกันว่าจะบอกทิศ',
    readerAction: 'หลังเทียบสมุด ให้อ่านไปรษณียบัตรที่ได้รับ (06) ในเกม',
    trigger: 'ถ้าข้อความหมอขอปลาไหลยักษ์ปรากฏ การอ่านครั้งนั้นจะเปิดทิศแม่เหล็กด่าน 6',
    missing:
      'ถ้ายังไม่ปรากฏ ให้ทำฉากในหมู่บ้านก่อน: ตกปลาประจำตัวละครของคุณ แล้วเดินเข้าหมู่บ้านด่าน 1 ทางสนาม (8,183)',
    pages: 'ทั้ง 6 หน้า',
    limit: 'ทั้งสายตั้งแต่เซฟใหม่',
  },
}

checkEvidence()
for (const locale of locales) await checkLocale(locale)
console.log(
  'Magnet next action PASS: Area 6-only advice, six-page/65-record caveat, safe links, and EN/JA/TH.',
)

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
}

function checkEvidence() {
  assert.equal(story.storyGate.recordArray.entryCount, 66)
  assert.equal(story.storyGate.recordArray.thresholdNonzeroEntries, 65)
  assert.match(
    story.storyGate.recordArray.meaning,
    /distinct nonzero per-ID record slots, not 65 catches/,
  )
  assert.equal(story.storyGate.prerequisiteMask, '0x02')
  assert.equal(story.storyGate.headingMask, '0x04')
  const postcard = quest.items['06']
  assert(postcard.evidence.sources.includes('docs/quest-tool-use-research.md'))
  assert(postcard.evidence.sources.includes('docs/magnet-story-gate-research.md'))
  assert(postcard.evidenceNotes.en[1].includes('For message 041E'))
  assert(postcard.evidenceNotes.en[1].includes('requires $0C18 bit 0x02, bit 0x04 clear'))
  assert(postcard.evidenceNotes.en[1].includes('at least 0x41 (65) nonzero two-byte records'))
  assert(postcard.evidenceNotes.en[1].includes('sets bit 0x04'))
  assert(postcard.evidenceNotes.en[1].includes('does not mark the eel as caught'))
  assert(postcard.evidenceNotes.en[1].includes('at least 0x41 (65)'))
  const questResearch = fs.readFileSync(path.join(root, 'docs/quest-tool-use-research.md'), 'utf8')
  assert(questResearch.includes('On that same read, `01:DEB3..DEB9` sets bit `0x04`'))
  assert.equal(notebook.stages.length, 6)
  assert.equal(notebook.totals.notebookEligibleSpecies, 66)
  const ids = notebook.stages.flatMap((stage) => stage.firstOccurrenceSpecies)
  assert.equal(new Set(ids).size, 66)
  assert.deepEqual(
    [...new Set(ids)].sort(),
    Object.keys(notebook.species)
      .filter((id) => notebook.species[id].notebookEligible)
      .sort(),
  )
}

async function checkLocale(locale) {
  const query = new URLSearchParams({ category: 'general_tool', id: '0E', stage: '6' })
  const detail = await render('item', locale, query)
  const panel = extractPanel(detail.html)
  checkPlayerCopy(panel, locale)
  checkPreservedUse(panel, locale)
  checkLinks(panel, detail.url, locale)
  await checkLocationGrouping(locale, detail.html)
  await checkHiddenCases(locale)
}

function extractPanel(html) {
  const panels =
    html.match(
      /<section\b(?=[^>]*id="what-to-do")(?=[^>]*data-magnet-next-action)[^>]*>[\s\S]*?<\/section>/g,
    ) || []
  assert.equal(panels.length, 1, 'Magnet advice must render exactly once for Area 6 item 0E')
  assert.equal(
    (html.match(/id="what-to-do"/g) || []).length,
    1,
    'Do not render a duplicate decision panel',
  )
  return panels[0]
}

function checkPlayerCopy(panel, locale) {
  const text = unescapeHtml(panel)
  for (const required of Object.values(copy[locale]))
    assert(text.includes(required), `${locale}: missing ${required}`)
  assert(text.includes('magnet-story-gate-research.md'))
  assert(text.includes('quest-tool-use-research.md'))
}

function checkPreservedUse(panel, locale) {
  const item = data.items.find(
    (candidate) => candidate.category === 'general_tool' && candidate.id === '0E',
  )
  const details = panel.match(/<details class="magnet-general-use">[\s\S]*?<\/details>/)?.[0]
  assert(
    item && details,
    `${locale}: original Magnet use guidance must remain collapsed in the panel`,
  )
  assert(!/<details\b[^>]*\bopen(?:\s|=|>)/.test(details))
  const text = unescapeHtml(panel)
  const detailText = unescapeHtml(details)
  const general = item.playerUse
  const summary = general.summary[locale]
  const note = item[`imageNote${locale === 'th' ? 'Th' : locale === 'ja' ? 'Ja' : 'En'}`]
  assert(detailText.includes(summary), `${locale}: original summary was not preserved`)
  assert.equal(occurrences(text, summary), 1, `${locale}: duplicate original summary`)
  assert(detailText.includes(note), `${locale}: original image note was not preserved`)
  assert.equal(occurrences(text, note), 1, `${locale}: duplicate original image note`)
  for (const fact of general.facts[locale]) {
    assert(detailText.includes(fact), `${locale}: original fact was lost`)
    assert.equal(occurrences(text, fact), 1, `${locale}: duplicate original fact`)
  }
}

function occurrences(text, term) {
  return text.split(term).length - 1
}

function checkLinks(panel, base, locale) {
  const notebookLink = link(panel, 'data-magnet-notebook', base)
  const mapLink = link(panel, 'data-magnet-map', base)
  const mailLink = link(panel, 'data-magnet-mail', base)
  const suffix = locale === 'en' ? '' : `.${locale}`
  checkMapsLink(notebookLink, base, suffix, '#notebook-guide')
  checkMapsLink(mapLink, base, suffix, '#map-view')
  checkMailLink(mailLink, base, suffix)
  checkBackAnchor(notebookLink.searchParams.get('return'), locale)
  assert.equal((panel.match(/data-magnet-(?:notebook|map|mail)\b/g) || []).length, 3)
}

function checkBackAnchor(returnPath, locale) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'document')
  let back
  const heroMeta = { prepend: (element) => (back = element) }
  const node = { addEventListener() {} }
  globalThis.document = {
    createElement: () => ({ className: '', id: '', href: '', textContent: '' }),
    querySelector: (selector) => (selector === '.hero-meta' ? heroMeta : null),
  }
  try {
    bindMapTargets({ lang: locale, returnPath, areaList: node, fishList: node, $: () => node })
    assert.equal(back?.id, 'map-source-back')
    assert.equal(back?.href, returnPath)
  } finally {
    if (previous) Object.defineProperty(globalThis, 'document', previous)
    else delete globalThis.document
  }
  const styles = fs.readFileSync(path.join(root, 'src/shared/ui/part-4.css'), 'utf8')
  assert.match(styles, /\[id\]\s*\{\s*scroll-margin-top:\s*12px;/)
  assert.match(
    styles,
    /@media \(max-width: 700px\)\s*\{\s*\[id\]\s*\{\s*scroll-margin-top:\s*12px;/,
  )
  const baseStyles = fs.readFileSync(path.join(root, 'src/shared/ui/part-1.css'), 'utf8')
  assert.match(baseStyles, /html\s*\{\s*scroll-padding-top:\s*92px;/)
  assert.match(
    styles,
    /@media \(max-width: 700px\)\s*\{\s*html\s*\{\s*scroll-padding-top:\s*170px;/,
  )
  const mapStyles = fs.readFileSync(path.join(root, 'src/pages/maps/styles/part-1.css'), 'utf8')
  assert.match(mapStyles, /html\s*\{\s*scroll-behavior:\s*auto;/)
}

function checkMapsLink(url, base, suffix, hash) {
  assert.equal(
    url.pathname,
    `${base.pathname.slice(0, base.pathname.lastIndexOf('/') + 1)}maps${suffix}.html`,
  )
  assert.deepEqual([...url.searchParams.keys()], ['stage', 'return'])
  assert.equal(url.searchParams.get('stage'), '6')
  assert.equal(url.hash, hash)
  checkMagnetReturn(url.searchParams.get('return'), base)
}

function checkMailLink(url, base, suffix) {
  assert.equal(
    url.pathname,
    `${base.pathname.slice(0, base.pathname.lastIndexOf('/') + 1)}item${suffix}.html`,
  )
  assert.deepEqual([...url.searchParams.keys()], ['stage', 'return', 'category', 'id'])
  assert.equal(url.searchParams.get('stage'), '6')
  assert.equal(url.searchParams.get('category'), 'general_tool')
  assert.equal(url.searchParams.get('id'), '06')
  assert.equal(url.hash, '')
  checkMagnetReturn(url.searchParams.get('return'), base)
}

function checkMagnetReturn(value, base) {
  const returned = new URL(value, base)
  assert.equal(returned.pathname, base.pathname)
  assert.equal(returned.searchParams.get('category'), 'general_tool')
  assert.equal(returned.searchParams.get('id'), '0E')
  assert.equal(returned.searchParams.get('stage'), '6')
  assert.deepEqual([...returned.searchParams.keys()], ['category', 'id', 'stage'])
  assert(!returned.searchParams.has('fish') && !returned.searchParams.has('route'))
}

async function checkLocationGrouping(locale, area6Html) {
  const query = new URLSearchParams({ category: 'general_tool', id: '0E', stage: '1' })
  const area1 = await render('item', locale, query)
  assert.equal((area1.html.match(/id="what-to-do"/g) || []).length, 1)
  assert(
    !area1.html.includes('data-magnet-next-action'),
    `${locale}: Area 1 should keep the normal panel`,
  )
  const stage1 = locationGroups(area1.html)
  assert.deepEqual(stage1.visible, ['1'], `${locale}: show the selected Area 1 exit first`)
  assert.deepEqual(stage1.collapsed, ['2', '3', '4', '5'])
  const stage6 = locationGroups(area6Html)
  assert.deepEqual(stage6.visible, [], `${locale}: Area 6 has no fixed exit pin`)
  assert.deepEqual(stage6.collapsed, ['1', '2', '3', '4', '5'])
}

function locationGroups(html) {
  const section = html.match(/<section\b[^>]*id="use-locations"[\s\S]*?<\/section>/)?.[0]
  assert(section, 'Magnet location section must render')
  const match = section.match(/<details class="magnet-other-exits">[\s\S]*?<\/details>/)
  assert(match, 'Other-area Magnet exits must be grouped in a disclosure')
  assert(!/<details\b[^>]*\bopen(?:\s|=|>)/.test(match[0]), 'Other-area exits must start closed')
  const ids = (value) => [...value.matchAll(/id="compass-exit-(\d)"/g)].map((entry) => entry[1])
  return { visible: ids(section.slice(0, match.index)), collapsed: ids(match[0]) }
}

function link(html, marker, base) {
  const match = html.match(new RegExp(`<a\\b[^>]*${marker}[^>]*href="([^"]+)"`))
  assert(match, `Missing ${marker} link`)
  return new URL(unescapeHtml(match[1]), base)
}

async function checkHiddenCases(locale) {
  for (const stage of ['', '1', '2', '3', '4', '5', '7']) {
    const query = new URLSearchParams({ category: 'general_tool', id: '0E' })
    if (stage) query.set('stage', stage)
    const detail = await render('item', locale, query)
    assert(
      !detail.html.includes('data-magnet-next-action'),
      `${locale}: Magnet panel shown outside Area 6`,
    )
  }
  for (const [category, id] of [
    ['general_tool', '06'],
    ['general_tool', '0F'],
    ['rod', '0E'],
  ]) {
    const detail = await render('item', locale, new URLSearchParams({ category, id, stage: '6' }))
    assert(
      !detail.html.includes('data-magnet-next-action'),
      `${locale}: panel shown for ${category}:${id}`,
    )
  }
}
