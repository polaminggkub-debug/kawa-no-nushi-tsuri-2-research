import { SIM_METHODS } from './assemble.mjs'
import { neededReach } from './curves.mjs'
import { START_OF, analyse } from './enumerate.mjs'

// The simulated part of data/gear-effects.json: which fights to play, and how the results are
// stored in and read back from the document.

/** The simulation jobs: for each fish and float/casting kit pool, the start values and rods to play. */
export function listJobs(catalog) {
  const jobs = []
  for (const fish of catalog.fishList)
    for (const method of SIM_METHODS) {
      const result = analyse(catalog, fish, method)
      if (!result) continue
      const middle = (fish.sizeLow + fish.sizeHigh) >> 1
      const band = middle <= 15 ? 0 : middle <= 35 ? 1 : 2
      const byReach = new Map(catalog.rodsOf(method).map((rod) => [rod.reach, rod.id]))
      jobs.push({
        key: `${fish.id}|${method}`,
        fishId: fish.id,
        method,
        starts: result.values.map((m) => START_OF[m]),
        ref: START_OF[result.max[band]],
        rodIds: [...byReach.values()],
      })
    }
  return jobs
}

/** What the kit picks need from a simulation: the rod reach the fish needs and its catch curve. */
export const simsOf = (results) =>
  Object.fromEntries(
    results.map((entry) => [entry.key, { need: neededReach(entry.reach), curve: entry.curve }]),
  )

export function attachSimulation(doc, results) {
  for (const sim of results) {
    const [id, method] = sim.key.split('|')
    doc.fish[id].methods[method].sim = { rod: sim.rod, curve: sim.curve, reach: sim.reach }
  }
}

/** The simulation results stored in a document, in the shape `simulateJob` returns. */
export function storedResults(doc) {
  const results = []
  for (const [id, fish] of Object.entries(doc.fish))
    for (const [method, record] of Object.entries(fish.methods))
      if (record.sim) results.push({ key: `${id}|${method}`, ...record.sim })
  return results
}
