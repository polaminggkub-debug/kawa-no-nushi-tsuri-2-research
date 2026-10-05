const EEL_ID = '3B'
const EEL_POINT = { stage: 6, x: 41, y: 8 }

const copy = {
  th: {
    title: 'ถ้าคำขอจากหมอปรากฏ',
    body: 'ถ้าอ่านโปสต์การ์ดที่ได้รับแล้วเห็นคำขอให้ตกปลาไหลใหญ่ ให้เปิดข้อมูลโปสต์การ์ดเพื่อดูเบาะแสด่าน 6 ก่อนออกไปตก',
    link: 'เปิดข้อมูลโปสต์การ์ดที่ได้รับ',
    afterCatch:
      'จับตามคำขอได้แล้ว ให้เก็บปลาไหลไว้และกลับหมู่บ้านเริ่มต้น หากเงื่อนไขเนื้อเรื่องครบ เกมจะเริ่มฉากช่วยหมอและฉากจบอัตโนมัติ',
    returnMap: 'ดูทางกลับหมู่บ้าน · ด่าน 1 (12,189)',
    limit: 'จุดตกที่กำหนดอาจไม่มีปลาในรอบนี้',
  },
  ja: {
    title: '医者の依頼が表示された場合',
    body: '受け取ったはがきを読み、大ウナギを釣る依頼が表示されたら、釣りに行く前にエリア6の手掛かりをはがき情報で確認してください。',
    link: '受け取ったはがきの情報を見る',
    afterCatch:
      '依頼の魚を釣ったら、ウナギを残して最初の村へ戻ってください。物語の条件がそろうと、医者の回復とエンディングの自動シーンが始まります。',
    returnMap: '最初の村への入口 · エリア1 (12,189)',
    limit: '設定された釣り場に魚がいない場合もあります。',
  },
  en: {
    title: 'If the doctor’s request appears',
    body: 'If you read Received Postcard 06 and see the doctor’s giant-eel request, open the postcard guidance for the Area 6 clue before fishing.',
    link: 'Open Received Postcard guidance',
    afterCatch:
      'After catching the requested eel, keep it and return to the starting village. When the story conditions are complete, the doctor-recovery and ending scene starts automatically.',
    returnMap: 'Starting-village entrance · Area 1 (12,189)',
    limit: 'The configured fishing point may be inactive.',
  },
}

function eelPointConfigured(locationData) {
  const fish = locationData?.fish || locationData || {}
  const locations = fish[EEL_ID]?.locations || []
  return locations.some(
    (location) =>
      Number(location.stage) === EEL_POINT.stage &&
      (location.points || []).some(
        (point) => Number(point.x) === EEL_POINT.x && Number(point.y) === EEL_POINT.y,
      ),
  )
}

function postcardHref(ctx) {
  const query = new URLSearchParams({ category: 'general_tool', id: '06', stage: '6' })
  query.set('return', ctx.currentFishPath('6'))
  return `${ctx.itemPath()}?${query.toString()}`
}

function returnVillageHref(ctx) {
  const query = new URLSearchParams({ stage: '1', section: 's1-c1-r8', action: 'eel-return' })
  query.set('return', ctx.currentFishPath('6'))
  return `${ctx.mapPath()}?${query}#map-view`
}

export function renderEelQuestContext(ctx, locationData) {
  if (ctx.id !== EEL_ID || !eelPointConfigured(locationData)) return ''
  const text = copy[ctx.locale] || copy.en
  return `<aside class="detail-section fish-quest-context" data-fish-quest-context="postcard-eel"><h2>${ctx.escapeHtml(text.title)}</h2><p>${ctx.escapeHtml(text.body)}</p><p><a class="route-button" data-fish-postcard-link href="${ctx.escapeHtml(postcardHref(ctx))}">${ctx.escapeHtml(text.link)} ↗</a></p><p data-eel-ending-action>${ctx.escapeHtml(text.afterCatch)}</p><p><a class="route-button" data-eel-return-map href="${ctx.escapeHtml(returnVillageHref(ctx))}">${ctx.escapeHtml(text.returnMap)} ↗</a></p><p>${ctx.escapeHtml(text.limit)}</p></aside>`
}
