<script setup lang="ts">
defineEmits<{
  (e: 'deleteAction'): void
}>()
</script>

<template>
  <div class="base-chip">
    <slot />
    <button class="flex items-center" @click="$emit('deleteAction')">
      <Icon name="material-symbols:cancel-outline-rounded" size="1.2rem" />
    </button>
  </div>
</template>
