import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { data, locations, render, root, unescapeHtml, validate } from './shared.mjs'

const locales = ['en', 'ja', 'th']
const backup = readJson('data/fly-backup-choices.json')
const acceptance = readJson('data/fish-acceptance.json')
const profileIds = Object.keys(backup.profiles).sort()
const body01Ids = acceptance.fly_bodies
  .find((body) => body.id_hex === '01')
  .fish_ids_passing_mask_gate.sort()
const body01 = data.items.find((item) => item.category === 'fly' && item.id === '01')
const rejectedBody = data.items.find((item) => item.category === 'fly' && item.id === '18')
const wing = data.items.find((item) => item.category === 'fly_wing')
const tail = data.items.find((item) => item.category === 'fly_tail')

assert.equal(profileIds.length, 33, 'Backup profiles must cover exactly 33 fish')
assert.deepEqual(body01Ids, profileIds, 'Backup IDs must match the raw body-01 ROM gate')
assert(body01 && rejectedBody && wing && tail, 'Expected body, wing and tail fixtures')
assert.deepEqual(
  body01.playerUse.fishIds.slice().sort(),
  body01Ids,
  'Published body-01 list must match the raw ROM gate',
)

for (const locale of locales) {
  for (const fish of profileIds) await checkBackupAction(locale, fish)
  await checkRejectedBody(locale)
  await checkNoFlyTarget(locale)
  for (const part of [wing, tail]) await checkFlyPartAction(locale, part)
  await checkStarterReturn(locale)
}

console.log(
  `PASS: ${profileIds.length} ROM-backed backup profiles open their localized fish details in EN/JA/TH; starter, rejected-body, no-fly and wing/tail states stay accurate.`,
)

async function checkBackupAction(locale, fish) {
  const itemPage = await renderItem(locale, body01.id, fish)
  const panel = advicePanel(itemPage.html, fish)
  assert(panel.includes('data-fly-hidden-gate'), `${locale} ${fish}: missing hidden-gate caveat`)
  assertCaveat(panel, locale)
  const href = panel.match(/data-fly-backup-action href="([^"]+)"/)?.[1]
  assert(href, `${locale} ${fish}: missing backup action`)
  const target = new URL(href, itemPage.url)
  assertFishTarget(target, locale, fish, itemPage.url)
  const targetPage = await render('fish', locale, `${target.search.slice(1)}${target.hash}`)
  const backupPanel = targetPage.html.split('id="fly-backup"')[1]?.split('</details>')[0]
  assert(backupPanel, `${locale} ${fish}: linked fish page lacks backup details`)
  assert(backupPanel.includes('data-bundle='), `${locale} ${fish}: no backup bundle is rendered`)
  assert.equal(
    targetPage.nodes['fly-backup']?.getAttribute('open'),
    '',
    `${locale} ${fish}: #fly-backup did not open the backup details`,
  )
}

async function renderItem(locale, itemId, fish, stage = 1) {
  const result = await render(
    'item',
    locale,
    `category=fly&id=${itemId}&fish=${fish}&stage=${stage}`,
  )
  assert(result.html.includes(`data-fly-target-advice="${fish}"`))
  return result
}

function advicePanel(html, fish) {
  const section = unescapeHtml(html).split('id="what-to-do"')[1]?.split('</section>')[0] || ''
  const start = section.indexOf(`data-fly-target-advice="${fish}"`)
  assert(start >= 0, `${fish}: selected-fish advice block missing`)
  return section.slice(start)
}

function assertCaveat(panel, locale) {
  const phrases = {
    en: [
      'Recasting does not change the lock',
      'only an inn rest can',
      'If a fish turns toward the fly, change nothing',
    ],
    ja: [
      '投げ直してもロックは変わらず',
      '変わるのは宿泊だけ',
      '魚がこちらを向いたら替える必要はありません',
    ],
    th: ['การตีซ้ำไม่เปลี่ยนล็อก', 'มีแต่การนอนโรงแรมที่เปลี่ยนได้', 'ไม่ต้องเปลี่ยนอะไร'],
  }
  for (const phrase of phrases[locale])
    assert(panel.includes(phrase), `${locale}: missing caveat ${phrase}`)
}

function assertFishTarget(target, locale, fish, itemUrl) {
  const suffix = locale === 'en' ? '' : `.${locale}`
  assert(target.pathname.endsWith(`/fish${suffix}.html`), `${locale} ${fish}: wrong target page`)
  assert.equal(target.searchParams.get('id'), fish)
  assert.equal(target.hash, '#fly-backup')
  const locationStages = locations.fish[fish].locations.map((entry) => String(entry.stage))
  assert(
    locationStages.includes(target.searchParams.get('stage')),
    `${locale} ${fish}: invalid target stage`,
  )
  const returned = new URL(target.searchParams.get('return'), itemUrl)
  assert(returned.pathname.endsWith(`/item${suffix}.html`))
  assert.equal(returned.searchParams.get('category'), 'fly')
  assert.equal(returned.searchParams.get('id'), '01')
  assert.equal(returned.searchParams.get('fish'), fish)
  assert.equal(returned.searchParams.get('stage'), '1')
}

async function checkRejectedBody(locale) {
  const result = await renderItem(locale, rejectedBody.id, '11')
  const panel = advicePanel(result.html, '11')
  assert(panel.includes('data-fly-starter-link'), `${locale}: rejected body lost starter action`)
  assert(
    !panel.includes('data-fly-hidden-gate'),
    `${locale}: rejected body falsely shows its hidden-gate advice`,
  )
  assert(
    !panel.includes('data-fly-backup-action'),
    `${locale}: rejected body falsely offers its backup action`,
  )
  const mismatch = {
    en: 'does not take this body',
    ja: 'はこのボディを食べません',
    th: 'ไม่กินบอดี้นี้',
  }
  assert(panel.includes(mismatch[locale]), `${locale}: rejected-body explanation missing`)
}

async function checkNoFlyTarget(locale) {
  const fish = Object.keys(data.fishVisuals).find(
    (id) => !profileIds.includes(id) && locations.fish[id]?.locations?.length,
  )
  assert(fish, 'Expected a located fish outside the backup-profile set')
  const result = await renderItem(locale, body01.id, fish)
  const panel = advicePanel(result.html, fish)
  const explanation = {
    en: 'No fly body takes',
    ja: 'が食べるフライボディはありません',
    th: 'ไม่มีบอดี้ฟลายที่',
  }
  assert(panel.includes(explanation[locale]), `${locale}: no-fly explanation is missing`)
  assert(
    panel.includes('data-fly-starter-link'),
    `${locale}: no-fly state lost its alternate-method action`,
  )
  assert(
    !panel.includes('data-fly-hidden-gate'),
    `${locale}: no-fly state shows unsupported backup advice`,
  )
  assert(
    !panel.includes('data-fly-backup-action'),
    `${locale}: no-fly state links to nonexistent backups`,
  )
}

async function checkFlyPartAction(locale, part) {
  const result = await render(
    'item',
    locale,
    `category=${part.category}&id=${part.id}&fish=11&stage=5`,
  )
  const panel = advicePanel(result.html, '11')
  assert(
    panel.includes('data-fly-starter-link'),
    `${locale} ${part.category}: missing ready-set action`,
  )
  assert(
    panel.includes('data-fly-hidden-gate'),
    `${locale} ${part.category}: missing conditional advice`,
  )
  assert(
    panel.includes('data-fly-backup-action'),
    `${locale} ${part.category}: missing fish backup link`,
  )
  const noBodyClaim = {
    en: 'Wings and tails do not choose fish',
    ja: 'ウィングとテールは魚を選びません',
    th: 'ปีกและหางไม่เลือกปลา',
  }
  assert(
    panel.includes(noBodyClaim[locale]),
    `${locale} ${part.category}: unsupported part-only claim`,
  )
}

async function checkStarterReturn(locale) {
  const result = await renderItem(locale, body01.id, '11')
  const panel = advicePanel(result.html, '11')
  const link = panel.match(/data-fly-starter-link href="([^"]+)"/)?.[1]
  assert(link, `${locale}: missing selected-fish starter action`)
  const target = new URL(link, result.url)
  assert.equal(target.searchParams.get('id'), '11')
  assert.equal(target.hash, '#starter-fly')
  const returned = new URL(target.searchParams.get('return'), result.url)
  assert.equal(returned.searchParams.get('category'), 'fly')
  assert.equal(returned.searchParams.get('id'), '01')
  assert.equal(returned.searchParams.get('fish'), '11')
  validate(`<a href="${link}"></a>`, result.url)
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'))
}
