const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

const source = fs.readFileSync(path.join(__dirname, '../research/search.js'), 'utf8')
const fixture = {
  fish: {
    '01': { nameLatin: 'Iwana', nameTh: 'อิวานะ', nameJa: 'イワナ' },
    '03': { nameLatin: 'Yamame', nameTh: 'ยามาเมะ', nameJa: 'ヤマメ' },
    '06': {
      nameLatinVariants: ['Nijimasu', 'Nijimasu (rainbow trout)'],
      nameThVariants: ['นิจิมาสุ', 'ปลาเรนโบว์เทราต์'],
      nameJa: 'ニジマス',
    },
    42: { nameLatin: 'Sakuramasu', nameTh: 'ซากุระมาสึ', nameJa: 'サクラマス' },
  },
}

const copy = {
  en: {
    all: 'Showing 4 of 4 fish profiles.',
    none: 'Showing 0 of 4 fish profiles.',
    warning:
      'Lookup aliases could not be loaded. Search by the Japanese ROM name or profile ID instead.',
  },
  ja: {
    all: '魚プロフィール 4 / 4 件を表示。',
    none: '魚プロフィール 0 / 4 件を表示。',
    warning:
      '検索用のローマ字・タイ語名を読み込めませんでした。ROMの日本語名またはプロフィールIDで検索できます。',
  },
  th: {
    all: 'แสดง 4 จาก 4 โปรไฟล์ปลา',
    none: 'แสดง 0 จาก 4 โปรไฟล์ปลา',
    warning: 'โหลดคำช่วยค้นหาไม่สำเร็จ ยังค้นด้วยชื่อญี่ปุ่นจาก ROM หรือ ID โปรไฟล์ได้',
  },
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function createHarness(
  lang,
  fetchMode = 'success',
  href = `https://example.test/research/index.${lang}.html`,
) {
  const pageUrl = new URL(href)
  const rows = [
    ['01', '01 イワナ'],
    ['03', '03 ヤマメ'],
    ['06', '06 ニジマス'],
    ['42', '42 サクラマス'],
  ].map(([id, textContent]) => {
    const fishPage = lang === 'en' ? 'fish.html' : `fish.${lang}.html`
    const link = { href: `https://example.test/catalogue/${fishPage}?id=${id}&return=research` }
    return {
      hidden: false,
      textContent,
      link,
      querySelector: () => link,
    }
  })
  const filter = {
    value: '',
    listeners: {},
    addEventListener(event, callback) {
      this.listeners[event] = callback
    },
  }
  const filterCount = { textContent: '' }
  const aliasWarning = { hidden: true, textContent: '' }
  const technicalEvidence = { open: false }
  const languageLink = {
    href: `https://example.test/research/index.${lang === 'th' ? 'en' : 'th'}.html`,
    getAttribute(name) {
      return name === 'href' ? this.href : null
    },
  }
  const listeners = {}
  const languageNav = {
    addEventListener(event, callback) {
      listeners[event] = callback
    },
  }
  const elements = {
    filter,
    'filter-count': filterCount,
    'alias-warning': aliasWarning,
    'technical-evidence': technicalEvidence,
  }
  const document = {
    documentElement: { lang },
    getElementById: (id) => elements[id],
    querySelector: (selector) => (selector === '.strategy-languages' ? languageNav : null),
    querySelectorAll: (selector) => (selector === '#fish-matrix tbody tr' ? rows : []),
  }
  const fetch =
    fetchMode === 'success'
      ? () => Promise.resolve({ ok: true, json: () => Promise.resolve(fixture) })
      : () => Promise.reject(new Error('offline'))

  const location = {
    href: pageUrl.href,
    pathname: pageUrl.pathname,
    search: pageUrl.search,
    hash: pageUrl.hash,
    origin: pageUrl.origin,
  }
  const history = {
    replaceState(_state, _title, href) {
      const nextUrl = new URL(href, location.href)
      location.href = nextUrl.href
      location.pathname = nextUrl.pathname
      location.search = nextUrl.search
      location.hash = nextUrl.hash
      location.origin = nextUrl.origin
    },
  }
  vm.runInNewContext(source, { document, fetch, history, location, URL, URLSearchParams })
  return {
    rows,
    filter,
    filterCount,
    aliasWarning,
    technicalEvidence,
    languageLink,
    listeners,
    location,
  }
}

function visibleIds(rows) {
  return rows
    .filter((row) => !row.hidden)
    .map((row) => row.querySelector('a[href*="id="]').href.match(/[?&]id=([^&]+)/)[1])
}

async function tick() {
  await new Promise((resolve) => setImmediate(resolve))
}

async function checkAliasesForLocale(lang) {
  const { rows, filter, filterCount, aliasWarning } = createHarness(lang)
  await tick()
  assert(filterCount.textContent === copy[lang].all, `${lang}: initial localized count`)
  assert(aliasWarning.hidden, `${lang}: warning hidden after successful fetch`)

  for (const [query, expected] of [
    ['ニジマス', 'Japanese ROM name'],
    ['rainbow trout', 'English lookup alias'],
    ['Nijimasu', 'romanized lookup alias'],
    ['ปลาเรนโบว์เทราต์', 'Thai lookup alias'],
    ['06', 'hex profile ID'],
    ['０６', 'NFKC-normalized fullwidth ID'],
  ]) {
    filter.value = query
    filter.listeners.input()
    assert(
      JSON.stringify(visibleIds(rows)) === JSON.stringify(['06']),
      `${lang}: ${expected} query ${query}`,
    )
  }

  filter.value = 'no matching fish'
  filter.listeners.input()
  assert(visibleIds(rows).length === 0, `${lang}: zero-result filtering`)
  assert(filterCount.textContent === copy[lang].none, `${lang}: localized zero-result feedback`)
}

async function checkFetchFailureForLocale(lang) {
  const { rows, filter, filterCount, aliasWarning } = createHarness(lang, 'failure')
  await tick()
  assert(aliasWarning.hidden === false, `${lang}: alias failure warning shown`)
  assert(
    aliasWarning.textContent === copy[lang].warning,
    `${lang}: localized alias failure warning`,
  )

  filter.value = 'ニジマス'
  filter.listeners.input()
  assert(
    JSON.stringify(visibleIds(rows)) === JSON.stringify(['06']),
    `${lang}: Japanese name works after alias failure`,
  )
  filter.value = '06'
  filter.listeners.input()
  assert(
    JSON.stringify(visibleIds(rows)) === JSON.stringify(['06']),
    `${lang}: ID works after alias failure`,
  )
  assert(filterCount.textContent !== copy[lang].none, `${lang}: fallback still reports matches`)
}

async function assertRestoredResearchPage(state, query) {
  await tick()
  assert(state.filter.value === query, 'return route restores the typed research query')
  assert(
    JSON.stringify(visibleIds(state.rows)) === JSON.stringify(['03']),
    'restored alias query filters after aliases load',
  )
  assert(state.technicalEvidence.open, 'return route reopens technical evidence')
}

async function assertFishLinkReturn(state, lang, page, query) {
  const fishLink = state.rows.find((row) => row.link.href.includes('id=03')).link
  const fishUrl = new URL(fishLink.href)
  const returnValue = fishUrl.searchParams.get('return')
  const returnUrl = new URL(returnValue, fishUrl.href)
  assert(
    returnUrl.pathname.endsWith(`/research/${page}`),
    `${lang}: fish link returns to the localized research page`,
  )
  assert(returnUrl.searchParams.get('q') === query, 'fish link return preserves the typed query')
  assert(returnUrl.hash === '#technical-evidence', 'fish link return preserves the evidence topic')

  const restored = createHarness(lang, 'success', returnUrl.href)
  await tick()
  assert(restored.filter.value === query, 'reopened research page restores its query')
  assert(
    JSON.stringify(visibleIds(restored.rows)) === JSON.stringify(['03']),
    'reopened research page restores matching rows after aliases load',
  )
  assert(restored.technicalEvidence.open, 'reopened research page opens technical evidence')
  return fishUrl.href
}

function assertLanguageSwitchKeepsCurrentQuery(state, lang) {
  state.filter.value = 'rainbow trout'
  state.filter.listeners.input()
  assert(
    new URL(state.location.href).searchParams.get('q') === 'rainbow trout',
    `${lang}: address tracks the current typed query`,
  )
  const languageEvent = { target: { closest: () => state.languageLink } }
  state.listeners.click(languageEvent)
  const languageUrl = new URL(state.languageLink.href)
  assert(
    languageUrl.searchParams.get('q') === 'rainbow trout',
    'language switch preserves the current typed query',
  )
  assert(languageUrl.hash === '#technical-evidence', 'language switch preserves the current topic')
}

async function assertClearedSearchSurvivesReload(state, fishUrl, lang) {
  state.filter.value = ''
  state.filter.listeners.input()
  assert(
    !new URL(state.location.href).searchParams.has('q'),
    `${lang}: clearing input removes stale q from the address`,
  )
  const emptyQueryReturn = new URL(
    state.rows.find((row) => row.link.href.includes('id=03')).link.href,
  ).searchParams.get('return')
  const emptyReturnUrl = new URL(emptyQueryReturn, fishUrl)
  assert(
    !emptyReturnUrl.searchParams.has('q'),
    'empty query removes stale q from fish return route',
  )

  const emptyReload = createHarness(lang, 'success', state.location.href)
  await tick()
  assert(emptyReload.filter.value === '', `${lang}: reload after clearing keeps the query empty`)
  assert(
    JSON.stringify(visibleIds(emptyReload.rows)) === JSON.stringify(['01', '03', '06', '42']),
    `${lang}: reload after clearing restores every row`,
  )
}

async function checkSearchReturnState(lang) {
  const query = 'ยามาเมะ'
  const page = `index${lang === 'en' ? '' : `.${lang}`}.html`
  const startUrl = `https://example.test/research/${page}?q=${encodeURIComponent(query)}#technical-evidence`
  const state = createHarness(lang, 'success', startUrl)
  await assertRestoredResearchPage(state, query)
  const fishUrl = await assertFishLinkReturn(state, lang, page, query)
  assertLanguageSwitchKeepsCurrentQuery(state, lang)
  await assertClearedSearchSurvivesReload(state, fishUrl, lang)
}

;(async () => {
  for (const lang of ['en', 'ja', 'th']) {
    await checkAliasesForLocale(lang)
    await checkFetchFailureForLocale(lang)
  }
  for (const lang of ['en', 'ja', 'th']) await checkSearchReturnState(lang)
  console.log(
    'PASS: EN/JA/TH research filters support ROM Japanese, romanized/Thai lookup aliases, hex and NFKC IDs, localized zero-result counts, visible alias-load failures with working fallback, and searchable return routes.',
  )
})().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
