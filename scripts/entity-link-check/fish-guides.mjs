import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { data, locations, render, root, unescapeHtml } from './shared.mjs'
import { checkLureKit, checkLureKitNavigation } from './lure-kit-value.mjs'

checkEvidenceTouchTargets()

for (const lang of ['en', 'ja', 'th']) {
  for (const [fishId, record] of Object.entries(locations.fish)) {
    for (const area of record.locations || []) {
      const stage = String(area.stage)
      const result = await render('fish', lang, new URLSearchParams({ id: fishId, stage }))
      checkEvidenceLinks(result, fishId)
      checkAreaDecision(result, lang, fishId, area)
      checkLureKit(result, lang, fishId, stage)
      checkFlyBackup(result, fishId)
      checkVisibleFishEvidence(result)
      await checkStarterOffers(result, fishId, stage)
    }
  }
  const unknown = await render('fish', lang, 'id=43')
  checkEvidenceLinks(unknown, '43')
}
for (const lang of ['en', 'ja', 'th']) await checkLureKitNavigation(lang)
for (const lang of ['en', 'ja', 'th']) await checkFishLoadRecovery(lang)

async function checkFishLoadRecovery(lang) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const returnRoute = `maps${suffix}.html?stage=2&fish=06&route=lure&section=s2-c1-r6#map-view`
  const params = new URLSearchParams({ id: '06', stage: '2', route: 'lure', return: returnRoute })
  const result = await render('fish', lang, params, undefined, 'failure')
  assert.match(result.html, /role="alert"/)
  assert.match(result.html, /id="fish-retry"/)
  assert.match(result.html, new RegExp(`href="index${suffix}\\.html"`))
  assert.equal(
    new URL(result.nodes['fish-back'].href, result.url).href,
    new URL(returnRoute, result.url).href,
    `${lang}: fish error lost its map return context`,
  )
  let reloadCalls = 0
  result.url.reload = () => reloadCalls++
  const exactUrl = result.url.href
  assert.equal(typeof result.nodes['fish-retry'].listeners.click, 'function')
  result.nodes['fish-retry'].listeners.click()
  assert.equal(reloadCalls, 1, `${lang}: fish retry did not reload`)
  assert.equal(result.url.href, exactUrl, `${lang}: fish retry changed map/fish context`)
}

function checkAreaDecision(result, lang, fishId, area) {
  const pointCount = area.points?.length || 0
  const currentArea = result.html.match(
    /<article class="detail-section area-card current-area" data-active="true">([\s\S]*?)<\/article>/,
  )?.[1]
  assert(currentArea, `${lang}/${fishId}/${area.stage}: current area missing`)
  assert(
    currentArea.includes(configuredPointLabel(lang, pointCount)),
    `${lang}/${fishId}/${area.stage}: configured point count missing or wrong`,
  )
  checkEmptyPointAdvice(currentArea, lang, fishId, area.stage, pointCount)
  checkFishMapLinks(currentArea, result, lang, fishId, area)
}

function configuredPointLabel(lang, count) {
  if (lang === 'th') return `${count} จุดที่เกมกำหนด`
  if (lang === 'ja') return `設定されたポイント ${count}か所`
  return `${count} configured point${count === 1 ? '' : 's'}`
}

function checkEmptyPointAdvice(html, lang, fishId, stage, count) {
  const advice = html.match(/<p class="section-lede">([\s\S]*?)<\/p>/)?.[1]
  assert(advice, `${lang}/${fishId}/${stage}: missing empty-point advice`)
  if (count === 1) {
    const wording = {
      en: ['records only one spot', 'nearby water', 'another marked spot'],
      ja: ['地点は1か所だけ', '周辺', '別の表示地点'],
      th: ['จุดที่เกมกำหนดไว้เพียงจุดเดียว', 'บริเวณใกล้', 'จุดอื่นที่แสดงไว้'],
    }[lang]
    assert(advice.includes(wording[0]), `${lang}/${fishId}/${stage}: single spot is unclear`)
    assert(advice.includes(wording[1]), `${lang}/${fishId}/${stage}: no nearby search action`)
    assert(
      !advice.includes(wording[2]),
      `${lang}/${fishId}/${stage}: single spot advises trying another marked spot`,
    )
    return
  }
  assert(count > 1, `${lang}/${fishId}/${stage}: unexpected zero-point area`)
  const tryAnother = {
    en: 'try another marked spot',
    ja: '別の表示地点も試',
    th: 'ลองจุดอื่นที่แสดงไว้',
  }[lang]
  assert(advice.includes(tryAnother), `${lang}/${fishId}/${stage}: no alternate spot action`)
}

function checkFishMapLinks(html, result, lang, fishId, area) {
  const previews = [...html.matchAll(/<a\b([^>]*class="area-map-preview"[^>]*)>([\s\S]*?)<\/a>/g)]
  const maps = (area.maps || []).filter((map) => map.image)
  assert.equal(previews.length, maps.length, `${lang}/${fishId}/${area.stage}: map preview count`)
  for (const [index, preview] of previews.entries()) {
    const attributes = preview[1]
    const href = attributes.match(/\bhref="([^"]+)"/)?.[1]
    const section = attributes.match(/\bdata-map-section="([^"]*)"/)?.[1]
    assert(href && section !== undefined, `${lang}/${fishId}/${area.stage}: incomplete map link`)
    const url = new URL(unescapeHtml(href), result.url)
    assert.equal(url.pathname.split('/').pop(), mapPage(lang))
    assert.equal(url.searchParams.get('fish'), fishId)
    assert.equal(url.searchParams.get('stage'), String(area.stage))
    assert.equal(url.searchParams.get('section') || '', unescapeHtml(section))
    checkMapReturn(url.searchParams.get('return'), result.url, lang, fishId, area.stage)
    assert.match(section, /^(?:|s[1-6]-c\d+-r\d+)$/)
    assert.equal(
      [...preview[2].matchAll(/class="area-map-pin"/g)].length,
      maps[index].pins.length,
      `${lang}/${fishId}/${area.stage}: preview pin count`,
    )
  }

  const routeHref = html.match(/<a class="route-button" href="([^"]+)"/)?.[1]
  assert(routeHref, `${lang}/${fishId}/${area.stage}: full map action missing`)
  const route = new URL(unescapeHtml(routeHref), result.url)
  assert.equal(route.pathname.split('/').pop(), mapPage(lang))
  assert.equal(route.searchParams.get('fish'), fishId)
  assert.equal(route.searchParams.get('stage'), String(area.stage))
  assert.equal(route.searchParams.has('section'), false)
  checkMapReturn(route.searchParams.get('return'), result.url, lang, fishId, area.stage)
}

function checkMapReturn(rawReturn, base, lang, fishId, stage) {
  assert(rawReturn, `${lang}/${fishId}/${stage}: map link does not return to fish page`)
  const returned = new URL(rawReturn, base)
  assert.equal(returned.pathname.split('/').pop(), fishPage(lang))
  assert.equal(returned.searchParams.get('id'), fishId)
  assert.equal(returned.searchParams.get('stage'), String(stage))
  assert.equal(returned.hash, '#fish-area-map')
}

function mapPage(lang) {
  return `maps${lang === 'en' ? '' : `.${lang}`}.html`
}

function fishPage(lang) {
  return `fish${lang === 'en' ? '' : `.${lang}`}.html`
}

function checkFlyBackup(result, fishId) {
  const backups = data.flyBackupChoices?.profiles?.[fishId]?.bundles || []
  const fishCanUseFly = data.items.some(
    (item) => item.category === 'fly' && item.playerUse.fishIds.includes(fishId),
  )
  assert.equal(backups.length, fishCanUseFly ? 3 : 0)
  const fallback = result.html.match(/class="detail-section fly-fallback" data-total="(\d+)"/)
  assert.equal(Boolean(fallback), fishCanUseFly)
  if (fallback) checkBackupOffers(result, fishId, backups, Number(fallback[1]))
}

function checkBackupOffers(result, fishId, backups, total) {
  let sum = 0
  for (const bundle of backups) {
    const body = data.items.find((item) => item.category === 'fly' && item.id === bundle.body)
    const offer = body.playerUse.shops.find(
      (shop) =>
        shop.stage === bundle.stage &&
        shop.bundle?.body === bundle.body &&
        shop.bundle?.wing === bundle.wing &&
        shop.bundle?.tail === bundle.tail,
    )
    assert(offer, 'Backup set is not sold as described')
    sum += offer.bundle.shopPriceYen
    assert(
      result.html.includes(
        `data-bundle="${bundle.body}/${bundle.wing}/${bundle.tail}" data-price="${offer.bundle.shopPriceYen}"`,
      ),
    )
  }
  assert.equal(total, sum)
  const dryBodyWorks = data.items
    .find((item) => item.category === 'fly' && item.id === '3E')
    .playerUse.fishIds.includes(fishId)
  assert.equal(total, dryBodyWorks ? 17 : 30)
  for (let hiddenBody = 0; hiddenBody < 4; hiddenBody++) {
    for (let hiddenWing = 0; hiddenWing < 4; hiddenWing++) {
      assert(
        backups.some(
          (bundle) =>
            (parseInt(bundle.body, 16) & 3) !== hiddenBody &&
            (parseInt(bundle.wing, 16) & 3) !== hiddenWing,
        ),
      )
    }
  }
}

function checkVisibleFishEvidence(result) {
  const visible = result.html.split('<details class="evidence"')[0]
  assert(!visible.includes('spawn slots in the ROM table'))
  assert(!visible.includes('ช่องเกิดปลาในตาราง ROM'))
  assert(!visible.includes('ROMテーブルの出現枠'))
}

function expectedFishEvidence(fishId) {
  const expected = new Set()
  for (const item of data.items) {
    const use = item.playerUse || {}
    const matches =
      item.category === 'bait'
        ? Object.values(use.fishIdsByRoute || {}).some((ids) => ids.includes(fishId))
        : ['lure', 'fly'].includes(item.category) && (use.fishIds || []).includes(fishId)
    if (matches) for (const source of use.evidence?.sources || []) expected.add(source)
  }
  return expected
}

function checkEvidenceLinks(result, fishId) {
  const evidence = result.html.slice(result.html.indexOf('<details class="evidence"'))
  assert(evidence.startsWith('<details class="evidence"'), `${fishId}: evidence disclosure missing`)
  checkEvidenceFileLink(evidence, 'data/rom-fish-locations.json', fishId)
  const sourceList = evidence.match(/<ul class="evidence-sources">([\s\S]*?)<\/ul>/)?.[1] || ''
  const links = [
    ...sourceList.matchAll(
      /<li><a class="evidence-source-link" href="([^"]+)">([\s\S]*?)<\/a><\/li>/g,
    ),
  ]
  const expected = expectedFishEvidence(fishId)
  assert.equal(links.length, expected.size, `${fishId}: source list link count`)
  for (const source of expectedFishEvidence(fishId)) {
    assert(
      links.some(([, href]) => linkTarget(href, source)),
      `${fishId}: source link missing: ${source}`,
    )
    checkEvidenceFileLink(sourceList, source, fishId)
  }
}

function linkTarget(href, source) {
  const target = `https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/${source}`
  return unescapeHtml(href) === target
}

function checkEvidenceFileLink(html, source, fishId) {
  const links = [
    ...html.matchAll(
      /<a class="evidence-source-link" href="([^"]+)"><code>([^<]+)<\/code> ↗<\/a>/g,
    ),
  ]
  assert(
    links.some(([, href, label]) => linkTarget(href, source) && unescapeHtml(label) === source),
    `${fishId}: source link must preserve its path and open the repository file: ${source}`,
  )
}

function checkEvidenceTouchTargets() {
  const css = fs.readFileSync(path.join(root, 'src/shared/detail/index.css'), 'utf8')
  assert.match(
    css,
    /\.evidence-source-link\s*\{[^}]*display:\s*block;[^}]*min-height:\s*44px;/s,
    'Evidence links must remain separate block-sized 44px touch targets',
  )
}

async function checkStarterOffers(result, fishId, stage) {
  const offered = [
    ...result.html.matchAll(
      /class="detail-section starter-offer" id="starter-[^"]+" data-method="([^"]+)" data-item="([^"]+)" data-price="(\d+)"/g,
    ),
  ]
  for (const method of ['float', 'sinker', 'lure', 'fly']) {
    const candidates = starterCandidates(fishId, stage, method)
    const card = offered.find((entry) => entry[1] === method)
    assert.equal(
      Boolean(card),
      Boolean(candidates.length),
      `Missing starter method ${fishId}/${stage}/${method}`,
    )
    const rod = [
      ...result.html.matchAll(
        /data-method-rod="([^"]+)" data-rod="([^"]+)" data-rod-local="(true|false)"/g,
      ),
    ].find((entry) => entry[1] === method)
    assert.equal(Boolean(rod), Boolean(card))
    if (rod) checkStarterRod(rod, method, stage)
    if (card) await checkStarterOffer(result, card, offered, candidates, method, fishId, stage, rod)
  }
}

function starterCandidates(fishId, stage, method) {
  const candidates = []
  for (const item of data.items) {
    const accepted = ['float', 'sinker'].includes(method)
      ? item.category === 'bait' &&
        (item.playerUse?.fishIdsByRoute?.[method] || []).includes(fishId)
      : item.category === method && (item.playerUse?.fishIds || []).includes(fishId)
    if (!accepted) continue
    for (const shop of item.playerUse?.shops || []) {
      if (String(shop.stage) !== stage || shop.condition) continue
      const price = method === 'fly' ? shop.bundle?.shopPriceYen : item.priceYen
      if (Number.isFinite(price) && price >= 0)
        candidates.push({ key: `${item.category}:${item.id}`, price })
    }
  }
  return candidates
}

function checkStarterRod(rod, method, stage) {
  const style = { float: 1, sinker: 2, lure: 4, fly: 8 }[method]
  const available = data.items.filter(
    (item) =>
      item.category === 'rod' &&
      item.decodedFields.styleCode === style &&
      item.playerUse.shops.length,
  )
  const local = available.filter((item) =>
    item.playerUse.shops.some((shop) => String(shop.stage) === stage && !shop.condition),
  )
  const chosen = available.find((item) => item.id === rod[2])
  assert(chosen, 'Wrong rod style')
  assert.equal(rod[3], String(Boolean(local.length)))
  assert.equal(
    chosen.priceYen,
    Math.min(...(local.length ? local : available).map((item) => item.priceYen)),
  )
}

async function checkStarterOffer(result, card, offered, candidates, method, fishId, stage, rod) {
  const minimum = Math.min(...candidates.map((candidate) => candidate.price))
  assert.equal(Number(card[3]), minimum)
  assert(candidates.some((candidate) => candidate.key === card[2] && candidate.price === minimum))
  const nextOffer = offered.find((entry) => entry.index > card.index)
  const html = result.html.slice(card.index, nextOffer?.index || result.html.length)
  if (['float', 'sinker'].includes(method)) {
    assert(html.includes(`data-method-rig="${method}"`))
    assert(html.includes('docs/hook-practical-research.md'))
    await checkRigOffer(
      html,
      offered,
      method,
      fishId,
      stage,
      Number(card[3]),
      rod[2],
      rod[3] === 'true',
    )
  } else assert(html.includes('method-equipment-note'))
}

function checkRigOffer(html, offered, method, fishId, stage, baitPrice, rodId, rodLocal) {
  let totalCost = baitPrice
  let everythingLocal = rodLocal
  const rod = data.items.find((item) => item.category === 'rod' && item.id === rodId)
  totalCost += rod.priceYen
  for (const role of ['hook', method]) {
    const marker = [
      ...html.matchAll(
        /data-rig-role="([^"]+)" data-rig-item="([^"]+)" data-rig-local="(true|false)"/g,
      ),
    ].find((entry) => entry[1] === role)
    assert(marker, `Missing equipment role ${role}`)
    const chosen = checkRigItem(marker, role, method, stage)
    totalCost += chosen.priceYen
    everythingLocal = everythingLocal && marker[3] === 'true'
    checkRigReturn(html, marker[2], chosen, method, fishId, stage)
  }
  const total = html.match(/data-rig-total="(\d+)"/)
  assert.equal(Boolean(total), everythingLocal)
  if (total) assert.equal(Number(total[1]), totalCost)
  checkSinkerFallback(html, offered, method, stage)
}

function checkRigItem(marker, role, method, stage) {
  const choices = data.items.filter(
    (item) =>
      Number.isFinite(item.priceYen) &&
      item.playerUse?.shops?.length &&
      (role === 'hook'
        ? item.category === 'hook' && item.rawFields['+1'] === 0
        : item.category === 'float_weight' &&
          (method === 'float' ? parseInt(item.id, 16) <= 8 : parseInt(item.id, 16) >= 9)),
  )
  const local = choices.filter((item) =>
    item.playerUse.shops.some((shop) => String(shop.stage) === stage && !shop.condition),
  )
  const chosen = choices.find((item) => item.id === marker[2])
  assert(chosen)
  assert.equal(marker[3], String(Boolean(local.length)))
  assert.equal(
    chosen.priceYen,
    Math.min(...(local.length ? local : choices).map((item) => item.priceYen)),
  )
  return chosen
}

function checkRigReturn(html, id, chosen, method, fishId, stage) {
  const expected = new URLSearchParams({
    category: chosen.category,
    id,
    fish: fishId,
    stage,
    route: method,
  })
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map(
    (entry) => new URL(entry[1].replace(/&amp;/g, '&'), 'https://local.test/catalogue/fish.html'),
  )
  assert(
    hrefs.some(
      (url) =>
        [...expected].every(([key, value]) => url.searchParams.get(key) === value) &&
        url.searchParams.get('return')?.endsWith(`#starter-${method}`),
    ),
  )
}

function checkSinkerFallback(html, offered, method, stage) {
  if (method !== 'sinker') return
  const localSinker = data.items.some(
    (item) =>
      item.category === 'float_weight' &&
      parseInt(item.id, 16) >= 9 &&
      item.playerUse.shops.some((shop) => String(shop.stage) === stage && !shop.condition),
  )
  const floatAvailable = offered.some((entry) => entry[1] === 'float')
  assert.equal(html.includes('data-rig-fallback="float"'), !localSinker && floatAvailable)
}
