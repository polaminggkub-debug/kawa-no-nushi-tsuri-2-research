import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { data, render, root, unescapeHtml, validate } from './shared.mjs'

const quest = JSON.parse(fs.readFileSync(path.join(root, 'data/quest-tool-use.json')))
const source = quest.items['10']
const marker = 'data-milk-canoe-choice'
const copy = {
  en: [/canoe.*do not own/i, /reserve.*milk/i, /HP.*maximum/i, /empty bottle/i, /refill/i],
  ja: [/カヌー.*まだ持っていない/, /交換用に残/, /最大HP/, /空きビン/, /補充/],
  th: [/แคนู.*ยังไม่มี/, /เก็บนมสด/, /HP.*เต็ม/, /ขวดเปล่า/, /เติม/],
}

assert.equal(source.rawTrace.selectedUseCpu, '03:C4EA')
assert.equal(source.rawTrace.postUseItemId, '0F')
assert.deepEqual(source.rawTrace.canoeExchange.xy, [28, 39])
assert.equal(source.rawTrace.canoeExchange.map, 3)
assert.equal(source.rawTrace.canoeExchange.reward, 'item 02 canoe')
for (const locale of ['en', 'ja', 'th']) {
  checkCanonical(locale)
  for (const stage of [1, 3, 6]) await checkDetail(locale, stage)
}
console.log(
  'Milk choice PASS: optional canoe exchange versus refillable HP recovery, evidence and safe three-locale actions.',
)

function checkCanonical(locale) {
  const item = data.items.find((entry) => entry.category === 'general_tool' && entry.id === '10')
  for (const field of ['summary', 'facts', 'evidenceNotes', 'evidence'])
    assert.deepEqual(item.playerUse[field], source[field])
  for (const rule of copy[locale]) assert.match(source.summary[locale], rule)
  assert.match(source.summary[locale], /28.*39/)
  assert.match(source.summary[locale], /6.*103/)
}

async function checkDetail(locale, stage) {
  const suffix = locale === 'en' ? '' : `.${locale}`
  const nested = `maps${suffix}.html?stage=6&fish=03#notebook-guide`
  const back = `index${suffix}.html?category=general_tool&return=${encodeURIComponent(nested)}#cards`
  const query = new URLSearchParams({
    category: 'general_tool',
    id: '10',
    fish: '03',
    route: 'float',
    stage: String(stage),
    return: back,
  })
  const result = await render('item', locale, `${query}#what-to-do`)
  const panels =
    result.html.match(/<aside\b(?=[^>]*data-milk-canoe-choice)[^>]*>[\s\S]*?<\/aside>/g) || []
  assert.equal(panels.length, 1)
  const panel = panels[0]
  checkPlayerCopy(panel, locale)
  checkHierarchy(result.html, panel)
  for (const [action, hash] of [
    ['comparison', '#what-to-do'],
    ['location', '#use-locations'],
  ])
    checkLink(panel, action, hash, result.url, locale)
  assert(!result.html.includes('class="detail-section play-target"'))
  validate(panel, result.url)
  for (const [before, after] of [
    ['id=02', 'id=10'],
    ['stage=3', 'stage=6'],
    ['#use-locations', '#wrong-anchor'],
  ])
    assert.throws(() =>
      checkLink(panel.replaceAll(before, after), 'location', '#use-locations', result.url, locale),
    )
  const canoe = await render(
    'item',
    locale,
    new URLSearchParams({ category: 'general_tool', id: '02', stage: '3' }),
  )
  for (const anchor of ['what-to-do', 'use-locations'])
    assert(canoe.html.includes(`id="${anchor}"`))
  checkEvidence(result.html, panel, locale)
  await checkScope(locale)
}

function checkPlayerCopy(panel, locale) {
  const text = unescapeHtml(panel)
  assert(text.includes('data-milk-reserve-action') && text.includes('data-milk-heal-action'))
  assert.match(text, /28.*39/)
  assert.match(text, /6.*103/)
  const optional = {
    en: /do not need to trade.*tub/i,
    ja: /タライ.*交換する必要はありません/,
    th: /ไม่จำเป็นต้องแลกเรือ.*กะละมัง/,
  }
  assert.match(text, optional[locale])
  assert.doesNotMatch(text, /best boat|must trade|最強.*船|必ず交換|เรือดีที่สุด|ต้องแลกเรือก่อน/i)
}

function checkLink(panel, action, hash, base, locale) {
  const href = panel.match(new RegExp(`data-milk-canoe-${action}\\b[^>]*href="([^"]+)"`))?.[1]
  assert(href, `Missing milk ${action} CTA`)
  const target = new URL(unescapeHtml(href), base)
  const suffix = locale === 'en' ? '' : `.${locale}`
  assert.equal(target.origin, base.origin)
  assert(target.pathname.endsWith(`/item${suffix}.html`))
  assert.equal(target.searchParams.get('category'), 'general_tool')
  assert.equal(target.searchParams.get('id'), '02')
  assert.equal(target.searchParams.get('stage'), '3')
  assert(!target.searchParams.has('fish') && !target.searchParams.has('route'))
  assert.equal(target.hash, hash)
  const returned = new URL(target.searchParams.get('return'), target)
  assert.equal(returned.href, base.href)
}

function checkEvidence(html, panel, locale) {
  const start = html.indexOf('<details class="evidence">')
  assert(start > html.indexOf(panel))
  const evidence = unescapeHtml(html.slice(start))
  for (const note of source.evidenceNotes[locale]) assert(evidence.includes(note))
  for (const file of source.evidence.sources) assert(evidence.includes(file))
  checkFoldedFacts(html, source.facts[locale], source.summary[locale])
}

async function checkScope(locale) {
  for (const id of ['0F', '02']) {
    const other = await render(
      'item',
      locale,
      new URLSearchParams({ category: 'general_tool', id }),
    )
    assert(!other.html.includes(marker))
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
