import assert from 'node:assert/strict'
import { data, unescapeHtml } from './shared.mjs'
import { shopFishContext, shopCompatibilityBadge } from '../../src/pages/shops/player-decision.js'

const relevant = ['all', 'bait', 'lure', 'fly']
const unrelated = ['food', 'rod', 'general_tool', 'hook', 'float_weight', 'fly_wing', 'fly_tail']
const instructions = {
  en: /Check (?:the marks|them) before buying/,
  ja: /購入前に印を確認|購入前に確認/,
  th: /ดูป้ายก่อนซื้อ/,
}
const categoryAdvice = {
  en: {
    rod: /(?=.*fishing method)(?=.*buying advice for this area)(?=.*price)(?=.*time to aim)(?=.*line strength)(?=.*not catch success)/,
    hook: /hook for your setup.*use advice.*price/,
    float_weight: /float or sinker.*compare prices/,
    food: /HP.*price.*recovery.*quest/,
    general_tool: /action or quest use.*where to use/,
    fly_wing: /ready-made fly bundles.*whole bundle/,
    fly_tail: /ready-made fly bundles.*whole bundle/,
  },
  ja: {
    rod: /(?=.*釣り方)(?=.*このエリア)(?=.*購入アドバイス)(?=.*価格)(?=.*狙う時間)(?=.*糸の切れにくさ)(?=.*釣果の順位ではありません)/,
    hook: /仕掛け.*使い方と価格/,
    float_weight: /ウキやオモリ.*価格と使い方/,
    food: /HPと価格.*回復量.*イベント用途/,
    general_tool: /操作やイベント用途.*使う場所/,
    fly_wing: /完成毛バリ.*セット全体/,
    fly_tail: /完成毛バリ.*セット全体/,
  },
  th: {
    rod: /(?=.*วิธีตก)(?=.*คำแนะนำซื้อ)(?=.*ด่านนี้)(?=.*ราคา)(?=.*เวลาเล็ง)(?=.*สายขาดยาก)(?=.*ไม่ใช่อันดับโอกาสตกสำเร็จ)/,
    hook: /เบ็ด.*ชุด.*คำแนะนำและราคา/,
    float_weight: /ทุ่นหรือตะกั่ว.*ราคาและคำแนะนำ/,
    food: /HP.*ราคา.*ฟื้น.*เควสต์/,
    general_tool: /ทำเควสต์.*ใช้ที่ไหน/,
    fly_wing: /ฟลายสำเร็จรูป.*ทั้งชุด/,
    fly_tail: /ฟลายสำเร็จรูป.*ทั้งชุด/,
  },
}
const baitNotes = {
  en: /Bait labels use the sinker route/,
  ja: /エサの判定はオモリ/,
  th: /ป้ายเหยื่อจริงใช้เส้นทางตะกั่ว/,
}
for (const lang of ['en', 'ja', 'th']) {
  for (const route of ['float', 'sinker', 'lure', 'fly']) {
    for (const stage of [1, 2, 3, 4, 5, 6]) {
      for (const category of [...relevant, ...unrelated]) checkContext(lang, route, stage, category)
    }
  }
}
console.log(
  'PASS: selected shop fish retains a profile action while fish-check instructions match all category, route, area and locale contexts.',
)

function checkContext(lang, route, stage, category) {
  const ctx = context(lang, route, stage, category)
  const html = shopFishContext(ctx)
  const applies = relevant.includes(category)
  assert.match(html, new RegExp(`data-shop-context-category="${category}"`))
  assert.match(
    html,
    new RegExp(`data-fish-check-guidance="${applies ? 'shown' : 'not-applicable'}"`),
  )
  const text = unescapeHtml(html)
  if (applies) assert.match(text, instructions[lang])
  else
    assert.doesNotMatch(
      text,
      instructions[lang],
      'Do not direct unrelated offers to nonexistent marks',
    )
  if (['all', 'bait'].includes(category)) assert.match(text, baitNotes[lang])
  else assert.doesNotMatch(text, baitNotes[lang])
  const href = html.match(/class="shop-fish-profile-link" href="([^"]+)"/)?.[1]
  assert(href, 'Category change lost fish profile')
  const target = new URL(unescapeHtml(href), 'https://example.test/catalogue/shops.html')
  assert.equal(target.searchParams.get('id'), '06')
  assert.equal(target.searchParams.get('stage'), String(stage))
  assert.equal(target.searchParams.get('route'), route)
  assert.equal(target.searchParams.get('return'), ctx.targetReturn())
  if (!applies) {
    assert.match(text, categoryAdvice[lang][category], 'Missing actionable category advice')
    for (const item of data.items.filter((entry) => entry.category === category)) {
      assert.equal(
        shopCompatibilityBadge(ctx, item, ''),
        '',
        'Unrelated item must not get fake check badges',
      )
    }
  }
}

function context(lang, route, stage, category) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  return {
    lang,
    selectedFish: '06',
    selectedRig: route,
    fishVisuals: data.fishVisuals,
    $: (id) => ({ value: id === 'category-select' ? category : String(stage) }),
    targetReturn: () =>
      `shops${suffix}.html?stage=${stage}&category=${category}&fish=06&route=${route}#regular-stock`,
    pages: { fish: { [lang]: `fish${suffix}.html` } },
    text: { stageWord: (value) => String(value) },
    esc: (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;'),
    imagePath: (value) => value,
  }
}
