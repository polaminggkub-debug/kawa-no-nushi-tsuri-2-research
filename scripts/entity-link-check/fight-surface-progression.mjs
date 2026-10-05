import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import { render, root, unescapeHtml } from './shared.mjs'

const rules = {
  en: [/caught|landed/, /\bA\b/, /advance|continue|finish/, /Notebook|journal/],
  ja: [/釣りあげ|釣り上げ|釣れた|取り込/, /A/, /進め|最後|続/, /ノート|図鑑|手帳/],
  th: [/ตก.*(?:ได้|สำเร็จ)|ชื่อปลา|ตกขึ้น/, /A/, /ข้อความ|กด.*ต่อ/, /สมุด/],
}
checkProvenance()
for (const lang of ['en', 'ja', 'th']) await checkLocale(lang)
console.log(
  'PASS: Yamame surface advice separates A message advancement from fight rhythm, links notebook verification and keeps bounded replay evidence.',
)

async function checkLocale(lang) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const back = `maps${suffix}.html?stage=1&fish=03#map-view`
  const page = await render(
    'fish',
    lang,
    new URLSearchParams({ id: '03', stage: '1', route: 'float', return: back }),
  )
  const evidence = page.html.match(
    /<details id="fight-controls-evidence"[^>]*>[\s\S]*?<\/details>/,
  )?.[0]
  assert(evidence, 'Fight evidence missing')
  assert.doesNotMatch(evidence.split('>')[0], /\sopen/)
  const action = page.html.match(/<p[^>]*data-fight-surface-progression[^>]*>([\s\S]*?)<\/p>/)?.[1]
  assert(action, `${lang}: after-caught message progression has no player action`)
  const text = unescapeHtml(action.replace(/<[^>]+>/g, ' '))
  for (const rule of rules[lang])
    assert.match(text, rule, `${lang}: surface progression action incomplete`)
  const negation = {
    en: /not proven to cause the catch/,
    ja: /釣れた原因とは証明されていません/,
    th: /ไม่ได้พิสูจน์ว่าเป็นปุ่มที่ทำให้จับได้/,
  }
  assert.match(text, negation[lang])
  const visible = unescapeHtml(page.html.replace(evidence, ''))
  const bounded = {
    en: /one encounter.*not a guaranteed rhythm/,
    ja: /1回.*保証/,
    th: /เหตุการณ์เดียว.*ไม่ใช่สูตรรับประกัน/,
  }
  assert.match(visible, bounded[lang])
  const link = page.html.match(/<a[^>]*data-fight-notebook-action[^>]*href="([^"]+)"/)
  assert(link, 'After-caught instructions need a notebook verification action')
  const target = new URL(unescapeHtml(link[1]), page.url)
  assert(target.pathname.endsWith(`/item${suffix}.html`))
  assert.equal(target.searchParams.get('category'), 'general_tool')
  assert.equal(target.searchParams.get('id'), '05')
  assert.equal(target.searchParams.get('stage'), '1')
  const returned = new URL(target.searchParams.get('return'), page.url)
  assert.equal(returned.pathname, page.url.pathname)
  assert.equal(returned.searchParams.get('id'), '03')
  assert.equal(returned.searchParams.get('return'), back)
  assert.match(unescapeHtml(evidence), /23\s*(?:cm|ซม)/i)
  assert.match(evidence, /<img[^>]*src="[^"]*fight-caught-name\.png"[^>]*alt="[^"]+"/)
  assert.match(evidence, /<a[^>]*href="[^"]*fight-a-surface-result\.png"/)
  assert.doesNotMatch(evidence, /<img[^>]*src="[^"]*fight-a-surface-result\.png"/)
  assert.equal((evidence.match(/<figure>/g) || []).length, 3)
}

function checkProvenance() {
  const data = JSON.parse(fs.readFileSync(`${root}/data/fight-surface-progression.json`))
  assert.equal(data.evidenceType, 'same-seed-controller-replay')
  assert.equal(data.ramWrites, false)
  assert.equal(data.romSha1, 'c2103dd94e2a1a65a495fc02adc2e7d040f31212')
  assert.equal(data.coreSha256, '8ed333ac04544cc6ab67ceb445d095f7600bb17586d4887d99117fbd1ef776f6')
  assert.deepEqual(
    data.chain.map((step) => step.actualElapsedFrames),
    [321, 36, 45, 122],
  )
  assert.deepEqual(
    data.chain.map((step) => step.requestedFrames),
    [320, 35, 44, 121],
  )
  const hashes = [
    '5842b4a324ebecb9cbab44e1d15df8c451ae78346ae1707f3149ded44910dbe7',
    '4c964b7cdd810c1bdcf98083ac66178fe2ba1e19ad1b108248de8040b31ef910',
    '9be12c769f933c80ab8eafad31364913002e2f97c3c0d176184456e3cea351d2',
    '42bccf24c59d19eef94f613c744227e533bb777ed62d1125830129395bf9b962',
  ]
  assert.deepEqual(
    data.chain.map((step) => step.stateSha256),
    hashes,
  )
  assert.equal(data.flattened.actualElapsedFrames, 524)
  assert.equal(data.flattened.stateSha256, hashes[3])
  assert.equal(data.flattened.byteIdenticalToChainedEndpoint, true)
  assert.equal(data.surfaceSeedSha256, hashes[1])
  checkVariants(data)
  checkCapturesAndLimits(data)
}

function checkCapturesAndLimits(data) {
  const expectedCaptures = [
    '6d0b16fbcf245101071b8c86f1dc1aa83c2c0e4551aa25ebc3ab112b14d06db5',
    '8ac39b47e00686b747a9954a216118f0495188065f947c6d99c143d23c1db1b1',
  ]
  assert.deepEqual(
    data.captures.map((capture) => capture.sha256),
    expectedCaptures,
  )
  for (const capture of data.captures) {
    const actual = crypto
      .createHash('sha256')
      .update(fs.readFileSync(`${root}/${capture.path}`))
      .digest('hex')
    assert.equal(actual, capture.sha256)
  }
  const limits = data.limits.join(' ')
  for (const rule of [
    /not a new natural encounter/,
    /not established as the cause/,
    /later progression is not excluded/,
    /No universal rhythm/,
    /Thai-ROM equivalence/,
  ])
    assert.match(limits, rule)
}

function checkVariants(data) {
  const variants = data.surfaceVariants
  assert.deepEqual(
    variants.map((variant) => variant.variant),
    ['neutral-only', 'a-only', 'up-only', 'b-only'],
  )
  const states = [
    '34f6b14c096a960da76a9aa61bacfb902552725b6f554734c4242bf4dda4b585',
    'a65f975c158b02611dba23358760dfcabe447edd64188149d8c3a47e9744e9a7',
    '34f6b14c096a960da76a9aa61bacfb902552725b6f554734c4242bf4dda4b585',
    'fe6003492218007176e1bd085f9c866b17b9977fb7da467f0a874241fed8e2fd',
  ]
  assert.deepEqual(
    variants.map((variant) => variant.stateSha256),
    states,
  )
  for (const [index, variant] of variants.entries()) {
    assert.equal(variant.actualElapsedFrames, 167)
    assert.equal(variant.requestedFrames, 166)
    assert.deepEqual(
      variant.rawNotebook,
      index === 1
        ? { callbackCounter: 1, bestSizeCm: 23, area: 1 }
        : { callbackCounter: 0, bestSizeCm: 0, area: 0 },
    )
    assert.equal(
      variant.visibleEndpoint,
      index === 1 ? 'size-result-23cm' : 'caught-name-awaiting-progression',
    )
  }
  checkVariantEvents(variants)
}

function checkVariantEvents(variants) {
  assert.deepEqual(
    variants.map((variant) =>
      variant.buttonEvents.map((event) => [
        event.startFrame,
        event.heldFrames,
        event.buttons.join('+'),
      ]),
    ),
    [
      [],
      [
        [12, 1, 'A'],
        [34, 1, 'A'],
        [106, 1, 'A'],
      ],
      [
        [1, 1, 'Up'],
        [34, 1, 'Up'],
      ],
      [[23, 1, 'B']],
    ],
  )
}
