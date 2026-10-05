import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { data, root } from './shared.mjs'

export const evidence = readJson('data/fly-maker-access-rom.json')
const locations = readJson('data/shop-locations-rom.json')
const maps = readJson('catalogue/maps/rom-map-manifest.json')
const attach = createRequire(import.meta.url)('../attach_fly_maker_access.cjs')
const familyCounts = { 0: 40, 1: 32, 2: 21, 3: 21, 4: 16 }
const stageFamilies = { 1: [0, 1, 4], 2: [2, 3, 4], 3: [0, 1, 4] }

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
}

function checkRomIdentity() {
  assert.equal(evidence.schemaVersion, 1)
  assert.deepEqual(evidence.rom, {
    sizeBytes: 1_572_864,
    sha1: 'c2103dd94e2a1a65a495fc02adc2e7d040f31212',
    sha256: 'e0594921a5a2ef1a2613b9d2e29fed066569e3793393c591bf4c4968a54c0b49',
  })
  assert.equal(evidence.familyOptionsByParity.selector, '$085A & 1')
  assert.match(evidence.familyOptionsByParity.evenLabelCapture, /not a natural Area 2 walk/)
}

function checkRomFingerprints() {
  const rows = new Map(evidence.sources.fingerprints.map((entry) => [entry.cpu, entry]))
  const expected = [
    [
      '$00:CF05',
      '0x004F05',
      'c9 10 00 d0 13 ad 5a 08 c9 0a 00 b0 05 a9 03 00 80 03 a9 07 00 4c 25 cf',
    ],
    ['$03:8085', '0x018085', 'c9 03 00 d0 06 20 17 95 4c bc 80'],
    ['$03:80B1', '0x0180B1', 'c9 07 00 d0 06 20 e1 86 4c bc 80'],
    ['$03:9521', '0x019521', 'ad 5a 08 29 01 00 f0 08 a9 21 00 8d 4e 08 80 06 a9 22 00 8d 4e 08'],
    ['$00:9FBD', '0x001FBD', '0c 00 b6 00'],
    ['$00:9FD5', '0x001FD5', '5b 00 19 00'],
    ['$00:A04D', '0x00204D', '07 00 1d 00'],
  ]
  for (const [cpu, offset, bytes] of expected)
    assert.deepEqual(rows.get(cpu), { cpu, fileOffset: offset, bytes }, `ROM bytes ${cpu}`)
}

function checkTownDispatch() {
  assert.equal(evidence.townSlot10Routing.length, 6)
  for (const town of evidence.townSlot10Routing) {
    const isMaker = town.townMapId < 10
    assert.equal(town.slot10Handler, isMaker ? '03:9517' : '03:86E1')
    assert.equal(town.slot10Mode, isMaker ? 3 : 7)
  }
  const area2 = evidence.townSlot10Routing.find((town) => town.townMapId === 8)
  assert.deepEqual([area2.pointer, area2.pointerFileOffset], ['0xC0C4', '0x003D84'])
  assert.deepEqual(
    [area2.slot10FileOffset, area2.slot10Tile.x, area2.slot10Tile.y],
    ['0x0040D4', 5, 24],
  )
  assert.equal(
    evidence.townSlot10Routing.find((town) => town.townMapId === 10).slot10Handler,
    '03:86E1',
  )
}

function checkAccessEvidence() {
  assert.deepEqual(Object.keys(evidence.accessByFamily).sort(), ['0', '1', '2', '3', '4'])
  assert.deepEqual(Object.keys(evidence.accessByStage).sort(), ['1', '2', '3'])
  for (const [stageText, families] of Object.entries(stageFamilies)) {
    const stage = Number(stageText)
    const access = evidence.accessByStage[stageText]
    assert.deepEqual(access.familyIds, families)
    assert.equal(access.stage, stage)
    assert.equal(access.townMapId, stage + 6)
    assert.equal(access.interactionSlotHex, '10')
    assert.equal(access.entrance.ordinal, 1)
    assert.equal(access.entrance.entranceNumber, 2)
    assert.deepEqual(
      [
        access.entrance.townArrival.mapId,
        access.entrance.townArrival.x,
        access.entrance.townArrival.y,
      ],
      [stage + 6, 7, 29],
    )
    assert.equal(access.limits.naturalWalkVerified, false)
    assert.equal(access.limits.storyUnlockVerified, false)
  }
  assert.deepEqual(
    [evidence.accessByStage['3'].makerTile.x, evidence.accessByStage['3'].makerTile.y],
    [10, 22],
  )
}

function checkLocationSource(stage) {
  const access = evidence.accessByStage[String(stage)]
  const area = locations.areas.find((entry) => Number(entry.outdoorArea) === stage)
  const maker = area.interactions.find((entry) => entry.handler === '03:9517')
  const entrance = area.entrances.find((entry) => entry.ordinal === 1)
  const record = evidence.townSlot10Routing.find((entry) => entry.townMapId === access.townMapId)
  assert.equal(area.townMapId, access.townMapId)
  assert.deepEqual(maker.townTile, access.makerTile)
  assert.equal(maker.source.pointerFileOffset, record.pointerFileOffset)
  assert.equal(maker.source.coordinateFileOffset, record.slot10FileOffset)
  assert.deepEqual(entrance.fieldTile, access.entrance.fieldTile)
  assert.deepEqual(entrance.townArrival, access.entrance.townArrival)
  assert(maps.mapSets[`mapSet0${stage}`])
}

function checkAccessAgainstShopData() {
  for (const stage of [1, 2, 3]) {
    checkLocationSource(stage)
    const area = locations.areas.find((entry) => Number(entry.outdoorArea) === stage)
    assert.equal(area.townTerrain.image, `maps/rom-town-0${stage + 6}.png`)
    assert.equal(area.townTerrain.spritesIncluded, false)
  }
}

export function menuItems() {
  return data.items.filter((item) => item.flyMakerMenuChoice)
}

function availableAccess(family) {
  return Object.values(evidence.accessByStage).filter((entry) => entry.familyIds.includes(family))
}

function checkPublishedItems() {
  const items = menuItems()
  assert.equal(items.length, 130)
  const counts = Object.fromEntries(Object.keys(familyCounts).map((id) => [id, 0]))
  for (const item of items) {
    const family = item.rawFields['+0']
    const choice = item.flyMakerMenuChoice
    counts[family] += 1
    assert.deepEqual(choice.access, evidence.accessByFamily[String(family)])
    assert.deepEqual(choice.availableAccess, availableAccess(family))
  }
  assert.deepEqual(counts, familyCounts)
  for (const id of ['25', '26', '66', '67']) {
    const wing = data.items.find((item) => item.category === 'fly_wing' && item.id === id)
    assert(wing && !wing.flyMakerMenuChoice?.access, `Unverified wing acquired access: ${id}`)
  }
}

function checkAttacher() {
  const items = menuItems().map((item) => ({
    category: item.category,
    id: item.id,
    rawFields: { ...item.rawFields },
    flyMakerMenuChoice: {
      ...item.flyMakerMenuChoice,
      access: undefined,
      availableAccess: undefined,
    },
  }))
  attach(root, { items })
  assert.equal(items.filter((item) => item.flyMakerMenuChoice.availableAccess?.length).length, 130)
  for (const item of items) {
    const source = data.items.find(
      (entry) => entry.category === item.category && entry.id === item.id,
    )
    assert.deepEqual(item.flyMakerMenuChoice.access, source.flyMakerMenuChoice.access)
    assert.deepEqual(
      item.flyMakerMenuChoice.availableAccess,
      source.flyMakerMenuChoice.availableAccess,
    )
  }
}

export function checkFlyMakerAccessEvidence() {
  checkRomIdentity()
  checkRomFingerprints()
  checkTownDispatch()
  checkAccessEvidence()
  checkAccessAgainstShopData()
  checkPublishedItems()
  checkAttacher()
}
