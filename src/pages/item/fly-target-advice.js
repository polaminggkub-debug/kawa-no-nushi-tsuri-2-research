function local(ctx, values) {
  return values[ctx.lang] || values.en
}

function bodyDecision(ctx, item, fish) {
  const accepted = (item.playerUse?.fishIds || []).includes(ctx.selectedFish)
  return local(ctx, {
    th: accepted
      ? `บอดี้นี้ผ่านเงื่อนไขโปรไฟล์ของ${fish} ใช้เป็นตัวเลือกประกอบฟลายได้ แต่ยังต้องให้ปลาเจอเหยื่อและดึงขึ้นสำเร็จ`
      : `บอดี้นี้ไม่ผ่านเงื่อนไขโปรไฟล์ของ${fish} เลือกบอดี้ที่ใช้กับปลานี้ได้จากชุดเริ่มต้นด้านล่าง`,
    ja: accepted
      ? `このボディは${fish}のプロフィール判定を通ります。自作候補にできますが、魚との接触と取り込みも必要です。`
      : `このボディは${fish}のプロフィール判定を通りません。下の開始用セットから適合するボディを選んでください。`,
    en: accepted
      ? `This body passes the profile check for ${fish}. It is a custom-fly candidate; contact with the fish and successful landing still matter.`
      : `This body does not pass the profile check for ${fish}. Choose a compatible body from the starter sets below.`,
  })
}

function partDecision(ctx, fish) {
  return local(ctx, {
    th: `จะตก${fish} ให้เลือกบอดี้ตามปลาก่อน ปีกหรือหางชิ้นนี้อย่างเดียวไม่ได้ยืนยันว่าใช้ตกปลานี้ได้ ถ้าจะเริ่มตกทันที ให้ดูชุดฟลายสำเร็จรูปที่ผ่านเงื่อนไขบอดี้จากปุ่มด้านล่าง`,
    ja: `${fish}を狙うなら、先に魚に合うボディを選びます。このウィング・テール単体では適合を確認できません。すぐ始めるなら、下のボタンからボディ判定を通る完成セットを確認してください。`,
    en: `For ${fish}, choose the body first. This wing or tail alone does not establish fish compatibility. To start fishing, use the button below to find ready-made sets whose bodies pass the check.`,
  })
}

function noFlyDecision(ctx, fish) {
  return local(ctx, {
    th: `ยังไม่มีบอดี้ฟลายที่ผ่านเงื่อนไขโปรไฟล์ของ${fish}ในข้อมูลที่ถอดได้ อย่าซื้อชุดฟลายเพื่อปลานี้จากคำแนะนำนี้ เปิดหน้าปลาเพื่อดูวิธีตกอื่นที่ยืนยันแล้ว`,
    ja: `${fish}の判定を通るフライボディは解析データにありません。この案内からフライを購入せず、魚ページで確認済みの別の釣法を見てください。`,
    en: `No decoded fly body passes the profile check for ${fish}. Do not buy a fly set for this target from this advice. Open the fish page for other verified methods.`,
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
  const href =
    ctx.fishProfileLink(ctx.selectedFish, fishLocations) + (available ? '#starter-fly' : '')
  return `<div data-fly-target-advice="${ctx.esc(ctx.selectedFish)}"><p>${ctx.esc(decision)}</p><a class="route-button" data-fly-starter-link href="${ctx.esc(href)}">${ctx.esc(action)} ↗</a></div>`
}
