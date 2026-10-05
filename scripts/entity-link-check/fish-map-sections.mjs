import assert from 'node:assert/strict'
import { locations, render, unescapeHtml } from './shared.mjs'

const fishId = '34'
const stage = '6'

checkAllMapCardsHaveOneDerivedSection()
for (const locale of ['en', 'ja', 'th']) {
  await checkFishMapLinks(locale)
  for (const area of ['1', '2', '3']) await checkFishMapLinks(locale, '06', area)
  await checkExplicitSectionScroll(locale)
}

async function checkExplicitSectionScroll(locale) {
  for (const route of ['float', 'sinker', 'lure', 'fly']) {
    for (const section of ['fish-area-map', 'water-icons', 'all-compatible']) {
      const result = await render('fish', locale, `id=06&stage=2&route=${route}#${section}`)
      assert.equal(
        result.nodes[section]?.scrolled,
        true,
        `Explicit ${section} destination must be restored`,
      )
      assert.notEqual(
        result.nodes[`starter-${route}`]?.scrolled,
        true,
        'Route preference must not override section return',
      )
    }
    const starter = await render('fish', locale, `id=06&stage=2&route=${route}`)
    assert.equal(
      starter.nodes[`starter-${route}`]?.scrolled,
      true,
      'Route without section still opens its starter',
    )
  }
}

function checkAllMapCardsHaveOneDerivedSection() {
  let count = 0
  for (const profile of Object.values(locations.fish || {})) {
    for (const area of profile.locations || []) {
      for (const map of area.maps || []) {
        assert(deriveSection(area.stage, map), `Map card lacks a unique section key: ${map.image}`)
        count += 1
      }
    }
  }
  assert(count > 0, 'No fish map cards were checked')
}

async function checkFishMapLinks(locale, selectedFish = fishId, selectedStage = stage) {
  const suffix = locale === 'en' ? '' : `.${locale}`
  const outerReturn = `maps${suffix}.html?stage=6&fish=34&section=s6-c1-r1`
  const result = await render(
    'fish',
    locale,
    new URLSearchParams({
      id: selectedFish,
      stage: selectedStage,
      route: 'float',
      return: outerReturn,
    }),
  )
  const html = unescapeHtml(result.html)
  for (const targetLang of ['en', 'ja', 'th']) {
    const language = new URL(result.nodes[`language-${targetLang}`].href, result.url)
    assert.equal(
      language.searchParams.get('route'),
      'float',
      'Language switch must retain fishing method',
    )
    assert.equal(language.searchParams.get('stage'), selectedStage)
    assert.equal(language.searchParams.get('id'), selectedFish)
  }
  const links = [
    ...html.matchAll(/<a class="area-map-preview" data-map-section="([^"]+)" href="([^"]+)"/g),
  ]
  const mapCards = locations.fish[selectedFish].locations.find(
    (area) => String(area.stage) === selectedStage,
  ).maps
  assert.equal(links.length, mapCards.length, `Missing a fish map preview (${locale})`)
  const seenSections = new Set()
  for (const [index, [, section, href]] of links.entries()) {
    const expected = deriveSection(selectedStage, mapCards[index])
    assert.equal(section, expected, `Incorrect section on map card ${index} (${locale})`)
    assert(!seenSections.has(section), `Duplicate map-section link ${section} (${locale})`)
    seenSections.add(section)
    assertMapRoute(href, result.url, section, suffix, selectedFish, selectedStage)
  }
}

function deriveSection(area, map) {
  const keys = (map.pins || []).map((pin) => {
    const x = Number(pin.tileX),
      y = Number(pin.tileY)
    if (!Number.isFinite(x) || !Number.isFinite(y)) return ''
    return `s${area}-c${Math.floor((x * 16 + 8) / 384) + 1}-r${Math.floor((y * 16 + 8) / 384) + 1}`
  })
  return keys.length > 0 && keys[0] && keys.every((key) => key === keys[0]) ? keys[0] : ''
}

function assertMapRoute(href, base, section, suffix, selectedFish, selectedStage) {
  const target = new URL(href, base)
  assert(target.pathname.endsWith(`/maps${suffix}.html`))
  assert.equal(target.searchParams.get('fish'), selectedFish)
  assert.equal(target.searchParams.get('stage'), selectedStage)
  assert.equal(target.searchParams.get('section'), section)
  const back = new URL(target.searchParams.get('return'), base)
  assert(back.pathname.endsWith(`/fish${suffix}.html`))
  assert.equal(back.searchParams.get('id'), selectedFish)
  assert.equal(back.searchParams.get('stage'), selectedStage)
  assert.equal(back.searchParams.get('route'), 'float')
  assert.equal(back.hash, '#fish-area-map', 'Map back must return to the fish locations section')
  const outer = new URL(back.searchParams.get('return'), base)
  assert(outer.pathname.endsWith(`/maps${suffix}.html`))
  assert.equal(outer.searchParams.get('section'), 's6-c1-r1')
}

console.log(
  'PASS: fish map previews preserve ROM sections, fish, area, route and nested return, and return to #fish-area-map in EN/JA/TH, including a fish found in three areas.',
)
