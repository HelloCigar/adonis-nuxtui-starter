import { ref, watch } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { useRouter } from '@adonisjs/inertia/vue'
import { createSharedComposable } from '@vueuse/core'

function dashboardState() {
  const page = usePage()
  const router = useRouter()
  const isNotificationsSlideoverOpen = ref(false)

  defineShortcuts({
    'g-h': () => router.visit({ route: 'dashboard' }),
    'g-i': () => router.visit({ route: 'inbox' }),
    'g-c': () => router.visit({ route: 'customers' }),
    'g-s': () => router.visit({ route: 'settings.general' }),
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
