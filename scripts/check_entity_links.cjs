#!/usr/bin/env node
const { spawnSync } = require('node:child_process')
const { resolve } = require('node:path')

const script = resolve(__dirname, 'entity-link-check/run.mjs')
const result = spawnSync(process.execPath, [script], { stdio: 'inherit' })
if (result.error) throw result.error
process.exitCode = result.status ?? 1
