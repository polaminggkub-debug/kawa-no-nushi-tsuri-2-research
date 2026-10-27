let pending

function getJson(url) {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${url}: ${response.status}`)
    return response.json()
  })
}

/** The best kit per fish and method, and the localized item names. Fetched once per page. */
export function loadBestGear() {
  pending ||= Promise.all([getJson('gear-best.json'), getJson('gear-guide-names.json')]).then(
    ([best, names]) => {
      if (!best?.fish || !names?.fish) throw new Error('best-gear data has an unexpected shape')
      return { best, names }
    },
  )
  pending.catch(() => (pending = undefined))
  return pending
}
