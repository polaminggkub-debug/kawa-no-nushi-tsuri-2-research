function nameKey(value) {
  return String(value || '')
    .normalize('NFKC')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase()
}

export function distinctFishNames(names, headline = '') {
  const seen = new Set(headline.split('/').map(nameKey).filter(Boolean))
  seen.add(nameKey(headline))
  return names
    .flatMap((name) =>
      String(name || '')
        .split('/')
        .map((part) => part.trim()),
    )
    .filter((name) => {
      const key = nameKey(name)
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })
}
