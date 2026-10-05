const repository = 'https://github.com/polaminggkub-debug/kawa-no-nushi-tsuri-2-research/blob/main/'

export function readableEvidenceHref(value) {
  if (typeof value !== 'string') return value
  if (!/^\.\.\/(?:docs\/[\w.-]+\.md|README\.md)(?:#[^\s]*)?$/.test(value)) return value
  return repository + value.slice(3)
}
