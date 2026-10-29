<script setup lang="ts">
import { ref } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { Form } from '@adonisjs/inertia/vue'
import type { Data } from '@generated/data'

const props = defineProps<{
  post: Data.Post
  comments?: Data.Comment[]
}>()

const page = usePage()
const body = ref('')

/**
 * Placeholder shown by the optimistic update until the server responds.
 * The `pending-` id marks it as not saved yet (see CommentItem).
 */
function pendingComment(text: string): Data.Comment {
  return {
    id: `pending-${Date.now()}`,
    body: text,
    createdAt: new Date().toISOString(),
    postedAt: 'just now',
    author: page.props.user,
    permissions: { delete: false },
  }
}
</script>

<template>
  <!--
    Optimistic update: the comment shows up as soon as the form is
    submitted. Inertia rolls it back if the server rejects it.

    `only: ['comments']` turns the redirect that follows the submission
    into a partial reload: the post is not fetched again and the
    comments are refreshed in place.
  -->
  <Form
    v-slot="{ errors }"
    route="posts.comments.store"
    :params="{ post_id: props.post.id }"
    :options="{ preserveScroll: true, only: ['comments'] }"
    :optimistic="
      (_, data) => ({ comments: [pendingComment(data.body), ...(props.comments ?? [])] })
    "
    class="flex flex-col gap-2"
    @success="body = ''"
  >
    <UFormField name="body" :error="errors.body">
      <UTextarea
        v-model="body"
        name="body"
        placeholder="Write a comment…"
        :rows="2"
        autoresize
        class="w-full"
      />
    </UFormField>
    <UButton type="submit" label="Comment" class="self-end" :disabled="!body.trim()" />
  </Form>
</template>
