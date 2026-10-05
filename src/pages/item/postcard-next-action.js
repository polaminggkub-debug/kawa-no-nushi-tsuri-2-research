const EEL_ID = '3B'

function postcardCopy(lang) {
  return {
    th: {
      title: 'เมื่ออ่านแล้วพบจดหมายจากหมอให้ตกปลาไหลใหญ่',
      body: 'ถ้าพบข้อความนี้แล้ว ใช้แม่เหล็กในด่าน 6 ดูทิศทาง หรือเปิดจุดบนแผนที่ด้านล่าง เลือกเหยื่อและอุปกรณ์จากหน้าปลาไหลใหญ่ก่อนออกไปตก',
      limit:
        'จุดนี้มาจากตารางเกม บางรอบอาจไม่มีปลา ยังไม่ได้พิสูจน์ว่าตกได้แล้วต้องส่งให้ใครหรือรับรางวัลอย่างไร',
      fish: 'ดูเหยื่อและอุปกรณ์สำหรับปลาไหลใหญ่',
      map: 'ดูจุดด่าน 6 · X 41, Y 8',
    },
    ja: {
      title: '医者から大ウナギを釣る依頼が届いたら',
      body: 'この依頼を見たら、エリア6で磁石のオオウナギ項目を使うか、下の地図で地点を確認。釣りに行く前に魚のページで対応エサと道具を選んでください。',
      limit:
        '地点はROMの出現表に基づき、生成状態によって魚がいない場合があります。釣った後の渡す相手や報酬は未検証です。',
      fish: 'オオウナギの対応エサと道具を見る',
      map: 'エリア6の地点 · X 41, Y 8',
    },
    en: {
      title: 'After reading the doctor’s request for a giant eel',
      body: 'Once this request appears, use its Area 6 Magnet heading or open the map point below. Choose compatible bait and equipment from the fish profile before fishing.',
      limit:
        'This is a configured ROM spawn point and can be inactive. Who to give the landed eel to, or what reward follows, is not yet verified.',
      fish: 'See giant eel bait and equipment',
      map: 'Area 6 point · X 41, Y 8',
    },
  }[lang]
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
  return `<aside class="detail-section quest-next-action" data-quest-next-action="postcard-eel"><h3>${ctx.esc(text.title)}</h3><p>${ctx.esc(text.body)}</p><p><a class="route-button" data-quest-fish-profile href="${ctx.esc(profile)}">${ctx.esc(text.fish)} ↗</a> <a class="route-button" data-quest-fish-map href="${ctx.esc(eelMapHref(ctx))}">${ctx.esc(text.map)} ↗</a></p><p>${ctx.esc(text.limit)}</p></aside>`
}
