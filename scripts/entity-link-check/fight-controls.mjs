import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { renderFightControls } from '../../src/pages/fish/fight-controls.js'
import { render, root, unescapeHtml, validate } from './shared.mjs'

const sourceScreenshots = {
  'fight-hold-escape.png': '9b82e413631ad0562e9392c01a3c68581377086119da438b6747b1ec90310839',
  'fight-release-catch.png': '8ac39b47e00686b747a9954a216118f0495188065f947c6d99c143d23c1db1b1',
}

for (const locale of ['en', 'ja', 'th']) {
  await checkYamameProfile(locale)
  await checkOtherFish(locale)
  assert.equal(
    renderFightControls({ id: '03', locale, escapeHtml: String }, 2),
    '',
    `${locale}: fight advice must be hidden outside Area 1`,
  )
}

console.log(
  'Fight controls PASS: the bounded Area 1 Yamame tip and ROM evidence render in EN/JA/TH only on the matching fish profile; linked captures match the verified originals.',
)

async function checkYamameProfile(locale) {
  const result = await render('fish', locale, 'id=03&stage=1')
  const section = sectionById(result.html, 'fight-controls')
  const evidence = detailsById(section, 'fight-controls-evidence')
  const playerCopy = readableText(section.replace(evidence, ''))
  const evidenceCopy = readableText(evidence)
  checkLocalizedAction(locale, playerCopy, evidenceCopy)
  checkScopedClaim(locale, playerCopy, evidenceCopy)
  checkSetup(locale, evidenceCopy)
  checkEvidenceLinks(result, evidence)
  validate(result.html, result.url)
}

async function checkOtherFish(locale) {
  const result = await render('fish', locale, 'id=01&stage=1')
  assert(
    !result.html.includes('id="fight-controls"'),
    `${locale}: Yamame-only fight advice leaked onto another fish profile`,
  )
}

function checkLocalizedAction(locale, text, evidence) {
  const action = {
    en: [/\bA\b/i, /press|tap/i, /release|let go/i, /hold|holding/i],
    ja: [/Aボタン|Aを/i, /押|タップ/, /離|放/, /押し続|押したまま/],
    th: [/กด\s*A/i, /ปล่อย/, /กดค้าง|ค้าง/],
  }[locale]
  for (const pattern of action)
    assert(
      pattern.test(text + ' ' + evidence),
      `${locale}: player advice must explain trying A press and release`,
    )
  const caution = {
    en: /not (?:a )?(?:guaranteed|proven)|does not guarantee|one (?:recorded )?(?:fight|example|replay|natural encounter)/i,
    ja: /保証しない|保証できない|一度|1回|一例/,
    th: /ไม่รับประกัน|ไม่ได้รับประกัน|หนึ่งครั้ง|ตัวอย่างเดียว|ครั้งเดียว|เหตุการณ์เดียว|ไม่ใช่สูตรรับประกัน/,
  }[locale]
  assert(caution.test(text), `${locale}: label this as one bounded experiment, not a promise`)
  const noBestRhythm = {
    en: /no best rhythm|not a universal rhythm/i,
    ja: /最適なリズム.*未確認/,
    th: /ยังไม่ทราบจังหวะที่ดีที่สุด/,
  }[locale]
  assert(
    noBestRhythm.test(text + ' ' + evidence),
    `${locale}: do not present a best rhythm as proven`,
  )
  assert(
    !/23\s*(?:cm|ซม\.?|センチ)/i.test(text),
    `${locale}: the 23 cm continuation result belongs in technical evidence only`,
  )
}

function checkScopedClaim(locale, playerCopy, evidenceCopy) {
  const limits = {
    en: [/area\s*1/i, /yamame/i, /one natural encounter/i],
    ja: [/エリア\s*1|エリア1/, /ヤマメ/, /自然発生した1回/],
    th: [/พื้นที่\s*1|ด่าน\s*1/, /ยามาเมะ|ヤマメ/, /เหตุการณ์ธรรมชาติหนึ่งครั้ง/],
  }[locale]
  for (const pattern of limits)
    assert(
      pattern.test(playerCopy + ' ' + evidenceCopy),
      `${locale}: retained evidence must identify the limited Area 1 Yamame example`,
    )
  assert(/23\s*cm/i.test(evidenceCopy) || /23\s*(?:ซม\.?|センチ)/i.test(evidenceCopy))
  assert(!/23\s*(?:cm|ซม\.?|センチ)/i.test(playerCopy))
  assert(
    /separate continuation|separate additional inputs/i.test(evidenceCopy) ||
      /別の追加操作|別の操作/.test(evidenceCopy) ||
      /การเล่นต่อ.*หลังการเปรียบเทียบ/.test(evidenceCopy),
    `${locale}: distinguish the later catch from the controller comparison`,
  )
}

function checkSetup(locale, text) {
  const setup = {
    en: [
      /rod.{0,24}\b02\b/i,
      /float.{0,24}\b04\b/i,
      /hook.{0,24}\b06\b/i,
      /bait.{0,24}\b07\b/i,
      /(?:pre.?cast|before (?:the )?cast(?:ing)?)/i,
      /HP\s*100/i,
    ],
    ja: [
      /竿.{0,12}02/,
      /ウキ.{0,12}04/,
      /(?:ハリ|針).{0,12}06/,
      /エサ.{0,12}07/,
      /投げる前|キャスト前/,
      /HP\s*100/i,
    ],
    th: [
      /คัน.{0,12}02/,
      /ทุ่น.{0,12}04/,
      /(?:เบ็ด|ตะขอ).{0,12}06/,
      /เหยื่อ.{0,12}07/,
      /ก่อน(?:เหวี่ยง|ตีเบ็ด|โยน)/,
      /HP\s*100/i,
    ],
  }[locale]
  for (const pattern of setup)
    assert(pattern.test(text), `${locale}: missing verified pre-cast setup detail ${pattern}`)
}

function checkEvidenceLinks(result, evidence) {
  const expectedDoc =
    'https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/fight-input-research.md'
  const doc = [...evidence.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g)]
    .map(([, href]) => new URL(unescapeHtml(href), result.url))
    .find((url) => url.href === expectedDoc)
  assert(doc, 'Technical evidence must open the readable GitHub Markdown research page')

  for (const [filename, expectedHash] of Object.entries(sourceScreenshots)) {
    const anchors = [...evidence.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
    const capture = anchors.find(([, href]) =>
      new URL(unescapeHtml(href), result.url).pathname.endsWith(filename),
    )
    assert(capture, `Missing clickable screenshot ${filename}`)
    const target = new URL(unescapeHtml(capture[1]), result.url)
    assert.equal(target.pathname, `/kawa-no-nushi-tsuri-2-research/research/assets/${filename}`)
    const image = capture[2].match(/<img\b([^>]*)>/)
    assert(image, `${filename}: screenshot link must display the capture`)
    assert.equal(
      new URL(unescapeHtml(image[1].match(/\bsrc="([^"]+)"/)?.[1]), result.url).href,
      target.href,
    )
    assert(image[1].match(/\balt="([^"]+)"/)?.[1], `${filename}: capture needs useful alt text`)
    const asset = path.join(root, 'research/assets', filename)
    const actualHash = crypto.createHash('sha256').update(fs.readFileSync(asset)).digest('hex')
    assert.equal(
      actualHash,
      expectedHash,
      `${filename}: screenshot differs from the verified ROM capture`,
    )
  }
  assert(fs.existsSync(path.join(root, 'docs/fight-input-research.md')))
  checkDocumentLimits()
}

function checkDocumentLimits() {
  const doc = fs
    .readFileSync(path.join(root, 'docs/fight-input-research.md'), 'utf8')
    .replaceAll('**', '')
  const requirements = [
    /c2103dd94e2a1a65a495fc02adc2e7d040f31212/,
    /04:99F5\.\.9A05/,
    /not a universal rhythm/,
    /does not identify these paths as reeling, tension, or catch progress/,
    /only that separate continuation reached.*23 cm catch message/i,
  ]
  for (const requirement of requirements)
    assert(
      requirement.test(doc),
      `Public research document lost a required scope limit: ${requirement}`,
    )
}

function sectionById(html, id) {
  return balancedElement(html, 'section', id)
}

function detailsById(html, id) {
  return balancedElement(html, 'details', id)
}

function balancedElement(html, tag, id) {
  const opening = new RegExp(`<${tag}\\b(?=[^>]*\\bid="${id}")[^>]*>`)
  const match = opening.exec(html)
  assert(match, `Missing ${tag}#${id}`)
  const start = match.index
  let depth = 0
  const tags = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'g')
  tags.lastIndex = start
  for (const token of html.slice(start).matchAll(tags)) {
    depth += token[0].startsWith(`</`) ? -1 : 1
    if (depth === 0) return html.slice(start, start + token.index + token[0].length)
  }
  throw new Error(`Unclosed ${tag}#${id}`)
}

function readableText(html) {
  return unescapeHtml(html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ')).trim()
}
