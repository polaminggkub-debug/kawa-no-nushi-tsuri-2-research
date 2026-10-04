import { readFileSync, readdirSync } from 'node:fs'
import { extname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)))
const forbidden = new Set(['.sfc', '.smc', '.rom', '.ips', '.bps', '.state', '.srm', '.bin'])
const textTypes = new Set([
  '.html',
  '.js',
  '.mjs',
  '.cjs',
  '.ts',
  '.css',
  '.json',
  '.md',
  '.xml',
  '.yml',
  '.yaml',
  '.txt',
])
const secretPatterns = [
  /-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9_]{30,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{30,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bsk-[A-Za-z0-9]{32,}\b/,
]

function filesUnder(directory, output = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === '.venv') continue
    const file = join(directory, entry.name)
    if (entry.isDirectory()) filesUnder(file, output)
    else output.push(file)
  }
  return output
}

function wildcardExists(pattern, files) {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replaceAll('*', '[^/]*')
  const matcher = new RegExp(`^${escaped}$`)
  return files.some((file) => matcher.test(file))
}

function gatherSources(value, output = []) {
  if (!value || typeof value !== 'object') return output
  if (Array.isArray(value)) {
    for (const item of value) gatherSources(item, output)
    return output
  }
  for (const [key, item] of Object.entries(value)) {
    if (key === 'sources' && Array.isArray(item)) output.push(...item.filter(isFileReference))
    gatherSources(item, output)
  }
  return output
}

function isFileReference(source) {
  return (
    typeof source === 'string' &&
    (source.includes('/') || /\.(?:json|md|py|png|html|cjs|js|txt)$/i.test(source))
  )
}

function checkFiles(files) {
  const violations = []
  for (const file of files) {
    const relativePath = relative(root, file).split(/[\\/]/).join('/')
    if (forbidden.has(extname(file).toLowerCase()))
      violations.push(`${relativePath}: prohibited ROM, patch, or runtime state artifact`)
    if (!textTypes.has(extname(file).toLowerCase())) continue
    const source = readFileSync(file, 'utf8')
    for (const pattern of secretPatterns)
      if (pattern.test(source))
        violations.push(`${relativePath}: possible credential or private key`)
  }
  return violations
}

function checkEvidence(files) {
  const violations = [],
    relativeFiles = files.map((file) => relative(root, file).split(/[\\/]/).join('/'))
  const evidenceFiles = files.filter(
    (file) => /\.(?:json)$/.test(file) && /(?:^|\/)(?:data|catalogue)\//.test(file),
  )
  for (const file of evidenceFiles) {
    let data
    try {
      data = JSON.parse(readFileSync(file, 'utf8'))
    } catch {
      continue
    }
    for (const rawSource of gatherSources(data)) {
      const source = rawSource.split(/\s+\(/, 1)[0].replace(/^\.\//, '')
      if (/^https?:\/\//i.test(source)) continue
      if (source.startsWith('/') || source.includes('..')) {
        violations.push(`${relative(root, file)}: unsafe evidence path ${source}`)
      } else if (
        source.includes('*')
          ? !wildcardExists(source, relativeFiles)
          : !relativeFiles.includes(source)
      ) {
        violations.push(`${relative(root, file)}: missing evidence source ${source}`)
      }
    }
  }
  return violations
}

export function checkPublication() {
  const files = filesUnder(root)
  return [...checkFiles(files), ...checkEvidence(files)]
}

function main() {
  if (process.argv.length !== 2) {
    console.error('Usage: node scripts/code-quality/check-publication.mjs')
    process.exit(2)
  }
  const violations = checkPublication()
  if (violations.length) {
    console.error(`Publication safety FAIL: ${violations.length} issue(s)`)
    for (const item of violations) console.error(item)
    process.exitCode = 1
  } else
    console.log(
      `Publication safety PASS: ${filesUnder(root).length} files checked for private artifacts, credentials, and missing ROM evidence`,
    )
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) main()
