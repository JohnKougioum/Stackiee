<script setup lang="ts">
defineProps<{
  hideUserIcon?: boolean
}>()
</script>

<template>
  <div class="flex flex-col gap-2 px-4 py-3 border-b-[1px] border-secondary-gray">
    <div class="flex gap-4 animate-pulse">
      <div v-if="!hideUserIcon">
        <div class="w-12 h-12 rounded-full bg-primary-gray" />
      </div>
      <div class="flex flex-col flex-1 gap-2 pb-2">
        <div class="h-5 w-20 rounded bg-primary-gray" />
        <div class="h-4 w-full rounded bg-primary-gray" />
        <div class="h-4 w-4/5 rounded bg-primary-gray" />
        <div class="h-4 w-2/5 rounded bg-primary-gray" />
      </div>
    </div>
  </div>
</template>
