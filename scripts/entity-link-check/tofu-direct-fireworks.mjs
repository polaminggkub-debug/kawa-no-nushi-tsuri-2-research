import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { data, render, root, unescapeHtml, validate } from './shared.mjs'

const source = JSON.parse(fs.readFileSync(path.join(root, 'data/quest-tool-use.json')))
const tofu = source.items['15']
const fireworks = source.items['16']
const marker = 'data-quest-next-action="tofu-fireworks-alternative"'
const rules = {
  en: [
    /fireworks/i,
    /without.*tofu|does not require.*tofu|do not need.*tofu|No tofu offering is required/i,
    /maximum.*HP|HP.*maximum|full HP/i,
  ],
  ja: [
    /花火/,
    /油揚げ.*不要|油揚げ.*必要.*(?:ない|ありません)|油揚げ.*なし/,
    /HP.*最大|最大.*HP|HP.*全回復/,
  ],
  th: [/ดอกไม้ไฟ|ประทัด/, /ไม่ต้อง.*เต้าหู้/, /HP.*เต็ม|เต็ม.*HP/],
}

checkEvidence()
for (const locale of ['en', 'ja', 'th']) {
  checkSummary(locale)
  await checkTargetScope(locale)
  for (const stage of [1, 4, 6]) await checkDetail(locale, stage)
}
console.log(
  'Tofu decision PASS: direct fireworks shortcut, optional tofu use and exact safe returns in three locales.',
)

function checkEvidence() {
  assert.equal(source.rom.sha1, 'c2103dd94e2a1a65a495fc02adc2e7d040f31212')
  assert.equal(tofu.rawTrace.selectedUseCpu, '03:C5C0..C5F5')
  assert.deepEqual(tofu.rawTrace.questConsumer.xy, [32, 42])
  assert.equal(tofu.rawTrace.questConsumer.requires, 'item 15')
  assert.equal(fireworks.rawTrace.fieldEvent.map, 4)
  assert.deepEqual(fireworks.rawTrace.fieldEvent.playerX, [31, 33])
  assert.deepEqual(fireworks.rawTrace.fieldEvent.playerY, [42, 43])
  assert.equal(fireworks.rawTrace.fieldEvent.requires, '7E:0C1A bit 7 clear')
  assert.equal(fireworks.rawTrace.fieldEvent.handler, '02:DF9C')
  assert.deepEqual(fireworks.rawTrace.tofuNpcFoxEvent.requires, [
    'item 15 offered first',
    'item 16',
  ])
  assert(tofu.evidence.sources.includes('docs/quest-tool-use-research.md'))
}

function checkSummary(locale) {
  const item = data.items.find((entry) => entry.category === 'general_tool' && entry.id === '15')
  for (const field of ['summary', 'facts', 'evidenceNotes', 'evidence']) {
    assert.deepEqual(
      item.playerUse[field],
      tofu[field],
      `Generated tofu ${field} must preserve canonical source`,
    )
  }
  for (const rule of rules[locale]) assert.match(tofu.summary[locale], rule)
  assert.match(tofu.summary[locale], /32.*42/)
  assert.doesNotMatch(tofu.summary[locale], /guaranteed.*unlock|必ず.*解放|ปลดล็อก.*แน่นอน/i)
}

function sourceQuery(locale, stage) {
  const suffix = locale === 'en' ? '' : `.${locale}`
  const nested = `maps${suffix}.html?stage=6&fish=03&section=s6-c2-r1#notebook-guide`
  const back = `index${suffix}.html?category=general_tool&fish=03&stage=${stage}&return=${encodeURIComponent(nested)}#cards`
  return new URLSearchParams({
    category: 'general_tool',
    id: '15',
    stage: String(stage),
    fish: '03',
    route: 'float',
    return: back,
  })
}

async function checkDetail(locale, stage) {
  const detail = await render('item', locale, `${sourceQuery(locale, stage)}#what-to-do`)
  const panels =
    detail.html.match(
      /<aside\b(?=[^>]*data-quest-next-action="tofu-fireworks-alternative")[^>]*>[\s\S]*?<\/aside>/g,
    ) || []
  assert.equal(panels.length, 1, `${locale}/${stage}: show one actionable tofu shortcut`)
  const panel = panels[0]
  const text = unescapeHtml(panel)
  assert.match(text, /31.*33/)
  assert.match(text, /42.*43/)
  assert.match(text, rules[locale][1])
  assert(panel.includes('data-tofu-heal-dialogue-choice'))
  assert.match(text, rules[locale][2])
  assert.match(text, /32.*42/)
  const consumed = {
    en: /Eating or offering consumes the tofu/,
    ja: /食べても渡しても油揚げは消費/,
    th: /กินหรือมอบแล้วเต้าหู้หมดไป/,
  }
  assert.match(text, consumed[locale])
  checkHierarchy(detail.html, panel)
  checkTarget(panel, detail.url, locale)
  validate(panel, detail.url)
  const destination = await render(
    'item',
    locale,
    new URLSearchParams({ category: 'general_tool', id: '16', stage: '4' }),
  )
  assert(
    destination.html.includes('id="use-locations"'),
    'Fireworks CTA must reach a real location section',
  )
  checkRetainedEvidence(detail.html, panel, locale)
  await checkNonTofu(locale)
  checkAdversarial(panel, detail.url, locale)
}

function checkTarget(panel, base, locale) {
  const href = panel.match(/data-tofu-fireworks-action\b[^>]*href="([^"]+)"/)?.[1]
  assert(href, 'Tofu decision requires a clickable fireworks detail action')
  const next = new URL(unescapeHtml(href), base)
  const suffix = locale === 'en' ? '' : `.${locale}`
  assert.equal(next.origin, base.origin)
  assert(next.pathname.endsWith(`/item${suffix}.html`))
  assert.equal(next.searchParams.get('category'), 'general_tool')
  assert.equal(next.searchParams.get('id'), '16')
  assert.equal(next.searchParams.get('stage'), '4')
  assert.equal(next.searchParams.has('fish'), false, 'Do not carry unrelated fish into fox scene')
  assert.equal(next.hash, '#use-locations')
  const back = new URL(next.searchParams.get('return'), next)
  assert.equal(back.origin, base.origin)
  assert.equal(back.pathname, base.pathname)
  assert.equal(back.search, base.search, 'Preserve full source query including nested return')
  assert.equal(back.hash, base.hash)
}

function checkRetainedEvidence(html, panel, locale) {
  const evidenceAt = html.indexOf('<details class="evidence">')
  assert(evidenceAt > html.indexOf(panel), 'Technical trace belongs after player action')
  const evidence = unescapeHtml(html.slice(evidenceAt))
  for (const note of tofu.evidenceNotes[locale]) assert(evidence.includes(note))
  for (const file of tofu.evidence.sources) assert(evidence.includes(file))
  checkFoldedFacts(html, tofu.facts[locale], tofu.summary[locale])
}

async function checkNonTofu(locale) {
  for (const identity of [
    ['general_tool', '16'],
    ['bait', '15'],
  ]) {
    const other = await render(
      'item',
      locale,
      new URLSearchParams({ category: identity[0], id: identity[1] }),
    )
    assert(!other.html.includes(marker), 'Shortcut must belong only to general-tool tofu')
  }
}

function checkAdversarial(panel, base, locale) {
  assert.throws(() =>
    checkTarget(panel.replace('data-tofu-fireworks-action', 'data-wrong-action'), base, locale),
  )
  assert.throws(() => checkTarget(panel.replace('id=16', 'id=15'), base, locale))
  assert.throws(() => checkTarget(panel.replace('stage=4', 'stage=1'), base, locale))
  assert.throws(() => checkTarget(panel.replace('#use-locations', '#wrong-anchor'), base, locale))
}

async function checkTargetScope(locale) {
  for (const [category, id, expected] of [
    ['general_tool', '15', false],
    ['general_tool', '16', false],
    ['general_tool', '0F', false],
    ['rod', '04', true],
    ['bait', '01', true],
    ['lure', '17', true],
  ]) {
    const result = await render(
      'item',
      locale,
      new URLSearchParams({ category, id, fish: '03', stage: '4', route: 'float' }),
    )
    assert.equal(
      result.html.includes('class="detail-section play-target"'),
      expected,
      `${locale}/${category}:${id}: only fishing gear shows selected fish target`,
    )
  }
}

function checkFoldedFacts(html, facts, summary) {
  const folded = html.match(
    /<details\b(?=[^>]*data-quest-choice-description)[^>]*>[\s\S]*?<\/details>/,
  )?.[0]
  assert(folded, 'Original description and facts must remain available in a focused disclosure')
  assert(!/<details[^>]*\bopen(?:\s|=|>)/.test(folded), 'Original description is folded initially')
  const all = unescapeHtml(html)
  assert(
    unescapeHtml(folded).includes(summary),
    'Original canonical summary remains in description',
  )
  for (const fact of facts) {
    assert(unescapeHtml(folded).includes(fact))
    assert.equal(
      all.split(fact).length - 1,
      1,
      'Keep supporting facts once without summary duplication',
    )
  }
}

function checkHierarchy(html, panel) {
  assert.equal((html.match(/id="what-to-do"/g) || []).length, 1, 'One primary decision anchor')
  const primary = html.match(/<div id="what-to-do" data-quest-choice-primary>[\s\S]*?<\/div>/)?.[0]
  assert(primary && primary.includes(panel), 'The actionable choice owns the primary decision area')
  assert(panel.includes('<h2>'), 'The primary decision is a section heading')
  assert(
    !primary.includes('data-quest-choice-description'),
    'Original description stays outside primary choice',
  )
}
