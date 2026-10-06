// Replace bare hex item IDs in player-facing advice text with the item's name.
// Runs on the merged catalogue payload at build time; ROM evidence text is never touched.
// A mention counts as an item reference when the ID follows a category word ("rod 04", "คัน 04"),
// the word "ID", or (in advice records only) stands alone as a two-character hex ID.
const CUES = {
  en: [
    ['rod', 'rod'],
    ['body', 'fly'],
    ['wing', 'fly_wing'],
    ['tail', 'fly_tail'],
    ['float', 'float_weight'],
    ['sinker', 'float_weight'],
    ['marker', 'float_weight'],
    ['hook', 'hook'],
    ['bait', 'bait'],
    ['lure', 'lure'],
    ['key', 'general_tool'],
    ['IDs', ''],
    ['ID', ''],
  ],
  th: [
    ['คัน', 'rod'],
    ['บอดี้', 'fly'],
    ['ปีก', 'fly_wing'],
    ['หาง', 'fly_tail'],
    ['ทุ่น', 'float_weight'],
    ['ตะกั่ว', 'float_weight'],
    ['มาร์กเกอร์', 'float_weight'],
    ['เบ็ด', 'hook'],
    ['เหยื่อ', 'bait'],
    ['ลัวร์', 'lure'],
    ['กุญแจ', 'general_tool'],
    ['IDs', ''],
    ['ID', ''],
  ],
  ja: [
    ['竿', 'rod'],
    ['ボディ', 'fly'],
    ['ウィング', 'fly_wing'],
    ['テール', 'fly_tail'],
    ['ウキ', 'float_weight'],
    ['オモリ', 'float_weight'],
    ['マーカー', 'float_weight'],
    ['ハリ', 'hook'],
    ['エサ', 'bait'],
    ['ルアー', 'lure'],
    ['鍵', 'general_tool'],
    ['IDs', ''],
    ['ID', ''],
  ],
}

// Which categories an unqualified ID may refer to, per kind of advice record.
const FAMILIES = {
  rodDecision: { categories: ['rod'], keys: ['label', 'recommendation', 'reason'] },
  baitLureDecision: { categories: ['bait', 'lure'], keys: ['recommendation', 'reason'] },
  gearDecision: {
    categories: ['hook', 'float_weight', 'fly', 'fly_wing', 'fly_tail'],
    keys: ['recommendation', 'reason'],
  },
}
const PLAYER_USE_KEYS = ['summary', 'facts', 'comparison', 'useLocations']
// Item-level copies of player actions that are also listed under playerUse.
const ITEM_ACTION_FIELDS = ['acquisitionOptions', 'exchangeFishAction']
const SECTION_KEYS = ['reason', 'recommendation', 'scope']
const SKIP_KEYS = new Set(['evidenceNotes', 'sources', 'source', 'evidence', 'capacityCheck'])

const ID_TOKEN =
  /(?<![0-9A-Za-z.×¥/:+#–-]|\d[.,])([0-9A-F]{2})(?![0-9A-Za-z%]|[.,/:–-]\d|[–-][0-9A-F]{2}\b)/g
// A two-digit number is a quantity, not an ID, when it is followed or preceded by these.
const QUANTITY_AFTER =
  /^\s*(?:and ×|และ ×|と×|units?\b|m\b|ม\.|หน่วย|ตัว|คัน|HP|fish|ชนิด|profiles?|โปรไฟล์|プロフィール|yen|เยน|[本位・円対種匹個倍枚点秒歩回台段]|%)/i
const QUANTITY_BEFORE =
  /(?:\bof |\bthan |\baim |จาก |เกิน|ครบ |ใน |เวลาเล็ง |狙う時間|×)\s*$/i
const NOT_AN_ITEM = /(?:fish|ปลา|魚)\s*ID\s*$|บอดี้(?:เปียก|แห้ง)\s*$/i

function idSuffixed(lang, name, id) {
  return lang === 'ja' ? `${name}（ID ${id}）` : `${name} (ID ${id})`
}

// Same fallback order as the pages' itemName(): the name the player already sees on the card.
function baseNames(item) {
  const shown = item.playerUse?.displayName || {}
  return {
    th: item.nameTh || shown.th || item.nameJa || item.nameEn || item.id,
    ja: shown.ja || item.nameJa || item.nameEn || item.id,
    en: shown.en || item.nameEn || item.nameJa || item.id,
  }
}

// Keep in sync with src/entities/item/rod-ref-name.js.
// "Yamabe rod, 6-piece, 3.9 m" reads badly mid-sentence; keep the size, drop the joint count.
// Generic names ("Large fly rod") take an article: "buy the large fly rod".
const GENERIC_ROD_NAME = /^(?:Small|Medium|Large|Heavy-fish|Two-handed) /

function sentenceName(item, lang, name) {
  if (item.category === 'rod' && lang === 'en') {
    const short = name.replace(/, \d+-piece/, '').replace(/ rod, /, ' rod ')
    return GENERIC_ROD_NAME.test(short) ? `the ${short[0].toLowerCase()}${short.slice(1)}` : short
  }
  // Fly bodies are only named by family; spell out "body" so the reference still reads as one.
  if (item.category === 'fly' && lang === 'ja') return `${name}ボディ${item.id}`
  if (item.category === 'fly' && lang === 'en') return `${name} body ${item.id}`
  return name
}

function displayNames(item) {
  const names = baseNames(item)
  const shown = item.playerUse?.displayName || {}
  for (const lang of Object.keys(names))
    if (lang === 'th' || !shown[lang]) names[lang] = sentenceName(item, lang, names[lang])
  return names
}

// Two items of one category can share a name (lures, fly families); those get "(ID xx)" appended.
function nameTable(items) {
  const named = items.map((item) => ({ item, names: displayNames(item) }))
  const counts = {}
  for (const { item, names } of named)
    for (const lang of Object.keys(names)) {
      const key = `${lang}|${item.category}|${names[lang]}`
      counts[key] = (counts[key] || 0) + 1
    }
  const table = new Map()
  for (const { item, names } of named) {
    const entry = {}
    for (const lang of Object.keys(names)) {
      const shared = counts[`${lang}|${item.category}|${names[lang]}`] > 1
      entry[lang] = shared ? idSuffixed(lang, names[lang], item.id) : names[lang]
    }
    table.set(`${item.category}:${item.id}`, entry)
  }
  return table
}

function cueBefore(lang, before) {
  for (const [word, category] of CUES[lang]) {
    const match = before.match(new RegExp(`${word}\\s*$`, lang === 'en' ? 'i' : ''))
    if (match) return { word, category, length: match[0].length }
  }
  return null
}

function foldKana(text) {
  return text
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60))
}

const bareName = (name) => name.replace(/\s*[(（]ID [0-9A-F]{2}[)）]$/, '')

function adjacentName(names, before, after, id) {
  const tail = foldKana(before.replace(/[\s(（]+$/, ''))
  const head = foldKana(after.replace(/^[\s(（]+/, ''))
  return names.some((name) => {
    const bare = foldKana(bareName(name))
    return tail.endsWith(bare) || head.startsWith(bare) || foldKana(`${before}${id}`).endsWith(bare)
  })
}

// "magnifier 03": a word that shares its first letters with another item's name for this ID.
function sharesNameStart(names, before) {
  const word = before.match(/([A-Za-z]{5,})\s*$/)?.[1]?.toLowerCase()
  return Boolean(word) && names.some((name) => name.toLowerCase().split(/\W+/).some((w) => w.slice(0, 5) === word.slice(0, 5)))
}

// "Healing mushroom ID 09" already names item 09 in words; do not name it twice.
function mentionsName(names, before) {
  const window = foldKana(before.slice(-28))
  return names.some((name) => {
    const bare = foldKana(bareName(name))
    const words = bare.split(/[\s,()（）·—]+/).filter((word) => word.length >= 3)
    const fragments = /\s/.test(bare) ? words : [bare.slice(0, 3)]
    return fragments.some((fragment) => window.includes(fragment))
  })
}

// The whole name already stands in front of a category word ("aquatic insect bait 07").
function precededByName(names, lead) {
  const window = foldKana(lead.slice(-40))
  return names.some((name) => window.includes(foldKana(bareName(name))))
}

function excerpt(text, offset) {
  return text.slice(Math.max(0, offset - 30), offset + 22).replace(/\s+/g, ' ')
}

// "the large fly rod" opens a sentence as "The large fly rod".
function capitalizeSentenceStarts(text, lang) {
  return lang === 'en' ? text.replace(/(^|[.!?]\s+)the (?=[a-z])/g, '$1The ') : text
}

function createResolver(items) {
  const table = nameTable(items)
  const categories = [...new Set(items.map((item) => item.category))]
  const rods = new Set(items.filter((item) => item.category === 'rod').map((item) => item.id))

  // `scope` lists the categories an unqualified ID may mean; `needCue` demands an explicit cue.
  function refFor(text, match, lang, scope, needCue, log) {
    const id = match[1]
    const before = text.slice(0, match.index)
    const after = text.slice(match.index + id.length)
    const cue = cueBefore(lang, before)
    if (needCue && !cue) return null
    const numeric = /^[1-9][0-9]$/.test(id)
    if (numeric && !cue && !(scope.length === 1 && scope[0] === 'rod' && rods.has(id))) return null
    if (QUANTITY_AFTER.test(after) || (numeric && QUANTITY_BEFORE.test(before))) return null
    if (/[(（](?:ID )?$/.test(before) && /^[)）]/.test(after)) return null
    if (NOT_AN_ITEM.test(before)) return null
    const named = categories.filter((category) => table.has(`${category}:${id}`))
    let found = (cue?.category ? [cue.category] : scope).filter((c) => named.includes(c))
    if (!found.length && !cue?.category && !needCue) found = named
    const names = found.map((category) => table.get(`${category}:${id}`)[lang])
    const lead = cue ? before.slice(0, -cue.length) : before
    const everyName = named.map((category) => table.get(`${category}:${id}`)[lang])
    const skip = (reason) => {
      log?.push({ kind: 'skipped', reason, lang, id, text: excerpt(text, match.index) })
      return null
    }
    if (adjacentName(everyName, before, after, id)) return skip('named-next-to-id')
    if (!cue?.category && sharesNameStart(everyName.filter((name) => !names.includes(name)), before))
      return skip('other-item-noun')
    if (cue && !cue.category && mentionsName(names, lead)) return skip('named-before-id')
    if (cue?.category && precededByName(names, lead)) return skip('name-before-cue')
    // Unqualified and ambiguous: the record's own category (listed first) wins.
    const chosen = found.length > 1 && found.includes(scope[0]) && !cue?.category ? [scope[0]] : found
    if (chosen.length !== 1) {
      log?.push({ kind: 'unresolved', lang, id, text: excerpt(text, match.index) })
      return null
    }
    const name = table.get(`${chosen[0]}:${id}`)[lang]
    const consumed = cue && (!cue.category || name.toLowerCase().includes(cue.word.toLowerCase()))
    log?.push({ kind: 'replaced', lang, id, name, text: excerpt(text, match.index) })
    return { name, cueLength: consumed ? cue.length : 0 }
  }

  function text(value, lang, scope, needCue, log) {
    let output = ''
    let last = 0
    for (const match of value.matchAll(ID_TOKEN)) {
      const ref = refFor(value, match, lang, scope, needCue, log)
      if (!ref) continue
      const start = Math.max(last, match.index - ref.cueLength)
      output += value.slice(last, start) + ref.name
      last = match.index + match[1].length
    }
    return capitalizeSentenceStarts(output + value.slice(last), lang)
  }

  function walk(node, lang, scope, needCue, log) {
    if (typeof node === 'string') return lang ? text(node, lang, scope, needCue, log) : node
    if (Array.isArray(node)) return node.map((entry) => walk(entry, lang, scope, needCue, log))
    if (!node || typeof node !== 'object') return node
    const output = {}
    for (const [key, value] of Object.entries(node))
      output[key] = SKIP_KEYS.has(key)
        ? value
        : walk(value, CUES[key] ? key : lang, scope, needCue, log)
    return output
  }

  function ownFirst(item, scope) {
    return scope.includes(item.category)
      ? [item.category, ...scope.filter((category) => category !== item.category)]
      : scope
  }

  // Scope and cue rules for one field of one record; `field` is a FAMILIES key, "playerUse"
  // or "section".
  function rulesFor(item, field) {
    if (field === 'playerUse') return { scope: [item.category], needCue: true }
    if (field === 'section')
      return { scope: [...new Set((item.items || []).map((entry) => entry.category))], needCue: false }
    return { scope: ownFirst(item, FAMILIES[field].categories), needCue: false }
  }

  function resolveValue(item, field, value, log) {
    const { scope, needCue } = rulesFor(item, field)
    return walk(value, null, scope, needCue, log)
  }

  function resolveRecord(item, field, log) {
    const keys = field === 'playerUse' ? PLAYER_USE_KEYS : field === 'section' ? SECTION_KEYS : FAMILIES[field].keys
    const record = field === 'section' ? item : item[field]
    for (const key of keys) if (record[key]) record[key] = resolveValue(item, field, record[key], log)
  }

  return { table, resolveValue, resolveRecord }
}

// Mutates `data`: advice text now names the items it points to instead of quoting their hex IDs.
function resolveItemRefs(data, log) {
  const resolver = createResolver(data.items)
  for (const item of data.items) {
    for (const field of Object.keys(FAMILIES)) if (item[field]) resolver.resolveRecord(item, field, log)
    if (item.playerUse) resolver.resolveRecord(item, 'playerUse', log)
    for (const field of ITEM_ACTION_FIELDS)
      if (item[field]) item[field] = resolver.resolveValue(item, 'playerUse', item[field], log)
  }
  for (const section of data.playerDecisions?.sections || [])
    resolver.resolveRecord(section, 'section', log)
  return data
}

module.exports = { resolveItemRefs, createResolver }
