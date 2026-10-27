const escapeAttr = (value) =>
  String(value).replace(
    /[&<>"]/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char],
  )

/** A pixel-art sprite for an item or fish, or '' when it has none. `size` is 'gear' (32px) or 'fish' (48px). */
export function spriteHtml(src, alt, size = 'gear') {
  if (!src) return ''
  return `<img class="pic pic-${size}" src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" width="${size === 'fish' ? 48 : 32}" height="${size === 'fish' ? 48 : 32}" loading="lazy" decoding="async">`
}

/** The sprite beside an already-escaped label; just the label when there is no sprite. */
export function withSprite(src, label, alt, size = 'gear') {
  const picture = spriteHtml(src, alt, size)
  return picture
    ? `<span class="pic-row">${picture}<span class="pic-name">${label}</span></span>`
    : label
}

/** Sprite path (relative to catalogue/) of one named kind/id, from the guide names file. */
export const spriteOf = (names, kind, id) => names.sprite?.[kind]?.[id] ?? null
