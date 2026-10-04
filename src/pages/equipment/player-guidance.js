export function decisionCard(ctx, d) {
  return `<article class="decision-card"><h3>${ctx.esc(ctx.local(d.title))}</h3><p class="decision-action">${ctx.esc(ctx.local(d.recommendation))}</p>${d.reason ? `<p>${ctx.esc(ctx.local(d.reason))}</p>` : ''}<div class="decision-items">${(d.items || []).map(ctx.decisionLink).join('')}</div>${d.scope ? `<small>${ctx.esc(ctx.local(d.scope))}</small>` : ''}</article>`
}

function renderPlayerDecisionOverview(ctx) {
  const title =
    ctx.lang === 'th'
      ? 'ซื้ออะไร พกอะไร ทำอะไรก่อนตก'
      : ctx.lang === 'ja'
        ? '買う・持つ・釣る前にすること'
        : 'What to buy, carry and do before fishing'
  const tip =
    ctx.lang === 'th'
      ? 'ใช้ลัวร์หรือตีเหยื่อ: เติม HP ให้ถึง 100 ก่อน ถ้าอยากได้เวลาเล็งเต็มของคัน'
      : ctx.lang === 'ja'
        ? 'ルアー・投げ釣り：照準時間を最大にするには、先にHPを100まで回復する。'
        : 'Lure / casting: restore HP to 100 first to get your rod’s full aiming time.'
  const scope =
    ctx.lang === 'th'
      ? 'หลักฐานนี้ยืนยันผลเรื่องเวลาเล็ง ยังไม่ได้ยืนยันโบนัสโอกาสปลากินเหยื่อ'
      : ctx.lang === 'ja'
        ? '照準時間への効果を確認。食いつき率ボーナスは未確認。'
        : 'This restores aiming time; a bite-rate bonus is not established.'
  document.getElementById('player-decisions').hidden =
    !!document.getElementById('fish-filter').value
  document.getElementById('player-decisions').innerHTML =
    `<h2>${title}</h2><aside class="play-tip"><strong>${tip}</strong><p>${scope}</p></aside><div class="decision-grid">${ctx.decisions.map(ctx.decisionCard).join('')}</div>`
}

function selectCategoryDecisions(ctx, category) {
  const style = document.getElementById('style-filter').value
  const decisionStyles = {
    float_rod_path: '1',
    casting_rod_path: '2',
    lure_rod_path: '4',
    fly_rod_path: '8',
  }
  const selectedFish = document.getElementById('fish-filter').value
  const categoryChoices = ctx.decisions.filter(
    (d) =>
      !selectedFish &&
      d.category === category &&
      (category !== 'rod' || !style || decisionStyles[d.id] === style) &&
      !(category === 'flymaker' && selectedFish),
  )
  return categoryChoices
}

function renderCategoryDecisionDisclosure(ctx, category, categoryChoices) {
  const box = document.getElementById('category-decisions')
  const previous = box.querySelector?.('#category-recommendations-disclosure')
  const keepOpen = Boolean(previous?.open)
  const flyAdvice = ctx.flyDecision(category)
  const priceAdvice =
    category === 'float_weight'
      ? ctx.floatPriceGuide()
      : category === 'hook'
        ? ctx.hookPriceGuide()
        : ''
  const sections = [
    ...(category === 'all' ? [] : categoryChoices.map(ctx.decisionCard)),
    flyAdvice,
    priceAdvice,
  ].filter(Boolean)
  const body = sections.join('')
  const count = sections.length
  box.innerHTML = body
    ? `<details id="category-recommendations-disclosure" class="overview-disclosure category-recommendations"><summary>${ctx.esc(ctx.cardUi.categoryAdvice(count))}</summary><div class="category-recommendations-content">${body}</div></details>`
    : ''
  const disclosure = box.querySelector?.('#category-recommendations-disclosure')
  if (
    disclosure &&
    (keepOpen || (typeof location !== 'undefined' && location.hash === '#category-decisions'))
  )
    disclosure.open = true
}

export function renderDecisions(ctx, category) {
  renderPlayerDecisionOverview(ctx)
  const choices = selectCategoryDecisions(ctx, category)
  renderCategoryDecisionDisclosure(ctx, category, choices)
}

export function hookPriceGuide(ctx) {
  const title =
    ctx.lang === 'th'
      ? 'เบ็ดหายหรือยังไม่มี? ซื้อเบ็ดทั่วไปที่ถูกสุดในด่านนี้'
      : ctx.lang === 'ja'
        ? '針を失った・持っていない？現在エリアの最安の汎用針'
        : 'Lost your hook or have none? Buy the cheapest stocked generic hook'
  const note =
    ctx.lang === 'th'
      ? 'ถ้ามีเบ็ดอยู่แล้วใช้ต่อได้ ซื้อเมื่อต้องเติมเบ็ดสำหรับชุดทุ่นหรือตะกั่ว ตารางนี้เทียบราคาเบ็ดที่ไม่ผูกกับปลาเฉพาะ ไม่ใช่อันดับดึงปลาสำเร็จ และไม่ต้องซื้อเบ็ดชุดเหยื่อสำหรับลัวร์หรือฟลาย'
      : ctx.lang === 'ja'
        ? '所持している針はそのまま使えます。ウキ・オモリ仕掛けの針が必要な時だけ購入。魚ID一致分岐のない針の価格比較で、釣果順位ではありません。ルアー・フライ用にエサ釣りの針を買う必要はありません。'
        : 'Keep the hook you own. Buy only when a float or sinker bait rig needs a hook. This compares prices of hooks without a species-match branch, not landing success. Do not buy a bait-rig hook for lure or fly fishing.'
  return `<section class="decision-card" id="hook-price-guide"><h3>${title}</h3><p>${note}</p><div class="table-wrap"><table><thead><tr><th>${ctx.lang === 'th' ? 'ด่าน' : ctx.lang === 'ja' ? 'エリア' : 'Area'}</th><th>${ctx.lang === 'th' ? 'ซื้อชิ้นนี้ถ้าต้องเติมเบ็ด' : ctx.lang === 'ja' ? '針が必要なら購入' : 'Buy if you need a hook'}</th></tr></thead><tbody>${[
    1, 2, 3, 4, 5, 6,
  ]
    .map((stage) => {
      const row = ctx.gearPriceGuide.hook[stage],
        item = ctx.allItems.find((i) => i.category === row.category && i.id === row.id)
      return `<tr><td>${stage}</td><td><a data-hook-budget-stage="${stage}" href="${ctx.esc(ctx.areaItemLink(item, stage))}">${ctx.esc(ctx.itemName(item))} (${row.id}) · ¥${row.priceYen}</a></td></tr>`
    })
    .join('')}</tbody></table></div></section>`
}

export function floatPriceGuide(ctx) {
  const title =
    ctx.lang === 'th'
      ? 'ซื้อทุ่นหรือตะกั่วที่ไหนให้ถูกสุดในด่านนี้'
      : ctx.lang === 'ja'
        ? '現在のエリアで最安のウキ・オモリを買う'
        : 'Cheapest stocked float or sinker in your area'
  const note =
    ctx.lang === 'th'
      ? 'มีรุ่นเดิมอยู่แล้วใช้ต่อได้ ตารางนี้เลือกจากราคาของที่มีขาย ไม่ใช่อันดับจับปลา ทุ่นกับตะกั่วใช้คนละชุดปลา: เปิดรายละเอียดเพื่อตรวจปลาเป้าหมายก่อนซื้อ'
      : ctx.lang === 'ja'
        ? '所持品はそのまま使えます。店頭価格による選択であり釣果順位ではありません。ウキとオモリの対応魚は違うため、購入前に詳細で魚を確認してください。'
        : 'Keep the model you own. These choices use recorded shop prices, not catch rankings. Float and sinker routes accept different fish; check the item profile for your target before buying.'
  const none =
    ctx.lang === 'th'
      ? 'ไม่พบในสต็อกด่านนี้'
      : ctx.lang === 'ja'
        ? '店頭記録なし'
        : 'No recorded stock'
  const choice = (kind, stage) => {
    const row = ctx.gearPriceGuide[kind]?.[stage]
    if (!row) return `${none} · ${firstStockLink(ctx, kind)}`
    const item = ctx.allItems.find((i) => i.category === row.category && i.id === row.id)
    return `<a href="${ctx.esc(ctx.areaItemLink(item, stage))}">${ctx.esc(ctx.itemName(item))} (${row.id}) · ¥${row.priceYen}</a>`
  }
  return `<section class="decision-card" id="float-price-guide"><h3>${title}</h3><p>${note}</p><div class="table-wrap"><table><thead><tr><th>${ctx.lang === 'th' ? 'ด่าน' : ctx.lang === 'ja' ? 'エリア' : 'Area'}</th><th>${ctx.lang === 'th' ? 'ทุ่น' : ctx.lang === 'ja' ? 'ウキ' : 'Float'}</th><th>${ctx.lang === 'th' ? 'ตะกั่ว' : ctx.lang === 'ja' ? 'オモリ' : 'Sinker'}</th></tr></thead><tbody>${[1, 2, 3, 4, 5, 6].map((stage) => `<tr><td>${stage}</td><td>${choice('float', stage)}</td><td>${choice('sinker', stage)}</td></tr>`).join('')}</tbody></table></div></section>`
}

function findFlyOffer(ctx, fish, stage) {
  const offers = ctx.allItems
    .filter((i) => i.category === 'fly' && (ctx.useOf(i).fishIds || []).includes(fish))
    .flatMap((i) =>
      (ctx.useOf(i).shops || []).filter((s) => s.bundle).map((s) => ({ body: i, ...s })),
    )
    .sort((a, b) => a.bundle.shopPriceYen - b.bundle.shopPriceYen || a.stage - b.stage)
  const sameArea = offers.filter((o) => o.stage === stage)
  return { offer: (sameArea.length ? sameArea : offers)[0], sameArea }
}

function noReadyFlyCard(ctx) {
  return `<article class="decision-card"><h3>${ctx.lang === 'th' ? 'ปลานี้ควรใช้อะไร' : ctx.lang === 'ja' ? 'この魚には何を使うか' : 'What to use for this fish'}</h3><p>${ctx.lang === 'th' ? 'ยังไม่มีชุดฟลายสำเร็จรูปที่ผ่านเงื่อนไขบอดี้ให้แนะนำ ลองเลือกหมวดเหยื่อจริงหรือลัวร์สำหรับปลานี้' : ctx.lang === 'ja' ? 'ボディ判定に合う店売り毛バリは案内できない。この魚のエサ・ルアーを選ぶ。' : 'No qualifying ready-made fly is listed. Switch to bait or lure for this target.'}</p></article>`
}

function flyDecisionCopy(ctx, fish, offer, sameArea) {
  const b = offer.bundle,
    refs = [
      { category: 'fly', id: b.body },
      { category: 'fly_wing', id: b.wing },
      { category: 'fly_tail', id: b.tail },
    ].filter((r) => r.id !== '00')
  const action =
    ctx.lang === 'th'
      ? `สำหรับ${ctx.fishName(fish)} เริ่มลองชุดนี้ได้: ร้านฟลายด่าน ${offer.stage} ราคา ${b.shopPriceYen} เยนทั้งชุด`
      : ctx.lang === 'ja'
        ? `${ctx.fishName(fish)}なら、この構成から試せる。エリア${offer.stage}の毛バリ店、完成品${b.shopPriceYen}円。`
        : `For ${ctx.fishName(fish)}, start with this ready-made fly: area ${offer.stage} fly shop, ¥${b.shopPriceYen} for the complete bundle.`
  const reason =
    ctx.lang === 'th'
      ? `เลือกชุดราคาต่ำสุดที่บอดี้ผ่านเงื่อนไขปลานี้${sameArea.length ? 'ในด่านของแผนที่ที่เลือก' : ''} เพื่อลดเงินที่ต้องจ่าย ไม่ใช่เพราะพิสูจน์ว่าจับง่ายที่สุด`
      : ctx.lang === 'ja'
        ? `ボディ判定に合う${sameArea.length ? '選択エリア内の' : ''}最安の店売り構成を選び、出費を抑える。釣果の最良構成ではない。`
        : `Lowest listed price among qualifying bodies${sameArea.length ? ' in the selected fishing area' : ''}, to limit your spending; not a proven best-catching fly.`
  const scope =
    ctx.lang === 'th'
      ? 'ยังมีเงื่อนไขซ่อนของบอดี้กับปีก ถ้าปลาไม่กิน การตีซ้ำไม่สุ่มค่านั้นใหม่ อย่าเหมาว่าราคาสูงกว่าจะดีกว่า'
      : ctx.lang === 'ja'
        ? '隠しボディ・ウィング条件も残る。投げ直しでは再抽選されず、高価なほど良いとは限らない。'
        : 'Hidden body/wing conditions still apply. Recasting does not reroll them; paying more is not an established advantage.'
  return {
    title:
      ctx.lang === 'th'
        ? 'ชุดฟลายสำหรับปลาที่เลือก'
        : ctx.lang === 'ja'
          ? '選んだ魚の毛バリ候補'
          : 'Fly to try for your selected fish',
    recommendation: action,
    reason,
    scope,
    items: refs,
  }
}

export function flyDecision(ctx, category) {
  const fish = document.getElementById('fish-filter').value
  if (!['flymaker', 'all'].includes(category) || !fish) return ''
  const stage = Number(ctx.locationStage || (ctx.fishLocations[fish]?.locations || [])[0]?.stage)
  const { offer, sameArea } = findFlyOffer(ctx, fish, stage)
  return offer ? ctx.decisionCard(flyDecisionCopy(ctx, fish, offer, sameArea)) : noReadyFlyCard(ctx)
}

function rodTableAdvice(ctx, item) {
  const linkLabel =
    ctx.lang === 'th'
      ? 'ดูเงื่อนไขซื้อและคันที่เทียบ'
      : ctx.lang === 'ja'
        ? '購入条件・比較候補を見る'
        : 'See purchase conditions and alternatives'
  return `<td class="rod-table-advice"><strong>${ctx.esc(ctx.local(item.rodDecision?.label))}</strong><a href="${ctx.esc(ctx.itemHref(item))}">${linkLabel} ↗</a></td>`
}

function rodComparisonRow(ctx, item, styles) {
  const stockPrice = ctx.useOf(item).shops?.length
    ? ctx.formatYen(item)
    : ctx.lang === 'th'
      ? 'ไม่พบในร้าน'
      : ctx.lang === 'ja'
        ? '店頭在庫なし'
        : 'No recorded shop stock'
  return `<tr><td><a href="${ctx.esc(ctx.itemHref(item))}">${ctx.esc(ctx.itemName(item))}</a></td><td>${ctx.esc(styles[item.decodedFields.styleCode])}</td><td>${item.decodedFields.castAimHoldCutoffInternal}</td><td>${item.decodedFields.rangeMultiplier}</td><td>${ctx.esc(stockPrice)}</td>${rodTableAdvice(ctx, item)}</tr>`
}

export function renderComparison(ctx, category) {
  const box = document.getElementById('rod-comparison')
  if (category !== 'rod') {
    box.innerHTML = ''
    return
  }
  const rods = ctx.allItems.filter((item) => item.category === 'rod')
  const wasOpen = Boolean(box.querySelector?.('.comparison')?.open)
  const styles =
    ctx.lang === 'th'
      ? { 1: 'ทุ่น / อายุ', 2: 'ตีเหยื่อ', 4: 'ลัวร์', 8: 'ฟลาย' }
      : ctx.lang === 'ja'
        ? { 1: 'ウキ・アユ', 2: '投げ', 4: 'ルアー', 8: 'フライ' }
        : { 1: 'Float / Ayu', 2: 'Casting', 4: 'Lure', 8: 'Fly' }
  box.innerHTML = `<details id="rod-comparison-details" class="overview-disclosure comparison"${wasOpen ? ' open' : ''}><summary>${ctx.esc(ctx.player.compare)} · ${rods.length}</summary><p>${ctx.lang === 'th' ? 'เวลาเล็งสูง = ขยับจุดเป้าหมายได้นานขึ้น; ขอบเขตสูง = ปลาออกไปไกลกว่าเดิมก่อนเข้าเงื่อนไขหนีและเสียอุปกรณ์ที่แกะได้ ตัวเลขเป็นหน่วยเปรียบเทียบภายใน ไม่ใช่เมตรหรือคะแนนพลัง และปลาอาจหนีด้วยเงื่อนไขอื่น' : ctx.lang === 'ja' ? '照準時間が大きいほど狙いを動かせる時間が長い。魚位置の境界が大きいほど、追跡した道具喪失分岐に入るまで魚が遠くに行ける。内部比較値であり、メートル・強さではない。別条件の逃げもある。' : 'More aim time lets you move the target longer. A higher fish-position limit allows the fish farther out before the traced tackle-loss escape condition. Values are internal comparisons, not metres or power. Other escape conditions still apply.'}</p><div class="table-wrap"><table><thead><tr><th>${ctx.esc(ctx.copy.item)}</th><th>${ctx.esc(ctx.player.style)}</th><th>${ctx.esc(ctx.player.aim)}</th><th>${ctx.esc(ctx.player.reach)}</th><th>${ctx.lang === 'th' ? 'ราคาซื้อ' : ctx.lang === 'ja' ? '購入価格' : 'Purchase price'}</th><th>${ctx.lang === 'th' ? 'คำแนะนำ' : ctx.lang === 'ja' ? '選び方' : 'Recommendation'}</th></tr></thead><tbody>${rods
    .slice()
    .sort(
      (a, b) =>
        a.decodedFields.styleCode - b.decodedFields.styleCode ||
        b.decodedFields.rangeMultiplier - a.decodedFields.rangeMultiplier,
    )
    .map((item) => rodComparisonRow(ctx, item, styles))
    .join('')}</tbody></table></div></details>`
}

function firstStockLink(ctx, kind) {
  const first = Object.entries(ctx.gearPriceGuide[kind] || {})
    .filter(([, row]) => row)
    .sort(([a], [b]) => Number(a) - Number(b))[0]
  if (!first) return ''
  const [stage, row] = first
  const item = ctx.allItems.find((entry) => entry.category === row.category && entry.id === row.id)
  if (!item) return ''
  const label =
    ctx.lang === 'th'
      ? `ดูสต็อกแรก: ด่าน ${stage}`
      : ctx.lang === 'ja'
        ? `最初の在庫：エリア${stage}`
        : `First stock: area ${stage}`
  return `<a data-first-stock="${kind}" href="${ctx.esc(ctx.areaItemLink(item, stage))}">${ctx.esc(label)} · ¥${row.priceYen}</a>`
}
