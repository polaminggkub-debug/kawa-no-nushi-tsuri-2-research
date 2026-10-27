const escapeAttr = (value) =>
  String(value).replace(
    /[&<>"]/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char],
  )

const SIZES = { gear: [32, 32], rod: [14, 48], fishrow: [64, 32], fish: [96, 48] }

/** A pixel-art sprite for an item or fish, or '' when it has none. `size`: 'gear' 32px, 'rod' 14x48 (rod art is a tall sliver), 'fishrow' 64x32 (fish art is 2:1), 'fish' 96x48 (card header). */
export function spriteHtml(src, alt, size = 'gear') {
  if (!src) return ''
  const [width, height] = SIZES[size]
  return `<img class="pic pic-${size}" src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" width="${width}" height="${height}" loading="lazy" decoding="async">`
}

/** The sprite beside an already-escaped label; just the label when there is no sprite. */
export function withSprite(src, label, alt, size = 'gear') {
  const picture = spriteHtml(src, alt, size)
  return picture
    ? `<span class="pic-row pic-row-${size}">${picture}<span class="pic-name">${label}</span></span>`
    : label
}

/** Sprite path (relative to catalogue/) of one named kind/id, from the guide names file. */
export const spriteOf = (names, kind, id) => names.sprite?.[kind]?.[id] ?? null
