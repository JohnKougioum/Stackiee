<script setup lang='ts'>
defineProps<{
  body: string
}>()
</script>

<template>
  <component :is="contentToVNode(body)" />
</template>
