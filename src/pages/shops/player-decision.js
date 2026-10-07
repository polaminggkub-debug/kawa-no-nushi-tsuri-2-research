import { distinctFishNames } from '../../entities/fish/index.js'
import { shopCategoryGuidance } from './shop-category-guidance.js'

export function shopCompatibility(ctx, item) {
  if (!ctx.selectedFish || !ctx.fishVisuals?.[ctx.selectedFish]) return ''
  const use = item.playerUse || {}
  let fishIds
  if (item.category === 'lure' || item.category === 'fly') fishIds = use.fishIds
  else if (item.category === 'bait') fishIds = use.fishIdsByRoute?.[baitRoute(ctx)]
  else return ''
  if (!Array.isArray(fishIds)) return ''
  return fishIds.includes(ctx.selectedFish) ? 'accepted' : 'rejected'
}

export function shopFishContext(ctx) {
  const fish = ctx.fishVisuals?.[ctx.selectedFish]
  if (!fish) return ''
  const stage = Number(ctx.$('stage-select')?.value || ctx.startStage)
  const method = selectedMethod(ctx)
  const returnTo = ctx.targetReturn()
  const query = new URLSearchParams({
    id: ctx.selectedFish,
    stage: String(stage),
    route: method,
    return: returnTo,
  })
  const href = `${ctx.pages.fish[ctx.lang]}?${query.toString()}`
  const name = fishName(ctx, fish, ctx.selectedFish)
  const methodText = contextCopy(ctx.lang).methods[method]
  const baitNote =
    ctx.lang === 'th'
      ? 'ป้ายเหยื่อจริงใช้เส้นทางตะกั่วเมื่อเลือกตะกั่ว; วิธีอื่นหรือยังไม่เลือกจะใช้ทุ่น'
      : ctx.lang === 'ja'
        ? 'エサの判定はオモリ仕掛けを選んだ場合はオモリ、それ以外はウキで表示します。'
        : 'Bait labels use the sinker route when selected; otherwise they use float.'
  const copy = contextCopy(ctx.lang)
  const category = ctx.$('category-select')?.value || ctx.startCategory || 'all'
  const guidance = shopCategoryGuidance(ctx.lang, category, copy.explains)
  const baitRouteNote = ['all', 'bait'].includes(category) ? ` ${baitNote}` : ''
  return `<aside class="shop-fish-context" data-shop-fish-context data-shop-context-category="${ctx.esc(category)}" data-fish-check-guidance="${guidance.state}" data-fish="${ctx.esc(ctx.selectedFish)}" data-stage="${stage}" data-method="${method}"><img src="${ctx.esc(ctx.imagePath(fish.image))}" alt=""><div><p class="shop-fish-context-label">${ctx.esc(copy.target)}</p><a class="shop-fish-profile-link" href="${ctx.esc(href)}"><strong>${ctx.esc(name)}</strong><span>${ctx.esc(copy.profile)} · ID ${ctx.esc(ctx.selectedFish)} · ${ctx.esc(ctx.text.stageWord(stage))} · ${ctx.esc(methodText)} ↗</span></a><p>${ctx.esc(guidance.text)}${ctx.esc(baitRouteNote)}</p></div></aside>`
}

export function shopCompatibilityBadge(ctx, item, state) {
  if (!state) return ''
  const method =
    item.category === 'bait' ? baitRoute(ctx) : item.category === 'lure' ? 'lure' : 'fly'
  const copy = contextCopy(ctx.lang)
  const text =
    item.category === 'bait' ? copy.status.bait[method][state] : copy.status[item.category][state]
  return `<p class="shop-compatibility ${state}" data-shop-compatibility="${state}" data-compatibility-method="${method}"><strong>${ctx.esc(text)}</strong></p>`
}

function baitRoute(ctx) {
  return ctx.selectedRig === 'sinker' ? 'sinker' : 'float'
}

function selectedMethod(ctx) {
  return ['float', 'sinker', 'lure', 'fly'].includes(ctx.selectedRig) ? ctx.selectedRig : 'float'
}

function fishName(ctx, fish, id) {
  if (ctx.lang === 'th') {
    const thaiNames = distinctFishNames(fish.nameTh ? [fish.nameTh] : fish.nameThVariants || [])
    return thaiNames.join(' / ') || fish.nameLatin || fish.nameJa || `ปลา ${id}`
  }
  if (ctx.lang === 'ja') return fish.nameJa || `魚 ${id}`
  return fish.nameEn || fish.nameLatin || fish.nameLatinVariants?.[0] || fish.nameJa || `Fish ${id}`
}

const localizedCopy = {
  th: {
    target: 'ปลาที่เลือกไว้',
    profile: 'เปิดหน้าข้อมูลปลา',
    explains:
      'ดูป้ายก่อนซื้อ: ของที่แสดงไม่ได้เป็นของที่ปลานี้กินทุกชิ้น ชิ้นที่ปลานี้กินใช้ได้เมื่อทุ่นหรือลัวร์อยู่ช่องเดียวกับปลา ส่วนฟลายต้องไม่ติดล็อกของเซฟด้วย',
    methods: { float: 'สายทุ่น', sinker: 'สายตะกั่ว', lure: 'สายลัวร์', fly: 'สายฟลาย' },
    status: {
      lure: {
        accepted: 'ปลานี้ว่ายตามลัวร์ชิ้นนี้',
        rejected: 'ปลานี้ไม่ตามลัวร์ชิ้นนี้',
      },
      bait: {
        float: {
          accepted: 'ปลานี้กินเหยื่อนี้ (สายทุ่น)',
          rejected: 'ปลานี้ไม่กินเหยื่อนี้ (สายทุ่น)',
        },
        sinker: {
          accepted: 'ปลานี้กินเหยื่อนี้ (สายตะกั่ว)',
          rejected: 'ปลานี้ไม่กินเหยื่อนี้ (สายตะกั่ว)',
        },
      },
      fly: {
        accepted: 'ปลานี้กินบอดี้ฟลายนี้ (ฟลายทั้งชุดต้องไม่ติดล็อกของเซฟ)',
        rejected: 'ปลานี้ไม่กินบอดี้ฟลายนี้',
      },
    },
  },
  ja: {
    target: '選択中の魚',
    profile: '魚プロフィールを見る',
    explains:
      '購入前に印を確認してください。表示品がすべてこの魚の食べるものとは限りません。魚が食べる品は、ウキやルアーが魚と同じマスにあれば使えます。毛バリはセーブのロックも通る必要があります。',
    methods: { float: 'ウキ仕掛け', sinker: 'オモリ仕掛け', lure: 'ルアー', fly: '毛バリ' },
    status: {
      lure: { accepted: 'この魚はこのルアーを追う', rejected: 'この魚はこのルアーを追わない' },
      bait: {
        float: {
          accepted: 'この魚はこのエサを食べる（ウキ）',
          rejected: 'この魚はこのエサを食べない（ウキ）',
        },
        sinker: {
          accepted: 'この魚はこのエサを食べる（オモリ）',
          rejected: 'この魚はこのエサを食べない（オモリ）',
        },
      },
      fly: {
        accepted: 'この魚はこのボディを食べる（毛バリ全体がセーブのロックも通ること）',
        rejected: 'この魚はこのボディを食べない',
      },
    },
  },
  en: {
    target: 'Selected fish',
    profile: 'Open fish profile',
    explains:
      'Check the marks before buying: not every listed item is one this fish takes. Items it takes work once your float or lure is on its tile; a fly must also get past the save’s lock.',
    methods: { float: 'Float route', sinker: 'Sinker route', lure: 'Lure route', fly: 'Fly route' },
    status: {
      lure: {
        accepted: 'This fish chases this lure',
        rejected: 'This fish does not chase this lure',
      },
      bait: {
        float: {
          accepted: 'This fish takes this bait (float)',
          rejected: 'This fish does not take this bait (float)',
        },
        sinker: {
          accepted: 'This fish takes this bait (sinker)',
          rejected: 'This fish does not take this bait (sinker)',
        },
      },
      fly: {
        accepted: 'This fish takes this fly body (the whole fly must also pass the save’s lock)',
        rejected: 'This fish does not take this fly body',
      },
    },
  },
}

function contextCopy(lang) {
  return localizedCopy[lang] || localizedCopy.en
}
