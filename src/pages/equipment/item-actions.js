export function baitLurePriceChoices(ctx, item) {
  const rows = Object.entries(item.baitLureDecision?.cheaperByStage || {})
  if (!rows.length) return ''
  const groups = new Map()
  for (const [stage, refs] of rows) {
    const key = JSON.stringify(refs)
    if (!groups.has(key)) groups.set(key, { stages: [], refs })
    groups.get(key).stages.push(stage)
  }
  const title =
    ctx.lang === 'th'
      ? 'ถ้าซื้อใหม่: ตัวเลือกถูกกว่าแยกตามด่าน'
      : ctx.lang === 'ja'
        ? '新規購入：エリア別の安い候補'
        : 'Buying new: cheaper choices by area'
  const area = ctx.lang === 'th' ? 'ด่าน' : ctx.lang === 'ja' ? 'エリア' : 'Area'
  return `<aside class="detail-section" data-bait-lure-prices><h4>${title}</h4>${[
    ...groups.values(),
  ]
    .map(
      (group) =>
        `<p><strong>${area} ${group.stages.join(' / ')}</strong> · ${group.refs
          .map((ref) => {
            const other = ctx.allItems.find((i) => i.category === ref.category && i.id === ref.id)
            return other
              ? `<a href="${ctx.esc(ctx.itemHref(other))}">${ctx.esc(ctx.itemName(other))} (${ctx.esc(other.id)}) · ¥${ctx.esc(ref.priceYen)} ↗</a>`
              : ''
          })
          .join(' / ')}</p>`,
    )
    .join('')}</aside>`
}

export function areaItemLink(ctx, item, stage, hash = '', pointReturn = '') {
  const [page, query] = ctx.itemHref(item).split('?')
  const params = new URLSearchParams(query)
  params.set('stage', String(stage))
  params.set('route', ctx.baitRoute)
  if (pointReturn) params.set('return', pointReturn)
  return page + '?' + params + hash
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
  return `<aside class="detail-section compass-exit-choice" data-compass-exit-choice><h3>${label}</h3><p>${ctx.lang === 'th' ? 'เลือกด่าน แล้วดูรูปแม่เหล็กที่ชี้จุดทางเชื่อม เข็มจะหยุดเมื่อถึงช่องเป้าหมาย แต่คำบอกทิศไม่ใช่เส้นทางหลบสิ่งกีดขวาง' : ctx.lang === 'ja' ? 'エリアを選び、磁石画像が示す連絡路の地点を確認します。目標タイルで針が止まりますが、方角表示は障害物を避ける経路案内ではありません。' : 'Choose an area and find the connecting-route point marked by the magnet portrait. The needle stops at its target tile; the heading does not supply a route around obstacles.'}</p>${locations.map((loc) => `<p><a data-compass-location href="${ctx.esc(ctx.areaItemLink(item, loc.stage, '#compass-exit-' + loc.stage))}">${ctx.lang === 'th' ? 'ด่าน' : ctx.lang === 'ja' ? 'エリア' : 'Area'} ${loc.stage} · ${ctx.lang === 'th' ? 'ดูจุดที่เข็มหยุด' : ctx.lang === 'ja' ? '針が止まる地点を見る' : 'See where the needle stops'} ↗</a></p>`).join('')}</aside>`
}

export function gatheredBaitChoices(ctx, item) {
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
      const bait = ctx.allItems.find((i) => i.category === 'bait' && i.id === id)
      return `<p>${ctx.lang === 'th' ? 'ด่าน' : ctx.lang === 'ja' ? 'エリア' : 'Area'} ${stage} · <a data-gathered-bait href="${ctx.esc(ctx.areaItemLink(bait, stage))}">${ctx.esc(ctx.itemName(bait))} (${id}) ↗</a></p>`
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
  return `<aside class="detail-section bait-gather-choice" data-bait-gather-choice><p>${ctx.esc(note)}</p><a href="${ctx.esc(
    ctx.areaItemLink(
      ctx.allItems.find((i) => i.category === 'general_tool' && i.id === '04'),
      item.netGatherArea,
      item.netGatherArea === 1 ? '#use-locations' : '',
    ),
  )}">${label} ↗</a></aside>`
}

export function forageBaitChoice(ctx, item, items) {
  if (item.category !== 'bait') return ''
  const fish = document.getElementById('fish-filter').value,
    routeIds = item.playerUse?.fishIdsByRoute?.[ctx.baitRoute]
  if (fish && routeIds && !routeIds.includes(fish)) return ''
  const glass = items.find((i) => i.category === 'general_tool' && i.id === '03')
  const points = (glass?.playerUse?.useLocations || []).filter(
    (loc) =>
      loc.forage &&
      (loc.markerItems || []).some((ref) => ref.category === 'bait' && ref.id === item.id),
  )
  const stages = [...new Set(points.map((loc) => Number(loc.stage)))]
  if (!stages.length) return ''
  const shown =
    ctx.locationStage && stages.includes(Number(ctx.locationStage))
      ? [Number(ctx.locationStage)]
      : stages
  const note =
    ctx.lang === 'th'
      ? 'ถ้ามีแว่นขยายอยู่แล้ว ลองหาเหยื่อนี้แทนการซื้อเพิ่ม: ไปถึงช่องตัวอย่างแล้วใช้แว่นขยาย ขยับช่องก่อนค้นซ้ำ บางช่องมีผลลัพธ์ได้สองชนิด จึงไม่รับประกันว่าจะได้ชนิดนี้ทุกครั้ง'
      : ctx.lang === 'ja'
        ? '虫メガネを持っているなら、追加購入の代わりに探索できます。地点例で使い、再探索前に移動してください。2種類の候補がある地点では毎回このエサが出るとは限りません。'
        : 'If you already own the magnifying glass, try gathering instead of buying more: use it at an example tile and move before searching again. Some tiles have two possible results, so this bait is not guaranteed every time.'
  return `<aside class="forage-bait-choice" data-forage-bait-choice><p>${ctx.esc(note)}</p>${shown
    .map((stage) => {
      const loc = points.find((point) => Number(point.stage) === stage)
      return `<p><a data-forage-bait href="${ctx.esc(ctx.areaItemLink(glass, stage, '#forage-stage-' + stage + '-context-' + Number(loc.context)))}">${ctx.lang === 'th' ? 'ด่าน' : ctx.lang === 'ja' ? 'エリア' : 'Area'} ${stage} · ${ctx.lang === 'th' ? 'ดูภาพจุดตัวอย่างหาเหยื่อนี้' : ctx.lang === 'ja' ? 'このエサの探索地点例を見る' : 'See an example search tile for this bait'} ↗</a></p>`
    })
    .join('')}</aside>`
}

export function daikonFishChoice(ctx, item) {
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
  const href = `${ctx.detailFile('fish')}?id=${item.exchangeFishId}&stage=${item.tubExchange ? 2 : 3}&return=${encodeURIComponent(ctx.sourceReturn())}`
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
    ? `<p><a href="${ctx.esc(ctx.itemHref(quest))}">${ctx.esc(questLabel)} ↗</a></p>`
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
        `<p><a href="${ctx.esc(ctx.itemHref(candidate))}">${ctx.esc(ctx.itemName(candidate))} · ${candidate.keepnetCapacity} ${ctx.lang === 'th' ? 'ตัว' : ctx.lang === 'ja' ? '匹' : 'fish'} · ¥${candidate.priceYen} ↗</a></p>`,
    )
    .join('')}${questLink}</aside>`
}

export function mushroomAlternative(ctx, item) {
  if (!(
    (item.category === 'food' && ['09', '0A'].includes(item.id)) ||
    (item.category === 'general_tool' && item.id === '03')
  ))
    return ''
  return `<p><a class="route-button" data-mushroom-alternative href="${ctx.esc(ctx.itemHref(ctx.allItems.find((i) => i.category === 'food' && i.id === '01')))}">${ctx.lang === 'th' ? 'ดูส้ม: ฟื้น 5 HP ราคา ¥5 พร้อมร้านที่ขาย' : ctx.lang === 'ja' ? 'みかんを見る：5HP回復・5円、販売場所付き' : 'See oranges: restore 5 HP for ¥5, with shops'} ↗</a></p>`
}

export function acquisitionChoice(ctx, item) {
  const entries = item.acquisitionOptions || []
  if (!entries.length) return ''
  const title = item.playerUse?.shops?.length
    ? ctx.lang === 'th'
      ? 'รับจากหีบก่อนซื้อซ้ำ'
      : ctx.lang === 'ja'
        ? '重複購入の前に宝箱から入手'
        : 'Check the chest before buying another copy'
    : ctx.lang === 'th'
      ? 'รับไอเท็มนี้จากหีบ'
      : ctx.lang === 'ja'
        ? 'この道具を宝箱から入手'
        : 'Get this item from a chest'
  const open =
    ctx.lang === 'th'
      ? 'ดูจุดรับของและทางเข้าเมือง'
      : ctx.lang === 'ja'
        ? '入手地点と町の入口を見る'
        : 'See the reward location and town entrance'
  return `<aside class="shop-locations acquisition-choice" data-acquisition-choice><h4>${title}</h4>${entries.map((loc) => `<p><strong>${ctx.lang === 'th' ? 'ด่าน' : ctx.lang === 'ja' ? 'エリア' : 'Area'} ${loc.stage}</strong> · ${ctx.esc(ctx.local(loc.name))}</p><p>${ctx.esc(ctx.local(loc.action))}</p>`).join('')}<a href="${ctx.esc(ctx.itemHref(item))}#use-locations">${open} ↗</a></aside>`
}

export function flyBundlePartFor(ctx, item, fish) {
  const part = item.category === 'fly_wing' ? 'wing' : 'tail'
  return ctx.allItems.some(
    (body) =>
      body.category === 'fly' &&
      (ctx.useOf(body).fishIds || []).includes(fish) &&
      (ctx.useOf(body).shops || []).some((shop) => shop.bundle?.[part] === item.id),
  )
}

export function gearNextActions(ctx, item) {
  if (!item.gearDecision) return ''
  if (item.category === 'float_weight')
    return `<p><a class="route-button" data-float-price-guide href="index${ctx.lang === 'en' ? '' : '.' + ctx.lang}.html?category=float_weight#category-decisions">${ctx.lang === 'th' ? 'ดูทุ่นและตะกั่วราคาต่ำสุดแยกทั้งหกด่าน' : ctx.lang === 'ja' ? '6エリアの最安ウキ・オモリを見る' : 'See the cheapest float and sinker in each of six areas'} ↗</a></p>`
  const ids = (item.gearDecision.targetFish || []).filter((id) => ctx.fishVisuals[id])
  const hookBudget =
    item.category === 'hook'
      ? `<p><a class="route-button" data-hook-price-guide href="index${ctx.lang === 'en' ? '' : '.' + ctx.lang}.html?category=hook#category-decisions">${ctx.lang === 'th' ? 'เบ็ดหายหรือยังไม่มี? ดูเบ็ดทั่วไปที่ถูกสุดทั้งหกด่าน' : ctx.lang === 'ja' ? '針を失った・持っていない？6エリアの最安汎用針を見る' : 'Lost your hook or have none? See the cheapest generic hook in each area'} ↗</a></p>`
      : ''
  if (item.category === 'hook' && !ids.length) return hookBudget
  if (item.category === 'hook' && ids.length)
    return (
      hookBudget +
      `<p>${ctx.lang === 'th' ? 'ดูเหยื่อและจุดตกของปลาที่ชื่อเบ็ดอ้างถึง' : ctx.lang === 'ja' ? 'ハリ名の魚のエサ・場所を見る' : 'Bait and locations for the fish named by this hook'}: ${ids.map((id) => `<a href="${ctx.esc(ctx.fishHref(id))}">${ctx.esc(ctx.fishName(id))} ↗</a>`).join(' · ')}</p>`
    )
  if (item.category.startsWith('fly')) {
    const id = document.getElementById('fish-filter').value
    if (
      id &&
      !ctx.allItems.some(
        (candidate) => candidate.category === 'fly' && ctx.useOf(candidate).fishIds?.includes(id),
      )
    )
      return `<p><a data-fly-next href="${ctx.esc(ctx.fishHref(id))}">${ctx.lang === 'th' ? 'ปลานี้ไม่ผ่านเงื่อนไขฟลาย: ดูเหยื่อและวิธีอื่น' : ctx.lang === 'ja' ? 'この魚はフライ判定に不適合：他の釣法を見る' : 'This fish fails the fly profile check: see other methods'} ↗</a></p>`
    if (!id && item.category === 'fly')
      return `<p>${ctx.lang === 'th' ? 'เลือกปลาในรายชื่อด้านล่าง แล้วดูจุดตกและชุดฟลายในหน้าปลา' : ctx.lang === 'ja' ? '下の魚一覧から選び、魚ページで場所と毛バリ候補を見る。' : 'Choose a fish below, then see locations and flies on its profile.'}</p>`
    return `<p><a data-fly-next href="${ctx.esc(id ? ctx.fishHref(id) + '#fly-backup' : ctx.detailFile('item') + '?category=fly&id=01&return=' + encodeURIComponent(ctx.sourceReturn()))}">${ctx.lang === 'th' ? (id ? 'ดูชุดฟลายเริ่มต้นและชุดสำรองของปลานี้' : 'เลือกปลาจากบอดี้ แล้วดูชุดฟลายในหน้าปลา') : ctx.lang === 'ja' ? (id ? 'この魚の最初の毛バリ・予備を見る' : 'ボディで魚を選び、魚ページで毛バリを見る') : id ? 'See starter and backup flies for this fish' : 'Choose a fish from a body, then see flies on its profile'} ↗</a></p>`
  }
  return ''
}
