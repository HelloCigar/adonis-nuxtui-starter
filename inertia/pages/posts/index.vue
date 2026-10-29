<script setup lang="ts">
import { Head, InfiniteScroll } from '@inertiajs/vue3'
import { Link } from '@adonisjs/inertia/vue'
import type { Scroll } from '@adonisjs/inertia/types'
import type { Data } from '@generated/data'
import PostsLayout from '~/layouts/posts.vue'
import PostCard from '~/components/posts/post_card.vue'

defineOptions({ layout: PostsLayout })

defineProps<{
  posts: Scroll<Data.Post>
}>()
</script>

<template>
  <Head title="Posts" />

  <UPageHeader title="Latest posts" description="What everyone has been writing about.">
    <template #links>
      <!-- Instant visit: the empty form renders before the server answers -->
      <Link
        route="posts.create"
        instant
        component="posts/create"
        :page-props="(_, shared) => ({ ...shared })"
      >
        <UButton as="span" icon="i-lucide-plus" label="New post" />
      </Link>
    </template>
  </UPageHeader>

  <UPageBody>
    <UEmpty
      v-if="!posts.data.length"
      icon="i-lucide-newspaper"
      title="No posts yet"
      description="Be the first to write something."
    />

    <!-- Infinite scroll: the next page is fetched and appended as the end comes into view -->
    <InfiniteScroll v-else data="posts" class="flex flex-col gap-4">
      <PostCard v-for="post in posts.data" :key="post.id" :post="post" />

      <template #loading>
        <div class="flex justify-center py-4 text-dimmed">
          <UIcon name="i-lucide-loader-circle" class="size-5 animate-spin" />
        </div>
      </template>
    </InfiniteScroll>
  </UPageBody>
</template>
