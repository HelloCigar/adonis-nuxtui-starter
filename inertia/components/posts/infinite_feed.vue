<script setup lang="ts">
import { InfiniteScroll } from '@inertiajs/vue3'
import type { Scroll } from '@adonisjs/inertia/types'
import type { Data } from '@generated/data'
import PostCard from '~/components/posts/post_card.vue'

defineProps<{
  posts: Scroll<Data.Post>
}>()
</script>

<template>
  <!-- Infinite scroll: the next page is fetched and appended as the end comes into view -->
  <InfiniteScroll data="posts" class="flex flex-col gap-4">
    <PostCard v-for="post in posts.data" :key="post.id" :post="post" />

    <template #loading>
      <div class="flex justify-center py-4 text-dimmed">
        <UIcon name="i-lucide-loader-circle" class="size-5 animate-spin" />
      </div>
    </template>
  </InfiniteScroll>
</template>
