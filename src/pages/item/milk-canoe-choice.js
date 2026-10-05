function milkChoiceCopy(lang) {
  return {
    th: {
      title: 'เก็บนมไว้แลกเรือ หรือดื่มเติม HP?',
      reserve:
        'ถ้าอยากได้แคนูและยังไม่มี ให้เก็บนมสดไว้คุยกับช่างทำเรือด่าน 3 (28,39) ไม่จำเป็นต้องแลกเรือถ้าพอใจกับกะละมังที่มีแล้ว',
      heal: 'ถ้าไม่แลก ใช้ดื่มเมื่อขาด HP เพื่อฟื้นจนเต็มตามค่าสูงสุด นมจะกลายเป็นขวดเปล่า นำไปเติมกับวัวด่าน 3 (6,103) ได้ ถ้าดื่มก่อน ต้องเติมใหม่ก่อนแลกเรือ',
      compare: 'ดูข้อแลกเปลี่ยนของแคนูกับกะละมัง',
      trade: 'ดูจุดแลกนมเป็นแคนู · ด่าน 3',
    },
    ja: {
      title: '牛乳をカヌー用に残す？ HP回復に使う？',
      reserve:
        'カヌーが欲しく、まだ持っていないなら、牛乳をエリア3（28,39）の船大工との交換用に残してください。今のタライで十分なら、交換する必要はありません。',
      heal: '交換しないなら、HPが必要なときに飲むと最大HPまで回復し、空きビンになる。エリア3の牛（6,103）で補充できます。先に飲んだ場合、交換前に補充が必要です。',
      compare: 'カヌーとタライの選択理由を比較',
      trade: '牛乳とカヌーの交換地点 · エリア3',
    },
    en: {
      title: 'Reserve milk for a canoe, or drink it for HP?',
      reserve:
        'Want a canoe and do not own one? Keep the fresh milk for the Area 3 canoe maker at (28,39). You do not need to trade if your existing tub suits you.',
      heal: 'Otherwise drink it when you need HP: it restores current HP to maximum and becomes an empty bottle. Refill at the Area 3 cow (6,103). If you drink first, refill before trading for the canoe.',
      compare: 'Compare the canoe and tub trade-off',
      trade: 'See the milk-for-canoe location · Area 3',
    },
  }[lang]
}

function canoeHref(ctx, hash) {
  const query = new URLSearchParams({ category: 'general_tool', id: '02', stage: '3' })
  const returned = ctx.safeLocalRoute(ctx.currentLocalRoute())
  if (returned) query.set('return', returned)
  return `${ctx.localePage[ctx.lang]}?${query}${hash}`
}

export function milkCanoeChoice(ctx, item) {
  if (item?.category !== 'general_tool' || item.id !== '10') return ''
  const text = milkChoiceCopy(ctx.lang)
  return `<aside class="detail-section quest-next-action" data-milk-canoe-choice><h2>${ctx.esc(text.title)}</h2><p data-milk-reserve-action>${ctx.esc(text.reserve)}</p><p data-milk-heal-action>${ctx.esc(text.heal)}</p><p><a class="route-button" data-milk-canoe-comparison href="${ctx.esc(canoeHref(ctx, '#what-to-do'))}">${ctx.esc(text.compare)} ↗</a></p><p><a class="route-button" data-milk-canoe-location href="${ctx.esc(canoeHref(ctx, '#use-locations'))}">${ctx.esc(text.trade)} ↗</a></p></aside>`
}
