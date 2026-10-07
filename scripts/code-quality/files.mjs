import { existsSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

export const sourceExtensions = new Set(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.css', '.html'])

export function physicalLines(source) {
  if (!source.length) return 0
  return source.split(/\r\n|\r|\n/).length - Number(/[\r\n]$/.test(source))
}

export function fail(context, rule, file, line, message) {
  context.violations.push({ rule, file, line, message })
}

export function collectTree(directory, prefix, context) {
  if (!existsSync(directory)) return []
  const result = []
  for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    const file = `${prefix}/${entry.name}`
    if (entry.isSymbolicLink())
      fail(context, 'source-symlink', file, 1, 'Symlinks are not source files')
    else if (entry.isDirectory())
      result.push(...collectTree(resolve(directory, entry.name), file, context))
    else if (sourceExtensions.has(`.${entry.name.split('.').at(-1)}`)) result.push(file)
  }
  return result
}

export function sourceFiles(root, context) {
  const files = [
    ...collectTree(join(root, 'src'), 'src', context),
    ...collectTree(join(root, 'scripts/code-quality'), 'scripts/code-quality', context),
    ...collectTree(join(root, 'scripts/entity-link-check'), 'scripts/entity-link-check', context),
    ...collectTree(join(root, 'scripts/gear-effects'), 'scripts/gear-effects', context),
    ...collectTree(join(root, 'scripts/gear-guide'), 'scripts/gear-guide', context),
  ]
  const buildTool = join(root, 'scripts/build_frontend.mjs')
  if (existsSync(buildTool) && statSync(buildTool).isFile())
    files.push('scripts/build_frontend.mjs')
  const policyTool = join(root, 'scripts/build_fight_policies.mjs')
  if (existsSync(policyTool) && statSync(policyTool).isFile())
    files.push('scripts/build_fight_policies.mjs')
  const gearTool = join(root, 'scripts/build_gear_effects.mjs')
  if (existsSync(gearTool) && statSync(gearTool).isFile())
    files.push('scripts/build_gear_effects.mjs')
  const entityTool = join(root, 'scripts/check_entity_links.cjs')
  if (existsSync(entityTool) && statSync(entityTool).isFile())
    files.push('scripts/check_entity_links.cjs')
  for (const file of ['scripts/check_map_combobox.cjs', 'scripts/check_shop_conditions.cjs']) {
    const path = join(root, file)
    if (existsSync(path) && statSync(path).isFile()) files.push(file)
  }
  return [...new Set(files)].sort()
}
