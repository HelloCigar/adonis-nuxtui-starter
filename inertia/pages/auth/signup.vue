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

/**
 * Mirrors `signupValidator` in app/validators/user.ts for instant feedback.
 * The server remains the source of truth (e.g. for the unique email check).
 */
const schema = z
  .object({
    fullName: z.string().optional(),
    email: z.email({ error: 'Invalid email' }),
    password: z
      .string({ error: 'Password is required' })
      .min(8, 'Must be at least 8 characters')
      .max(32, 'Must be at most 32 characters'),
    passwordConfirmation: z.string({ error: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  })

type Schema = z.output<typeof schema>

const authForm = useTemplateRef<AuthFormInstance>('authForm')
const { processing, submit } = useInertiaAuthForm<Schema>(urlFor('new_account.store'), authForm)
</script>

<template>
  <Head title="Create an account" />

  <UAuthForm
    ref="authForm"
    :schema="schema"
    :fields="fields"
    :loading="processing"
    icon="i-lucide-user-plus"
    title="Create your account"
    :submit="{ label: 'Create account', block: true }"
    @submit="submit"
  >
    <template #description>
      Already have an account?
      <Link route="session.create" class="text-primary font-medium">Sign in</Link>.
    </template>
  </UAuthForm>
</template>
