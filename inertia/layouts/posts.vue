<script setup lang="ts">
import { usePage } from '@inertiajs/vue3'
import { Form, Link } from '@adonisjs/inertia/vue'

/**
 * Standalone layout for the posts app, independent from the dashboard.
 * The left slot replaces UHeader's default title link so navigation
 * goes through the route-aware AdonisJS <Link>.
 */
const page = usePage()
</script>

<template>
  <UHeader :toggle="false" :ui="{ container: 'max-w-2xl' }">
    <template #left>
      <Link
        route="posts.index"
        view-transition
        class="flex items-center gap-2 text-xl font-bold text-highlighted"
      >
        <UIcon name="i-lucide-newspaper" class="size-5 text-primary" />
        Posts
      </Link>
    </template>

    <template #right>
      <UColorModeButton />

      <template v-if="page.props.user">
        <UUser
          :name="page.props.user.fullName ?? page.props.user.email"
          :avatar="{ text: page.props.user.initials }"
          size="sm"
          class="hidden sm:flex"
        />

        <Form route="session.destroy">
          <UButton
            type="submit"
            icon="i-lucide-log-out"
            color="neutral"
            variant="ghost"
            aria-label="Log out"
          />
        </Form>
      </template>

      <!-- Guests can read everything; writing needs an account -->
      <template v-else>
        <Link route="session.create">
          <UButton as="span" label="Sign in" color="neutral" variant="ghost" />
        </Link>
        <Link route="new_account.create">
          <UButton as="span" label="Sign up" />
        </Link>
      </template>
    </template>
  </UHeader>

  <UMain>
    <UContainer class="max-w-2xl">
      <slot />
    </UContainer>
  </UMain>
</template>
