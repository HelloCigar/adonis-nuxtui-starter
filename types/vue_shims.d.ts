/**
 * `node ace build` type-checks the backend with plain `tsc`, which cannot read
 * `.vue` files. Without this shim, page props referenced from
 * `.adonisjs/server/pages.d.ts` resolve to an error type and every
 * `inertia.render()` call that passes props fails to compile.
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, any>>
  export default component
}
