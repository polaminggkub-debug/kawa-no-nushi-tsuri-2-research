import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { checkKeyPurchase } from './area-quest-key-purchase.mjs'
import { updateNavigation } from '../../src/pages/navigation/context-links.js'
import { root, itemKeys, fishIds, unescapeHtml, validate, render } from './shared.mjs'

assert(
  fs.existsSync(`${root}/src/entities/quest/index.js`),
  'Missing ROM-backed area quest projection',
)
assert(fs.existsSync(`${root}/catalogue/quests.html`), 'Missing actionable area quest index')
const { renderQuestCard } = await import('../../src/pages/quests/render.js')
const { actionHref, localizeReturn, safeReturn } =
  await import('../../src/pages/quests/navigation.js')
const { copy } = await import('../../src/pages/quests/copy.js')
const { areaQuestActions, areaQuestStages } = await import('../../src/entities/quest/index.js')
const chests = read('data/town-item-acquisition.json').items
const canonicalSources = new Set([
  'data/quest-tool-use.json',
  'data/shop-stock-rom.json',
  'data/town-item-acquisition.json',
  'data/tool-use-locations.json',
  'data/tub-acquisition.json',
  'data/tub-location.json',
  'data/daikon-acquisition.json',
  'data/daikon-location.json',
  'data/giant-eel-ending-route.json',
  'data/magnet-story-gate.json',
])

const decisionRules = {
  'hariyo-tub': {
    en: [/22/, /87,\s*27/, /free|empty/, /consum|remov|lose|lost/, /full/],
    ja: [/22/, /87,\s*27/, /空/, /消費|失/, /満杯/],
    th: [/22/, /87,\s*27/, /ว่าง/, /เสียปลา|ปลาหาย|ใช้ปลา|เสีย.*ปลา/, /เต็ม/],
  },
  'yamanokami-daikon': {
    en: [/18/, /21,\s*82/, /16/, /overwrite|replace.*food/, /once|one.time/],
    ja: [/18/, /21,\s*82/, /16/, /上書|置き換/, /一度|1回/],
    th: [/18/, /21,\s*82/, /16/, /ทับ|แทน.*อาหาร/, /ครั้งเดียว|หนึ่งครั้ง/],
  },
  'fox-fireworks': {
    en: [
      /31.*33/,
      /42.*43/,
      /without.*tofu|does not require.*tofu/,
      /62,\s*32/,
      /hint only|hint.*not|not.*(?:completion|scene)/,
    ],
    ja: [
      /31.*33/,
      /42.*43/,
      /(?:あぶらあげ|油揚げ).*不要|(?:あぶらあげ|油揚げ).*なく/,
      /62,\s*32/,
      /助言|ヒント/,
    ],
    th: [/31.*33/, /42.*43/, /ไม่ต้อง.*เต้าหู้|ไม่จำเป็น.*เต้าหู้/, /62,\s*32/, /คำใบ้|บอกใบ้/],
  },
  lottery: {
    en: [/49,\s*22/, /54,\s*22/, /offer/, /never guaranteed|nothing/],
    ja: [/49,\s*22/, /54,\s*22/, /供え/, /保証|はずれ|外れ/],
    th: [/49,\s*22/, /54,\s*22/, /ถวาย/, /ไม่.*รับประกัน|ไม่ได้อะไร/],
  },
  'giant-eel-return': {
    en: [/do not need to keep/, /Area 1 village/, /earlier step/, /not enough|nothing happens/],
    ja: [/残しておく必要はない/, /エリア1の村/, /前の手順/, /何も起きない|足りない/],
    th: [/ไม่ต้องเก็บ/, /หมู่บ้านด่าน 1/, /ขั้นก่อนหน้า/, /ไม่มีอะไรเกิดขึ้น|ไม่พอ/],
  },
}

assert.deepEqual(areaQuestStages(), [1, 2, 3, 4, 5, 6])
for (const lang of ['en', 'ja', 'th'])
  for (const stage of [1, 2, 3, 4, 5, 6]) checkActions(stage, lang)

function read(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
}

function checkActions(stage, lang) {
  const actions = areaQuestActions(stage, lang)
  assert(
    Array.isArray(actions) && actions.length,
    `${lang}/${stage}: no actionable verified entries`,
  )
  assert.equal(
    new Set(actions.map((entry) => entry.id)).size,
    actions.length,
    'Duplicate transaction identity',
  )
  for (const action of actions) {
    assert(action.id && action.kind && action.title && action.steps?.length)
    assert(action.steps.every((step) => typeof step === 'string' && step.trim()))
    assert(action.links?.length, 'Quest needs an actionable destination')
    assert(action.evidence?.length, 'Quest needs canonical proof')
    for (const evidence of action.evidence) checkEvidence(evidence)
    for (const link of action.links) checkLink(link)
    checkCard(action, stage, lang)
    const text = [action.title, ...action.steps, action.warning || '', action.limit || ''].join(' ')
    assert.doesNotMatch(
      text,
      /guaranteed (?:prize|ending)|all quests decoded|ครบทุกเควสต์|全クエスト解読済み/i,
    )
  }
  const expected = {
    1: ['potato-chest', 'giant-eel-return'],
    2: ['hariyo-tub', 'waxworm-chest'],
    3: ['milk-canoe', 'yamanokami-daikon'],
    4: ['small-lure-rod-chest', 'fox-fireworks'],
    5: ['lottery'],
    6: ['candle-reunion', 'giant-eel-return'],
  }
  assert.deepEqual(
    actions.map((action) => action.id).sort(),
    expected[stage].sort(),
    'Verified transaction coverage drift',
  )
  checkChestProjection(actions, stage)
  checkDecisions(actions, stage, lang)
}

function checkEvidence(evidence) {
  assert(canonicalSources.has(evidence.file), `Noncanonical quest proof ${evidence.file}`)
  assert(evidence.field, 'Evidence must identify a field rather than an entire dataset')
  const segments = evidence.field
    .replace(/\[(["']?)([^\]"']+)\1\]/g, '.$2')
    .split('.')
    .filter(Boolean)
  let value = read(evidence.file)
  for (const segment of segments) value = value?.[segment]
  assert.notEqual(
    value,
    undefined,
    `Unresolvable canonical evidence ${evidence.file}:${evidence.field}`,
  )
}

function checkLink(link) {
  assert(['item', 'fish', 'map'].includes(link.type))
  assert(link.label)
  assert(Number.isInteger(Number(link.stage)) && Number(link.stage) >= 1 && Number(link.stage) <= 6)
  if (link.type === 'item') assert(itemKeys.has(`${link.category}:${link.id}`))
  if (link.type === 'fish') assert(fishIds.has(link.id))
}

function checkChestProjection(actions, stage) {
  for (const [key, rows] of Object.entries(chests))
    for (const row of rows.filter((entry) => entry.stage === stage)) {
      const [category, id] = key.split(':')
      const candidates = actions.filter((action) =>
        action.evidence.some(
          (source) =>
            source.file === 'data/town-item-acquisition.json' && source.field.includes(key),
        ),
      )
      assert.equal(candidates.length, 1, `${stage}: chest ${key} absent or duplicated`)
      const action = candidates[0]
      checkChestCopy(action, row)
      if (row.requiresKey) checkKeyPurchase(action, row.stage)
      assert(
        [action.title, ...action.steps]
          .join(' ')
          .replaceAll(' ', '')
          .includes(`${row.approach.tileX},${row.approach.tileY}`),
        'Paired field entrance drift',
      )
      assert(
        action.links.some(
          (link) => link.type === 'item' && link.category === category && link.id === id,
        ),
      )
      if (row.requiresKey)
        assert(
          action.links.some(
            (link) => link.type === 'item' && link.category === 'general_tool' && link.id === '17',
          ),
        )
      assert(
        [action.title, ...action.steps]
          .join(' ')
          .replaceAll(' ', '')
          .includes(`${row.tileX},${row.tileY}`),
        'Town chest coordinate drift',
      )
    }
}

function questContext(stage, locale) {
  const suffix = locale === 'en' ? '' : `.${locale}`
  return {
    stage,
    locale,
    text: copy[locale],
    pathname: `/kawa-no-nushi-tsuri-2-research/catalogue/quests${suffix}.html`,
    hash: '#area-actions',
    fish: '03',
    route: 'float',
    returnRoute: `maps${suffix}.html?stage=4&return=item${suffix}.html%3Fcategory%3Drod%26id%3D02%23what-to-do`,
  }
}

function checkCard(action, stage, lang) {
  const ctx = questContext(stage, lang)
  const base = new URL(`https://example.test${ctx.pathname}`)
  const html = renderQuestCard(ctx, action)
  assert(html.includes(`data-area-quest="${action.id}"`))
  assert.equal((html.match(/data-quest-step/g) || []).length, action.steps.length)
  assert.match(html, /<details class="quest-evidence">/)
  assert.doesNotMatch(html, /<details[^>]* open/)
  for (const link of action.links) {
    const href = actionHref(ctx, link, action.id)
    const target = new URL(href, base)
    const suffix = lang === 'en' ? '' : `.${lang}`
    assert(target.pathname.endsWith(`${link.type === 'map' ? 'maps' : link.type}${suffix}.html`))
    assert.equal(target.searchParams.get('stage'), String(link.stage))
    if (link.id) assert.equal(target.searchParams.get('id'), link.id)
    if (link.category) assert.equal(target.searchParams.get('category'), link.category)
    const returned = new URL(target.searchParams.get('return'), base)
    assert.equal(returned.pathname, ctx.pathname)
    assert.equal(returned.searchParams.get('fish'), ctx.fish)
    assert.equal(returned.searchParams.get('route'), ctx.route)
    assert.equal(returned.searchParams.get('return'), ctx.returnRoute)
    assert.equal(returned.hash, `#${action.id}`)
    if (!link.params?.fish)
      assert.equal(
        target.searchParams.get('fish'),
        null,
        'Quest target inherited unrelated fish context',
      )
  }
  validate(html, base)
}

async function checkReturnRoundTrips() {
  for (const lang of ['en', 'ja', 'th']) {
    const ctx = questContext(4, lang)
    const back = `${ctx.pathname}?stage=4&fish=03&route=float&return=${encodeURIComponent(ctx.returnRoute)}#area-actions`
    for (const [kind, query] of [
      ['item', 'category=general_tool&id=16'],
      ['fish', 'id=03'],
    ]) {
      const page = await render(kind, lang, `${query}&stage=4&return=${encodeURIComponent(back)}`)
      assert(
        page.nodes[kind === 'fish' ? 'fish-back' : 'detail-back'].href.includes('quests'),
        `${kind}: quest return rejected`,
      )
    }
    const base = `https://example.test${ctx.pathname}`
    assert.equal(safeReturn('https://hostile.invalid/catalogue/quests.html', base), '')
    assert.equal(safeReturn('javascript:alert(1)', base), '')
    const changed = localizeReturn(back, 'ja', base)
    assert(changed.includes('quests.ja.html'))
    assert(new URL(changed, base).searchParams.get('return').includes('maps.ja.html'))
  }
}

checkCommonQuestNavigation()
await checkDestinationAnchors()
await checkGeneratedPages()
await checkReturnRoundTrips()
for (const value of [0, 7, -1, 'invalid']) assert.deepEqual(areaQuestActions(value, 'en'), [])
console.log(
  'PASS: verified area quests preserve canonical transactions, actionable localized destinations and safe nested returns.',
)

function checkDecisions(actions, stage, lang) {
  for (const action of actions) {
    const text = [action.title, ...action.steps, action.warning || ''].join(' ')
    for (const rule of decisionRules[action.id]?.[lang] || [])
      assert.match(text, rule, `${lang}/${stage}/${action.id}: material decision hidden or absent`)
    if (action.id === 'giant-eel-return') {
      if (stage === 6) {
        const threshold = read('data/magnet-story-gate.json').storyGate.recordArray
          .thresholdNonzeroEntries
        assert(
          `${text} ${action.limit}`.includes(String(threshold)),
          'Mail heading record prerequisite lost',
        )
      }
      const ending = read('data/giant-eel-ending-route.json').returnRoute
      const target = action.links.find((link) => link.params?.action === 'eel-return')
      assert(target && target.stage === ending.stage)
      assert.equal(target.params.section, 's1-c1-r8')
      assert.equal(target.params.fish, undefined)
      assert(
        action.links.some((link) => link.type === 'fish' && link.id === '3B' && link.stage === 6),
      )
    }
  }
  const all = actions.flatMap((action) => [action.title, ...action.steps]).join(' ')
  if (stage === 3) {
    for (const point of ['6,4', '6,103', '28,39', '21,82'])
      assert(all.replaceAll(' ', '').includes(point))
  }
  if (stage === 6) assert(all.replaceAll(' ', '').includes('47,36'))
}

function makeQuestDOM(lang) {
  const nodes = {}
  const node = (id) =>
    (nodes[id] ||= {
      innerHTML: '',
      textContent: '',
      value: '',
      href: '',
      listeners: {},
      setAttribute() {},
      removeAttribute() {},
      replaceChildren() {
        this.innerHTML = ''
      },
      addEventListener(event, callback) {
        this.listeners[event] = callback
      },
      querySelector() {
        return null
      },
      scrollIntoView() {
        this.scrolled = true
      },
    })
  return {
    nodes,
    document: {
      documentElement: { dataset: { locale: lang } },
      getElementById: node,
      querySelector() {
        return null
      },
      querySelectorAll() {
        return []
      },
    },
  }
}

async function checkGeneratedPages() {
  const source = fs.readFileSync(`${root}/catalogue/quests.js`, 'utf8')
  for (const lang of ['en', 'ja', 'th'])
    for (const stage of [1, 2, 3, 4, 5, 6]) {
      const ctx = questContext(stage, lang)
      const dom = makeQuestDOM(lang)
      const location = new URL(
        `https://example.test${ctx.pathname}?stage=${stage}&fish=03&route=float&return=${encodeURIComponent(ctx.returnRoute)}#${areaQuestActions(stage, lang)[0].id}`,
      )
      const history = { replaceState() {} }
      vm.runInNewContext(source, {
        document: dom.document,
        location,
        history,
        window: { location, history, addEventListener() {} },
        URL,
        URLSearchParams,
        console,
        setTimeout,
        clearTimeout,
      })
      await new Promise((resolve) => setImmediate(resolve))
      const html = dom.nodes['quest-results']?.innerHTML
      assert(html, `${lang}/${stage}: generated app failed to render`)
      for (const action of areaQuestActions(stage, lang))
        assert.equal(
          (html.match(new RegExp(`data-area-quest="${action.id}"`, 'g')) || []).length,
          1,
        )
      assert.equal(dom.nodes['quest-stage'].value, String(stage))
      assert.equal(dom.nodes['quest-stage'].disabled, false)
      assert(dom.nodes[location.hash.slice(1)].scrolled, 'Deep card return did not restore focus')
      for (const [, raw] of html.matchAll(
        /<a[^>]*data-quest-link-type="[^"]+"[^>]*href="([^"]+)"/g,
      )) {
        const next = new URL(unescapeHtml(raw), location)
        assert.notEqual(
          next.searchParams.get('fish'),
          '03',
          'Generated quest target retained unrelated fish',
        )
      }
      validate(html, location)
      checkGeneratedNavigation(ctx, dom, location, stage)
    }
}

function checkChestCopy(action, row) {
  const text = [action.title, ...action.steps, action.warning || ''].join(' ')
  assert.match(text, /town|village|เมือง|村|町/)
  assert.match(text, /free|space|empty|ว่าง|เว้นช่อง|空/)
  if (row.requiresKey)
    assert.match(
      text,
      /uses the key up|key is kept|กุญแจจะหมดไป|กุญแจจะยังอยู่|カギは消費される|カギは残っている/,
    )
  else
    assert.match(text, /no key|key.*not.*(?:required|needed)|ไม่ต้อง.*กุญแจ|カギ.*不要|鍵.*不要/i)
}

async function checkDestinationAnchors() {
  const tested = new Set()
  for (const lang of ['en', 'ja', 'th'])
    for (const stage of [1, 2, 3, 4, 5, 6]) {
      for (const action of areaQuestActions(stage, lang))
        for (const link of action.links.filter((entry) => entry.type !== 'map')) {
          const key = `${lang}/${link.type}/${link.category}/${link.id}/${link.stage}/${link.hash}`
          if (tested.has(key)) continue
          tested.add(key)
          const ctx = questContext(stage, lang)
          const target = new URL(
            actionHref(ctx, link, action.id),
            `https://example.test${ctx.pathname}`,
          )
          const page = await render(link.type, lang, target.search.slice(1))
          if (target.hash)
            assert(
              page.html.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`),
              `${key}: destination anchor is absent`,
            )
        }
    }
}

function checkCommonQuestNavigation() {
  const saved = { location: globalThis.location, document: globalThis.document }
  try {
    for (const lang of ['en', 'ja', 'th'])
      for (const directory of ['catalogue', 'research']) {
        const suffix = lang === 'en' ? '' : `.${lang}`
        const current = new URL(
          `https://example.test/kawa-no-nushi-tsuri-2-research/${directory}/index${suffix}.html?stage=4&fish=03&route=float#some-section`,
        )
        const initial = `${directory === 'research' ? '../catalogue/' : ''}quests${suffix}.html`
        const link = { dataset: { compendiumDestination: '4' }, getAttribute: () => initial }
        globalThis.location = current
        globalThis.document = { querySelector: () => null, querySelectorAll: () => [link] }
        updateNavigation({})
        const target = new URL(link.href, current)
        assert(target.pathname.endsWith(`quests${suffix}.html`))
        for (const [key, value] of Object.entries({ stage: '4', fish: '03', route: 'float' }))
          assert.equal(target.searchParams.get(key), value)
        const back = new URL(target.searchParams.get('return'), target)
        assert.equal(
          back.href,
          current.href,
          'Quest navigation returns to the wrong catalogue/research page',
        )
      }
  } finally {
    for (const [key, value] of Object.entries(saved)) {
      if (value === undefined) delete globalThis[key]
      else globalThis[key] = value
    }
  }
}

function checkGeneratedNavigation(ctx, dom, location, stage) {
  const template = fs.readFileSync(
    `${root}/${ctx.pathname.replace('/kawa-no-nushi-tsuri-2-research/', '')}`,
    'utf8',
  )
  assert.equal((template.match(/data-compendium-destination="4"/g) || []).length, 1)
  assert.match(template, /aria-current="page"/)
  for (const locale of ['en', 'ja', 'th']) {
    const target = new URL(dom.nodes[`language-${locale}`].href, location)
    const suffix = locale === 'en' ? '' : `.${locale}`
    assert(target.pathname.endsWith(`quests${suffix}.html`))
    assert.equal(target.searchParams.get('stage'), String(stage))
    assert.equal(target.hash, location.hash)
    assert(target.searchParams.get('return').includes(`maps${suffix}.html`))
  }
}
