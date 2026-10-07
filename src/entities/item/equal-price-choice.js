const COPY = {
  th: {
    title: 'ซื้อใหม่เพื่อใช้กับปลาหลายชนิด: ราคาเท่ากัน แต่รองรับปลามากกว่า',
    advice:
      'เลือกตัวเลือกนี้ถ้าอยากพกชิ้นที่ใช้ได้กว้างขึ้น รองรับปลาเดิมครบทุกสายตกที่เปรียบเทียบ ถ้ามีชิ้นเดิมและใช้กับปลาเป้าหมายได้แล้ว ให้ใช้ต่อได้',
    limit:
      'ปลากินเท่ากันเมื่อเหยื่ออยู่ในรายชื่อ แต่ถ้าชิ้นเดิมระบุชื่อปลาหรือเป็นลัวร์คนละกลุ่มขนาด ตอนเริ่มสู้จะไม่เหมือนกัน',
    area: (stage) => `ด่าน ${stage}`,
  },
  en: {
    title: 'Buying for more species: same price, broader fish coverage',
    advice:
      'Choose this option to carry an item with broader compatibility. It covers every original fish on each compared rig. Keep using the current item if you own it and it works for your target.',
    limit:
      'Both bite the same way once the fish is on its tile; a named bait or a different lure size class still changes how the fight starts.',
    area: (stage) => `Area ${stage}`,
  },
  ja: {
    title: '複数の魚を狙って買うなら：同じ価格で対応魚が多い候補',
    advice:
      '対応する魚を増やしたいなら、この候補を選べます。比較した各仕掛けで元の魚すべてに対応します。すでに持っていて対象魚に使える品は、そのまま使えます。',
    limit:
      '食いつきは同じです。ただし魚名つきのエサやルアーのサイズ区分が違えば、ファイトの開始値は変わります。',
    area: (stage) => `エリア${stage}`,
  },
}

function groupedOffers(ctx, item) {
  const stage = Number(ctx.locationStage || ctx.selectedStage)
  const groups = new Map()
  for (const [area, refs] of Object.entries(item.baitLureDecision?.equalPriceByStage || {})) {
    if (stage && Number(area) !== stage) continue
    for (const ref of refs) {
      const key = `${ref.category}:${ref.id}`
      const group = groups.get(key) || { ref, areas: [] }
      group.areas.push(Number(area))
      groups.set(key, group)
    }
  }
  return [...groups.values()]
}

function offerLinks(ctx, item, allItems) {
  const c = COPY[ctx.lang] || COPY.en
  return groupedOffers(ctx, item).flatMap(({ ref, areas }) => {
    const target = allItems.find((entry) => entry.category === ref.category && entry.id === ref.id)
    if (!target || target.priceYen !== item.priceYen) return []
    const names = { en: target.nameEn, ja: target.nameJa, th: target.nameTh }
    const name = target.playerUse?.displayName?.[ctx.lang] || names[ctx.lang] || target.nameJa
    const href = ctx.areaItemLink(target, areas[0])
    const label = `${name} (ID ${target.id}) · ¥${target.priceYen} · ${areas.map(c.area).join(', ')}`
    return [
      `<a data-equal-price-item="${ctx.esc(ref.category + ':' + ref.id)}" data-offer-stage="${areas[0]}" href="${ctx.esc(href)}">${ctx.esc(label)} ↗</a>`,
    ]
  })
}

export function equalPriceChoice(ctx, item, allItems, includeLimit = true) {
  const links = offerLinks(ctx, item, allItems)
  if (!links.length) return ''
  const c = COPY[ctx.lang] || COPY.en
  const limit = includeLimit ? `<p class="muted">${ctx.esc(c.limit)}</p>` : ''
  return `<aside data-equal-price-choice><h3>${ctx.esc(c.title)}</h3><p>${ctx.esc(c.advice)}</p><p>${links.join(' · ')}</p>${limit}</aside>`
}
