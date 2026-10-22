<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NavigationMenuItem } from '@nuxt/ui'
import { urlFor } from '~/client'
import UserMenu from '~/components/user_menu.vue'
import TeamsMenu from '~/components/teams_menu.vue'
import NotificationsSlideover from '~/components/notifications_slideover.vue'

const open = ref(false)

function close() {
  open.value = false
}

/**
 * Sidebar navigation. Add an entry here for every new area of your app.
 * URLs are generated from named AdonisJS routes, so renaming a route
 * path never breaks the sidebar.
 */
const links = [
  [
    {
      label: 'Home',
      icon: 'i-lucide-house',
      to: urlFor('dashboard'),
      onSelect: close,
    },
    {
      label: 'Inbox',
      icon: 'i-lucide-inbox',
      to: urlFor('inbox'),
      badge: '4',
      onSelect: close,
    },
    {
      label: 'Customers',
      icon: 'i-lucide-users',
      to: urlFor('customers'),
      onSelect: close,
    },
    {
      label: 'Settings',
      to: urlFor('settings.general'),
      icon: 'i-lucide-settings',
      defaultOpen: true,
      type: 'trigger',
      children: [
        {
          label: 'General',
          to: urlFor('settings.general'),
          exact: true,
          onSelect: close,
        },
        {
          label: 'Members',
          to: urlFor('settings.members'),
          onSelect: close,
        },
        {
          label: 'Notifications',
          to: urlFor('settings.notifications'),
          onSelect: close,
        },
        {
          label: 'Security',
          to: urlFor('settings.security'),
          onSelect: close,
        },
      ],
    },
  ],
  [
    {
      label: 'Documentation',
      icon: 'i-lucide-book-open',
      to: 'https://docs.adonisjs.com',
      target: '_blank',
    },
    {
      label: 'Nuxt UI',
      icon: 'i-lucide-info',
      to: 'https://ui.nuxt.com/docs/getting-started/installation/vue',
      target: '_blank',
    },
  ],
] satisfies NavigationMenuItem[][]

const groups = computed(() => [
  {
    id: 'links',
    label: 'Go to',
    items: links.flat(),
  },
])
</script>

<template>
  <UDashboardGroup unit="rem" storage="local">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <TeamsMenu :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <slot />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
