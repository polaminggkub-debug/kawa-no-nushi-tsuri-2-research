import { rodAreaDecision } from '../../entities/item/index.js'
import { catalogueHpRecoveryAction } from './hp-recovery-tip.js'
import { contextualLureCoverageDecision } from './lure-coverage-guidance.js'
import { contextualFoodDecision } from './food-area-guidance.js'
import {
  areaLabel,
  categoryDecisionCopy,
  hasSelectedArea,
  localRodOffer,
  withStage,
} from './rod-area-page-helpers.js'

export function decisionCard(ctx, d) {
  d = d.id === 'lure_coverage_pair' ? contextualLureCoverageDecision(ctx, d) : d
  d = contextualFoodDecision(ctx, d)
  const marker = d.foodAreaStage
    ? ` data-food-area-choice="${d.foodAreaStage}"`
    : d.id === 'lure_coverage_pair'
      ? ' data-lure-coverage-pair'
      : ''
  const lureGuide = d.id === 'lure_coverage_pair' ? lureCoverageGuide(ctx) : ''
  const nextAction = d.nextAction?.href
    ? `<p><a class="route-button" data-fly-backup-action href="${ctx.esc(d.nextAction.href)}">${ctx.esc(ctx.local(d.nextAction.label))} ↗</a></p>`
    : ''
  const choices = `<div class="decision-items">${(d.items || []).map(ctx.decisionLink).join('')}</div>`
  return `<article class="decision-card"${marker}><h3>${ctx.esc(ctx.local(d.title))}</h3>${d.foodAreaStage ? choices : ''}<p class="decision-action">${ctx.esc(ctx.local(d.recommendation))}</p>${d.reason ? `<p>${ctx.esc(ctx.local(d.reason))}</p>` : ''}${d.foodAreaStage ? '' : choices}${d.scope ? `<small>${ctx.esc(ctx.local(d.scope))}</small>` : ''}${lureGuide}${nextAction}</article>`
}

function lureCoverageGuide(ctx) {
  const link = document.getElementById('kit-link')
  const href = link?.getAttribute?.('href') || ''
  const label = ctx.player?.kitLink
  if (!href || !label) return ''
  return `<p><a class="route-button" data-lure-coverage-guide href="${ctx.esc(href)}">${ctx.esc(label)} ↗</a></p>`
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
      ? 'ใช้ลัวร์หรือคันหวด: เติม HP ให้ถึง 100 ก่อน ถ้าอยากได้เวลาเล็งเต็มของคัน'
      : ctx.lang === 'ja'
        ? 'ルアー・投げ釣り：狙う時間を最大にするには、先にHPを100まで回復する。'
        : 'Lure / casting: restore HP to 100 first to get your rod’s full time to aim.'
  const scope =
    ctx.lang === 'th'
      ? 'หลักฐานนี้ยืนยันผลเรื่องเวลาเล็ง ยังไม่ได้ยืนยันโบนัสโอกาสปลากินเหยื่อ'
      : ctx.lang === 'ja'
        ? '狙う時間への効果は確認済み。食いつき率ボーナスは未確認。'
        : 'This restores time to aim; a bite-rate bonus is not established.'
  const categoryLink =
    ctx.lang === 'th'
      ? 'ดูคำแนะนำของหมวดที่เลือกด้านบน'
      : ctx.lang === 'ja'
        ? '選択中のカテゴリの案内を見る'
        : 'See recommendations for the selected category above'
  const hasCategoryDisclosure = Boolean(
    document.getElementById('category-recommendations-disclosure'),
  )
  document.getElementById('player-decisions').hidden =
    !!document.getElementById('fish-filter').value
  document.getElementById('player-decisions').innerHTML =
    `<h2>${title}</h2><aside class="play-tip"><strong>${tip}</strong><p>${scope}</p><p>${catalogueHpRecoveryAction(ctx)}</p>${hasCategoryDisclosure ? `<p><a class="route-button" data-player-decisions-link href="#category-decisions">${categoryLink} ↗</a></p>` : ''}</aside>`
  const link = document.querySelector?.('[data-player-decisions-link]')
  link?.addEventListener?.('click', () => {
    const disclosure = document.getElementById('category-recommendations-disclosure')
    if (disclosure) disclosure.open = true
  })
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
  const showLureCoverage = category === 'lure' && !selectedFish
  const categoryChoices = ctx.decisions.filter((d) => {
    if (selectedFish) return false
    const matchesCategory = category === 'all' || d.category === category
    const matchesStyle = category !== 'rod' || !style || decisionStyles[d.id] === style
    return matchesCategory && matchesStyle && !(showLureCoverage && d.id === 'lure_coverage_pair')
  })
  return categoryChoices
}

function renderCategoryDecisionDisclosure(ctx, category, categoryChoices) {
  const box = document.getElementById('category-decisions')
  const previous = box.querySelector?.('#category-recommendations-disclosure')
  const keepOpen = Boolean(previous?.open)
  const flyAdvice = ctx.flyDecision(category)
  const showLureCoverage = category === 'lure' && !document.getElementById('fish-filter').value
  const lureCoverage = showLureCoverage
    ? ctx.decisions.find((decision) => decision.id === 'lure_coverage_pair')
    : null
  const priceAdvice =
    category === 'float_weight'
      ? ctx.floatPriceGuide()
      : category === 'hook'
        ? ctx.hookPriceGuide()
        : ''
  const sections = [...categoryChoices.map(ctx.decisionCard), flyAdvice, priceAdvice].filter(
    Boolean,
  )
  const body = sections.join('')
  const count = sections.length
  const visibleLureCard = lureCoverage ? ctx.decisionCard(lureCoverage) : ''
  const copy = categoryDecisionCopy(ctx, category, count)
  box.innerHTML =
    visibleLureCard +
    (body
      ? `<details id="category-recommendations-disclosure" class="overview-disclosure category-recommendations"><summary>${ctx.esc(copy.label)}</summary><div class="category-recommendations-content">${copy.note}${body}</div></details>`
      : '')
  const disclosure = box.querySelector?.('#category-recommendations-disclosure')
  if (
    disclosure &&
    (keepOpen || (typeof location !== 'undefined' && location.hash === '#category-decisions'))
  )
    disclosure.open = true
}

export function renderDecisions(ctx, category) {
  const choices = selectCategoryDecisions(ctx, category)
  renderCategoryDecisionDisclosure(ctx, category, choices)
  renderPlayerDecisionOverview(ctx)
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
  const fish = document.getElementById('fish-filter').value
  const title = fish
    ? ctx.lang === 'th'
      ? `ซื้อทุ่นหรือตะกั่วสำหรับ${ctx.fishName(fish)} ที่ไหน`
      : ctx.lang === 'ja'
        ? `${ctx.fishName(fish)}に使えるウキ・オモリの販売エリア`
        : `Where to buy floats or sinkers for ${ctx.fishName(fish)}`
    : ctx.lang === 'th'
      ? 'ซื้อทุ่นหรือตะกั่วที่ไหนให้ถูกสุดในด่านนี้'
      : ctx.lang === 'ja'
        ? '現在のエリアで最安のウキ・オモリを買う'
        : 'Cheapest stocked float or sinker in your area'
  const note = fish
    ? ctx.lang === 'th'
      ? `ถ้ามีของที่ใช้กับ${ctx.fishName(fish)} อยู่แล้วให้ใช้ต่อ ตารางแสดงเฉพาะของที่ผ่านเงื่อนไขปลานี้และมีบันทึกขายในแต่ละด่าน การผ่านเงื่อนไขไม่รับประกันว่าปลากินหรือจับขึ้นได้`
      : ctx.lang === 'ja'
        ? `${ctx.fishName(fish)}に使える道具を持っていれば継続してください。表には魚の判定を通り、各エリアで販売記録がある品だけを表示します。適合は食いつきや釣果を保証しません。`
        : `Keep a model you already own for ${ctx.fishName(fish)}. The table lists only stocked items that pass this fish’s ROM profile check. Passing the check does not guarantee a bite or catch.`
    : ctx.lang === 'th'
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
    if (fish) return targetFloatChoice(ctx, kind, stage, fish)
    const row = ctx.gearPriceGuide[kind]?.[stage]
    if (!row) return `${none} · ${firstStockLink(ctx, kind)}`
    const item = ctx.allItems.find((i) => i.category === row.category && i.id === row.id)
    return `<a href="${ctx.esc(ctx.areaItemLink(item, stage))}">${ctx.esc(ctx.itemName(item))} (${row.id}) · ¥${row.priceYen}</a>`
  }
  return `<section class="decision-card" id="float-price-guide"><h3>${title}</h3><p>${note}</p><div class="table-wrap"><table><thead><tr><th>${ctx.lang === 'th' ? 'ด่าน' : ctx.lang === 'ja' ? 'エリア' : 'Area'}</th><th>${ctx.lang === 'th' ? 'ทุ่น' : ctx.lang === 'ja' ? 'ウキ' : 'Float'}</th><th>${ctx.lang === 'th' ? 'ตะกั่ว' : ctx.lang === 'ja' ? 'オモリ' : 'Sinker'}</th></tr></thead><tbody>${[1, 2, 3, 4, 5, 6].map((stage) => `<tr><td>${stage}</td><td>${choice('float', stage)}</td><td>${choice('sinker', stage)}</td></tr>`).join('')}</tbody></table></div></section>`
}

function floatRigKind(item) {
  const id = Number.parseInt(item.id, 16)
  if (item.category !== 'float_weight') return ''
  if (id >= 0x01 && id <= 0x08) return 'float'
  if (id >= 0x09 && id <= 0x0a) return 'sinker'
  return ''
}

function stockedForArea(item, stage) {
  return (item.playerUse?.shops || []).some((shop) => Number(shop.stage) === stage)
}

function floatCandidatesForFish(ctx, kind, fish) {
  return ctx.allItems.filter(
    (item) => floatRigKind(item) === kind && (ctx.fishIdsFor(item) || []).includes(fish),
  )
}

function targetFloatOffer(ctx, kind, stage, candidates) {
  const stocked = candidates.filter((item) => stockedForArea(item, stage))
  const guide = ctx.gearPriceGuide[kind]?.[stage]
  const guideItem = stocked.find((item) => item.id === guide?.id)
  const item =
    guideItem ||
    stocked.sort((a, b) => Number(a.priceYen) - Number(b.priceYen) || a.id.localeCompare(b.id))[0]
  if (!item) return null
  return {
    item,
    priceYen: item.id === guideItem?.id ? Number(guide.priceYen) : Number(item.priceYen),
  }
}

function targetFloatChoice(ctx, kind, stage, fish) {
  const candidates = floatCandidatesForFish(ctx, kind, fish)
  if (!candidates.length) return incompatibleFloatText(ctx, kind, fish)
  const offer = targetFloatOffer(ctx, kind, stage, candidates)
  if (!offer) return noCompatibleFloatStockText(ctx, kind, stage, fish, candidates)
  return `<a data-target-float-offer="${kind}" data-target-fish="${ctx.esc(fish)}" href="${ctx.esc(ctx.areaItemLink(offer.item, stage))}">${ctx.esc(ctx.itemName(offer.item))} (${offer.item.id}) · ¥${offer.priceYen}</a>`
}

function incompatibleFloatText(ctx, kind, fish) {
  const rig = kind === 'float' ? ['ทุ่น', 'ウキ', 'float'] : ['ตะกั่ว', 'オモリ', 'sinker']
  const fishName = ctx.fishName(fish)
  const text =
    ctx.lang === 'th'
      ? `ไม่มี${rig[0]}ที่ผ่านเงื่อนไขปลา${fishName}ใน ROM`
      : ctx.lang === 'ja'
        ? `この魚のROM判定を通る${rig[1]}はありません`
        : `No ${rig[2]} passes the ROM profile check for ${fishName}`
  return `<span data-target-rig-incompatible="${kind}" data-target-fish="${ctx.esc(fish)}">${ctx.esc(text)}</span>`
}

function noCompatibleFloatStockText(ctx, kind, stage, fish, candidates) {
  const laterStages = [
    ...new Set(
      candidates.flatMap((item) =>
        (item.playerUse?.shops || [])
          .map((shop) => Number(shop.stage))
          .filter((shopStage) => shopStage > stage),
      ),
    ),
  ].sort((a, b) => a - b)
  const nextStage = laterStages.find((shopStage) =>
    targetFloatOffer(ctx, kind, shopStage, candidates),
  )
  const nextOffer = nextStage ? targetFloatOffer(ctx, kind, nextStage, candidates) : null
  if (!nextOffer) {
    return `<span data-no-compatible-float-stock data-target-fish="${ctx.esc(fish)}">${ctx.lang === 'th' ? 'ไม่มีของที่ผ่านเงื่อนไขปลาในสต็อกด่านนี้' : ctx.lang === 'ja' ? 'このエリアに魚の判定を通る在庫はありません' : 'No stocked item in this area passes the fish check'}</span>`
  }
  const message =
    ctx.lang === 'th'
      ? `ด่าน ${stage} ไม่มีของที่ผ่านเงื่อนไขปลา; มีขายตั้งแต่ด่าน ${nextStage}`
      : ctx.lang === 'ja'
        ? `エリア${stage}には適合品がありません。エリア${nextStage}から販売記録があります。`
        : `No matching stock in area ${stage}; recorded from area ${nextStage}.`
  return `<span data-no-compatible-float-stock data-target-fish="${ctx.esc(fish)}">${ctx.esc(message)} <a data-target-float-next-stock="${kind}" data-target-fish="${ctx.esc(fish)}" href="${ctx.esc(ctx.areaItemLink(nextOffer.item, nextStage))}">${ctx.esc(ctx.itemName(nextOffer.item))} (${nextOffer.item.id}) · ¥${nextOffer.priceYen}</a></span>`
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

function noReadyFlyCard(ctx, fish) {
  const title =
    ctx.lang === 'th'
      ? 'ปลานี้ควรใช้อะไร'
      : ctx.lang === 'ja'
        ? 'この魚には何を使うか'
        : 'What to use for this fish'
  const note =
    ctx.lang === 'th'
      ? 'ยังไม่มีชุดฟลายสำเร็จรูปที่ผ่านเงื่อนไขให้แนะนำ เปิดหน้าปลาเพื่อเลือกวิธีตกและอุปกรณ์ที่รองรับ'
      : ctx.lang === 'ja'
        ? '条件に合う店売り毛バリは案内できません。魚のページで対応する釣り方と道具を選んでください。'
        : 'No qualifying ready-made fly is listed. Open this fish’s guide to choose a supported method and setup.'
  const action =
    ctx.lang === 'th'
      ? 'เลือกชุดตกสำหรับปลานี้'
      : ctx.lang === 'ja'
        ? '対応する釣り方と道具を見る'
        : 'Choose a setup for this fish'
  return `<article class="decision-card"><h3>${ctx.esc(title)}</h3><p>${ctx.esc(note)}</p><a class="route-button" data-fly-fallback="${ctx.esc(fish)}" href="${ctx.esc(ctx.fishHref(fish))}">${ctx.esc(action)} ↗</a></article>`
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

function hasThreeBundleFlyBackup(ctx, fish) {
  const bundles = ctx.allItems
    .filter((item) => item.category === 'fly' && (ctx.useOf(item).fishIds || []).includes(fish))
    .flatMap((item) => (ctx.useOf(item).shops || []).map((shop) => shop.bundle).filter(Boolean))
  const residue = (id) => Number.parseInt(id, 16) & 3
  for (let first = 0; first < bundles.length; first += 1) {
    for (let second = first + 1; second < bundles.length; second += 1) {
      for (let third = second + 1; third < bundles.length; third += 1) {
        const choices = [bundles[first], bundles[second], bundles[third]]
        if (
          new Set(choices.map((bundle) => residue(bundle.body))).size === 3 &&
          new Set(choices.map((bundle) => residue(bundle.wing))).size === 3
        )
          return true
      }
    }
  }
  return false
}

function flyBackupAction(ctx, fish) {
  const labels = {
    th: 'ถ้าชุดเริ่มต้นติดเงื่อนไขซ่อน: ดูชุดสำรองของปลานี้ · ไม่รับประกันว่าปลากิน',
    en: 'If the starter is blocked by the hidden check: see this fish’s backup sets · no bite guarantee',
    ja: '最初のセットが隠し判定でブロックされたら、この魚の予備セットを見る（食いつき保証ではありません）',
  }
  return hasThreeBundleFlyBackup(ctx, fish)
    ? { href: `${ctx.fishHref(fish)}#fly-backup`, label: labels }
    : null
}

export function flyDecision(ctx, category) {
  const fish = document.getElementById('fish-filter').value
  if (!['flymaker', 'all'].includes(category) || !fish) return ''
  const stage = Number(ctx.locationStage || (ctx.fishLocations[fish]?.locations || [])[0]?.stage)
  const { offer, sameArea } = findFlyOffer(ctx, fish, stage)
  if (!offer) return noReadyFlyCard(ctx, fish)
  const decision = flyDecisionCopy(ctx, fish, offer, sameArea)
  decision.nextAction = flyBackupAction(ctx, fish)
  return ctx.decisionCard(decision)
}

function rodAreaTableAlternatives(ctx, decision) {
  if (!decision?.alternatives?.length) return ''
  const fallbackStage = decision.status === 'style-unstocked' ? decision.nextStockStage : 0
  const links = decision.alternatives
    .map((ref) =>
      ctx.allItems.find(
        (candidate) => candidate.category === ref.category && candidate.id === ref.id,
      ),
    )
    .filter(Boolean)
    .map((candidate) => {
      const href = fallbackStage
        ? withStage(ctx.itemHref(candidate), fallbackStage)
        : ctx.itemHref(candidate)
      const stage = fallbackStage ? ` data-stage="${fallbackStage}"` : ''
      return `<a data-rod-area-alternative="${ctx.esc(candidate.id)}"${stage} href="${ctx.esc(href)}">${ctx.esc(ctx.itemName(candidate))} (${ctx.esc(candidate.id)})${fallbackStage ? ` · ${ctx.esc(areaLabel(ctx, fallbackStage))}` : ''} ↗</a>`
    })
    .join(' · ')
  if (!links) return ''
  return fallbackStage
    ? `<div data-rod-area-next-stock="${fallbackStage}">${links}</div>`
    : `<div data-rod-area-alternatives>${links}</div>`
}

function rodTableAdvice(ctx, item, areaDecision) {
  const linkLabel =
    ctx.lang === 'th'
      ? 'ดูเงื่อนไขซื้อและคันที่เทียบ'
      : ctx.lang === 'ja'
        ? '購入条件・比較候補を見る'
        : 'See purchase conditions and alternatives'
  const advice = areaDecision || item.rodDecision
  const marker = areaDecision
    ? ` data-rod-area-decision="${areaDecision.stage}" data-rod-area-status="${ctx.esc(areaDecision.status)}"`
    : ''
  const alternatives = rodAreaTableAlternatives(ctx, areaDecision)
  return `<td class="rod-table-advice"${marker}><strong>${ctx.esc(ctx.local(advice?.label))}</strong><a href="${ctx.esc(ctx.itemHref(item))}">${linkLabel} ↗</a>${alternatives}</td>`
}

function rodComparisonRow(ctx, item, styles) {
  const selected = hasSelectedArea(ctx)
  const areaDecision = selected ? rodAreaDecision(ctx.lang, item, ctx.allItems, selected) : null
  const stockPrice = areaDecision
    ? localRodOffer(areaDecision)
      ? ctx.formatYen(item)
      : ctx.lang === 'th'
        ? `${areaLabel(ctx, selected)}: ไม่พบรายการขายที่บันทึกไว้`
        : ctx.lang === 'ja'
          ? `${areaLabel(ctx, selected)}：販売記録なし`
          : `${areaLabel(ctx, selected)}: no offer recorded`
    : ctx.useOf(item).shops?.length
      ? ctx.formatYen(item)
      : ctx.lang === 'th'
        ? 'ไม่พบในร้าน'
        : ctx.lang === 'ja'
          ? '店頭在庫なし'
          : 'No recorded shop stock'
  const rowMarker = areaDecision
    ? ` data-rod-area-decision="${selected}" data-rod-area-status="${ctx.esc(areaDecision.status)}"${localRodOffer(areaDecision) ? ' data-selected-area-offer="true"' : ''}`
    : ''
  return `<tr${rowMarker}><td><a href="${ctx.esc(ctx.itemHref(item))}">${ctx.esc(ctx.itemName(item))}</a></td><td>${ctx.esc(styles[item.decodedFields.styleCode])}</td><td>${item.decodedFields.castAimHoldCutoffInternal}</td><td>${item.decodedFields.rangeMultiplier}</td><td>${ctx.esc(stockPrice)}</td>${rodTableAdvice(ctx, item, areaDecision)}</tr>`
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
      ? { 1: 'ทุ่น / อายุ', 2: 'หวด', 4: 'ลัวร์', 8: 'ฟลาย' }
      : ctx.lang === 'ja'
        ? { 1: 'ウキ・アユ', 2: '投げ', 4: 'ルアー', 8: 'フライ' }
        : { 1: 'Float / Ayu', 2: 'Casting', 4: 'Lure', 8: 'Fly' }
  box.innerHTML = `<details id="rod-comparison-details" class="overview-disclosure comparison"${wasOpen ? ' open' : ''}><summary>${ctx.esc(ctx.player.compare)} · ${rods.length}</summary><p>${ctx.lang === 'th' ? 'เวลาเล็งมาก = ขยับเป้าหมายได้นานขึ้น; สายขาดยากมาก = ปลาดึงหนีได้ไกลกว่าก่อนอุปกรณ์หลุด ตัวเลขใช้เทียบกันเท่านั้น ไม่ใช่เมตรหรือคะแนนพลัง และปลายังหนีด้วยวิธีอื่นได้' : ctx.lang === 'ja' ? '狙う時間が大きいほど、狙いを動かせる時間が長い。糸の切れにくさが大きいほど、魚が遠くまで引いても道具を失いにくい。数値は比べるためのもので、メートルや強さではない。他の逃げ方もある。' : 'More aim time lets you move the target longer. A higher line strength means the fish can pull farther before tackle is lost. The numbers are only for comparing rods, not metres or power. Fish can still escape other ways.'}</p><div class="table-wrap"><table><thead><tr><th>${ctx.esc(ctx.copy.item)}</th><th>${ctx.esc(ctx.player.style)}</th><th>${ctx.esc(ctx.player.aim)}</th><th>${ctx.esc(ctx.player.reach)}</th><th>${ctx.lang === 'th' ? 'ราคาซื้อ' : ctx.lang === 'ja' ? '購入価格' : 'Purchase price'}</th><th>${ctx.lang === 'th' ? 'คำแนะนำ' : ctx.lang === 'ja' ? '選び方' : 'Recommendation'}</th></tr></thead><tbody>${rods
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
