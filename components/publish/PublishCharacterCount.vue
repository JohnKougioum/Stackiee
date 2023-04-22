<script setup lang='ts'>
defineProps<{
  max: number
  characterCount: number
}>()
</script>

<template>
  <div class="text-right" :class="{ 'text-red-500': characterCount > max }">
    {{ characterCount ?? 0 }}<span text-secondary-light>/</span><span text-secondary-light>{{ max }}</span>
  </div>
</template>
