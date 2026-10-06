import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { goatCounterScript } from './analytics.mjs'
import { versionAssetReferences } from './asset-versions.mjs'
import { existsSync, readFileSync } from 'node:fs'
import { isAbsolute, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { renderFrontendOutputs, scripts, styles } from '../build_frontend.mjs'
import {
  buildNames,
  currentInputs,
  listJobs,
  readStored,
  verifyCombo,
} from '../build_fight_policies.mjs'

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)))

function safeOutputPath(file) {
  if (isAbsolute(file)) return false
  const target = resolve(root, file)
  return target.startsWith(root + sep)
}

function requiredOutputs() {
  return [...Object.values(scripts), ...Object.values(styles)]
}

function verifyOutputs(outputs) {
  const errors = []
  for (const file of requiredOutputs()) {
    if (!outputs.has(file)) errors.push(`Build API omitted required artifact: ${file}`)
  }
  for (const [file, generated] of outputs) {
    if (!safeOutputPath(file)) {
      errors.push(`Unsafe generated path: ${file}`)
      continue
    }
    const target = resolve(root, file)
    if (!existsSync(target)) {
      errors.push(`Missing generated artifact: ${file}`)
      continue
    }
    const current = readFileSync(target, 'utf8')
    if (current !== generated) errors.push(`Generated artifact is stale: ${file}`)
    if (file.endsWith('.html') && current.split(goatCounterScript()).length !== 2)
      errors.push(`Visitor-statistics script must appear exactly once: ${file}`)
  }
  errors.push(...verifyAssetVersions(outputs))
  return errors
}

function verifyAssetVersions(outputs) {
  const errors = []
  for (const [file, html] of outputs) {
    if (!file.endsWith('.html')) continue
    const base = new URL(file, 'https://generated.invalid/')
    for (const match of html.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)) {
      const url = new URL(match[1], base)
      const asset = url.pathname.slice(1)
      if (url.origin !== base.origin || !/\.(js|css)$/.test(asset) || !outputs.has(asset)) continue
      const hash = createHash('sha256').update(outputs.get(asset)).digest('hex').slice(0, 16)
      if (url.searchParams.get('v') !== hash)
        errors.push(`Stale asset version: ${file} -> ${asset}`)
    }
  }
  return errors
}

function verifyVersionMutation() {
  const assets = new Map([
    ['catalogue/maps.js', 'before'],
    ['catalogue/maps.css', 'stable'],
  ])
  const html =
    '<script src="maps.js?lang=th&v=old#keep"></script><link href="maps.css"><img src="photo.png"><script src="https://example.com/external.js?v=old"></script>'
  const before = versionAssetReferences(html, 'catalogue/maps.th.html', assets)
  assets.set('catalogue/maps.js', 'after')
  const after = versionAssetReferences(html, 'catalogue/maps.th.html', assets)
  assert.notEqual(before.match(/maps.js[^"']+/)[0], after.match(/maps.js[^"']+/)[0])
  assert.equal(before.match(/maps.css[^"']+/)[0], after.match(/maps.css[^"']+/)[0])
  assert.ok(after.includes('lang=th&v='))
  assert.ok(after.includes('#keep'))
  assert.ok(after.includes('src="photo.png"'))
  assert.ok(after.includes('https://example.com/external.js?v=old'))
}

const readJson = (file) => JSON.parse(readFileSync(resolve(root, file), 'utf8'))

// data/fight-policies.json takes minutes to rebuild, so it is kept in sync by fingerprint: the ROM
// tables, the engine and the finder source must hash to what was stored, the localized names must
// match the catalogue, and a few stored combinations are recomputed exactly.
function verifyFightPolicies() {
  const regenerate = 'run node scripts/build_fight_policies.mjs'
  const stored = readStored()
  const errors = []
  const inputs = currentInputs()
  for (const key of Object.keys(inputs))
    if (stored.inputs[key] !== inputs[key])
      errors.push(`data/fight-policies.json is stale (${key} changed): ${regenerate}`)
  const tables = readJson('data/fight-tables.json')
  const names = buildNames(tables, readJson('catalogue/gallery-data.json'))
  if (JSON.stringify(names) !== JSON.stringify(stored.names))
    errors.push(`data/fight-policies.json names are stale: ${regenerate} --names`)
  const jobs = listJobs(tables)
  const missing = jobs.filter((job) => !stored.combos[job.key])
  if (missing.length || Object.keys(stored.combos).length !== jobs.length)
    errors.push(`data/fight-policies.json does not cover every fish and method: ${regenerate}`)
  const probes = [jobs[0], ...jobs.filter((job) => [3, 59].includes(job.fishId))]
  if (!errors.length)
    for (const job of probes) errors.push(...verifyCombo(tables, job.key, stored.combos[job.key]))
  return errors
}

export async function checkGeneratedOutputs() {
  verifyVersionMutation()
  const outputs = await renderFrontendOutputs()
  return { outputs: outputs.size, errors: [...verifyOutputs(outputs), ...verifyFightPolicies()] }
}

async function main() {
  if (process.argv.length !== 2)
    throw new Error('Usage: node scripts/code-quality/check_generated.mjs')
  const result = await checkGeneratedOutputs()
  if (result.errors.length) {
    console.error(`Generated artifact check FAIL: ${result.errors.length} differences`)
    result.errors.forEach((error) => console.error(error))
    process.exitCode = 1
    return
  }
  console.log(`Generated artifact check PASS: ${result.outputs} artifacts match source exactly`)
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url)
  await main()
