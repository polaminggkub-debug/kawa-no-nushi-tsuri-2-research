import { persistSearchQuery, refreshFishReturns, restoreSearchQuery } from './search-return.js'

export function setupSearch(ctx) {
  ctx.filter = document.getElementById('filter')
  restoreSearchQuery(ctx.filter)
  ctx.resultCount = document.getElementById('filter-count')
  ctx.rows = Array.from(document.querySelectorAll('#fish-matrix tbody tr'))
  ctx.copy = {
    en: {
      count: (shown, total) => `Showing ${shown} of ${total} fish profiles.`,
      aliasFailure:
        'Lookup aliases could not be loaded. Search by the Japanese ROM name or profile ID instead.',
    },
    ja: {
      count: (shown, total) => `魚プロフィール ${shown} / ${total} 件を表示。`,
      aliasFailure:
        '検索用のローマ字・タイ語名を読み込めませんでした。ROMの日本語名またはプロフィールIDで検索できます。',
    },
    th: {
      count: (shown, total) => `แสดง ${shown} จาก ${total} โปรไฟล์ปลา`,
      aliasFailure: 'โหลดคำช่วยค้นหาไม่สำเร็จ ยังค้นด้วยชื่อญี่ปุ่นจาก ROM หรือ ID โปรไฟล์ได้',
    },
  }[document.documentElement.lang] || {
    count: (shown, total) => `${shown} / ${total}`,
    aliasFailure:
      'Lookup aliases could not be loaded. Search by the Japanese ROM name or profile ID instead.',
  }
  ctx.aliasWarning = document.getElementById('alias-warning')
  ctx.normalize = (value) => value.normalize('NFKC').trim().toLocaleLowerCase()
  ctx.aliases = new Map()
  ctx.applyFilter = () => {
    const query = ctx.normalize(ctx.filter.value)
    let shown = 0
    for (const row of ctx.rows) {
      const id = row.querySelector('a[href*="id="]')?.href.match(/[?&]id=([^&]+)/)?.[1] || ''
      const searchable = ctx.normalize(`${row.textContent} ${ctx.aliases.get(id) || ''}`)
      const matches = !query || searchable.includes(query)
      row.hidden = !matches
      if (matches) shown++
    }
    ctx.resultCount.textContent = ctx.copy.count(shown, ctx.rows.length)
    persistSearchQuery(ctx.filter.value)
    refreshFishReturns(ctx.rows, ctx.filter.value)
  }
  ctx.filter.addEventListener('input', ctx.applyFilter)
}
