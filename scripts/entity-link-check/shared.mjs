import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

export const root = path.resolve(fileURLToPath(new URL('../..', import.meta.url)))
export const data = JSON.parse(
  fs.readFileSync(path.join(root, 'catalogue/gallery-data.json'), 'utf8'),
)
export const locations = JSON.parse(
  fs.readFileSync(path.join(root, 'catalogue/fish-locations.json'), 'utf8'),
)
export const itemKeys = new Set(data.items.map((item) => `${item.category}:${item.id}`))
export const fishIds = new Set(Object.keys(data.fishVisuals))
export const stats = { links: 0, renders: 0 }

export function unescapeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function sourceBundle(kind) {
  const file = path.join(root, `catalogue/${kind}.js`)
  const source = fs.readFileSync(file, 'utf8')
  const contextName = source.match(/\b(?:const|let|var)\s+([\w$]+)\s*=\s*createPageRuntime\(/)?.[1]
  assert(contextName, `Missing page runtime in ${file}`)
  assert(/\}\)\(\);\s*$/.test(source), `Expected an IIFE frontend bundle: ${file}`)
  return source.replace(/\}\)\(\);\s*$/, `globalThis.__testRuntimeContext=${contextName};\n})();`)
}

export function validate(html, base, allowInvalidIdentity = false) {
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = new URL(unescapeHtml(match[1]), base)
    if (url.origin !== base.origin) {
      const projectBlob = '/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/'
      if (url.hostname === 'github.com' && url.pathname.startsWith(projectBlob)) {
        const file = path.join(root, decodeURIComponent(url.pathname.slice(projectBlob.length)))
        assert(fs.existsSync(file), `Missing evidence file ${url}`)
      }
      continue
    }
    const pathname = url.pathname.replace(/^\/kawa-no-nushi-tsuri-2-research\//, '/')
    const file = path.join(root, pathname.replace(/^\//, ''))
    assert(fs.existsSync(file), `Missing local route/asset ${url}`)
    if (
      !allowInvalidIdentity &&
      /\/item(?:\.th|\.ja)?\.html$/.test(pathname) &&
      url.searchParams.has('id')
    ) {
      assert(
        itemKeys.has(`${url.searchParams.get('category')}:${url.searchParams.get('id')}`),
        `Unknown item ${url}`,
      )
    }
    if (
      !allowInvalidIdentity &&
      /\/fish(?:\.th|\.ja)?\.html$/.test(pathname) &&
      url.searchParams.has('id')
    ) {
      assert(fishIds.has(url.searchParams.get('id')), `Unknown fish ${url}`)
    }
    stats.links += 1
  }
}

function makeNode(id) {
  const attributes = {}
  return {
    id,
    innerHTML: '',
    textContent: '',
    href: '',
    value: '',
    dataset: {},
    hidden: false,
    open: false,
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    listeners: {},
    addEventListener(name, callback) {
      this.listeners[name] = callback
    },
    removeEventListener() {},
    appendChild() {},
    replaceChildren() {},
    insertAdjacentHTML() {},
    focus() {},
    click() {},
    scrollIntoView() {
      this.scrolled = true
    },
    setAttribute(key, value) {
      attributes[key] = value
    },
    removeAttribute(key) {
      delete attributes[key]
    },
    getAttribute(key) {
      return attributes[key] ?? (key === 'href' ? this.href : null)
    },
    querySelector() {
      return null
    },
    querySelectorAll() {
      return []
    },
  }
}

function createDocument(lang, initialValues = {}) {
  const nodes = {}
  const node = (id) =>
    (nodes[id] ||= Object.assign(makeNode(id), { value: initialValues[id] || '' }))
  for (const id of Object.keys(initialValues)) node(id)
  const languages = ['en', 'th', 'ja'].map((code) => {
    const target = node(`language-${code}`)
    target.getAttribute = (key) =>
      key === 'hreflang'
        ? code
        : key === 'href'
          ? `index${code === 'en' ? '' : `.${code}`}.html`
          : null
    return target
  })
  const document = {
    documentElement: { dataset: { locale: lang } },
    title: '',
    querySelector(selector) {
      return selector.startsWith('#') ? node(selector.slice(1)) : null
    },
    querySelectorAll(selector) {
      return selector.includes('hreflang') || selector.includes('.language-links') ? languages : []
    },
    getElementById: node,
    createElement: (tag) => Object.assign(makeNode(tag), { tagName: tag.toUpperCase() }),
    addEventListener() {},
  }
  return { document, nodes, node, languages }
}

function vmContext(document, location, loading, captureHistory = false) {
  const history = {
    replaceState(_state, _title, href) {
      if (captureHistory) location.href = new URL(href, location).href
    },
  }
  const context = {
    document,
    location,
    window: { location, addEventListener() {}, history },
    ...(captureHistory ? { history } : {}),
    URL,
    URLSearchParams,
    console,
    setTimeout,
    clearTimeout,
    queueMicrotask,
    fetch:
      loading === 'failure'
        ? async () => ({ ok: false })
        : loading === 'malformed'
          ? async () => ({ ok: true, json: async () => ({ items: null }) })
          : loading
            ? () => new Promise(() => {})
            : async (file) => ({
                ok: true,
                json: async () => (file.includes('fish-locations') ? locations : data),
              }),
  }
  return context
}

export async function render(
  kind,
  lang,
  query,
  prefix = '/kawa-no-nushi-tsuri-2-research',
  loading = false,
  afterStart,
) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const url = new URL(`https://example.test${prefix}/catalogue/${kind}${suffix}.html?${query}`)
  const { document, nodes, languages } = createDocument(lang)
  const context = vmContext(document, url, loading)
  vm.runInNewContext(sourceBundle(`${kind}-detail`), context)
  afterStart?.(context.__testRuntimeContext, { document, nodes, url })
  await new Promise((resolve) => setImmediate(resolve))
  const html = nodes[kind === 'fish' ? 'fish-detail' : 'detail-root']?.innerHTML || ''
  if (loading) return { html, nodes, languages, url, runtime: context.__testRuntimeContext }
  if (kind === 'fish') {
    assert.equal(
      html.includes('data-fish-exchange'),
      ['18', '22'].includes(url.searchParams.get('id')),
    )
  }
  if (
    kind === 'item' &&
    url.searchParams.get('category') === 'food' &&
    url.searchParams.get('id') === '07'
  ) {
    assert(html.includes('data-daikon-choice'))
    assert(!html.includes('buying-decision'))
    assert(html.includes('id=18'))
  }
  assert(html && !html.includes('กำลังโหลด'), `No render ${kind} ${query}`)
  validate(html, url)
  for (const node of Object.values(nodes))
    if (node.href) validate(`<a href="${node.href}"></a>`, url, true)
  for (const node of languages) if (node.href) validate(`<a href="${node.href}"></a>`, url, true)
  stats.renders += 1
  return { html, nodes, languages, url, runtime: context.__testRuntimeContext }
}

export async function galleryForage(lang) {
  const location = new URL(
    `https://example.test/catalogue/index${lang === 'en' ? '' : `.${lang}`}.html?category=bait&fish=06&route=sinker#catalogue`,
  )
  const { document, nodes } = createDocument(lang, { 'fish-filter': '06', 'sort-filter': 'id' })
  const context = vmContext(document, location, true)
  vm.runInNewContext(sourceBundle('gallery'), context)
  await new Promise((resolve) => setImmediate(resolve))
  const runtime = context.__testRuntimeContext
  assert(
    runtime?.forageBaitChoice && runtime?.toolUseLocations,
    'Frontend bundle lacks forage test actions',
  )
  runtime.allItems = data.items
  runtime.locationStage = ''
  runtime.baitRoute = 'float'
  return {
    choice: (item, items) => runtime.forageBaitChoice(item, items),
    locations: (item) => runtime.toolUseLocations(item),
    setState(stage, fish = '06', route = 'sinker') {
      runtime.allItems = data.items
      runtime.locationStage = String(stage)
      runtime.baitRoute = route
      nodes['fish-filter'].value = fish
    },
  }
}

export async function renderCatalogue(lang, search = '', loading = false, captureHistory = false) {
  const suffix = lang === 'en' ? '' : `.${lang}`
  const location = new URL(`https://example.test/catalogue/index${suffix}.html${search}`)
  const { document, nodes, languages } = createDocument(lang, { 'sort-filter': 'id' })
  const context = vmContext(document, location, loading, captureHistory)
  vm.runInNewContext(sourceBundle('gallery'), context)
  await new Promise((resolve) => setImmediate(resolve))
  assert(context.__testRuntimeContext, 'Catalogue bundle lacks page runtime')
  return { nodes, languages, runtime: context.__testRuntimeContext, url: location }
}

export function assertForagePointReturn(link, base, lang, stage, context, fish, route) {
  const next = new URL(unescapeHtml(link), base)
  const returned = next.searchParams.get('return')
  assert(returned, 'Forage marker has no exact point return')
  const point = new URL(returned, base)
  const suffix = lang === 'en' ? '' : `.${lang}`
  assert(
    point.pathname.endsWith(`/item${suffix}.html`),
    'Forage marker return must open localized item detail',
  )
  assert.equal(point.searchParams.get('category'), 'general_tool')
  assert.equal(point.searchParams.get('id'), '03')
  assert.equal(point.searchParams.get('stage'), String(stage))
  assert.equal(point.searchParams.get('fish'), fish)
  assert.equal(point.searchParams.get('route'), route)
  assert.equal(point.hash, `#forage-stage-${stage}-context-${Number(context)}`)
}
