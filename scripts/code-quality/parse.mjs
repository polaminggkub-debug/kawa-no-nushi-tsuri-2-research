import ts from 'typescript'
import postcss from 'postcss'
import { fail } from './files.mjs'

function record(context, file, line, specifier, kind = 'runtime') {
  context.imports.push({ file, line, specifier, kind })
}

function inspectCall(node, file, ast, context) {
  if (!ts.isCallExpression(node)) return
  const value = node.arguments[0]
  const literal =
    value && (ts.isStringLiteralLike(value) || ts.isNoSubstitutionTemplateLiteral(value))
  const line = ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1
  if (
    node.expression.kind === ts.SyntaxKind.ImportKeyword ||
    (ts.isIdentifier(node.expression) && node.expression.text === 'require')
  ) {
    if (literal) record(context, file, line, value.text)
    else fail(context, 'nonliteral-import', file, line, 'Use a literal import path')
  }
  if (
    ts.isPropertyAccessExpression(node.expression) &&
    node.expression.expression.getText(ast) === 'import.meta' &&
    node.expression.name.text === 'glob'
  ) {
    fail(context, 'import-glob', file, line, 'Import globs bypass the checked source graph')
  }
}

function importKind(node) {
  const clause = node.importClause
  return clause?.isTypeOnly || node.isTypeOnly ? 'type' : 'runtime'
}

function scanScript(file, source, context) {
  const kind = file.endsWith('.tsx')
    ? ts.ScriptKind.TSX
    : file.endsWith('.ts')
      ? ts.ScriptKind.TS
      : ts.ScriptKind.JS
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, kind)
  for (const issue of ast.parseDiagnostics) {
    const line = ast.getLineAndCharacterOfPosition(issue.start ?? 0).line + 1
    fail(
      context,
      'parse-error',
      file,
      line,
      ts.flattenDiagnosticMessageText(issue.messageText, '\n'),
    )
  }
  inspectNodes(ast, file, context)
  return ast
}

function inspectNodes(ast, file, context) {
  function visit(node) {
    const line = ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1
    if (ts.isFunctionLike(node) && node.body) {
      const end =
        ast.getLineAndCharacterOfPosition(Math.max(node.getStart(ast), node.end - 1)).line + 1
      context.functionCount += 1
      if (end - line + 1 > 50)
        fail(
          context,
          'function-max-lines',
          file,
          line,
          `Function spans ${end - line + 1} lines (max 50)`,
        )
    }
    if (node.kind === ts.SyntaxKind.AnyKeyword)
      fail(context, 'explicit-any', file, line, 'Replace explicit any')
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteralLike(node.moduleSpecifier)
    ) {
      record(context, file, line, node.moduleSpecifier.text, importKind(node))
    }
    if (
      ts.isImportTypeNode(node) &&
      ts.isLiteralTypeNode(node.argument) &&
      ts.isStringLiteralLike(node.argument.literal)
    ) {
      record(context, file, line, node.argument.literal.text, 'type')
    }
    inspectCall(node, file, ast, context)
    ts.forEachChild(node, visit)
  }
  visit(ast)
}

function inspectCss(file, source, context) {
  try {
    postcss.parse(source, { from: file }).walkAtRules('import', (rule) => {
      const match = rule.params.match(/^(?:url\(\s*)?(?:"([^"]+)"|'([^']+)'|([^\s)]+))/)
      const specifier = match?.[1] ?? match?.[2] ?? match?.[3]
      if (!specifier)
        fail(
          context,
          'nonliteral-import',
          file,
          rule.source?.start?.line ?? 1,
          'CSS import must be literal',
        )
      else record(context, file, rule.source?.start?.line ?? 1, specifier)
    })
  } catch (error) {
    fail(context, 'parse-error', file, error.line ?? 1, error.message)
  }
}

function inspectHtml(file, source, context) {
  for (const match of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    const attrs = match[1],
      body = match[2].trim()
    const type = attrs.match(/\btype\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase()
    const external = /\bsrc\s*=\s*["'][^"']+["']/i.test(attrs)
    if (body && !external && type !== 'application/ld+json') {
      const line = source.slice(0, match.index).split(/\r\n|\r|\n/).length
      fail(
        context,
        'inline-script',
        file,
        line,
        'Executable scripts belong in an imported source module',
      )
    }
  }
  for (const match of source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)) {
    const line = source.slice(0, match.index).split(/\r\n|\r|\n/).length
    if (match[1].trim())
      fail(context, 'inline-style', file, line, 'Styles belong in imported CSS source files')
  }
}

export function inspectSource(file, source, context) {
  const suppressions = [
    new RegExp(['@ts-', '(?:ignore|nocheck|expect-error)\\b'].join('')),
    new RegExp(['eslint-', '(?:disable|enable)\\b'].join('')),
    new RegExp(['prettier-', 'ignore\\b'].join('')),
  ]
  const lines = source.split(/\r\n|\r|\n/)
  const lineIndex = lines.findIndex((line) => suppressions.some((pattern) => pattern.test(line)))
  if (lineIndex >= 0) {
    fail(
      context,
      'suppression-directive',
      file,
      lineIndex + 1,
      'Suppressions are not allowed in authored source',
    )
  }
  if (file.endsWith('.css')) inspectCss(file, source, context)
  else if (file.endsWith('.html')) inspectHtml(file, source, context)
  else scanScript(file, source, context)
}
