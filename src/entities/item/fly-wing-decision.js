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
      label: `ไม่มีขายที่ไหนเลย (ID ${id})`,
      recommendation: fish
        ? `ร้าน ชุดสำเร็จรูป และเมนูช่างประกอบฟลายไม่มีชิ้นส่วน ID ${id} จึงเลือกใช้ไม่ได้ ถ้าจะตก${fish} ให้เปิดหน้าปลาเพื่อดูชุดฟลายหรือวิธีอื่นที่มีบันทึก`
        : `ร้าน ชุดสำเร็จรูป และเมนูช่างประกอบฟลายไม่มีชิ้นส่วน ID ${id} จึงเลือกใช้ไม่ได้ ถ้าจะประกอบฟลายให้เลือกบอดี้ตามปลาเป้าหมาย แล้วใช้ปีกที่ช่างแสดงให้เลือก หรือดูชุดเริ่มต้นบอดี้ 01 สำหรับปลาในรายชื่อของบอดี้นั้น`,
      reason:
        'เปิดร้านทั้งหกด่านและเมนูช่างประกอบฟลายในเกมแล้วไม่พบชิ้นนี้ที่ไหน และยังไม่มีหลักฐานโบนัสการกินหรือดึงปลาจากชิ้นนี้',
    },
    en: {
      label: `Not sold anywhere (ID ${id})`,
      recommendation: fish
        ? `No shop, ready-made set or fly maker menu offers part ID ${id}, so you cannot choose it. For ${fish}, open the fish profile to see recorded flies or other methods.`
        : `No shop, ready-made set or fly maker menu offers part ID ${id}, so you cannot choose it. For a custom fly, match the body to your target first, then pick a wing the maker shows; otherwise see the starter body 01 bundle for fish in its list.`,
      reason:
        'All six shops and the fly makers were opened in the game and none lists this part. No bite or landing bonus from it is established.',
    },
    ja: {
      label: `どこでも入手できない（ID ${id}）`,
      recommendation: fish
        ? `店・完成品セット・毛バリ職人のどこにも部品ID ${id}は出ないため、選べません。${fish}の魚ページで、記録のあるフライや別の釣り方を確認してください。`
        : `店・完成品セット・毛バリ職人のどこにも部品ID ${id}は出ないため、選べません。自作する場合は先に対象魚に合うボディを選び、職人が表示するウィングを使ってください。対象魚が未定なら、ボディ01の対象魚リストにある魚向けの入門セットを確認できます。`,
      reason:
        '6つの店と毛バリ職人をゲーム内で開いて確認しましたが、この部品はどこにもありません。食いつき・取り込みボーナスも確認されていません。',
    },
  }
  return copies[lang] || copies.en
}

function bundleCopy(lang, item, bundle, fish, supported) {
  const result = {
    th: {
      label: `ชุดสำเร็จรูปด่าน ${bundle.stage}: บอดี้ ${bundle.body} + ปีก ${bundle.wing} + หาง ${bundle.tail} · ¥${bundle.shopPriceYen} ทั้งชุด`,
      recommendation: fish
        ? supported
          ? `ปลาเป้าหมาย ${fish} อยู่ในรายชื่อของบอดี้ ${bundle.body}; ลองชุดสำเร็จรูปด่าน ${bundle.stage} (${bundle.body}/${bundle.wing}/${bundle.tail}) ได้ในราคา ¥${bundle.shopPriceYen} ทั้งชุด ไม่ใช่ราคาปีกอย่างเดียว`
          : `ปลาเป้าหมาย ${fish} ไม่อยู่ในรายชื่อที่บันทึกไว้ของบอดี้ ${bundle.body}; อย่าเลือกชุดนี้เป็นตัวเลือกที่รองรับเป้าหมายนี้ เปิดหน้าปลาเพื่อดูชุดและวิธีอื่นที่มีบันทึก`
        : `ถ้าจะใช้ปีก ${item.id} มีชุดสำเร็จรูปด่าน ${bundle.stage}: บอดี้ ${bundle.body} + ปีก ${bundle.wing} + หาง ${bundle.tail} ราคา ¥${bundle.shopPriceYen} ทั้งชุด ตรวจว่าปลาเป้าหมายอยู่ในรายชื่อบอดี้ ${bundle.body} ก่อนซื้อ`,
      reason: `ปีก ${item.id} มีเฉพาะในชุดสำเร็จรูปนี้ ไม่อยู่ในเมนูช่างประกอบฟลาย และ ¥${bundle.shopPriceYen} คือราคารวมทั้งชุด (คิดเท่าราคาบอดี้) ยังไม่มีหลักฐานว่าปีกนี้เพิ่มโอกาสปลากินหรือช่วยให้ตกขึ้น`,
    },
    en: {
      label: `Area ${bundle.stage} ready-made set: body ${bundle.body} + wing ${bundle.wing} + tail ${bundle.tail} · ¥${bundle.shopPriceYen} total`,
      recommendation: fish
        ? supported
          ? `The target ${fish} is listed for body ${bundle.body}. You can try the area ${bundle.stage} ready-made set (${bundle.body}/${bundle.wing}/${bundle.tail}) for ¥${bundle.shopPriceYen} total, not for the wing alone.`
          : `The target ${fish} is not in the recorded list for body ${bundle.body}; this set is not a listed profile match. Open the fish page for recorded flies and other methods.`
        : `If you want wing ${item.id}, the recorded ready-made set is area ${bundle.stage}: body ${bundle.body} + wing ${bundle.wing} + tail ${bundle.tail}, ¥${bundle.shopPriceYen} for the complete set. Check that your target is listed for body ${bundle.body} before buying.`,
      reason: `Wing ${item.id} appears only in this ready-made set and is not in the fly maker menu. ¥${bundle.shopPriceYen} is the complete-set price (the body's price). No bite or landing advantage from this wing is established.`,
    },
    ja: {
      label: `エリア${bundle.stage}の完成品：ボディ${bundle.body}＋ウィング${bundle.wing}＋テール${bundle.tail} · セット価格¥${bundle.shopPriceYen}`,
      recommendation: fish
        ? supported
          ? `対象の${fish}はボディ${bundle.body}の記録済みリストにあります。エリア${bundle.stage}の完成品（${bundle.body}/${bundle.wing}/${bundle.tail}）をセット価格¥${bundle.shopPriceYen}で試せます。ウィング単体の価格ではありません。`
          : `対象の${fish}はボディ${bundle.body}の記録済みリストにありません。このセットは記録上の対象一致ではありません。魚ページで記録のあるフライや別の釣り方を確認してください。`
        : `ウィング${item.id}を使う店売り完成品は、エリア${bundle.stage}のボディ${bundle.body}＋ウィング${bundle.wing}＋テール${bundle.tail}、セット価格¥${bundle.shopPriceYen}です。購入前に対象魚がボディ${bundle.body}のリストにあるか確認してください。`,
      reason: `ウィング${item.id}はこの完成品セットにだけ入っていて、毛バリ職人のメニューにはありません。¥${bundle.shopPriceYen}はセット全体の価格（ボディの値段）です。このウィングによる食いつき・取り込み向上は確認されていません。`,
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
      th: 'ดูชุดสำเร็จรูปและรายชื่อปลาของบอดี้ 01',
      en: 'See body 01’s ready-made sets and fish list',
      ja: 'ボディ01の完成品と対象魚リストを見る',
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
