function readFilters() {
  return {
    term: document.getElementById('search').value.trim().toLocaleLowerCase(),
    fish: document.getElementById('fish-filter').value,
    category: document.getElementById('category-filter').value,
    order: document.getElementById('sort-filter').value,
    style: document.getElementById('style-filter').value,
  }
}

function updateCatalogueLink(ctx, fish) {
  const maps = ctx.lang === 'th' ? 'maps.th.html' : ctx.lang === 'ja' ? 'maps.ja.html' : 'maps.html'
  document.getElementById('map-browser-link').href = `${maps}${fish ? '?fish=' + fish : ''}`
  document.getElementById('generic-lure-kit').hidden = !!fish
}

function updateCatalogueUrl(category, fish, flyPart) {
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
  history.replaceState(null, '', `?${query.toString()}${location.hash || '#catalogue'}`)
}

function updatePageContext(ctx, filters) {
  ctx.renderTargetCategories(filters.fish)
  updateCatalogueLink(ctx, filters.fish)
  updateCatalogueUrl(filters.category, filters.fish, ctx.flyPart)
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
  renderBaitRouteControl(ctx, category)
  document.getElementById('style-label').hidden = category !== 'rod'
  renderFlyPartControl(ctx, category)
}

function fishMatchesItem(ctx, item, filters) {
  if (!filters.fish) return true
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

function sortCatalogueItems(ctx, items, order) {
  if (order === 'name')
    return items.sort(
      (a, b) =>
        ctx.itemName(a).localeCompare(ctx.itemName(b), ctx.lang) || a.id.localeCompare(b.id),
    )
  if (order === 'price')
    return items.sort(
      (a, b) => (a.priceYen ?? Infinity) - (b.priceYen ?? Infinity) || a.id.localeCompare(b.id),
    )
  return items
}

function categoryTitle(ctx, category, fish) {
  if (!fish || category !== 'all') return ctx.player.cat[category] || ctx.player.all
  if (ctx.lang === 'th') return `เหยื่อและชุดตกสำหรับ${ctx.fishName(fish)}`
  if (ctx.lang === 'ja') return `${ctx.fishName(fish)}に対応するエサ・仕掛け`
  return `Baits and rigs for ${ctx.fishName(fish)}`
}

function categoryDescription(ctx, category, fish) {
  if (!fish || category !== 'all') return ctx.player.desc[category] || ctx.player.lead
  if (ctx.lang === 'th') return 'แสดงเฉพาะรายการที่ผ่านเงื่อนไขปลานี้จาก ROM'
  if (ctx.lang === 'ja') return 'この魚のROM適合判定を通るアイテムのみ表示。'
  return 'Only items that pass this fish’s ROM compatibility checks are shown.'
}

function fishStatus(ctx, filters) {
  if (!filters.fish) return ''
  if (filters.category !== 'flymaker' || ctx.flyPart === 'fly') return ctx.player.fishOnly
  if (ctx.lang === 'th')
    return 'ชิ้นส่วนในชุดที่ร้านขายพร้อมบอดี้ซึ่งผ่านเงื่อนไขปลานี้ ไม่ได้ยืนยันว่าปีกหรือหางเพิ่มโอกาสกิน'
  if (ctx.lang === 'ja')
    return '対応ボディと一緒に販売される構成部品。ウイング・テールの食いつき向上は未確認。'
  return 'Parts sold with a body that passes this fish’s compatibility check; a wing or tail bite bonus is not established.'
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

function renderItemResults(ctx, items, fish) {
  const box = document.getElementById('cards')
  if (!items.length) {
    box.innerHTML = `<p class="empty-state">${ctx.esc(emptyCatalogueMessage(ctx, fish))}</p>`
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
  renderItemResults(ctx, items, filters.fish)
}

export function renderCards(ctx) {
  const filters = readFilters()
  updatePageContext(ctx, filters)
  renderCategoryControls(ctx, filters.category)
  const items = sortCatalogueItems(ctx, filterCatalogueItems(ctx, filters), filters.order)
  renderResults(ctx, items, filters)
}
