<script setup lang="ts">
import { computed } from 'vue'
import { Head, usePage } from '@inertiajs/vue3'
import { Link, useRouter } from '@adonisjs/inertia/vue'
import type { TabsItem } from '@nuxt/ui'
import type { Scroll } from '@adonisjs/inertia/types'
import type { Data } from '@generated/data'
import type { Paginated } from '~/types'
import PostsLayout from '~/layouts/posts.vue'
import InfiniteFeed from '~/components/posts/infinite_feed.vue'
import PaginatedFeed from '~/components/posts/paginated_feed.vue'

defineOptions({ layout: PostsLayout })

/**
 * The controller sends `posts` for the infinite feed or `paginatedPosts`
 * for numbered pages, depending on `view`
 */
const props = defineProps<{
  view: 'infinite' | 'paginated'
  posts?: Scroll<Data.Post>
  paginatedPosts?: Paginated<Data.Post>
}>()

const page = usePage()
const router = useRouter()

const views = [
  { label: 'Infinite', value: 'infinite', icon: 'i-lucide-infinity' },
  { label: 'Paginated', value: 'paginated', icon: 'i-lucide-list-ordered' },
] satisfies TabsItem[]

/**
 * Each tab is a query string on the feed (`?view=paginated`, nothing for
 * infinite scroll), validated by listPostsValidator. Switching starts over
 * from the first page.
 */
function switchView(view: string | number) {
  router.visit({ route: 'posts.index', qs: view === 'paginated' ? { view: 'paginated' } : {} })
}

/**
 * No posts at all. A page past the last one is not empty: it keeps the
 * pagination to go back.
 */
const isEmpty = computed(() =>
  props.paginatedPosts ? props.paginatedPosts.metadata.total === 0 : !props.posts?.data.length
)
</script>

<template>
  <Head title="Posts" />

  <UPageHeader title="Latest posts" description="What everyone has been writing about.">
    <template #links>
      <!-- Instant visit: the empty form renders before the server answers -->
      <Link
        v-if="page.props.user"
        route="posts.create"
        instant
        view-transition
        component="posts/create"
        :page-props="(_, shared) => ({ ...shared })"
      >
        <UButton as="span" icon="i-lucide-plus" label="New post" />
      </Link>
    </template>
  </UPageHeader>

  <UPageBody>
    <UTabs
      :items="views"
      :model-value="view"
      :content="false"
      class="w-full sm:w-auto sm:self-start"
      @update:model-value="switchView"
    />

    <UEmpty
      v-if="isEmpty"
      icon="i-lucide-newspaper"
      title="No posts yet"
      description="Be the first to write something."
    />

    <InfiniteFeed v-else-if="posts" :posts="posts" />
    <PaginatedFeed v-else-if="paginatedPosts" :posts="paginatedPosts" />
  </UPageBody>
</template>
