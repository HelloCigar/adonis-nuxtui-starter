/**
 * ESLint lints the Vue single-file components. oxlint (`.oxlintrc.json`) lints
 * every file, but its JS plugins only see the `<script>` blocks of a `.vue`
 * file, so rules that read `<template>` run here with the Vue parser.
 *
 * - Vize runs its Vue rules once per file through its ESLint entry, without the
 *   `oxlint-vize` wrapper and its extra oxlint passes.
 * - Nuxt UI checks Tailwind classes against the theme in `inertia/css/app.css`.
 *   https://ui.nuxt.com/docs/getting-started/integrations/eslint/vue
 */
import { defineConfig, globalIgnores } from 'eslint/config'
import pluginVue from 'eslint-plugin-vue'
import ts from 'typescript-eslint'
import nuxtUI from '@nuxt/ui/eslint'
import vize from 'oxlint-plugin-vize/eslint'
import { theme } from './theme.ts'

export default defineConfig(
  globalIgnores(['inertia/auto-imports.d.ts', 'inertia/components.d.ts']),
  pluginVue.configs['flat/base'],
  {
    files: ['inertia/**/*.ts', 'theme.ts'],
    languageOptions: { parser: ts.parser },
  },
  {
    files: ['inertia/**/*.vue'],
    languageOptions: { parserOptions: { parser: ts.parser } },
    plugins: { vize },
    settings: { vize: { preset: 'incremental' } },
    rules: {
      'vize/vue/attribute-order': 'warn',
      'vize/vue/sfc-element-order': ['error', { order: ['script', 'template', 'style'] }],
      'vize/vue/attribute-hyphenation': 'warn',
      'vize/vue/comment-directive': 'error',
      'vize/vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vize/vue/jsx-uses-vars': 'error',
      'vize/vue/no-child-content': 'error',
      'vize/vue/no-deprecated-filter': 'error',
      'vize/vue/no-deprecated-functional-template': 'error',
      'vize/vue/no-deprecated-html-element-is': 'error',
      'vize/vue/no-deprecated-inline-template': 'error',
      'vize/vue/no-deprecated-router-link-tag-prop': 'error',
      'vize/vue/no-deprecated-scope-attribute': 'error',
      'vize/vue/no-deprecated-slot-attribute': 'error',
      'vize/vue/no-deprecated-slot-scope-attribute': 'error',
      'vize/vue/no-deprecated-v-bind-sync': 'error',
      'vize/vue/no-deprecated-v-is': 'error',
      'vize/vue/no-deprecated-v-on-native-modifier': 'error',
      'vize/vue/no-deprecated-v-on-number-modifiers': 'error',
      'vize/vue/no-dupe-v-else-if': 'error',
      'vize/vue/no-duplicate-attributes': 'error',
      'vize/vue/no-lone-template': 'warn',
      'vize/vue/no-mutating-props': 'error',
      'vize/vue/no-template-key': 'error',
      'vize/vue/no-template-shadow': 'warn',
      'vize/vue/no-textarea-mustache': 'error',
      'vize/vue/no-unused-components': 'error',
      'vize/vue/no-unused-vars': 'error',
      'vize/vue/no-use-v-if-with-v-for': 'error',
      'vize/vue/no-useless-template-attributes': 'error',
      'vize/vue/no-v-for-template-key-on-child': 'error',
      'vize/vue/no-v-html': 'warn',
      'vize/vue/no-v-text-v-html-on-component': 'error',
      'vize/vue/require-component-is': 'error',
      'vize/vue/require-toggle-inside-transition': 'error',
      'vize/vue/require-v-for-key': 'error',
      'vize/vue/this-in-template': 'warn',
      'vize/vue/use-v-on-exact': 'error',
      'vize/vue/v-bind-style': 'warn',
      'vize/vue/v-on-event-hyphenation': ['warn', 'always', { autofix: true }],
      'vize/vue/v-on-style': 'warn',
      'vize/vue/v-slot-style': 'warn',
      'vize/vue/valid-attribute-name': 'error',
      'vize/vue/valid-template-root': 'error',
      'vize/vue/valid-v-bind': 'error',
      'vize/vue/valid-v-cloak': 'error',
      'vize/vue/valid-v-else': 'error',
      'vize/vue/valid-v-else-if': 'error',
      'vize/vue/valid-v-for': 'error',
      'vize/vue/valid-v-html': 'error',
      'vize/vue/valid-v-if': 'error',
      'vize/vue/valid-v-is': 'error',
      'vize/vue/valid-v-memo': 'error',
      'vize/vue/valid-v-model': 'error',
      'vize/vue/valid-v-on': 'error',
      'vize/vue/valid-v-once': 'error',
      'vize/vue/valid-v-pre': 'error',
      'vize/vue/valid-v-show': 'error',
      'vize/vue/valid-v-slot': 'error',
      'vize/vue/valid-v-text': 'error',
      'vize/script/no-deprecated-dollar-listeners-api': 'error',
      'vize/script/no-deprecated-dollar-scopedslots-api': 'error',
      'vize/script/no-ref-as-operand': 'error',
      'vize/script/no-use-computed-property-like-method': 'error',
      'vize/script/one-component-per-file': 'warn',
      'vize/script/order-in-components': 'warn',
      'vize/script/require-explicit-emits': 'warn',
      'vize/script/require-valid-default-prop': 'error',
    },
  },
  nuxtUI({
    entryPoint: 'inertia/css/app.css',
    files: ['inertia/**/*.{vue,ts}', 'theme.ts'],
    colors: theme.colors,
  })
)
