import { setFightTables } from '../entities/fight/index.js'
import { analyseSetup, packAnalysis } from '../features/fight-policy/index.js'

// Works out the auto-finder for one tackle setup off the main thread (the same code the build uses).
self.onmessage = (event) => {
  const { tables, setup } = event.data
  setFightTables(tables)
  const fish = tables.fish.find((row) => row.id === setup.fishId)
  const rod = tables.rod.find((row) => row.id === setup.rodId)
  self.postMessage(packAnalysis(analyseSetup(tables, setup, fish, rod)))
}
