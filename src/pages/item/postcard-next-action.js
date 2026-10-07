const EEL_ID = '3B'

function postcardCopy(lang) {
  return {
    th: {
      title: 'เมื่ออ่านแล้วพบจดหมายจากหมอให้ตกปลาไหลยักษ์',
      body: 'ถ้าพบข้อความนี้แล้ว ใช้เข็มทิศในด่าน 6 ดูทิศทาง หรือเปิดจุดบนแผนที่ด้านล่าง เลือกเหยื่อและอุปกรณ์จากหน้าปลาไหลยักษ์ก่อนออกไปตก',
      afterCatch:
        'ตกปลาไหลได้แล้วไม่ต้องเก็บไว้ เดินเข้าหมู่บ้านด่าน 1 ทางประตูสนาม (12,189) ฉากจบจะเริ่มโดยอัตโนมัติ โดยต้องทำขั้นก่อนหน้าให้ครบก่อน (ปลาประจำตัวละครของคุณ แล้วฉากในหมู่บ้านที่สนาม (8,183))',
      returnMap: 'ดูทางกลับหมู่บ้าน · ด่าน 1 (12,189)',
      limit: 'จุด (41,8) ไม่ได้มีปลาไหลอยู่เสมอ',
      fish: 'ดูเหยื่อและอุปกรณ์สำหรับปลาไหลยักษ์',
      map: 'ดูจุดด่าน 6 · X 41, Y 8',
    },
    ja: {
      title: '医者から大ウナギを釣る依頼が届いたら',
      body: 'この依頼を見たら、エリア6で磁石のオオウナギ項目を使うか、下の地図で地点を確認。釣りに行く前に魚のページで対応エサと道具を選んでください。',
      afterCatch:
        'オオウナギは釣れば十分で、残しておく必要はありません。フィールド（12,189）の入口からエリア1の村に入ると、エンディングが自動で流れます。ただし先の手順（自分のキャラクター専用の魚、次にフィールド（8,183）での村の場面）が済んでいることが条件です。',
      returnMap: '最初の村への入口 · エリア1 (12,189)',
      limit: '(41,8)にいつもオオウナギがいるとは限りません。',
      fish: 'オオウナギの対応エサと道具を見る',
      map: 'エリア6の地点 · X 41, Y 8',
    },
    en: {
      title: 'After reading the doctor’s request for a giant eel',
      body: 'Once this request appears, use its Area 6 Compass heading or open the map point below. Choose compatible bait and equipment from the fish profile before fishing.',
      afterCatch:
        'You do not need to keep the eel once it is caught. Walk into the Area 1 village through the field door at (12,189) and the ending scene plays automatically, provided the earlier steps are done (your character’s own special fish, then the village scene at field (8,183)).',
      returnMap: 'Starting-village entrance · Area 1 (12,189)',
      limit: 'The eel is not always at (41,8).',
      fish: 'See giant eel bait and equipment',
      map: 'Area 6 point · X 41, Y 8',
    },
  }[lang]
}

function returnVillageHref(ctx) {
  const query = new URLSearchParams({ stage: '1', section: 's1-c1-r8', action: 'eel-return' })
  const returned = ctx.safeLocalRoute(ctx.currentLocalRoute())
  if (returned) query.set('return', returned)
  return `${ctx.mapsPage[ctx.lang]}?${query}#map-view`
}

function eelMapHref(ctx) {
  const query = new URLSearchParams({ stage: '6', fish: EEL_ID, section: 's6-c2-r1' })
  const returned = ctx.safeLocalRoute(ctx.currentLocalRoute())
  if (returned) query.set('return', returned)
  return `${ctx.mapsPage[ctx.lang]}?${query}#map-view`
}

export function postcardNextAction(ctx, item, fishLocations) {
  if (item?.category !== 'general_tool' || item.id !== '06') return ''
  const record = fishLocations[EEL_ID]?.locations?.find((entry) => Number(entry.stage) === 6)
  if (!record?.points?.some((point) => point.x === 41 && point.y === 8)) return ''
  const text = postcardCopy(ctx.lang)
  const profile = ctx.fishProfileLink(EEL_ID, fishLocations)
  return `<aside class="detail-section quest-next-action" data-quest-next-action="postcard-eel"><h3>${ctx.esc(text.title)}</h3><p>${ctx.esc(text.body)}</p><p><a class="route-button" data-quest-fish-profile href="${ctx.esc(profile)}">${ctx.esc(text.fish)} ↗</a> <a class="route-button" data-quest-fish-map href="${ctx.esc(eelMapHref(ctx))}">${ctx.esc(text.map)} ↗</a></p><p data-eel-ending-action>${ctx.esc(text.afterCatch)}</p><p><a class="route-button" data-eel-return-map href="${ctx.esc(returnVillageHref(ctx))}">${ctx.esc(text.returnMap)} ↗</a></p><p>${ctx.esc(text.limit)}</p></aside>`
}
