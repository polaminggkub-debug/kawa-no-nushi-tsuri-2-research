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
      'ดูป้ายก่อนซื้อ: ของที่แสดงไม่ได้ผ่านเงื่อนไขปลานี้ทุกชิ้น และการผ่านเงื่อนไขไม่รับประกันว่าปลากินหรือตกขึ้นได้',
    methods: { float: 'สายทุ่น', sinker: 'สายตะกั่ว', lure: 'สายลัวร์', fly: 'สายฟลาย' },
    status: {
      lure: {
        accepted: 'ผ่านเงื่อนไขชนิดปลาของลัวร์',
        rejected: 'ไม่ผ่านเงื่อนไขชนิดปลาของลัวร์',
      },
      bait: {
        float: {
          accepted: 'ผ่านเงื่อนไขเหยื่อสายทุ่น',
          rejected: 'ไม่ผ่านเงื่อนไขเหยื่อสายทุ่น',
        },
        sinker: {
          accepted: 'ผ่านเงื่อนไขเหยื่อสายตะกั่ว',
          rejected: 'ไม่ผ่านเงื่อนไขเหยื่อสายตะกั่ว',
        },
      },
      fly: {
        accepted: 'บอดี้ฟลายผ่านเงื่อนไขปลา 1 ข้อ',
        rejected: 'บอดี้ฟลายไม่ผ่านเงื่อนไขปลา 1 ข้อ',
      },
    },
  },
  ja: {
    target: '選択中の魚',
    profile: '魚プロフィールを見る',
    explains:
      '購入前に印を確認してください。表示品がすべてこの魚の判定を通るわけではなく、判定を通っても食いつきや取り込みは保証されません。',
    methods: { float: 'ウキ仕掛け', sinker: 'オモリ仕掛け', lure: 'ルアー', fly: '毛バリ' },
    status: {
      lure: { accepted: 'ルアーの魚種判定を通る', rejected: 'ルアーの魚種判定を通らない' },
      bait: {
        float: { accepted: 'ウキのエサ判定を通る', rejected: 'ウキのエサ判定を通らない' },
        sinker: { accepted: 'オモリのエサ判定を通る', rejected: 'オモリのエサ判定を通らない' },
      },
      fly: {
        accepted: 'ボディの魚プロフィール判定の1つを通る',
        rejected: 'ボディの魚プロフィール判定の1つを通らない',
      },
    },
  },
  en: {
    target: 'Selected fish',
    profile: 'Open fish profile',
    explains:
      'Check the marks before buying: not every listed item passes this fish check. Passing does not guarantee a bite or landing.',
    methods: { float: 'Float route', sinker: 'Sinker route', lure: 'Lure route', fly: 'Fly route' },
    status: {
      lure: {
        accepted: 'Passes the lure fish-type check',
        rejected: 'Does not pass the lure fish-type check',
      },
      bait: {
        float: {
          accepted: 'Passes the float bait check',
          rejected: 'Does not pass the float bait check',
        },
        sinker: {
          accepted: 'Passes the sinker bait check',
          rejected: 'Does not pass the sinker bait check',
        },
      },
      fly: {
        accepted: 'Body passes one fish-profile check',
        rejected: 'Body does not pass one fish-profile check',
      },
    },
  },
}

function contextCopy(lang) {
  return localizedCopy[lang] || localizedCopy.en
}
