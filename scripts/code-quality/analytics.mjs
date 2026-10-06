// GoatCounter visitor statistics. Change the account code here only, then rebuild.
export const GOATCOUNTER_CODE = 'polamin'

const marker = /<script data-goatcounter=[^>]*><\/script>\s*/g

export function goatCounterScript(code = GOATCOUNTER_CODE) {
  return `<script data-goatcounter="https://${code}.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>`
}

// Idempotent: drops any earlier counter tag, then places one before </head> (or </body>, </html>).
export function addGoatCounter(html) {
  const clean = html.replace(marker, '')
  const tag = goatCounterScript()
  for (const closing of ['</head>', '</body>', '</html>']) {
    const index = clean.lastIndexOf(closing)
    if (index >= 0) return `${clean.slice(0, index)}${tag}${clean.slice(index)}`
  }
  return clean + tag
}
