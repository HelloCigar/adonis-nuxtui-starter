import { defineConfig, lazyPlugins } from 'vite-plus'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'
import adonisjs from '@adonisjs/vite/client'
import { theme } from './theme.js'

export default defineConfig({
  lint: {
    plugins: ['oxc', 'typescript', 'unicorn', 'vue'],
    categories: {
      correctness: 'warn',
    },
    env: {
      builtin: true,
    },
    ignorePatterns: [
      'eslint.config.js',
      'eslint.config.ts',
      '*.min.*',
      '*.d.ts',
      'CHANGELOG.md',
      'dist/**',
      'LICENSE*',
      'output/**',
      'coverage/**',
      'temp/**',
      'build/**',
      '.yalc/**',
      'pnpm-lock.yaml',
      'yarn.lock',
      'package-lock.json',
      'inertia/auto-imports.d.ts',
      'inertia/components.d.ts',
      'database/schema.ts',
    ],
    rules: {
      'vue/no-arrow-functions-in-watch': 'error',
      'vue/no-async-in-computed-properties': 'error',
      'vue/no-computed-properties-in-data': 'error',
      'vue/no-deprecated-data-object-declaration': 'error',
      'vue/no-deprecated-delete-set': 'error',
      'vue/no-deprecated-destroyed-lifecycle': 'error',
      'vue/no-deprecated-events-api': 'error',
      'vue/no-deprecated-model-definition': 'error',
      'vue/no-deprecated-props-default-this': 'error',
      'vue/no-deprecated-vue-config-keycodes': 'error',
      'vue/no-dupe-keys': 'error',
      'vue/no-export-in-script-setup': 'error',
      'vue/no-expose-after-await': 'error',
      'vue/no-lifecycle-after-await': 'error',
      'vue/no-reserved-component-names': 'error',
      'vue/no-reserved-keys': 'error',
      'vue/no-reserved-props': 'error',
      'vue/no-shared-component-data': 'error',
      'vue/no-side-effects-in-computed-properties': 'error',
      'vue/no-watch-after-await': 'error',
      'vue/prefer-import-from-vue': 'error',
      'vue/require-prop-type-constructor': 'error',
      'vue/require-render-return': 'error',
      'vue/require-slots-as-functions': 'error',
      'vue/return-in-computed-property': 'error',
      'vue/return-in-emits-validator': 'error',
      'vue/valid-define-emits': 'error',
      'vue/valid-define-options': 'error',
      'vue/valid-define-props': 'error',
      'vue/valid-next-tick': 'error',
      'vue/component-definition-name-casing': 'warn',
      'vue/prop-name-casing': 'warn',
      'vue/require-default-prop': 'warn',
      'vue/require-prop-types': 'warn',
      'vue/no-multiple-slot-args': 'warn',
      'vue/no-required-prop-with-default': 'warn',
      'vite-plus/prefer-vite-plus-imports': 'error',
    },
    overrides: [
      {
        files: ['**/*.ts'],
        rules: {
          'curly': 'off',
          'eqeqeq': ['error', 'always'],
          'no-array-constructor': ['error'],
          'no-caller': ['error'],
          'no-cond-assign': ['error', 'except-parens'],
          'no-constant-condition': ['error'],
          'no-control-regex': ['error'],
          'no-debugger': ['error'],
          'no-duplicate-case': ['error'],
          'no-eval': ['error'],
          'no-ex-assign': ['error'],
          'no-extra-boolean-cast': ['error'],
          'no-fallthrough': ['error'],
          'no-inner-declarations': ['error'],
          'no-invalid-regexp': [
            'error',
            {
              allowConstructorFlags: ['u', 'y'],
            },
          ],
          'no-irregular-whitespace': ['error'],
          'no-new-wrappers': ['error'],
          'no-proto': ['error'],
          'no-regex-spaces': ['error'],
          'no-self-assign': ['error'],
          'no-self-compare': ['error'],
          'no-shadow': 'error',
          'no-sparse-arrays': ['error'],
          'no-this-before-super': ['error'],
          'no-unreachable': ['error'],
          'no-unsafe-finally': ['error'],
          'no-unsafe-negation': ['error'],
          'no-with': ['error'],
          'one-var': ['error', 'never'],
          'use-isnan': ['error'],
          'valid-typeof': [
            'error',
            {
              requireStringLiterals: true,
            },
          ],
          'unicorn/prefer-module': 'error',
          'unicorn/prefer-node-protocol': 'error',
          'unicorn/filename-case': [
            'error',
            {
              case: 'snakeCase',
            },
          ],
          'unicorn/no-await-expression-member': 'error',
          'unicorn/no-instanceof-builtins': 'error',
          'unicorn/prefer-number-properties': 'error',
          'no-unexpected-multiline': 'off',
          'unicorn/empty-brace-spaces': 'off',
          'unicorn/no-nested-ternary': 'off',
          'unicorn/number-literal-case': 'off',
          'arrow-body-style': 'off',
          'prefer-arrow-callback': 'off',
          'typescript/consistent-type-imports': [
            'error',
            {
              fixStyle: 'inline-type-imports',
              disallowTypeAnnotations: false,
            },
          ],
        },
        jsPlugins: [],
      },
      {
        files: ['resources/js/**/*.{ts,vue}', 'inertia/**/*.{ts,vue}'],
        rules: {
          'curly': 'off',
          'eqeqeq': ['error', 'always'],
          'no-array-constructor': ['error'],
          'no-caller': ['error'],
          'no-cond-assign': ['error', 'except-parens'],
          'no-constant-condition': ['error'],
          'no-control-regex': ['error'],
          'no-debugger': ['error'],
          'no-duplicate-case': ['error'],
          'no-eval': ['error'],
          'no-ex-assign': ['error'],
          'no-extra-boolean-cast': ['error'],
          'no-fallthrough': ['error'],
          'no-inner-declarations': ['error'],
          'no-invalid-regexp': [
            'error',
            {
              allowConstructorFlags: ['u', 'y'],
            },
          ],
          'no-irregular-whitespace': ['error'],
          'no-new-wrappers': ['error'],
          'no-proto': ['error'],
          'no-regex-spaces': ['error'],
          'no-self-assign': ['error'],
          'no-self-compare': ['error'],
          'no-shadow': 'error',
          'no-sparse-arrays': ['error'],
          'no-this-before-super': ['error'],
          'no-unreachable': ['error'],
          'no-unsafe-finally': ['error'],
          'no-unsafe-negation': ['error'],
          'no-with': ['error'],
          'one-var': ['error', 'never'],
          'use-isnan': ['error'],
          'valid-typeof': [
            'error',
            {
              requireStringLiterals: true,
            },
          ],
          'unicorn/prefer-module': 'error',
          'unicorn/prefer-node-protocol': 'error',
          'unicorn/filename-case': [
            'error',
            {
              case: 'snakeCase',
            },
          ],
          'unicorn/no-await-expression-member': 'error',
          'unicorn/no-instanceof-builtins': 'error',
          'unicorn/prefer-number-properties': 'error',
          'no-unexpected-multiline': 'off',
          'unicorn/empty-brace-spaces': 'off',
          'unicorn/no-nested-ternary': 'off',
          'unicorn/number-literal-case': 'off',
          'arrow-body-style': 'off',
          'prefer-arrow-callback': 'off',
          'vue/define-emits-declaration': ['error', 'type-based'],
          'vue/define-props-declaration': ['error', 'type-based'],
          'typescript/consistent-type-imports': [
            'error',
            {
              fixStyle: 'inline-type-imports',
              disallowTypeAnnotations: false,
            },
          ],
        },
        jsPlugins: [],
      },
    ],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: 'vite-plus',
        specifier: 'vite-plus/oxlint-plugin',
      },
    ],
  },
  fmt: {
    trailingComma: 'es5',
    semi: false,
    singleQuote: true,
    useTabs: false,
    quoteProps: 'consistent',
    bracketSpacing: true,
    arrowParens: 'always',
    printWidth: 100,
    sortPackageJson: false,
    ignorePatterns: ['.adonisjs', 'node_modules', 'build'],
  },
  plugins: lazyPlugins(() => [
    vue(),
    ui({
      /**
       * Make ULink, UButton, UNavigationMenu, etc. use Inertia's <Link>
       * and read the active state from the current Inertia page.
       */
      router: 'inertia',
      /**
       * Bundle the icons used in the app (from the installed @iconify-json/*
       * collections) instead of fetching them from the Iconify API at runtime.
       */
      icon: {
        clientBundle: {
          scan: true,
        },
      },
      /**
       * Colors and global component overrides, see theme.ts
       */
      ui: theme,
      /**
       * Nuxt UI components (UButton, UDashboardPanel...) and composables
       * (useToast, defineShortcuts...) are auto-imported. Your own components
       * and composables are imported explicitly.
       */
      autoImport: {
        dts: 'inertia/auto-imports.d.ts',
      },
      components: {
        dts: 'inertia/components.d.ts',
        dirs: [],
      },
    }),
    adonisjs({ entryPoints: ['inertia/app.ts'], reload: ['resources/views/**/*.edge'] }),
  ]),

  resolve: {
    alias: {
      '~/': `${import.meta.dirname}/inertia/`,
      '@generated': `${import.meta.dirname}/.adonisjs/client/`,
    },
  },

  server: {
    watch: {
      ignored: ['**/storage/**', '**/tmp/**'],
    },
  },
})
