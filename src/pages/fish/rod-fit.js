// How well a rod suits the selected fish, from the measured fight effects stored on each rod's
// advice (`rodDecision.fight`: fish ids the rod's line is too short for, and fish it starts well
// or badly against).
const text = {
  th: {
    reach: 'สายยาวพอสำหรับปลานี้',
    start: 'เริ่มสู้ได้ดีกว่าสำหรับปลานี้',
    reachEffect: (reach, base) =>
      `คันถูกสุดสาย ×${base} สั้นเกินสำหรับปลานี้ ถ้าปลาวิ่งไกลเกินสายจะขาดและเสียตะขอ คันนี้สาย ×${reach} ยาวพอ`,
    startEffect: () =>
      'คันถูกสุดเริ่มสู้เสียเปรียบกับปลาชนิดนี้ (พลาดได้น้อยลง) คันนี้เริ่มสู้ได้ดีที่สุดกับปลาชนิดนี้',
    shortNote: 'คันถูกสุดนี้สายสั้นเกินสำหรับปลาชนิดนี้ ถ้าปลาวิ่งไกลเกินสายจะขาดและเสียตะขอ',
    badNote: 'คันถูกสุดนี้เริ่มสู้เสียเปรียบกับปลาชนิดนี้ พลาดได้น้อยลง',
  },
  ja: {
    reach: 'この魚に糸の長さが足りる',
    start: 'この魚で出だしが有利',
    reachEffect: (reach, base) =>
      `最安竿の糸（×${base}）はこの魚には短く、遠くまで走られると糸が切れて針を失います。この竿は×${reach}で足ります。`,
    startEffect: () =>
      '最安竿はこの魚で出だしが不利（許されるミスが減る）。この竿はこの魚で出だしが最良です。',
    shortNote: '最安竿の糸はこの魚には短く、遠くまで走られると糸が切れて針を失います。',
    badNote: '最安竿はこの魚で出だしが不利で、許されるミスが減ります。',
  },
  en: {
    reach: 'The line is long enough for this fish',
    start: 'A better fight start against this fish',
    reachEffect: (reach, base) =>
      `The budget rod’s line (×${base}) is too short for this fish: if it runs farther the line breaks and the hook is lost. This rod’s ×${reach} holds it.`,
    startEffect: () =>
      'The budget rod starts the fight worse against this fish (fewer mistakes allowed). This rod gives the best start against it.',
    shortNote:
      'The line of this budget rod is too short for this fish: if it runs farther the line breaks and the hook is lost.',
    badNote:
      'This budget rod starts the fight worse against this fish, so you can afford fewer mistakes.',
  },
}

const copy = (ctx) => text[ctx.locale] || text.en

export function rodFit(item, fish) {
  const fight = item.rodDecision?.fight
  if (!fight || !Number.isInteger(fish)) return null
  return {
    short: fight.short.includes(fish),
    bad: fight.bad.includes(fish),
    best: fight.best.includes(fish),
  }
}

// Cheapest local rods that fix what is wrong with the budget rod for this fish.
export function fitUpgrades(rods, budgetRod, fish) {
  const base = rodFit(budgetRod, fish)
  if (!base) return []
  const pick = (test) =>
    rods.find((rod) => {
      const fit = rod.id !== budgetRod.id && rodFit(rod, fish)
      return fit && test(fit)
    })
  const found = [
    ['reach', base.short ? pick((fit) => !fit.short) : null],
    ['start', base.bad ? pick((fit) => fit.best) : null],
  ]
  return found.filter(([, rod]) => rod)
}

export function fitHeadline(ctx, dimension) {
  return copy(ctx)[dimension]
}

export function fitEffect(ctx, dimension, item, budgetRod) {
  const reach = (rod) => rod.playerUse?.rodMetrics?.reachMultiplierRaw
  return dimension === 'reach'
    ? copy(ctx).reachEffect(reach(item), reach(budgetRod))
    : copy(ctx).startEffect()
}

export function fitNote(ctx, budgetRod, fish) {
  const fit = rodFit(budgetRod, fish)
  if (!fit || !(fit.short || fit.bad)) return ''
  const note = fit.short ? copy(ctx).shortNote : copy(ctx).badNote
  return `<p class="method-rod-fit">${ctx.escapeHtml(note)}</p>`
}
