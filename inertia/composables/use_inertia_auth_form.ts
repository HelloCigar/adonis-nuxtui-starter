import { ref, type Ref } from 'vue'
import type { FormError } from '@nuxt/ui'
import type { VisitOptions } from '@inertiajs/core'

/**
 * Minimal shape of the <UAuthForm> instance we interact with.
 */
export interface AuthFormInstance {
  formRef?: { setErrors: (errors: FormError[]) => void } | null
}

/**
 * Bridges <UAuthForm> and an AdonisJS endpoint. Pass the returned `visitOptions`
 * to a `useRouter()` visit: they track the request state and display the VineJS
 * validation errors returned by the server on the matching form fields.
 *
 * @example
 * const router = useRouter()
 * router.post({ route: 'session.store' }, event.data, visitOptions)
 */
export function useInertiaAuthForm(authForm: Readonly<Ref<AuthFormInstance | null>>) {
  const processing = ref(false)

  const visitOptions = {
    onStart: () => {
      processing.value = true
    },
    onFinish: () => {
      processing.value = false
    },
    onError: (errors) => {
      authForm.value?.formRef?.setErrors(
        Object.entries(errors).map(([name, message]) => ({ name, message: String(message) }))
      )
    },
  } satisfies Partial<VisitOptions>

  return { processing, visitOptions }
}
