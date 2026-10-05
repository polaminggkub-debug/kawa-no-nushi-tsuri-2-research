import { navigationRoute } from './navigation-route.js'

const fishCompatibleCategoryOrder = { bait: 0, lure: 1, fly: 2, float_weight: 3 }

function readFilters() {
  const category = document.getElementById('category-filter').value
  if (['food', 'general_tool'].includes(category)) {
    document.getElementById('fish-filter').value = ''
    document.getElementById('fish-search').value = ''
  }
  return {
    term: document.getElementById('search').value.trim().toLocaleLowerCase(),
    fish: document.getElementById('fish-filter').value,
    category,
    order: document.getElementById('sort-filter').value,
    style: document.getElementById('style-filter').value,
  }
}

function updateCatalogueLink(ctx, category, fish) {
  const maps = ctx.lang === 'th' ? 'maps.th.html' : ctx.lang === 'ja' ? 'maps.ja.html' : 'maps.html'
  const query = new URLSearchParams({ return: ctx.sourceReturn(), route: navigationRoute(ctx) })
  if (fish) query.set('fish', fish)
  if (ctx.locationStage) query.set('stage', String(ctx.locationStage))
  query.set('map', String(ctx.locationMapIndex))
  document.getElementById('map-browser-link').href = `${maps}?${query}`
  const hasCanonicalCoverage = (ctx.decisions || []).some(
    (decision) => decision.id === 'lure_coverage_pair',
  )
  const coverageShownInCategory = ['all', 'lure'].includes(category) && hasCanonicalCoverage
  document.getElementById('generic-lure-kit').hidden = Boolean(fish || coverageShownInCategory)
}

function updateCatalogueUrl(ctx, category, fish, flyPart) {
  if (
    typeof history === 'undefined' ||
    typeof URLSearchParams === 'undefined' ||
    typeof location === 'undefined'
  )
    return
  const query = new URLSearchParams(location.search)
  query.set('category', category)
  if (fish) query.set('fish', fish)
  else query.delete('fish')
  if (category === 'flymaker') query.set('part', flyPart)
  else query.delete('part')
  const search = document.getElementById('search').value.trim()
  if (search) query.set('q', search)
  else query.delete('q')
  const style = document.getElementById('style-filter').value
  if (style) query.set('style', style)
  else query.delete('style')
  query.set('sort', document.getElementById('sort-filter').value || 'id')
  if (ctx.locationStage) query.set('stage', String(ctx.locationStage))
  else query.delete('stage')
  if (query.has('map') || ctx.locationMapIndex > 0) query.set('map', String(ctx.locationMapIndex))
  query.set('route', ctx.baitRoute)
  history.replaceState(null, '', `?${query.toString()}${location.hash || '#catalogue'}`)
}

function updatePageContext(ctx, filters) {
  ctx.renderTargetCategories(filters.fish)
  updateCatalogueUrl(ctx, filters.category, filters.fish, ctx.flyPart)
  updateCatalogueLink(ctx, filters.category, filters.fish)
  ctx.refreshLanguageLinks?.()
}

function routeLabels(ctx) {
  if (ctx.lang === 'th') return { float: 'ชุดทุ่น', sinker: 'ชุดตะกั่ว / หน้าดิน' }
  if (ctx.lang === 'ja') return { float: 'ウキ仕掛け', sinker: 'オモリ仕掛け' }
  return { float: 'Float rig', sinker: 'Sinker rig' }
}

function renderBaitRouteControl(ctx, category) {
  const options = Object.entries(routeLabels(ctx))
    .map(
      ([route, label]) =>
        `<button type="button" data-route="${route}" aria-pressed="${ctx.baitRoute === route}">${label}</button>`,
    )
    .join('')
  document.getElementById('bait-route-menu').innerHTML = ['bait', 'all'].includes(category)
    ? options
    : ''
}

function flyPartLabels(ctx) {
  if (ctx.lang === 'th') return { fly: 'บอดี้', fly_wing: 'ปีก', fly_tail: 'หาง' }
  if (ctx.lang === 'ja') return { fly: 'ボディ', fly_wing: 'ウイング', fly_tail: 'テール' }
  return { fly: 'Body', fly_wing: 'Wing', fly_tail: 'Tail' }
}

function renderFlyPartControl(ctx, category) {
  const choices = Object.entries(flyPartLabels(ctx))
    .map(
      ([part, label]) =>
        `<button type="button" data-part="${part}" aria-pressed="${ctx.flyPart === part}">${label}</button>`,
    )
    .join('')
  const guide = `<a href="#fly-instructions" data-guide>${ctx.lang === 'th' ? 'ดูขั้นตอนประกอบ' : ctx.lang === 'ja' ? '作成手順' : 'Assembly steps'} ↗</a>`
  document.getElementById('fly-part-menu').innerHTML =
    category === 'flymaker' ? choices + guide : ''
}

function renderCategoryControls(ctx, category) {
  const fishPickerHidden = ['food', 'general_tool'].includes(category)
  document.getElementById('fish-picker').hidden = fishPickerHidden
  if (fishPickerHidden) ctx.closeFishSuggestions?.()
  renderBaitRouteControl(ctx, category)
  document.getElementById('style-label').hidden = category !== 'rod'
  renderFlyPartControl(ctx, category)
}

function fishMatchesItem(ctx, item, filters) {
  if (!filters.fish) return true
  if (['rod', 'hook'].includes(filters.category)) return true
  if (
    ['bait', 'lure', 'fly', 'float_weight'].includes(item.category) &&
    ctx.fishIdsFor(item).includes(filters.fish)
  )
    return true
  return (
    filters.category === 'flymaker' &&
    ctx.flyPart !== 'fly' &&
    ctx.flyBundlePartFor(item, filters.fish)
  )
}

function matchesSearch(ctx, item, term) {
  if (!term) return true
  const values = [
    item.search,
    ctx.itemName(item),
    ctx.local(ctx.useOf(item).summary),
    ...ctx.fishIdsFor(item).map(ctx.fishName),
  ]
  return values.join(' ').toLocaleLowerCase().includes(term)
}

function matchesFilters(ctx, item, filters) {
  return (
    ctx.matchCategory(item, filters.category) &&
    (filters.category !== 'bait' ||
      ctx.baitRoute !== 'sinker' ||
      ctx.fishIdsFor(item).length > 0) &&
    (filters.category !== 'flymaker' || item.category === ctx.flyPart) &&
    (filters.category !== 'rod' ||
      !filters.style ||
      String(item.decodedFields.styleCode) === filters.style) &&
    fishMatchesItem(ctx, item, filters) &&
    matchesSearch(ctx, item, filters.term)
  )
}

function filterCatalogueItems(ctx, filters) {
  return ctx.allItems.filter((item) => matchesFilters(ctx, item, filters))
}

function sortCatalogueItems(ctx, items, filters) {
  const { order, category, fish } = filters
  if (order === 'name')
    return items.sort(
      (a, b) =>
        ctx.itemName(a).localeCompare(ctx.itemName(b), ctx.lang) || a.id.localeCompare(b.id),
    )
  if (order === 'price')
    return items.sort(
      (a, b) => (a.priceYen ?? Infinity) - (b.priceYen ?? Infinity) || a.id.localeCompare(b.id),
    )
  if (category === 'all' && fish)
    return items.sort(
      (a, b) =>
        (fishCompatibleCategoryOrder[a.category] ?? 4) -
          (fishCompatibleCategoryOrder[b.category] ?? 4) || a.id.localeCompare(b.id),
    )
  return items
}

function categoryTitle(ctx, category, fish) {
  if (!fish || category !== 'all') return ctx.player.cat[category] || ctx.player.all
  if (ctx.lang === 'th') return `รายการที่ผ่านเงื่อนไขของ${ctx.fishName(fish)}`
  if (ctx.lang === 'ja') return `${ctx.fishName(fish)}の条件に合うアイテム`
  return `Items compatible with ${ctx.fishName(fish)}`
}

function categoryDescription(ctx, category, fish) {
  if (!fish || category !== 'all') return ctx.player.desc[category] || ctx.player.lead
  if (ctx.lang === 'th')
    return 'แสดงเฉพาะรายการที่ผ่านเงื่อนไขจาก ROM ของปลานี้ โดยลำดับเริ่มต้นแบบ ID จะแสดงเหยื่อจริงก่อน ตามด้วยลัวร์/ฟลาย แล้วจึงทุ่นและตะกั่ว'
  if (ctx.lang === 'ja')
    return 'この魚のROM適合判定を通るアイテムのみ表示。初期設定のID順では、エサ、ルアー／フライ、ウキ・オモリの順に表示します。'
  return 'Only items that pass this fish’s ROM compatibility checks are shown. By default, the ID order shows bait first, then lures and flies, followed by floats and sinkers.'
}

function fishStatus(ctx, filters) {
  if (!filters.fish) return ''
  if (['rod', 'hook'].includes(filters.category)) {
    if (ctx.lang === 'th')
      return 'แสดงอุปกรณ์ทั้งหมวดสำหรับเลือกทั่วไป ไม่ได้จัดว่าเหมาะกับปลานี้หรือช่วยเพิ่มโอกาสตกได้'
    if (ctx.lang === 'ja')
      return '一般的な装備一覧です。この魚への適合や釣果向上を示すものではありません。'
    return 'Showing the full equipment category for general selection; this does not establish fish compatibility or a catch advantage.'
  }
  if (filters.category === 'bait') return ctx.player.fishOnly
  if (filters.category === 'flymaker' && ctx.flyPart !== 'fly') {
    if (ctx.lang === 'th')
      return 'แสดงชิ้นส่วนที่ร้านขายพร้อมบอดี้ซึ่งผ่านเงื่อนไขปลานี้ ไม่ได้ยืนยันว่าปีกหรือหางเพิ่มโอกาสกิน'
    if (ctx.lang === 'ja')
      return 'この魚の条件を通るボディと一緒に販売される部品です。ウイング・テールの食いつき向上は未確認。'
    return 'Showing parts sold with a body that passes this fish’s compatibility check; a wing or tail bite bonus is not established.'
  }
  if (filters.category === 'flymaker' && ctx.flyPart === 'fly') {
    if (ctx.lang === 'th')
      return 'แสดงบอดี้ฟลายที่ผ่านเงื่อนไขโปรไฟล์ของปลานี้ ไม่ได้รับประกันว่าปลากินหรือตกขึ้นได้'
    if (ctx.lang === 'ja')
      return 'この魚のボディプロフィール判定を通るフライボディです。食いつき・釣り上げは保証されません。'
    return 'Showing fly bodies whose body-profile check passes for this fish; a bite or catch is not guaranteed.'
  }
  if (ctx.lang === 'th')
    return 'แสดงรายการในหมวดนี้ที่ผ่านเงื่อนไขจาก ROM ของปลาที่เลือก แต่ไม่ได้ยืนยันว่าปลากินหรือตกขึ้นได้'
  if (ctx.lang === 'ja')
    return '選択した魚のROM条件を通るカテゴリー内アイテムです。食いつき・釣り上げは保証されません。'
  return 'Showing items in this category that pass the selected fish’s ROM compatibility check; a bite or catch is not guaranteed.'
}

function updateCatalogueHeadings(ctx, filters) {
  ctx.set('#category-title', categoryTitle(ctx, filters.category, filters.fish))
  ctx.set('#category-description', categoryDescription(ctx, filters.category, filters.fish))
  ctx.set(
    '#fish-status',
    filters.fish ? `${ctx.fishName(filters.fish)} — ${fishStatus(ctx, filters)}` : '',
  )
}

function emptyCatalogueMessage(ctx, fish) {
  if (!fish) return ctx.copy.empty
  if (ctx.lang === 'th')
    return 'ไม่มีรายการที่ยืนยันว่าใช้กับปลานี้ได้ในหมวดและคำค้นที่เลือก ลองหมวดอื่น หรือกด × เพื่อล้างปลาเป้าหมาย'
  if (ctx.lang === 'ja')
    return '選択した種類・検索条件では、この魚に対応する確認済みアイテムがありません。別の種類、または×で魚の指定を解除。'
  return 'No verified compatible item matches this category and search. Try another category, or clear the target with ×.'
}

function emptyBaitRouteCandidates(ctx, filters) {
  if (
    filters.category !== 'bait' ||
    !filters.term ||
    (filters.fish && !ctx.fishVisuals[filters.fish]) ||
    ctx.baitRoute !== 'sinker'
  )
    return []
  return ctx.allItems.filter((item) => {
    const routes = item.category === 'bait' ? item.playerUse?.fishIdsByRoute : null
    if (!Array.isArray(routes?.sinker) || routes.sinker.length) return false
    if (!Array.isArray(routes.float) || !routes.float.length) return false
    if (filters.fish && !routes.float.includes(filters.fish)) return false
    return matchesSearch(ctx, item, filters.term)
  })
}

function emptyBaitRouteHref(ctx, filters) {
  const query = new URLSearchParams(location.search)
  const search = document.getElementById('search').value.trim()
  query.set('category', 'bait')
  query.set('route', 'float')
  if (search) query.set('q', search)
  else query.delete('q')
  if (filters.fish) query.set('fish', filters.fish)
  else query.delete('fish')
  if (ctx.locationStage) query.set('stage', String(ctx.locationStage))
  return `${location.pathname.split('/').pop()}?${query}#catalogue`
}

function emptyBaitRouteRecovery(ctx, filters) {
  const candidates = emptyBaitRouteCandidates(ctx, filters)
  if (!candidates.length) return ''
  const copy = {
    th: {
      text: (count, fish) =>
        fish
          ? `คำค้นตรงกับเหยื่อ ${count} รายการ แต่ข้อมูลที่ตรวจไม่มีรายการสายตะกั่วสำหรับปลาที่เลือก ${ctx.fishName(fish)}; ปลานี้อยู่ในรายชื่อสายทุ่นของรายการที่ตรงคำค้น`
          : `คำค้นตรงกับเหยื่อ ${count} รายการ แต่ยังไม่มีปลาในรายการสายตะกั่วที่บันทึกไว้ จึงไม่แสดงเป็นตัวเลือกสำหรับชุดนี้`,
      action: 'สลับไปดูชุดทุ่นที่ใช้ได้กับคำค้นนี้',
    },
    ja: {
      text: (count, fish) =>
        fish
          ? `検索結果のエサ${count}件には、選択した${ctx.fishName(fish)}のオモリ仕掛け判定が記録されていません。この魚は検索結果のウキ仕掛けリストにあります。`
          : `検索に一致するエサは${count}件ですが、オモリ仕掛けで通る魚は記録されていないため、この仕掛けの候補には表示しません。`,
      action: 'ウキ仕掛けでこの検索結果を見る',
    },
    en: {
      text: (count, fish) =>
        fish
          ? `${count} bait item(s) match this search, but no Sinker match is recorded for selected ${ctx.fishName(fish)}. This fish is listed for the Float rig among the search matches.`
          : `${count} bait item(s) match this search, but no fish is recorded for the Sinker rig, so they are not shown as choices for this setup.`,
      action: 'Switch to Float rig for this search',
    },
  }[ctx.lang] || {
    text: (count) => `${count} bait item(s) match, but no fish is recorded for the Sinker rig.`,
    action: 'Switch to Float rig',
  }
  const fish = filters.fish || ''
  return `<section class="empty-state" data-empty-bait-route="sinker"><p>${ctx.esc(copy.text(candidates.length, fish))}</p><a class="route-button" data-empty-bait-switch="float" href="${ctx.esc(emptyBaitRouteHref(ctx, filters))}">${ctx.esc(copy.action)} ↗</a></section>`
}

function renderItemResults(ctx, items, filters) {
  const box = document.getElementById('cards')
  if (!items.length) {
    box.innerHTML =
      emptyBaitRouteRecovery(ctx, filters) ||
      `<p class="empty-state">${ctx.esc(emptyCatalogueMessage(ctx, filters.fish))}</p>`
    return
  }
  box.innerHTML = items.map(ctx.renderItemCard).join('')
}

function renderResults(ctx, items, filters) {
  ctx.set('#result-count', ctx.copy.results(items.length))
  updateCatalogueHeadings(ctx, filters)
  document
    .querySelectorAll('[data-category]')
    .forEach((node) =>
      node.setAttribute(
        'aria-current',
        node.dataset.category === filters.category ? 'true' : 'false',
      ),
    )
  ctx.renderFishLocation(filters.fish)
  ctx.renderComparison(filters.category)
  ctx.renderDecisions(filters.category)
  renderItemResults(ctx, items, filters)
}

export function renderCards(ctx) {
  const filters = readFilters()
  updatePageContext(ctx, filters)
  renderCategoryControls(ctx, filters.category)
  const items = sortCatalogueItems(ctx, filterCatalogueItems(ctx, filters), filters)
  renderResults(ctx, items, filters)
  updatePageContext(ctx, filters)
}
