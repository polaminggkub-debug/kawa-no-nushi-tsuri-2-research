import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderWaterIcons } from '../../src/pages/fish/water-icons.js'
import { data } from './shared.mjs'

const root = path.resolve(fileURLToPath(new URL('../..', import.meta.url)))
const bubbleFishIds = ['0D', '0F', '15', '1C', '25', '29', '2F', '3D', '47']
const growthOnlyFishIds = ['01', '06', '08', '09', '0B', '31', '33', '42']

checkDatasetShape()
checkRenderPlacement()
for (const locale of ['en', 'ja', 'th']) await checkLocalizedCards(locale)
checkMissingDataIsHidden()

function checkDatasetShape() {
  const waterIcons = data.waterIcons
  const imageManifest = JSON.parse(
    fs.readFileSync(path.join(root, 'data/water-icon-images.json'), 'utf8'),
  )
  assert.match(waterIcons?.romSha1 || '', /^[0-9a-f]{40}$/i, 'Missing ROM SHA-1')
  assert.equal(waterIcons.romSha1, imageManifest.romSha1, 'Icon and profile ROMs differ')
  assert.equal(Object.keys(waterIcons.profiles).length, 73)
  const actualBubbleIds = Object.entries(waterIcons.profiles)
    .filter(([, profile]) => profile.bubble === true)
    .map(([fishId]) => fishId)
    .sort()
  assert.deepEqual(actualBubbleIds, bubbleFishIds)
  for (const iconClass of ['small', 'large', 'bubble']) {
    const image = waterIcons.classes?.[iconClass]?.image
    assert(image, `Missing ${iconClass} water icon image`)
    assert(fs.existsSync(path.join(root, 'catalogue', image)), `Missing icon asset ${image}`)
  }
  for (const [fishId, profile] of Object.entries(waterIcons.profiles)) {
    assert(Array.isArray(profile.possibleClasses), `Missing classes for fish ${fishId}`)
    assert.equal(new Set(profile.possibleClasses).size, profile.possibleClasses.length)
    assert(profile.possibleClasses.every((name) => ['small', 'large', 'bubble'].includes(name)))
    assert.equal(profile.possibleClasses.includes('bubble'), profile.bubble === true)
  }
  checkDerivedClassCoverage(waterIcons.profiles)
  const potato = data.items.find((item) => item.category === 'bait' && item.id === '11')
  assert.deepEqual(potato?.playerUse?.fishIdsByRoute?.float, bubbleFishIds)
}

function checkDerivedClassCoverage(profiles) {
  const growthIds = []
  for (const [fishId, profile] of Object.entries(profiles)) {
    const expected = deriveClassEvidence(profile)
    assert.deepEqual(profile.initialClasses, expected.initial, `${fishId}: initial classes`)
    assert.deepEqual(profile.growthOnlyClasses, expected.growth, `${fishId}: growth-only classes`)
    assert.deepEqual(profile.possibleClasses, expected.possible, `${fishId}: all possible classes`)
    assert.equal(profile.bubble, expected.bubble, `${fishId}: bubble mask`)
    assert.equal(profile.potatoBaitMaskCompatible, expected.bubble, `${fishId}: potato mask`)
    if (expected.growth.length) growthIds.push(fishId)
  }
  assert.deepEqual(growthIds.sort(), growthOnlyFishIds)
}

function deriveClassEvidence(profile) {
  const half = Math.floor(Number(profile.profilePlus0) / 2)
  const initialMax = half > 0 ? 2 * half - 1 : null
  const cap = Number(profile.cap)
  const mask = Number.parseInt(profile.profileWordPlus15Plus16, 16)
  const bubble = Number.isFinite(mask) && (mask & 0x0100) !== 0
  assert.deepEqual(
    profile.initialRawSizeRangeCm,
    half > 0 ? [half, initialMax] : null,
    `${profile.fishId}: initialized size range from profile +0`,
  )
  if (bubble) return { bubble, initial: ['bubble'], possible: ['bubble'], growth: [] }
  const initial = []
  const possible = []
  if (half > 0 && half < 50) initial.push('small')
  if (half > 0 && initialMax >= 50) initial.push('large')
  possible.push(...initial)
  if (!initial.includes('large') && half > 0 && cap >= 50) possible.push('large')
  return {
    bubble,
    initial,
    possible,
    growth: possible.filter((iconClass) => !initial.includes(iconClass)),
  }
}

function checkRenderPlacement() {
  const source = fs.readFileSync(path.join(root, 'src/pages/fish/render.js'), 'utf8')
  const start = source.indexOf('function profileContent(')
  const end = source.indexOf('function unconfirmedProfileContent(', start)
  assert(start >= 0 && end > start, 'Fish profile renderer boundary not found')
  const content = source.slice(start, end)
  const sections = [
    'renderFirstStep(ctx)',
    'ctx.renderAreas(',
    'ctx.renderExchange(',
    'ctx.renderShopping(',
    'compatibleSection(ctx, state)',
    'ctx.renderWaterIcons(',
    'ctx.renderEvidence(',
  ].map((section) => content.indexOf(section))
  assert(
    sections.every((position) => position >= 0),
    'Fish action section is missing',
  )
  assert(
    sections.every((position, index) => index === 0 || sections[index - 1] < position),
    'Fish page must show map and shopping actions before water-mark research',
  )
}

async function checkLocalizedCards(locale) {
  const suffix = locale === 'en' ? '' : `.${locale}`
  const fishId = '0D'
  const outerReturn = `maps${suffix}.html?stage=4&fish=${fishId}&section=s4-c1-r2`
  const ctx = makeContext(locale, fishId, outerReturn)
  const html = renderWaterIcons(ctx, data.waterIcons, '4')
  const profile = data.waterIcons.profiles[fishId]
  const cards = [...html.matchAll(/data-water-icon="([a-z]+)"/g)].map((match) => match[1])
  const expectedCards = ['small', 'large', 'bubble'].filter((name) =>
    profile.possibleClasses.includes(name),
  )
  assert.deepEqual(cards, expectedCards)
  assert(html.includes('id="water-icons"'), `Section missing (${locale})`)
  assert(html.includes('data-water-bait-link'), `Potato bait action missing (${locale})`)
  assertBubbleMeaning(locale, html)
  assertSizeMeaning(locale, ctx)
  checkCardEvidenceClasses(locale)
  assertBaitRoute(locale, html, ctx, outerReturn)
}

function makeContext(locale, fishId, outerReturn) {
  return {
    locale,
    id: fishId,
    escapeHtml: (value) =>
      String(value).replace(
        /[&<>"']/g,
        (char) =>
          ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
          })[char],
      ),
    currentFishPath: (stage) =>
      `fish${locale === 'en' ? '' : `.${locale}`}.html?id=${fishId}&stage=${stage}&return=${encodeURIComponent(outerReturn)}`,
    itemPath: () => `item${locale === 'en' ? '' : `.${locale}`}.html`,
  }
}

function assertBubbleMeaning(locale, html) {
  const expected = {
    en: [
      'Read the water marks',
      'Bubble mark',
      'does not identify the fish or show its size',
      'passes potato bait 11’s float check',
    ],
    ja: [
      '水面のマークの見分け方',
      '泡のマーク',
      '魚種やサイズを示しません',
      'イモエサ11の判定を通ります',
    ],
    th: [
      'ดูเครื่องหมายบนผิวน้ำ',
      'เครื่องหมายฟองอากาศ',
      'ไม่ได้บอกชนิดหรือขนาดปลา',
      'ผ่านเงื่อนไขเหยื่อหัวมัน 11',
    ],
  }[locale]
  for (const phrase of expected) assert(html.includes(phrase), `${locale} missing “${phrase}”`)
  assert(html.includes('water-surface-icons.md'), `Missing ROM evidence link (${locale})`)
}

function assertSizeMeaning(locale, ctx) {
  const fixture = {
    romSha1: data.waterIcons.romSha1,
    classes: data.waterIcons.classes,
    profiles: { [ctx.id]: { possibleClasses: ['small', 'large'], bubble: false } },
  }
  const html = renderWaterIcons(ctx, fixture, '4')
  const expected = {
    en: ['Small fish mark', 'Large fish mark', 'mark alone cannot identify the species'],
    ja: ['小さい魚影', '大きい魚影', 'マークだけでは魚種を特定できません'],
    th: [
      'เครื่องหมายปลาขนาดต่ำกว่า 50 ซม.',
      'เครื่องหมายปลาขนาดตั้งแต่ 50 ซม.',
      'เครื่องหมายอย่างเดียวระบุชนิดปลาไม่ได้',
    ],
  }[locale]
  for (const phrase of expected) assert(html.includes(phrase), `${locale} missing “${phrase}”`)
}

function checkCardEvidenceClasses(locale) {
  for (const [fishId, profile] of Object.entries(data.waterIcons.profiles)) {
    const ctx = makeContext(locale, fishId, 'maps.html?stage=4')
    const html = renderWaterIcons(ctx, data.waterIcons, profile.mapStages?.[0] || '')
    const cards = [
      ...html.matchAll(
        /data-water-icon="([a-z]+)" data-water-class-evidence="(initial|growth-only)"/g,
      ),
    ]
    const expected = deriveClassEvidence(profile)
    assert.deepEqual(
      cards.map((match) => match[1]),
      expected.possible,
      `${locale}/${fishId}: cards`,
    )
    assert.deepEqual(
      cards.map((match) => match[2]),
      expected.possible.map((iconClass) =>
        expected.growth.includes(iconClass) ? 'growth-only' : 'initial',
      ),
      `${locale}/${fishId}: initial versus conditional cards`,
    )
    assert.equal(
      html.includes('data-water-bait-link'),
      expected.bubble,
      `${locale}/${fishId}: potato link`,
    )
  }
}

function assertBaitRoute(locale, html, ctx, outerReturn) {
  const href = html.match(/data-water-bait-link href="([^"]+)"/)?.[1]
  assert(href, `Missing bait link (${locale})`)
  const target = new URL(href.replace(/&amp;/g, '&'), 'https://example.test/catalogue/fish.html')
  assert(target.pathname.endsWith(`/item${locale === 'en' ? '' : `.${locale}`}.html`))
  assert.equal(target.searchParams.get('category'), 'bait')
  assert.equal(target.searchParams.get('id'), '11')
  assert.equal(target.searchParams.get('fish'), ctx.id)
  assert.equal(target.searchParams.get('stage'), '4')
  assert.equal(target.searchParams.get('route'), 'float')
  const back = new URL(target.searchParams.get('return'), 'https://example.test/catalogue/')
  assert(back.pathname.endsWith(`/fish${locale === 'en' ? '' : `.${locale}`}.html`))
  assert.equal(back.searchParams.get('id'), ctx.id)
  assert.equal(back.searchParams.get('stage'), '4')
  assert.equal(back.searchParams.get('return'), outerReturn)
  assert.equal(back.hash, '#water-icons')
}

function checkMissingDataIsHidden() {
  const ctx = makeContext('th', '0D', 'maps.th.html?stage=4')
  assert.equal(renderWaterIcons(ctx, null, '4'), '')
  assert.equal(renderWaterIcons(ctx, { classes: {}, profiles: {} }, '4'), '')
  assert.equal(
    renderWaterIcons(
      ctx,
      {
        romSha1: data.waterIcons.romSha1,
        classes: data.waterIcons.classes,
        profiles: { '0D': { possibleClasses: ['small'], bubble: false } },
      },
      '4',
    ).includes('data-water-bait-link'),
    false,
  )
}

console.log(
  'PASS: ROM-backed fish water marks render localized per-profile classes; bubble action opens potato bait 11 with fish, area, float route, return context, and anchor preserved.',
)
