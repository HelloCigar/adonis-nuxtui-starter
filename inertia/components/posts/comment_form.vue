<script setup lang="ts">
import { ref } from 'vue'
import { usePage } from '@inertiajs/vue3'
import type { Page } from '@inertiajs/core'
import { Form } from '@adonisjs/inertia/vue'
import type { Data } from '@generated/data'

const props = defineProps<{
  post: Data.Post
  comments?: Data.Comment[]
}>()

const page = usePage()
const body = ref('')

/**
 * Text of the comment being saved. The box is only cleared when it still
 * holds that text, so anything typed while saving is kept.
 */
let submitted = ''

/**
 * A rejected comment (e.g. rate limited) comes back as a redirect with an
 * error flash: keep the text so it can be sent again
 */
function onSuccess(response: Page) {
  if (!response.flash.error && body.value === submitted) {
    body.value = ''
  }
}

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
    v-slot="{ errors, processing }"
    route="posts.comments.store"
    :params="{ post_id: props.post.id }"
    :options="{ preserveScroll: true, only: ['comments'] }"
    :optimistic="
      (_, data) => ({ comments: [pendingComment(data.body), ...(props.comments ?? [])] })
    "
    class="flex flex-col gap-2"
    @start="submitted = body"
    @success="onSuccess"
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
    <!-- Stays disabled until the server confirms, so repeated clicks send one comment -->
    <UButton
      type="submit"
      label="Comment"
      class="self-end"
      :disabled="processing || !body.trim()"
    />
  </Form>
</template>
