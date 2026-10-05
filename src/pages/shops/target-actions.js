const copy = {
  th: {
    title: 'ของที่คุณกำลังหาซื้อ',
    seller: 'ดูตำแหน่งคนขายและทางเข้าเมือง',
    offer: 'ดูสินค้าชิ้นนี้และเงื่อนไขซื้อ',
    bundle: 'ขายรวมในชุดฟลาย ไม่ได้ขายชิ้นนี้แยก',
    cheapestBundle: 'ชุดที่มีชิ้นนี้ ราคาต่ำสุด',
    price: 'ราคาซื้อใหม่',
  },
  en: {
    title: 'The item you came to buy',
    seller: 'Show seller and town entrance',
    offer: 'Show this offer and purchase conditions',
    bundle: 'Included in complete flies; not sold separately here',
    cheapestBundle: 'Lowest price for a bundle containing this part',
    price: 'New purchase price',
  },
  ja: {
    title: '探している購入品',
    seller: '販売場所と町への入口を見る',
    offer: 'この商品と購入条件を見る',
    bundle: '完成フライに含まれる部品で、ここでは単品販売ではありません',
    cheapestBundle: 'この部品を含む完成フライの最安価格',
    price: '新規購入価格',
  },
}

function actionHref(ctx, target, stage, place, hash) {
  return `${ctx.shopsUrl({ stage, place, category: target.category, id: target.id, q: '', entrance: '' }).split('#')[0]}${hash}`
}

export function targetActions(ctx, target, stage, found, bundles) {
  const text = copy[ctx.lang] || copy.en
  const name = ctx.esc(ctx.itemName(target))
  const title = `<h2>${ctx.esc(text.title)}</h2><a class="shop-target-item" href="${ctx.esc(ctx.itemHref(target))}"><img src="${ctx.esc(ctx.imagePath(target.image))}" alt=""><strong>${name}</strong><small>ID ${ctx.esc(target.id)}</small></a>`
  if (!found) return title
  const bundlePrice = bundles.length
    ? Math.min(...bundles.map((bundle) => bundle.shopPriceYen))
    : null
  const price = bundlePrice ?? target.priceYen
  const label = bundlePrice === null ? text.price : text.cheapestBundle
  const priceLine =
    price != null
      ? `<p>${ctx.esc(label)}: <strong>${ctx.esc(ctx.text.price(price))}</strong></p>`
      : ''
  const bundleNote = bundles.length ? `<p>${ctx.esc(text.bundle)}</p>` : ''
  const group = bundles.length
    ? 'bundle-stock'
    : ctx.isSpecial(target, stage)
      ? 'special-stock'
      : 'regular-stock'
  const sellerHref = actionHref(ctx, target, stage, 'town', '#location-section')
  const offerHref = actionHref(ctx, target, stage, 'town', `#${group}`)
  return `${title}${priceLine}${bundleNote}<nav class="shop-target-actions" aria-label="${ctx.esc(text.title)}"><a class="route-button" data-target-seller href="${ctx.esc(sellerHref)}">${ctx.esc(text.seller)} ↗</a><a class="route-button" data-target-offer href="${ctx.esc(offerHref)}">${ctx.esc(text.offer)} ↓</a></nav>`
}
