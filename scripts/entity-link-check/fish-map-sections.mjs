import assert from 'node:assert/strict'
import { locations, render, unescapeHtml } from './shared.mjs'

const fishId = '34'
const stage = '6'

checkAllMapCardsHaveOneDerivedSection()
for (const locale of ['en', 'ja', 'th']) await checkFishMapLinks(locale)

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

async function checkFishMapLinks(locale) {
  const suffix = locale === 'en' ? '' : `.${locale}`
  const outerReturn = `maps${suffix}.html?stage=6&fish=34&section=s6-c1-r1`
  const result = await render(
    'fish',
    locale,
    new URLSearchParams({ id: fishId, stage, return: outerReturn }),
  )
  const html = unescapeHtml(result.html)
  const links = [
    ...html.matchAll(/<a class="area-map-preview" data-map-section="([^"]+)" href="([^"]+)"/g),
  ]
  const mapCards = locations.fish[fishId].locations.find(
    (area) => String(area.stage) === stage,
  ).maps
  assert.equal(links.length, mapCards.length, `Missing a fish map preview (${locale})`)
  const seenSections = new Set()
  for (const [index, [, section, href]] of links.entries()) {
    const expected = deriveSection(stage, mapCards[index])
    assert.equal(section, expected, `Incorrect section on map card ${index} (${locale})`)
    assert(!seenSections.has(section), `Duplicate map-section link ${section} (${locale})`)
    seenSections.add(section)
    assertMapRoute(href, result.url, section, suffix)
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

function assertMapRoute(href, base, section, suffix) {
  const target = new URL(href, base)
  assert(target.pathname.endsWith(`/maps${suffix}.html`))
  assert.equal(target.searchParams.get('fish'), fishId)
  assert.equal(target.searchParams.get('stage'), stage)
  assert.equal(target.searchParams.get('section'), section)
  const back = new URL(target.searchParams.get('return'), base)
  assert(back.pathname.endsWith(`/fish${suffix}.html`))
  assert.equal(back.searchParams.get('id'), fishId)
  assert.equal(back.searchParams.get('stage'), stage)
  const outer = new URL(back.searchParams.get('return'), base)
  assert(outer.pathname.endsWith(`/maps${suffix}.html`))
  assert.equal(outer.searchParams.get('section'), 's6-c1-r1')
}

console.log(
  'PASS: fish map preview cards link to their own ROM-coordinate section and preserve fish, area, and nested return context (EN/JA/TH).',
)
