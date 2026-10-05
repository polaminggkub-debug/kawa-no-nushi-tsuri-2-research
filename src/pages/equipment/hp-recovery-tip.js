import { hpRecoveryAction } from '../../shared/lib/index.js'

export function catalogueHpRecoveryAction(ctx) {
  if (typeof ctx.sourceReturn !== 'function') return ''
  return hpRecoveryAction({
    locale: ctx.lang,
    cataloguePath: `index${ctx.lang === 'en' ? '' : '.' + ctx.lang}.html`,
    stage: ctx.locationStage,
    returnPath: ctx.sourceReturn(),
    source: 'catalogue',
    escapeHtml: ctx.esc,
  })
}
