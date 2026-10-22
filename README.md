# AdonisJS + Nuxt UI starter kit

A full-stack starter built from the official [AdonisJS](https://docs.adonisjs.com) Inertia + Vue starter kit, with the frontend replaced by the [Nuxt UI dashboard template](https://github.com/nuxt-ui-templates/dashboard-vue) (Vue, no Nuxt).

- **Backend:** AdonisJS 7, Lucid ORM (SQLite), session auth, VineJS validation
- **Frontend:** Inertia 3 + Vue 3, Nuxt UI 4 (Tailwind CSS 4), Tuyau typed routes
- **Auth:** login and signup pages built with `UAuthForm`, validated on the client with Zod and on the server with VineJS

## Getting started

Requires Node.js 24 or later.

```sh
npm install
cp .env.example .env
node ace generate:key
node ace migration:run
npm run dev
```

Open http://localhost:3333, create an account, and you land on the dashboard.

## Scripts

| Command             | Description                                                                            |
| ------------------- | -------------------------------------------------------------------------------------- |
| `npm run dev`       | Start the dev server with HMR                                                          |
| `npm run build`     | Build for production into `build/`                                                     |
| `npm run typecheck` | Type-check the backend (`tsc`) and frontend (`vue-tsc`)                                |
| `npm run lint`      | Lint with the AdonisJS ESLint config                                                   |
| `node ace codegen`  | Regenerate `.adonisjs/` types (routes, pages, controllers) without starting the server |

## Project layout

```
app/
  controllers/          Inertia controllers (inbox, customers, members, notifications, auth)
  services/demo/        Demo data for the dashboard template. Replace with real queries.
inertia/
  app.ts, ssr.ts        Inertia entrypoints, register the Nuxt UI Vue plugin
  root.vue              Wraps every page in <UApp> and turns flash messages into toasts
  layouts/
    dashboard.vue       Sidebar + search + notifications (UDashboardGroup)
    settings.vue        Settings tabs, nested inside the dashboard layout
    auth.vue            Centered card for login/signup
  pages/                One Vue file per Inertia page
  components/           Dashboard template components
  composables/          use_dashboard (shortcuts), use_inertia_auth_form, use_flash_toasts
  types/dashboard.d.ts  Types shared by pages and controllers
start/routes.ts         All routes. Dashboard routes are behind the auth middleware.
```

## How it fits together

- **Routing:** AdonisJS owns routing. Pages pick their layout with `defineOptions({ layout: DashboardLayout })` (settings pages use `[DashboardLayout, SettingsLayout]`), so the sidebar persists across navigations. Links use `urlFor('route.name')` or `<Link route="...">` from `@adonisjs/inertia/vue`, so they are type-checked against `start/routes.ts`.
- **Nuxt UI + Inertia:** `vite.config.ts` sets `router: 'inertia'`, which makes `ULink`, `UButton` and `UNavigationMenu` render Inertia links and compute their active state from the current page URL.
- **Auto-imports:** Nuxt UI components (`UButton`, `UDashboardPanel`, ...) and composables (`useToast`, `defineShortcuts`, ...) are auto-imported. Your own components and composables are imported explicitly.
- **Icons:** Lucide icons are bundled at build time from `@iconify-json/lucide` (`icon.clientBundle.scan`), so nothing is fetched from the Iconify API at runtime. Install another `@iconify-json/*` collection to use its icons.
- **Auth forms:** `useInertiaAuthForm` posts the `UAuthForm` data with the Inertia router and maps VineJS errors back onto the form fields. Invalid credentials and other flash errors show up as toasts.
- **Page props:** controllers pass props with `inertia.render('page', props)`, and `npm run typecheck` checks them against each page's `defineProps`. Keep prop types as JSON-friendly `type` aliases (see `inertia/types/dashboard.d.ts`), because interfaces don't satisfy the serializable-props constraint.
- **Color mode:** handled by `@vueuse/core`'s `useColorMode` (Light/Dark is in the user menu). `resources/views/inertia_layout.edge` applies the saved mode before first paint.

## Database

SQLite by default (`tmp/db.sqlite3`). To switch, update `config/database.ts` and `.env`, then run `node ace migration:run`.
