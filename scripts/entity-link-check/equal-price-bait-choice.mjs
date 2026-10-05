import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { data, render, renderCatalogue, root, unescapeHtml } from './shared.mjs'

const acceptance = readJson('data/fish-acceptance.json')
const shopStock = readJson('data/shop-stock-rom.json')
const choiceSource = readJson('data/bait-lure-player-choices.json')
const stockAreas = new Map(shopStock.areas.map((area) => [Number(area.stage), area]))
const itemByKey = new Map(data.items.map((item) => [`${item.category}:${item.id}`, item]))
const decisions = data.items.filter((item) => item.baitLureDecision)
assert.equal(decisions.length, 104, 'Expected all bait/lure decision records')

function readJson(relative) {
  return JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'))
}

function rawGate(item) {
  const records = item.category === 'bait' ? acceptance.baits : acceptance.lures
  const record = records.find((entry) => entry.id_hex === item.id)
  assert(record, `Missing ROM compatibility record for ${item.category}:${item.id}`)
  if (item.category === 'lure') return { all: record.fish_ids_passing_mask_gate }
  const maskFish = new Set(record.fish_ids_passing_mask_gate)
  const float = record.mode0_fish_ids_with_nonzero_random_threshold
  const sinker = record['mode1_fish_ids_with_nonzero_random_threshold_+3'].filter(
    (fishId) =>
      maskFish.has(fishId) &&
      record['mode1_fish_ids_passing_profile_byte_+13_gate'].includes(fishId),
  )
  return { float, sinker }
}

function assertSameSet(actual, expected, label) {
  assert.deepEqual([...new Set(actual)].sort(), [...new Set(expected)].sort(), label)
  assert.equal(actual.length, new Set(actual).size, `${label}: duplicate fish profile`)
}

function hasUnconditionalShopOffer(item, stage) {
  return item.playerUse.shops.some((offer) => Number(offer.stage) === stage && !offer.condition)
}

function hasRomStock(category, id, stage) {
  const area = stockAreas.get(stage)
  return Boolean(
    area?.items.some((offer) => offer.category === category && offer.id === id && !offer.condition),
  )
}

function candidateIsStrictSuperset(candidate, target) {
  const candidateGate = rawGate(candidate)
  const targetGate = rawGate(target)
  let broader = false
  for (const [route, targetIds] of Object.entries(targetGate)) {
    const candidateIds = new Set(candidateGate[route] || [])
    if (!targetIds.every((fishId) => candidateIds.has(fishId))) return false
    if (candidateIds.size > targetIds.length) broader = true
  }
  return broader
}

function expectedEqualPriceOffers(item) {
  const expected = {}
  for (const targetOffer of item.playerUse.shops) {
    const stage = Number(targetOffer.stage)
    if (targetOffer.condition || !hasRomStock(item.category, item.id, stage)) continue
    if (!hasUnconditionalShopOffer(item, stage)) continue
    const candidates = decisions.filter(
      (candidate) =>
        candidate.category === item.category &&
        candidate.id !== item.id &&
        candidate.priceYen === item.priceYen &&
        hasUnconditionalShopOffer(candidate, stage) &&
        hasRomStock(candidate.category, candidate.id, stage) &&
        candidateIsStrictSuperset(candidate, item),
    )
    if (candidates.length) {
      expected[String(stage)] = candidates
        .map((candidate) => ({
          category: candidate.category,
          id: candidate.id,
          priceYen: candidate.priceYen,
        }))
        .sort((a, b) => parseInt(a.id, 16) - parseInt(b.id, 16))
    }
  }
  return expected
}

function checkGateMatchesRom(item, key) {
  const gate = rawGate(item)
  if (item.category === 'bait') {
    assertSameSet(
      item.playerUse.fishIdsByRoute.float,
      gate.float,
      `${key}/float differs from ROM gates`,
    )
    assertSameSet(
      item.playerUse.fishIdsByRoute.sinker,
      gate.sinker,
      `${key}/sinker differs from ROM gates`,
    )
  } else {
    assertSameSet(item.playerUse.fishIds, gate.all, `${key}/lure differs from ROM gates`)
  }
}

function checkDecisionMaps(item, key, expected) {
  const source = choiceSource.items[key]
  assert(source, `Missing source decision for ${key}`)
  for (const [name, value] of [
    ['source', source.equalPriceByStage],
    ['gallery', item.baitLureDecision.equalPriceByStage],
  ]) {
    assert.deepEqual(
      value,
      expected,
      `${key}: ${name} equal-price coverage/stock candidates mismatch`,
    )
  }
}

function checkCandidateReferences(item, key, expected) {
  for (const [stage, offers] of Object.entries(expected)) {
    const seen = new Set()
    for (const offer of offers) {
      const offerKey = `${offer.category}:${offer.id}`
      assert(!seen.has(offerKey), `${key}/${stage}: duplicate candidate ${offerKey}`)
      seen.add(offerKey)
      assert.equal(offer.category, item.category, `${key}/${stage}: cross-category candidate`)
      assert.equal(offer.priceYen, item.priceYen, `${key}/${stage}: price is not equal`)
      const candidate = itemByKey.get(offerKey)
      assert(candidate, `${key}/${stage}: unknown candidate ${offerKey}`)
      assert(hasRomStock(candidate.category, candidate.id, Number(stage)))
      assert(hasUnconditionalShopOffer(candidate, Number(stage)))
      assert(
        candidateIsStrictSuperset(candidate, item),
        `${offerKey} does not strictly cover ${key}`,
      )
    }
  }
}

function checkDecisionData(item) {
  const key = `${item.category}:${item.id}`
  checkGateMatchesRom(item, key)
  const expected = expectedEqualPriceOffers(item)
  checkDecisionMaps(item, key, expected)
  checkCandidateReferences(item, key, expected)
  return expected
}

function checkLink(html, base, item, stage, route, expectedRef, lang, placement) {
  const visible =
    placement === 'card'
      ? html.split('<details class="card-decision-disclosure"')[0]
      : html.split('<details class="evidence"')[0]
  const section = visible.match(/<aside data-equal-price-choice>[\s\S]*?<\/aside>/)?.[0]
  assert(
    section,
    `Missing visible equal-price advice for ${item.category}:${item.id}/${placement}/${lang}`,
  )
  const key = `${expectedRef.category}:${expectedRef.id}`
  const candidate = itemByKey.get(key)
  const pattern = new RegExp(
    `<a data-equal-price-item="${key}" data-offer-stage="${stage}" href="([^"]+)">([^<]+)</a>`,
  )
  const match = section.match(pattern)
  assert(
    match,
    `Missing actionable ${key} link for ${item.category}:${item.id}/${stage}/${route}/${placement}/${lang}`,
  )
  const target = new URL(unescapeHtml(match[1]), base)
  const names = { en: candidate.nameEn, ja: candidate.nameJa, th: candidate.nameTh }
  const expectedName = candidate.playerUse?.displayName?.[lang] || names[lang] || candidate.nameJa
  assert(
    unescapeHtml(match[2]).includes(expectedName),
    `Wrong localized name for ${key}/${placement}/${lang}`,
  )
  assert.equal(target.searchParams.get('category'), expectedRef.category)
  assert.equal(target.searchParams.get('id'), expectedRef.id)
  assert.equal(target.searchParams.get('stage'), String(stage))
  assert.equal(target.searchParams.get('route'), route)
  assert(target.pathname.endsWith(`item${lang === 'en' ? '' : `.${lang}`}.html`))

  const returnValue = target.searchParams.get('return')
  assert(returnValue, `Missing return context on ${key} link`)
  const returned = new URL(returnValue, base)
  assert(
    returned.pathname.endsWith(
      `${placement === 'card' ? 'index' : 'item'}${lang === 'en' ? '' : `.${lang}`}.html`,
    ),
  )
  assert.equal(returned.searchParams.get('category'), item.category)
  assert.equal(returned.searchParams.get('stage'), String(stage))
  assert.equal(returned.searchParams.get('route'), route)
  if (placement === 'detail') assert.equal(returned.searchParams.get('id'), item.id)
}

const cases = []
for (const item of decisions) {
  const expected = checkDecisionData(item)
  for (const [stage, offers] of Object.entries(expected))
    cases.push({ item, stage: Number(stage), offers })
}

for (const lang of ['en', 'ja', 'th']) {
  for (const route of ['float', 'sinker']) {
    for (const { item, stage, offers } of cases) {
      const suffix = lang === 'en' ? '' : `.${lang}`
      const { runtime, url } = await renderCatalogue(
        lang,
        `?category=${item.category}&stage=${stage}&route=${route}`,
      )
      const card = runtime.renderItemCard(item)
      for (const offer of offers) checkLink(card, url, item, stage, route, offer, lang, 'card')

      const returnRoute = `index${suffix}.html?category=${item.category}&stage=${stage}&route=${route}#catalogue`
      const detail = await render(
        'item',
        lang,
        new URLSearchParams({
          category: item.category,
          id: item.id,
          stage: String(stage),
          route,
          return: returnRoute,
        }),
      )
      for (const offer of offers)
        checkLink(detail.html, detail.url, item, stage, route, offer, lang, 'detail')
    }
  }
}

const loachChoice = data.items.find((item) => item.category === 'bait' && item.id === '13')
assert.deepEqual(loachChoice.baitLureDecision.equalPriceByStage, {
  3: [{ category: 'bait', id: '12', priceYen: 20 }],
  5: [{ category: 'bait', id: '12', priceYen: 20 }],
  6: [{ category: 'bait', id: '12', priceYen: 20 }],
})
console.log(
  `PASS: ${cases.length} equal-price bait/lure source decisions match ROM gates and unconditional area stock; visible item-card/detail links preserve locale, stage, rig and return context in EN/JA/TH.`,
)
