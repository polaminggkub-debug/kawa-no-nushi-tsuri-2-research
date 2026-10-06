const copy = {
  th: {
    title: 'หาเหยื่อปั้นในเมืองแทนการหาร้านขาย',
    body: 'ถ้ามีแว่นขยาย 03: เข้าเมืองทางเข้าลำดับที่ 2 ซึ่งพามา X7,Y29 หยุดเดินแล้วใช้แว่นขยายบนช่องที่ต่างจากช่องที่ใช้แว่นขยายครั้งก่อน กองเหยื่อเดิมต้องยังไม่เต็ม 9 หรือมีช่องเหยื่อว่าง ได้ 1–4 ชิ้นตามพื้นที่ว่างในกอง สูงสุด 9 ชิ้น ขยับช่องก่อนค้นซ้ำ',
    limit:
      'เมืองด่าน 6 ทดลองใช้สำเร็จ อีกห้าเมืองอ้างจากเงื่อนไขตำแหน่งเดียวกันใน ROM ไม่ใช่เส้นทางที่เดินทดลองครบทุกเมือง',
    town: 'ดูทางเข้าเมืองลำดับที่ 2',
    tool: 'ดูไอเท็มแว่นขยาย 03',
  },
  en: {
    title: 'Gather kneaded bait in town instead of looking for a shop',
    body: 'If you own magnifier 03, enter through the second recorded town entrance (arrival X7,Y29), stop and use it on a tile different from the last magnifier-use tile. Keep room in the existing stack or a free bait slot: the draw is 1–4 pieces, limited by remaining room in a stack capped at 9. Move to another tile before searching again.',
    limit:
      'Direct use succeeded in Area 6 town. The other five towns follow the same ROM position check; their walking routes were not all replayed.',
    town: 'Show the second town entrance',
    tool: 'View magnifier 03',
  },
  ja: {
    title: 'ネリエは店を探す代わりに町で採る',
    body: '虫めがね03を持っているなら、町の2番目の入口（到着X7,Y29）から入り、前回虫めがねを使ったタイルとは別のタイルで立ち止まって使う。エサ欄に空きを残す。1–4個を得るが、所持上限9までの空き数で制限される。再探索の前に別のタイルへ移動する。',
    limit:
      'エリア6の町で使用成功を確認。他の5町は同じROM位置条件に基づく。全ての町の歩行経路を再現したわけではない。',
    town: '町の2番目の入口を見る',
    tool: '虫めがね03を見る',
  },
}

export function townPasteBaitAction(ctx, item) {
  if (item.category !== 'bait' || item.id !== '0D') return ''
  const text = copy[ctx.lang] || copy.en
  const stage = String(ctx.selectedStage || 1)
  const suffix = ctx.lang === 'en' ? '' : `.${ctx.lang}`
  const query = new URLSearchParams({ stage, place: 'town', entrance: '1' })
  if (ctx.selectedFish) query.set('fish', ctx.selectedFish)
  if (ctx.selectedRoute) query.set('route', ctx.selectedRoute)
  query.set('return', ctx.currentLocalRoute())
  const town = `shops${suffix}.html?${query}#town-arrival-1`
  const tool = ctx.detailItemLink({ category: 'general_tool', id: '03' })
  return `<aside class="detail-section" data-town-paste-bait><h2>${ctx.esc(text.title)}</h2><p>${ctx.esc(text.body)}</p><p class="muted">${ctx.esc(text.limit)}</p><a class="route-button" data-paste-town href="${ctx.esc(town)}">${ctx.esc(text.town)} ↗</a><a class="route-button" href="${ctx.esc(tool)}">${ctx.esc(text.tool)} ↗</a></aside>`
}
