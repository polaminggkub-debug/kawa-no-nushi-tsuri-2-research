#!/usr/bin/env node
import('./entity-link-check/maps-combobox.mjs').catch((error) => {
  console.error(error)
  process.exitCode = 1
})
