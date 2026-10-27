/** Fold case, width, spaces, dashes and katakana so "ﾓﾂｺﾞ", "モツゴ" and "もつご" meet. */
export function fold(text) {
  return String(text ?? '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60))
    .replace(/[\s\-_.,·・/()（）]+/g, '')
}

function distance(a, b, limit) {
  if (Math.abs(a.length - b.length) > limit) return limit + 1
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index)
  for (let row = 1; row <= a.length; row += 1) {
    const current = [row]
    for (let col = 1; col <= b.length; col += 1)
      current[col] = Math.min(
        previous[col] + 1,
        current[col - 1] + 1,
        previous[col - 1] + (a[row - 1] === b[col - 1] ? 0 : 1),
      )
    previous = current
  }
  return previous[b.length]
}

/** 0 = no match; higher is better. IDs and names match exactly, by prefix, then inside. */
export function score(entry, query, lang) {
  const id = fold(entry.id)
  if (id === query) return 100
  const names = [entry.n[lang], entry.n.en, entry.n.ja, entry.n.th].map(fold)
  if (names.includes(query)) return 90
  if (names.some((name) => name.startsWith(query))) return 70
  if (fold(entry.a).includes(query)) return 50
  return 0
}

/** Entries within one or two typos of the query, for "did you mean". */
export function nearMiss(entries, query, lang, taken) {
  if (query.length < 3) return []
  const limit = query.length >= 6 ? 2 : 1
  const found = []
  for (const entry of entries) {
    if (taken.has(entry)) continue
    const names = [entry.n[lang], entry.n.en, entry.n.ja, entry.n.th, ...entry.a.split(' ')]
    let best = limit + 1
    for (const name of names) {
      const word = fold(name)
      if (!word) continue
      const head = word.slice(0, query.length + limit)
      best = Math.min(best, distance(query, word, limit), distance(query, head, limit))
    }
    if (best <= limit) found.push({ entry, best })
  }
  return found.sort((a, b) => a.best - b.best).map((match) => match.entry)
}

export function search(entries, rawQuery, lang, type) {
  const query = fold(rawQuery)
  if (!query) return { hits: [], near: [] }
  const pool = type === 'all' ? entries : entries.filter((entry) => entry.k === type)
  const hits = pool
    .map((entry) => ({ entry, points: score(entry, query, lang) }))
    .filter((match) => match.points)
    .sort((a, b) => b.points - a.points || (a.entry.k === 'fish' ? -1 : 1))
    .map((match) => match.entry)
  const near = hits.length < 4 ? nearMiss(pool, query, lang, new Set(hits)).slice(0, 4) : []
  return { hits, near }
}
