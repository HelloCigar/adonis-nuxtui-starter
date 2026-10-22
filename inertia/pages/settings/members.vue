<script setup lang="ts">
import { computed, ref } from 'vue'
import { Head } from '@inertiajs/vue3'
import type { Member } from '~/types/dashboard'
import DashboardLayout from '~/layouts/dashboard.vue'
import SettingsLayout from '~/layouts/settings.vue'
import SettingsMembersList from '~/components/settings/settings_members_list.vue'

defineOptions({ layout: [DashboardLayout, SettingsLayout] })

const props = defineProps<{
  members: Member[]
}>()

const q = ref('')

const filteredMembers = computed(() => {
  return (
    props.members.filter((member) => {
      return (
        member.name.search(new RegExp(q.value, 'i')) !== -1 ||
        member.username.search(new RegExp(q.value, 'i')) !== -1
      )
    }) ?? []
  )
})
</script>

<template>
  <Head title="Members" />

  <div>
    <UPageCard
      title="Members"
      description="Invite new members by email address."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton label="Invite people" color="neutral" class="w-fit lg:ms-auto" />
    </UPageCard>

    <UPageCard
      variant="subtle"
      :ui="{
        container: 'p-0 sm:p-0 gap-y-0',
        wrapper: 'items-stretch',
        header: 'p-4 mb-0 border-b border-default',
      }"
    >
      <template #header>
        <UInput
          v-model="q"
          icon="i-lucide-search"
          placeholder="Search members"
          autofocus
          class="w-full"
        />
      </template>

      <SettingsMembersList :members="filteredMembers" />
    </UPageCard>
  </div>
</template>
