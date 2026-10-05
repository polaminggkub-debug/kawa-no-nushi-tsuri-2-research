import { createHash } from 'node:crypto'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import tseslint from 'typescript-eslint'
import js from '@eslint/js'
import globals from 'globals'
import ts from 'typescript'
import { ESLint } from 'eslint'
import * as prettier from 'prettier'
import prettierConfig from '../../prettier.config.mjs'
import { fail, physicalLines, sourceFiles } from './files.mjs'
import { inspectSource } from './parse.mjs'
import { findCycles, inspectBoundaries } from './boundaries.mjs'

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)))
const versions = {
  '@types/node': '22.20.5',
  '@eslint/js': '10.0.1',
  esbuild: '0.28.2',
  eslint: '10.12.0',
  globals: '17.13.0',
  postcss: '8.5.28',
  prettier: '3.9.9',
  'typescript-eslint': '8.71.0',
  typescript: '6.0.3',
}

function contextFor(packageJson) {
  return {
    root,
    sourceRoot: resolve(root, 'src'),
    package: packageJson,
    violations: [],
    imports: [],
    edges: [],
    packageImports: new Set(),
    selectedSet: new Set(),
    functionCount: 0,
    lineCounts: {},
  }
}

function verifyVersions(context) {
  for (const [name, version] of Object.entries(versions)) {
    if (context.package.devDependencies?.[name] !== version) {
      fail(context, 'tool-version', 'package.json', 1, `${name} must be pinned to ${version}`)
    }
  }
  if (ts.version !== versions.typescript)
    fail(
      context,
      'typescript-api-version',
      'package.json',
      1,
      `Installed TypeScript is ${ts.version}`,
    )
}

async function inspectFile(file, context, formatter) {
  const source = readFileSync(resolve(root, file), 'utf8')
  context.fingerprint.update(`${file}\0${source}\0`)
  inspectLineCount(file, source, context)
  inspectSource(file, source, context)
  try {
    const rendered = await formatter.format(source, {
      ...prettierConfig,
      filepath: resolve(root, file),
    })
    if (rendered !== source)
      fail(context, 'format', file, 1, 'Source differs from pinned Prettier output')
  } catch (error) {
    fail(context, 'format-parse-error', file, error.loc?.start?.line ?? 1, error.message)
  }
}

function inspectLineCount(file, source, context) {
  const lines = physicalLines(source)
  context.lineCounts[file] = lines
  if (lines > 500)
    fail(context, 'file-max-lines', file, 1, `File has ${lines} physical lines (max 500)`)
}

function assertProbe(condition, name) {
  if (!condition) throw new Error(`Quality guard probe failed: ${name}`)
}

function probeStaticGuards() {
  const context = contextFor({ devDependencies: {} })
  inspectLineCount('probe.js', Array(502).fill('x').join('\n'), context)
  assertProbe(
    context.violations.some((item) => item.rule === 'file-max-lines'),
    'overlong file',
  )
  context.violations.length = 0
  const functionSource = [
    'function tooLong() {',
    ...Array(51).fill('  globalThis.value = 1'),
    '}',
  ].join('\n')
  inspectSource('src/shared/probe.js', functionSource, context)
  assertProbe(
    context.violations.some((item) => item.rule === 'function-max-lines'),
    'overlong function',
  )
  const cycles = findCycles([
    { file: 'src/shared/first.js', target: 'src/shared/second.js', kind: 'runtime' },
    { file: 'src/shared/second.js', target: 'src/shared/first.js', kind: 'runtime' },
  ])
  assertProbe(cycles.length === 1, 'runtime import cycle')
  probeBoundaries()
}

function probeBoundaries() {
  const context = {
    root,
    package: { devDependencies: {} },
    packageImports: new Set(),
    imports: [
      {
        file: 'src/shared/lib/index.js',
        line: 1,
        specifier: '../../app/equipment.js',
        kind: 'runtime',
      },
      {
        file: 'src/pages/equipment/index.js',
        line: 2,
        specifier: '../fish/render.js',
        kind: 'runtime',
      },
    ],
    selectedSet: new Set([
      'src/shared/lib/index.js',
      'src/app/equipment.js',
      'src/pages/equipment/index.js',
      'src/pages/fish/render.js',
    ]),
    violations: [],
    edges: [],
  }
  inspectBoundaries(context)
  assertProbe(
    context.violations.some((item) => item.rule === 'fsd-direction'),
    'upward or cross-slice import',
  )
  assertProbe(
    context.violations.some((item) => item.rule === 'fsd-public-api'),
    'private module import',
  )
}

async function probePromiseGuard(eslint) {
  const probeDirectory = mkdtempSync(resolve(root, '.quality-probe-'))
  const badFile = resolve(probeDirectory, 'promise-probe-bad.mjs')
  const goodFile = resolve(probeDirectory, 'promise-probe-good.mjs')
  try {
    writeFileSync(
      badFile,
      'async function work() { await Promise.resolve() }\nwork()\nvoid work()\n',
    )
    writeFileSync(goodFile, 'async function work() { await Promise.resolve() }\nawait work()\n')
    const bad = await eslint.lintFiles([badFile])
    const good = await eslint.lintFiles([goodFile])
    const violations = bad
      .flatMap((item) => item.messages)
      .filter((item) => item.ruleId === '@typescript-eslint/no-floating-promises')
    const allowed = good
      .flatMap((item) => item.messages)
      .filter((item) => item.ruleId === '@typescript-eslint/no-floating-promises')
    assertProbe(violations.length >= 2, 'dropped and voided Promise calls')
    assertProbe(allowed.length === 0, 'awaited Promise call')
  } finally {
    rmSync(probeDirectory, { recursive: true, force: true })
  }
}

async function lintSources(files, context) {
  const scriptFiles = files.filter((file) => /\.(?:[cm]?[jt]s|tsx?)$/.test(file))
  if (!scriptFiles.length) return
  const eslint = new ESLint({
    cwd: root,
    overrideConfigFile: true,
    overrideConfig: [
      js.configs.recommended,
      {
        files: ['**/*.{js,mjs,cjs,ts,tsx}'],
        languageOptions: {
          parser: tseslint.parser,
          parserOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            project: [resolve(root, 'tsconfig.quality.json')],
            tsconfigRootDir: root,
          },
          globals: { ...globals.browser, ...globals.node },
        },
        plugins: { '@typescript-eslint': tseslint.plugin },
        linterOptions: { noInlineConfig: true, reportUnusedDisableDirectives: 'error' },
        rules: {
          'no-unused-vars': 'off',
          '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
          '@typescript-eslint/no-explicit-any': 'error',
          '@typescript-eslint/no-floating-promises': [
            'error',
            { checkThenables: true, ignoreIIFE: false, ignoreVoid: false },
          ],
          'no-debugger': 'error',
        },
      },
    ],
  })
  await probePromiseGuard(eslint)
  const results = await eslint.lintFiles(scriptFiles.map((file) => resolve(root, file)))
  for (const result of results)
    for (const message of result.messages) {
      fail(
        context,
        message.ruleId ?? 'eslint',
        result.filePath.replace(root + '/', ''),
        message.line ?? 1,
        message.message,
      )
    }
}

function report(context, files) {
  const cycles = findCycles(context.edges)
  for (const cycle of cycles)
    fail(context, 'runtime-cycle', cycle[0], 1, `Runtime cycle: ${cycle.join(' -> ')}`)
  const violations = context.violations.sort(
    (a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.rule.localeCompare(b.rule),
  )
  return {
    status: violations.length ? 'FAIL' : 'PASS',
    sourceFiles: files.length,
    functions: context.functionCount,
    runtimeCycles: cycles.length,
    sourceSha256: context.fingerprint.digest('hex'),
    violations,
  }
}

export async function checkCodeQuality() {
  const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
  const context = contextFor(packageJson)
  verifyVersions(context)
  probeStaticGuards()
  const files = sourceFiles(root, context)
  if (!files.some((file) => file.startsWith('src/')))
    fail(context, 'empty-source-scope', 'src', 1, 'No application source files were selected')
  context.selectedSet = new Set(files)
  context.fingerprint = createHash('sha256')
  context.lineCounts = {}
  for (const file of files) await inspectFile(file, context, prettier)
  inspectBoundaries(context)
  await lintSources(files, context)
  return report(context, files)
}

async function main() {
  if (process.argv.length !== 2) {
    console.error('Usage: node scripts/code-quality/check.mjs (no scope, bypass, or fix options)')
    process.exitCode = 2
    return
  }
  try {
    const result = await checkCodeQuality()
    console.log(
      `Source quality ${result.status}: ${result.sourceFiles} files, ${result.functions} functions, ${result.violations.length} violations`,
    )
    for (const item of result.violations)
      console.error(`[${item.rule}] ${item.file}:${item.line} ${item.message}`)
    process.exitCode = result.status === 'PASS' ? 0 : 1
  } catch (error) {
    console.error(`Source quality FAIL: ${error.stack ?? error}`)
    process.exitCode = 1
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url)
  await main()
