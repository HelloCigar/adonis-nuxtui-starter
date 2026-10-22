import { ref, watch } from 'vue'
import { router, usePage } from '@inertiajs/vue3'
import { createSharedComposable } from '@vueuse/core'
import { urlFor } from '~/client'

function dashboardState() {
  const page = usePage()
  const isNotificationsSlideoverOpen = ref(false)

  defineShortcuts({
    'g-h': () => router.visit(urlFor('dashboard')),
    'g-i': () => router.visit(urlFor('inbox')),
    'g-c': () => router.visit(urlFor('customers')),
    'g-s': () => router.visit(urlFor('settings.general')),
    'n': () => (isNotificationsSlideoverOpen.value = !isNotificationsSlideoverOpen.value),
  })

  watch(
    () => page.url,
    () => {
      isNotificationsSlideoverOpen.value = false
    }
  )

  return {
    isNotificationsSlideoverOpen,
  }
}

export const useDashboard = createSharedComposable(dashboardState)
