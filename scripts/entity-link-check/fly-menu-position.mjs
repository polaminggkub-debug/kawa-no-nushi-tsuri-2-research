import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { flyMenuPosition } from '../../src/pages/item/fly-menu-position.js'
import { data, render, renderCatalogue, root, unescapeHtml } from './shared.mjs'

const evidence = readJson('data/fly-maker-menu-positions.json')
const wingEvidence = readJson('data/fly-maker-wing-palette.json')
const attach = createRequire(import.meta.url)('../attach_fly_menu_positions.cjs')

const matrices = [
  {
    part: 'body',
    category: 'fly',
    rows: [
      ['01', '05', '18', '1C'],
      ['02', '06', '19', '1D'],
      ['03', '07', '1A', '1E'],
      ['04', '08', '1B', null],
    ],
  },
  {
    part: 'tail',
    category: 'fly_tail',
    rows: [
      ['13', '17', '2A'],
      ['14', '27', '00'],
      ['15', '28', null],
      ['16', '29', null],
    ],
  },
  {
    part: 'wing',
    category: 'fly_wing',
    rows: [
      ['09', '0D', '11', '21'],
      ['0A', '0E', '12', '22'],
      ['0B', '0F', '1F', '23'],
      ['0C', '10', '20', '24'],
    ],
  },
]

const expected = matrices.flatMap(({ part, category, rows }) =>
  rows.flatMap((values, row) =>
    values.flatMap((id, column) =>
      id === null ? [] : [{ part, category, id, row: row + 1, column: column + 1 }],
    ),
  ),
)

assert.equal(evidence.schemaVersion, 1)
assert.equal(evidence.romSha256, 'e0594921a5a2ef1a2613b9d2e29fed066569e3793393c591bf4c4968a54c0b49')
assert.equal(
  evidence.coreSha256,
  '8ed333ac04544cc6ab67ceb445d095f7600bb17586d4887d99117fbd1ef776f6',
)
assert.equal(evidence.area, 1)
assert.equal(evidence.familyJa, 'メイフライ')
assert.match(evidence.scope, /Area 1 Mayfly/)
assert.equal(evidence.choices.length, 41)
assert.deepEqual(
  sortChoices(evidence.choices),
  sortChoices(expected),
  'Body, tail, None, or wing position matrix changed',
)

const wingPositions = evidence.choices.filter((choice) => choice.part === 'wing')
assert.equal(wingPositions.length, 16)
assert.equal(wingEvidence.romSha256, evidence.romSha256)
assert.deepEqual(
  sortChoices(
    wingPositions.map(({ part, category, id, row, column }) => ({
      part,
      category,
      id,
      row,
      column,
    })),
  ),
  sortChoices(
    wingEvidence.positions.map((choice) => ({
      part: 'wing',
      category: 'fly_wing',
      id: choice.wingId,
      row: choice.row,
      column: choice.column,
    })),
  ),
  'Wing positions differ from the independently verified palette',
)

function sortChoices(choices) {
  return choices
    .map(({ part, category, id, row, column }) => `${part}:${category}:${id}:${row}:${column}`)
    .sort()
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
}

function checkClampedPositions() {
  const expectedClamped = [
    { part: 'body', row: 4, column: 4, selectedId: '1B', previousRow: 4, previousColumn: 3 },
    { part: 'tail', row: 3, column: 3, selectedId: '28', previousRow: 3, previousColumn: 2 },
    { part: 'tail', row: 4, column: 3, selectedId: '29', previousRow: 4, previousColumn: 2 },
  ]
  assert.equal(evidence.clampedEmptyCellObservations.length, expectedClamped.length)
  for (const expectedObservation of expectedClamped) {
    const observation = evidence.clampedEmptyCellObservations.find(
      (entry) =>
        entry.part === expectedObservation.part &&
        entry.row === expectedObservation.row &&
        entry.column === expectedObservation.column,
    )
    assert(observation, `Missing clamped ${expectedObservation.part} observation`)
    assert.equal(observation.selectedId, expectedObservation.selectedId)
    const previous = evidence.choices.find(
      (entry) =>
        entry.part === expectedObservation.part &&
        entry.row === expectedObservation.previousRow &&
        entry.column === expectedObservation.previousColumn,
    )
    assert(previous, `Missing previous valid ${expectedObservation.part} choice`)
    assert.equal(previous.id, observation.selectedId)
    assert.equal(previous.imageSha256, observation.cursorSha256)
    assert(
      !evidence.choices.some(
        (entry) =>
          entry.part === expectedObservation.part &&
          entry.row === expectedObservation.row &&
          entry.column === expectedObservation.column,
      ),
      'A clamped empty cell must not be presented as a new component choice',
    )
  }
}

function checkPublishedImages() {
  const relativeDirectory = 'catalogue/custom/fly-menu-positions'
  const imageDirectory = path.join(root, relativeDirectory)
  const expectedNames = evidence.choices.map((choice) => path.basename(choice.image)).sort()
  const publishedNames = fs.readdirSync(imageDirectory).sort()
  assert.deepEqual(
    publishedNames,
    expectedNames,
    'Only the 41 menu screenshots should be published here',
  )

  for (const choice of evidence.choices) {
    assert(choice.image.startsWith('custom/fly-menu-positions/'))
    assert.equal(path.extname(choice.image).toLowerCase(), '.png')
    assert(!/\.(?:sfc|smc|state|dylib|wram|bin)$/i.test(choice.image))
    const imagePath = path.join(root, 'catalogue', choice.image)
    const image = fs.readFileSync(imagePath)
    assert.equal(image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a')
    assert.equal(image.readUInt32BE(16), 256, `Wrong image width ${choice.image}`)
    assert.equal(image.readUInt32BE(20), 224, `Wrong image height ${choice.image}`)
    assert.equal(
      crypto.createHash('sha256').update(image).digest('hex'),
      choice.imageSha256,
      `Image hash mismatch ${choice.image}`,
    )
  }
}

function checkAttachments() {
  const realChoices = evidence.choices.filter((choice) => choice.id !== '00')
  assert.equal(realChoices.length, 40)
  const attached = data.items.filter(
    (item) => item.flyMakerMenuChoice?.familyJa === evidence.familyJa,
  )
  assert.equal(attached.length, realChoices.length)
  assert.deepEqual(
    sortChoices(
      attached.map((item) => ({
        category: item.category,
        part: item.flyMakerMenuChoice.part,
        id: item.id,
        row: item.flyMakerMenuChoice.row,
        column: item.flyMakerMenuChoice.column,
      })),
    ),
    sortChoices(realChoices),
  )
  assert(!attached.some((item) => item.id === '00'))

  checkMayflyAttachmentFixtures(realChoices)
}

function checkMayflyAttachmentFixtures(realChoices) {
  const fixtures = realChoices.map((choice) => ({
    category: choice.category,
    id: choice.id,
    flyMakerMenuChoice: { stale: true },
  }))
  fixtures.push(
    { category: 'fly_unverified', id: '01', flyMakerMenuChoice: { stale: true } },
    { category: 'fly_tail', id: '00', flyMakerMenuChoice: { stale: true } },
  )
  const fixtureData = { items: fixtures }
  attach(root, fixtureData)
  assert.equal(fixtureData.items.filter((item) => item.flyMakerMenuChoice).length, 40)
  assert.equal(
    fixtureData.items.find((item) => item.category === 'fly_unverified').flyMakerMenuChoice,
    undefined,
  )
  assert.equal(
    fixtureData.items.find((item) => item.category === 'fly_tail' && item.id === '00')
      .flyMakerMenuChoice,
    undefined,
  )
  assert.throws(
    () =>
      attach(root, {
        items: fixtures.filter((item) => !(item.category === 'fly' && item.id === '01')),
      }),
    /Missing maker menu item fly:01/,
    'A missing catalogue record must stop the attachment build',
  )
}

function checkUnknownComponent() {
  const rendered = flyMenuPosition(
    { esc: (value) => String(value), lang: 'en' },
    { category: 'fly_unverified', id: '01' },
  )
  assert.equal(
    rendered,
    '',
    'Unknown component categories must not receive an inferred menu position',
  )
  assert(!data.items.some((item) => item.category === 'fly_tail' && item.id === '00'))
}

async function checkRenderedPosition(choice, lang) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const returned = `index${suffix}.html?category=all&fish=06&stage=1&route=float&map=2#catalogue`
  const result = await render(
    'item',
    lang,
    new URLSearchParams({ category: choice.category, id: choice.id, return: returned }),
  )
  const marker = `data-fly-menu-position="${choice.category}:${choice.id}"`
  const start = result.html.indexOf(marker)
  assert(start >= 0, `Missing fly menu position ${choice.category}:${choice.id}/${lang}`)
  const sectionStart = result.html.lastIndexOf('<section', start)
  const sectionEnd = result.html.indexOf('</section>', start) + '</section>'.length
  const section = unescapeHtml(result.html.slice(sectionStart, sectionEnd))
  const positionCopy = localeCopy[lang]
  assert(section.includes(positionCopy.title))
  assert(section.includes(positionCopy.scope))
  assert(section.includes(positionCopy.position(choice.row, choice.column)))
  assert(section.includes(positionCopy.start))
  assert(section.includes(positionCopy.caption))
  assert(section.includes(positionCopy.evidence))
  assert(section.includes(positionCopy.limit))
  assert(section.includes(positionCopy.notes))
  assert(section.includes(choice.image))
  assert(section.includes(`href="${choice.image}"`))
  assert(
    section.includes(
      `${choice.column > 1 ? positionCopy.right(choice.column - 1) + ' → ' : ''}${choice.row > 1 ? positionCopy.down(choice.row - 1) + ' → ' : ''}${positionCopy.confirm}`,
    ),
  )
  assert(section.includes(`width="256" height="224"`))
  assert(section.includes('id="fly-menu-position"'))
  if (choice.part === 'tail') {
    assert(section.includes(positionCopy.noneTail))
    assert(section.includes('class="fly-menu-none-tail"'))
    assert(!/category=fly_tail(?:&amp;|&)id=00/.test(section))
  } else {
    assert(!section.includes(positionCopy.noneTail))
  }
}

async function checkCatalogueMenuLinkContext(lang) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const query = '?category=all&fish=06&stage=1&q=01&sort=id&route=sinker&map=0#catalogue'
  const result = await renderCatalogue(lang, query)
  const body = data.items.find((item) => item.category === 'fly' && item.id === '01')
  const card = cardFor(result.nodes.cards.innerHTML, body)
  const href = card.match(/data-fly-menu-choice href="([^"]+)"/)?.[1]
  assert(href, `Missing direct position action for body 01/${lang}`)
  const target = new URL(unescapeHtml(href), result.url)
  assert(target.pathname.endsWith(`/item${suffix}.html`))
  assert.equal(target.searchParams.get('category'), 'fly')
  assert.equal(target.searchParams.get('id'), '01')
  assert.equal(target.searchParams.get('fish'), '06')
  assert.equal(target.searchParams.get('stage'), '1')
  assert.equal(target.searchParams.get('route'), 'fly')
  assert.equal(target.hash, '#fly-menu-position')

  const back = new URL(target.searchParams.get('return'), target)
  assert.equal(back.pathname, result.url.pathname)
  for (const key of ['category', 'fish', 'stage', 'q', 'sort', 'route', 'map'])
    assert.equal(
      back.searchParams.get(key),
      result.url.searchParams.get(key),
      `Lost ${key}/${lang}`,
    )
  assert.equal(back.hash, '#catalogue')
}

function cardFor(html, item) {
  const identity = html.indexOf(`id="item-${item.category}-${item.id}"`)
  assert(identity >= 0, `Missing catalogue card ${item.category}:${item.id}`)
  const start = html.lastIndexOf('<article class="item-card', identity)
  const end = html.indexOf('<article class="item-card', identity + 1)
  return html.slice(start, end < 0 ? html.length : end)
}

const localeCopy = {
  en: {
    title: 'Find this component in the game menu',
    scope: 'choose Mayfly (メイフライ) at the fly maker',
    start: 'Each part starts at the top-left cursor.',
    right: (count) => `Right ${count} time${count === 1 ? '' : 's'}`,
    down: (count) => `Down ${count} time${count === 1 ? '' : 's'}`,
    confirm: 'A to select',
    position: (row, column) => `Row ${row}, column ${column}`,
    caption: 'Original game frame: the cursor marks this choice. Tap to enlarge.',
    noneTail: 'To omit the tail, start at top-left: Right 2 → Down 1 → A (無し).',
    evidence: 'Evidence and limits',
    limit:
      'Verified in this Area 1 Mayfly menu only. Position identifies the component; it does not establish a bite or landing advantage. Check the final quote before paying.',
    notes: 'Read the menu-position research',
  },
  ja: {
    title: 'ゲームのメニューでこの部品を選ぶ',
    scope: '毛バリ作成で「メイフライ」を選択',
    start: '各部品の初期カーソルは左上です。',
    right: (count) => `右${count}回`,
    down: (count) => `下${count}回`,
    confirm: 'Aで決定',
    position: (row, column) => `${row}行目・${column}列目`,
    caption: 'ゲームの元画像。カーソルがこの選択肢を示します。タップで拡大。',
    noneTail: 'テールを付けない場合：左上から右に2回、下に1回移動し、「無し」でAを押します。',
    evidence: '根拠と確認範囲',
    limit:
      'エリア1のメイフライ画面で確認した位置です。部品の識別であり、食いつきや取り込み効果の証明ではありません。支払い前に見積額を確認してください。',
    notes: 'メニュー位置の調査を読む',
  },
  th: {
    title: 'เลือกชิ้นนี้ตรงไหนในเมนูเกม?',
    scope: 'เลือกเมย์ฟลาย (メイフライ) ตอนประกอบฟลาย',
    start: 'แต่ละเมนูเริ่มจากเคอร์เซอร์ซ้ายบน',
    right: (count) => `ขวา ${count} ครั้ง`,
    down: (count) => `ลง ${count} ครั้ง`,
    confirm: 'กด A เลือก',
    position: (row, column) => `แถว ${row} · คอลัมน์ ${column}`,
    caption: 'ภาพเกมจริง เคอร์เซอร์ชี้ตัวเลือกนี้ แตะรูปเพื่อขยาย',
    noneTail: 'ถ้าไม่ใส่หาง ให้เริ่มจากซ้ายบน: กดขวา 2 ครั้ง → ลง 1 ครั้ง → A ที่ “ไม่มี” (無し)',
    evidence: 'หลักฐานและขอบเขต',
    limit:
      'ยืนยันตำแหน่งเฉพาะเมนูเมย์ฟลายในร้านด่าน 1 ตำแหน่งบอกว่าชิ้นไหน ไม่ได้พิสูจน์ว่าปลากินหรือตกขึ้นง่ายกว่า ตรวจราคาสุทธิก่อนจ่าย',
    notes: 'อ่านการวิจัยตำแหน่งเมนู',
  },
}

checkClampedPositions()
checkPublishedImages()
checkAttachments()
checkUnknownComponent()
for (const lang of ['en', 'ja', 'th']) {
  for (const choice of evidence.choices.filter((entry) => entry.id !== '00'))
    await checkRenderedPosition(choice, lang)
  await checkCatalogueMenuLinkContext(lang)
}

console.log(
  'PASS: 41 Area 1 Mayfly menu positions, authentic images, 40 Mayfly component links, unknown-item fallback, and localized position instructions.',
)
