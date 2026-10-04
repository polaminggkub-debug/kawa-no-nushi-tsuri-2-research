import { cpSync, existsSync, mkdtempSync, appendFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)))
const publicDirectories = ['catalogue', 'research', 'data', 'docs', 'examples', 'scripts', 'src']
const publicFiles = [
  'index.html',
  'robots.txt',
  'sitemap.xml',
  'LICENSE',
  'NOTICE.md',
  'README.md',
  'README.ja.md',
  'SOURCES.md',
  'package.json',
  'package-lock.json',
]

export function stageSite() {
  const output = mkdtempSync(join(tmpdir(), 'kawa-public-site-'))
  for (const name of [...publicDirectories, ...publicFiles]) {
    const source = resolve(root, name)
    if (existsSync(source)) cpSync(source, join(output, name), { recursive: true })
  }
  return output
}

function main() {
  if (process.argv.length !== 2) throw new Error('Usage: node scripts/code-quality/stage-site.mjs')
  const output = stageSite()
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `path=${output}\n`)
  console.log(`Staged public site: ${output}`)
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) main()
