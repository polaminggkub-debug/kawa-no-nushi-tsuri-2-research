import assert from 'node:assert/strict'
import { data, render, renderCatalogue, unescapeHtml, validate } from './shared.mjs'

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

function checkEvidence(evidence, item, advice, locale) {
  for (const source of advice.sources || [])
    assert(
      evidence.includes(escapeHtml(source)),
      `Decision evidence source missing: ${item.category}:${item.id}/${source}/${locale}`,
    )
  if (item.recordBytesHex)
    assert(evidence.includes(item.recordBytesHex), `ROM bytes missing: ${item.category}:${item.id}`)
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
  const label = localizedField(advice, 'label', item, locale)
  const recommendation = localizedField(advice, 'recommendation', item, locale)
  const reason = localizedField(advice, 'reason', item, locale)
  const marker = item.rodDecision
    ? 'data-rod-decision'
    : item.baitLureDecision
      ? 'data-bait-lure-decision'
      : 'data-gear-decision'
  const scopedWing = item.category === 'fly_wing' && ['25', '26', '66', '67'].includes(item.id)
  assert(
    visible.includes(`${scopedWing ? 'data-fly-wing-decision' : marker}="${item.id}"`),
    `Decision type missing: ${item.category}:${item.id}`,
  )
  assert(
    item.baitLureDecision
      ? visible.includes(`data-bait-lure-verdict="${item.category}:${item.id}"`)
      : scopedWing
        ? visible.includes('class="use-summary card-verdict"')
        : visible.includes(`class="use-summary card-verdict">${escapeHtml(label)}</p>`),
    `Visible verdict missing: ${item.category}:${item.id}/${locale}`,
  )
  assert(
    scopedWing
      ? decisionDetails.includes('class="card-full-recommendation"')
      : decisionDetails.includes(
          `class="card-full-recommendation">${escapeHtml(recommendation)}</p>`,
        ),
    `Full recommendation missing: ${item.category}:${item.id}/${locale}`,
  )
  assert(
    scopedWing
      ? decisionDetails.includes('class="card-decision-reason"')
      : decisionDetails.includes(`class="card-decision-reason">${escapeHtml(reason)}</p>`),
    `Full reason missing: ${item.category}:${item.id}/${locale}`,
  )
  checkEvidence(card.slice(evidenceStart), item, advice, locale)
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

function sharedRouteProfiles(category, ids) {
  return ids.map((id) => {
    const item = data.items.find((entry) => entry.category === category && entry.id === id)
    assert(item?.playerUse?.fishIds?.length, `Missing ${category}:${id} route profile list`)
    return item.playerUse.fishIds.slice().sort().join(',')
  })
}

function chooseLocatedFish(ids) {
  return ids.find((id) => data.fishVisuals[id] && data.fishLocations[id]?.locations?.length)
}

function routeCopy(locale, route) {
  const copy = {
    th: {
      float: {
        heading: 'รายชื่อปลาสำหรับชุดทุ่น',
        scope:
          'ทุ่น ID 01–08 ไม่ได้ตรวจปลาแยกตามรุ่น และไม่มีหลักฐานว่าเพิ่มโบนัสหรือข้อจำกัดเฉพาะปลา',
        accepted: 'ปลานี้อยู่ในรายชื่อสำหรับชุดทุ่น',
        rejected: 'ปลานี้ไม่อยู่ในรายชื่อที่ตรวจพบสำหรับชุดทุ่น',
      },
      sinker: {
        heading: 'ปลาในรายชื่อที่ผ่านเงื่อนไขเพิ่มของชุดตะกั่ว',
        scope: 'ตะกั่ว ID 09–0A ใช้เงื่อนไขปลาเพิ่มเติมชุดเดียวกัน',
        accepted: 'ปลานี้อยู่ในรายชื่อที่ผ่านเงื่อนไขเพิ่มของชุดตะกั่ว',
        rejected: 'ปลานี้ไม่ผ่านเงื่อนไขเพิ่มของชุดตะกั่วที่ตรวจพบ',
      },
    },
    en: {
      float: {
        heading: 'Fish in the float-rig list',
        scope:
          'Float IDs 01–08 use the same rig check; the model adds no fish-specific bonus or restriction.',
        accepted: 'This profile is in the float-rig list.',
        rejected: 'This profile is not in the recorded float-rig list.',
      },
      sinker: {
        heading: 'Fish that pass the extra sinker-rig profile check',
        scope: 'Sinker IDs 09–0A share the same extra sinker-rig profile check.',
        accepted: 'This profile is in the list that passes the sinker rig’s extra check.',
        rejected: 'This profile is not in the recorded sinker-rig pass list.',
      },
    },
    ja: {
      float: {
        heading: 'ウキ釣りの魚プロフィール一覧',
        scope: 'ウキID 01–08は同じウキ釣り判定を使い、型ごとの魚ボーナスや制限はない。',
        accepted: 'この魚はウキ釣りの一覧に含まれる。',
        rejected: 'この魚は記録されたウキ釣りの一覧に含まれない。',
      },
      sinker: {
        heading: 'オモリ釣りの追加プロフィール判定を通る魚',
        scope: 'オモリID 09–0Aは同じ追加プロフィール判定を使う。',
        accepted: 'この魚はオモリ釣りの追加判定を通る一覧に含まれる。',
        rejected: 'この魚は記録されたオモリ釣りの通過一覧に含まれない。',
      },
    },
  }
  return copy[locale][route]
}

function checkAcceptedBaitLink(html, url, locale, fishId, route, itemId) {
  const link = html.match(
    new RegExp(`<a class="route-button" data-accepted-bait-link="${route}" href="([^"]+)">`),
  )
  assert(link, `Accepted-bait next step missing: ${locale}/${route}`)
  const target = new URL(unescapeHtml(link[1]), url)
  assert(target.pathname.endsWith(`/fish${localeSuffix(locale)}.html`))
  assert.equal(target.searchParams.get('id'), fishId)
  assert.equal(target.hash, '#all-compatible')
  const back = new URL(target.searchParams.get('return'), url)
  assert(back.pathname.endsWith(`/item${localeSuffix(locale)}.html`))
  assert.equal(back.searchParams.get('category'), 'float_weight')
  assert.equal(back.searchParams.get('id'), itemId)
}

async function checkRigCompatibility(locale) {
  const floatItems = ['01', '02', '03', '04', '05', '06', '07', '08']
  const sinkerItems = ['09', '0A']
  const floatLists = sharedRouteProfiles('float_weight', floatItems)
  const sinkerLists = sharedRouteProfiles('float_weight', sinkerItems)
  assert(
    floatLists.every((list) => list === floatLists[0]),
    'Float model lists diverged',
  )
  assert(
    sinkerLists.every((list) => list === sinkerLists[0]),
    'Sinker model lists diverged',
  )
  const floatTarget = chooseLocatedFish(
    data.items.find((item) => item.category === 'float_weight' && item.id === '01').playerUse
      .fishIds,
  )
  const sinkerIds = data.items.find((item) => item.category === 'float_weight' && item.id === '09')
    .playerUse.fishIds
  const sinkerTarget = chooseLocatedFish(sinkerIds)
  const sinkerRejected = Object.keys(data.fishLocations).find(
    (id) =>
      data.fishVisuals[id] && data.fishLocations[id]?.locations?.length && !sinkerIds.includes(id),
  )
  assert(
    floatTarget && sinkerTarget && sinkerRejected,
    'Need located fish for float/sinker route checks',
  )
  for (const entry of [
    { route: 'float', itemId: '01', fishId: floatTarget, accepted: true },
    { route: 'sinker', itemId: '09', fishId: sinkerTarget, accepted: true },
    { route: 'sinker', itemId: '09', fishId: sinkerRejected, accepted: false },
  ]) {
    const result = await render(
      'item',
      locale,
      `category=float_weight&id=${entry.itemId}&fish=${entry.fishId}`,
    )
    const html = result.html
    const copy = routeCopy(locale, entry.route)
    assert(html.includes(`data-compatibility-route="${entry.route}"`))
    assert(html.includes(copy.heading), `Route-level heading missing: ${locale}/${entry.route}`)
    assert(html.includes(copy.scope), `Shared route scope missing: ${locale}/${entry.route}`)
    assert(html.includes(entry.accepted ? copy.accepted : copy.rejected))
    checkAcceptedBaitLink(html, result.url, locale, entry.fishId, entry.route, entry.itemId)
    validate(html, result.url)
  }
}

function checkConditionalBaitOffer(runtime, locale) {
  const item = data.items.find((entry) => entry.category === 'bait' && entry.id === '17')
  const offer = item.playerUse.shops?.find((shop) =>
    shop.condition?.includes('sell at least one Ayu before buying'),
  )
  assert(offer, 'Decoy Ayu has no recorded conditional shop offer')
  const card = cardFor(runtime, item)
  const note = {
    th: `ด่าน ${offer.stage}: ต้องขายปลาอายุจากข้องอย่างน้อย 1 ตัวก่อนซื้อ`,
    en: `Area ${offer.stage}: sell at least one Ayu from your keepnet before buying`,
    ja: `エリア${offer.stage}：びくのアユを1匹以上売ってから購入`,
  }[locale]
  const noteAt = card.indexOf('data-conditional-offer-note="bait:17"')
  const buyingAt = card.indexOf('<details class="card-shop-disclosure"')
  assert(noteAt > 0 && noteAt < buyingAt, `Conditional purchase note is not visible: ${locale}`)
  assert(card.includes(`data-offer-stage="${offer.stage}"`))
  assert(card.includes(note), `Conditional purchase note is not localized: ${locale}`)
  assert(card.includes('price-badge">¥45'), `Recorded price is missing beside offer: ${locale}`)
  assert(
    card.includes(
      locale === 'th'
        ? 'จำนวนในช่องเต็มเป็น 9 ชิ้น'
        : locale === 'ja'
          ? '購入で所持数は9個'
          : 'Buying sets the stack to 9',
    ),
    `Full offer condition was lost from buying details: ${locale}`,
  )
  const noOffer = {
    ...item,
    playerUse: { ...item.playerUse, shops: [] },
  }
  assert(
    !runtime.renderItemCard(noOffer).includes('data-conditional-offer-note'),
    `Offer note remains after the shop condition is removed: ${locale}`,
  )
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
    checkConditionalBaitOffer(result.runtime, locale)
    await checkRigCompatibility(locale)
    checkFishPanel(result, locale)
    checkRodComparison(result, locale)
  }
  console.log(
    `PASS: ${expectedItemCount} runtime cards and ${expectedAdviceCount} localized decisions; target fish links/maps, hidden empty panel, and ${expectedRodCount}-rod comparison checked in EN/JA/TH.`,
  )
}
