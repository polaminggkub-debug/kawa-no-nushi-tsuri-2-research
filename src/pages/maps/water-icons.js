const copy = {
  th: {
    title: 'สัญลักษณ์บนผิวน้ำในเกม',
    imageNote: 'ภาพขยายจากกราฟิกต้นฉบับในเกม; ในเกมมีหลายทิศและหลายเฟรม',
    small: 'ปลาเล็ก: ต่ำกว่า 50 ซม.',
    large: 'ปลาใหญ่: ตั้งแต่ 50 ซม.',
    bubble: 'ฟอง: ปลาบางชนิดใช้ทุกขนาด',
    filterTitle: 'กรองปลาตามสัญลักษณ์ที่อาจเห็น',
    idle: 'เลือกสัญลักษณ์เพื่อดูชนิดปลาที่มีโอกาสแสดงภาพแบบนั้นในด่านนี้',
    count: (n, area, mark) =>
      `ด่าน ${area}: มีปลา ${n} ชนิดที่ข้อมูล ROM ระบุว่าอาจใช้สัญลักษณ์ “${mark}”`,
    none: (area) =>
      `ไม่พบชนิดปลาที่ใช้สัญลักษณ์นี้ในข้อมูลของด่าน ${area} ลองเลือกด่านอื่นหรือล้างตัวกรอง`,
    resultLimit: 'รายการนี้แสดงความเป็นไปได้จากข้อมูล ROM ไม่ใช่โอกาสหรือเปอร์เซ็นต์ที่จะเจอปลา',
    sameRule: 'กติกาสัญลักษณ์เหมือนกันทุกด่าน แต่แต่ละด่านมีชนิดปลาไม่เหมือนกัน',
    effect:
      'ยังไม่พบหลักฐานว่าสัญลักษณ์เองเพิ่มโอกาสกินเหยื่อหรือตกได้ ขนาดจริงของปลาใช้ในการคำนวณการสู้ปลาบางจุด',
    conflict: (name, mark) =>
      `ปลาที่เลือก “${name}” ไม่มีสัญลักษณ์ “${mark}” ในข้อมูล ROM จึงไม่มีหมุดตรงกับตัวกรองนี้`,
    clearTarget: 'ดูปลาที่เข้ากับสัญลักษณ์นี้',
    listLink: 'ไปยังรายชื่อปลาที่เข้ากัน',
    clearFilter: 'ล้างตัวกรองสัญลักษณ์',
    evidence: 'อ่านความหมายของสัญลักษณ์',
    detail: 'ดูสัญลักษณ์ที่ปลานี้อาจแสดง',
    note: 'ปลาเล็ก/ใหญ่คำนวณจากขนาดตอนสร้างไอคอน ซึ่งอาจไม่อัปเดตทันทีเมื่อปลาโต ปลาบางชนิดใช้ภาพฟองทุกขนาด สัญลักษณ์อย่างเดียวระบุชนิดปลาไม่ได้ หมุดบนเว็บเป็นรูปชนิดปลา ไม่ใช่สัญลักษณ์ในเกม',
    listHeading: 'ปลาที่อาจแสดงสัญลักษณ์นี้ในด่านนี้',
    listSearchHeading: 'ค้นหาในปลาที่อาจแสดงสัญลักษณ์นี้',
    listEmpty: 'ไม่มีปลาที่เข้ากับสัญลักษณ์นี้ในขอบเขตรายการที่เลือก',
    listSearchEmpty: 'ไม่พบคำค้นในรายชื่อปลาที่อาจแสดงสัญลักษณ์นี้',
    sectionEmpty: 'ส่วนแผนที่นี้ไม่มีจุดที่ตรงกับตัวกรอง ลองเลือกส่วนอื่น',
  },
  en: {
    title: 'Water marks in the game',
    imageNote: 'Original game pixels enlarged; directions and animation frames vary in play.',
    small: 'Small fish: under 50 cm',
    large: 'Large fish: 50 cm or more',
    bubble: 'Bubbles: some fish, at any size',
    filterTitle: 'Filter fish by a possible water mark',
    idle: 'Choose a mark to see which species can show it in this area.',
    count: (n, area, mark) =>
      `Area ${area}: ROM data lists ${n} species that may use the “${mark}” mark.`,
    none: (area) =>
      `No species with this mark are listed for Area ${area}. Try another area or clear the filter.`,
    resultLimit:
      'This is a ROM-based possibility list, not a chance or percentage of finding a fish.',
    sameRule: 'The same mark rule applies in every area, but the fish available differ by area.',
    effect:
      'No evidence shows that the mark itself improves bites or catches. Actual fish size is used in some fight calculations.',
    conflict: (name, mark) =>
      `The selected fish, “${name},” cannot have the “${mark}” mark in the ROM data, so no pins match both filters.`,
    clearTarget: 'Show fish that can have this mark',
    listLink: 'Jump to compatible fish',
    clearFilter: 'Clear mark filter',
    evidence: 'How to read these marks',
    detail: 'See this fish’s possible marks',
    note: 'Small/large is based on size when the icon is created and may not update immediately as a fish grows. Some fish show bubbles at any size. A mark alone cannot identify the species. Website pins are species portraits, not in-game marks.',
    listHeading: 'Fish that may show this mark in this area',
    listSearchHeading: 'Search among fish that may show this mark',
    listEmpty: 'No fish match this mark in the selected list scope.',
    listSearchEmpty: 'No search matches among fish that may show this mark.',
    sectionEmpty: 'No matching points in this map section. Try another section.',
  },
  ja: {
    title: 'ゲーム内の水面マーク',
    imageNote: '原作の画像を拡大しています。ゲーム中は方向やアニメーションで形が変わります。',
    small: '小魚影：50cm未満',
    large: '大魚影：50cm以上',
    bubble: '泡：一部の魚、サイズ不問',
    filterTitle: '水面マークから魚種を絞り込む',
    idle: 'マークを選ぶと、このエリアで表示される可能性がある魚種を確認できます。',
    count: (n, area, mark) =>
      `エリア${area}：ROM上で「${mark}」を使う可能性がある魚種は${n}種です。`,
    none: (area) =>
      `エリア${area}にはこのマークに該当する魚種がありません。別のエリアを選ぶか、絞り込みを解除してください。`,
    resultLimit: 'ROMから確認できる可能性の一覧で、遭遇確率や割合ではありません。',
    sameRule: 'マークの判定規則は全エリア共通ですが、エリアごとに魚種が異なります。',
    effect:
      'マーク自体が食いつきや釣果を高める証拠はありません。実際の魚のサイズは一部のファイト計算に使われます。',
    conflict: (name, mark) =>
      `選択中の「${name}」はROMデータ上「${mark}」にならないため、両方に一致する地点はありません。`,
    clearTarget: 'このマークに該当する魚を見る',
    listLink: '該当する魚の一覧へ',
    clearFilter: 'マーク絞り込みを解除',
    evidence: 'マークの見方',
    detail: 'この魚に表示されるマーク',
    note: '小魚影・大魚影はアイコン生成時のサイズで決まり、成長後すぐ更新されない場合があります。一部の魚はサイズに関係なく泡のマークを使います。マークだけでは魚種を特定できません。地図のピンは魚種画像で、ゲーム内マークではありません。',
    listHeading: 'このエリアで表示される可能性がある魚',
    listSearchHeading: 'このマークに該当する魚を検索',
    listEmpty: '選択中の一覧範囲に、このマークに該当する魚はいません。',
    listSearchEmpty: 'このマークに該当する魚の中に一致する検索結果はありません。',
    sectionEmpty: 'この範囲に該当する地点はありません。別の範囲を選んでください。',
  },
}

export function renderWaterKey(ctx) {
  const node = ctx.$('water-icon-key'),
    data = ctx.waterIcons
  if (!node || !data?.classes) return
  const labels = copy[ctx.lang],
    profile = data.profiles?.[ctx.selectedFish],
    classes = ['small', 'large', 'bubble']
  const buttons = classes
    .filter((key) => data.classes[key]?.image)
    .map((key) => markButton(ctx, labels, data, key, profile))
    .join('')
  node.innerHTML = `${renderHeader(labels)}<div class="water-mark-buttons" role="group" aria-label="${ctx.esc(labels.filterTitle)}">${buttons}</div>${renderMarkResults(ctx, labels)}<div class="water-mark-notes"><p>${ctx.esc(labels.sameRule)}</p><p>${ctx.esc(labels.effect)}</p><details class="water-mark-evidence"><summary>${ctx.esc(labels.evidence)}</summary><p class="water-icon-image-note">${ctx.esc(labels.imageNote)}</p><p>${ctx.esc(labels.note)}</p></details></div>${renderFishDetailLink(ctx, labels)}`
  node.hidden = !buttons
}

function renderHeader(labels) {
  return `<h4>${labels.title}</h4><p class="water-mark-heading">${labels.filterTitle}</p>`
}

function markButton(ctx, labels, data, key, profile) {
  const active = ctx.activeWaterMark === key,
    possible = profile?.possibleClasses?.includes(key),
    image = `${data.classes[key].image}?v=native-20261005`
  return `<button type="button" id="water-mark-${key}" class="water-mark-button${active ? ' is-active' : ''}" data-water-mark="${key}" aria-pressed="${active}" aria-controls="fish-list map-view" aria-label="${ctx.esc(labels[key])}"><img src="${ctx.esc(image)}" alt=""><span>${ctx.esc(labels[key])}${possible ? `<small>${ctx.lang === 'th' ? 'เป็นไปได้กับปลาที่เลือก' : ctx.lang === 'ja' ? '選択中の魚に該当' : 'Possible for selected fish'}</small>` : ''}</span></button>`
}

function renderMarkResults(ctx, labels) {
  const mark = ctx.activeWaterMark
  if (!mark)
    return `<div class="water-mark-results" id="water-mark-results"><p>${ctx.esc(labels.idle)}</p></div>`
  const ids = ctx.waterMarkFishIds(ctx.activeStage, mark),
    label = labels[mark],
    count = ids.length,
    status = count ? labels.count(count, ctx.activeStage, label) : labels.none(ctx.activeStage),
    conflict = ctx.selectedFish && !ctx.fishMatchesWaterMark(ctx.selectedFish, mark)
  return `<div class="water-mark-results" id="water-mark-results"><p class="water-mark-count" aria-live="polite">${ctx.esc(status)}</p><p>${ctx.esc(labels.resultLimit)}</p>${conflict ? `<p class="water-mark-conflict" data-water-mark-conflict role="status">${ctx.esc(labels.conflict(ctx.fishName(ctx.selectedFish), label))}</p>` : ''}<div class="water-mark-actions"><a href="#fish-list">${ctx.esc(labels.listLink)} ↘</a>${ctx.selectedFish ? `<button type="button" data-action="show-mark-candidates">${ctx.esc(labels.clearTarget)}</button>` : ''}<button type="button" data-action="clear-water-mark">${ctx.esc(labels.clearFilter)}</button></div></div>`
}

export function waterMarkAreaText(ctx, stage) {
  if (!ctx.activeWaterMark) return ''
  const count = ctx.waterMarkFishIds(stage).length,
    mark = copy[ctx.lang][ctx.activeWaterMark]
  if (ctx.lang === 'th') return `${count} ชนิดอาจแสดง · ${mark}`
  if (ctx.lang === 'ja') return `${count}種が表示される可能性 · ${mark}`
  return `${count} possible · ${mark}`
}

export function waterMarkFishHeading(ctx, hasSearch) {
  const labels = copy[ctx.lang]
  return hasSearch ? labels.listSearchHeading : labels.listHeading
}

export function waterMarkEmptyText(ctx, hasSearch) {
  if (!ctx.activeWaterMark) return ctx.c.noFish
  const labels = copy[ctx.lang]
  return hasSearch ? labels.listSearchEmpty : labels.listEmpty
}

export function waterMarkPinHelp(ctx, hasPoints) {
  const labels = copy[ctx.lang]
  if (!ctx.activeWaterMark) return ''
  const mark = labels[ctx.activeWaterMark]
  if (ctx.selectedFish && !ctx.fishMatchesWaterMark(ctx.selectedFish))
    return labels.conflict(ctx.fishName(ctx.selectedFish), mark)
  if (!hasPoints && !ctx.waterMarkFishIds(ctx.activeStage).length)
    return labels.none(ctx.activeStage)
  if (!hasPoints) return labels.sectionEmpty
  if (ctx.lang === 'th')
    return `กรองจุดตามปลาที่อาจแสดง “${mark}” สัญลักษณ์ไม่ได้ระบุชนิดปลาที่กำลังอยู่ตรงนั้น`
  if (ctx.lang === 'ja')
    return `「${mark}」を表示する可能性がある魚の地点に絞り込みました。マークだけでは今いる魚種は分かりません。`
  return `Filtered to points for fish that may show “${mark}”. The mark does not identify which fish is there now.`
}

function renderFishDetailLink(ctx, labels) {
  return ctx.selectedFish
    ? `<a class="water-mark-fish-detail" href="${ctx.esc(ctx.fishHref(ctx.selectedFish))}#water-icons">${ctx.esc(labels.detail)} ↗</a>`
    : ''
}
