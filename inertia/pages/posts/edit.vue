<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { Form, Link } from '@adonisjs/inertia/vue'
import type { Data } from '@generated/data'
import PostsLayout from '~/layouts/posts.vue'
import PostFields from '~/components/posts/post_fields.vue'

defineOptions({ layout: PostsLayout })

defineProps<{
  post: Data.Post
}>()
</script>

<template>
  <Head title="Edit post" />

  <UPageHeader title="Edit post" />

  <UPageBody>
    <Form
      v-slot="{ errors, processing }"
      route="posts.update"
      :params="{ id: post.id }"
      class="flex flex-col gap-5"
    >
      <PostFields :errors="errors" :post="post" />

      <div class="flex justify-end gap-2">
        <Link route="posts.show" :params="{ id: post.id }" view-transition>
          <UButton as="span" label="Cancel" color="neutral" variant="ghost" />
        </Link>
        <UButton type="submit" label="Save" :loading="processing" />
      </div>
    </Form>
  </UPageBody>
</template>
