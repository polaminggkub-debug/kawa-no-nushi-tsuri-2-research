import { flyWorksOnFreshSave } from '../../entities/item/index.js'

function findBackupOffers(ctx, items, choices) {
  const definitions = choices?.profiles?.[ctx.id]?.bundles || []
  if (definitions.length !== 3) return []
  const offers = definitions.map((def) => {
    const body = items.find((item) => item.category === 'fly' && item.id === def.body)
    const shop = body?.playerUse?.shops?.find(
      (entry) =>
        entry.stage === def.stage &&
        entry.bundle?.body === def.body &&
        entry.bundle?.wing === def.wing &&
        entry.bundle?.tail === def.tail,
    )
    return { def, body, bundle: shop?.bundle }
  })
  return offers.every((offer) => offer.body?.playerUse?.fishIds?.includes(ctx.id) && offer.bundle)
    ? offers
    : []
}

function backupTitle(ctx) {
  if (ctx.locale === 'th') return 'ฟลายไม่ติด? พกชุดสามตัวกันล็อกเปลี่ยน'
  if (ctx.locale === 'ja') return 'フライに反応しない？ ロック変更に備える3本セット'
  return 'No bite on a fly? A three-fly set against a lock change'
}

function backupIntro(ctx, total) {
  if (ctx.locale === 'th')
    return `เซฟทุกอันมีล็อกลับที่อาจเปลี่ยนหลังนอนโรงแรม ชุดสามตัวนี้ถูกที่สุดที่ปลานี้กิน และมีบอดี้กับปีกอยู่คนละกลุ่มกันหมด จึงมีอย่างน้อยหนึ่งตัวที่ใช้ได้ไม่ว่าล็อกจะเป็นเลขไหน ซื้อใหม่รวม ¥${total} ไม่ต้องซื้อครบเพื่อเริ่มตก เซฟใหม่เริ่มจากตัวที่ติดป้าย “ใช้ได้บนเซฟใหม่” ก็พอ`
  if (ctx.locale === 'ja')
    return `どのセーブにも隠しロックがあり、宿泊で変わることがあります。この3本は、この魚が食べる最安の組み合わせで、ボディとウィングのグループがすべて違うため、ロックがどの数字でも少なくとも1本は使えます。新規購入は合計${total}円。始めるのに全部買う必要はありません。新規セーブでは「新規セーブで使える」の表示があるものから使えば十分です。`
  return `Every save has a hidden lock that an inn rest can change. These three are the cheapest flies this fish takes, and their bodies and wings are all in different groups, so at least one works whatever the lock is. They cost ¥${total} in total when buying new, and you do not need all three to start. On a fresh save, begin with the one marked “Works on a fresh save”.`
}

function backupAction(ctx) {
  if (ctx.locale === 'th')
    return 'ใส่ทีละตัวในฉากเดิมได้เลย ไม่ต้องนอนโรงแรมหรือเปลี่ยนฉาก ถ้าทุ่นอยู่ช่องของปลาแล้วไม่มีปลาตัวไหนสนใจฟลายเลย ให้สลับไปตัวถัดไป ถ้าปลาหันมาหาฟลายแสดงว่าตัวนั้นผ่านล็อกแล้ว ไม่ต้องเปลี่ยน'
  if (ctx.locale === 'ja')
    return '同じフィールドのまま、宿泊や移動なしで1本ずつ切り替えます。ウキを魚のマスに置いても魚がまったく反応しないときは次の1本へ。魚がこちらを向いたら、そのフライはロックを通っているので替える必要はありません。'
  return 'Swap them one at a time in the same field; no inn stay or travel needed. If your float is on the fish’s tile and nothing reacts to the fly, switch to the next one. If a fish turns toward the fly, it has passed the lock; change nothing.'
}

function backupScope(ctx) {
  if (ctx.locale === 'th')
    return 'การตีซ้ำด้วยฟลายตัวเดิมไม่เปลี่ยนล็อก มีแต่การนอนโรงแรมที่เปลี่ยนได้ (ราว 34% ที่เลขใดเลขหนึ่งเปลี่ยน) นอนแล้วให้ใส่ฟลายอีกครั้ง'
  if (ctx.locale === 'ja')
    return '同じフライで投げ直してもロックは変わりません。変わるのは宿泊だけです（どちらかの数字が変わる確率は約34%）。泊まったら毛バリを装備し直してください。'
  return 'Recasting the same fly never changes the lock; only an inn rest can (about a 34% chance that one of the two numbers changes). Re-equip your fly after resting.'
}

function lockBadge(ctx, bundle) {
  const works = flyWorksOnFreshSave(bundle)
  const text = works
    ? { th: 'ใช้ได้บนเซฟใหม่', ja: '新規セーブで使える', en: 'Works on a fresh save' }
    : {
        th: 'ติดล็อกบนเซฟใหม่ (ใช้เมื่อล็อกเปลี่ยน)',
        ja: '新規セーブではロックされる（ロックが変わったら使う）',
        en: 'Locked on a fresh save (use it once the lock changes)',
      }
  return `<p class="fly-backup-lock" data-fresh-save="${works ? 'works' : 'locked'}"><strong>${ctx.escapeHtml(text[ctx.locale] || text.en)}</strong></p>`
}

function backupLocation(ctx, def) {
  if (ctx.locale === 'th') return `ร้านด่าน ${def.stage} · รายการฟลายที่ ${def.slot + 1}`
  if (ctx.locale === 'ja') return `エリア${def.stage}の店・フライ一覧の${def.slot + 1}番目`
  return `Area ${def.stage} shop · fly entry ${def.slot + 1}`
}

function backupBuyLabel(ctx) {
  if (ctx.locale === 'th') return 'ดูร้านที่ขายชุดนี้'
  if (ctx.locale === 'ja') return 'このセットの販売店を見る'
  return 'Find the shop for this set'
}

function backupParts(items, def) {
  return [
    ['fly', def.body],
    ['fly_wing', def.wing],
    ['fly_tail', def.tail],
  ]
    .filter(([, id]) => id !== '00')
    .map(([category, id]) => items.find((item) => item.category === category && item.id === id))
    .filter(Boolean)
}

function backupPartsNote(ctx) {
  if (ctx.locale === 'th')
    return 'รูปด้านล่างคือชิ้นส่วนในชุดสำเร็จรูปนี้ ซื้อเป็นชุดตามรายการร้านด้านบน ไม่ใช่ซื้อแต่ละชิ้นแยกกัน'
  if (ctx.locale === 'ja')
    return '下の画像はこの完成セットの構成品です。上記の店頭項目でセットとして買い、部品を個別購入する意味ではありません。'
  return 'The images below are parts of this ready-made set. Buy the listed shop bundle, not these parts separately.'
}

function backupShopLink(ctx, def, stage) {
  const params = new URLSearchParams({
    stage: String(def.stage),
    place: 'town',
    category: 'fly',
    id: def.body,
    fish: ctx.id,
    return: ctx.currentFishPath(stage),
  })
  return `shops${ctx.locale === 'en' ? '' : `.${ctx.locale}`}.html?${params}`
}

function backupCard(ctx, offer, items, stage) {
  const { def, bundle } = offer
  const parts = backupParts(items, def)
    .map((item) => ctx.itemLink({ item, routes: [] }, stage))
    .join('')
  return `<article class="detail-section fly-backup" data-bundle="${def.body}/${def.wing}/${def.tail}" data-price="${bundle.shopPriceYen}"><h4>${ctx.escapeHtml(backupLocation(ctx, def))} · ¥${bundle.shopPriceYen}</h4>${lockBadge(ctx, def)}<p>${ctx.escapeHtml(backupPartsNote(ctx))}</p>${parts}<a class="route-button" href="${ctx.escapeHtml(backupShopLink(ctx, def, stage))}">${ctx.escapeHtml(backupBuyLabel(ctx))} ↗</a></article>`
}

function backupCards(ctx, offers, items, stage) {
  return offers.map((offer) => backupCard(ctx, offer, items, stage)).join('')
}

function backupResearchLink(ctx) {
  const source =
    'https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/docs/fly-selection-practical-research.md'
  return `<a href="${source}">${ctx.escapeHtml(ctx.copy.evidence)} ↗</a>`
}

export function renderFlyFallback(ctx, items, stage, choices) {
  const offers = findBackupOffers(ctx, items, choices)
  if (!offers.length) return ''
  const total = offers.reduce((sum, offer) => sum + offer.bundle.shopPriceYen, 0)
  const cards = backupCards(ctx, offers, items, stage)
  return `<details id="fly-backup" class="detail-section fly-fallback" data-total="${total}"><summary>${ctx.escapeHtml(backupTitle(ctx))}</summary><p>${ctx.escapeHtml(backupIntro(ctx, total))}</p><p><strong>${ctx.escapeHtml(backupAction(ctx))}</strong></p><div class="detail-grid">${cards}</div><p class="muted">${ctx.escapeHtml(backupScope(ctx))}</p>${backupResearchLink(ctx)}</details>`
}
