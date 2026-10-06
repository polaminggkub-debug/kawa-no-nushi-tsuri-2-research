import { setFightTables } from '../../entities/fight/index.js'

function getJson(url) {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${url}: ${response.status}`)
    return response.json()
  })
}

/** The ROM fight tables (for the engine) and the precomputed finder results. */
export function loadData() {
  return Promise.all([
    getJson('../data/fight-tables.json'),
    getJson('../data/fight-policies.json'),
  ]).then(([tables, policies]) => {
    setFightTables(tables)
    return { tables, policies }
  })
}
