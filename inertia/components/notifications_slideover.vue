<script setup lang="ts">
import { Link } from '@adonisjs/inertia/vue'
import { useFetch, formatTimeAgo } from '@vueuse/core'
import { urlFor } from '~/client'
import { useDashboard } from '~/composables/use_dashboard'
import type { Notification } from '~/types/dashboard'

const { isNotificationsSlideoverOpen } = useDashboard()

const { data: notifications } = useFetch(urlFor('notifications'), { initialData: [] }).json<
  Notification[]
>()
</script>

<template>
  <USlideover v-model:open="isNotificationsSlideoverOpen" title="Notifications">
    <template #body>
      <Link
        v-for="notification in notifications"
        :key="notification.id"
        route="inbox"
        class="px-3 py-2.5 rounded-md hover:bg-elevated/50 flex items-center gap-3 relative -mx-3 first:-mt-3 last:-mb-3"
      >
        <UChip color="error" :show="!!notification.unread" inset>
          <UAvatar v-bind="notification.sender.avatar" :alt="notification.sender.name" size="md" />
        </UChip>

        <div class="text-sm flex-1">
          <p class="flex items-center justify-between">
            <span class="text-highlighted font-medium">{{ notification.sender.name }}</span>

            <time
              :datetime="notification.date"
              class="text-muted text-xs"
              v-text="formatTimeAgo(new Date(notification.date))"
            />
          </p>

          <p class="text-dimmed">
            {{ notification.body }}
          </p>
        </div>
      </Link>
    </template>
  </USlideover>
</template>
