<script setup lang="ts">
import type { Data } from '@generated/data'
import { urlFor } from '~/client'
import type { Paginated } from '~/types'
import PostCard from '~/components/posts/post_card.vue'

defineProps<{
  posts: Paginated<Data.Post>
}>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <PostCard v-for="post in posts.data" :key="post.id" :post="post" />
  </div>

  <!-- Numbered pages: each one is an Inertia visit to ?view=paginated&page=N -->
  <UPagination
    v-if="posts.metadata.lastPage > 1"
    class="mt-8 flex justify-center"
    :page="posts.metadata.currentPage"
    :total="posts.metadata.total"
    :items-per-page="posts.metadata.perPage"
    :to="(page: number) => urlFor('posts.index', {}, { qs: { view: 'paginated', page } })"
  />
</template>
