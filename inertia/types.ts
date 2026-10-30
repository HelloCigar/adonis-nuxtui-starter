import type { Data } from '@generated/data'

/**
 * Bridge the shared props and flash data inferred from the Inertia
 * middleware into the Inertia client, so `usePage().props`, `usePage().flash`,
 * and layout callbacks are typed globally without passing a generic at each
 * call site.
 */
declare module '@inertiajs/core' {
  interface InertiaConfig {
    sharedPageProps: Data.SharedProps
    flashDataType: Data.FlashMessages
  }
}

/**
 * Shape of a prop built with `Transformer.paginate(rows, paginator.getMeta())`
 */
export type Paginated<T> = {
  data: T[]
  metadata: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
    firstPage: number
    firstPageUrl: string
    lastPageUrl: string
    nextPageUrl: string | null
    previousPageUrl: string | null
  }
}
