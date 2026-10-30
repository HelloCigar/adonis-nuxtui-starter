# AdonisJS + Nuxt UI starter kit

A full-stack starter built from the official [AdonisJS](https://docs.adonisjs.com) Inertia + Vue starter kit, with the frontend replaced by the [Nuxt UI dashboard template](https://github.com/nuxt-ui-templates/dashboard-vue) (Vue, no Nuxt).

This branch adds a small **posts and comments app** that shows off the Inertia 3 features from the [AdonisJS Inertia 5 announcement](https://adonisjs.com/blog/adonisjs-inertia-5): instant visits, optimistic updates, infinite scroll and deferred props. See [Posts demo](#posts-demo).

- **Backend:** AdonisJS 7, Lucid ORM (PostgreSQL, UUID keys), session auth, VineJS validation, Bouncer policies
- **Frontend:** Inertia 3 + Vue 3, Nuxt UI 4 (Tailwind CSS 4), Tuyau typed routes
- **Auth:** login and signup pages built with an `AuthForm` component (Nuxt UI's `UAuthForm` ported to the AdonisJS `<Form>`), validated on the server with VineJS

## Getting started

Requires Node.js 24 or later and a PostgreSQL server.

Create a role and a database for the app (pick your own password):

```sh
psql -U postgres -c "CREATE ROLE adonis_nuxtui LOGIN PASSWORD 'change-me'"
psql -U postgres -c "CREATE DATABASE adonis_nuxtui OWNER adonis_nuxtui"
```

Then install, configure and seed:

```sh
npm install
cp .env.example .env      # set DB_PASSWORD to the password above
node ace generate:key
node ace migration:run
node ace db:seed
npm run dev
```

Open http://localhost:3333 to browse the posts feed, then sign in as `ada@example.com`, `alan@example.com` or `grace@example.com` (password `password`), or create an account, to write posts and comment. The dashboard template is still at `/dashboard`.

## Scripts

| Command                           | Description                                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------------------------- |
| `npm run dev`                     | Start the dev server with HMR                                                                     |
| `npm run build`                   | Build for production into `build/`                                                                |
| `npm run typecheck`               | Type-check the backend (`tsc`) and frontend (`vue-tsc`)                                           |
| `npm run lint`                    | Lint with the AdonisJS ESLint config                                                              |
| `node ace codegen`                | Regenerate `.adonisjs/` types (routes, pages, controllers) without starting the server            |
| `node ace migration:fresh --seed` | Drop every table, migrate again and reseed the demo data                                          |
| `npm run railway:setup`           | Create a Railway project with PostgreSQL and deploy (see [Deploy to Railway](#deploy-to-railway)) |

## Posts demo

A standalone app at `/posts` (its own layout, separate from the dashboard) where anyone can read posts and comments, and signed-in users write posts and comment on them. Each Inertia feature is something the user can feel:

| Feature           | Where                                                                                                       | What the user sees                                                                              |
| ----------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Infinite scroll   | `inertia.scroll()` in `PostsController.index`, `<InfiniteScroll>` in `pages/posts/index.vue`                | The next page of the feed loads as the end comes into view, and `?page=` follows along          |
| Instant visits    | `<Link instant component="..." :page-props>` in `post_card.vue`, `post_actions.vue` and the "New post" link | The post, create and edit pages render immediately from data already on screen                  |
| Deferred props    | `inertia.defer(..., { rescue: true })` in `PostsController.show`, `<Deferred>` in `pages/posts/show.vue`    | The post shows first, its comments load right after behind a skeleton, with a retry on failure  |
| Optimistic update | `<Form :optimistic>` in `comment_form.vue` and `comment_item.vue`                                           | A comment appears (dimmed) or disappears as soon as it is submitted, and rolls back if rejected |

A few details worth knowing:

- **Artificial delays.** `PostsController` sleeps for up to a second in `show`, `create`, `edit`, the deferred comments and every feed page after the first, otherwise the features are hard to notice on a local database. Remove the `sleep` calls (or revert the "Add artificial delays" commit) for real use.
- **Partial reloads.** The comment forms submit with `only: ['comments']`, so the redirect that follows only refreshes the comments in place: the post is not fetched again and the deferred skeleton does not flash.
- **Shared props on instant visits.** `page-props` uses the callback form, `(_, shared) => ({ ...shared, post })`, so shared props like the signed-in user stay on screen during the instant render. The object form replaces them.
- **Ownership.** `PostPolicy` and `CommentPolicy` (Bouncer) only let authors edit or delete their own posts and comments. The transformers send the outcome as `permissions` on each row, which the pages use to show or hide the buttons.
- **No double posting.** The Comment button stays disabled until the server confirms, and the `commentsThrottle` limiter (`start/limiter.ts`, `@adonisjs/limiter` with the database store) allows 5 comments per user per minute. Over the limit, the exception handler turns the 429 into an error toast for Inertia requests, the optimistic comment rolls back and the text stays in the box.
- **Adonis components only.** Every link and form uses `Link` and `Form` from `@adonisjs/inertia/vue`, so route names, params and form fields are type-checked. Nuxt UI layout components (`UHeader`, `UPageHeader`, `UBlogPost`, `UUser`...) are filled through their slots rather than their own `to`/`links` props, which would go through the untyped Inertia link.

## Project layout

```
app/
  controllers/          Inertia controllers (posts, comments, inbox, customers, members, notifications, auth)
  models/               Lucid models; shared.ts holds the withUuidPrimaryKey() mixin
  policies/             Bouncer policies (post and comment ownership)
  transformers/         Shape models into page props, including per-row permissions
  validators/           VineJS validators
  services/demo/        Demo data for the dashboard template. Replace with real queries.
database/
  migrations/           Schema (UUID primary and foreign keys)
  factories/            User, post and comment factories (Faker)
  seeders/              Demo authors, posts and comments built from the factories
inertia/
  app.ts, ssr.ts        Inertia entrypoints, register the Nuxt UI Vue plugin
  css/app.css           Tailwind + Nuxt UI, fonts, color ramps and design tokens
  root.vue              Wraps every page in <UApp> and turns flash messages into toasts
  layouts/
    posts.vue           Header + centered column for the posts demo (UHeader, UMain)
    dashboard.vue       Sidebar + search + notifications (UDashboardGroup)
    settings.vue        Settings tabs, nested inside the dashboard layout
    auth.vue            Centered card for login/signup
  pages/                One Vue file per Inertia page
  components/           Dashboard template components, and posts/ for the posts demo
  composables/          use_dashboard (shortcuts), use_flash_toasts
  types/dashboard.d.ts  Types shared by pages and controllers
start/routes.ts         All routes. Reading posts is public; writing and the dashboard need the auth middleware.
theme.ts                Nuxt UI colors and global component overrides (used by vite.config.ts)
```

## How it fits together

- **Routing:** AdonisJS owns routing. Pages pick their layout with `defineOptions({ layout: DashboardLayout })` (settings pages use `[DashboardLayout, SettingsLayout]`), so the sidebar persists across navigations. Everything references named routes from `start/routes.ts` and is type-checked: `<Link route="...">` for links, `useRouter()` from `@adonisjs/inertia/vue` for programmatic visits and form posts (`router.post({ route: 'session.store' }, data)`, which also types the request body against the route's validator), and `urlFor('...')` for the plain URLs that Nuxt UI menu items need.
- **Nuxt UI + Inertia:** `vite.config.ts` sets `router: 'inertia'`, which makes `ULink`, `UButton` and `UNavigationMenu` render Inertia links and compute their active state from the current page URL.
- **Auto-imports:** Nuxt UI components (`UButton`, `UDashboardPanel`, ...) and composables (`useToast`, `defineShortcuts`, ...) are auto-imported. Your own components and composables are imported explicitly.
- **Icons:** Lucide icons are bundled at build time from `@iconify-json/lucide` (`icon.clientBundle.scan`), so nothing is fetched from the Iconify API at runtime. Install another `@iconify-json/*` collection to use its icons.
- **Auth forms:** `inertia/components/auth_form.vue` is a port of Nuxt UI's `UAuthForm` built on the AdonisJS `<Form>` component. It keeps the same look, props (`fields`, `providers`, `submit`...) and slots (`header`, `description`, `<name>-field`, `<name>-error`, `validation`, `submit`, `footer`...), but posts to a named route (`route="session.store"`) with no client-side schema: VineJS errors from the server are shown under the matching fields, and `reset-on-error` clears fields like passwords. Invalid credentials and other flash errors show up as toasts.
- **Flash messages:** `use_flash_toasts` listens to Inertia's `flash` event, which fires once per visit, so a message is not shown again when the page is refreshed by a partial reload such as deferred props.
- **Page props:** controllers pass props with `inertia.render('page', props)`, and `npm run typecheck` checks them against each page's `defineProps`. Keep prop types as JSON-friendly `type` aliases (see `inertia/types/dashboard.d.ts`), because interfaces don't satisfy the serializable-props constraint.
- **Theme:** the UI follows [antfu's design system](https://github.com/antfu/design) and is applied entirely through Nuxt UI theming, so components need no one-off classes. `inertia/css/app.css` registers the antfu green ramp and DM Sans / DM Mono (self-hosted with `@fontsource`), and maps antfu's semantic tokens onto Nuxt UI's CSS variables: translucent gray surfaces and borders that work in both modes, mostly muted text, `#111` dark background, and a 4px radius. `theme.ts` assigns the semantic colors (`primary: 'antfu'`...) and sets global slot overrides, such as frosted-glass menus, popovers and tooltips. Numbers, ids and dates use `font-mono`, which also turns on tabular figures. To rebrand, edit the ramp and tokens in `app.css` or point `colors.primary` at another Tailwind color.
- **Color mode:** handled by `@vueuse/core`'s `useColorMode` (Light/Dark is in the user menu). `resources/views/inertia_layout.edge` applies the saved mode before first paint.

## Database

PostgreSQL, configured through the `DB_*` variables in `.env` (validated in `start/env.ts`). `config/database.ts` keeps the other drivers, SQLite included, as commented-out connections: install the driver package and point `connection` at it to switch.

- **UUID keys.** Users, posts and comments use UUID primary keys generated by the app. Compose the mixin from `app/models/shared.ts` into a model, `compose(PostSchema, withUuidPrimaryKey())`, and declare the column as `table.uuid('id').primary()`. Because UUIDs are random, order lists by `created_at` rather than `id`.
- **Seeding.** `node ace db:seed` creates the three demo authors and 45 posts with comments from the factories in `database/factories/`. It does nothing once the demo authors exist, so it is safe to run again. `node ace migration:fresh --seed` starts over.
- **Schema types.** `database/schema.ts` is regenerated from the database after every migration; the models extend the classes in it.

## Deploy to Railway

The app ships as a Docker image (`Dockerfile`) that [Railway](https://railway.com) builds and runs. With the [Railway CLI](https://docs.railway.com/cli) installed, one command creates everything and deploys:

```sh
npm run railway:setup             # empty app
npm run railway:setup -- --seed   # with the demo authors and posts
```

`scripts/railway_setup.sh`:

1. creates a project with a PostgreSQL database and a `web` service,
2. configures the service to build from the `Dockerfile`, run `node ace migration:run --force` before each deploy and health-check `/login`,
3. generates an `APP_KEY` and sets the service variables (the `DB_*` ones reference the database, e.g. `${{Postgres.PGHOST}}`),
4. waits for the database to publish its variables, deploys the current directory and generates a public `*.up.railway.app` URL.

The build and deploy settings live on the service rather than in a `railway.json`, because Railway no longer reads Config as Code for new services. Change them in the dashboard or with `railway environment edit`. After the setup, deploy changes with:

```sh
railway up --service web
```

Things to know:

- **AdonisJS Plus token.** `@adonisplus/flow` installs from the private AdonisJS Plus registry, so the build needs your registry token. The script reads it from `ADONISPLUS_NPM_TOKEN` or your `~/.npmrc` and stores it as a service variable, which Railway passes to the Dockerfile as a build argument. It is only used by the install stages and does not end up in the final image.
- **Demo data.** `--seed` sets `SEED_DEMO_DATA=true`, which seeds on every deploy (a no-op once seeded). The demo accounts share the password `password`, so anyone can sign in as them on a public URL.
- **Artificial delays** are still in `PostsController`, which is intended for a demo. Remove them for anything real.
- **Build locally.** `docker build --build-arg ADONISPLUS_NPM_TOKEN=<token> -t adonis-nuxtui-starter .` produces the same image.
