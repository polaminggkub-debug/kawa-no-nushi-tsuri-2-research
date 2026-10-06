const AKAME_ID = '37'
const FIREWORKS_ID = '16'
const EEL_ID = '3B'

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

function returnVillageHref(ctx) {
  const query = new URLSearchParams({ stage: '1', section: 's1-c1-r8', action: 'eel-return' })
  const returned = localizedReturn(ctx)
  if (returned) query.set('return', returned)
  return `${ctx.detailFile('maps')}?${query}#map-view`
}

function eelMapHref(ctx) {
  const query = new URLSearchParams({
    stage: '6',
    fish: EEL_ID,
    section: 's6-c2-r1',
  })
  const returned = localizedReturn(ctx)
  if (returned) query.set('return', returned)
  return `${ctx.detailFile('maps')}?${query}#map-view`
}

function eelProfileHref(ctx) {
  const [path, queryString = ''] = ctx.fishHref(EEL_ID).split('?')
  const query = new URLSearchParams(queryString)
  query.set('stage', '6')
  return `${path}?${query}`
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

function postcardCardAction(ctx, item) {
  if (!itemMatches(item, '06')) return ''
  const record = ctx.fishLocations?.[EEL_ID]?.locations?.find((entry) => Number(entry.stage) === 6)
  if (!record?.points?.some((point) => point.x === 41 && point.y === 8)) return ''
  const text = {
    th: {
      title: 'เมื่ออ่านแล้วพบจดหมายจากหมอให้ตกปลาไหลใหญ่',
      body: 'ถ้าพบข้อความนี้แล้ว ใช้เข็มทิศในด่าน 6 ดูทิศทาง หรือเปิดจุดบนแผนที่ด้านล่าง เลือกเหยื่อและอุปกรณ์จากหน้าปลาไหลใหญ่ก่อนออกไปตก',
      afterCatch:
        'จับตามคำขอได้แล้ว ให้เก็บปลาไหลไว้และกลับหมู่บ้านเริ่มต้น หากเงื่อนไขเนื้อเรื่องครบ เกมจะเริ่มฉากช่วยหมอและฉากจบอัตโนมัติ',
      returnMap: 'ดูทางกลับหมู่บ้าน · ด่าน 1 (12,189)',
      limit: 'จุดตกที่กำหนดอาจไม่มีปลาในรอบนี้',
      fish: 'ดูเหยื่อและอุปกรณ์ของปลาไหลใหญ่',
      map: 'ดูจุดด่าน 6 · X 41, Y 8',
    },
    ja: {
      title: '医者から大ウナギを釣る依頼が届いたら',
      body: 'この依頼を見たら、エリア6で磁石のオオウナギ項目を使うか、下の地図で地点を確認。釣りに行く前に魚のページで対応エサと道具を選んでください。',
      afterCatch:
        '依頼の魚を釣ったら、ウナギを残して最初の村へ戻ってください。物語の条件がそろうと、医者の回復とエンディングの自動シーンが始まります。',
      returnMap: '最初の村への入口 · エリア1 (12,189)',
      limit: '設定された釣り場に魚がいない場合もあります。',
      fish: 'オオウナギのエサと道具を見る',
      map: 'エリア6の地点 · X 41, Y 8',
    },
    en: {
      title: 'After reading the doctor’s request for a giant eel',
      body: 'Once this request appears, use its Area 6 Compass heading or open the map point below. Choose compatible bait and equipment from the fish profile before fishing.',
      afterCatch:
        'After catching the requested eel, keep it and return to the starting village. When the story conditions are complete, the doctor-recovery and ending scene starts automatically.',
      returnMap: 'Starting-village entrance · Area 1 (12,189)',
      limit: 'The configured fishing point may be inactive.',
      fish: 'See giant eel bait and equipment',
      map: 'Area 6 point · X 41, Y 8',
    },
  }[ctx.lang]
  return `<aside class="card-quest-next-action" data-quest-next-action="postcard-eel"><strong>${ctx.esc(text.title)}</strong><p>${ctx.esc(text.body)}</p><p><a class="route-button" data-quest-fish-profile href="${ctx.esc(eelProfileHref(ctx))}">${ctx.esc(text.fish)} ↗</a></p><p><a class="route-button" data-quest-fish-map href="${ctx.esc(eelMapHref(ctx))}">${ctx.esc(text.map)} ↗</a></p><p data-eel-ending-action>${ctx.esc(text.afterCatch)}</p><p><a class="route-button" data-eel-return-map href="${ctx.esc(returnVillageHref(ctx))}">${ctx.esc(text.returnMap)} ↗</a></p><p>${ctx.esc(text.limit)}</p></aside>`
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
    postcardCardAction(ctx, item),
    notebookCardAction(ctx, item),
  ]
    .filter(Boolean)
    .join('')
}
