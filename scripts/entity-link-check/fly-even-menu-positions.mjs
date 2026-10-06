import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { flyMenuPosition } from '../../src/pages/item/fly-menu-position.js'
import { data, render, renderCatalogue, root, unescapeHtml } from './shared.mjs'

const evidence = readJson('data/fly-maker-even-families-menu-positions.json')
const attach = createRequire(import.meta.url)('../attach_fly_even_families.cjs')

const matrices = [
  {
    slug: 'diptera',
    familyJa: 'ディプテラ',
    familyId: 2,
    parts: {
      body: [
        ['4B', '4F', '59', null],
        ['4C', '56', null, null],
        ['4D', '57', null, null],
        ['4E', '58', null, null],
      ],
      wing: [
        ['50', '5B', '00', null],
        ['51', '5C', null, null],
        ['52', '5D', null, null],
        ['5A', '5E', null, null],
      ],
      tail: [
        ['53', '00', null, null],
        ['54', null, null, null],
        ['55', null, null, null],
        ['5F', null, null, null],
      ],
    },
    none: { wing: { row: 1, column: 3 }, tail: { row: 1, column: 2 } },
  },
  {
    slug: 'stonefly',
    familyJa: 'ストーンフライ',
    familyId: 3,
    parts: {
      body: [
        ['60', '64', '6E', null],
        ['61', '65', '6F', null],
        ['62', '6C', null, null],
        ['63', '6D', null, null],
      ],
      wing: [
        ['70', '00', null, null],
        ['71', null, null, null],
        ['72', null, null, null],
        ['73', null, null, null],
      ],
      tail: [
        ['68', '74', null, null],
        ['69', '75', null, null],
        ['6A', '76', null, null],
        ['6B', '00', null, null],
      ],
    },
    none: { wing: { row: 1, column: 2 }, tail: { row: 4, column: 2 } },
  },
]

const hashRows = `
diptera:body:1:1|4B|9ce7d133d13b12d2c5b8a033614c19a2a16a8d657d0660b7edb045ed5e8e3b03
diptera:body:1:2|4F|19b10006e13cb1e22e962e86fa6d75003d06a870617f51787449c7ba10a0be6d
diptera:body:1:3|59|6c38d8592d6b1c443148fd89445cb57b3eec320b2be7d90c96126d3eb93374aa
diptera:body:2:1|4C|490e4b453203061dc33ac5b59cdb62fa909d9abc4c8d0b3713674a0d1b783941
diptera:body:2:2|56|1d1cbe27da38470ab15966c4e71828b6409535f55aec86696a1ac2d92f1f6d4a
diptera:body:3:1|4D|5a9f80fb7876eba9ff01dc1b4f072506ba110994521c006b777f6676cdbb0830
diptera:body:3:2|57|b115df79474219a371997f82843fda78ef42e2e78ea95539fc4b3097fb97c049
diptera:body:4:1|4E|9fc013479de94dbdce2b9fa506d9b818c7e75a40526c035098ff3293712c342e
diptera:body:4:2|58|c6e53cc0dfc4de7adf2bb6e03375e21c9032e8bf763f732299ff49a13a1a7936
diptera:wing:1:1|50|908893b11eda9833c91b4b8bb242918f8e19245429fd12c79906fc719954446e
diptera:wing:1:2|5B|dcdfa4cd86248534bd81116b3b0e5b494fa523406a96d8aed88e0f51a40fb8cf
diptera:wing:1:3|00|57b5f50a93328b8b076037e1bb8d9d4c256f7fbd76e635c72b2960e45f9d830e
diptera:wing:2:1|51|4fb85161e46f3251ec0e3df8267ab756587ecca24cf5b4ae4e75e9712cfa4202
diptera:wing:2:2|5C|214e610fd7c423af9387dd53d8bc288d26a83b9e074f9a72b8b973bee03c67db
diptera:wing:3:1|52|fec89ab60eabf8a4803aa22f518e22de681844558a0510e03b2fd574bbfe1065
diptera:wing:3:2|5D|8d2bf807b5ace53bcf1ea138f65c241df75934e706ebf1f1a519817e65ebcfae
diptera:wing:4:1|5A|53b6a18acb1dd8dd94287b4cc86bb309c972de7ea08de20b03c11e8ae14faa18
diptera:wing:4:2|5E|4155246450872ad73ea89c8b2393f35f503a3f2715760dfc7e4babb24e42ed75
diptera:tail:1:1|53|6dbe02dc2d3394f84caa319bdb76d2e0e1f20286dc18ba3bd0bbc5170abe079c
diptera:tail:1:2|00|1a4a7f040042e4041099e5fa1895805d2e3707c9cde5c176b460b4989f666998
diptera:tail:2:1|54|8580ac69c6ef8e10a37f2f818dd7f2293b70b42e98b54a40097bb047f2ebda67
diptera:tail:3:1|55|c4f45bae19664e0b70225e56814ee79641c1c92927bf5ce49f3b53c7709e5853
diptera:tail:4:1|5F|5cd5a1e3fa0279a2c148bda361f08047354089434d0cdb0355df85f51dc3170d
stonefly:body:1:1|60|bd5db4475ed16f668ce41431857d14aa243fe3f4882a961b553b6896115668ab
stonefly:body:1:2|64|862da12b346ba64a8519bc771b83932cb2861b246a3d42b3063fcaa6f7e317ee
stonefly:body:1:3|6E|18304c586d48bf39d80c8ffe2b20c6f065536172eff42f8a8993c15e67415ff0
stonefly:body:2:1|61|c832253471d1d05c0829b04cf9365187aef50f207db1e8a855eba42d7bb9bc9b
stonefly:body:2:2|65|73054c9e9995a986f9b0345e7c84f321dc82ff74f0fb9b859452311ff2760195
stonefly:body:2:3|6F|b8df47a7d503f3c16659935f9b06655de093ffd22790d4919de14bf60acf0bf7
stonefly:body:3:1|62|69d75d445dd35081013fecf2bda5f675036248b7b159154f326b2da55ce1aa6e
stonefly:body:3:2|6C|334a102a136b9660b267b62164899a1f69d0ed368cf9a1c74ebb8dbf3e20694a
stonefly:body:4:1|63|81d763717b810e2c6eff3ee7ac41a5a9a0e441035929772277d4384f87e3b97f
stonefly:body:4:2|6D|3fbde50748e7b913b2e8bdd5a759f30aafad4e7d40c7c275557064ccfe6e2a7f
stonefly:wing:1:1|70|98debfbb87ea12d4e4dd4edcd233f975b3e13ecbd9a4ce8bc5826f8456aeb800
stonefly:wing:1:2|00|9693d15b63d4ae32d68053dca9ded8f966c9aa0d641d501b913862bb1303f27d
stonefly:wing:2:1|71|0ac7ddb9a50f649507700ab6e1b54b714d5590257f601d5e7072b04287a856a8
stonefly:wing:3:1|72|7783bc14ff269042bc066529d14f6f24676d46308ec92d39bf373eee10f1ae90
stonefly:wing:4:1|73|0b4a2889d96618e7e0c79fab3f83c89a069eb9d7b55b9baeb61852ebc93af5da
stonefly:tail:1:1|68|9c37d2628f58534df937a7a1418aec5db90e89f1996da3fbf92cfcf6936d63cc
stonefly:tail:1:2|74|9373a496a35f51d27e48a5bd4e6609a6e3ef0a1cafc5d762b9e5bd75444c3bb7
stonefly:tail:2:1|69|4add35ac3d842aecd393cc5ef14d3c79c8ac2342f1d1eea69bb13f72071016f2
stonefly:tail:2:2|75|a8d327ec6542d6cd367db15939265d803f360ecbb57e61de7715b122b528d6ba
stonefly:tail:3:1|6A|a7f12d26ded0c12e7c9f8269924989b5b85a5a556ed43d0ceba13c82daf95b95
stonefly:tail:3:2|76|f3dcb97f01cac54499cbfa203f696e8e319589b7c48f4e668396374d2e7d17bb
stonefly:tail:4:1|6B|f38adcd5114d9b1f53742a0ad438d7402dcf4dcf0c07a2192cf8d1cbe09d611f
stonefly:tail:4:2|00|ad4e345fedf8213d26e01faf990824b6ddebb8611c77ab2b6486b3f1f0428b54
`.trim()

const hashes = new Map(
  hashRows.split('\n').map((line) => {
    const [key, id, imageSha256] = line.split('|')
    return [key, { id, imageSha256 }]
  }),
)

const localeCopy = {
  en: {
    title: 'Find this component in the game menu',
    start: 'Each part starts at the top-left cursor.',
    caption: 'Original game frame: the cursor marks this choice. Tap to enlarge.',
    position: (row, column) => `Row ${row}, column ${column}`,
    right: (count) => `Right ${count} time${count === 1 ? '' : 's'}`,
    down: (count) => `Down ${count} time${count === 1 ? '' : 's'}`,
    confirm: 'A to select',
    part: { wing: 'wing', tail: 'tail' },
    family: { diptera: 'Diptera', stonefly: 'Stonefly' },
    scope: (family, familyJa) => `choose ${family} (${familyJa}) at the fly maker`,
    none: (part, moves) => `To choose None for the ${part}, start at top-left: ${moves} (無し).`,
    limit:
      'These positions were independently replayed in a controlled even-area menu fixture. This verifies the palette, not the walking route or natural shop access. No bite or landing advantage is established; check the final quote before paying.',
  },
  ja: {
    title: 'ゲームのメニューでこの部品を選ぶ',
    start: '各部品の初期カーソルは左上です。',
    caption: 'ゲームの元画像。カーソルがこの選択肢を示します。タップで拡大。',
    position: (row, column) => `${row}行目・${column}列目`,
    right: (count) => `右${count}回`,
    down: (count) => `下${count}回`,
    confirm: 'Aで決定',
    part: { wing: 'ウィング', tail: 'テール' },
    family: { diptera: 'ディプテラ', stonefly: 'ストーンフライ' },
    scope: (_family, familyJa) => `「${familyJa}」のフライを作成`,
    none: (part, moves) => `「${part}」で「無し」を選ぶ場合：左上から${moves}`,
    limit:
      '偶数エリアのメニューを再現した制御条件で、部品位置を独立に再確認しました。通常プレイでの店への経路や利用可能時期の証明ではありません。釣果の優位も未確認です。支払前に見積額を確認してください。',
  },
  th: {
    title: 'เลือกชิ้นนี้ตรงไหนในเมนูเกม?',
    start: 'แต่ละเมนูเริ่มจากเคอร์เซอร์ซ้ายบน',
    caption: 'ภาพเกมจริง เคอร์เซอร์ชี้ตัวเลือกนี้ แตะรูปเพื่อขยาย',
    position: (row, column) => `แถว ${row} · คอลัมน์ ${column}`,
    right: (count) => `ขวา ${count} ครั้ง`,
    down: (count) => `ลง ${count} ครั้ง`,
    confirm: 'กด A เลือก',
    part: { wing: 'ปีก', tail: 'หาง' },
    family: { diptera: 'ดิปเทอรา', stonefly: 'สโตนฟลาย' },
    scope: (family, familyJa) => `เลือก${family} (${familyJa}) ตอนประกอบฟลาย`,
    none: (part, moves) => `ถ้าจะเลือก “ไม่มี” (無し) ในเมนู${part} ให้เริ่มจากซ้ายบน: ${moves}`,
    limit:
      'ตรวจตำแหน่งซ้ำอย่างอิสระจากเมนูด่านเลขคู่ที่จำลองในสภาวะควบคุม ยืนยันช่องเลือกชิ้นส่วน แต่ยังไม่ได้ยืนยันเส้นทางเดินหรือการเข้าร้านจากการเล่นปกติ ไม่ได้พิสูจน์ว่าปลากินหรือตกขึ้นง่ายกว่า ตรวจราคาสุทธิก่อนจ่าย',
  },
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
}

function expectedChoices() {
  return matrices.flatMap(({ slug, familyJa, parts, none }) =>
    Object.entries(parts).flatMap(([part, rows]) =>
      rows.flatMap((ids, rowIndex) =>
        ids.flatMap((id, columnIndex) => {
          if (id === null) return []
          const row = rowIndex + 1
          const column = columnIndex + 1
          const key = `${slug}:${part}:${row}:${column}`
          const record = hashes.get(key)
          assert(record, `Missing independent expected position ${key}`)
          assert.equal(record.id, id, `Wrong selected ID ${key}`)
          return [
            {
              category: { body: 'fly', wing: 'fly_wing', tail: 'fly_tail' }[part],
              part,
              id,
              familyJa,
              area: 2,
              controlledFixture: true,
              row,
              column,
              image: `custom/fly-even-menu-positions/${slug}-${part}-c${column}-r${row}-cursor.png`,
              imageSha256: record.imageSha256,
              resultSource: `${slug}-${part}-c${column}-r${row}.result.json`,
              ...(part === 'body' ? {} : { nonePosition: none[part] }),
            },
          ]
        }),
      ),
    ),
  )
}

function choiceKey(choice) {
  return `${choice.familyJa}:${choice.part}:${choice.row}:${choice.column}:${choice.id}`
}

function checkEvidence(expected) {
  assert.equal(evidence.schemaVersion, 1)
  assert.equal(
    evidence.romSha256,
    'e0594921a5a2ef1a2613b9d2e29fed066569e3793393c591bf4c4968a54c0b49',
  )
  assert.equal(
    evidence.coreSha256,
    '8ed333ac04544cc6ab67ceb445d095f7600bb17586d4887d99117fbd1ef776f6',
  )
  assert.equal(evidence.area, 2, 'Area number is provenance metadata only')
  assert.match(evidence.scope, /controlled even-area chooser fixture/i)
  assert.match(evidence.scope, /not natural Area 2 access/i)
  assert.equal(evidence.provenance.fixture.onlyMemoryWrite.address, '0x085A')
  assert.equal(evidence.provenance.fixture.onlyMemoryWrite.value, 2)
  assert.equal(
    evidence.provenance.fixture.onlyMemoryWrite.timing,
    'before A opens the family chooser',
  )
  const replay = evidence.provenance.independentReplay
  assert.equal(replay.selectedIdsMatched, true)
  assert.equal(replay.cursorImageHashesMatched, true)
  assert.equal(replay.differences, 0)
  assert.equal(replay.positionCount, 96)
  assert.deepEqual(evidence.choices.map(choiceKey).sort(), expected.map(choiceKey).sort())
}

function checkChoiceMetadata(expected) {
  assert.equal(expected.length, 46)
  assert.equal(expected.filter((choice) => choice.id !== '00').length, 42)
  assert.equal(expected.filter((choice) => choice.id === '00').length, 4)
  assert(!expected.some((choice) => ['25', '26', '66', '67'].includes(choice.id)))
  for (const expectedChoice of expected) {
    const actual = evidence.choices.find(
      (choice) => choiceKey(choice) === choiceKey(expectedChoice),
    )
    assert(actual, `Missing position ${choiceKey(expectedChoice)}`)
    for (const [key, value] of Object.entries(expectedChoice))
      assert.deepEqual(actual[key], value, `${choiceKey(expectedChoice)} ${key}`)
  }
  checkNoneMetadata(expected)
}

function checkNoneMetadata(expected) {
  const none = expected.filter((choice) => choice.id === '00')
  assert.deepEqual(
    none.map((choice) => `${choice.familyJa}:${choice.part}:${choice.row}:${choice.column}`).sort(),
    [
      'ストーンフライ:tail:4:2',
      'ストーンフライ:wing:1:2',
      'ディプテラ:tail:1:2',
      'ディプテラ:wing:1:3',
    ],
  )
  for (const choice of none) {
    assert(!('priceYen' in choice) && !('price' in choice))
    assert(!('evidenceHref' in choice), 'None is a menu position, not a catalogue item')
  }
}

function checkRawFieldsAndAttachments(expected) {
  const real = expected.filter((choice) => choice.id !== '00')
  const familySet = new Set(matrices.map((family) => family.familyJa))
  const attached = data.items.filter((item) => familySet.has(item.flyMakerMenuChoice?.familyJa))
  assert.equal(attached.length, 42)
  assert.deepEqual(
    attached
      .map((item) =>
        choiceKey({ ...item.flyMakerMenuChoice, category: item.category, id: item.id }),
      )
      .sort(),
    real.map(choiceKey).sort(),
  )
  for (const choice of real) {
    const items = data.items.filter(
      (item) => item.category === choice.category && item.id === choice.id,
    )
    assert.equal(
      items.length,
      1,
      `Catalogue identity must be unique: ${choice.category}:${choice.id}`,
    )
    const item = items[0]
    assert.equal(item.rawFields['+0'], choice.familyJa === 'ディプテラ' ? 2 : 3)
    assert.equal(item.rawFields['+1'], { body: 0, wing: 1, tail: 2 }[choice.part])
  }
  assert(!attached.some((item) => ['25', '26', '66', '67'].includes(item.id)))
  assert(!data.items.some((item) => item.flyMakerMenuChoice?.id === '00'))
  checkAttacherRejections(real)
}

function fixtureItem(choice, overrides = {}) {
  const source = data.items.find(
    (item) => item.category === choice.category && item.id === choice.id,
  )
  assert(source, `Missing source item ${choice.category}:${choice.id}`)
  return {
    category: source.category,
    id: source.id,
    rawFields: { ...source.rawFields },
    ...overrides,
  }
}

function checkAttacherRejections(real) {
  const fixture = { items: real.map((choice) => fixtureItem(choice)) }
  attach(root, fixture)
  assert.equal(fixture.items.filter((item) => item.flyMakerMenuChoice).length, 42)

  const body = real.find((choice) => choice.familyJa === 'ディプテラ' && choice.part === 'body')
  const wrongFamily = fixtureItem(body)
  wrongFamily.rawFields['+0'] = 3
  assert.throws(() => attach(root, { items: [wrongFamily] }), /family\/part differs/)
  const wrongPart = fixtureItem(body)
  wrongPart.rawFields['+1'] = 1
  assert.throws(() => attach(root, { items: [wrongPart] }), /family\/part differs/)
  assert.throws(() => attach(root, { items: [] }), /Missing or duplicate maker choice fly:4B/)
  assert.throws(
    () => attach(root, { items: [fixtureItem(body), fixtureItem(body)] }),
    /Missing or duplicate maker choice fly:4B/,
  )
  assert.throws(
    () => attach(root, { items: [fixtureItem(body, { flyMakerMenuChoice: {} })] }),
    /Missing or duplicate maker choice fly:4B/,
  )
}

function gridKey(family, part, row, column) {
  return `${family}:${part}:${row}:${column}`
}

function checkClampedCells(expected) {
  const positions = new Set(
    expected.map((choice) => gridKey(choice.familyJa, choice.part, choice.row, choice.column)),
  )
  const clamped = evidence.clampedEmptyCellObservations
  assert.equal(clamped.length, 50)
  const observed = new Set(positions)
  const slugToFamily = { diptera: 'ディプテラ', stonefly: 'ストーンフライ' }
  for (const cell of clamped) {
    const family = slugToFamily[cell.family]
    assert(family, `Unknown clamped family ${cell.family}`)
    const key = gridKey(family, cell.part, cell.row, cell.column)
    assert(!positions.has(key), `Clamped cursor cell published as a choice: ${key}`)
    assert(!observed.has(key), `Duplicate grid observation ${key}`)
    observed.add(key)
    assert(
      expected.some(
        (choice) =>
          choice.familyJa === family &&
          choice.part === cell.part &&
          choice.id === cell.selectedId &&
          choice.imageSha256 === cell.cursorSha256,
      ),
      `Clamped cell did not stay at a verified choice: ${key}`,
    )
  }
  assert.equal(observed.size, 96)
  for (const family of matrices) {
    for (const part of Object.keys(family.parts)) {
      for (let row = 1; row <= 4; row++)
        for (let column = 1; column <= 4; column++)
          assert(observed.has(gridKey(family.familyJa, part, row, column)))
    }
  }
}

function checkPublishedImages(expected) {
  const directory = path.join(root, 'catalogue/custom/fly-even-menu-positions')
  assert.deepEqual(
    fs.readdirSync(directory).sort(),
    expected.map((choice) => path.basename(choice.image)).sort(),
  )
  for (const choice of expected) {
    const image = fs.readFileSync(path.join(root, 'catalogue', choice.image))
    assert.equal(image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a')
    assert.deepEqual([image.readUInt32BE(16), image.readUInt32BE(20)], [256, 224])
    assert.equal(crypto.createHash('sha256').update(image).digest('hex'), choice.imageSha256)
  }
}

function movement(copy, row, column) {
  return [column > 1 ? copy.right(column - 1) : '', row > 1 ? copy.down(row - 1) : '', copy.confirm]
    .filter(Boolean)
    .join(' → ')
}

function expectedNoneText(lang, choice, copy) {
  const moves = movement(copy, choice.nonePosition.row, choice.nonePosition.column)
  return copy.none(copy.part[choice.part], moves)
}

function cardFor(html, category, id) {
  const identity = html.indexOf(`id="item-${category}-${id}"`)
  assert(identity >= 0, `Catalogue card missing ${category}:${id}`)
  const start = html.lastIndexOf('<article class="item-card', identity)
  const end = html.indexOf('<article class="item-card', identity + 1)
  return html.slice(start, end < 0 ? html.length : end)
}

async function checkRenderedDetail(choice, lang, copy) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const returned = `index${suffix}.html?category=all&stage=2&route=float&map=1&sort=id#catalogue`
  const result = await render(
    'item',
    lang,
    new URLSearchParams({ category: choice.category, id: choice.id, return: returned }),
  )
  const marker = `data-fly-menu-position="${choice.category}:${choice.id}"`
  const start = result.html.indexOf(marker)
  assert(start >= 0, `Missing detail menu position ${choice.category}:${choice.id}/${lang}`)
  const sectionStart = result.html.lastIndexOf('<section', start)
  const sectionEnd = result.html.indexOf('</section>', start) + '</section>'.length
  const section = unescapeHtml(result.html.slice(sectionStart, sectionEnd))
  const scopeStart = section.indexOf('</h2>')
  const scopeEnd = section.indexOf('</p>', scopeStart)
  const familyScope = section.slice(scopeStart, scopeEnd)
  const familyName = choice.familyJa === 'ディプテラ' ? copy.family.diptera : copy.family.stonefly
  assert(
    familyScope.includes(copy.scope(familyName, choice.familyJa)),
    `Missing generic family scope ${choice.familyJa}/${lang}`,
  )
  const checks = [
    copy.title,
    copy.start,
    copy.position(choice.row, choice.column),
    movement(copy, choice.row, choice.column),
    choice.image,
    copy.caption,
    copy.limit,
  ]
  for (const text of checks) assert(section.includes(text), `Missing ${lang} detail text: ${text}`)
  if (choice.nonePosition) assert(section.includes(expectedNoneText(lang, choice, copy)))
  for (const areaText of ['Area 2', 'エリア2', 'ด่าน 2']) assert(!familyScope.includes(areaText))
  assert(!/category=fly_(?:wing|tail)(?:&amp;|&)id=00/.test(section))
}

function checkCatalogueAction(choice, lang, catalogue) {
  const card = cardFor(catalogue.nodes.cards.innerHTML, choice.category, choice.id)
  const link = card.match(/data-fly-menu-choice href="([^"]+)"/)?.[1]
  assert(link, `Missing direct fly-position action ${choice.category}:${choice.id}/${lang}`)
  const target = new URL(unescapeHtml(link), catalogue.url)
  const suffix = lang === 'en' ? '' : `.${lang}`
  assert(target.pathname.endsWith(`/item${suffix}.html`))
  assert.deepEqual(
    [target.searchParams.get('category'), target.searchParams.get('id'), target.hash],
    [choice.category, choice.id, '#fly-menu-position'],
  )
  const back = new URL(target.searchParams.get('return'), target)
  assert.deepEqual(
    ['category', 'stage', 'route', 'map', 'sort'].map((key) => back.searchParams.get(key)),
    ['all', '2', 'float', '1', 'id'],
  )
  assert.equal(back.hash, '#catalogue')
}

async function checkLocalizedFlows(expected) {
  for (const lang of ['en', 'ja', 'th']) {
    const copy = localeCopy[lang]
    const catalogue = await renderCatalogue(
      lang,
      '?category=all&stage=2&route=float&map=1&sort=id#catalogue',
    )
    for (const choice of expected.filter((entry) => entry.id !== '00')) {
      await checkRenderedDetail(choice, lang, copy)
      checkCatalogueAction(choice, lang, catalogue)
    }
  }
}

async function main() {
  const expected = expectedChoices()
  checkEvidence(expected)
  checkChoiceMetadata(expected)
  checkRawFieldsAndAttachments(expected)
  checkClampedCells(expected)
  checkPublishedImages(expected)
  const emptyContext = { lang: 'en', esc: String }
  assert.equal(flyMenuPosition(emptyContext, { category: 'fly_unknown', id: '25' }), '')
  await checkLocalizedFlows(expected)
  console.log(
    'PASS: 46 menu positions, 42 item links, 4 None coordinates, 50 clamped cells excluded, 126 localized item details, and 126 catalogue actions.',
  )
}

await main()
