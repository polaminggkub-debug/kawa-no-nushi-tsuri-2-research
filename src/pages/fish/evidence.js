function evidenceFileLink(ctx, source) {
  const path = ctx.escapeHtml(source)
  return `<a class="evidence-source-link" href="https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/${path}"><code>${path}</code> ↗</a>`
}

export function renderEvidence(ctx, fish, locations, compatibleEntries) {
  const sourceSet = new Set()
  for (const entry of compatibleEntries) {
    for (const source of entry.item.playerUse?.evidence?.sources || []) sourceSet.add(source)
  }
  const profileOffset = fish.nameSource?.romProfileFileOffset || ''
  const locationDetails = locations
    .map((location) => {
      const stage = String(location.stage)
      const coords = (location.points || []).map((point) => `(${point.x}, ${point.y})`).join(' · ')
      return `<li><strong>${ctx.escapeHtml(ctx.copy.stage(stage))}:</strong> ${ctx.escapeHtml(ctx.copy.configuredPoints(ctx.pointCount(location)))} · ${ctx.escapeHtml(ctx.copy.spawnSlots(ctx.slotCount(location)))}<br>${ctx.escapeHtml(coords || '—')}</li>`
    })
    .join('')
  return `<details class="evidence"><summary>${ctx.escapeHtml(ctx.copy.evidence)}</summary><p>${ctx.escapeHtml(ctx.copy.evidenceIntro)}</p><dl><dt>${ctx.escapeHtml(ctx.copy.profile)}</dt><dd>${ctx.escapeHtml(ctx.id)}</dd>${profileOffset ? `<dt>${ctx.escapeHtml(ctx.copy.profileOffset)}</dt><dd>${ctx.escapeHtml(profileOffset)}</dd>` : ''}<dt>${ctx.escapeHtml(ctx.copy.source)}</dt><dd>${evidenceFileLink(ctx, 'data/rom-fish-locations.json')}</dd>${sourceSet.size ? `<dt>${ctx.escapeHtml(ctx.copy.reference)}</dt><dd><ul class="evidence-sources">${[...sourceSet].map((source) => `<li>${evidenceFileLink(ctx, source)}</li>`).join('')}</ul></dd>` : ''}</dl>${locationDetails ? `<h3>${ctx.escapeHtml(ctx.copy.coords)}</h3><ul>${locationDetails}</ul>` : ''}</details>`
}

export function renderExchange(ctx, items, stage) {
  const rewards = items.filter((item) => item.exchangeFishId === ctx.id)
  if (!rewards.length) return ''
  const title =
    ctx.locale === 'th'
      ? 'เก็บปลานี้ไว้แลกของไหม?'
      : ctx.locale === 'ja'
        ? 'この魚を交換用に残す？'
        : 'Keep this fish for an exchange?'
  const text =
    ctx.locale === 'th'
      ? 'ถ้ายังไม่เคยแลกและต้องการหัวไชเท้า 16 ชิ้น เก็บปลายามาโนะคามิหนึ่งตัวในข้องไว้ให้ NPC ด่าน 3 (21,82) ก่อนกินหรือขาย แต่การแลกทับอาหารเดิมทุกช่อง: ใช้อาหารเดิมที่ต้องการก่อน หรือข้ามการแลกถ้าต้องการเก็บอาหารไว้'
      : ctx.locale === 'ja'
        ? 'まだ交換しておらず大根16個が欲しいなら、食べたり売ったりする前にヤマノカミ1匹をびくに残し、エリア3（21,82）の人物へ。ただし食料全枠を上書きする。必要な食料は先に使い、残したいなら交換を見送る。'
        : 'If you have not traded yet and want 16 Daikon, keep one Yamanokami for the area-3 NPC at (21,82) before eating or selling it. The trade replaces every food slot: use wanted food first, or skip the trade to keep it.'
  return `<section class="detail-section" data-fish-exchange><h2>${ctx.escapeHtml(title)}</h2>${rewards.map((item) => `<p>${ctx.escapeHtml(item.exchangeFishAction?.[ctx.locale] || item.exchangeFishAction?.en || text)}</p>${ctx.itemLink({ item, routes: [] }, stage)}`).join('')}</section>`
}

export function unconfirmedProfileAction(ctx) {
  const title =
    ctx.locale === 'th'
      ? 'ไม่ต้องจัดชุดตกสำหรับรายการ 43'
      : ctx.locale === 'ja'
        ? 'プロフィール43用の仕掛けを買う必要はありません'
        : 'Do not buy a fishing setup for profile 43'
  const text =
    ctx.locale === 'th'
      ? 'เลือกปลาที่มีชื่อและจุดตกยืนยันแล้วแทน รายการนี้ไม่มีจุดเกิดที่ยืนยันในตารางที่ถอด และไม่มีเหยื่อจริง ลัวร์ หรือตัวฟลายผ่านเงื่อนไขของมัน การมีระเบียนใน ROM ไม่ได้ยืนยันว่าเป็นปลาที่พบและตกได้ตามปกติ'
      : ctx.locale === 'ja'
        ? '名前と確認済みの釣り場がある魚を選んでください。この項目には抽出した出現表の確認済み地点がなく、エサ・ルアー・フライ本体の判定を通る候補もありません。ROMに行があるだけでは、通常出現して釣れる魚とは確認できません。'
        : 'Choose a named fish with confirmed fishing spots instead. This entry has no confirmed point in the extracted spawn table, and no bait, lure or fly body passes its recorded check. A row in the ROM does not establish that it normally appears and can be caught.'
  return `<section class="detail-section" data-unconfirmed-profile-action><h2>${ctx.escapeHtml(title)}</h2><p>${ctx.escapeHtml(text)}</p><a class="route-button" href="${ctx.escapeHtml(ctx.cataloguePath())}?category=all#catalogue">${ctx.locale === 'th' ? 'เลือกปลาอื่นจากช่องค้นหา' : ctx.locale === 'ja' ? '検索欄で別の魚を選ぶ' : 'Choose another fish in the search field'} ↗</a></section>`
}
