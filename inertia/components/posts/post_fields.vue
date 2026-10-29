<script setup lang="ts">
import type { Data } from '@generated/data'

/**
 * Title and body fields of the create and edit forms. Rendered inside a
 * <Form>, which submits them by name and passes back the server errors.
 */
defineProps<{
  errors: { title?: string; body?: string }
  post?: Data.Post
}>()
</script>

<template>
  <UFormField label="Title" name="title" :error="errors.title" required>
    <UInput name="title" :default-value="post?.title" class="w-full" autofocus />
  </UFormField>

  <UFormField label="Body" name="body" :error="errors.body" required>
    <UTextarea name="body" :default-value="post?.body" :rows="8" autoresize class="w-full" />
  </UFormField>
</template>
