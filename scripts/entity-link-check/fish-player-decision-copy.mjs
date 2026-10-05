import assert from 'node:assert/strict'
import fs from 'node:fs'
import { copy_en } from '../../src/pages/fish/copy_en.js'
import { copy_ja } from '../../src/pages/fish/copy_ja.js'
import { copy_th } from '../../src/pages/fish/copy_th.js'
import { distinctFishNames } from '../../src/pages/fish/fish-names.js'
import { render as renderFishProfile } from '../../src/pages/fish/render.js'
import { renderCompatibility } from '../../src/pages/fish/shopping.js'
import { localizedFishName, matchingItems } from '../../src/pages/fish/tackle.js'
import { renderFlyFallback } from '../../src/pages/fish/fly-backup.js'
import { speciesRecord } from '../../src/pages/maps/fish-search.js'
import { setupDataAccess } from '../../src/pages/equipment/setup-data-access.js'
import { fishName as localizedItemFishName } from '../../src/pages/item/names.js'
import { data, locations, root } from './shared.mjs'

const locales = { en: copy_en, ja: copy_ja, th: copy_th }
const earlierThaiDuplicateIds = [
  '06',
  '09',
  '0A',
  '0C',
  '0D',
  '1E',
  '28',
  '2A',
  '2C',
  '31',
  '3A',
  '42',
]
const acceptance = JSON.parse(fs.readFileSync(`${root}/data/fish-acceptance.json`, 'utf8'))

checkThaiFishNames()
checkEelNameSurfaces()
const flyProfileIds = checkFlyProfileData()
for (const locale of Object.keys(locales)) checkLocalizedFlyGroups(locale, flyProfileIds)
checkBackupActionOpensDetails()

function checkThaiFishNames() {
  const fish = data.fishVisuals
  const originals = captureThaiNameArrays(fish)
  for (const [id, profile] of Object.entries(fish)) {
    const context = makeNameContext('th')
    const headline = localizedFishName(context, profile, id)
    assertUniqueNameParts(headline, `${id}: Thai headline`)
    const aliases = fishAliases(profile, headline)
    const headlineParts = new Set(nameParts(headline).map(nameKey))
    for (const alias of aliases)
      assert(!headlineParts.has(nameKey(alias)), `${id}: repeated headline alias ${alias}`)
  }
  for (const id of earlierThaiDuplicateIds)
    assertUniqueNameParts(
      localizedFishName(makeNameContext('th'), fish[id], id),
      `${id}: prior duplicate`,
    )
  assert.deepEqual(captureThaiNameArrays(fish), originals, 'Name cleanup mutated source aliases')
  const koiAliases = fishAliases(
    fish['0D'],
    localizedFishName(makeNameContext('th'), fish['0D'], '0D'),
  )
  assert(koiAliases.includes('コイ'), 'Keep the Japanese ROM name as a useful alias')
  assert(koiAliases.includes('Koi'), 'Keep the Latin name as a useful alias')
}

function checkEelNameSurfaces() {
  const id = '3A'
  const expected = 'อูนางิ / ปลาไหลญี่ปุ่น'
  const visual = data.fishVisuals[id]
  assert(visual, 'Missing eel profile 3A')
  assert.equal(
    localizedFishName(makeNameContext('th'), visual, id),
    expected,
    'Fish detail must show the deduplicated Thai eel name',
  )

  const aliases = fishAliases(visual, expected)
  assert(aliases.includes('ウナギ'), 'Fish detail must retain the Japanese eel alias')
  assert(aliases.includes('Unagi'), 'Fish detail must retain the Latin eel alias')

  const mapEntry = speciesRecord({ lang: 'th' }, id, locations.fish[id], visual)
  assert.equal(mapEntry.name, expected, 'Map species label must match the fish detail')
  for (const alias of ['ウナギ', 'Unagi', 'อูนางิ / ปลาไหลญี่ปุ่น', 'อูนางิ'])
    assert(
      mapEntry.aliases.includes(alias.toLocaleLowerCase()),
      `Map lost eel search alias ${alias}`,
    )

  assert.equal(
    localizedItemFishName({ lang: 'th' }, id, data.fishVisuals),
    expected,
    'Item detail fish label must match the fish detail',
  )

  const equipment = { lang: 'th', fishVisuals: data.fishVisuals }
  setupDataAccess(equipment)
  assert.equal(equipment.fishName(id), expected, 'Equipment fish label must match the fish detail')
  const search = equipment.fishSearchText(id)
  for (const alias of ['ウナギ', 'Unagi', 'อูนางิ / ปลาไหลญี่ปุ่น', 'อูนางิ'])
    assert(search.includes(alias.toLocaleLowerCase()), `Equipment fish search lost alias ${alias}`)
}

function makeNameContext(locale) {
  return { locale, copy: locales[locale] }
}

function captureThaiNameArrays(fish) {
  return Object.fromEntries(
    Object.entries(fish).map(([id, profile]) => [
      id,
      {
        nameTh: profile.nameTh,
        nameThVariants: structuredClone(profile.nameThVariants || []),
        nameLatinVariants: structuredClone(profile.nameLatinVariants || []),
      },
    ]),
  )
}

function fishAliases(profile, headline) {
  return distinctFishNames(
    [
      profile.nameJa,
      profile.nameEn,
      profile.nameLatin,
      ...(profile.nameLatinVariants || []),
      ...(profile.nameThVariants || []),
    ],
    headline,
  )
}

function nameParts(value) {
  return String(value || '')
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean)
}

function nameKey(value) {
  return String(value || '')
    .normalize('NFKC')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase()
}

function assertUniqueNameParts(value, label) {
  const keys = nameParts(value).map(nameKey)
  assert.equal(new Set(keys).size, keys.length, `${label}: duplicate slash-separated name`)
}

function checkFlyProfileData() {
  const ids = acceptance.fish_profiles
    .filter((profile) => profile.matching_fly_body_ids.length > 0)
    .map((profile) => profile.id_hex)
    .sort()
  const backupIds = Object.keys(data.flyBackupChoices.profiles).sort()
  assert.equal(ids.length, 33, 'Expected 33 fly profile-mask candidate fish')
  assert.deepEqual(backupIds, ids, 'Each fly candidate profile needs its researched backup set')
  return ids
}

function checkLocalizedFlyGroups(locale, fishIds) {
  for (const fishId of fishIds) {
    const ctx = makeCopyContext(locale, fishId)
    const entries = matchingItems(ctx, data.items)
    const flyIds = entries
      .filter((entry) => entry.item.category === 'fly')
      .map((entry) => entry.item.id)
      .sort()
    const expected = profileAcceptance(fishId).matching_fly_body_ids.slice().sort()
    assert.deepEqual(flyIds, expected, `${locale}/${fishId}: profile-mask body count`)
    checkFlyGroupMarkup(ctx, entries, fishId, expected.length)
    checkOrdinaryGroupMarkup(ctx, entries)
    checkBackupTarget(ctx, fishId)
  }
}

function makeCopyContext(locale, fishId) {
  const suffix = locale === 'en' ? '' : `.${locale}`
  return {
    locale,
    id: fishId,
    copy: locales[locale],
    escapeHtml,
    localizedItemName: (item) =>
      locale === 'th'
        ? item.nameTh || item.playerUse?.displayName?.th || item.nameJa || item.nameEn || item.id
        : locale === 'ja'
          ? item.nameJa || item.nameEn || item.id
          : item.nameEn || item.nameJa || item.id,
    itemLink: ({ item }) => `<span data-item="${item.category}:${item.id}"></span>`,
    itemPath: () => `item${suffix}.html`,
    currentFishPath: (stage) => `fish${suffix}.html?id=${fishId}&stage=${stage}`,
  }
}

function profileAcceptance(fishId) {
  const profile = acceptance.fish_profiles.find((entry) => entry.id_hex === fishId)
  assert(profile, `Missing ROM acceptance profile ${fishId}`)
  return profile
}

function checkFlyGroupMarkup(ctx, entries, fishId, count) {
  const html = renderCompatibility(ctx, entries, '1')
  const group = compatibilityGroup(html, 'fly')
  assert(group, `${ctx.locale}/${fishId}: fly body group missing`)
  assert(
    group.includes(ctx.copy.flyCandidates),
    `${ctx.locale}/${fishId}: profile-only title missing`,
  )
  assert(group.includes(`<span class="muted">${count}</span>`), `${ctx.locale}/${fishId}: count`)
  assert(
    group.includes('data-fly-profile-only'),
    `${ctx.locale}/${fishId}: profile-only explanation missing`,
  )
  assert(
    group.includes(ctx.copy.flyProfileOnly),
    `${ctx.locale}/${fishId}: actionable limitation missing`,
  )
  assert(group.includes('data-fly-backup-link href="#fly-backup"'))
  assert(
    group.includes(ctx.copy.flyBackupAction),
    `${ctx.locale}/${fishId}: backup action copy missing`,
  )
}

function checkOrdinaryGroupMarkup(ctx, entries) {
  const html = renderCompatibility(ctx, entries, '1')
  for (const category of ['bait', 'lure']) {
    const group = compatibilityGroup(html, category)
    if (!group) continue
    assert(!group.includes('data-fly-profile-only'), `${ctx.locale}/${category}: fly note leaked`)
    assert(!group.includes('data-fly-backup-link'), `${ctx.locale}/${category}: fly action leaked`)
  }
}

function compatibilityGroup(html, category) {
  return html.match(
    new RegExp(
      `<details class="detail-section" data-compatible-group="${category}">([\\s\\S]*?)<\\/details>`,
    ),
  )?.[1]
}

function checkBackupTarget(ctx, fishId) {
  const backup = renderFlyFallback(ctx, data.items, '1', data.flyBackupChoices)
  assert(
    backup.includes('<details id="fly-backup"'),
    `${ctx.locale}/${fishId}: backup target missing`,
  )
  assert.equal([...backup.matchAll(/class="detail-section fly-backup"/g)].length, 3)
  const group = renderCompatibility(ctx, matchingItems(ctx, data.items), '1')
  assert(group.includes('href="#fly-backup"'), `${ctx.locale}/${fishId}: no path to backup target`)
}

function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[char],
  )
}

function checkBackupActionOpensDetails() {
  for (const locale of Object.keys(locales)) checkBackupActionForLocale(locale)
}

function checkBackupActionForLocale(locale) {
  const fishId = '01'
  const stage = '1'
  const clickLink = createClickLink()
  const backupDetails = createBackupDetails()
  const areaSelect = { addEventListener() {} }
  const oldDocument = Object.getOwnPropertyDescriptor(globalThis, 'document')
  const oldLocation = Object.getOwnPropertyDescriptor(globalThis, 'location')
  globalThis.document = createPageDocument(clickLink, backupDetails, areaSelect)
  globalThis.location = { hash: '' }
  try {
    const ctx = makeRenderContext(locale, fishId, stage, clickLink)
    renderFishProfile(ctx, data, locations)
    assert(
      ctx.page.innerHTML.includes('data-fly-backup-link'),
      `${locale}: fish page action missing`,
    )
    assert(
      ctx.page.innerHTML.includes('<details id="fly-backup"'),
      `${locale}: fish page target missing`,
    )
    assert.equal(typeof clickLink.listener, 'function', `${locale}: action handler not bound`)
    clickLink.listener()
    assert.equal(backupDetails.open, true, `${locale}: backup action did not expand details`)
  } finally {
    restoreGlobal('document', oldDocument)
    restoreGlobal('location', oldLocation)
  }
}

function createClickLink() {
  return {
    listener: null,
    addEventListener(eventName, callback) {
      if (eventName === 'click') this.listener = callback
    },
  }
}

function createBackupDetails() {
  return {
    open: false,
    setAttribute(name) {
      if (name === 'open') this.open = true
    },
  }
}

function createPageDocument(clickLink, backupDetails, areaSelect) {
  return {
    title: '',
    getElementById(id) {
      return id === 'fly-backup' ? backupDetails : id === 'shopping-area' ? areaSelect : null
    },
  }
}

function makeRenderContext(locale, fishId, stage, clickLink) {
  const ctx = makeCopyContext(locale, fishId)
  ctx.page = {
    innerHTML: '',
    querySelector: (selector) => (selector === '[data-fly-backup-link]' ? clickLink : null),
  }
  ctx.requestedStage = stage
  ctx.requestedMethod = ''
  ctx.localReturn = ''
  ctx.setNavigation = () => {}
  ctx.cataloguePath = () => `index${locale === 'en' ? '' : `.${locale}`}.html`
  ctx.getLocations = (source) => source.fish[fishId].locations
  ctx.localizedFishName = (fish, id) => localizedFishName(ctx, fish, id)
  ctx.matchingItems = (items) => matchingItems(ctx, items)
  ctx.renderFirstStep = () => ''
  ctx.renderAreas = () => ''
  ctx.renderExchange = () => ''
  ctx.renderShopping = (matches, locationsForFish, activeStage, items, choices) =>
    renderFlyFallback(ctx, items, activeStage, choices)
  ctx.renderCompatibility = (entries, activeStage) => renderCompatibility(ctx, entries, activeStage)
  ctx.renderWaterIcons = () => ''
  ctx.renderEvidence = () => ''
  return ctx
}

function restoreGlobal(name, descriptor) {
  if (descriptor) Object.defineProperty(globalThis, name, descriptor)
  else delete globalThis[name]
}

console.log(
  'PASS: fish aliases avoid Thai title duplication without mutation; all 33 fly groups are labeled profile-only in EN/JA/TH and link to three backup sets that the fish page action expands.',
)
