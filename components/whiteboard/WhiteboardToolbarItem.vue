<script setup lang='ts'>
defineProps<{
  icon: string
  size: string
}>()
</script>

<template>
  <div class="cursor-pointer p-2 rounded-lg hover:bg-orange-100 duration-75">
    <Icon :name="icon" :size="size" />
  </div>
</template>
