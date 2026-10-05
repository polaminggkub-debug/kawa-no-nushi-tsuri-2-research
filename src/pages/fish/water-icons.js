const classOrder = ['small', 'large', 'bubble']

const labels = {
  en: {
    title: 'Read the water marks',
    intro:
      'Use these marks to narrow down candidates on the map. A mark records size when the object is built; later growth does not directly update it. The caught size may differ, and a mark alone cannot identify the species.',
    small: 'Small fish mark',
    large: 'Large fish mark',
    bubble: 'Bubble mark',
    smallFact: 'For a normal mark, the fish is under 50 cm when the mark is created.',
    largeFact: 'For a normal mark, the fish is at least 50 cm when the mark is created.',
    growthLabel: 'Large mark · only after growth and rebuilding',
    growthFact:
      'This fish starts below 50 cm. A large mark requires growth to at least 50 cm and a later object rebuild. Do not expect a large mark from its initial size; ordinary-play frequency is not confirmed.',
    bubbleFact:
      'A bubble mark does not identify the fish or show its size. This profile passes potato bait 11’s float check, but that does not guarantee the mark is this fish or that it will bite.',
    baitAction: 'Check potato bait 11 · float condition',
    evidence: 'ROM evidence and method',
    evidenceLink: 'Water-surface icon trace and thresholds',
  },
  ja: {
    title: '水面のマークの見分け方',
    intro:
      'マークを使って地図の候補を絞り込めます。魚影はオブジェクト作成時のサイズで決まり、その後の成長だけでは直接更新されません。釣れた時のサイズとは異なる場合があり、マークだけでは魚種を特定できません。',
    small: '小さい魚影',
    large: '大きい魚影',
    bubble: '泡のマーク',
    smallFact: '通常のマーク作成時に、魚体サイズが50cm未満です。',
    largeFact: '通常のマーク作成時に、魚体サイズが50cm以上です。',
    growthLabel: '大魚影・成長後の再作成が必要',
    growthFact:
      'この魚の初期サイズは50cm未満です。大魚影には50cm以上への成長と、その後のオブジェクト再作成が必要です。初期サイズから大魚影を期待しないでください。通常プレイでの頻度は未確認です。',
    bubbleFact:
      '泡のマークは魚種やサイズを示しません。このプロフィールはウキ仕掛けでイモエサ11の判定を通りますが、マークの魚がこの魚であることや食いつきを保証しません。',
    baitAction: 'イモエサ11のウキ判定を確認',
    evidence: 'ROM根拠と調査方法',
    evidenceLink: '水面マークのトレースとしきい値',
  },
  th: {
    title: 'ดูเครื่องหมายบนผิวน้ำ',
    intro:
      'ใช้เครื่องหมายช่วยกรองชนิดปลาในแผนที่ เกมเลือกเครื่องหมายจากขนาดตอนสร้างวัตถุปลา การโตภายหลังไม่ได้เปลี่ยนเครื่องหมายเดิมโดยตรง ขนาดตอนตกได้จึงอาจต่างออกไป และเครื่องหมายอย่างเดียวระบุชนิดปลาไม่ได้',
    small: 'เครื่องหมายปลาขนาดต่ำกว่า 50 ซม.',
    large: 'เครื่องหมายปลาขนาดตั้งแต่ 50 ซม.',
    bubble: 'เครื่องหมายฟองอากาศ',
    smallFact: 'ถ้าเป็นเครื่องหมายปกติ ตอนเกมสร้างเครื่องหมายปลามีขนาดต่ำกว่า 50 ซม.',
    largeFact: 'ถ้าเป็นเครื่องหมายปกติ ตอนเกมสร้างเครื่องหมายปลามีขนาดตั้งแต่ 50 ซม. ขึ้นไป',
    growthLabel: 'เครื่องหมายใหญ่ · ต้องโตและสร้างเครื่องหมายใหม่',
    growthFact:
      'ปลานี้เริ่มต้นต่ำกว่า 50 ซม. เครื่องหมายใหญ่ต้องให้ปลาโตถึง 50 ซม. แล้วเกมสร้างวัตถุปลาใหม่ จึงอย่าคาดว่าจะเห็นภาพใหญ่จากขนาดเริ่มต้น ยังไม่ได้ยืนยันความถี่ในการเล่นปกติ',
    bubbleFact:
      'เครื่องหมายฟองไม่ได้บอกชนิดหรือขนาดปลา ปลาชนิดนี้ผ่านเงื่อนไขเหยื่อหัวมัน 11 เมื่อใช้ชุดทุ่น แต่ไม่ได้ยืนยันว่าปลาที่เห็นเป็นตัวนี้หรือจะกินเหยื่อ',
    baitAction: 'ดูเงื่อนไขชุดทุ่นของเหยื่อหัวมัน 11',
    evidence: 'หลักฐาน ROM และวิธีตรวจสอบ',
    evidenceLink: 'เส้นทางตรวจเครื่องหมายและเกณฑ์ขนาด',
  },
}

function copyFor(ctx) {
  return labels[ctx.locale] || labels.en
}

function imageFor(waterIcons, iconClass) {
  const image = waterIcons?.classes?.[iconClass]?.image
  return typeof image === 'string' && image ? image : ''
}

function visibleClasses(waterIcons, profile) {
  if (!Array.isArray(profile?.possibleClasses)) return []
  return classOrder.filter(
    (iconClass) =>
      profile.possibleClasses.includes(iconClass) &&
      (iconClass !== 'bubble' || profile.bubble === true) &&
      imageFor(waterIcons, iconClass),
  )
}

function potatoBaitLink(ctx, stage) {
  const query = new URLSearchParams({
    category: 'bait',
    id: '11',
    fish: ctx.id,
    route: 'float',
    return: `${ctx.currentFishPath(stage)}#water-icons`,
  })
  if (stage) query.set('stage', String(stage))
  return `${ctx.itemPath()}?${query.toString()}`
}

function iconFact(copy, iconClass) {
  if (iconClass === 'small') return copy.smallFact
  if (iconClass === 'large') return copy.largeFact
  return copy.bubbleFact
}

function iconCard(ctx, copy, waterIcons, profile, iconClass, stage) {
  const conditional = profile.growthOnlyClasses?.includes(iconClass) === true
  const label = conditional ? copy.growthLabel : copy[iconClass]
  const image = ctx.escapeHtml(imageFor(waterIcons, iconClass) + '?v=native-20261005')
  const fact = ctx.escapeHtml(conditional ? copy.growthFact : iconFact(copy, iconClass))
  const bubbleAction =
    iconClass === 'bubble' && profile.bubble === true
      ? `<a class="route-button" data-water-bait-link href="${ctx.escapeHtml(potatoBaitLink(ctx, stage))}">${ctx.escapeHtml(copy.baitAction)} ↗</a>`
      : ''
  return `<article class="entity-link water-icon-card" data-water-icon="${iconClass}" data-water-class-evidence="${conditional ? 'growth-only' : 'initial'}"><img loading="lazy" src="${image}" alt="${ctx.escapeHtml(label)}"><span><strong>${ctx.escapeHtml(label)}</strong><small>${fact}</small></span>${bubbleAction}</article>`
}

function evidenceDetails(ctx, copy) {
  const href =
    'https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/water-surface-icons.md'
  return `<details class="water-icon-evidence"><summary>${ctx.escapeHtml(copy.evidence)}</summary><p><a href="${href}">${ctx.escapeHtml(copy.evidenceLink)} ↗</a></p></details>`
}

export function renderWaterIcons(ctx, waterIcons, stage) {
  const profile = waterIcons?.profiles?.[ctx.id]
  if (!waterIcons?.romSha1 || !profile) return ''
  const classes = visibleClasses(waterIcons, profile)
  if (!classes.length) return ''
  const copy = copyFor(ctx)
  const cards = classes
    .map((iconClass) => iconCard(ctx, copy, waterIcons, profile, iconClass, stage))
    .join('')
  return `<section class="detail-section water-icon-guide" id="water-icons"><h2>${ctx.escapeHtml(copy.title)}</h2><p class="section-lede">${ctx.escapeHtml(copy.intro)}</p><div class="detail-grid water-icon-grid">${cards}</div>${evidenceDetails(ctx, copy)}</section>`
}
