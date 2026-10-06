// On phones the search/sort disclosure starts collapsed so results show first.
// It stays open when the URL already carries a search, non-default sort or style.
const phoneWidth = '(max-width: 640px)'

function urlNeedsRefine(query) {
  const sort = query.get('sort')
  return Boolean(query.get('q') || query.get('style') || (sort && sort !== 'id'))
}

export function collapseRefineOnPhone() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return
  const refine = document.querySelector('.catalogue-refine')
  if (!refine || !window.matchMedia?.(phoneWidth).matches) return
  if (urlNeedsRefine(new URLSearchParams(window.location.search))) return
  refine.open = false
}
