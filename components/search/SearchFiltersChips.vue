<script setup lang="ts">
defineProps<{
  chipName: string
}>()
defineEmits<{
  (e: 'deleteAction'): void
}>()
</script>

<template>
  <CommonTooltip lacement="bottom" :content="chipName">
    <div class="base-chip">
      <span class="max-w-[150px] inline-block overflow-hidden whitespace-nowrap text-ellipsis"> {{ chipName }}</span>
      <button class="flex items-center" @click="$emit('deleteAction')">
        <Icon name="material-symbols:cancel-outline-rounded" size="1.2rem" />
      </button>
    </div>
  </CommonTooltip>
</template>
