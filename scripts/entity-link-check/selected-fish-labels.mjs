import assert from 'node:assert/strict'
import { data, renderCatalogue, unescapeHtml, validate } from './shared.mjs'

const locales = ['en', 'ja', 'th']
const cases = [
  {
    query: '?category=all&fish=06#catalogue',
    expected: {
      en: ['Items compatible with', 'ROM compatibility check', 'not guaranteed'],
      ja: ['の条件に合うアイテム', 'ROM条件', '保証されません'],
      th: ['รายการที่ผ่านเงื่อนไขของ', 'เงื่อนไขจาก ROM', 'ไม่ได้ยืนยัน'],
    },
    forbidden: { en: 'Baits and rigs', ja: 'エサ・仕掛け', th: 'แสดงเหยื่อที่ผ่าน' },
  },
  {
    query: '?category=flymaker&part=fly&fish=06#catalogue',
    expected: {
      en: ['fly bodies', 'body-profile check', 'not guaranteed'],
      ja: ['フライボディ', 'ボディプロフィール判定', '保証されません'],
      th: ['บอดี้ฟลาย', 'เงื่อนไขโปรไฟล์', 'ไม่ได้รับประกัน'],
    },
    forbidden: { en: 'baits that pass', ja: 'エサ', th: 'เหยื่อที่ผ่าน' },
  },
  {
    query: '?category=flymaker&part=fly_wing&fish=06#catalogue',
    expected: {
      en: ['parts sold with a body that passes', 'bite bonus is not established'],
      ja: ['ボディと一緒に販売される部品', '食いつき向上は未確認'],
      th: ['ชิ้นส่วนที่ร้านขายพร้อมบอดี้', 'ไม่ได้ยืนยันว่าปีกหรือหางเพิ่มโอกาสกิน'],
    },
    forbidden: { en: 'baits that pass', ja: 'エサ', th: 'เหยื่อที่ผ่าน' },
    requiresCards: true,
  },
  {
    query: '?category=flymaker&part=fly_tail&fish=06#catalogue',
    expected: {
      en: ['parts sold with a body that passes', 'bite bonus is not established'],
      ja: ['ボディと一緒に販売される部品', '食いつき向上は未確認'],
      th: ['ชิ้นส่วนที่ร้านขายพร้อมบอดี้', 'ไม่ได้ยืนยันว่าปีกหรือหางเพิ่มโอกาสกิน'],
    },
    forbidden: { en: 'baits that pass', ja: 'エサ', th: 'เหยื่อที่ผ่าน' },
    requiresCards: true,
  },
  {
    query: '?category=bait&fish=06&route=float#catalogue',
    route: 'float',
    expected: {
      en: ['Showing baits that pass the selected fish’s conditions'],
      ja: ['選んだ魚の条件に合うエサを表示'],
      th: ['แสดงเหยื่อที่ผ่านเงื่อนไขของปลาที่เลือก'],
    },
    forbidden: { en: 'fly bodies', ja: 'フライボディ', th: 'บอดี้ฟลาย' },
  },
  {
    query: '?category=bait&fish=06&route=sinker#catalogue',
    route: 'sinker',
    expected: {
      en: ['Showing baits that pass the selected fish’s conditions'],
      ja: ['選んだ魚の条件に合うエサを表示'],
      th: ['แสดงเหยื่อที่ผ่านเงื่อนไขของปลาที่เลือก'],
    },
    forbidden: { en: 'fly bodies', ja: 'フライボディ', th: 'บอดี้ฟลาย' },
  },
]

for (const locale of locales) {
  for (const testCase of cases) {
    const { nodes, runtime, url } = await renderCatalogue(locale, testCase.query)
    const title = nodes['category-title']?.textContent || ''
    const status = nodes['fish-status']?.textContent || ''
    const output = `${title} ${status}`
    for (const phrase of testCase.expected[locale])
      assert(output.includes(phrase), `${locale} missing “${phrase}” for ${testCase.query}`)
    assert(
      !output.includes(testCase.forbidden[locale]),
      `${locale} has a mismatched selected-fish label for ${testCase.query}`,
    )
    if (testCase.route) assert.equal(runtime.baitRoute, testCase.route)
    if (testCase.requiresCards)
      assert(nodes.cards.innerHTML.includes('<article'), `No result cards for ${testCase.query}`)
    validate(nodes.cards?.innerHTML || '', url)
  }
}

const decisionItem = data.items.find((item) => item.rodDecision?.reason?.en)
assert(decisionItem, 'No rod decision available for duplicate-reason guard')
for (const locale of locales) {
  const { nodes, url } = await renderCatalogue(locale, '?category=rod#catalogue')
  const markup = unescapeHtml(nodes.cards.innerHTML)
  const marker = `id="item-${decisionItem.category}-${decisionItem.id}"`
  const markerIndex = markup.indexOf(marker)
  assert(markerIndex >= 0, `Decision item card missing in ${locale}`)
  const start = markup.lastIndexOf('<article', markerIndex)
  const end = markup.indexOf('</article>', markerIndex) + '</article>'.length
  const card = markup.slice(start, end)
  const reason = decisionItem.rodDecision.reason[locale]
  const occurrences = card.split(reason).length - 1
  assert.equal(occurrences, 1, `${locale} decision reason appears ${occurrences} times in its card`)
  validate(card, url)
}

console.log(
  'PASS: selected-fish labels are category-accurate in EN/JA/TH for all, fly parts, and both bait routes; decision reasons render once.',
)
