import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { flyMenuPosition } from '../../src/pages/item/fly-menu-position.js'
import { data, render, renderCatalogue, root, unescapeHtml } from './shared.mjs'

const evidence = readJson('data/fly-maker-other-families-menu-positions.json')
const attach = createRequire(import.meta.url)('../attach_fly_other_families.cjs')
const hashRows = `
caddis:body:1:1|2B|042c6c508a1e9a65aae878a7f335658339acc9aa21650711e5322dcb13d5c997
caddis:body:1:2|2F|af999d491676711de1552a240ae1616b532aaa340cf27c13ffb90373c0f119db
caddis:body:1:3|33|4b2f3dfe1ef7ce09a6a02f729e8c2ebc3fef0484034a7575ba62e90db37d0cf1
caddis:body:1:4|41|cdd8550cdbd8b9e19e70c5149b04035981fa5404dcbf5008cb18424571315a0f
caddis:body:2:1|2C|2330c52ca5db27be5d55eaef426361b2b40e9f5606366b74768450761539eb8f
caddis:body:2:2|30|ebb8382e25ba3a759f7cdcb21bf124ab2d6cb49611d7c4d094b3573cb1016193
caddis:body:2:3|3E|3e0929199021366fc33af3a21e749b0fc967f2835c080cbdfae83cf3f4342b5a
caddis:body:2:4|42|98eb9038fe1e978bdfce410ce97c795be45628668936b34aac28cb88f0954751
caddis:body:3:1|2D|a978868e26d607c012419c5eaaf0921f627085c5b6948eb438f27edfce439fb8
caddis:body:3:2|31|3cd4b3b6280ee1a5d8dee663c98076b7ecc384ea26df158a601a52fd64806466
caddis:body:3:3|3F|43e1f77cc47648bfa117e09c8bc34ca3095f15dd7b0bdaf3b8ae700de8d82b7f
caddis:body:4:1|2E|68a8abab79df73be5e48b73ba35cb6754ee3bab07baffbaa4a58f751d08545c2
caddis:body:4:2|32|76807365263b700d5c7432c89e6b86a7df9bd6eaa0198db1fefe3c4008c9044f
caddis:body:4:3|40|840d15bb40ac98becbec82b7eccadcb45ab7b878c42e01968c3cf2164e5ad340
caddis:wing:1:1|34|451b70c88c018eb0f0931fee3bd60de3bb559f2c7fb4037fd2da4d1aacc52162
caddis:wing:1:2|38|138937882282d27044839a3eefeccd1ecac3e23020fb34348d634026d829fef4
caddis:wing:1:3|3C|69cc166cc7b2fcf23e32f62e00f11bd9ba18f280176d3aff20a3f2c2174767a1
caddis:wing:1:4|46|f35b37cb5c4e3ccad0b14791878a18bbddf487badcab6ba9e8b672b9ee8792c0
caddis:wing:2:1|35|0874b24d89cb663da0d53775cf019819dc57178d5b3a2b5eb1ed927dd2234519
caddis:wing:2:2|39|20d3385baa1b6d7383693847638f5f64bfd08dd2445220fdabd6f98220ec9968
caddis:wing:2:3|43|90ae76bb8982edcb78dd102253a58de5eda929d88482dcd7006879fb280d1bdc
caddis:wing:2:4|47|8c2d4d87e2293afbdb505bd808f9dbefcdca2f625e3cc11192c1609ace9d0779
caddis:wing:3:1|36|67a42ab00b4ddd6378f4deb1e851a279e27408f427e3d0609cc3d97292705c17
caddis:wing:3:2|3A|eb464f42a88ee3245715e2960655361140252c3041d835d7ff960318df2aab21
caddis:wing:3:3|44|b01ec24f208f00120f79eda64f210fe970da4ab2ae797280ac92e6961345136b
caddis:wing:3:4|48|a8324312a5bcf726a0ab94a1f8099fc85596420dd90855a2fa74308c2fefe851
caddis:wing:4:1|37|867d827fa9d23893506e7643488460daadb0161852c46dd41fba4141a6fb1052
caddis:wing:4:2|3B|3f2ffa53f42381889683258ff3a6a169310e472a4df17ba494ba8c16a001064b
caddis:wing:4:3|45|1270f4a52dbb76be9d3fd1e9a47482f969a9706fee5bd88ff683267e4ab10243
caddis:wing:4:4|00|90886f63eb67f40c809c606ddccd2109d058f85ce22e3090515639902e99f082
caddis:tail:1:1|3D|e31a3438a197165d2b424a708fd69047fac327a986aaff00bf2a09ba16f942b3
caddis:tail:2:1|49|39f41821e34109351cf7ba627ca3e2e332d203a56a765c7ecaecb3b89ace3f2f
caddis:tail:3:1|4A|57e27077d3afe1e4ab13f2cd9f995f57799feb7ff50c70e4f4d52f7280d7b17c
caddis:tail:4:1|00|c0a5c1a9c3c6399d588a7242cf99158fac3a3ac6abfb75fa4bc958e4667387db
terrestrial:body:1:1|77|01db2f22033ae94c52c1eecb116d52cfe61b8215e2daee28961a0bc3dee3ced8
terrestrial:body:1:2|7B|8e6cd22f477982cbe5f3c9d57d4f8ecb01e1cb252f109aa9dc5999f6db4abf5b
terrestrial:body:1:3|7F|b21106094bcc46f39a754ec28944b9bc1576008b982270fd431a8a9239119871
terrestrial:body:1:4|83|f6ae7b2c42785b2d0e03ed59a1b7f71ed6880dd19394c995bf60a6d27e73cbea
terrestrial:body:2:1|78|24119e8679dbafe6375bbfd3b445da319468468ee7a354c633cdfdd18e74d223
terrestrial:body:2:2|7C|bc31509cae1acd5ab501b1837d0708dd41568043a18cadc9231955f1de65bc54
terrestrial:body:2:3|80|c2ff1a2c109f5c1953d6d8224ffcf8a4d2fbd99824e61c3d2c4c2cb779d638f5
terrestrial:body:2:4|84|f8968675a758e4a0f8fdfe9f39d0642155771b01f5cb1abe59c7b4e47be8a452
terrestrial:body:3:1|79|cecf9c72ae9425d8be28479bdc5bf9ae46aa6c01a9dd6740bbbf3148b90bcd98
terrestrial:body:3:2|7D|5ff21ac38ce2364d338a20c76027a92b32dbeb836dd86c8679ef51f385be12da
terrestrial:body:3:3|81|a34ae1c6e59157ee1e4049f7fd1c84bf9338df5fa12e0a4ae512b27bbb905940
terrestrial:body:3:4|85|e274c267c086a0983eb47a75d0e12bc2eea882a10e0426795178ba2ce5400665
terrestrial:body:4:1|7A|0ab67b5decf98ce8f3906045a92de3504ec4f4700ef77a3cebabbacf50a40c0f
terrestrial:body:4:2|7E|9e1af9aea34ad46744188ba3c656cee67b0134f177b521897ab2ef8a2789b830
terrestrial:body:4:3|82|3b9c057d8ed827138203150c91d50531ecf42d0df8f97bbb58425bb97ea0a989
terrestrial:body:4:4|86|043231227559edc388823e437bcb67fe9e3a8a10fc48930af435e01cb02faf74
`.trim()

const matrices = [
  {
    family: 'カディス',
    slug: 'caddis',
    parts: {
      body: [
        ['2B', '2F', '33', '41'],
        ['2C', '30', '3E', '42'],
        ['2D', '31', '3F', null],
        ['2E', '32', '40', null],
      ],
      wing: [
        ['34', '38', '3C', '46'],
        ['35', '39', '43', '47'],
        ['36', '3A', '44', '48'],
        ['37', '3B', '45', '00'],
      ],
      tail: [['3D'], ['49'], ['4A'], ['00']],
    },
  },
  {
    family: 'テレストリアル',
    slug: 'terrestrial',
    parts: {
      body: [
        ['77', '7B', '7F', '83'],
        ['78', '7C', '80', '84'],
        ['79', '7D', '81', '85'],
        ['7A', '7E', '82', '86'],
      ],
    },
  },
]
const expectedHashes = new Map(
  hashRows.split('\n').map((line) => {
    const [key, id, hash] = line.split('|')
    return [key, { id, hash }]
  }),
)
const localeCopy = {
  en: {
    title: 'Find this component in the game menu',
    start: 'Each part starts at the top-left cursor.',
    caption: 'Original game frame: the cursor marks this choice. Tap to enlarge.',
    position: (r, c) => `Row ${r}, column ${c}`,
    right: (n) => `Right ${n} time${n === 1 ? '' : 's'}`,
    down: (n) => `Down ${n} time${n === 1 ? '' : 's'}`,
    confirm: 'A to select',
    family: { カディス: 'Caddis', テレストリアル: 'Terrestrial' },
    scope: (e, name) => `Area 1 · choose ${name} (${e}) at the fly maker`,
    direct:
      'After selecting this Terrestrial body, the game skips wing and tail selection and opens the quote.',
  },
  ja: {
    title: 'ゲームのメニューでこの部品を選ぶ',
    start: '各部品の初期カーソルは左上です。',
    caption: 'ゲームの元画像。カーソルがこの選択肢を示します。タップで拡大。',
    position: (r, c) => `${r}行目・${c}列目`,
    right: (n) => `右${n}回`,
    down: (n) => `下${n}回`,
    confirm: 'Aで決定',
    family: { カディス: 'カディス', テレストリアル: 'テレストリアル' },
    scope: (e, name) => `エリア1 · 「${name}」のフライを作成`,
    direct:
      'このテレストリアル・ボディを選ぶと、ウィングとテールの選択画面を飛ばして見積額へ進みます。',
  },
  th: {
    title: 'เลือกชิ้นนี้ตรงไหนในเมนูเกม?',
    start: 'แต่ละเมนูเริ่มจากเคอร์เซอร์ซ้ายบน',
    caption: 'ภาพเกมจริง เคอร์เซอร์ชี้ตัวเลือกนี้ แตะรูปเพื่อขยาย',
    position: (r, c) => `แถว ${r} · คอลัมน์ ${c}`,
    right: (n) => `ขวา ${n} ครั้ง`,
    down: (n) => `ลง ${n} ครั้ง`,
    confirm: 'กด A เลือก',
    family: { カディス: 'แคดดิส', テレストリアル: 'เทอเรสเทรียล' },
    scope: (e, name) => `ร้านด่าน 1 · เลือก${name} (${e}) ตอนประกอบฟลาย`,
    direct: 'หลังเลือกบอดี้เทอเรสเทรียลนี้ เกมข้ามเมนูปีกและหาง แล้วไปหน้าเสนอราคาเลย',
  },
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
}

function expectedChoices() {
  return matrices.flatMap(({ family, slug, parts }) =>
    Object.entries(parts).flatMap(([part, rows]) =>
      rows.flatMap((ids, rowIndex) =>
        ids.flatMap((id, columnIndex) => {
          if (id === null) return []
          const row = rowIndex + 1
          const column = columnIndex + 1
          const record = expectedHashes.get(`${slug}:${part}:${row}:${column}`)
          assert(record, `Missing independent expected choice ${slug}:${part}:${row}:${column}`)
          assert.equal(record.id, id, `Wrong matrix ID ${slug}:${part}:${row}:${column}`)
          const category = { body: 'fly', wing: 'fly_wing', tail: 'fly_tail' }[part]
          const choice = {
            category,
            part,
            id,
            familyJa: family,
            area: 1,
            row,
            column,
            image: `custom/fly-other-menu-positions/${slug}-${part}-c${column}-r${row}-cursor.png`,
            imageSha256: record.hash,
            resultSource: `${slug}-${part}-c${column}-r${row}.result.json`,
          }
          if (slug === 'caddis' && ['wing', 'tail'].includes(part))
            choice.nonePosition = part === 'wing' ? { row: 4, column: 4 } : { row: 4, column: 1 }
          if (slug === 'terrestrial') choice.nextStep = 'quote'
          return [choice]
        }),
      ),
    ),
  )
}

function choiceKey(choice) {
  return `${choice.familyJa}:${choice.part}:${choice.row}:${choice.column}:${choice.category}:${choice.id}`
}

function checkEvidenceAndRawFields(expected) {
  assert.equal(evidence.schemaVersion, 1)
  assert.equal(
    evidence.romSha256,
    'e0594921a5a2ef1a2613b9d2e29fed066569e3793393c591bf4c4968a54c0b49',
  )
  assert.equal(
    evidence.coreSha256,
    '8ed333ac04544cc6ab67ceb445d095f7600bb17586d4887d99117fbd1ef776f6',
  )
  assert.equal(evidence.area, 1)
  assert(evidence.provenance.independentReplay.selectedIdsMatched)
  assert(evidence.provenance.independentReplay.cursorImageHashesMatched)
  assert.deepEqual(evidence.provenance.independentReplay.differences, 0)
  assert.deepEqual(evidence.choices.map(choiceKey).sort(), expected.map(choiceKey).sort())
  for (const choice of expected) {
    const actual = evidence.choices.find((entry) => choiceKey(entry) === choiceKey(choice))
    for (const [key, value] of Object.entries(choice))
      assert.deepEqual(actual[key], value, `${choiceKey(choice)} ${key}`)
    const item = data.items.find(
      (entry) => entry.category === choice.category && entry.id === choice.id,
    )
    if (choice.id === '00') continue
    assert(item, `Missing catalogue record ${choice.category}:${choice.id}`)
    assert.equal(
      item.rawFields['+0'],
      choice.familyJa === 'カディス' ? 1 : 4,
      `${choiceKey(choice)} family raw field`,
    )
    assert.equal(
      item.rawFields['+1'],
      { body: 0, wing: 1, tail: 2 }[choice.part],
      `${choiceKey(choice)} part raw field`,
    )
  }
  checkClampedCells()
}

function checkClampedCells() {
  const expected = [
    ['body', 3, 4, '3F', '43e1f77cc47648bfa117e09c8bc34ca3095f15dd7b0bdaf3b8ae700de8d82b7f'],
    ['body', 4, 4, '40', '840d15bb40ac98becbec82b7eccadcb45ab7b878c42e01968c3cf2164e5ad340'],
  ]
  assert.equal(evidence.clampedEmptyCellObservations.length, expected.length)
  for (const [part, row, column, selectedId, hash] of expected) {
    const observed = evidence.clampedEmptyCellObservations.find(
      (entry) => entry.part === part && entry.row === row && entry.column === column,
    )
    assert.deepEqual([observed?.selectedId, observed?.cursorSha256], [selectedId, hash])
    assert(
      !evidence.choices.some(
        (choice) =>
          choice.familyJa === 'カディス' &&
          choice.part === part &&
          choice.row === row &&
          choice.column === column,
      ),
    )
  }
}

function checkImagesAndSentinels(expected) {
  const directory = path.join(root, 'catalogue/custom/fly-other-menu-positions')
  assert.deepEqual(
    fs.readdirSync(directory).sort(),
    expected.map((entry) => path.basename(entry.image)).sort(),
  )
  for (const choice of expected) {
    const image = fs.readFileSync(path.join(root, 'catalogue', choice.image))
    assert.equal(image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a')
    assert.deepEqual([image.readUInt32BE(16), image.readUInt32BE(20)], [256, 224])
    assert.equal(
      crypto.createHash('sha256').update(image).digest('hex'),
      choice.imageSha256,
      choice.image,
    )
  }
  const none = expected.filter((choice) => choice.id === '00')
  assert.deepEqual(
    none.map((choice) => `${choice.familyJa}:${choice.part}:${choice.row}:${choice.column}`).sort(),
    ['カディス:tail:4:1', 'カディス:wing:4:4'],
  )
}

function checkAttachments(expected) {
  const real = expected.filter((choice) => choice.id !== '00')
  assert.equal(real.length, 48)
  const attached = data.items.filter((item) =>
    ['カディス', 'テレストリアル'].includes(item.flyMakerMenuChoice?.familyJa),
  )
  assert.deepEqual(
    attached
      .map((item) =>
        choiceKey({ ...item.flyMakerMenuChoice, category: item.category, id: item.id }),
      )
      .sort(),
    real.map(choiceKey).sort(),
  )
  const fixtures = real.map((choice) => {
    const item = data.items.find(
      (entry) => entry.category === choice.category && entry.id === choice.id,
    )
    return { category: choice.category, id: choice.id, rawFields: item.rawFields }
  })
  fixtures.push(
    { category: 'fly_wing', id: '00' },
    { category: 'fly_tail', id: '00' },
    { category: 'fly_unknown', id: '01' },
  )
  const fixtureData = { items: fixtures }
  attach(root, fixtureData)
  assert.equal(fixtureData.items.filter((item) => item.flyMakerMenuChoice).length, 48)
  assert(!fixtureData.items.some((item) => item.flyMakerMenuChoice?.id === '00'))
  assert.equal(
    fixtureData.items.find((item) => item.category === 'fly_unknown').flyMakerMenuChoice,
    undefined,
  )
}

function positionCopy(lang, choice) {
  const copy = localeCopy[lang]
  const family = copy.family[choice.familyJa]
  return {
    ...copy,
    scope: copy.scope(choice.familyJa, family),
    move: [
      choice.column > 1 ? copy.right(choice.column - 1) : '',
      choice.row > 1 ? copy.down(choice.row - 1) : '',
      copy.confirm,
    ]
      .filter(Boolean)
      .join(' → '),
  }
}

function expectedNone(lang, choice, copy) {
  const name = {
    en: { wing: 'wing', tail: 'tail' },
    ja: { wing: 'ウィング', tail: 'テール' },
    th: { wing: 'ปีก', tail: 'หาง' },
  }[lang][choice.part]
  const point = choice.nonePosition
  const movement = [
    point.column > 1 ? copy.right(point.column - 1) : '',
    point.row > 1 ? copy.down(point.row - 1) : '',
    copy.confirm,
  ]
    .filter(Boolean)
    .join(' → ')
  if (lang === 'en') return `To choose None for the ${name}, start at top-left: ${movement} (無し).`
  if (lang === 'ja') return `「${name}」で「無し」を選ぶ場合：左上から${movement}`
  return `ถ้าจะเลือก “ไม่มี” (無し) ในเมนู${name} ให้เริ่มจากซ้ายบน: ${movement}`
}

async function checkRenderedChoice(choice, lang) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const returned = `index${suffix}.html?category=fly&fish=06&stage=1&route=float#catalogue`
  const result = await render(
    'item',
    lang,
    new URLSearchParams({ category: choice.category, id: choice.id, return: returned }),
  )
  const marker = `data-fly-menu-position="${choice.category}:${choice.id}"`
  const start = result.html.indexOf(marker)
  assert(start >= 0, `Rendered menu position missing: ${choice.category}:${choice.id}/${lang}`)
  const begin = result.html.lastIndexOf('<section', start)
  const end = result.html.indexOf('</section>', start) + '</section>'.length
  const section = unescapeHtml(result.html.slice(begin, end))
  const copy = positionCopy(lang, choice)
  for (const text of [
    copy.title,
    copy.scope,
    copy.start,
    copy.position(choice.row, choice.column),
    copy.caption,
    copy.move,
    choice.image,
  ])
    assert(section.includes(text), `${choiceKey(choice)} missing ${lang} text: ${text}`)
  assert(section.includes(`href="${choice.image}"`))
  if (choice.nonePosition) assert(section.includes(expectedNone(lang, choice, copy)))
  if (choice.nextStep === 'quote') assert(section.includes(copy.direct))
  assert(!/category=fly_(?:wing|tail)(?:&amp;|&)id=00/.test(section))
}

function cardFor(html, category, id) {
  const identity = html.indexOf(`id="item-${category}-${id}"`)
  assert(identity >= 0, `Catalogue card missing ${category}:${id}`)
  const start = html.lastIndexOf('<article class="item-card', identity)
  const end = html.indexOf('<article class="item-card', identity + 1)
  return html.slice(start, end < 0 ? html.length : end)
}

async function checkCataloguePaths(lang) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const page = await renderCatalogue(lang, '?category=all&stage=1&route=float#catalogue')
  for (const [category, id] of [
    ['fly', '2B'],
    ['fly', '77'],
  ]) {
    const card = cardFor(page.nodes.cards.innerHTML, category, id)
    const raw = card.match(/data-fly-menu-choice href="([^"]+)"/)?.[1]
    assert(raw, `Missing localized menu action ${category}:${id}/${lang}`)
    const target = new URL(unescapeHtml(raw), page.url)
    assert(target.pathname.endsWith(`/item${suffix}.html`))
    assert.deepEqual(
      [target.searchParams.get('category'), target.searchParams.get('id'), target.hash],
      [category, id, '#fly-menu-position'],
    )
    const back = new URL(target.searchParams.get('return'), target)
    assert.equal(back.searchParams.get('stage'), '1')
    assert.equal(back.searchParams.get('route'), 'float')
    assert.equal(back.hash, '#catalogue')
  }
}

async function main() {
  const expected = expectedChoices()
  checkEvidenceAndRawFields(expected)
  checkImagesAndSentinels(expected)
  checkAttachments(expected)
  assert.equal(
    flyMenuPosition({ lang: 'en', esc: String }, { category: 'fly_unknown', id: '01' }),
    '',
  )
  for (const lang of ['en', 'ja', 'th']) {
    for (const choice of expected.filter((entry) => entry.id !== '00'))
      await checkRenderedChoice(choice, lang)
    await checkCataloguePaths(lang)
  }
  console.log(
    'PASS: 50 Caddis/Terrestrial menu positions, independent hashes, 48 ROM-field attachments, None sentinels, and three localized catalogue/detail paths.',
  )
}

await main()
