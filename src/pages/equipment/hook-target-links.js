function targetRecords(item) {
  const targets = item.playerUse?.targetMatches
  return (Array.isArray(targets) ? targets : targets ? [targets] : []).filter((target) =>
    /^[\da-f]{2}$/i.test(String(target.fishId || '')),
  )
}

function targetLabel(lang) {
  if (lang === 'th') return 'ดูเหยื่อและจุดตกของปลาเป้าหมายที่ระบุไว้'
  if (lang === 'ja') return '記載された対象魚のエサ・場所を見る'
  return 'View bait and locations for the listed target fish'
}

export function hookTargetLinks(ctx, item) {
  if (item.category !== 'hook') return ''
  const targets = targetRecords(item)
  if (!targets.length) return ''
  const links = targets
    .map((target) => {
      const id = String(target.fishId).toUpperCase()
      const name = ctx.fishName(id)
      return `<a class="route-button" data-hook-target-fish="${ctx.esc(id)}" href="${ctx.esc(ctx.fishHref(id))}">${ctx.esc(name)} ↗</a>`
    })
    .join(' ')
  return `<div class="hook-target-links" data-hook-target-links><span>${ctx.esc(targetLabel(ctx.lang))}</span> ${links}</div>`
}
