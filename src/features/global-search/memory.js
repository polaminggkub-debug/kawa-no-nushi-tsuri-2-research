const key = 'kawa-search'

/** The query and the type filter survive page changes and the back button in this tab. */
export function loadSearch() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(key) || '{}')
    return {
      query: typeof saved.query === 'string' ? saved.query : '',
      type: ['fish', 'item'].includes(saved.type) ? saved.type : 'all',
    }
  } catch {
    return { query: '', type: 'all' }
  }
}

export function saveSearch(state) {
  try {
    sessionStorage.setItem(key, JSON.stringify(state))
  } catch {
    // Private mode: the search still works, it just forgets.
  }
}
