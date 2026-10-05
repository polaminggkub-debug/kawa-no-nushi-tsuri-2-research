function local(ctx, values) {
  return values[ctx.lang] || values.en
}

export function showCatalogueLoading(ctx) {
  document.getElementById('category-menu').hidden = true
  document.getElementById('catalogue-load-feedback').hidden = true
  const message = local(ctx, {
    th: 'กำลังโหลดรายการและคำแนะนำตามตัวเลือกของคุณ…',
    ja: '選択条件に合うアイテムと案内を読み込み中…',
    en: 'Loading items and advice for your selection…',
  })
  for (const id of ['category-description', 'category-decisions', 'rod-comparison'])
    document.getElementById(id).innerHTML = ''
  document.getElementById('category-title').textContent = local(ctx, {
    th: 'รายการตามตัวเลือกของคุณ',
    ja: '選択条件の一覧',
    en: 'Your selected items',
  })
  document.getElementById('cards').innerHTML = `<p role="status">${ctx.esc(message)}</p>`
  document.getElementById('result-count').textContent = ''
}

export function showCatalogueError(ctx) {
  document.getElementById('category-menu').hidden = true
  const message = local(ctx, {
    th: 'โหลดรายการไม่สำเร็จ ยังแสดงคำแนะนำตามปลาหรือตัวเลือกของคุณไม่ได้ ลองโหลดหน้าใหม่ หรือเลือกหน้าอื่นจากเมนูด้านบน',
    ja: '一覧を読み込めず、選択した魚・条件の案内を表示できません。再読み込みするか、上のメニューから別のページを選んでください。',
    en: 'The catalogue could not load, so advice for your fish or filters is unavailable. Reload this page, or choose another page from the navigation above.',
  })
  const retry = local(ctx, { th: 'โหลดหน้าใหม่', ja: '再読み込み', en: 'Reload page' })
  const feedback = document.getElementById('catalogue-load-feedback')
  feedback.hidden = false
  feedback.innerHTML = `<div role="alert" class="empty-state"><p>${ctx.esc(message)}</p><button type="button" class="route-button" id="catalogue-retry">${ctx.esc(retry)} ↻</button></div>`
  document.getElementById('cards').innerHTML = ''
  document.getElementById('catalogue-retry')?.addEventListener('click', () => location.reload())
  document.getElementById('result-count').textContent = ''
}
