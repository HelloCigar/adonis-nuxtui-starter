<template>
  <div v-for="i in 3" :key="i" class="flex gap-2">
    <USkeleton class="size-8 rounded-full" />
    <div class="flex-1 space-y-2">
      <USkeleton class="h-3 w-32" />
      <USkeleton class="h-3 w-full" />
    </div>
  </div>
</template>
