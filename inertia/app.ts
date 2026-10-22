import './css/app.css'
import ui from '@nuxt/ui/vue-plugin'
import { client } from '~/client'
import { createInertiaApp } from '@inertiajs/vue3'
import { TuyauProvider } from '@adonisjs/inertia/vue'
import { createApp, type DefineComponent, h } from 'vue'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import Root from '~/root.vue'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) => {
    return resolvePageComponent(
      `./pages/${name}.vue`,
      import.meta.glob<DefineComponent>('./pages/**/*.vue')
    )
  },
  setup({ el, App, props, plugin }) {
    createApp({
      render: () =>
        h(TuyauProvider, { client }, { default: () => h(Root, null, () => h(App, props)) }),
    })
      .use(plugin)
      .use(ui)
      .mount(el)
  },
  progress: {
    color: 'var(--ui-primary)',
  },
})
