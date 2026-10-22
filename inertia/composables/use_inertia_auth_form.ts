import { ref, type Ref } from 'vue'
import { router } from '@inertiajs/vue3'
import type { FormError, FormSubmitEvent } from '@nuxt/ui'

/**
 * Minimal shape of the <UAuthForm> instance we interact with.
 */
export interface AuthFormInstance {
  formRef?: { setErrors: (errors: FormError[]) => void } | null
}

/**
 * Bridges <UAuthForm> and an AdonisJS endpoint: the validated form data is
 * posted with the Inertia router, and VineJS validation errors returned by
 * the server are displayed on the matching form fields.
 */
export function useInertiaAuthForm<T extends Record<string, any>>(
  url: string,
  authForm: Readonly<Ref<AuthFormInstance | null>>
) {
  const processing = ref(false)

  function submit(event: FormSubmitEvent<T>) {
    router.post(url, event.data, {
      onStart: () => (processing.value = true),
      onFinish: () => (processing.value = false),
      onError: (errors) => {
        authForm.value?.formRef?.setErrors(
          Object.entries(errors).map(([name, message]) => ({ name, message: String(message) }))
        )
      },
    })
  }

  return { processing, submit }
}
