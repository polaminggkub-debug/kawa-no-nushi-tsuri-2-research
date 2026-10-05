import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { data, locations, root } from './shared.mjs'

checkCacheRevisions()

const placeholder43 = JSON.parse(
  fs.readFileSync(path.join(root, 'data/fish-acceptance.json'), 'utf8'),
).fish_profiles.find((fish) => fish.id_hex === '43')
assert.equal(placeholder43.acceptance_mask_hex, '0x0000')
for (const key of ['matching_bait_ids', 'matching_lure_ids', 'matching_fly_body_ids']) {
  assert.deepEqual(placeholder43[key], [])
}
assert(!locations.fish['43']?.locations?.length)
assert.equal(data.items.filter((item) => item.category === 'rod' && item.rodDecision).length, 21)
assert.equal(data.items.filter((item) => item.gearDecision).length, 157)
assert.equal(data.items.filter((item) => item.baitLureDecision).length, 104)

function baitLureGate(item) {
  return item.category === 'bait' ? item.playerUse.fishIdsByRoute : { all: item.playerUse.fishIds }
}

function checkCacheRevisions() {
  const scripts = [
    ['gallery.js', ['index.html', 'index.ja.html', 'index.th.html']],
    ['item-detail.js', ['item.html', 'item.ja.html', 'item.th.html']],
    ['fish-detail.js', ['fish.html', 'fish.ja.html', 'fish.th.html']],
  ]
  for (const [script, pages] of scripts) {
    const source = fs.readFileSync(path.join(root, 'catalogue', script), 'utf8')
    const version = source.match(/gallery-data\.json\?v=([^\s'"`]+)/)?.[1]
    assert(version, `Catalogue data must have a cache revision: ${script}`)
    for (const page of pages) {
      const html = fs.readFileSync(path.join(root, 'catalogue', page), 'utf8')
      assert(
        html.includes(
          `${script}?v=${createHash('sha256').update(source).digest('hex').slice(0, 16)}`,
        ),
        `Script content cache revision mismatch: ${page}`,
      )
    }
  }
}

function covers(candidate, item) {
  return Object.entries(baitLureGate(item)).every(([route, fishIds]) =>
    fishIds.every((id) => (baitLureGate(candidate)[route] || []).includes(id)),
  )
}

function adviceSource() {
  return JSON.parse(fs.readFileSync(path.join(root, 'data/bait-lure-player-choices.json'), 'utf8'))
}

const source = adviceSource()
for (const item of data.items.filter((entry) => entry.baitLureDecision)) {
  const advice = source.items[`${item.category}:${item.id}`]
  assert(advice, `Missing full bait/lure evidence ${item.category}:${item.id}`)
  for (const key of ['label', 'recommendation', 'reason', 'alternatives', 'cheaperByStage']) {
    assert.deepEqual(
      item.baitLureDecision[key],
      advice[key],
      `Advice mismatch ${item.category}:${item.id}/${key}`,
    )
  }
  for (const stage of ['1', '2', '3', '4', '5', '6']) {
    const hasCheaper = data.items.some(
      (candidate) =>
        candidate.category === item.category &&
        candidate.priceYen < item.priceYen &&
        candidate.playerUse.shops.some((shop) => String(shop.stage) === stage && !shop.condition) &&
        covers(candidate, item),
    )
    if (item.playerUse.shops.length) {
      assert.equal(Boolean(advice.cheaperByStage[stage]?.length), hasCheaper)
    }
  }
  for (const peerRef of advice.exactGatePeers) {
    const peer = data.items.find(
      (candidate) => candidate.category === peerRef.category && candidate.id === peerRef.id,
    )
    assert(peer && covers(peer, item) && covers(item, peer), `Invalid exact gate peer ${item.id}`)
  }
  checkCheapestAlternatives(item, advice)
}

function checkCheapestAlternatives(item, advice) {
  for (const [stage, refs] of Object.entries(advice.cheaperByStage)) {
    const offers = data.items.filter(
      (candidate) =>
        candidate.category === item.category &&
        candidate.priceYen < item.priceYen &&
        candidate.playerUse.shops.some((shop) => String(shop.stage) === stage && !shop.condition) &&
        covers(candidate, item),
    )
    const prices = offers.map((offer) => offer.priceYen)
    const lowest = Math.min(...prices)
    const ids = offers
      .filter((offer) => offer.priceYen === lowest)
      .map((offer) => offer.id)
      .sort()
    assert.deepEqual(
      refs.map((ref) => ref.id).sort(),
      ids,
      `Cheapest alternative mismatch ${item.id}/${stage}`,
    )
    for (const ref of refs) assert.equal(ref.priceYen, lowest)
  }
}

for (const item of data.items.filter((entry) => entry.category === 'hook')) {
  assert.deepEqual(
    (item.gearDecision.targetFish || []).slice().sort(),
    (item.playerUse.targetMatches || []).map((match) => match.fishId).sort(),
  )
}
for (const item of data.items.filter((entry) => entry.category === 'fly_wing')) {
  assert(item.gearDecision.reason.en.includes('recasting the same setup does not reroll'))
  assert(item.gearDecision.reason.en.includes('at least one'))
  assert(item.gearDecision.reason.en.includes('do not guarantee a bite'))
}

checkAcquisitions()
checkTownAcquisitionImages()
checkGearPrices()
checkGeneralTools()

function checkAcquisitions() {
  const acquisitions = JSON.parse(
    fs.readFileSync(path.join(root, 'data/town-item-acquisition.json'), 'utf8'),
  )
  assert.equal(Object.keys(acquisitions.items).length, 6)
  for (const [key, entries] of Object.entries(acquisitions.items)) {
    const item = data.items.find((entry) => `${entry.category}:${entry.id}` === key)
    assert(item)
    for (const entry of entries) {
      assert(
        item.playerUse.useLocations.some(
          (location) =>
            location.context === 'town' &&
            location.mapId === entry.mapId &&
            location.action?.en === entry.action.en,
        ),
        `Missing actionable acquisition ${key}`,
      )
    }
  }
}

function checkTownAcquisitionImages() {
  const quest = JSON.parse(fs.readFileSync(path.join(root, 'data/quest-tool-use.json'), 'utf8'))
  for (const itemId of ['0F', '17', '12']) {
    const item = data.items.find(
      (entry) => entry.category === 'general_tool' && entry.id === itemId,
    )
    const towns = (item.playerUse.useLocations || []).filter(
      (location) => location.context === 'town',
    )
    const expected =
      itemId === '17'
        ? quest.items['17'].rawTrace.chests
        : itemId === '0F'
          ? [quest.items['0F'].rawTrace.acquisition]
          : quest.items['17'].rawTrace.chests.filter((chest) => chest.mapId === 12)
    assert.equal(towns.length, expected.length, `Missing town acquisition/use points ${itemId}`)
    for (const chest of expected) {
      const location = towns.find((point) => point.mapId === chest.mapId)
      assert(location)
      assert.deepEqual([location.tileX, location.tileY], chest.xy)
      assert(location.approach)
      assert(
        location.approach.fullImage.includes(
          `rom-field-${String(chest.visibleArea).padStart(2, '0')}`,
        ),
      )
    }
  }
}

function checkGearPrices() {
  for (const kind of ['float', 'sinker']) {
    for (const [stage, row] of Object.entries(data.gearPriceGuide[kind])) {
      const candidates = data.items.filter(
        (item) =>
          item.category === 'float_weight' &&
          (kind === 'float' ? parseInt(item.id, 16) < 8 : ['09', '0A'].includes(item.id)) &&
          item.playerUse.shops.some((shop) => String(shop.stage) === stage),
      )
      assert.equal(row.priceYen, Math.min(...candidates.map((item) => item.priceYen)))
      assert(candidates.some((item) => item.id === row.id && item.priceYen === row.priceYen))
    }
  }
  checkHookPrices()
}

function checkHookPrices() {
  for (const stage of [1, 2, 3, 4, 5, 6]) {
    const row = data.gearPriceGuide.hook[stage]
    const eligible = data.items.filter(
      (item) =>
        item.category === 'hook' &&
        item.rawFields['+1'] === 0 &&
        item.playerUse.shops.some((shop) => Number(shop.stage) === stage && !shop.condition),
    )
    assert.equal(row.priceYen, Math.min(...eligible.map((item) => item.priceYen)))
    assert(eligible.some((item) => item.id === row.id && item.priceYen === row.priceYen))
  }
}

function checkGeneralTools() {
  const netSource = JSON.parse(
    fs.readFileSync(path.join(root, 'data/general-tool-actions.json'), 'utf8'),
  )
  const net = data.items.find((item) => item.category === 'general_tool' && item.id === '04')
  assert.deepEqual(net.gatheredBaitByArea, netSource.items['04'].trace.perAreaBaitIds)
  assert.equal(data.items.filter((item) => item.netGatherArea).length, 6)
  checkNetLocations(netSource, net)
  checkKeepnet()
  checkDaikonAndTub()
  checkCompass(netSource)
}

function checkNetLocations(netSource, net) {
  const source = JSON.parse(fs.readFileSync(path.join(root, 'data/gold-net-location.json'), 'utf8'))
  const points = net.playerUse.useLocations
  assert.deepEqual(points, source.items['general_tool:04'])
  assert.equal(points.length, 1)
  assert.equal(points[0].access.naturalWalkingRouteConfirmed, false)
  assert.deepEqual([points[0].stage, points[0].tileX, points[0].tileY], [1, 9, 105])
  for (const lang of ['en', 'th', 'ja'])
    assert(points[0].description[lang] && points[0].action[lang])
  for (const [stage, baitId] of Object.entries(netSource.items['04'].trace.perAreaBaitIds)) {
    assert.equal(
      data.items.find((item) => item.category === 'bait' && item.id === baitId).netGatherArea,
      Number(stage),
    )
  }
}

function checkKeepnet() {
  const source = JSON.parse(fs.readFileSync(path.join(root, 'data/chum-basket-use.json'), 'utf8'))
  for (const [id, capacity] of Object.entries(
    source.raw_evidence.basket_purchase.capacity_by_item_id,
  )) {
    assert.equal(
      data.items.find((item) => item.category === 'general_tool' && item.id === id).keepnetCapacity,
      capacity,
    )
  }
}

function checkDaikonAndTub() {
  const source = JSON.parse(
    fs.readFileSync(path.join(root, 'data/daikon-acquisition.json'), 'utf8'),
  )
  const daikon = data.items.find((item) => item.category === 'food' && item.id === '07')
  assert.equal(daikon.exchangeFishId, source.fish.idHex)
  assert.equal(daikon.daikonExchange.mealSlotsWritten, 16)
  assert.equal(daikon.daikonExchange.fishConsumed, true)
  assert.equal(daikon.daikonExchange.repeatable, false)
  assert(
    daikon.playerUse.useLocations.some(
      (location) =>
        location.stage === 3 && location.tileX === 21 && location.tileY === 82 && location.image,
    ),
  )
  const tubSource = JSON.parse(
    fs.readFileSync(path.join(root, 'data/tub-acquisition.json'), 'utf8'),
  )
  const tub = data.items.find((item) => item.category === 'general_tool' && item.id === '01')
  assert.equal(tub.exchangeFishId, tubSource.fish.idHex)
  assert.equal(tub.tubExchange.fishConsumed, true)
  assert.equal(tub.tubExchange.repeatable, false)
  assert(
    tub.playerUse.useLocations.some(
      (location) =>
        location.stage === 2 && location.tileX === 87 && location.tileY === 27 && location.image,
    ),
  )
  for (const lang of ['en', 'ja', 'th'])
    assert.equal(tub.playerUse.summary[lang], tubSource.playerSummary[lang])
}

function checkCompass(netSource) {
  const source = JSON.parse(fs.readFileSync(path.join(root, 'data/compass-locations.json'), 'utf8'))
  const compass = data.items.find((item) => item.category === 'general_tool' && item.id === '0E')
  assert.deepEqual(compass.playerUse.useLocations, source.items['general_tool:0E'])
  assert.deepEqual(
    compass.playerUse.useLocations.map((location) => location.stage),
    [1, 2, 3, 4, 5],
  )
  assert.deepEqual(compass.playerUse.summary, source.playerSummary)
  for (const location of compass.playerUse.useLocations) {
    assert.deepEqual(
      [location.tileX, location.tileY],
      netSource.items['0E'].trace.area1to6Targets[String(location.stage)],
    )
    assert.equal(location.kind, 'compass_exit')
  }
}
