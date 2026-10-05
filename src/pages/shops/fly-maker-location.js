const COPY = {
  th: {
    title: (stage) => `คนทำฟลาย · เมืองด่าน ${stage}`,
    note: (family, point) =>
      `คนนี้ประกอบ${family} เข้ามาทางเข้าลำดับที่ 2 จะเริ่มที่ X7,Y29 แล้วหาจุด X${point.x},Y${point.y} ตามรูป ตรวจช่องฟลายว่างและราคาก่อนยืนยัน ตำแหน่งมาจาก ROM ยังไม่ได้ทดลองเดินเส้นทางนี้`,
    field: 'ดูทางเข้าเมืองบนแผนที่ด่าน',
    unavailable:
      'ยังไม่มีตำแหน่งคนทำฟลายที่ยืนยันในด่านนี้ เลือกเมืองตามตระกูลฟลายที่ต้องการประกอบ',
    recovery: [
      'ด่าน 1 · เมย์ฟลาย / แคดดิส / เทอเรสเทรียล',
      'ด่าน 2 · ดิพเทรา / สโตนฟลาย / เทอเรสเทรียล',
    ],
  },
  en: {
    title: (stage) => `Fly maker · Area ${stage} town`,
    note: (family, point) =>
      `This maker assembles ${family}. Entrance 2 arrives at X7,Y29; find X${point.x},Y${point.y} using the picture. Check a free fly slot and the quote before confirming. The location is ROM-derived; this walk has not been replayed.`,
    field: 'Show the town entrance on the area map',
    unavailable:
      'No maker location is verified here. Choose a recorded town for the fly family you want to make.',
    recovery: [
      'Area 1 · Mayfly / Caddis / Terrestrial',
      'Area 2 · Diptera / Stonefly / Terrestrial',
    ],
  },
  ja: {
    title: (stage) => `毛バリ職人 · エリア${stage}の町`,
    note: (family, point) =>
      `${family}を作成する職人です。入口2からX7,Y29に到着し、画像のX${point.x},Y${point.y}を目指します。フライ欄の空きと見積額を確認してから決定してください。場所はROMに基づき、この歩行経路は再現していません。`,
    field: '屋外地図で町入口を見る',
    unavailable:
      'このエリアの職人の場所は未確認です。作りたい系統に対応する確認済みの町を選んでください。',
    recovery: [
      'エリア1 · メイフライ / カディス / テレストリアル',
      'エリア2 · ディプテラ / ストーンフライ / テレストリアル',
    ],
  },
}

function familyName(lang, stage) {
  const names =
    stage % 2
      ? {
          th: 'เมย์ฟลาย คัดดิส และเทเรสเทรียล',
          en: 'Mayfly, Caddis and Terrestrial flies',
          ja: 'メイフライ・カディス・テレストリアル',
        }
      : {
          th: 'ดิพเทรา สโตนฟลาย และเทเรสเทรียล',
          en: 'Diptera, Stonefly and Terrestrial flies',
          ja: 'ディプテラ・ストーンフライ・テレストリアル',
        }
  return names[lang] || names.en
}

function makerRecovery(ctx, text) {
  const links = [1, 2].map((stage, index) => {
    const href =
      ctx.shopsUrl({ stage, place: 'town', entrance: '1', maker: '1' }).split('#')[0] +
      '#fly-maker-location'
    return `<a class="route-button" data-maker-recovery-stage="${stage}" href="${ctx.esc(href)}">${ctx.esc(text.recovery[index])} ↗</a>`
  })
  return `<aside id="fly-maker-location" data-maker-recovery><p>${ctx.esc(text.unavailable)}</p>${links.join(' ')}</aside>`
}

export function flyMakerLocation(ctx, view) {
  if (!ctx.flyMakerIntent && location.hash !== '#fly-maker-location') return ''
  const text = COPY[ctx.lang] || COPY.en
  const node = view.interactions.find((entry) => entry.handler === '03:9517')
  if (![1, 2, 3].includes(view.stage) || !node) {
    return makerRecovery(ctx, text)
  }
  const href =
    ctx.shopsUrl({ stage: view.stage, place: 'area', entrance: '1' }).split('#')[0] +
    '#location-section'
  const card = ctx.mapCard({
    heading: text.title(view.stage),
    note: text.note(familyName(ctx.lang, view.stage), node.townTile),
    image: view.townMap,
    coord: node.townTile,
    bounds: view.area.townTerrain,
    source: node.handler,
    extra: `<a class="route-button" data-maker-field-entrance href="${ctx.esc(href)}">${ctx.esc(text.field)} ↗</a>`,
  })
  return `<div id="fly-maker-location" data-fly-maker-location>${card}</div>`
}

export function setMakerPageCopy(ctx) {
  if (!ctx.flyMakerIntent) return
  const copy = {
    th: [
      'ประกอบฟลายที่ไหน / เข้าทางไหน?',
      'แผนที่ชี้คนทำฟลายและทางเข้าเมือง ไม่ต้องซื้อชิ้นส่วนไปก่อน เลือกภาพชิ้นส่วนที่คนทำฟลายและตรวจราคาเสนอ ส่วนรายการสินค้าด้านล่างเป็นของร้านขายทั่วไปในด่าน',
    ],
    en: [
      'Where can I make a fly / enter town?',
      'Find the maker and town entrance on the map. You do not need to buy loose components first: choose the maker pictures and check the quote. Stock listed below belongs to the regular area shop.',
    ],
    ja: [
      '毛バリ職人と町入口はどこ？',
      '地図で毛バリ職人と町入口を確認します。部品の事前購入は不要。職人の画像から選び、見積額を確認してください。下の商品一覧は通常の店の在庫です。',
    ],
  }[ctx.lang]
  const title = ctx.$('shop-page-title')
  const intro = ctx.$('shop-page-intro')
  if (title) title.textContent = copy[0]
  if (intro) intro.textContent = copy[1]
}
