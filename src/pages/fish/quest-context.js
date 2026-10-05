const EEL_ID = '3B'
const EEL_POINT = { stage: 6, x: 41, y: 8 }

const copy = {
  th: {
    title: 'ถ้าคำขอจากหมอปรากฏ',
    body: 'ถ้าอ่านโปสต์การ์ดที่ได้รับแล้วเห็นคำขอให้ตกปลาไหลใหญ่ ให้เปิดข้อมูลโปสต์การ์ดเพื่อดูเบาะแสด่าน 6 ก่อนออกไปตก',
    link: 'เปิดข้อมูลโปสต์การ์ดที่ได้รับ',
    limit: 'จุดที่กำหนดอาจไม่มีปลาในรอบนี้; ยังไม่ยืนยันว่าหลังตกได้ต้องส่งให้ใครหรือมีรางวัลอะไร',
  },
  ja: {
    title: '医者の依頼が表示された場合',
    body: '受け取ったはがきを読み、大ウナギを釣る依頼が表示されたら、釣りに行く前にエリア6の手掛かりをはがき情報で確認してください。',
    link: '受け取ったはがきの情報を見る',
    limit: '設定地点に魚がいない状態もあります。釣った後に誰へ渡すか、報酬があるかは未確認です。',
  },
  en: {
    title: 'If the doctor’s request appears',
    body: 'If you read Received Postcard 06 and see the doctor’s giant-eel request, open the postcard guidance for the Area 6 clue before fishing.',
    link: 'Open Received Postcard guidance',
    limit:
      'The configured spot may be inactive. Who receives the eel after landing, and whether there is a reward, are unverified.',
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

export function renderEelQuestContext(ctx, locationData) {
  if (ctx.id !== EEL_ID || !eelPointConfigured(locationData)) return ''
  const text = copy[ctx.locale] || copy.en
  return `<aside class="detail-section fish-quest-context" data-fish-quest-context="postcard-eel"><h2>${ctx.escapeHtml(text.title)}</h2><p>${ctx.escapeHtml(text.body)}</p><p><a class="route-button" data-fish-postcard-link href="${ctx.escapeHtml(postcardHref(ctx))}">${ctx.escapeHtml(text.link)} ↗</a></p><p>${ctx.escapeHtml(text.limit)}</p></aside>`
}
