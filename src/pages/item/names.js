import { distinctFishNames } from '../../entities/fish/index.js'

export function imageName(ctx, item) {
  return ctx.lang === 'th'
    ? item.nameTh || item.playerUse?.displayName?.th || item.nameJa || item.nameEn || item.id
    : ctx.lang === 'ja'
      ? item.playerUse?.displayName?.ja || item.nameJa || item.nameEn || item.id
      : item.playerUse?.displayName?.en || item.nameEn || item.nameJa || item.id
}

export function fishName(ctx, id, fishVisuals) {
  const fish = fishVisuals[id] || {}
  if (ctx.lang === 'th')
    return (
      distinctFishNames(fish.nameTh ? [fish.nameTh] : fish.nameThVariants || []).join(' / ') ||
      fish.nameLatin ||
      fish.nameJa ||
      `ปลา ${id}`
    )
  if (ctx.lang === 'ja') return fish.nameJa || `魚 ${id}`
  return (
    fish.nameEn ||
    fish.nameLatin ||
    fish.nameLatinVariants?.slice().sort((a, b) => b.length - a.length)[0] ||
    fish.nameJa ||
    `Fish ${id}`
  )
}

export function categoryLabel(ctx, item) {
  return ctx.lang === 'th'
    ? item.categoryTh || item.categoryEn
    : ctx.lang === 'ja'
      ? item.categoryJa || item.categoryEn
      : item.categoryEn || item.category
}

export function categoryName(ctx, c) {
  const maps = {
    th: {
      rod: 'คันเบ็ด',
      lure: 'ลัวร์',
      fly: 'ฟลาย',
      fly_wing: 'ปีกฟลาย',
      fly_tail: 'หางฟลาย',
      hook: 'เบ็ด',
      float_weight: 'ทุ่นและตะกั่ว',
      bait: 'เหยื่อจริง',
      food: 'อาหาร',
      general_tool: 'อุปกรณ์ทั่วไป',
    },
    ja: {
      rod: '竿',
      lure: 'ルアー',
      fly: '毛バリ',
      fly_wing: 'ウィング',
      fly_tail: 'テール',
      hook: 'ハリ',
      float_weight: 'ウキ・オモリ',
      bait: 'エサ',
      food: '食料',
      general_tool: '道具',
    },
    en: {
      rod: 'Rod',
      lure: 'Lure',
      fly: 'Fly body',
      fly_wing: 'Fly wing',
      fly_tail: 'Fly tail',
      hook: 'Hook',
      float_weight: 'Float / sinker',
      bait: 'Natural bait',
      food: 'Food',
      general_tool: 'General tool',
    },
  }
  return maps[ctx.lang][c] || c
}

export function stageName(ctx, stage, fishLocations) {
  for (const record of Object.values(fishLocations))
    for (const loc of record.locations || [])
      if (Number(loc.stage) === Number(stage))
        return ctx.local(loc.stageName) || ctx.copy.shopArea(stage)
  return ctx.copy.shopArea(stage)
}
