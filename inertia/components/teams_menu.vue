<script setup lang="ts">
import { ref, computed } from 'vue'
import type { DropdownMenuItem } from '@nuxt/ui'

defineProps<{
  collapsed?: boolean
}>()

const teams = ref([
  {
    label: 'AdonisJS',
    avatar: {
      src: 'https://github.com/adonisjs.png',
      alt: 'AdonisJS',
    },
  },
  {
    label: 'Inertia',
    avatar: {
      src: 'https://github.com/inertiajs.png',
      alt: 'Inertia',
    },
  },
  {
    label: 'Nuxt UI',
    avatar: {
      src: 'https://github.com/nuxt.png',
      alt: 'Nuxt UI',
    },
  },
])
const selectedTeam = ref(teams.value[0])

const items = computed<DropdownMenuItem[][]>(() => {
  return [
    teams.value.map((team) => ({
      ...team,
      onSelect() {
        selectedTeam.value = team
      },
    })),
    [
      {
        label: 'Create team',
        icon: 'i-lucide-circle-plus',
      },
      {
        label: 'Manage teams',
        icon: 'i-lucide-cog',
      },
    ],
  ]
})
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <UButton
      v-bind="{
        ...selectedTeam,
        label: collapsed ? undefined : selectedTeam?.label,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :class="[!collapsed && 'py-2']"
      :ui="{
        trailingIcon: 'text-dimmed',
      }"
    />
  </UDropdownMenu>
</template>
