<script setup lang="ts">
import { Form } from '@adonisjs/inertia/vue'
import type { Data } from '@generated/data'

defineProps<{
  comment: Data.Comment
  comments: Data.Comment[]
}>()
</script>

<template>
  <div class="flex items-start gap-2" :class="{ 'opacity-50': comment.id.startsWith('pending-') }">
    <UUser
      :name="comment.author?.fullName ?? comment.author?.email"
      :avatar="{ text: comment.author?.initials }"
      class="flex-1 items-start"
    >
      <template #description>
        <span class="text-xs text-dimmed">{{ comment.postedAt }}</span>
        <span class="mt-1 block text-sm text-default whitespace-pre-line">
          {{ comment.body }}
        </span>
      </template>
    </UUser>

    <!-- Optimistic update: the comment disappears before the server confirms -->
    <Form
      v-if="comment.permissions.delete"
      route="posts.comments.destroy"
      :params="{ id: comment.id }"
      :options="{ preserveScroll: true, only: ['comments'] }"
      :optimistic="() => ({ comments: comments.filter((other) => other.id !== comment.id) })"
    >
      <UButton
        type="submit"
        icon="i-lucide-x"
        color="neutral"
        variant="ghost"
        size="xs"
        aria-label="Delete comment"
      />
    </Form>
  </div>
</template>
