<script setup lang='ts'>
withDefaults(defineProps<{
  own?: boolean
  name: string
  message: string
  showName?: boolean
}>(), {
  showName: true,
})
</script>

<template>
  <div class="w-full mb-[2px] flex flex-col" :class="[own ? 'items-end' : 'items-start']">
    <div v-if="showName" class="mx-1 capitalize">
      {{ name }}
    </div>
    <div class="px-4 py-2 rounded-xl max-w-[65%] break-all" :class="[own ? 'bg-base-orange text-white' : 'bg-light-gray']">
      {{ message }}
    </div>
  </div>
</template>
