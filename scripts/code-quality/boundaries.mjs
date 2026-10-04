import { existsSync, statSync } from 'node:fs'
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path'
import { builtinModules } from 'node:module'
import { fail } from './files.mjs'

const layers = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']
const extensions = ['.js', '.mjs', '.cjs', '.ts', '.tsx', '.css', '.html']
const builtins = new Set(builtinModules.flatMap((name) => [name, `node:${name}`]))

function resolveFile(candidate) {
  const candidates = [candidate, ...extensions.map((ext) => candidate + ext)]
  candidates.push(...extensions.map((ext) => resolve(candidate, `index${ext}`)))
  const found = candidates.find((file) => existsSync(file) && statSync(file).isFile())
  return found ? resolve(found) : null
}

function importCandidate(edge, context) {
  const specifier = edge.specifier.split(/[?#]/)[0]
  if (specifier.startsWith('@/')) return resolve(context.root, 'src', specifier.slice(2))
  if (specifier.startsWith('.')) return resolve(context.root, dirname(edge.file), specifier)
  if (specifier.startsWith('/') || isAbsolute(specifier)) {
    fail(
      context,
      'import-spelling',
      edge.file,
      edge.line,
      'Local imports must be relative or use @/',
    )
    return resolve(context.root, specifier.slice(1))
  }
  if (specifier === 'src' || specifier.startsWith('src/')) {
    fail(
      context,
      'import-spelling',
      edge.file,
      edge.line,
      'Use a relative path or @/ alias for source imports',
    )
    return resolve(context.root, specifier)
  }
  return null
}

function locate(file) {
  const parts = file.split('/')
  const layer = parts[1]
  const slice = ['app', 'shared'].includes(layer) ? undefined : parts[2]
  const segment = layer === 'shared' ? parts[2] : undefined
  return { layer, slice, segment, parts }
}

function publicIndex(target) {
  return target.parts.length === 4 && /^index\.(?:js|mjs|ts|tsx|css|html)$/.test(target.parts[3])
}

function checkStructure(edge, fromFile, toFile, context) {
  const from = locate(fromFile),
    to = locate(toFile)
  if (!layers.includes(from.layer) || !layers.includes(to.layer)) {
    fail(
      context,
      'fsd-layer',
      edge.file,
      edge.line,
      'Source files must live in an app/pages/widgets/features/entities/shared layer',
    )
    return
  }
  const fromRank = layers.indexOf(from.layer),
    toRank = layers.indexOf(to.layer)
  if (
    fromRank > toRank ||
    (from.layer === to.layer && from.slice && to.slice && from.slice !== to.slice)
  ) {
    fail(
      context,
      'fsd-direction',
      edge.file,
      edge.line,
      `Forbidden dependency ${from.layer}/${from.slice ?? '*'} → ${to.layer}/${to.slice ?? '*'}`,
    )
  }
  const sameSlice = from.layer === to.layer && from.slice === to.slice
  if (!sameSlice && !publicIndex(to)) {
    fail(
      context,
      'fsd-public-api',
      edge.file,
      edge.line,
      `Import ${to.layer}/${to.slice ?? to.segment ?? '*'} through its index public API`,
    )
  }
}

function resolveImport(edge, context) {
  if (!edge.specifier || edge.specifier.startsWith('#')) {
    fail(
      context,
      'import-unresolved',
      edge.file,
      edge.line,
      `Unsupported import path ${edge.specifier}`,
    )
    return null
  }
  if (
    !edge.specifier.startsWith('.') &&
    !edge.specifier.startsWith('@/') &&
    !edge.specifier.startsWith('/')
  ) {
    if (!builtins.has(edge.specifier)) {
      const parts = edge.specifier.split('/')
      context.packageImports.add(
        edge.specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0],
      )
    }
    return null
  }
  const candidate = importCandidate(edge, context)
  const file = candidate && resolveFile(candidate)
  if (!file)
    fail(context, 'import-unresolved', edge.file, edge.line, `Cannot resolve ${edge.specifier}`)
  return file
}

function selectedFile(file, context) {
  return context.selectedSet.has(relative(context.root, file).split(sep).join('/'))
}

export function inspectBoundaries(context) {
  const declared = new Set(Object.keys(context.package.devDependencies ?? {}))
  for (const name of context.packageImports) {
    if (!declared.has(name))
      fail(context, 'undeclared-package', 'package.json', 1, `Missing pinned dependency ${name}`)
  }
  for (const edge of context.imports) {
    const target = resolveImport(edge, context)
    if (!target) continue
    const targetName = relative(context.root, target).split(sep).join('/')
    if (
      !targetName.startsWith('src/') &&
      !targetName.startsWith('scripts/code-quality/') &&
      !targetName.startsWith('scripts/entity-link-check/') &&
      targetName !== 'scripts/check_entity_links.cjs' &&
      targetName !== 'scripts/build_frontend.mjs'
    ) {
      if (edge.file.startsWith('src/'))
        fail(
          context,
          'source-boundary',
          edge.file,
          edge.line,
          `Application source cannot import ${targetName}`,
        )
      continue
    }
    if (!selectedFile(target, context)) continue
    context.edges.push({ ...edge, target: targetName })
    if (edge.file.startsWith('src/') && targetName.startsWith('src/'))
      checkStructure(edge, edge.file, targetName, context)
  }
}

export function findCycles(edges) {
  const graph = new Map()
  for (const edge of edges.filter((item) => item.kind !== 'type')) {
    if (!graph.has(edge.file)) graph.set(edge.file, new Set())
    graph.get(edge.file).add(edge.target)
  }
  const indexByFile = new Map(),
    lowByFile = new Map(),
    active = new Set(),
    stack = [],
    cycles = []
  let nextIndex = 0
  function visit(file) {
    indexByFile.set(file, nextIndex)
    lowByFile.set(file, nextIndex)
    nextIndex += 1
    stack.push(file)
    active.add(file)
    for (const target of graph.get(file) ?? []) {
      if (!indexByFile.has(target)) {
        visit(target)
        lowByFile.set(file, Math.min(lowByFile.get(file), lowByFile.get(target)))
      } else if (active.has(target))
        lowByFile.set(file, Math.min(lowByFile.get(file), indexByFile.get(target)))
    }
    if (lowByFile.get(file) !== indexByFile.get(file)) return
    const component = []
    let member
    do {
      member = stack.pop()
      active.delete(member)
      component.push(member)
    } while (member !== file)
    if (component.length > 1 || graph.get(file)?.has(file)) cycles.push(component.sort())
  }
  for (const file of graph.keys()) if (!indexByFile.has(file)) visit(file)
  return cycles
}
