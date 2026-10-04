const classOrder = ['small', 'large', 'bubble']

const labels = {
  en: {
    title: 'Read the water marks',
    intro:
      'These are the mark types recorded as possible for this fish profile. The size mark is chosen when a fish appears. It can grow afterward, so the icon may not match its size when caught. Size alone cannot identify the species.',
    small: 'Small fish mark',
    large: 'Large fish mark',
    bubble: 'Bubble mark',
    smallFact: 'For a normal mark, the fish is under 50 cm when the mark is created.',
    largeFact: 'For a normal mark, the fish is at least 50 cm when the mark is created.',
    bubbleFact:
      'A bubble mark does not identify the fish or show its size. This profile passes potato bait 11’s float check, but that does not guarantee the mark is this fish or that it will bite.',
    baitAction: 'Check potato bait 11 · float condition',
    evidence: 'ROM evidence and method',
    evidenceLink: 'Water-surface icon trace and thresholds',
  },
  ja: {
    title: '水面のマークの見分け方',
    intro:
      'この魚プロフィールで表示される可能性が確認されたマークです。サイズの魚影は魚が出現した時に選ばれます。その後に成長しても魚影は更新されないため、釣れた時のサイズとは異なる場合があります。サイズだけで魚種は特定できません。',
    small: '小さい魚影',
    large: '大きい魚影',
    bubble: '泡のマーク',
    smallFact: '通常のマーク作成時に、魚体サイズが50cm未満です。',
    largeFact: '通常のマーク作成時に、魚体サイズが50cm以上です。',
    bubbleFact:
      '泡のマークは魚種やサイズを示しません。このプロフィールはウキ仕掛けでイモエサ11の判定を通りますが、マークの魚がこの魚であることや食いつきを保証しません。',
    baitAction: 'イモエサ11のウキ判定を確認',
    evidence: 'ROM根拠と調査方法',
    evidenceLink: '水面マークのトレースとしきい値',
  },
  th: {
    title: 'ดูเครื่องหมายบนผิวน้ำ',
    intro:
      'ปลาชนิดนี้แสดงเครื่องหมายด้านล่างได้ เกมเลือกเครื่องหมายขนาดตอนปลาเกิด ปลาขนาดเพิ่มได้ภายหลังแต่เครื่องหมายไม่อัปเดต จึงไม่รับประกันว่าขนาดตอนตกได้จะตรงกับเครื่องหมาย ใช้ขนาดอย่างเดียวระบุชนิดปลาไม่ได้',
    small: 'เครื่องหมายปลาขนาดต่ำกว่า 50 ซม.',
    large: 'เครื่องหมายปลาขนาดตั้งแต่ 50 ซม.',
    bubble: 'เครื่องหมายฟองอากาศ',
    smallFact: 'ถ้าเป็นเครื่องหมายปกติ ตอนเกมสร้างเครื่องหมายปลามีขนาดต่ำกว่า 50 ซม.',
    largeFact: 'ถ้าเป็นเครื่องหมายปกติ ตอนเกมสร้างเครื่องหมายปลามีขนาดตั้งแต่ 50 ซม. ขึ้นไป',
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
  const label = copy[iconClass]
  const image = ctx.escapeHtml(imageFor(waterIcons, iconClass) + '?v=native-20261005')
  const fact = ctx.escapeHtml(iconFact(copy, iconClass))
  const bubbleAction =
    iconClass === 'bubble' && profile.bubble === true
      ? `<a class="route-button" data-water-bait-link href="${ctx.escapeHtml(potatoBaitLink(ctx, stage))}">${ctx.escapeHtml(copy.baitAction)} ↗</a>`
      : ''
  return `<article class="entity-link water-icon-card" data-water-icon="${iconClass}"><img loading="lazy" src="${image}" alt="${ctx.escapeHtml(label)}"><span><strong>${ctx.escapeHtml(label)}</strong><small>${fact}</small></span>${bubbleAction}</article>`
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
