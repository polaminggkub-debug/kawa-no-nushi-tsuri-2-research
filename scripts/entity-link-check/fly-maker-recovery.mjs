import assert from 'node:assert/strict'
import fs from 'node:fs'
import { flyMakerLocation } from '../../src/pages/shops/fly-maker-location.js'
import { stateParams } from '../../src/pages/shops/map-navigation.js'
import { shopsUrl } from '../../src/pages/shops/shop-catalogue.js'
import { root, unescapeHtml } from './shared.mjs'

const previous = { location: globalThis.location, document: globalThis.document }
globalThis.location = new URL('https://example.test/catalogue/shops.html#fly-maker-location')
globalThis.document = { querySelector: () => ({ value: 'town' }) }
try {
  for (const lang of ['en', 'ja', 'th']) for (const stage of [4, 5, 6]) checkRecovery(lang, stage)
} finally {
  for (const [key, value] of Object.entries(previous)) {
    if (value === undefined) delete globalThis[key]
    else globalThis[key] = value
  }
}

function checkRecovery(lang, stage) {
  const ctx = context(lang, stage)
  const html = flyMakerLocation(ctx, { stage, interactions: [] })
  const targets = [...html.matchAll(/href="([^"]+)"/g)].map(
    (match) => new URL(unescapeHtml(match[1]), location),
  )
  assert.match(html, /data-maker-recovery/)
  const labels = {
    en: [
      ['Mayfly', 'Caddis', 'Terrestrial'],
      ['Diptera', 'Stonefly', 'Terrestrial'],
    ],
    ja: [
      ['メイフライ', 'カディス', 'テレストリアル'],
      ['ディプテラ', 'ストーンフライ', 'テレストリアル'],
    ],
    th: [
      ['เมย์ฟลาย', 'แคดดิส', 'แมลงบก'],
      ['ดิปเทอรา', 'สโตนฟลาย', 'แมลงบก'],
    ],
  }
  const anchors = [
    ...html.matchAll(/<a[^>]*data-maker-recovery-stage="([12])"[^>]*>([\s\S]*?)<\/a>/g),
  ]
  assert.equal(anchors.length, 2)
  for (const [, targetStage, label] of anchors)
    for (const family of labels[lang][Number(targetStage) - 1]) assert(label.includes(family))
  const uncertainty = {
    en: /No maker location is verified here/,
    ja: /未確認/,
    th: /ยังไม่มีตำแหน่งคนทำฟลายที่ยืนยัน/,
  }
  assert.match(html, uncertainty[lang])
  for (const target of targets) checkTarget(ctx, target, lang)
  assert.deepEqual(
    targets.map((target) => target.searchParams.get('stage')).sort(),
    ['1', '2'],
    `${lang}/${stage}: recovery must offer both recorded family menus, not force Area2`,
  )
}

function context(lang, stage) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const ctx = {
    lang,
    flyMakerIntent: true,
    startStage: stage,
    startPlace: 'town',
    targetCategory: 'fly',
    targetId: '01',
    selectedFish: '06',
    selectedRig: 'fly',
    returnRoute: `item${suffix}.html?category=fly&id=01&return=maps${suffix}.html%3Fstage%3D${stage}`,
    focusedEntrance: null,
    pages: { shops: { [lang]: `shops${suffix}.html` } },
    $: (id) => ({
      value: id === 'stage-select' ? String(stage) : id === 'category-select' ? 'fly' : '',
    }),
    esc: (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;'),
  }
  ctx.stateParams = (overrides) => stateParams(ctx, overrides)
  ctx.shopsUrl = (overrides) => shopsUrl(ctx, overrides)
  return ctx
}

function checkTarget(ctx, target, lang) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  assert(target.pathname.endsWith(`/shops${suffix}.html`))
  for (const [key, value] of Object.entries({
    place: 'town',
    maker: '1',
    entrance: '1',
    category: 'fly',
    id: '01',
    fish: '06',
    route: 'fly',
    return: ctx.returnRoute,
  }))
    assert.equal(target.searchParams.get(key), value, `recovery dropped ${key}`)
  assert.equal(target.hash, '#fly-maker-location')
}

const proof = JSON.parse(fs.readFileSync(`${root}/data/fly-maker-access-rom.json`))
assert.deepEqual(proof.accessByStage['1'].familyNames, ['Mayfly', 'Caddis', 'Terrestrial'])
assert.deepEqual(proof.accessByStage['2'].familyNames, ['Diptera', 'Stonefly', 'Terrestrial'])
assert.deepEqual(Object.keys(proof.accessByStage).sort(), ['1', '2', '3'])
console.log(
  'PASS: maker recovery offers both verified family menus in EN/JA/TH without inventing Area4–6 makers or dropping target context.',
)
