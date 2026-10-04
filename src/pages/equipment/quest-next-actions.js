const AKAME_ID = '37'
const FIREWORKS_ID = '16'

function itemMatches(item, id) {
  return item?.category === 'general_tool' && item.id === id
}

function localizedReturn(ctx) {
  return ctx.sourceReturn?.() || ''
}

function fishMapHref(ctx, point) {
  const column = Math.floor((point.x * 16 + 8) / 384) + 1
  const row = Math.floor((point.y * 16 + 8) / 384) + 1
  const query = new URLSearchParams({
    stage: '6',
    fish: AKAME_ID,
    section: `s6-c${column}-r${row}`,
  })
  const returned = localizedReturn(ctx)
  if (returned) query.set('return', returned)
  return `${ctx.detailFile('maps')}?${query}`
}

function fireworksShopHref(ctx) {
  const query = new URLSearchParams({
    stage: '4',
    place: 'town',
    category: 'general_tool',
    id: FIREWORKS_ID,
  })
  const returned = localizedReturn(ctx)
  if (returned) query.set('return', returned)
  return `${ctx.detailFile('shops')}?${query}`
}

function candleCardAction(ctx, item) {
  if (!itemMatches(item, '12')) return ''
  const locations = ctx.fishLocations?.[AKAME_ID]?.locations || []
  const point = locations
    .find((entry) => Number(entry.stage) === 6)
    ?.points?.find((entry) => entry.x === 37 && entry.y === 29)
  if (!point) return ''
  const text = {
    th: {
      title: 'เบาะแสหลังส่งเทียน · ตัวละครเซฟ 1',
      body: `บทพูดชี้ไปทางตะวันตกเฉียงเหนือแต่ไม่ระบุช่องตกปลา; ตารางจุดเกิดปลาใน ROM แยกต่างหากวางอาคาเมะไว้ที่ด่าน 6 X ${point.x}, Y ${point.y} หนึ่งจุด ซึ่งบางรอบอาจไม่ทำงาน`,
      profile: 'ดูข้อมูลอาคาเมะ',
      map: 'ดูจุดนี้บนแผนที่',
    },
    ja: {
      title: 'ロウソクの後の手掛かり · セーブキャラクター1',
      body: `台詞は北西を示しますが釣りタイルは示しません。別に解析したROMの出現表ではアカメの地点はエリア6、X ${point.x}, Y ${point.y}の1か所です。生成状態によって無効な場合があります。`,
      profile: 'アカメの情報を見る',
      map: 'この地点を地図で見る',
    },
    en: {
      title: 'Candle clue · saved character 1',
      body: `The dialogue points northwest but does not specify a fishing tile. The separate ROM spawn table places Akame at Area 6, X ${point.x}, Y ${point.y}; this one configured slot can be inactive in some generated states.`,
      profile: 'Open the Akame profile',
      map: 'See this map point',
    },
  }[ctx.lang]
  return `<div class="card-quest-next-action" data-quest-next-action="candle-akame"><strong>${ctx.esc(text.title)}</strong><p>${ctx.esc(text.body)}</p><p><a data-quest-fish-profile href="${ctx.esc(ctx.fishHref(AKAME_ID))}">${ctx.esc(text.profile)} ↗</a> · <a data-quest-fish-map href="${ctx.esc(fishMapHref(ctx, point))}">${ctx.esc(text.map)} ↗</a></p></div>`
}

function fireworksCardAction(ctx, item) {
  if (!itemMatches(item, FIREWORKS_ID)) return ''
  const text = {
    th: {
      title: 'ใช้ผิดจุดแล้วต้องหาอีก?',
      body: 'ร้านเมืองด่าน 4 มีรายการดอกไม้ไฟในตาราง ROM ราคา ¥50; ยังยืนยันไม่ได้ว่าซื้อซ้ำได้ไม่จำกัด',
      shop: 'ตรวจรายการขายด่าน 4',
    },
    ja: {
      title: '別の場所で使い、もう1つ必要？',
      body: 'ROMの店在庫表にはエリア4の町で花火が50円と記録されています。無制限に買い直せるかは未確認です。',
      shop: 'エリア4の販売品を確認',
    },
    en: {
      title: 'Used it at the wrong spot and need another?',
      body: 'The ROM stock table lists fireworks in the Area 4 town shop for ¥50; unlimited repeat purchases are not verified.',
      shop: 'Check Area 4 shop stock',
    },
  }[ctx.lang]
  return `<div class="card-quest-next-action" data-quest-next-action="fireworks-recovery"><strong>${ctx.esc(text.title)}</strong><p>${ctx.esc(text.body)}</p><p><a data-quest-fireworks-shop href="${ctx.esc(fireworksShopHref(ctx))}">${ctx.esc(text.shop)} ↗</a></p></div>`
}

function notebookCardAction(ctx, item) {
  if (!itemMatches(item, '05')) return ''
  const text = {
    th: {
      title: 'อยากเก็บปลาให้ครบสมุด?',
      body: 'สมุดนับหนึ่งรายการต่อปลาหนึ่งชนิด ดูปลาใหม่กับปลาที่ซ้ำในแต่ละด่าน แล้วติ๊กตามที่เช็กได้ในเกม',
      link: 'เปิดรายการเช็กสมุดแยกตามด่าน',
    },
    ja: {
      title: '釣りノートを全部埋めたい？',
      body: 'ノートは魚種ごとに1件です。エリアごとの新規・重複対象を見て、ゲーム内で確認した魚にチェックできます。',
      link: 'エリア別のノート一覧を開く',
    },
    en: {
      title: 'Want to complete the fishing notebook?',
      body: 'The notebook keeps one entry per species. See new and repeated fish in each area, then mark what you have checked in the game.',
      link: 'Open the area-by-area notebook checklist',
    },
  }[ctx.lang]
  const query = new URLSearchParams({ stage: String(ctx.locationStage || 1) })
  const returnPath = ctx.sourceReturn?.()
  if (returnPath) query.set('return', returnPath)
  const href = `${ctx.detailFile('maps')}?${query}#notebook-guide`
  return `<aside class="card-quest-next-action notebook-card-action" data-notebook-item-action><strong>${ctx.esc(text.title)}</strong><p>${ctx.esc(text.body)}</p><p><a class="notebook-guide-link" href="${ctx.esc(href)}">${ctx.esc(text.link)} ↗</a></p></aside>`
}

export function questNextActions(ctx, item) {
  return [
    candleCardAction(ctx, item),
    fireworksCardAction(ctx, item),
    notebookCardAction(ctx, item),
  ]
    .filter(Boolean)
    .join('')
}
