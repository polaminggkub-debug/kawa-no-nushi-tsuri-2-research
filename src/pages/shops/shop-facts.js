// "Good to know before you buy": shop rules that apply to every area, drawn from the six shops
// that were opened in the game. Special rod merchants are read from the stock data.
const NEVER_SOLD = [
  ['rod', '02'],
  ['rod', '06'],
  ['rod', '0B'],
  ['rod', '11'],
  ['fly_wing', '25'],
  ['fly_wing', '66'],
  ['fly_wing', '67'],
  ['food', '09'],
  ['food', '0A'],
  ['general_tool', '01'],
  ['general_tool', '02'],
]

const COPY = {
  th: {
    heading: 'ข้อควรรู้ก่อนซื้อ',
    stack:
      '<strong>เหยื่อและเบ็ดคิดราคาต่อ 1 ชุด (9 ชิ้น)</strong> ถ้าเหลืออยู่ 8 ชิ้นก็ยังจ่ายเต็มราคา แล้วเกมเติมให้ครบ 9',
    special:
      '<strong>บางด่านมีร้านคันเบ็ดพิเศษเพิ่มอีกร้านในเมือง</strong> ขายคันที่ร้านทั่วไปไม่มี:',
    stage: (n) => `ด่าน ${n}`,
    price: (n) => `¥${n}`,
    flyRod: '<strong>ด่าน 6 ไม่มีขายคันฟลาย</strong> ให้ซื้อในด่าน 1–5 ก่อน',
    decoy:
      '<strong>ปลาอายุเหยื่อล่อ</strong>จะโผล่ในร้านด่าน 3 หลังจากขายปลาอายุจากข้องไปอย่างน้อย 1 ตัวเท่านั้น',
    maker:
      '<strong>ฟลายประกอบเอง</strong>มีช่างทำเฉพาะในเมืองด่าน 1–3 และคิดราคาบอดี้ + ปีก + หาง ส่วนฟลายสำเร็จรูปคิดแค่ราคาบอดี้ (ด่าน 4–6 มีเฉพาะสำเร็จรูป)',
    never: '<strong>ไม่มีขายที่ไหนเลย:</strong>',
    neverHow: 'เห็ดหาได้จากการใช้แว่นขยายค้นหา ส่วนกะละมังกับเรือแคนูได้จากการแลกของในเควสต์',
  },
  en: {
    heading: 'Good to know before you buy',
    stack:
      '<strong>Bait and hooks are priced per stack of 9.</strong> With 8 left you still pay in full, and the game tops you up to 9.',
    special:
      '<strong>Some areas have a second, special rod merchant in town.</strong> It sells rods the regular shop does not:',
    stage: (n) => `Area ${n}`,
    price: (n) => `¥${n.toLocaleString('en-US')}`,
    flyRod: '<strong>Area 6 sells no fly rod.</strong> Buy yours in Areas 1 to 5.',
    decoy:
      '<strong>Decoy Ayu</strong> appears in the Area 3 shop only after you have sold an Ayu from your keepnet.',
    maker:
      '<strong>Custom flies</strong> are built only by the fly makers in the Area 1 to 3 towns, and cost body + wing + tail. A ready-made fly set costs only its body price (Areas 4 to 6 have ready-made sets only).',
    never: '<strong>Never sold anywhere:</strong>',
    neverHow:
      'Mushrooms come from searching with the magnifying glass; the wash tub and the canoe come from quest trades.',
  },
  ja: {
    heading: '購入前に知っておくこと',
    stack:
      '<strong>エサとハリの値段は9個1組の価格です。</strong>8個残っていても全額かかり、9個まで補充されます。',
    special:
      '<strong>町に専用竿の店がもう1軒あるエリアがあります。</strong>通常の店にない竿を売っています：',
    stage: (n) => `エリア${n}`,
    price: (n) => `${n.toLocaleString('ja-JP')}円`,
    flyRod:
      '<strong>エリア6にはフライロッドが売っていません。</strong>エリア1〜5で買ってください。',
    decoy:
      '<strong>おとりアユ</strong>は、びくのアユを1匹以上売ったあとにだけエリア3の店に並びます。',
    maker:
      '<strong>自作の毛バリ</strong>はエリア1〜3の町の職人だけが作れて、ボディ＋ウィング＋テールの合計がかかります。完成品セットはボディの値段だけです（エリア4〜6は完成品のみ）。',
    never: '<strong>どこでも売っていない物：</strong>',
    neverHow: 'キノコは虫メガネで探して入手し、タライとカヌーはイベントの交換で入手します。',
  },
}

function itemLink(ctx, item) {
  return `<a href="${ctx.esc(ctx.itemHref(item))}">${ctx.esc(ctx.itemName(item))}</a>`
}

function specialMerchants(ctx, c, items) {
  const byStage = new Map()
  for (const item of items)
    for (const shop of item.playerUse?.shops || [])
      if (shop.shop === 'special_rod_shop') {
        const stage = Number(shop.stage)
        byStage.set(stage, [...(byStage.get(stage) || []), item])
      }
  return [...byStage.entries()]
    .sort(([a], [b]) => a - b)
    .map(
      ([stage, rods]) =>
        `<li>${ctx.esc(c.stage(stage))}: ${rods
          .map((rod) => `${itemLink(ctx, rod)} ${ctx.esc(c.price(rod.priceYen))}`)
          .join(' · ')}</li>`,
    )
    .join('')
}

export function shopFactsHtml(ctx, items) {
  const c = COPY[ctx.lang] || COPY.en
  const never = NEVER_SOLD.map(([category, id]) => ctx.findItem(items, category, id))
    .filter(Boolean)
    .map((item) => `${itemLink(ctx, item)} <small>(ID ${ctx.esc(item.id)})</small>`)
    .join(' · ')
  return `<h2 id="shop-facts-heading">${ctx.esc(c.heading)}</h2><ul class="fact-list">
    <li>${c.stack}</li>
    <li>${c.special}<ul>${specialMerchants(ctx, c, items)}</ul></li>
    <li>${c.flyRod}</li>
    <li>${c.decoy}</li>
    <li>${c.maker}</li>
    <li>${c.never} ${never} <span class="muted">${ctx.esc(c.neverHow)}</span></li>
  </ul>`
}

export function renderShopFacts(ctx, items) {
  const box = ctx.$('shop-facts')
  if (box) box.innerHTML = shopFactsHtml(ctx, items)
}
