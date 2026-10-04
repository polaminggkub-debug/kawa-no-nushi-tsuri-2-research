import { copy_en } from './copy_en.js'
import { copy_ja } from './copy_ja.js'
import { copy_th } from './copy_th.js'

export function loadCopy(ctx) {
  ctx.copy = { en: copy_en, ja: copy_ja, th: copy_th }[ctx.locale] || null
}
