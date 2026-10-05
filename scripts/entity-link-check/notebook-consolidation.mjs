import assert from 'node:assert/strict'
import { notebookGuideMarkup } from '../../src/pages/maps/notebook-guide.js'
import { data, unescapeHtml } from './shared.mjs'

const words = {
  en: {
    title: 'Fish checklist',
    inactive: /inactive|may.*no fish/,
    help: /If a point has no fish.*open the map.*other recorded points/,
    move: /same-size or smaller.*leaves.*larger catch moves/,
    tool: /Land the fish.*finish.*Tool 05/,
    evidence: /0\/0.*23\/1.*one landed-catch path/,
  },
  ja: {
    title: '魚チェックリスト',
    inactive: /有効とは限りません|魚がいない/,
    help: /魚がいない.*地図.*別地点/,
    move: /同じか小さい.*移らず.*大きい.*移ります/,
    tool: /取り込み.*最後まで.*道具05/,
    evidence: /0\/0.*23\/1.*全魚種/,
  },
  th: {
    title: 'เช็กลิสต์ปลา',
    inactive: /อาจไม่มีปลา/,
    help: /ไม่มีปลา.*เปิดแผนที่.*จุดอื่น/,
    move: /เท่าหรือเล็กกว่า.*ไม่ย้าย.*ใหญ่กว่า.*ย้าย/,
    tool: /ตกปลาให้ขึ้น.*ข้อความ.*จบ.*05/,
    evidence: /0\/0.*23\/1.*หนึ่งกรณี/,
  },
}

for (const lang of ['en', 'ja', 'th']) {
  for (const stage of data.notebookCompletion.stages) checkPanel(lang, stage)
  checkRegressionProbes(lang)
}
console.log(
  'PASS: notebook has one primary checklist identity and manual controls; repeated operational caveats stay in folded help.',
)

function checkPanel(lang, stage) {
  const html = notebookGuideMarkup(context(lang, stage.stage))
  const manual = html.match(/<section class="notebook-manual"[^>]*>[\s\S]*?<\/section>/)?.[0]
  assert(manual, 'Manual checklist controls missing')
  assert.doesNotMatch(
    manual,
    /<h[1-6]\b/,
    `${lang}/${stage.stage}: repeated checklist heading above manual count`,
  )
  assert.equal([...html.matchAll(/class="notebook-manual-count"/g)].length, 1)
  assert.equal([...html.matchAll(/data-notebook-remaining(?=[\s>])/g)].length, 1)
  assert.equal([...html.matchAll(/data-notebook-title(?=[\s>])/g)].length, 1)
  const title = unescapeHtml(
    html.match(/<h3[^>]*data-notebook-title[^>]*>([^<]+)<\/h3>/)?.[1] || '',
  )
  assert.equal(title, words[lang].title)
  assert.match(manual, /data-notebook-browser-note/)
  checkVisibleScope(html, lang)
  checkFoldedHelp(html, lang)
  checkRouteNote(html, lang)
  checkCompactCounts(html, stage)
}

function context(lang, stage) {
  return {
    lang,
    activeStage: stage,
    notebookRouteStage: stage,
    notebookCompletion: data.notebookCompletion,
    species: Object.fromEntries(
      Object.entries(data.fishVisuals).map(([id, visual]) => [
        id,
        { name: visual.nameEn || visual.nameJa || id, visual },
      ]),
    ),
    sourceReturn: () => `maps.html?stage=${stage}#notebook-guide`,
    returnPath: '',
    fishHref: () => '',
    c: { area: (value) => String(value) },
    esc: (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;'),
  }
}

function detailsBlock(html, className) {
  const start = html.indexOf('<details class="' + className + '"')
  assert(start >= 0, 'Missing ' + className)
  let depth = 0
  for (const match of html.slice(start).matchAll(/<\/?details\b[^>]*>/g)) {
    depth += match[0].startsWith('</') ? -1 : 1
    if (!depth) return html.slice(start, start + match.index + match[0].length)
  }
  throw new Error('Unclosed details ' + className)
}
function checkFoldedHelp(html, lang) {
  const help = detailsBlock(html, 'notebook-help')
  const evidence = detailsBlock(html, 'notebook-evidence')
  for (const block of [help, evidence]) assert.doesNotMatch(block.split('>')[0], /\sopen(?:\s|$)/)
  const text = unescapeHtml(help.replace(/<[^>]+>/g, ' '))
  for (const key of ['help', 'move', 'tool'])
    assert.match(text, words[lang][key], 'Retain folded ' + key)
  assert.match(help, /data-notebook-open[^>]*href="[^"]*category=general_tool(?:&amp;|&)id=05/)
  assert.match(unescapeHtml(evidence.replace(/<[^>]+>/g, ' ')), words[lang].evidence)
  assert.match(evidence, /docs\/notebook-completion-research\.md/)
}
function checkRouteNote(html, lang) {
  const route = detailsBlock(html, 'notebook-full-route')
  const prefix = route.split('<details id="notebook-route-')[0]
  assert.doesNotMatch(prefix, /<p\b/, 'Full route repeats a filing/action intro above fish rows')
  const help = unescapeHtml(detailsBlock(html, 'notebook-help'))
  const filing = {
    en: 'Each species is filed once under the first area with a configured point.',
    ja: '各魚は出現地点が記録された最初のエリアに一度だけ掲載します。',
    th: 'จัดปลาแต่ละชนิดไว้ครั้งเดียวในด่านแรกที่มีจุดตกในข้อมูลเกม',
  }[lang]
  assert.equal(
    help.split(filing).length - 1,
    1,
    'First-area filing explanation must occur once in folded help',
  )
}
function checkCompactCounts(html, stage) {
  const breakdown = html.match(
    /<(p|div) class="notebook-count-breakdown"[^>]*>([\s\S]*?)<\/(?:p|div)>/,
  )
  assert(breakdown, 'Count breakdown missing')
  assert.equal(breakdown[1], 'p', 'New and repeated counts must share one compact paragraph')
  assert.doesNotMatch(breakdown[2], /<p\b/)
  const text = unescapeHtml(breakdown[2])
  assert(text.includes(String(stage.firstOccurrenceSpecies.length)))
  assert(text.includes(String(stage.repeatedFromEarlierStages.length)))
}

function checkVisibleScope(html, lang) {
  const visible = unescapeHtml(
    html.split('<details class="notebook-help"')[0].replace(/<[^>]+>/g, ' '),
  )
  const rules = {
    en: [/not a required game-page total/, /Route additions:/],
    ja: [/ゲームのページ目標数ではありません/, /ルート追加/],
    th: [/ไม่ใช่ยอดที่หน้าสมุดเกมต้องมี/, /ปลาใหม่ในเส้นทาง/],
  }[lang]
  for (const rule of rules)
    assert.match(
      visible,
      rule,
      'Local counts must not imply a fixed page target or exclusive natural spawn',
    )
}

function checkRegressionProbes(lang) {
  const html = notebookGuideMarkup(context(lang, 1))
  const duplicated = html.replace(
    '<details id="notebook-route-1"',
    '<p>Repeated filing and action instructions</p><details id="notebook-route-1"',
  )
  assert.throws(() => checkRouteNote(duplicated, lang), /repeats a filing\/action intro/)
  const split = html.replace(
    '<p class="notebook-count-breakdown"',
    '<div class="notebook-count-breakdown"',
  )
  assert.throws(
    () => checkCompactCounts(split, data.notebookCompletion.stages[0]),
    /one compact paragraph/,
  )
}
