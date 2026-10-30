<script setup lang="ts">
import { Deferred, Head, router } from '@inertiajs/vue3'
import { Link } from '@adonisjs/inertia/vue'
import type { Data } from '@generated/data'
import PostsLayout from '~/layouts/posts.vue'
import PostActions from '~/components/posts/post_actions.vue'
import CommentForm from '~/components/posts/comment_form.vue'
import CommentItem from '~/components/posts/comment_item.vue'
import CommentsSkeleton from '~/components/posts/comments_skeleton.vue'

defineOptions({ layout: PostsLayout })

defineProps<{
  post: Data.Post
  comments?: Data.Comment[]
}>()

function reloadComments() {
  router.reload({ only: ['comments'] })
}
</script>

<template>
  <Head :title="post.title" />

  <UPageHeader :title="post.title" :ui="{ links: 'flex-nowrap shrink-0' }">
    <template #headline>
      <Link route="posts.index" view-transition class="flex items-center gap-1 hover:text-default">
        <UIcon name="i-lucide-arrow-left" class="size-4" />
        All posts
      </Link>
    </template>

    <template #description>
      <UUser
        :name="post.author?.fullName ?? post.author?.email"
        :description="post.postedAt"
        :avatar="{ text: post.author?.initials }"
      />
    </template>

    <template #links>
      <PostActions :post="post" />
    </template>
  </UPageHeader>

  <UPageBody>
    <p class="whitespace-pre-line">{{ post.body }}</p>

    <USeparator />

    <section class="flex flex-col gap-4">
      <h2 class="font-semibold text-highlighted">Comments</h2>

      <CommentForm :post="post" :comments="comments" />

      <!-- Deferred props: the comments are fetched after the post has rendered -->
      <Deferred data="comments">
        <template #fallback>
          <CommentsSkeleton />
        </template>

        <template #rescue="{ reloading }">
          <UAlert
            color="error"
            variant="subtle"
            icon="i-lucide-circle-alert"
            title="Comments could not be loaded"
            :actions="[{ label: 'Retry', loading: reloading, onClick: reloadComments }]"
          />
        </template>

        <p v-if="!comments?.length" class="text-sm text-dimmed">No comments yet.</p>

        <CommentItem
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          :comments="comments ?? []"
        />
      </Deferred>
    </section>
  </UPageBody>
</template>
