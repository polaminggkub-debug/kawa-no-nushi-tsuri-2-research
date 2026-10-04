import assert from 'node:assert/strict'
import { data, renderCatalogue, unescapeHtml, validate } from './shared.mjs'

const locales = ['en', 'ja', 'th']
const expectedItemCount = 315
const expectedAdviceCount = 282
const expectedRodCount = 21

function adviceFor(item) {
  return item.rodDecision || item.baitLureDecision || item.gearDecision
}

function escapeHtml(value) {
  return String(value ?? '').replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character],
  )
}

function localizedField(record, field, item, locale) {
  const value = record[field]
  const text = typeof value === 'string' ? value : value?.[locale]
  assert.equal(typeof text, 'string', `Missing ${field}.${locale}: ${item.category}:${item.id}`)
  assert(text.trim(), `Empty ${field}.${locale}: ${item.category}:${item.id}`)
  return text
}

function cardFor(runtime, item) {
  const card = runtime.renderItemCard(item)
  assert(
    card.includes(`id="item-${item.category}-${item.id}"`),
    `Card identity missing: ${item.category}:${item.id}`,
  )
  assert(
    card.includes('<figure class="sprite"><a '),
    `Portrait link missing: ${item.category}:${item.id}`,
  )
  assert(
    card.includes('<h3><a class="entity-title"'),
    `Title link missing: ${item.category}:${item.id}`,
  )
  assert(
    card.includes('<details class="record-details">'),
    `Evidence disclosure missing: ${item.category}:${item.id}`,
  )
  return card
}

function checkAdviceLayers(card, item, locale) {
  const advice = adviceFor(item)
  if (!advice) return false
  const detailStart = card.indexOf('<details class="card-decision-disclosure"')
  const evidenceStart = card.indexOf('<details class="record-details">')
  assert(detailStart > 0, `Decision disclosure missing: ${item.category}:${item.id}`)
  assert(
    evidenceStart > detailStart,
    `Technical evidence moved above decision: ${item.category}:${item.id}`,
  )
  const visible = card.slice(0, detailStart)
  const decisionDetails = card.slice(detailStart, evidenceStart)
  const evidence = card.slice(evidenceStart)
  const label = localizedField(advice, 'label', item, locale)
  const recommendation = localizedField(advice, 'recommendation', item, locale)
  const reason = localizedField(advice, 'reason', item, locale)
  const marker = item.rodDecision
    ? 'data-rod-decision'
    : item.baitLureDecision
      ? 'data-bait-lure-decision'
      : 'data-gear-decision'
  assert(
    visible.includes(`${marker}="${item.id}"`),
    `Decision type missing: ${item.category}:${item.id}`,
  )
  assert(
    visible.includes(`class="use-summary card-verdict">${escapeHtml(label)}</p>`),
    `Visible verdict missing: ${item.category}:${item.id}/${locale}`,
  )
  assert(
    decisionDetails.includes(`class="card-full-recommendation">${escapeHtml(recommendation)}</p>`),
    `Full recommendation missing: ${item.category}:${item.id}/${locale}`,
  )
  assert(
    decisionDetails.includes(`class="card-decision-reason">${escapeHtml(reason)}</p>`),
    `Full reason missing: ${item.category}:${item.id}/${locale}`,
  )
  for (const source of advice.sources || [])
    assert(
      evidence.includes(escapeHtml(source)),
      `Decision evidence source missing: ${item.category}:${item.id}/${source}`,
    )
  if (item.recordBytesHex)
    assert(evidence.includes(item.recordBytesHex), `ROM bytes missing: ${item.category}:${item.id}`)
  return true
}

function checkRenderedCards(runtime, locale) {
  assert.equal(runtime.allItems.length, expectedItemCount, `Runtime item count changed: ${locale}`)
  let adviceCount = 0
  const identities = new Set()
  for (const item of data.items) {
    const key = `${item.category}:${item.id}`
    assert(!identities.has(key), `Duplicate item identity: ${key}`)
    identities.add(key)
    const card = cardFor(runtime, item)
    if (checkAdviceLayers(card, item, locale)) adviceCount += 1
  }
  assert.equal(identities.size, expectedItemCount, `Duplicate or missing item identity: ${locale}`)
  assert.equal(adviceCount, expectedAdviceCount, `Decision card count changed: ${locale}`)
}

function localeSuffix(locale) {
  return locale === 'en' ? '' : `.${locale}`
}

function checkReturnContext(url, base, locale) {
  const rawReturn = url.searchParams.get('return')
  assert(rawReturn, `Map link has no return context: ${url}`)
  const returned = new URL(rawReturn, base)
  assert(
    returned.pathname.endsWith(`/index${localeSuffix(locale)}.html`),
    `Map link returns to wrong page: ${url}`,
  )
  assert.equal(returned.searchParams.get('category'), 'rod', `Map link lost category: ${url}`)
  assert.equal(returned.searchParams.get('style'), '4', `Map link lost style filter: ${url}`)
  assert.equal(returned.hash, '#catalogue', `Map link lost catalogue anchor: ${url}`)
}

function checkFishDestination(url, base, locale, fishId, stage, page) {
  const target = new URL(unescapeHtml(url), base)
  assert(
    target.pathname.endsWith(`/${page}${localeSuffix(locale)}.html`),
    `Wrong fish destination: ${target}`,
  )
  assert.equal(target.searchParams.get('fish') || target.searchParams.get('id'), fishId)
  if (stage) assert.equal(target.searchParams.get('stage'), String(stage))
  checkReturnContext(target, base, locale)
  return target
}

function fishWithEmbeddedMap() {
  return Object.keys(data.fishLocations).find(
    (id) => data.fishLocations[id].locations?.[0]?.maps?.[0]?.image,
  )
}

function checkEmptyFishPanel(panel, locale) {
  assert(panel.hidden, `No-target fish panel must start hidden: ${locale}`)
  assert.equal(
    panel.innerHTML,
    '',
    `No-target panel must not show duplicate picker instructions: ${locale}`,
  )
}

function checkEmbeddedMapDisclosure(html, locale, map) {
  const detailsStart = html.indexOf('<details class="fish-location-details">')
  assert(detailsStart > 0, `Embedded map disclosure missing: ${locale}`)
  assert(
    !/<details class="fish-location-details"[^>]*\bopen(?:\s|>)/.test(html),
    `Embedded map opens by default: ${locale}`,
  )
  assert(html.slice(0, detailsStart).indexOf('map-canvas') === -1)
  assert(html.slice(detailsStart).includes('class="map-pin"'))
  assert.equal((html.match(/class="map-pin"/g) || []).length, map.pins.length)
}

function checkFishAreaLinks(html, base, locale, fishId, locations) {
  const stages = [...new Set(locations.map((location) => String(location.stage)))]
  const links = [...html.matchAll(/<a class="fish-area-link" href="([^"]+)">/g)]
  assert.equal(links.length, stages.length, `Area link count mismatch: ${locale}`)
  for (const match of links) {
    const target = checkFishDestination(match[1], base, locale, fishId, null, 'maps')
    assert(stages.includes(target.searchParams.get('stage')), `Unexpected stage link: ${target}`)
  }
}

function checkFishProfileLink(html, base, locale, fishId) {
  const profile = html.match(/<a class="fish-profile-link" href="([^"]+)"/)
  assert(profile, `Fish profile link missing: ${locale}`)
  const target = new URL(unescapeHtml(profile[1]), base)
  assert(target.pathname.endsWith(`/fish${localeSuffix(locale)}.html`))
  assert.equal(target.searchParams.get('id'), fishId)
  checkReturnContext(target, base, locale)
}

function checkFishMapLink(html, base, locale, fishId, stage) {
  const mapLink = html.match(/<a class="map-browser-cta" href="([^"]+)"/)
  assert(mapLink, `Map browser link missing: ${locale}`)
  checkFishDestination(mapLink[1], base, locale, fishId, stage, 'maps')
}

function checkClearedFishPanel(runtime, panel, locale) {
  runtime.renderFishLocation()
  assert(panel.hidden, `Cleared fish panel is not hidden: ${locale}`)
  assert.equal(panel.innerHTML, '', `Cleared fish panel retained content: ${locale}`)
}

function checkFishPanel(result, locale) {
  const { runtime, nodes, url: base } = result
  const panel = nodes['fish-location-panel']
  checkEmptyFishPanel(panel, locale)
  const fishId = fishWithEmbeddedMap()
  assert(fishId, 'No fish has a verified embedded map to exercise')
  const locations = data.fishLocations[fishId].locations
  runtime.locationStage = ''
  runtime.locationMapIndex = 0
  runtime.renderFishLocation(fishId)
  const html = panel.innerHTML
  assert(!panel.hidden, `Selected fish panel remains hidden: ${locale}`)
  assert(html.includes('fish-area-links'), `Visible area links missing: ${locale}`)
  checkFishAreaLinks(html, base, locale, fishId, locations)
  checkFishProfileLink(html, base, locale, fishId)
  checkFishMapLink(html, base, locale, fishId, locations[0].stage)
  checkEmbeddedMapDisclosure(html, locale, locations[0].maps[0])
  validate(html, base)
  checkClearedFishPanel(runtime, panel, locale)
}

function checkRodComparison(result, locale) {
  const { runtime, nodes, url } = result
  nodes['style-filter'].value = '4'
  runtime.renderComparison('rod')
  const table = nodes['rod-comparison'].innerHTML
  const rods = data.items.filter((item) => item.category === 'rod')
  assert.equal(rods.length, expectedRodCount)
  assert.equal((table.match(/class="rod-table-advice"/g) || []).length, expectedRodCount)
  assert(!table.includes('rod-table-reason'), `Full reason duplicated in rod table: ${locale}`)
  for (const item of rods) {
    const label = localizedField(item.rodDecision, 'label', item, locale)
    assert(
      unescapeHtml(table).includes(label),
      `Rod verdict missing from comparison: ${item.id}/${locale}`,
    )
    assert(
      table.includes(`category=rod&amp;id=${item.id}`),
      `Rod profile link missing: ${item.id}/${locale}`,
    )
  }
  validate(table, url)
}

export async function runCatalogueCards() {
  assert.equal(data.items.length, expectedItemCount, 'Source catalogue item count changed')
  for (const locale of locales) {
    const result = await renderCatalogue(locale, '?category=rod&style=4#catalogue')
    checkRenderedCards(result.runtime, locale)
    checkFishPanel(result, locale)
    checkRodComparison(result, locale)
  }
  console.log(
    `PASS: ${expectedItemCount} runtime cards and ${expectedAdviceCount} localized decisions; target fish links/maps, hidden empty panel, and ${expectedRodCount}-rod comparison checked in EN/JA/TH.`,
  )
}
