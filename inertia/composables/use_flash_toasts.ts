import { onMounted, onUnmounted } from 'vue'
import { router, usePage } from '@inertiajs/vue3'

/**
 * Display `success` and `error` flash messages shared by the
 * Inertia middleware as Nuxt UI toasts.
 *
 * Listening to Inertia's `flash` event (rather than watching `page.flash`)
 * shows each message once: the event does not fire again for partial
 * reloads such as deferred props, which keep the same flash on the page.
 */
export function useFlashToasts() {
  const page = usePage()
  const toast = useToast()

  function show(flash: typeof page.flash) {
    if (flash?.error) {
      toast.add({ title: flash.error, color: 'error', icon: 'i-lucide-circle-alert' })
    }
    if (flash?.success) {
      toast.add({ title: flash.success, color: 'success', icon: 'i-lucide-circle-check' })
    }
  }

  let stop: (() => void) | undefined

  onMounted(() => {
    stop = router.on('flash', (event) => show(event.detail.flash))
  })

  onUnmounted(() => stop?.())
}
