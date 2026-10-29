import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'
import adonisjs from '@adonisjs/vite/client'
import { theme } from './theme.js'

export default defineConfig({
  plugins: [
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
  ],

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
