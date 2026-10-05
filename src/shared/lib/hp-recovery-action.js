const labels = {
  th: 'เลือกอาหารฟื้น HP และดูแหล่งซื้อ',
  ja: 'HP回復用の食料と販売場所を選ぶ',
  en: 'Choose recovery food and see where to buy it',
}

export function hpRecoveryAction(options) {
  const { locale, cataloguePath, stage, returnPath, source, escapeHtml } = options
  const query = new URLSearchParams({ category: 'food', return: returnPath })
  if (/^[1-6]$/.test(String(stage))) query.set('stage', String(stage))
  const href = `${cataloguePath}?${query}#category-decisions`
  return `<a class="route-button" data-hp-food-action data-hp-source="${escapeHtml(source)}" href="${escapeHtml(href)}">${escapeHtml(labels[locale] || labels.en)} ↗</a>`
}
