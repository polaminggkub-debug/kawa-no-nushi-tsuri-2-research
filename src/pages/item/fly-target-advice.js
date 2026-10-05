function local(ctx, values) {
  return values[ctx.lang] || values.en
}

function bodyDecision(ctx, item, fish) {
  const accepted = (item.playerUse?.fishIds || []).includes(ctx.selectedFish)
  return local(ctx, {
    th: accepted
      ? `บอดี้นี้ผ่านเงื่อนไขโปรไฟล์ของ${fish} ใช้เป็นตัวเลือกประกอบฟลายได้ แต่เป็นเพียงด่านตรวจแรก บอดี้กับปีกของชุดยังอาจติดเงื่อนไขซ่อน`
      : `บอดี้นี้ไม่ผ่านเงื่อนไขโปรไฟล์ของ${fish} เลือกบอดี้ที่ใช้กับปลานี้ได้จากชุดเริ่มต้นด้านล่าง`,
    ja: accepted
      ? `このボディは${fish}のプロフィール判定を通り、自作候補にできます。ただし最初の判定だけで、セットのボディとウィングは隠れた条件で遮断される場合があります。`
      : `このボディは${fish}のプロフィール判定を通りません。下の開始用セットから適合するボディを選んでください。`,
    en: accepted
      ? `This body passes the profile check for ${fish} and is a custom-fly candidate. That is only the first check; the set’s body and wing can still meet a hidden blocking condition.`
      : `This body does not pass the profile check for ${fish}. Choose a compatible body from the starter sets below.`,
  })
}

function hiddenGateAction(ctx, item, available, profileHref) {
  if (
    !available ||
    (item.category === 'fly' && !(item.playerUse?.fishIds || []).includes(ctx.selectedFish))
  )
    return ''
  const note = local(ctx, {
    th: 'ถ้าปลาไม่กิน อย่าตีชุดเดิมซ้ำเพื่อหวังสุ่มเงื่อนไขนี้ใหม่ การพักค้างคืนอาจเปลี่ยนค่าแต่ก็อาจได้ค่าเดิม ลองดูชุดสำรองที่เปลี่ยนทั้งบอดี้และปีก การไม่กินอาจมีสาเหตุอื่น และชุดสำรองไม่ได้รับประกันว่าตกได้',
    ja: '反応がなくても、同じセットの投げ直しではこの条件を再抽選しません。宿泊は値を更新する場合がありますが、同じ値にもなります。ボディとウィングを変える予備セットを確認してください。反応しない原因は他にもあり、釣果は保証しません。',
    en: 'If there is no bite, recasting the same set does not reroll this check. An overnight stay may refresh the values but can repeat them. Check the backup sets that vary body and wing. No bite can have other causes; the backup sets do not guarantee a catch.',
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
  const profileHref = ctx.fishProfileLink(ctx.selectedFish, fishLocations)
  const href = profileHref + (available ? '#starter-fly' : '')
  return `<div data-fly-target-advice="${ctx.esc(ctx.selectedFish)}"><p>${ctx.esc(decision)}</p><a class="route-button" data-fly-starter-link href="${ctx.esc(href)}">${ctx.esc(action)} ↗</a>${hiddenGateAction(ctx, item, available, profileHref)}</div>`
}
