<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { Form, Link } from '@adonisjs/inertia/vue'
import PostsLayout from '~/layouts/posts.vue'
import PostFields from '~/components/posts/post_fields.vue'

defineOptions({ layout: PostsLayout })
</script>

<template>
  <Head title="New post" />

  <UPageHeader title="New post" />

  <UPageBody>
    <Form v-slot="{ errors, processing }" route="posts.store" class="flex flex-col gap-5">
      <PostFields :errors="errors" />

      <div class="flex justify-end gap-2">
        <Link route="posts.index" view-transition>
          <UButton as="span" label="Cancel" color="neutral" variant="ghost" />
        </Link>
        <UButton type="submit" label="Publish" :loading="processing" />
      </div>
    </Form>
  </UPageBody>
</template>
