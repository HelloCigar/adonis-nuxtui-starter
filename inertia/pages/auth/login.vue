<script setup lang="ts">
import * as z from 'zod'
import { useTemplateRef } from 'vue'
import { Head } from '@inertiajs/vue3'
import { Link } from '@adonisjs/inertia/vue'
import type { AuthFormField } from '@nuxt/ui'
import { urlFor } from '~/client'
import AuthLayout from '~/layouts/auth.vue'
import { useInertiaAuthForm, type AuthFormInstance } from '~/composables/use_inertia_auth_form'

defineOptions({ layout: AuthLayout })

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'you@example.com',
    autocomplete: 'username',
    required: true,
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    autocomplete: 'current-password',
    required: true,
  },
]

const schema = z.object({
  email: z.email({ error: 'Invalid email' }),
  password: z.string({ error: 'Password is required' }).min(1, 'Password is required'),
})

type Schema = z.output<typeof schema>

const authForm = useTemplateRef<AuthFormInstance>('authForm')
const { processing, submit } = useInertiaAuthForm<Schema>(urlFor('session.store'), authForm)
</script>

<template>
  <Head title="Sign in" />

  <UAuthForm
    ref="authForm"
    :schema="schema"
    :fields="fields"
    :loading="processing"
    icon="i-lucide-lock"
    title="Welcome back"
    :submit="{ label: 'Sign in', block: true }"
    @submit="submit"
  >
    <template #description>
      Don't have an account?
      <Link route="new_account.create" class="text-primary font-medium">Sign up</Link>.
    </template>
  </UAuthForm>
</template>
