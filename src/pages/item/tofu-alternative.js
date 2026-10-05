const copy = {
  th: {
    title: 'อยากดูฉากจิ้งจอกโดยเก็บเต้าหู้ไว้?',
    action:
      'ถ้าฉากจิ้งจอกยังไม่เกิด ไปสนามด่าน 4 ที่ X 31–33, Y 42–43 แล้วเลือกใช้ดอกไม้ไฟ 16 ตรงจุดนี้ ไม่ต้องมอบเต้าหู้ก่อน ดอกไม้ไฟจะหมดไป หากใช้ผิดจุดก็เสียดอกไม้ไฟโดยไม่เกิดฉากนี้',
    alternative:
      'เก็บเต้าหู้ไว้กินเมื่ออยากเติม HP เต็ม หรือมอบให้ NPC ด่าน 4 ที่ (32,42) ถ้าอยากเล่นเส้นทางบทสนทนานั้น กินหรือมอบแล้วเต้าหู้หมดไป',
    link: 'ดูดอกไม้ไฟและตำแหน่งใช้บนภาพแผนที่',
  },
  en: {
    title: 'Want the fox scene while keeping your tofu?',
    action:
      'If the fox scene has not occurred, go to the Area 4 field at X 31–33, Y 42–43 and use fireworks 16 there. No tofu offering is required. The fireworks are consumed; using them at the wrong spot spends them without triggering this scene.',
    alternative:
      'Keep tofu to eat when you need full HP, or give it to the Area 4 NPC at (32,42) if you want that dialogue route. Eating or offering consumes the tofu.',
    link: 'See fireworks and the use location on the map',
  },
  ja: {
    title: '油揚げを残してキツネの場面を見たい？',
    action:
      'キツネの場面がまだ起きていなければ、エリア4の屋外X 31–33・Y 42–43へ行き、そこで花火16を直接使ってください。油揚げを先に渡す必要はありません。花火は消費され、違う場所で使うとこの場面は起きません。',
    alternative:
      'HPを全回復したい時に食べるために残すか、会話ルートを進めたい場合はエリア4（32,42）のNPCへ渡してください。食べても渡しても油揚げは消費されます。',
    link: '花火と使用地点のマップを見る',
  },
}

export function tofuAlternative(ctx, item) {
  if (item?.category !== 'general_tool' || item.id !== '15') return ''
  const text = copy[ctx.lang] || copy.en
  const [page, search = ''] = ctx.detailItemLink({ category: 'general_tool', id: '16' }).split('?')
  const params = new URLSearchParams(search)
  params.set('stage', '4')
  params.delete('fish')
  params.delete('route')
  const href = `${page}?${params}#use-locations`
  return `<aside class="detail-section quest-next-action" data-quest-next-action="tofu-fireworks-alternative"><h2>${ctx.esc(text.title)}</h2><p>${ctx.esc(text.action)}</p><p data-tofu-heal-dialogue-choice>${ctx.esc(text.alternative)}</p><p><a class="route-button" data-tofu-fireworks-action href="${ctx.esc(href)}">${ctx.esc(text.link)} ↗</a></p></aside>`
}
