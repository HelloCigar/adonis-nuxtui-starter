<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { Link } from '@adonisjs/inertia/vue'
import type { AuthFormField } from '@nuxt/ui'
import AuthLayout from '~/layouts/auth.vue'
import AuthForm from '~/components/auth_form.vue'

defineOptions({ layout: AuthLayout })

/**
 * Validation rules live in `signupValidator` (app/validators/user.ts)
 */
const fields: AuthFormField[] = [
  {
    name: 'fullName',
    type: 'text',
    label: 'Full name',
    placeholder: 'Ada Lovelace',
    autocomplete: 'name',
  },
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'you@example.com',
    autocomplete: 'email',
    required: true,
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'At least 8 characters',
    autocomplete: 'new-password',
    required: true,
  },
  {
    name: 'passwordConfirmation',
    type: 'password',
    label: 'Confirm password',
    placeholder: 'Repeat your password',
    autocomplete: 'new-password',
    required: true,
  },
]
</script>

<template>
  <Head title="Create an account" />

  <AuthForm
    route="new_account.store"
    :fields="fields"
    icon="i-lucide-user-plus"
    title="Create your account"
    :submit="{ label: 'Create account' }"
    :reset-on-error="['password', 'passwordConfirmation']"
  >
    <template #description>
      Already have an account?
      <Link route="session.create" class="text-primary font-medium">Sign in</Link>.
    </template>
  </AuthForm>
</template>
