import { milkCanoeChoice } from './milk-canoe-choice.js'
import { tofuAlternative } from './tofu-alternative.js'
import { postcardNextAction } from './postcard-next-action.js'

const AKAME_ID = '37'
const FIREWORKS_ID = '16'

function akameName(lang) {
  return { th: 'อาคาเมะ', ja: 'アカメ', en: 'Akame' }[lang]
}

function isQuestItem(item, id) {
  return item?.category === 'general_tool' && item.id === id
}

function safeReturn(ctx) {
  return ctx.safeLocalRoute(ctx.currentLocalRoute())
}

function mapsHref(ctx, point) {
  const column = Math.floor((point.x * 16 + 8) / 384) + 1
  const row = Math.floor((point.y * 16 + 8) / 384) + 1
  const query = new URLSearchParams({
    stage: '6',
    fish: AKAME_ID,
    section: `s6-c${column}-r${row}`,
  })
  const returned = safeReturn(ctx)
  if (returned) query.set('return', returned)
  return `${ctx.mapsPage[ctx.lang]}?${query}`
}

function shopHref(ctx) {
  const query = new URLSearchParams({
    stage: '4',
    place: 'town',
    category: 'general_tool',
    id: FIREWORKS_ID,
  })
  const returned = safeReturn(ctx)
  if (returned) query.set('return', returned)
  return `shops${ctx.lang === 'en' ? '' : `.${ctx.lang}`}.html?${query}`
}

function candleAction(ctx, item, fishLocations) {
  if (!isQuestItem(item, '12')) return ''
  const record = fishLocations[AKAME_ID]?.locations?.find((entry) => Number(entry.stage) === 6)
  const point = record?.points?.find((entry) => entry.x === 37 && entry.y === 29)
  if (!point) return ''
  const text = {
    th: {
      title: 'ต่อจากเบาะแสหลังส่งเทียน · ตัวละครเซฟ 1',
      body: `บทพูดชี้ไปทางตะวันตกเฉียงเหนือ แต่ไม่ได้ระบุช่องตกปลาแน่นอน ตารางจุดเกิดปลาใน ROM แยกต่างหากระบุ${akameName(ctx.lang)}ไว้ที่ด่าน 6 พิกัด X ${point.x}, Y ${point.y} หนึ่งจุด; บางรอบจุดนี้อาจไม่ทำงาน`,
      profile: 'ดูข้อมูลอาคาเมะ',
      map: 'เปิดแผนที่ด่าน 6 ที่จุดนี้',
    },
    ja: {
      title: 'ロウソクの後の手掛かり · セーブキャラクター1',
      body: `台詞は北西を示しますが、釣りタイルまでは示しません。別に解析したROMの出現表では${akameName(ctx.lang)}の地点がエリア6のX ${point.x}, Y ${point.y}に1か所あります。生成状態によってこの枠が無効な場合があります。`,
      profile: 'アカメの情報を見る',
      map: 'エリア6のこの地点を地図で見る',
    },
    en: {
      title: 'Follow the candle clue · saved character 1',
      body: `The dialogue points northwest but does not name a fishing tile. The separately decoded ROM spawn table places ${akameName(ctx.lang)} at Area 6, X ${point.x}, Y ${point.y}; this one configured slot can be inactive in some generated states.`,
      profile: 'Open the Akame profile',
      map: 'Open this Area 6 map point',
    },
  }[ctx.lang]
  const profile = ctx.fishProfileLink(AKAME_ID, fishLocations)
  return `<aside class="detail-section quest-next-action" data-quest-next-action="candle-akame"><h3>${ctx.esc(text.title)}</h3><p>${ctx.esc(text.body)}</p><p><a class="route-button" data-quest-fish-profile href="${ctx.esc(profile)}">${ctx.esc(text.profile)} ↗</a> <a class="route-button" data-quest-fish-map href="${ctx.esc(mapsHref(ctx, point))}">${ctx.esc(text.map)} ↗</a></p></aside>`
}

function fireworksAction(ctx, item) {
  if (!isQuestItem(item, FIREWORKS_ID)) return ''
  const text = {
    th: {
      title: 'ใช้ดอกไม้ไฟผิดจุดแล้วต้องหาอีก?',
      body: 'ตรวจเมนูร้านในเมืองด่าน 4: ตารางร้านใน ROM ระบุดอกไม้ไฟราคา ¥50 แต่ยังยืนยันไม่ได้ว่าซื้อซ้ำได้ไม่จำกัด',
      shop: 'เปิดร้านด่าน 4 เพื่อตรวจรายการขาย',
    },
    ja: {
      title: '花火を別の場所で使い、もう1つ必要？',
      body: 'エリア4の町の店を確認してください。ROMの店在庫表には花火が50円で記録されていますが、無制限に買い直せるかは未確認です。',
      shop: 'エリア4の店の販売品を確認',
    },
    en: {
      title: 'Used fireworks at the wrong spot and need another?',
      body: 'Check the Area 4 town shop menu: the ROM stock table lists fireworks at ¥50, but unlimited repeat purchases are not verified.',
      shop: 'Check the Area 4 shop listing',
    },
  }[ctx.lang]
  return `<aside class="detail-section quest-next-action" data-quest-next-action="fireworks-recovery"><h3>${ctx.esc(text.title)}</h3><p>${ctx.esc(text.body)}</p><p><a class="route-button" data-quest-fireworks-shop href="${ctx.esc(shopHref(ctx))}">${ctx.esc(text.shop)} ↗</a></p></aside>`
}

export function questNextActions(ctx, item, fishLocations) {
  return [
    postcardNextAction(ctx, item, fishLocations),
    tofuAlternative(ctx, item),
    milkCanoeChoice(ctx, item),
    candleAction(ctx, item, fishLocations),
    fireworksAction(ctx, item),
  ]
    .filter(Boolean)
    .join('')
}
