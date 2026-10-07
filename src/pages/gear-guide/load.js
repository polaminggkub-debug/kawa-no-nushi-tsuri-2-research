function getJson(url) {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${url}: ${response.status}`)
    return response.json()
  })
}

/** The measured gear effects and the localized item names built from the catalogue. */
export function loadData() {
  return Promise.all([getJson('../data/gear-effects.json'), getJson('gear-guide-names.json')]).then(
    ([effects, names]) => ({ effects, names }),
  )
}
