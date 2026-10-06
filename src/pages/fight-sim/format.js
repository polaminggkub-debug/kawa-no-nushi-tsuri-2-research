/** The SNES video clock the fight runs on, in frames per second. */
export const FRAME_RATE = 60.0988

export const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  )

/** Frames as seconds with one decimal ("12.3"). */
export const seconds = (frames) => (frames / FRAME_RATE).toFixed(1)

/** A share such as 14.4 as "14.4%"; whole numbers lose the decimal ("100%"). */
export const percent = (value) => `${Number.isInteger(value) ? value : value.toFixed(1)}%`

/** Pick the localized string out of a { en, th, ja } name record. */
export const localName = (record, locale) => record?.[locale] ?? record?.en ?? ''
