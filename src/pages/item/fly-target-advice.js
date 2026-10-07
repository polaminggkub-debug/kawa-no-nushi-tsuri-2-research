function local(ctx, values) {
  return values[ctx.lang] || values.en
}

function bodyDecision(ctx, item, fish) {
  const accepted = (item.playerUse?.fishIds || []).includes(ctx.selectedFish)
  return local(ctx, {
    th: accepted
      ? `${fish}กินบอดี้นี้ ฟลายทั้งชุดต้องไม่ติดล็อกของเซฟด้วย: เซฟใหม่ล็อกบอดี้กลุ่ม 1 กับปีกกลุ่ม 2 ฟลายที่ตรงล็อกไม่กินเลย`
      : `${fish}ไม่กินบอดี้นี้ เลือกบอดี้ที่ปลานี้กินได้จากชุดเริ่มต้นด้านล่าง`,
    ja: accepted
      ? `${fish}はこのボディを食べます。毛バリ全体がセーブのロックも通る必要があります：新規セーブはボディのグループ1とウィングのグループ2をロックし、一致する毛バリは食いつきません。`
      : `${fish}はこのボディを食べません。下の開始用セットから、この魚が食べるボディを選んでください。`,
    en: accepted
      ? `${fish} takes this body. The whole fly must also get past the save’s lock: a fresh save locks body group 1 and wing group 2, and a fly matching the lock never bites.`
      : `${fish} does not take this body. Choose a body it takes from the starter sets below.`,
  })
}

function hiddenGateAction(ctx, item, available, profileHref) {
  if (
    !available ||
    (item.category === 'fly' && !(item.playerUse?.fishIds || []).includes(ctx.selectedFish))
  )
    return ''
  const note = local(ctx, {
    th: 'ถ้าทุ่นอยู่ช่องของปลาแล้วไม่มีปลาตัวไหนสนใจฟลายเลย แปลว่าติดล็อกของเซฟ การตีซ้ำไม่เปลี่ยนล็อก มีแต่การนอนโรงแรมที่เปลี่ยนได้ ให้สลับไปฟลายที่บอดี้และปีกอยู่คนละกลุ่มกับตัวเดิม ดูชุดสามตัวสำรองด้านล่าง ถ้าปลาหันมาหาฟลายแล้วไม่กิน ไม่ต้องเปลี่ยนอะไร',
    ja: 'ウキを魚のマスに置いても魚がまったく反応しないなら、セーブのロックに引っかかっています。投げ直してもロックは変わらず、変わるのは宿泊だけです。ボディもウィングも別グループの毛バリに替えてください。下の3本セットを参照。魚がこちらを向いたら替える必要はありません。',
    en: 'If your float is on the fish’s tile and nothing reacts to the fly, the save’s lock is blocking it. Recasting does not change the lock; only an inn rest can. Switch to a fly whose body and wing are in different groups from this one (see the three-fly set below). If a fish turns toward the fly, change nothing.',
  })
  const label = local(ctx, {
    th: 'ดูชุดฟลายสำรองสำหรับปลานี้',
    ja: 'この魚の予備フライセットを見る',
    en: 'See backup fly sets for this fish',
  })
  return `<aside data-fly-hidden-gate><p>${ctx.esc(note)}</p><a class="route-button" data-fly-backup-action href="${ctx.esc(profileHref + '#fly-backup')}">${ctx.esc(label)} ↗</a></aside>`
}

function partDecision(ctx, fish) {
  return local(ctx, {
    th: `ปีกและหางไม่เลือกปลา ต้องดูที่บอดี้: ถ้าจะตก${fish} ให้เลือกบอดี้ที่ปลานี้กินก่อน ถ้าจะเริ่มตกทันที ให้ดูชุดฟลายสำเร็จรูปจากปุ่มด้านล่าง`,
    ja: `ウィングとテールは魚を選びません。${fish}を狙うなら、先にこの魚が食べるボディを選びます。すぐ始めるなら、下のボタンから完成セットを確認してください。`,
    en: `Wings and tails do not choose fish. For ${fish}, choose a body it takes first. To start fishing, use the button below to find ready-made sets.`,
  })
}

function noFlyDecision(ctx, fish) {
  return local(ctx, {
    th: `ไม่มีบอดี้ฟลายที่${fish}กิน อย่าซื้อชุดฟลายเพื่อปลานี้ เปิดหน้าปลาเพื่อดูวิธีตกอื่น`,
    ja: `${fish}が食べるフライボディはありません。この魚のためにフライは買わず、魚ページで別の釣法を見てください。`,
    en: `No fly body takes ${fish}. Do not buy a fly set for this fish; open the fish page for other methods.`,
  })
}

export function flyTargetAdvice(ctx, item, fishVisuals, fishLocations, allItems) {
  if (!ctx.selectedFish || !['fly', 'fly_wing', 'fly_tail'].includes(item.category)) return ''
  if (!fishVisuals[ctx.selectedFish]) return ''
  const fish = ctx.fishName(ctx.selectedFish, fishVisuals)
  const available = allItems.some(
    (entry) =>
      entry.category === 'fly' && (entry.playerUse?.fishIds || []).includes(ctx.selectedFish),
  )
  const decision = !available
    ? noFlyDecision(ctx, fish)
    : item.category === 'fly'
      ? bodyDecision(ctx, item, fish)
      : partDecision(ctx, fish)
  const label = local(ctx, {
    th: `เลือกชุดฟลายเริ่มต้นสำหรับ${fish}`,
    ja: `${fish}の開始用フライセットを選ぶ`,
    en: `Choose a starter fly set for ${fish}`,
  })
  const action = available
    ? label
    : local(ctx, {
        th: `ดูวิธีตกอื่นสำหรับ${fish}`,
        ja: `${fish}の別の釣法を見る`,
        en: `See other methods for ${fish}`,
      })
  const profileHref = ctx.fishProfileLink(ctx.selectedFish, fishLocations)
  const href = profileHref + (available ? '#starter-fly' : '')
  return `<div data-fly-target-advice="${ctx.esc(ctx.selectedFish)}"><p>${ctx.esc(decision)}</p><a class="route-button" data-fly-starter-link href="${ctx.esc(href)}">${ctx.esc(action)} ↗</a>${hiddenGateAction(ctx, item, available, profileHref)}</div>`
}
