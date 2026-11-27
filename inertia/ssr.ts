import ui from '@nuxt/ui/vue-plugin'
import { client } from '~/client'
import { createHead } from '@unhead/vue/server'
import { createInertiaApp } from '@inertiajs/vue3'
import { TuyauProvider } from '@adonisjs/inertia/vue'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, h, type DefineComponent } from 'vue'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import Root from '~/root.vue'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

export default async function render(page: any) {
  /**
   * Nuxt UI writes its color variables to the document head. In the browser it
   * creates that head itself; on the server it uses this one, installed before
   * the plugin, and the rendered tags go into the SSR head below.
   * https://ui.nuxt.com/docs/getting-started/integrations/ssr
   */
  const head = createHead()

  const app = await createInertiaApp({
    page,
    title: (title) => (title ? `${title} - ${appName}` : appName),
    render: renderToString,
    resolve: (name) => {
      return resolvePageComponent(
        `./pages/${name}.vue`,
        import.meta.glob<DefineComponent>('./pages/**/*.vue', { eager: true })
      )
    },
    setup: ({ App, props, plugin }) => {
      return createSSRApp({
        render: () =>
          h(TuyauProvider, { client }, { default: () => h(Root, null, () => h(App, props)) }),
      })
        .use(plugin)
        .use(head)
        .use(ui)
    },
  })

  app.head.push(head.render().headTags)

  return app
}
