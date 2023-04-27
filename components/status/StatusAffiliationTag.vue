<script setup lang='ts'>
defineProps<{
  affiliation: string
}>()
</script>

<template>
  <div class="bg-secondary-gray rounded-xl px-1 text-sm select-none capitalize">
    {{ affiliation }}
  </div>
</template>
