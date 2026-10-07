import { FRESH_SAVE_LOCK, flyGroup } from './fly-lock.js'

const PATH_LIMITED_WINGS = new Set(['25', '26', '66', '67'])

export function hasUnverifiedFlyWingPath(item) {
  return item?.category === 'fly_wing' && PATH_LIMITED_WINGS.has(item.id)
}

function recordedBundle(item) {
  return (item.playerUse?.shops || [])
    .filter((shop) => shop.bundle?.wing === item.id)
    .map((shop) => ({ stage: Number(shop.stage), ...shop.bundle }))
    .sort((a, b) => a.stage - b.stage || a.shopPriceYen - b.shopPriceYen)[0]
}

function nameForBundleItem(items, category, id) {
  return (items || []).find((item) => item.category === category && item.id === id)
}

function noBundleCopy(lang, id, fish) {
  const copies = {
    th: {
      label: `ปีก ${id} หาไม่ได้: ไม่มีทั้งในร้านและในร้านทำฟลาย`,
      recommendation: fish
        ? `ข้ามปีกนี้ไปได้ ปีกไม่ได้เลือกปลา จะตก${fish} ให้เปิดหน้าปลาเพื่อดูชุดฟลายที่ซื้อได้`
        : 'ข้ามปีกนี้ไปได้ ปีกมีหน้าที่แค่ผ่านล็อกของเซฟ ถ้าจะประกอบฟลายให้เลือกปีกที่ร้านทำฟลายมีให้ หรือซื้อชุดสำเร็จรูปแทน',
      reason:
        'ร้านและเมนูของร้านทำฟลายที่ตรวจไม่มีปีกชิ้นนี้ ปีกไม่ช่วยให้ปลากินดีขึ้นและไม่ช่วยตอนสู้ มีหน้าที่แค่ผ่านล็อกของเซฟ',
    },
    en: {
      label: `Wing ${id} cannot be had: it is in no shop and not in the fly maker`,
      recommendation: fish
        ? `Skip this wing; a wing does not choose fish. For ${fish}, open the fish page to see the flies you can buy.`
        : 'Skip this wing. A wing is only a ticket past the save’s lock. To build a fly, pick a wing the fly maker offers, or buy a ready-made set.',
      reason:
        'No shop and no fly-maker menu we checked offers this wing. A wing does not make fish bite better and does not help in the fight; it only gets the fly past the lock.',
    },
    ja: {
      label: `ウィング${id}は入手不可：店にも毛バリ職人にもない`,
      recommendation: fish
        ? `このウィングは無視してよい。ウィングは魚を選ばない。${fish}の魚ページで、買えるフライを確認してください。`
        : 'このウィングは無視してよい。ウィングはセーブのロックを通るための部品でしかない。自作するなら職人にあるウィングを選ぶか、完成品を買う。',
      reason:
        '確認した店にも毛バリ職人のメニューにも、このウィングはない。ウィングは食いつきを良くせず、ファイトにも効かない。毛バリがロックを通るためだけの部品。',
    },
  }
  return copies[lang] || copies.en
}

function lockText(lang, item) {
  const blocked = flyGroup(item.id) === FRESH_SAVE_LOCK.wing
  const g = flyGroup(item.id)
  if (lang === 'th')
    return blocked
      ? `ปีกนี้อยู่กลุ่ม ${g} ซึ่งเซฟใหม่ล็อกไว้ ฟลายที่ใช้ปีกนี้จะไม่กินเลยบนเซฟใหม่`
      : `ปีกนี้อยู่กลุ่ม ${g} ไม่ตรงกับล็อกของเซฟใหม่`
  if (lang === 'ja')
    return blocked
      ? `このウィングはグループ${g}で、新規セーブがロックしている。新規セーブではこのウィングの毛バリは一切食いつかない。`
      : `このウィングはグループ${g}で、新規セーブのロックとは一致しない。`
  return blocked
    ? `This wing is group ${g}, the group a fresh save locks, so a fly with it never bites on a fresh save.`
    : `This wing is group ${g}, which does not match a fresh save’s lock.`
}

function bundleCopy(lang, item, bundle, fish, supported) {
  const lock = lockText(lang, item)
  const result = {
    th: {
      label: `ได้เฉพาะในชุดสำเร็จรูปด่าน ${bundle.stage}: บอดี้ ${bundle.body} + ปีก ${bundle.wing} + หาง ${bundle.tail} · ¥${bundle.shopPriceYen} ทั้งชุด`,
      recommendation: fish
        ? supported
          ? `${fish}กินบอดี้ ${bundle.body} ซื้อชุดสำเร็จรูปด่าน ${bundle.stage} (${bundle.body}/${bundle.wing}/${bundle.tail}) ได้ในราคา ¥${bundle.shopPriceYen} ทั้งชุด ${lock}`
          : `${fish}ไม่กินบอดี้ ${bundle.body} ชุดนี้ใช้ตก${fish}ไม่ได้ เปิดหน้าปลาเพื่อดูชุดที่ใช้ได้`
        : `ปีก ${item.id} ได้เฉพาะในชุดสำเร็จรูปด่าน ${bundle.stage}: บอดี้ ${bundle.body} + ปีก ${bundle.wing} + หาง ${bundle.tail} ราคา ¥${bundle.shopPriceYen} ทั้งชุด ${lock}`,
      reason: `ร้านทำฟลายไม่มีปีก ${item.id} ให้เลือกเอง ราคา ¥${bundle.shopPriceYen} คือราคาทั้งชุด ปีกไม่ช่วยให้ปลากินดีขึ้นและไม่ช่วยตอนสู้ มีหน้าที่แค่ผ่านล็อกของเซฟ`,
    },
    en: {
      label: `Only inside the Area ${bundle.stage} ready-made set: body ${bundle.body} + wing ${bundle.wing} + tail ${bundle.tail} · ¥${bundle.shopPriceYen} total`,
      recommendation: fish
        ? supported
          ? `${fish} takes body ${bundle.body}. Buy the area ${bundle.stage} ready-made set (${bundle.body}/${bundle.wing}/${bundle.tail}) for ¥${bundle.shopPriceYen} total. ${lock}`
          : `${fish} does not take body ${bundle.body}, so this set cannot catch it. Open the fish page for sets that can.`
        : `Wing ${item.id} comes only in the area ${bundle.stage} ready-made set: body ${bundle.body} + wing ${bundle.wing} + tail ${bundle.tail}, ¥${bundle.shopPriceYen} for the complete set. ${lock}`,
      reason: `The fly maker does not offer wing ${item.id}; ¥${bundle.shopPriceYen} is the price of the whole set. A wing does not make fish bite better and does not help in the fight; it only gets the fly past the lock.`,
    },
    ja: {
      label: `エリア${bundle.stage}の完成品の中だけ：ボディ${bundle.body}＋ウィング${bundle.wing}＋テール${bundle.tail} · セット価格¥${bundle.shopPriceYen}`,
      recommendation: fish
        ? supported
          ? `${fish}はボディ${bundle.body}を食べる。エリア${bundle.stage}の完成品（${bundle.body}/${bundle.wing}/${bundle.tail}）をセット価格¥${bundle.shopPriceYen}で買う。${lock}`
          : `${fish}はボディ${bundle.body}を食べないので、このセットでは釣れない。魚ページで使えるセットを確認してください。`
        : `ウィング${item.id}はエリア${bundle.stage}の完成品（ボディ${bundle.body}＋ウィング${bundle.wing}＋テール${bundle.tail}、セット価格¥${bundle.shopPriceYen}）の中でしか手に入らない。${lock}`,
      reason: `毛バリ職人ではウィング${item.id}を選べない。¥${bundle.shopPriceYen}はセット全体の価格。ウィングは食いつきを良くせず、ファイトにも効かない。毛バリがロックを通るためだけの部品。`,
    },
  }
  return result[lang] || result.en
}

export function flyWingPlayerDecision(lang, item, allItems = [], fishId = '', fishName = '') {
  if (!hasUnverifiedFlyWingPath(item)) return null
  const bundle = recordedBundle(item)
  if (!bundle) return { ...noBundleCopy(lang, item.id, fishName), bundle: null, itemId: item.id }
  const body = nameForBundleItem(allItems, 'fly', bundle.body)
  const supported = Boolean(fishId && (body?.playerUse?.fishIds || []).includes(fishId))
  const copy = bundleCopy(lang, item, bundle, fishName, supported)
  return { ...copy, bundle, supported, hasTarget: Boolean(fishId), itemId: item.id }
}

function actionLabel(lang, key, bundle) {
  const labels = {
    shop: {
      th: `เปิดร้านด่าน ${bundle.stage} และชุดฟลายนี้`,
      en: `Open area ${bundle.stage} shop and this fly set`,
      ja: `エリア${bundle.stage}の店とこの完成品を見る`,
    },
    body: {
      th: `ตรวจรายชื่อปลาของบอดี้ ${bundle.body}`,
      en: `Check body ${bundle.body} fish list`,
      ja: `ボディ${bundle.body}の対象魚リストを確認`,
    },
    fish: {
      th: 'ดูชุดฟลายและวิธีตกของปลานี้',
      en: 'See this fish’s recorded flies and methods',
      ja: 'この魚のフライ候補と釣り方を見る',
    },
    starter: {
      th: 'ดูชุดสำเร็จรูปและรายชื่อปลาของบอดี้เริ่มต้นที่ใช้ได้บนเซฟใหม่',
      en: 'See the starter body that works on a fresh save, with its ready-made sets and fish list',
      ja: '新規セーブで使える入門ボディの完成品と対象魚リストを見る',
    },
    alternative: {
      th: 'ดูปีกชิ้นอื่นที่มีตำแหน่งเมนูยืนยัน',
      en: 'See a wing with a verified menu position',
      ja: 'メニュー位置を確認した別のウィングを見る',
    },
  }
  return labels[key]?.[lang] || labels[key]?.en || ''
}

export function flyWingPlayerLinks(ctx, decision, hrefs = {}) {
  if (!decision) return ''
  const links = decision.bundle
    ? [
        ...(decision.supported === false && decision.hasTarget ? [] : [['shop', hrefs.shop]]),
        ['body', hrefs.body],
        ...(hrefs.fish ? [['fish', hrefs.fish]] : []),
      ]
    : hrefs.fish
      ? [['fish', hrefs.fish]]
      : [
          ['starter', hrefs.starter],
          ['alternative', hrefs.alternative],
        ]
  const anchors = links
    .filter(([, href]) => href)
    .map(
      ([key, href]) =>
        `<a class="route-button" data-fly-wing-route="${key}" data-item-id="${ctx.esc(decision.itemId || '')}" href="${ctx.esc(href)}">${ctx.esc(actionLabel(ctx.lang, key, decision.bundle || {}))} ↗</a>`,
    )
    .join('')
  return anchors
    ? `<div class="fly-wing-player-actions" data-fly-wing-action="${ctx.esc(decision.itemId || '')}">${anchors}</div>`
    : ''
}
