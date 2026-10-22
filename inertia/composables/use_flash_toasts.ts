import { watch } from 'vue'
import { usePage } from '@inertiajs/vue3'

/**
 * Display `success` and `error` flash messages shared by the
 * Inertia middleware as Nuxt UI toasts.
 */
export function useFlashToasts() {
  const page = usePage()
  const toast = useToast()

  watch(
    () => page.flash,
    (flash) => {
      if (flash?.error) {
        toast.add({ title: flash.error, color: 'error', icon: 'i-lucide-circle-alert' })
      }
      if (flash?.success) {
        toast.add({ title: flash.success, color: 'success', icon: 'i-lucide-circle-check' })
      }
    },
    { immediate: true }
  )
}
