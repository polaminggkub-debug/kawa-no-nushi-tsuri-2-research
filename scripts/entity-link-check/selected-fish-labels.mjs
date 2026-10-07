import assert from 'node:assert/strict'
import { data, renderCatalogue, unescapeHtml, validate } from './shared.mjs'

const locales = ['en', 'ja', 'th']
const cases = [
  {
    query: '?category=all&fish=06#catalogue',
    expected: {
      en: ['Items compatible with', 'float or lure is on its tile'],
      ja: ['の条件に合うアイテム', 'ウキやルアーが魚と同じマスにあれば'],
      th: ['รายการที่ผ่านเงื่อนไขของ', 'ทุ่นหรือลัวร์อยู่ช่องเดียวกับปลา'],
    },
    forbidden: { en: 'Baits and rigs', ja: 'エサ・仕掛け', th: 'แสดงเหยื่อที่ผ่าน' },
  },
  {
    query: '?category=flymaker&part=fly&fish=06#catalogue',
    expected: {
      en: ['fly bodies', 'fresh save', 'group-1 bodies'],
      ja: ['フライボディ', '新規セーブ', 'グループ1'],
      th: ['บอดี้ที่ปลานี้กิน', 'เซฟใหม่', 'บอดี้กลุ่ม 1'],
    },
    forbidden: { en: 'baits that pass', ja: 'エサ', th: 'เหยื่อที่ผ่าน' },
  },
  {
    query: '?category=flymaker&part=fly_wing&fish=06#catalogue',
    expected: {
      en: [
        'wings and tails sold with a body this fish takes',
        'only a ticket past the save’s lock',
      ],
      ja: ['ボディと一緒に売られる部品', 'ロックを通るためだけ'],
      th: ['ปีกและหางที่มากับชุดสำเร็จรูป', 'ผ่านล็อกของเซฟ'],
    },
    forbidden: { en: 'baits that pass', ja: 'エサ', th: 'เหยื่อที่ผ่าน' },
    requiresCards: true,
  },
  {
    query: '?category=flymaker&part=fly_tail&fish=06#catalogue',
    expected: {
      en: [
        'wings and tails sold with a body this fish takes',
        'only a ticket past the save’s lock',
      ],
      ja: ['ボディと一緒に売られる部品', 'ロックを通るためだけ'],
      th: ['ปีกและหางที่มากับชุดสำเร็จรูป', 'ผ่านล็อกของเซฟ'],
    },
    forbidden: { en: 'baits that pass', ja: 'エサ', th: 'เหยื่อที่ผ่าน' },
    requiresCards: true,
  },
  {
    query: '?category=bait&fish=06&route=float#catalogue',
    route: 'float',
    expected: {
      en: ['Showing baits on the selected fish’s list'],
      ja: ['選んだ魚のリストにあるエサを表示'],
      th: ['แสดงเหยื่อที่อยู่ในรายชื่อของปลาที่เลือก'],
    },
    forbidden: { en: 'fly bodies', ja: 'フライボディ', th: 'บอดี้ฟลาย' },
  },
  {
    query: '?category=bait&fish=06&route=sinker#catalogue',
    route: 'sinker',
    expected: {
      en: ['Showing baits on the selected fish’s list'],
      ja: ['選んだ魚のリストにあるエサを表示'],
      th: ['แสดงเหยื่อที่อยู่ในรายชื่อของปลาที่เลือก'],
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
