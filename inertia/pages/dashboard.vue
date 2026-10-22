<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { sub } from 'date-fns'
import { Head } from '@inertiajs/vue3'
import type { DropdownMenuItem } from '@nuxt/ui'
import { urlFor } from '~/client'
import { useDashboard } from '~/composables/use_dashboard'
import type { Period, Range } from '~/types/dashboard'
import DashboardLayout from '~/layouts/dashboard.vue'
import HomeStats from '~/components/home/home_stats.vue'
import HomeSales from '~/components/home/home_sales.vue'
import HomePeriodSelect from '~/components/home/home_period_select.vue'
import HomeDateRangePicker from '~/components/home/home_date_range_picker.vue'
import HomeChart from '~/components/home/home_chart.vue'

defineOptions({ layout: DashboardLayout })

const { isNotificationsSlideoverOpen } = useDashboard()

const items = [
  [
    {
      label: 'New mail',
      icon: 'i-lucide-send',
      to: urlFor('inbox'),
    },
    {
      label: 'New customer',
      icon: 'i-lucide-user-plus',
      to: urlFor('customers'),
    },
  ],
] satisfies DropdownMenuItem[][]

const range = shallowRef<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date(),
})
const period = ref<Period>('daily')
</script>

<template>
  <Head title="Home" />

  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UTooltip text="Notifications" :shortcuts="['N']">
            <UButton
              color="neutral"
              variant="ghost"
              square
              @click="isNotificationsSlideoverOpen = true"
            >
              <UChip color="error" inset>
                <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
              </UChip>
            </UButton>
          </UTooltip>

          <UDropdownMenu :items="items">
            <UButton icon="i-lucide-plus" size="md" class="rounded-full" />
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <!-- NOTE: The `-ms-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
          <HomeDateRangePicker v-model="range" class="-ms-1" />

          <HomePeriodSelect v-model="period" :range="range" />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <HomeStats :period="period" :range="range" />
      <HomeChart :period="period" :range="range" />
      <HomeSales :period="period" :range="range" />
    </template>
  </UDashboardPanel>
</template>
