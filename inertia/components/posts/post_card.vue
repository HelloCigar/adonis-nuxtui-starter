<script setup lang="ts">
import { Link } from '@adonisjs/inertia/vue'
import type { Data } from '@generated/data'

defineProps<{
  post: Data.Post
}>()
</script>

<template>
  <!--
    Instant visit: the post page renders right away from the data already
    on screen, while its comments load in the background. The callback form
    keeps shared props (the signed-in user) on screen.
  -->
  <Link
    route="posts.show"
    :params="{ id: post.id }"
    instant
    view-transition
    component="posts/show"
    :page-props="(_, shared) => ({ ...shared, post })"
    class="block"
  >
    <UBlogPost
      :title="post.title"
      :description="post.body"
      :authors="[
        {
          name: post.author?.fullName ?? post.author?.email,
          avatar: { text: post.author?.initials },
        },
      ]"
      :badge="{ label: String(post.commentsCount), icon: 'i-lucide-message-circle' }"
      variant="outline"
      class="transition-colors hover:bg-elevated/50"
      :ui="{ description: 'line-clamp-2' }"
    >
      <template #date>{{ post.postedAt }}</template>
    </UBlogPost>
  </Link>
</template>
