<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
</script>

<template>
  <Head title="Server error" />

  <UError
    :error="{
      statusCode: 500,
      statusMessage: 'Something went wrong',
      message: 'The server hit an unexpected error. Please try again in a moment.',
    }"
    redirect="/"
  />
</template>
