import { build } from 'esbuild'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'

const root = fileURLToPath(new URL('../', import.meta.url))
export const scripts = {
  equipment: 'catalogue/gallery.js',
  item: 'catalogue/item-detail.js',
  fish: 'catalogue/fish-detail.js',
  maps: 'catalogue/maps.js',
  shops: 'catalogue/shops.js',
  strategy: 'research/search.js',
  navigation: 'catalogue/compendium.js',
}
export const styles = {
  equipment: 'catalogue/style.css',
  detail: 'catalogue/detail.css',
  maps: 'catalogue/maps.css',
  shops: 'catalogue/shops.css',
  compendium: 'catalogue/compendium.css',
  strategy: 'research/strategy.css',
}

async function compile(entry, extension) {
  const result = await build({
    absWorkingDir: root,
    entryPoints: [`src/app/${entry}.${extension}`],
    bundle: true,
    write: false,
    format: 'iife',
    target: 'es2022',
    legalComments: 'none',
    charset: 'utf8',
    logLevel: 'silent',
  })
  return result.outputFiles[0].text
}

function templateFiles(slice) {
  const directory = resolve(root, 'src/pages', slice, 'ui')
  return readdirSync(directory)
    .filter((file) => file.endsWith('.html'))
    .map((file) => ({ file, source: readFileSync(resolve(directory, file), 'utf8') }))
}

function strategyTables(file, source) {
  const tables = JSON.parse(
    readFileSync(
      resolve(root, 'src/pages/strategy/ui', file.replace('.html', '.tables.json')),
      'utf8',
    ),
  )
  return source.replace(/<!-- table:([^ ]+) -->/g, (_match, key) => tables[key].join('\n'))
}

async function renderEquipment(source, locale, script) {
  const nodes = {}
  const node = (id) =>
    (nodes[id] ||= {
      innerHTML: '',
      textContent: '',
      value: id === 'sort-filter' ? 'id' : '',
      addEventListener() {},
      setAttribute() {},
      removeAttribute() {},
    })
  const document = {
    documentElement: { dataset: { locale } },
    getElementById: node,
    querySelector: (selector) => (selector.startsWith('#') ? node(selector.slice(1)) : null),
    querySelectorAll: () => [],
    addEventListener() {},
  }
  const data = JSON.parse(readFileSync(resolve(root, 'catalogue/gallery-data.json'), 'utf8'))
  const context = {
    document,
    console,
    URL,
    URLSearchParams,
    fetch: async () => ({ ok: true, json: async () => data }),
  }
  vm.runInNewContext(
    script.replace(/\}\)\(\);\s*$/, 'globalThis.renderCopy = runtimeContext;\n})();'),
    context,
  )
  await new Promise((done) => setImmediate(done))
  return populateTemplate(source, nodes, context.renderCopy)
}

function populateTemplate(source, nodes, runtime) {
  let html = source.replace(
    /(<([a-z0-9]+)[^>]*data-t="([^"]+)"[^>]*>)[^<]*(<\/\2>)/g,
    (whole, open, _tag, key, close) => {
      const alias = {
        'th-item': 'item',
        'th-rom': 'rom',
        'th-price': 'price',
        'search-label': 'search',
        'category-label': 'category',
        'sort-label': 'sort',
        'readme-link': 'readme',
      }
      const camel = alias[key] || key.replace(/-([a-z])/g, (_, char) => char.toUpperCase())
      const value =
        (['title', 'lead'].includes(camel) ? runtime.player?.[camel] : undefined) ??
        runtime.copy[key] ??
        runtime.copy[camel]
      return typeof value === 'string' ? open + value + close : whole
    },
  )
  for (const [id, element] of Object.entries(nodes)) {
    const value = element.innerHTML || element.textContent
    if (!value) continue
    const start = `<!-- prerender:${id} -->`,
      end = `<!-- /prerender:${id} -->`
    html = html.replace(new RegExp(start + '[\\s\\S]*?' + end), () => start + value + end)
  }
  return html
}

export async function renderFrontendOutputs() {
  const outputs = new Map()
  for (const [entry, output] of Object.entries(scripts))
    outputs.set(output, await compile(entry, 'js'))
  for (const [entry, output] of Object.entries(styles))
    outputs.set(output, await compile(entry, 'css'))
  for (const slice of ['equipment', 'item', 'fish', 'maps', 'shops', 'strategy']) {
    for (const { file, source } of templateFiles(slice)) {
      const locale = file.includes('.th.') ? 'th' : file.includes('.ja.') ? 'ja' : 'en'
      const html =
        slice === 'equipment'
          ? await renderEquipment(source, locale, outputs.get(scripts.equipment))
          : slice === 'strategy'
            ? strategyTables(file, source)
            : source
      outputs.set(`${slice === 'strategy' ? 'research' : 'catalogue'}/${file}`, html)
    }
  }
  return outputs
}

async function main() {
  if (process.argv.length !== 2) throw new Error('Usage: node scripts/build_frontend.mjs')
  const outputs = await renderFrontendOutputs()
  for (const [file, contents] of outputs) writeFileSync(resolve(root, file), contents)
  console.log(`Built ${outputs.size} frontend artifacts from authored source.`)
}

if (process.argv[1] && relative(root, resolve(process.argv[1])) === 'scripts/build_frontend.mjs') {
  main().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
