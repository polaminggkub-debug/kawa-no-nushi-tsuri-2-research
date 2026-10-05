import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { root, unescapeHtml } from './shared.mjs'

const locales = ['en', 'ja', 'th']
const acceptance = readJson('data/fish-acceptance.json')
const choices = readJson('data/bait-lure-player-choices.json')
const profileById = new Map(acceptance.fish_profiles.map((profile) => [profile.id_hex, profile]))
const validProfiles = acceptance.fish_profiles.filter((profile) => profile.id_hex !== '43')
const noLureProfiles = validProfiles.filter((profile) => profile.matching_lure_ids.length === 0)

assert.equal(acceptance.rom.sha1, choices.rom.sha1)
assert.equal(acceptance.rom.sha1, 'c2103dd94e2a1a65a495fc02adc2e7d040f31212')
assert.equal(validProfiles.length, acceptance.valid_profile_count_excluding_placeholder_id_43)
assert.equal(noLureProfiles.length, validProfiles.length - acceptance.lure_eligible_profile_count)
assert.equal(acceptance.lure_eligible_profile_count, 38)
assert(choices.sources.includes('data/fish-acceptance.json'))
checkBaitAlternatives()
for (const locale of locales) checkLocale(locale)

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
}

function checkBaitAlternatives() {
  const floatTargetsByBait = new Map()
  for (const item of Object.values(choices.items)) {
    if (item.category !== 'bait') continue
    const targets = item.gate?.fishIdsByRoute?.float || []
    for (const fishId of targets) {
      const baits = floatTargetsByBait.get(fishId) || new Set()
      baits.add(item.id)
      floatTargetsByBait.set(fishId, baits)
    }
  }
  for (const profile of noLureProfiles) {
    const routeBaits = floatTargetsByBait.get(profile.id_hex) || new Set()
    const maskBaits = new Set(profile.matching_bait_ids)
    assert(
      [...routeBaits].some((id) => maskBaits.has(id)),
      `No ROM-derived float-bait alternative for no-lure profile ${profile.id_hex}`,
    )
  }
  assert.equal(noLureProfiles.length, 34)
  assert.equal(profileById.get('43').matching_lure_ids.length, 0)
}

function checkLocale(locale) {
  const suffix = locale === 'en' ? '' : `.${locale}`
  const sourcePath = path.join(root, `research/index${suffix}.html`)
  const mapsPath = path.join(root, `catalogue/maps${suffix}.html`)
  const html = fs.readFileSync(sourcePath, 'utf8')
  const mapsHtml = fs.readFileSync(mapsPath, 'utf8')
  const section = lureKitSection(html)
  const note = section.match(/<p class="note">([\s\S]*?)<\/p>/)?.[1]
  assert(note, `${locale} lure-kit next-action note is missing`)
  checkLocalizedNote(locale, note)
  checkActionStyle(html, note)
  checkDestination(locale, note, sourcePath)
  assert(/\bid="fish-search"/.test(mapsHtml), `${locale} map page lacks #fish-search`)
}

function lureKitSection(html) {
  const start = html.search(/<section\b(?=[^>]*\bid="lure-kit")[^>]*>/)
  const next = html.search(/<section\b(?=[^>]*\bid="rod-choice")[^>]*>/)
  const technical = html.search(/\bid="technical-evidence"/)
  assert(start >= 0 && next > start && technical > next, 'Strategy section order changed')
  const section = html.slice(start, next)
  assert(!section.includes('id="technical-evidence"'))
  return section
}

function checkLocalizedNote(locale, note) {
  const text = unescapeHtml(note.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ')
  const claims = {
    en: ['does not cover every fish', 'Search for your target on the maps', 'compatible bait'],
    ja: [
      'すべての魚をカバーするものではありません',
      '狙う魚をマップで検索',
      '適合するエサやフライ',
    ],
    th: ['ไม่ได้ครอบคลุมปลาทุกชนิด', 'ค้นหาปลาเป้าหมายในหน้าแผนที่', 'เหยื่อจริงหรือฟลาย'],
  }
  for (const claim of claims[locale])
    assert(text.includes(claim), `${locale} lure-kit note lacks localized guidance: ${claim}`)
}

function checkActionStyle(html, note) {
  const action = note.match(/<a\b[^>]*>[\s\S]*?<\/a\s*>/)?.[0]
  assert(
    action?.includes('class="fish-target-action"'),
    'Fish-search action lost its block hit area',
  )
  assert(html.includes('strategy.css'), 'Rendered strategy page does not load its stylesheet')
  const css = fs.readFileSync(path.join(root, 'research/strategy.css'), 'utf8')
  const rule = css.match(/\.fish-target-action\s*\{([^}]*)\}/)?.[1]
  assert(rule, 'Missing fish-target-action stylesheet rule')
  assert(/display:\s*block\s*;/.test(rule), 'Fish-search action is not a block link')
  assert(/padding:\s*10px\s+0\s*;/.test(rule), 'Fish-search action lacks a full-width touch target')
}

function checkDestination(locale, note, sourcePath) {
  const suffix = locale === 'en' ? '' : `.${locale}`
  const base = new URL(`https://example.test/research/${path.basename(sourcePath)}`)
  const href = note.match(/<a\b[^>]*\bhref="([^"]+)"/)?.[1]
  assert(href, `${locale} lure-kit note has no maps action`)
  const target = new URL(unescapeHtml(href), base)
  assert.equal(target.origin, base.origin)
  assert.equal(target.pathname, `/catalogue/maps${suffix}.html`)
  assert.equal(target.hash, '#fish-search')
  assert.deepEqual([...target.searchParams.keys()], ['return'])
  const back = new URL(target.searchParams.get('return'), base)
  assert.equal(back.origin, base.origin)
  assert.equal(back.pathname, base.pathname)
  assert.equal(back.search, '')
  assert.equal(back.hash, '#lure-kit')
}

console.log(
  'PASS: localized lure-kit notes point to each map fish search and return to the same research section; all 34 ROM profiles outside lure coverage pass at least one ROM-derived float-bait gate.',
)
