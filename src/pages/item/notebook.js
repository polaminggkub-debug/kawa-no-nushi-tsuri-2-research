const text = {
  th: [
    'เก็บสมุดให้ครบ 66 ชนิด',
    'ตกปลาขึ้นและผ่านข้อความผลให้จบ แล้วเปิดสมุดเช็กก่อนติ๊กบนเว็บ สมุดเก็บหนึ่งรายการต่อชนิดปลา ด่านในสมุดคือด่านที่ทำสถิติขนาดใหญ่ที่สุด ตกชนิดเดิมที่ขนาดเท่าเดิมหรือเล็กกว่าจะไม่เพิ่มรายการใหม่',
    'ดูรายชื่อที่ควรเก็บเพิ่มในแต่ละด่าน',
  ],
  en: [
    'Complete all 66 notebook species',
    'Land the fish and finish the result messages, then check the notebook before ticking the website checklist. The notebook keeps one entry per species. Its area is where the largest-size record was set; an equal or smaller duplicate does not add another entry.',
    'See new collection targets in each area',
  ],
  ja: [
    '釣りノート66種をそろえる',
    '魚を取り込み、結果メッセージを進めてからノートを確認し、ウェブのチェックを付けます。魚種ごとに1件だけ記録します。表示エリアは最大サイズの記録を作った場所です。同じサイズ以下の同種では別の項目は増えません。',
    'エリア別の未重複収集ルートを見る',
  ],
}

export function notebookAction(ctx, item) {
  if (item.category !== 'general_tool' || item.id !== '05') return ''
  const c = text[ctx.lang]
  const query = new URLSearchParams({
    stage: String(ctx.selectedStage || 1),
    return: ctx.currentLocalRoute(),
  })
  const href = `maps${ctx.lang === 'en' ? '' : `.${ctx.lang}`}.html?${query}#notebook-guide`
  return `<aside class="detail-section" data-notebook-action><h2>${ctx.esc(c[0])}</h2><p>${ctx.esc(c[1])}</p><a class="route-button" href="${ctx.esc(href)}">${ctx.esc(c[2])} ↗</a></aside>`
}
