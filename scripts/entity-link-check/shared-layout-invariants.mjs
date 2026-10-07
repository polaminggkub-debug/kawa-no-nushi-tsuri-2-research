import assert from 'node:assert/strict'
import fs from 'node:fs'
import postcss from 'postcss'
import { renderFrontendOutputs } from '../build_frontend.mjs'
import { root } from './shared.mjs'

const source = ['part-1.css', 'part-2.css', 'part-3.css', 'part-4.css']
  .map((file) => fs.readFileSync(`${root}/src/shared/ui/${file}`, 'utf8'))
  .join('\n')
checkStyles(postcss.parse(source), 'shared UI source')
checkRegressionProbes(source)
const outputs = await renderFrontendOutputs()
const common = outputs.get('catalogue/compendium.css')
assert(common, 'Missing shared compendium stylesheet')
for (const file of [
  'catalogue/style.css',
  'catalogue/detail.css',
  'catalogue/maps.css',
  'catalogue/shops.css',
  'catalogue/quests.css',
  'catalogue/fight-sim.css',
  'catalogue/gear-guide.css',
  'research/strategy.css',
]) {
  assert(outputs.has(file), `Missing stylesheet output ${file}`)
  checkStyles(postcss.parse(outputs.get(file) + '\n' + common), file)
}
console.log(
  'PASS: shared/footer styles permit hash wrapping and use one header scroll offset plus a small anchor gap. CSS invariants are not browser layout proof.',
)

function checkStyles(sheet, label) {
  for (const width of [320, 390, 700, 701, 1280]) {
    assert.equal(
      valueAt(sheet, 'footer code', 'overflow-wrap', width),
      'anywhere',
      `${label}/${width}: unbroken footer hash cannot wrap`,
    )
    const padding = valueAt(sheet, 'html', 'scroll-padding-top', width)
    const margin = valueAt(sheet, '[id]', 'scroll-margin-top', width)
    assert.match(
      padding,
      /^\d+px$/,
      `${label}: header padding must resolve to a bounded pixel value`,
    )
    assert.match(margin, /^\d+px$/, `${label}: anchor gap must resolve to a bounded pixel value`)
    assert(Number.parseInt(padding) >= 80, `${label}: header compensation removed`)
    assert(
      Number.parseInt(margin) <= 24,
      `${label}: anchor margin duplicates the header compensation`,
    )
    assert.equal(margin, '12px', `${label}: preserve the independently observed anchor gap`)
  }
}

function valueAt(sheet, selector, property, width) {
  let value = ''
  sheet.walkRules((rule) => {
    if (
      !rule.selector
        .split(',')
        .map((part) => part.trim())
        .includes(selector)
    )
      return
    if (!applies(rule, width)) return
    for (const declaration of rule.nodes || []) {
      if (declaration.type === 'decl' && declaration.prop === property) value = declaration.value
    }
  })
  return value.trim()
}

function applies(rule, width) {
  for (let parent = rule.parent; parent && parent.type !== 'root'; parent = parent.parent) {
    if (parent.type !== 'atrule' || parent.name !== 'media') continue
    const max = /max-width\s*:\s*(\d+(?:\.\d+)?)px/i.exec(parent.params)?.[1]
    const min = /min-width\s*:\s*(\d+(?:\.\d+)?)px/i.exec(parent.params)?.[1]
    if ((max && width > Number(max)) || (min && width < Number(min))) return false
  }
  return true
}

function checkRegressionProbes(source) {
  const unwrapped = postcss.parse(source)
  unwrapped.walkRules('footer code', (rule) => rule.remove())
  assert.throws(() => checkStyles(unwrapped, 'missing footer wrap'), /hash cannot wrap/)
  const duplicateOffset = postcss.parse(source)
  duplicateOffset.walkRules('[id]', (rule) => {
    rule.walkDecls('scroll-margin-top', (declaration) => {
      declaration.value = '144px'
    })
  })
  assert.throws(
    () => checkStyles(duplicateOffset, 'double offset'),
    /duplicates the header compensation/,
  )
}
