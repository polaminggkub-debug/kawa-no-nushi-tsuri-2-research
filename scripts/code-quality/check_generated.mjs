import { existsSync, readFileSync } from 'node:fs'
import { isAbsolute, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { renderFrontendOutputs, scripts, styles } from '../build_frontend.mjs'

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
  }
  return errors
}

export async function checkGeneratedOutputs() {
  const outputs = await renderFrontendOutputs()
  return { outputs: outputs.size, errors: verifyOutputs(outputs) }
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
