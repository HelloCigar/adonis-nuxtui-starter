<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
</script>

<template>
  <Head title="Page not found" />

  <UError
    :error="{
      statusCode: 404,
      statusMessage: 'Page not found',
      message: 'The page you are looking for does not exist.',
    }"
    redirect="/"
  />
</template>
