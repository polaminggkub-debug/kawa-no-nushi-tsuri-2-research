import { readableEvidenceHref } from '../../shared/lib/index.js'
const COPY = {
  th: {
    title: (stage) => `ไปประกอบที่เมืองด่าน ${stage}`,
    body: (a) =>
      `เข้าเมืองจากทางเข้าลำดับที่ ${a.entrance.ordinal + 1} บนแผนที่ด่าน (X${a.entrance.fieldTile.x},Y${a.entrance.fieldTile.y}) จะมาถึง X${a.entrance.townArrival.x},Y${a.entrance.townArrival.y} ในเมือง จากนั้นหาคนทำฟลายที่ X${a.makerTile.x},Y${a.makerTile.y} เลือกตระกูลนี้แล้วเลือกชิ้นส่วนตามภาพด้านล่าง ไม่ต้องซื้อชิ้นส่วนไปก่อน เหลือช่องฟลายว่างและตรวจราคาสุทธิก่อนจ่าย`,
    link: 'ดูทางเข้าเมืองและตำแหน่งคนทำฟลาย',
    limit:
      'ตำแหน่งและตระกูลเมนูมาจาก ROM ยังไม่ได้ทดลองเดินเส้นทางนี้หรือยืนยันขั้นตอนเนื้อเรื่องเพื่อเข้าด่านที่ระบุ',
  },
  en: {
    title: (stage) => `Make this at the Area ${stage} town fly maker`,
    body: (a) =>
      `Use town entrance ${a.entrance.ordinal + 1} on the area map (X${a.entrance.fieldTile.x},Y${a.entrance.fieldTile.y}), arriving at town X${a.entrance.townArrival.x},Y${a.entrance.townArrival.y}. Find the fly maker at X${a.makerTile.x},Y${a.makerTile.y}, choose this family, then select parts using the pictures below. You do not need to buy loose components first. Keep a free fly slot and check the final quote before paying.`,
    link: 'Show town entrance and fly-maker location',
    limit:
      'Location and menu families are established from ROM code. This walking route and story progression into the specified area have not been replayed.',
  },
  ja: {
    title: (stage) => `エリア${stage}の町の毛バリ職人で作成する`,
    body: (a) =>
      `屋外の町入口${a.entrance.ordinal + 1}（X${a.entrance.fieldTile.x},Y${a.entrance.fieldTile.y}）から入り、町のX${a.entrance.townArrival.x},Y${a.entrance.townArrival.y}に到着します。X${a.makerTile.x},Y${a.makerTile.y}の毛バリ職人に話し、この系統を選んで下の画像どおり部品を選択します。部品の事前購入は不要です。フライ欄に空きを残し、支払前に見積額を確認してください。`,
    link: '町入口と毛バリ職人の場所を見る',
    limit:
      '場所とメニュー系統はROMのコードで確認しています。この歩行経路と対象エリアに至るストーリー進行は再現していません。',
  },
}

export function flyMakerAccess(ctx, item) {
  const choice = item.flyMakerMenuChoice
  const access =
    choice?.availableAccess?.find((entry) => entry.stage === Number(ctx.selectedStage)) ||
    choice?.access
  if (!access || ![1, 2, 3].includes(access.stage)) return ''
  const text = COPY[ctx.lang] || COPY.en
  const query = new URLSearchParams({
    stage: String(access.stage),
    place: 'town',
    maker: '1',
    entrance: String(access.entrance.ordinal),
  })
  if (ctx.selectedFish) query.set('fish', ctx.selectedFish)
  const route = ctx.selectedRoute || ctx.params?.get('route')
  if (['float', 'sinker', 'lure', 'fly'].includes(route)) query.set('route', route)
  query.set('return', ctx.currentLocalRoute())
  const suffix = ctx.lang === 'en' ? '' : `.${ctx.lang}`
  const href = `shops${suffix}.html?${query}#fly-maker-location`
  return `<aside class="detail-section" data-fly-maker-access><h3>${ctx.esc(text.title(access.stage))}</h3><p>${ctx.esc(text.body(access))}</p><a class="route-button" data-fly-maker-location-link href="${ctx.esc(href)}">${ctx.esc(text.link)} ↗</a><details><summary>${ctx.esc(ctx.lang === 'th' ? 'หลักฐานและขอบเขต' : ctx.lang === 'ja' ? '根拠と確認範囲' : 'Evidence and limits')}</summary><p>${ctx.esc(text.limit)}</p><a href="${ctx.esc(readableEvidenceHref(access.evidenceHref))}">ROM ↗</a></details></aside>`
}
