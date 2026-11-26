/**
 * Runs the AdonisJS Plus Flow ast-grep rules inside oxlint.
 *
 * `@adonisjs/eslint-ast-grep` builds an ESLint plugin plus one flat-config
 * entry per rule (with `files` and `ignores`). oxlint overrides have no
 * `ignores`, so this wrapper applies each rule's own `files`/`ignores`
 * itself and the rules are enabled for every TypeScript file in
 * `.oxlintrc.json`.
 */
import { matchesGlob, relative } from 'node:path'
import { astGrep } from '@adonisjs/eslint-ast-grep'

const NAMESPACE = 'flow'
const [{ plugins }, ...entries] = astGrep('@adonisplus/flow/rules', { namespace: NAMESPACE })
const { meta, rules } = plugins[NAMESPACE]

function matchesAny(file, patterns) {
  return patterns.some((pattern) => matchesGlob(file, pattern))
}

function scoped(id, rule) {
  const entry = entries.find(({ name }) => name === `${NAMESPACE}/${id}`)
  return {
    ...rule,
    create(context) {
      const file = relative(context.cwd, context.filename).split('\\').join('/')
      if (!matchesAny(file, entry.files) || matchesAny(file, entry.ignores)) {
        return {}
      }
      return rule.create(context)
    },
  }
}

export default {
  meta: { ...meta, name: 'oxlint-flow-rules' },
  rules: Object.fromEntries(Object.entries(rules).map(([id, rule]) => [id, scoped(id, rule)])),
}
