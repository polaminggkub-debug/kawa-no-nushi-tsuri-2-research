function shopLink(ctx, item, stage, area) {
  const query = new URLSearchParams({
    stage: String(stage),
    place: 'town',
    category: item.category,
    id: item.id,
    return: ctx.sourceReturn(),
  })
  const fish = document.getElementById('fish-filter').value
  if (ctx.fishingContext(item) && fish) {
    query.set('fish', fish)
    query.set('route', ctx.baitRoute)
  }
  const href = `${ctx.detailFile('shops')}?${query}`
  return `<a href="${ctx.esc(href)}">${ctx.esc(area + ' ' + stage)} ↗</a>`
}

function stageLinks(ctx, item, shops, predicate, area) {
  const stages = [...new Set(shops.filter(predicate).map((shop) => shop.stage))]
  return stages.map((stage) => shopLink(ctx, item, stage, area)).join(' · ')
}

function shopCondition(ctx, shops) {
  if (!shops.some((shop) => shop.condition)) return ''
  return ctx.lang === 'th'
    ? 'ขายปลาอายุจากข้องอย่างน้อย 1 ตัวก่อนเพื่อให้เหยื่อล่อปลาอายุปรากฏในร้านด่าน 3 เมื่อซื้อ จำนวนในช่องเต็มเป็น 9 ชิ้น และจำนวนปลาอายุที่ขายสะสมลดลง 9 (ต่ำสุด 0) ถ้าสินค้าหายจากเมนู ให้ขายปลาอายุเพิ่ม'
    : ctx.lang === 'ja'
      ? 'びくからアユを1匹以上売るとエリア3でオトリアユが販売される。購入で所持数は9個、売却数カウンターは9減る（最低0）。消えたらアユを追加で売る。'
      : 'Sell at least one Ayu from your keepnet to enable decoy Ayu in area 3. Buying sets the stack to 9 and reduces the sold-Ayu counter by 9 (minimum 0). If the offer disappears, sell more Ayu.'
}

function bundleParts(ctx, bundle) {
  return [
    ['fly', bundle.body],
    ['fly_wing', bundle.wing],
    ['fly_tail', bundle.tail],
  ]
    .filter(([, id]) => id !== '00')
    .map(([category, id]) =>
      ctx.allItems.find((item) => item.category === category && item.id === id),
    )
    .filter(Boolean)
}

function flyBundleMarkup(ctx, parts, stage, price, area) {
  const images = parts
    .map(
      (part) =>
        `<a href="${ctx.esc(ctx.itemHref(part))}"><img loading="lazy" src="${ctx.esc(part.image)}" alt="${ctx.esc(ctx.itemName(part))}" title="${ctx.esc(ctx.itemName(part))} ID ${part.id}"></a>`,
    )
    .join('')
  const names = parts
    .map(
      (part) =>
        `<a href="${ctx.esc(ctx.itemHref(part))}">${ctx.esc(ctx.itemName(part))} (${part.id})</a>`,
    )
    .join(' + ')
  return `<div><strong>${area} ${stage} · ¥${price}</strong><p>${images}</p><small>${names}</small></div>`
}

function flyBundles(ctx, item, shops, area) {
  if (!item.category.startsWith('fly')) return ''
  const title =
    ctx.lang === 'th'
      ? 'ดูชุดฟลายสำเร็จรูปและราคาทั้งชุด'
      : ctx.lang === 'ja'
        ? '店売り毛バリの組み合わせと価格'
        : 'Ready-made fly combinations and full prices'
  const bundles = shops
    .filter((shop) => shop.bundle)
    .map((shop) => {
      const parts = bundleParts(ctx, shop.bundle)
      return flyBundleMarkup(ctx, parts, shop.stage, shop.bundle.shopPriceYen, area)
    })
    .join('')
  return `<details class="bundle-offers"><summary>${title}</summary>${bundles}</details>`
}

function missingShopMessage(ctx) {
  return ctx.lang === 'th'
    ? 'ไม่พบรหัสนี้ในสต็อกร้านทั้ง 6 ด่านที่ถอดได้ จึงยังไม่มีจุดซื้อให้แนะนำสำหรับชิ้นนี้'
    : ctx.lang === 'ja'
      ? '復号した全6エリアの店の在庫にはこのIDがなく、この部品の購入場所は案内できない。'
      : 'This ID is absent from the decoded stocks of all six area shops, so no purchase location is listed for this record.'
}

function emptyShopLocations(ctx, item) {
  if (!Object.hasOwn(ctx.useOf(item), 'shops') || !['rod', 'float_weight'].includes(item.category))
    return ''
  return `<div class="shop-locations"><p>${missingShopMessage(ctx)}</p></div>`
}

export function shopLocations(ctx, item) {
  const shops = ctx.useOf(item).shops || []
  if (!shops.length) return emptyShopLocations(ctx, item)
  const area = ctx.lang === 'th' ? 'ด่าน' : ctx.lang === 'ja' ? 'エリア' : 'Area'
  const regular = stageLinks(ctx, item, shops, (shop) => shop.shop !== 'special_rod_shop', area)
  const special = stageLinks(ctx, item, shops, (shop) => shop.shop === 'special_rod_shop', area)
  const regularLabel = item.category.startsWith('fly')
    ? ctx.lang === 'th'
      ? 'ชิ้นส่วนนี้อยู่ในชุดฟลายสำเร็จรูปที่ร้านขาย'
      : ctx.lang === 'ja'
        ? 'この部品を含む店売り毛バリ'
        : 'Part included in a ready-made fly sold by the shop'
    : ctx.lang === 'th'
      ? 'ร้านค้าในเมือง'
      : ctx.lang === 'ja'
        ? '町の店'
        : 'Town shop'
  const specialLabel =
    ctx.lang === 'th'
      ? 'ร้านคันเบ็ดพิเศษในเมือง'
      : ctx.lang === 'ja'
        ? '町の専用竿店'
        : 'Special rod merchant in town'
  const condition = shopCondition(ctx, shops)
  const bundles = flyBundles(ctx, item, shops, area)
  return `<div class="shop-locations">${regular ? `<p>${regularLabel} · ${regular}</p>` : ''}${special ? `<p>${specialLabel} · ${special}</p>` : ''}${condition ? `<p>${condition}</p>` : ''}${bundles}</div>`
}
