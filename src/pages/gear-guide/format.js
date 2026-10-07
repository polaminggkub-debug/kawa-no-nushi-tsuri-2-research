export const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  )

/** 1555 as "¥1,555". */
export const yen = (value) => `¥${value.toLocaleString('en-US')}`

/** A share of fights as a whole percentage; anything above zero shows at least "1%". */
export const percent = (value) => `${value > 0 && value < 1 ? 1 : Math.round(value)}%`

/** Pick the localized string out of a { en, th, ja } name record. */
export const localName = (record, locale) => record?.[locale] ?? record?.en ?? ''
