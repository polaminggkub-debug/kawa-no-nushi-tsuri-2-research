import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import {
  data,
  locations,
  render,
  renderCatalogue,
  root,
  unescapeHtml,
  validate,
} from './shared.mjs'

const locales = ['en', 'ja', 'th']
const quest = readJson('data/quest-tool-use.json')
const magnet = readJson('data/magnet-story-gate.json')
const eelId = '3B'
const eel = locations.fish[eelId]
const copy = {
  en: {
    condition: 'Once this request appears',
    map: 'Area 6 point · X 41, Y 8',
    limit: 'Who to give the landed eel to, or what reward follows, is not yet verified.',
    magnet: 'Magnet heading',
  },
  ja: {
    condition: 'この依頼を見たら',
    map: 'エリア6の地点 · X 41, Y 8',
    limit: '釣った後の渡す相手や報酬は未検証です。',
    magnet: '磁石のオオウナギ項目',
  },
  th: {
    condition: 'ถ้าพบข้อความนี้แล้ว',
    map: 'ดูจุดด่าน 6 · X 41, Y 8',
    limit: 'ยังไม่ได้พิสูจน์ว่าตกได้แล้วต้องส่งให้ใครหรือรับรางวัลอย่างไร',
    magnet: 'แม่เหล็ก',
  },
}

checkRomEvidence()
checkResearchDetails()
for (const locale of locales) await checkCatalogueCard(locale)
for (const locale of locales) await checkLocale(locale)
console.log(
  'Postcard action PASS: catalogue and detail actions, three localized safe links, conditional caveats and collapsed ROM evidence agree with the fish and magnet traces.',
)

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
}

function checkRomEvidence() {
  const story = magnet.storyGate
  const target = magnet.area6MagnetTarget
  assert.equal(quest.rom.sha1, magnet.rom.sha1)
  assert.equal(magnet.rom.sha1, locations.rom.sha1)
  assert.equal(story.prerequisiteMask, '0x02')
  assert.equal(story.headingMask, '0x04')
  assert.equal(story.recordArray.entryCount, 66)
  assert.equal(story.recordArray.thresholdNonzeroEntries, 65)
  assert.equal(story.magnetConsumer.condition, '$0C18 & 0x04')
  assert.equal(target.fishId, `0x${eelId}`)
  assert.equal(target.fishNameJa, eel.nameJa)
  assert.deepEqual([target.x, target.y], [41, 8])
  checkEelPoint()
}

function checkEelPoint() {
  const stage = eel.locations.find((entry) => Number(entry.stage) === 6)
  const point = stage?.points.find((entry) => entry.x === 41 && entry.y === 8)
  assert(point, 'Fish-location tables must place ID 3B at Area 6 (41,8)')
  assert.equal(stage.evidence.type, 'rom_spawn_tables')
  assert.equal(stage.maps[0].tileBounds.xMin, 41)
  assert.equal(stage.maps[0].tileBounds.yMin, 8)
  const col = Math.floor((point.x * 16 + 8) / 384) + 1
  const row = Math.floor((point.y * 16 + 8) / 384) + 1
  assert.equal(`s6-c${col}-r${row}`, 's6-c2-r1')
}

function checkResearchDetails() {
  const itemUse = quest.items['06']
  assert(itemUse.evidence.sources.includes('docs/magnet-story-gate-research.md'))
  assert(itemUse.evidence.sources.includes('data/magnet-story-gate.json'))
  for (const locale of locales) {
    const notes = itemUse.evidenceNotes[locale].join(' ')
    assert(/0x41|65/.test(notes), `${locale} evidence must preserve the 65-record threshold`)
    assert(notes.includes('$0C18') && notes.includes('$0DC8') && notes.includes('$0E4A'))
    assert(notes.includes('DEB9'), `${locale} evidence must point to the flag-write instruction`)
    assert(notes.includes('3B') && notes.includes('(41,8)'))
  }
}

async function checkCatalogueCard(locale) {
  const item = data.items.find((entry) => entry.category === 'general_tool' && entry.id === '06')
  assert(item, 'Catalogue must contain postcard item general_tool:06')
  for (const sourceStage of [1, 4, 6]) {
    const query = new URLSearchParams({
      category: 'general_tool',
      stage: String(sourceStage),
      fish: '06',
      route: 'float',
      sort: 'id',
    })
    const { runtime, url } = await renderCatalogue(locale, `?${query}#catalogue`)
    const card = runtime.renderItemCard(item)
    const action = extractCatalogueAction(card, locale, sourceStage)
    checkCatalogueCopy(action, locale)
    checkCatalogueLinks(action, url, locale, sourceStage)
    checkCatalogueActionScope(runtime, item, card, locale, sourceStage)
    validate(action, url)
  }
}

function extractCatalogueAction(card, locale, stage) {
  const actions =
    card.match(/<aside\b(?=[^>]*data-quest-next-action="postcard-eel")[^>]*>[\s\S]*?<\/aside>/g) ||
    []
  assert.equal(
    actions.length,
    1,
    `${locale}/source stage ${stage}: postcard catalogue action must render exactly once`,
  )
  assert(
    card.includes('class="item-card'),
    `${locale}: action must belong to a catalogue item card`,
  )
  return actions[0]
}

function checkCatalogueCopy(action, locale) {
  const text = unescapeHtml(action)
  const unresolved = {
    en: ['Who to give the landed eel to', 'what reward follows', 'not yet verified'],
    ja: ['渡す相手や報酬', '未検証'],
    th: ['ยังไม่ได้พิสูจน์', 'ให้ใคร', 'รางวัล'],
  }
  assert(
    text.includes(copy[locale].condition),
    `${locale}: card advice must be conditional on seeing the request`,
  )
  for (const phrase of unresolved[locale])
    assert(text.includes(phrase), `${locale}: card must not promise a hand-in recipient or reward`)
  assert(text.includes(copy[locale].map))
  assert(text.includes('41') && text.includes('8'), `${locale}: show the supported eel coordinates`)
}

function checkCatalogueLinks(action, base, locale, sourceStage) {
  const profileAction = action.match(
    /<p><a class="route-button" data-quest-fish-profile\b[^>]*>[\s\S]*?<\/a><\/p>/,
  )?.[0]
  const mapAction = action.match(
    /<p><a class="route-button" data-quest-fish-map\b[^>]*>[\s\S]*?<\/a><\/p>/,
  )?.[0]
  assert(profileAction, `${locale}: profile link must be a separate button-sized action`)
  assert(mapAction, `${locale}: map link must be a separate button-sized action`)
  assert.notEqual(profileAction, mapAction, `${locale}: map/profile actions must not share one row`)
  const profile = linkedUrl(action, 'data-quest-fish-profile', base)
  const map = linkedUrl(action, 'data-quest-fish-map', base)
  const suffix = locale === 'en' ? '' : `.${locale}`
  const directory = base.pathname.slice(0, base.pathname.lastIndexOf('/') + 1)
  checkLocalTarget(profile, `${directory}fish${suffix}.html`, base)
  checkLocalTarget(map, `${directory}maps${suffix}.html`, base)
  assert.equal(profile.searchParams.get('id'), eelId)
  assert.equal(profile.searchParams.get('stage'), '6')
  assert.equal(map.searchParams.get('fish'), eelId)
  assert.equal(map.searchParams.get('stage'), '6')
  assert.equal(map.searchParams.get('section'), 's6-c2-r1')
  assert.equal(map.hash, '#map-view')
  for (const target of [profile, map]) {
    const returned = new URL(target.searchParams.get('return'), target)
    assert.equal(returned.pathname, base.pathname, `${locale}: preserve source catalogue page`)
    assert.equal(returned.searchParams.get('category'), 'general_tool')
    assert.equal(returned.searchParams.get('stage'), String(sourceStage))
    assert.equal(returned.searchParams.get('fish'), '06')
    assert.equal(returned.searchParams.get('route'), 'float')
    assert.equal(returned.searchParams.get('sort'), 'id')
    assert.equal(returned.hash, '#catalogue')
  }
}

function checkCatalogueActionScope(runtime, item, card, locale, sourceStage) {
  const marker = 'data-quest-next-action="postcard-eel"'
  for (const other of [
    data.items.find((entry) => entry.category === 'general_tool' && entry.id === '07'),
    data.items.find((entry) => entry.category === 'bait' && entry.id === '06'),
  ]) {
    assert(other, 'Scope fixture item is missing')
    assert(
      !runtime.renderItemCard(other).includes(marker),
      `${locale}/source stage ${sourceStage}: action must be scoped to general_tool:06`,
    )
  }

  const originalLocations = runtime.fishLocations
  try {
    runtime.fishLocations = Object.fromEntries(
      Object.entries(originalLocations).filter(([fishId]) => fishId !== eelId),
    )
    assert(
      !runtime.renderItemCard(item).includes(marker),
      `${locale}: missing fish-location dataset must not invent an eel action`,
    )
    runtime.fishLocations = {
      ...originalLocations,
      [eelId]: {
        ...originalLocations[eelId],
        locations: originalLocations[eelId].locations.map((entry) =>
          Number(entry.stage) === 6
            ? { ...entry, points: entry.points.filter((point) => point.x !== 41 || point.y !== 8) }
            : entry,
        ),
      },
    }
    assert(
      !runtime.renderItemCard(item).includes(marker),
      `${locale}: missing Area 6 (41,8) point must not invent an eel action`,
    )
  } finally {
    runtime.fishLocations = originalLocations
  }
  assert.equal((card.match(new RegExp(marker, 'g')) || []).length, 1)
}

async function checkLocale(locale) {
  const suffix = locale === 'en' ? '' : `.${locale}`
  const returnPage = `index${suffix}.html?category=general_tool#catalogue`
  const detailQuery = new URLSearchParams({
    category: 'general_tool',
    id: '06',
    return: returnPage,
  })
  const detail = await render('item', locale, detailQuery)
  const panel = extractPanel(detail.html)
  assert(panel, `${locale}: postcard 06 player action is missing`)
  checkPlayerCopy(panel, locale)
  checkDetailLinks(panel, detail.url, locale)
  checkEvidencePlacement(detail.html, panel, locale)
  const sentQuery = new URLSearchParams({ category: 'general_tool', id: '07' })
  const sentDetail = await render('item', locale, sentQuery)
  assert(!sentDetail.html.includes('data-quest-next-action="postcard-eel"'))
}

function extractPanel(html) {
  const panels =
    html.match(/<aside\b(?=[^>]*data-quest-next-action="postcard-eel")[^>]*>[\s\S]*?<\/aside>/g) ||
    []
  assert.equal(panels.length, 1, 'Postcard action must render exactly once')
  return panels[0]
}

function checkPlayerCopy(panel, locale) {
  const text = unescapeHtml(panel)
  assert(
    text.includes(copy[locale].condition),
    `${locale}: advice must depend on seeing the doctor's request`,
  )
  assert(text.includes(copy[locale].map))
  assert(text.includes(copy[locale].limit), `${locale}: do not promise quest completion or reward`)
  assert(text.includes(copy[locale].magnet))
  assert(!/\b65\b|0x41/.test(text), `${locale}: keep the hidden gate out of player-facing advice`)
}

function checkDetailLinks(panel, base, locale) {
  const profile = linkedUrl(panel, 'data-quest-fish-profile', base)
  const map = linkedUrl(panel, 'data-quest-fish-map', base)
  const suffix = locale === 'en' ? '' : `.${locale}`
  const directory = base.pathname.slice(0, base.pathname.lastIndexOf('/') + 1)
  checkTarget(profile, `${directory}fish${suffix}.html`, base)
  checkTarget(map, `${directory}maps${suffix}.html`, base)
  assert.equal(profile.searchParams.get('id'), eelId)
  assert.equal(map.searchParams.get('fish'), eelId)
  assert.equal(map.searchParams.get('section'), 's6-c2-r1')
  assert.equal(map.searchParams.get('stage'), '6')
  assert.equal(map.hash, '#map-view')
}

function linkedUrl(panel, marker, base) {
  const href = panel.match(new RegExp(`${marker} href="([^"]+)"`))?.[1]
  assert(href, `Missing ${marker}`)
  return new URL(unescapeHtml(href), base)
}

function checkTarget(target, pathname, detailUrl) {
  const back = checkLocalTarget(target, pathname, detailUrl)
  assert.equal(back.searchParams.get('category'), 'general_tool')
  assert.equal(back.searchParams.get('id'), '06')
}

function checkLocalTarget(target, pathname, sourceUrl) {
  assert.equal(target.origin, sourceUrl.origin)
  assert.equal(target.pathname, pathname)
  const returned = target.searchParams.get('return')
  assert(returned, `Missing safe item 06 return from ${target.pathname}`)
  const back = new URL(returned, target)
  assert.equal(back.origin, sourceUrl.origin)
  return back
}

function checkEvidencePlacement(html, panel, locale) {
  const panelStart = html.indexOf(panel)
  const evidenceStart = html.indexOf('<details class="evidence">')
  assert(
    panelStart >= 0 && evidenceStart > panelStart,
    `${locale}: ROM evidence must remain below the player action`,
  )
  const evidence = unescapeHtml(html.slice(evidenceStart))
  for (const note of quest.items['06'].evidenceNotes[locale])
    assert(evidence.includes(note), `${locale}: missing technical note in collapsed evidence`)
  for (const source of quest.items['06'].evidence.sources)
    assert(evidence.includes(source), `${locale}: missing research source ${source}`)
}
