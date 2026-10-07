// Layout of data/gear-effects.json: header fields on their own line, then one fish and method (or
// one item) per line so diffs stay readable.

/** How many object levels below a top-level key get their own lines (the rest is compact). */
const SPREAD = { fish: 3, items: 2 }

function spread(value, levels, indent) {
  if (levels === 0 || value === null || typeof value !== 'object' || Array.isArray(value))
    return JSON.stringify(value)
  const pad = ' '.repeat(indent + 2)
  const rows = Object.entries(value).map(
    ([key, child]) => `${pad}${JSON.stringify(key)}: ${spread(child, levels - 1, indent + 2)}`,
  )
  return `{\n${rows.join(',\n')}\n${' '.repeat(indent)}}`
}

export function renderDocument(doc) {
  const rows = Object.entries(doc).map(
    ([key, value]) => `  ${JSON.stringify(key)}: ${spread(value, SPREAD[key] ?? 0, 2)}`,
  )
  return `{\n${rows.join(',\n')}\n}\n`
}
