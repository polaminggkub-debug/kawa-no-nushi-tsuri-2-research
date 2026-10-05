import assert from 'node:assert/strict'
import { flyPriceChoice } from '../../src/pages/item/fly-price-choice.js'
import { data, render, root, unescapeHtml } from './shared.mjs'
import fs from 'node:fs'
import path from 'node:path'

const localeExpectations = {
  th: {
    contribution: (price) => `ชิ้นนี้เพิ่ม ${price} เยนในราคาฟลายที่ประกอบเอง`,
    ready: 'สำเร็จรูปด่าน 1: ¥5',
    custom: 'ประกอบชุดนี้ในเมนูที่ตรวจแล้ว ด่าน 1: ¥25',
    action: 'ซื้อสำเร็จรูปประหยัด 20 เยน',
    limit: 'ไม่ใช่อันดับโอกาสกัดหรือจับสำเร็จ',
  },
  en: {
    contribution: (price) => `This component adds ¥${price} to a custom fly quote`,
    ready: 'Ready-made in Area 1: ¥5',
    custom: 'Make these parts in the verified Area 1 menu: ¥25',
    action: 'buy ready-made to save ¥20',
    limit: 'not bite or landing odds',
  },
  ja: {
    contribution: (price) => `この部品は自作フライの見積額に${price}円を加える`,
    ready: 'エリア1の既製品：5円',
    custom: '確認済みのエリア1のメニューで自作：25円',
    action: '既製品で20円節約',
    limit: '食いつきや取り込み成功率の順位ではない',
  },
}

const baseContext = (lang) => ({
  lang,
  esc: (value) =>
    String(value ?? '').replace(
      /[&<>"']/g,
      (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
    ),
})
const itemBy = (category, id) =>
  data.items.find((item) => item.category === category && item.id === id)
const body = itemBy('fly', '01')
const wing = itemBy('fly_wing', '09')
const tail = itemBy('fly_tail', '13')
const exactParts = [body, wing, tail]
const exactBundle = { body: '01', wing: '09', tail: '13', shopPriceYen: 5 }

assert(
  exactParts.every((item) => item?.flyMakerMenuChoice),
  'The reference parts need verified menu choices',
)
assert.deepEqual(
  exactParts.map((item) => [item.flyMakerMenuChoice.area, item.flyMakerMenuChoice.familyJa]),
  [
    [1, 'メイフライ'],
    [1, 'メイフライ'],
    [1, 'メイフライ'],
  ],
  '01 / 09 / 13 must share the proven maker menu',
)
assert.equal(
  exactParts.reduce((sum, item) => sum + item.priceYen, 0),
  25,
)
assert(
  body.playerUse.shops.some(
    (shop) =>
      Number(shop.stage) === 1 &&
      shop.bundle?.body === exactBundle.body &&
      shop.bundle?.wing === exactBundle.wing &&
      shop.bundle?.tail === exactBundle.tail &&
      shop.bundle?.shopPriceYen === exactBundle.shopPriceYen,
  ),
  'The ready-made comparator must be this exact ROM-recorded composition',
)

for (const lang of ['th', 'en', 'ja']) {
  for (const item of exactParts) {
    const html = unescapeHtml(flyPriceChoice(baseContext(lang), item, data.items))
    assert(html.includes(`data-fly-price-choice="${item.category}:${item.id}"`))
    assert(html.includes(`data-fly-price-comparison="01 / 09 / 13"`))
    assert(html.includes(localeExpectations[lang].contribution(item.priceYen)))
    assert(html.includes(localeExpectations[lang].ready))
    assert(html.includes(localeExpectations[lang].custom))
    assert(html.includes(localeExpectations[lang].action))
    assert(html.includes(localeExpectations[lang].limit))
    assert(html.includes('href="#fly-purchases"'))
    assert(html.includes('href="#fly-menu-position"'))
    assert(html.includes('../docs/fly-maker-menu-research.md'))
    const evidence = html.match(/<details class="fly-price-evidence">[\s\S]*?<\/details>/)?.[0]
    assert(
      evidence?.includes(localeExpectations[lang].limit),
      'Keep the comparison limit in its collapsed pricing evidence',
    )
    assert(evidence?.includes('../docs/fly-maker-menu-research.md'))
    assert(!/\sopen(?:\s|>)/.test(evidence), 'Pricing evidence stays collapsed by default')
    assert(!/catch(?:ing)? (?:bonus|advantage|better)|จับ(?:ปลา)?ได้ดีกว่า/i.test(html))
  }

  const page = await render('item', lang, 'category=fly_wing&id=09&stage=1')
  const pageHtml = unescapeHtml(page.html)
  assert(pageHtml.includes('data-fly-price-choice="fly_wing:09"'))
  assert(pageHtml.includes('data-fly-price-comparison="01 / 09 / 13"'))
  assert(
    pageHtml.includes('id="fly-purchases"'),
    'The ready-made action must land on the shop bundle',
  )
  assert(
    pageHtml.includes('id="fly-menu-position"'),
    'The maker action must land on the verified menu choice',
  )
  assert(pageHtml.includes('<details class="fly-price-evidence">'))
  assert(pageHtml.includes('<details class="evidence">'), 'Keep the ROM technical evidence section')
}

for (const [category, id] of [
  ['fly_wing', '26'],
  ['fly_wing', '25'],
  ['fly_wing', '66'],
  ['fly_wing', '67'],
  ['fly_unknown', '01'],
  ['lure', '01'],
]) {
  const item = itemBy(category, id)
  if (!item) continue
  assert.equal(
    flyPriceChoice(baseContext('th'), item, data.items),
    '',
    `Unverified or unrelated item must not advertise a custom quote: ${category}:${id}`,
  )
}

function referenceBody(parts, bundle = exactBundle) {
  return {
    ...parts[0],
    playerUse: {
      ...parts[0].playerUse,
      shops: [{ stage: 1, bundle: { ...bundle } }],
    },
  }
}

function assertNoComparison(parts, message) {
  const fixture = [referenceBody(parts), ...parts.slice(1)]
  const output = flyPriceChoice(baseContext('en'), fixture[0], fixture)
  assert(
    output.includes('data-fly-price-choice='),
    'A verified selected component may retain its own contribution',
  )
  assert(!output.includes('data-fly-price-comparison='), message)
}

function assertNoWingComparison(items, message) {
  const output = flyPriceChoice(baseContext('en'), items[1], items)
  assert(!output.includes('data-fly-price-comparison='), message)
}

const areaMismatch = exactParts.map((item) => ({ ...item }))
areaMismatch[1].flyMakerMenuChoice = { ...wing.flyMakerMenuChoice, area: 2 }
assertNoComparison(areaMismatch, 'Do not compare components selected in different areas')

const familyMismatch = exactParts.map((item) => ({ ...item }))
familyMismatch[2].flyMakerMenuChoice = { ...tail.flyMakerMenuChoice, familyJa: 'カディス' }
assertNoComparison(familyMismatch, 'Do not compare components from different maker families')

const identityMismatch = exactParts.map((item) => ({ ...item }))
identityMismatch[1].flyMakerMenuChoice = { ...wing.flyMakerMenuChoice, id: '0A' }
assertNoComparison(
  identityMismatch,
  'A menu record for another part ID cannot verify this component',
)

const noBody = referenceBody(exactParts, { ...exactBundle, body: '00' })
assertNoWingComparison(
  [noBody, wing, tail],
  'A ready-made row without a body cannot be presented as a custom fly composition',
)

for (const invalidPrice of [-1, Number.NaN, Number.POSITIVE_INFINITY]) {
  const invalidParts = exactParts.map((item) => ({ ...item }))
  invalidParts[1].priceYen = invalidPrice
  assertNoComparison(
    invalidParts,
    `Do not compare a non-finite or negative contribution (${invalidPrice})`,
  )
}

const capped = exactParts.map((item) => ({ ...item, priceYen: 5000 }))
const cappedHtml = unescapeHtml(
  flyPriceChoice(baseContext('en'), referenceBody(capped), [
    referenceBody(capped),
    ...capped.slice(1),
  ]),
)
assert(cappedHtml.includes('Make these parts in the verified Area 1 menu: ¥10000'))

const terrestrialBody = {
  ...body,
  id: 'T1',
  priceYen: 30,
  flyMakerMenuChoice: { ...body.flyMakerMenuChoice, id: 'T1', area: 4, familyJa: 'テレストリアル' },
  playerUse: {
    ...body.playerUse,
    shops: [{ stage: 6, bundle: { body: 'T1', wing: '00', tail: '00', shopPriceYen: 30 } }],
  },
}
const terrestrialHtml = unescapeHtml(
  flyPriceChoice(baseContext('ja'), terrestrialBody, [terrestrialBody]),
)
assert(terrestrialHtml.includes('data-fly-price-comparison="T1 / 00 / 00"'))
assert(terrestrialHtml.includes('エリア4のメニューで自作：30円'))
assert(!terrestrialHtml.includes('31円'), 'None (00) must contribute exactly ¥0')

const invalidTerrestrial = {
  ...terrestrialBody,
  playerUse: {
    ...terrestrialBody.playerUse,
    shops: [{ stage: 6, bundle: { body: 'T1', wing: '09', tail: '00', shopPriceYen: 30 } }],
  },
}
const terrestrialWing = {
  ...wing,
  id: 'TW',
  priceYen: 7,
  flyMakerMenuChoice: {
    ...wing.flyMakerMenuChoice,
    id: 'TW',
    area: 4,
    familyJa: 'テレストリアル',
  },
}
for (const bundle of [
  { body: 'T1', wing: 'TW', tail: '00', shopPriceYen: 30 },
  { body: 'T1', wing: '00', tail: 'TW', shopPriceYen: 30 },
]) {
  const fixture = {
    ...invalidTerrestrial,
    playerUse: { ...invalidTerrestrial.playerUse, shops: [{ stage: 6, bundle }] },
  }
  const invalidTerrestrialHtml = flyPriceChoice(baseContext('en'), fixture, [
    fixture,
    terrestrialWing,
  ])
  assert(!invalidTerrestrialHtml.includes('data-fly-price-comparison='))
}

const sourcePath = path.join(root, 'docs/fly-maker-menu-research.md')
assert(fs.existsSync(sourcePath), 'The visible price evidence link must resolve to ROM research')

console.log(
  'PASS: verified fly components show contextual custom-quote contributions; the exact 01 / 09 / 13 comparison guides all three locales to the cheaper ready-made set, while invalid, mixed-menu, unavailable, and terrestrial combinations stay bounded.',
)
