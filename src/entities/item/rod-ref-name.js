// Rod names for advice sentences. Keep in sync with scripts/item_refs.cjs (build-time text).
const rods = new Map()
const GENERIC_ROD_NAME = /^(?:Small|Medium|Large|Heavy-fish|Two-handed) /

export function rememberRod(item) {
  rods.set(item.id, item)
}

function rodName(lang, item) {
  const shown = item.playerUse?.displayName?.[lang]
  if (lang === 'th') return item.nameTh || shown || item.nameJa || item.nameEn
  if (lang === 'ja') return shown || item.nameJa || item.nameEn
  // "Yamabe rod, 6-piece, 3.9 m" reads badly mid-sentence; keep the size, drop the joint count.
  const short = (shown || item.nameEn || item.nameJa)
    .replace(/, \d+-piece/, '')
    .replace(/ rod, /, ' rod ')
  // Generic names take an article: "buy the large fly rod".
  return GENERIC_ROD_NAME.test(short) ? `the ${short[0].toLowerCase()}${short.slice(1)}` : short
}

// "the large fly rod" opens a sentence as "The large fly rod".
export function capitalizeSentenceStarts(text) {
  return text.replace(/(^|[.!?]\s+)the (?=[a-z])/g, '$1The ')
}

export function rodRefName(lang, id) {
  const item = rods.get(id)
  return (item && rodName(lang, item)) || id
}
