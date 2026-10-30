<script setup lang="ts">
import { Form, Link } from '@adonisjs/inertia/vue'
import type { Data } from '@generated/data'

/**
 * Edit and delete buttons, shown only to the author of the post
 * (permissions are computed by PostPolicy in the transformer)
 */
defineProps<{
  post: Data.Post
}>()

function confirmDelete() {
  return confirm('Delete this post?')
}
</script>

<template>
  <Link
    v-if="post.permissions.update"
    route="posts.edit"
    :params="{ id: post.id }"
    instant
    view-transition
    component="posts/edit"
    :page-props="(_, shared) => ({ ...shared, post })"
  >
    <UButton as="span" icon="i-lucide-pencil" label="Edit" color="neutral" variant="outline" />
  </Link>

  <Form
    v-if="post.permissions.delete"
    v-slot="{ processing }"
    route="posts.destroy"
    :params="{ id: post.id }"
    :options="{ viewTransition: true }"
    @before="confirmDelete"
  >
    <UButton
      type="submit"
      icon="i-lucide-trash"
      label="Delete"
      color="error"
      variant="soft"
      :loading="processing"
    />
  </Form>
</template>
