import { createHash } from 'node:crypto'

export function assetVersion(contents) {
  return createHash('sha256').update(contents).digest('hex').slice(0, 16)
}

export function versionAssetReferences(html, outputPath, outputs) {
  const base = new URL(outputPath, 'https://generated.invalid/')
  return html.replace(/\b(src|href)=(['"])([^'"]+)\2/g, (match, attribute, quote, value) => {
    const url = new URL(value, base)
    if (url.origin !== base.origin) return match
    const asset = url.pathname.slice(1)
    if (!/\.(js|css)$/.test(asset) || !outputs.has(asset)) return match
    url.searchParams.set('v', assetVersion(outputs.get(asset)))
    const originalPath = value.split(/[?#]/)[0]
    return `${attribute}=${quote}${originalPath}${url.search}${url.hash}${quote}`
  })
}
