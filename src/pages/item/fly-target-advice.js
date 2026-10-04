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

export function flyTargetAdvice(ctx, item, fishVisuals, fishLocations) {
  if (!ctx.selectedFish || !['fly', 'fly_wing', 'fly_tail'].includes(item.category)) return ''
  if (!fishVisuals[ctx.selectedFish]) return ''
  const fish = ctx.fishName(ctx.selectedFish, fishVisuals)
  const decision = item.category === 'fly' ? bodyDecision(ctx, item, fish) : partDecision(ctx, fish)
  const label = local(ctx, {
    th: `เลือกชุดฟลายเริ่มต้นสำหรับ${fish}`,
    ja: `${fish}の開始用フライセットを選ぶ`,
    en: `Choose a starter fly set for ${fish}`,
  })
  const href = ctx.fishProfileLink(ctx.selectedFish, fishLocations) + '#starter-fly'
  return `<div data-fly-target-advice="${ctx.esc(ctx.selectedFish)}"><p>${ctx.esc(decision)}</p><a class="route-button" data-fly-starter-link href="${ctx.esc(href)}">${ctx.esc(label)} ↗</a></div>`
}
