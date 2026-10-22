<script setup lang="ts">
import { watchEffect } from 'vue'
import { useColorMode } from '@vueuse/core'
import { useFlashToasts } from '~/composables/use_flash_toasts'

/**
 * Wraps every Inertia page. <UApp> provides toasts, tooltips and overlays
 * to all Nuxt UI components, and flash messages from the server are
 * turned into Nuxt UI toasts.
 */
const colorMode = useColorMode()

watchEffect(() => {
  if (typeof document === 'undefined') return
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', colorMode.value === 'dark' ? '#18181b' : '#ffffff')
})

useFlashToasts()
</script>

<template>
  <UApp>
    <slot />
  </UApp>
</template>
