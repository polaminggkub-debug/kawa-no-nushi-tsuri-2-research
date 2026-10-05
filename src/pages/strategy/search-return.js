export function restoreSearchQuery(filter) {
  if (typeof location === 'undefined') return
  filter.value = new URLSearchParams(location.search).get('q') || ''
}

export function persistSearchQuery(query) {
  if (typeof location === 'undefined' || typeof history === 'undefined') return
  const target = new URL(location.href)
  target.searchParams.delete('q')
  if (query) {
    target.searchParams.set('q', query)
    target.hash = 'technical-evidence'
  }
  if (target.href !== location.href) history.replaceState(null, '', target.href)
}

export function refreshFishReturns(rows, query) {
  if (typeof location === 'undefined') return
  const returned = new URL(location.href)
  returned.searchParams.delete('q')
  if (query) returned.searchParams.set('q', query)
  returned.hash = 'technical-evidence'
  const file = returned.pathname.split('/').pop()
  const route = `../research/${file}${returned.search}${returned.hash}`
  for (const row of rows) {
    const link = row.querySelector('a[href*="id="]')
    if (!link) continue
    const target = new URL(link.href, location.href)
    target.searchParams.set('return', route)
    link.href = target.href
  }
}

export function preserveResearchLanguageState(event) {
  const link = event.target.closest?.('a[href]')
  if (!link) return
  const query = document.getElementById('filter')?.value || ''
  const target = new URL(link.href, location.href)
  target.searchParams.delete('q')
  if (query) target.searchParams.set('q', query)
  target.hash = location.hash || (query ? '#technical-evidence' : '')
  link.href = target.href
}
