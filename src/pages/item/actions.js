import { categoryGuideLink } from '../../entities/item/index.js'

export function boatBoardingChoice(ctx, item) {
  if (item.category !== 'general_tool' || !['01', '02'].includes(item.id)) return ''
  const canoe = item.id === '02'
  const kind = canoe ? 'canoe' : 'tub'
  const label =
    ctx.lang === 'th'
      ? `มี${canoe ? 'แคนู' : 'กะละมัง'}แล้ว? ดูจุดวางและวิธีขึ้นที่ทดลองสำเร็จ`
      : ctx.lang === 'ja'
        ? `${canoe ? 'カヌー' : 'タライ'}を持っている？確認した設置・乗船手順を見る`
        : `Already own a ${kind}? See a tested placement and boarding sequence`
  return `<p><a class="route-button" data-${kind}-boarding-choice href="#${kind}-boarding-1">${ctx.esc(label)} ↓</a></p>`
}

export function gearNextActions(ctx, item, fishVisuals, fishLocations, allItems) {
  if (!item.gearDecision) return ''
  const guideLink = (category, marker) => {
    const href = categoryGuideLink({
      lang: ctx.lang,
      category,
      fish: ctx.selectedFish,
      stage: ctx.selectedStage,
      route: ctx.selectedRoute,
      returnPath: ctx.currentLocalRoute(),
    })
    const label =
      category === 'hook'
        ? ctx.lang === 'th'
          ? 'เบ็ดหายหรือยังไม่มี? ดูเบ็ดที่ถูกสุดตามขนาดปลาทั้งหกด่าน'
          : ctx.lang === 'ja'
            ? '針を失った・持っていない？6エリアの大きさ別最安の針を見る'
            : 'Lost your hook or have none? See the cheapest hook by fish size in each area'
        : ctx.lang === 'th'
          ? 'ดูทุ่นและตะกั่วราคาต่ำสุดแยกทั้งหกด่าน'
          : ctx.lang === 'ja'
            ? '6エリアの最安ウキ・オモリを見る'
            : 'See the cheapest float and sinker in each of six areas'
    return `<p><a class="route-button" data-${marker}-price-guide href="${ctx.esc(href)}">${label} ↗</a></p>`
  }
  if (item.category === 'float_weight') return guideLink('float_weight', 'float')
  const ids = (item.gearDecision.targetFish || []).filter((id) => fishVisuals[id])
  const hookBudget = item.category === 'hook' ? guideLink('hook', 'hook') : ''
  if (item.category === 'hook' && !ids.length) return hookBudget
  if (item.category === 'hook' && ids.length)
    return (
      hookBudget +
      `<p>${ctx.lang === 'th' ? 'ดูเหยื่อและจุดตกของปลาที่ชื่อเบ็ดอ้างถึง' : ctx.lang === 'ja' ? 'ハリ名が参照する魚のエサ・場所を確認' : 'See bait and locations for the fish named by this hook'}</p>${ids.map((id) => `<a class="route-button" href="${ctx.esc(ctx.fishProfileLink(id, fishLocations))}">${ctx.esc(ctx.fishName(id, fishVisuals))} ↗</a>`).join('')}`
    )
  if (item.category.startsWith('fly')) {
    const target = ctx.selectedFish && fishVisuals[ctx.selectedFish] ? ctx.selectedFish : ''
    if (target) {
      const supported = allItems.some(
        (candidate) =>
          candidate.category === 'fly' && candidate.playerUse?.fishIds?.includes(target),
      )
      return `<p><a class="route-button" data-fly-next href="${ctx.esc(ctx.fishProfileLink(target, fishLocations))}${supported ? '#fly-backup' : ''}">${supported ? (ctx.lang === 'th' ? 'ดูชุดฟลายเริ่มต้นและชุดสำรองสำหรับปลาที่เลือก' : ctx.lang === 'ja' ? '選んだ魚の最初の毛バリと予備を見る' : 'See starter and backup flies for the selected fish') : ctx.lang === 'th' ? 'ปลานี้ไม่ผ่านเงื่อนไขฟลาย: ดูเหยื่อและวิธีอื่น' : ctx.lang === 'ja' ? 'この魚はフライ判定に不適合：他のエサ・釣法を見る' : 'This fish fails the fly profile check: see other bait and methods'} ↗</a></p>`
    }
    if (item.category === 'fly')
      return `<p>${ctx.lang === 'th' ? 'เลือกปลาในรายชื่อด้านล่าง เพื่อดูจุดตกและชุดฟลายเริ่มต้น/สำรองของปลานั้น' : ctx.lang === 'ja' ? '下の魚一覧から選び、場所と最初の毛バリ・予備を確認してください。' : 'Choose a fish in the list below to see its locations and starter/backup flies.'}</p>`
    return `<p><a class="route-button" data-fly-next href="item${ctx.lang === 'en' ? '' : '.' + ctx.lang}.html?category=fly&id=01&return=${encodeURIComponent(ctx.currentLocalRoute())}">${ctx.lang === 'th' ? 'เลือกปลาจากรายชื่อบอดี้ แล้วดูชุดฟลายในหน้าปลา' : ctx.lang === 'ja' ? 'ボディの魚一覧から選び、魚ページで毛バリ候補を見る' : 'Choose a fish from the body list, then see flies on its profile'} ↗</a></p>`
  }
  return ''
}

export function areaItemLink(ctx, item, stage, hash = '', pointReturn = '') {
  // Switching areas of this item keeps the entry page as the back destination.
  const sameItem = item.category === ctx.category && item.id === ctx.requestedId
  const returnRoute =
    ctx.safeLocalRoute(pointReturn) ||
    (sameItem
      ? ctx.safeLocalRoute(ctx.params.get('return')) || ctx.fallbackBack()
      : ctx.currentLocalRoute())
  const [page, query] = ctx.detailItemLink(item, returnRoute).split('?')
  const linkParams = new URLSearchParams(query)
  linkParams.set('stage', String(stage))
  if (ctx.selectedRoute) linkParams.set('route', ctx.selectedRoute)
  return page + '?' + linkParams + hash
}

export function foragePointReturn(ctx, stage, context) {
  const query = new URLSearchParams(location.search)
  query.set('stage', String(stage))
  return `${location.pathname}?${query}#forage-stage-${stage}-context-${Number(context)}`
}

export function compassUseChoice(ctx, item) {
  if (item.category !== 'general_tool' || item.id !== '0E') return ''
  const locations = item.playerUse?.useLocations || []
  if (!locations.length) return ''
  const label =
    ctx.lang === 'th'
      ? 'หลงทาง? ดูจุดออกของด่านที่อยู่'
      : ctx.lang === 'ja'
        ? '迷ったら現在エリアの出口地点を見る'
        : 'Lost? See the exit point for your current area'
  return `<aside class="detail-section compass-exit-choice" data-compass-exit-choice><h3>${label}</h3><p>${ctx.lang === 'th' ? 'เลือกด่าน แล้วดูรูปเข็มทิศที่ชี้จุดทางเชื่อม เข็มจะหยุดเมื่อถึงช่องเป้าหมาย แต่คำบอกทิศไม่ใช่เส้นทางหลบสิ่งกีดขวาง' : ctx.lang === 'ja' ? 'エリアを選び、磁石画像が示す連絡路の地点を確認します。目標タイルで針が止まりますが、方角表示は障害物を避ける経路案内ではありません。' : 'Choose an area and find the connecting-route point marked by the compass picture. The needle stops at its target tile; the heading does not supply a route around obstacles.'}</p>${locations.map((loc) => `<p><a data-compass-location href="${ctx.esc(ctx.areaItemLink(item, loc.stage, '#compass-exit-' + loc.stage))}">${ctx.lang === 'th' ? 'ด่าน' : ctx.lang === 'ja' ? 'エリア' : 'Area'} ${loc.stage} · ${ctx.lang === 'th' ? 'ดูจุดที่เข็มหยุด' : ctx.lang === 'ja' ? '針が止まる地点を見る' : 'See where the needle stops'} ↗</a></p>`).join('')}</aside>`
}

export function gatheredBaitChoices(ctx, item, allItems) {
  if (!item.gatheredBaitByArea) return ''
  const title =
    ctx.lang === 'th'
      ? 'เหยื่อที่ตาข่ายหาได้: เลือกดูว่าใช้ตกปลาอะไร'
      : ctx.lang === 'ja'
        ? '金アミで採れるエサ：対応魚を見る'
        : 'Baits gathered with the net: see which fish accept them'
  return `<section class="detail-section gathered-bait"><h3>${title}</h3>${item.playerUse?.useLocations?.some((l) => l.kind === 'runtime_net_use') ? `<p class="net-location-choice" data-net-location-choice><a href="${ctx.esc(ctx.areaItemLink(item, 1, '#use-locations'))}">${ctx.lang === 'th' ? 'ด่าน 1: ดูภาพช่องน้ำตื้นที่ทดลองใช้ตาข่ายสำเร็จ' : ctx.lang === 'ja' ? 'エリア1：アミ使用に成功した浅瀬を見る' : 'Area 1: see the shallow tile where net use succeeded'} ↗</a><br>${ctx.lang === 'th' ? 'ยังไม่ยืนยันเส้นทางเดินจากทางเข้า; หากไปถึงช่องนี้แล้วจึงใช้ตำแหน่งนี้ได้' : ctx.lang === 'ja' ? '入口からの経路は未確認。このタイルに到達した場合の使用地点です。' : 'The walking route from the entrance remains unconfirmed; use this location if you reach the tile.'}</p>` : ''}${Object.entries(
    item.gatheredBaitByArea,
  )
    .map(([stage, id]) => {
      const bait = allItems.find((i) => i.category === 'bait' && i.id === id)
      return `<p>${ctx.lang === 'th' ? 'ด่าน' : ctx.lang === 'ja' ? 'エリア' : 'Area'} ${stage} · <a data-gathered-bait href="${ctx.esc(ctx.areaItemLink(bait, stage))}">${ctx.esc(ctx.imageName(bait))} (${id}) ↗</a></p>`
    })
    .join('')}</section>`
}

export function baitGatherChoice(ctx, item) {
  if (!item.netGatherArea) return ''
  const note =
    ctx.lang === 'th'
      ? `ถ้ามีตาข่ายสีทองอยู่แล้ว หาเหยื่อนี้ได้ในด่าน ${item.netGatherArea}: ยืนในน้ำตื้น ใช้ตาข่าย แล้วขยับช่องก่อนใช้ซ้ำ แทนการซื้อเหยื่อเพิ่ม`
      : ctx.lang === 'ja'
        ? `金アミを持っているならエリア${item.netGatherArea}の浅瀬でこのエサを採れます。浅瀬に立って使い、次は別のタイルへ移動してください。追加購入の代わりになります。`
        : `If you already own the gold net, gather this bait in area ${item.netGatherArea} instead of buying more: stand in shallow water, use the net, then move to a new tile before using it again.`
  const label =
    ctx.lang === 'th'
      ? 'ดูวิธีใช้ตาข่ายและจำนวนที่เก็บได้'
      : ctx.lang === 'ja'
        ? '金アミの使い方と採れる個数を見る'
        : 'See net use and gathering amounts'
  return `<aside class="detail-section bait-gather-choice" data-bait-gather-choice><p>${ctx.esc(note)}</p><a href="${ctx.esc(ctx.areaItemLink({ category: 'general_tool', id: '04' }, item.netGatherArea, item.netGatherArea === 1 ? '#use-locations' : ''))}">${label} ↗</a></aside>`
}

export function forageBaitChoice(ctx, item, items) {
  if (item.category !== 'bait') return ''
  const routeIds = item.playerUse?.fishIdsByRoute?.[ctx.selectedRoute]
  if (ctx.selectedFish && routeIds && !routeIds.includes(ctx.selectedFish)) return ''
  const glass = items.find((i) => i.category === 'general_tool' && i.id === '03')
  const points = (glass?.playerUse?.useLocations || []).filter(
    (loc) =>
      loc.forage &&
      (loc.markerItems || []).some((ref) => ref.category === 'bait' && ref.id === item.id),
  )
  const stages = [...new Set(points.map((loc) => Number(loc.stage)))]
  if (!stages.length) return ''
  const shown =
    ctx.selectedStage && stages.includes(ctx.selectedStage) ? [ctx.selectedStage] : stages
  const note =
    ctx.lang === 'th'
      ? 'ถ้ามีแว่นขยายอยู่แล้ว ลองหาเหยื่อนี้แทนการซื้อเพิ่ม: ยืนบนพื้นดินแห้งที่ช่องตัวอย่างแล้วใช้แว่นขยาย ในน้ำใช้ไม่ได้ ขยับช่องก่อนค้นซ้ำ บางช่องมีผลลัพธ์ได้สองชนิด จึงไม่รับประกันว่าจะได้ชนิดนี้ทุกครั้ง'
      : ctx.lang === 'ja'
        ? '虫メガネを持っているなら、追加購入の代わりに探索できます。陸地の地点で使い（水の中では使えません）、再探索前に移動してください。2種類の候補がある地点では毎回このエサが出るとは限りません。'
        : 'If you already own the magnifying glass, try gathering instead of buying more: stand on dry land at one of the listed tiles (it does not work in water) and move before searching again. Some tiles have two possible results, so this bait is not guaranteed every time.'
  return `<aside class="detail-section forage-bait-choice" data-forage-bait-choice><p>${ctx.esc(note)}</p>${shown
    .map((stage) => {
      const loc = points.find((point) => Number(point.stage) === stage)
      return `<p><a data-forage-bait href="${ctx.esc(ctx.areaItemLink(glass, stage, '#forage-stage-' + stage + '-context-' + Number(loc.context)))}">${ctx.lang === 'th' ? 'ด่าน' : ctx.lang === 'ja' ? 'エリア' : 'Area'} ${stage} · ${ctx.lang === 'th' ? 'ดูภาพจุดตัวอย่างหาเหยื่อนี้' : ctx.lang === 'ja' ? 'このエサの探索地点例を見る' : 'See an example search tile for this bait'} ↗</a></p>`
    })
    .join('')}</aside>`
}

export function daikonFishChoice(ctx, item, fishLocations) {
  if (!item.exchangeFishId) return ''
  const fishLabel =
    item.exchangeFishId === '22'
      ? ctx.lang === 'th'
        ? 'ฮาริโยะ'
        : ctx.lang === 'ja'
          ? 'ハリヨ'
          : 'Hariyo'
      : ctx.lang === 'th'
        ? 'ปลายามาโนะคามิ'
        : ctx.lang === 'ja'
          ? 'ヤマノカミ'
          : 'Yamanokami'
  const label =
    ctx.lang === 'th'
      ? 'ดู' + fishLabel + ': จุดตกและเหยื่อ'
      : ctx.lang === 'ja'
        ? fishLabel + 'の場所・エサを確認'
        : 'See ' + fishLabel + ' locations and bait'
  const href = ctx.fishProfileLink(item.exchangeFishId, fishLocations)
  return `<aside class="detail-section daikon-fish-choice" ${item.tubExchange ? 'data-tub-choice' : 'data-daikon-choice'}><a class="route-button" href="${ctx.esc(href)}">${ctx.esc(label)} ↗</a></aside>`
}

export function keepnetAlternatives(ctx, item, items) {
  if (!item.keepnetCapacity) return ''
  const quest = items.find((candidate) => candidate.category === 'food' && candidate.id === '07')
  const questLabel =
    ctx.lang === 'th'
      ? 'จะเก็บยามาโนะคามิแลกหัวไชเท้า? อ่านผลต่ออาหารก่อน'
      : ctx.lang === 'ja'
        ? 'ヤマノカミを大根交換用に残す？ 食料への影響を先に確認'
        : 'Keeping Yamanokami for Daikon? Read the food-inventory effect first'
  const questLink = quest
    ? `<p><a href="${ctx.esc(ctx.detailItemLink(quest))}">${ctx.esc(questLabel)} ↗</a></p>`
    : ''
  const title =
    ctx.lang === 'th'
      ? 'เทียบข้องขนาดอื่น'
      : ctx.lang === 'ja'
        ? '他のびくと比較'
        : 'Compare keepnet sizes'
  return `<aside class="detail-section keepnet-alternatives" data-keepnet-choice><h3>${ctx.esc(title)}</h3>${items
    .filter((candidate) => candidate.keepnetCapacity && candidate.id !== item.id)
    .map(
      (candidate) =>
        `<p><a href="${ctx.esc(ctx.detailItemLink(candidate))}">${ctx.esc(ctx.imageName(candidate))} · ${candidate.keepnetCapacity} ${ctx.lang === 'th' ? 'ตัว' : ctx.lang === 'ja' ? '匹' : 'fish'} · ¥${candidate.priceYen} ↗</a></p>`,
    )
    .join('')}${questLink}</aside>`
}

function priceChoiceGroups(rows) {
  const groups = new Map()
  for (const [stage, refs] of rows) {
    const key = JSON.stringify(refs)
    if (!groups.has(key)) groups.set(key, { stages: [], refs })
    groups.get(key).stages.push(stage)
  }
  return [...groups.values()]
}

function priceChoiceTitle(ctx) {
  if (ctx.lang === 'th') return 'ถ้าซื้อใหม่: ตัวเลือกถูกกว่าแยกตามด่าน'
  if (ctx.lang === 'ja') return '新規購入：エリア別の安い候補'
  return 'Buying new: cheaper choices by area'
}

function priceChoiceGroup(ctx, group, items) {
  const area = ctx.copy.area(group.stages.join(' / '))
  const selectedStage = Number(ctx.selectedStage)
  const linkStage = group.stages.some((stage) => Number(stage) === selectedStage)
    ? selectedStage
    : Number(group.stages[0])
  const refs = group.refs.map((ref) => priceChoiceItem(ctx, ref, items, linkStage)).join(' / ')
  return `<p><strong>${ctx.esc(area)}</strong> · ${refs}</p>`
}

function priceChoiceItem(ctx, ref, items, stage) {
  const item = items.find(
    (candidate) => candidate.category === ref.category && candidate.id === ref.id,
  )
  if (!item) return ''
  const [page, query] = ctx.detailItemLink(item).split('?')
  const params = new URLSearchParams(query)
  params.set('stage', String(stage))
  return `<a href="${ctx.esc(`${page}?${params}`)}">${ctx.esc(ctx.imageName(item))} (${ctx.esc(item.id)}) · ¥${ctx.esc(ref.priceYen)} ↗</a>`
}

export function baitLurePriceChoices(ctx, item, items) {
  const rows = Object.entries(item.baitLureDecision?.cheaperByStage || {})
  if (!rows.length) return ''
  const groups = priceChoiceGroups(rows)
  return `<aside class="detail-section" data-bait-lure-prices><h3>${priceChoiceTitle(ctx)}</h3>${groups.map((group) => priceChoiceGroup(ctx, group, items)).join('')}</aside>`
}

function mushroomAlternativeLabel(ctx) {
  if (ctx.lang === 'th') return 'ดูส้ม: ฟื้น 5 HP ราคา ¥5 พร้อมร้านที่ขาย'
  if (ctx.lang === 'ja') return 'みかんを見る：5HP回復・5円、販売場所付き'
  return 'See oranges: restore 5 HP for ¥5, with shops'
}

export function mushroomAlternative(ctx, item) {
  if (item.category !== 'food' || !['09', '0A'].includes(item.id)) return ''
  const query = new URLSearchParams({ category: 'food', id: '01' })
  if (ctx.selectedStage) query.set('stage', String(ctx.selectedStage))
  query.set('return', ctx.currentLocalRoute())
  return `<p><a class="route-button" data-mushroom-alternative href="${ctx.localePage[ctx.lang]}?${query}">${ctx.esc(mushroomAlternativeLabel(ctx))} ↗</a></p>`
}

function acquisitionChoiceTitle(ctx, item) {
  if (item.playerUse?.shops?.length) {
    if (ctx.lang === 'th') return 'รับจากหีบก่อนซื้อซ้ำ'
    if (ctx.lang === 'ja') return '重複購入の前に宝箱から入手'
    return 'Check the chest before buying another copy'
  }
  if (ctx.lang === 'th') return 'รับไอเท็มนี้จากหีบ'
  if (ctx.lang === 'ja') return 'この道具を宝箱から入手'
  return 'Get this item from a chest'
}

function acquisitionChoiceEntry(ctx, loc) {
  const area = ctx.lang === 'th' ? 'ด่าน' : ctx.lang === 'ja' ? 'エリア' : 'Area'
  return `<p><strong>${area} ${ctx.esc(loc.stage)}</strong> · ${ctx.esc(ctx.local(loc.name))}</p><p>${ctx.esc(ctx.local(loc.action))}</p>`
}

export function acquisitionChoice(ctx, item) {
  const entries = item.acquisitionOptions || []
  if (!entries.length) return ''
  const open =
    ctx.lang === 'th'
      ? 'ดูจุดรับของและทางเข้าเมือง'
      : ctx.lang === 'ja'
        ? '入手地点と町の入口を見る'
        : 'See the reward location and town entrance'
  return `<aside class="detail-section acquisition-choice" data-acquisition-choice><h2>${ctx.esc(acquisitionChoiceTitle(ctx, item))}</h2>${entries.map((loc) => acquisitionChoiceEntry(ctx, loc)).join('')}<a class="route-button" href="#use-locations">${open} ↓</a></aside>`
}

export function moreOptionsPanel(ctx, options) {
  const content = options.filter(Boolean).join('')
  if (!content) return ''
  const title =
    ctx.lang === 'th'
      ? 'ตัวเลือกเพิ่มเติมและรายละเอียดเฉพาะทาง'
      : ctx.lang === 'ja'
        ? '追加の選択肢・個別情報'
        : 'More options and item-specific details'
  return `<details class="more-options"><summary>${ctx.esc(title)}</summary><div class="detail-content">${content}</div></details>`
}
