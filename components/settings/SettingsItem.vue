<script setup lang='ts'>
const props = defineProps<{
  to: string | Record<string, string>
  match?: boolean
  icon: string
  text: string
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    :class="match ? 'text-base-orange' : ''"
    class="block w-full group focus:outline-none"
    @click="to ? $scrollToTop() : undefined"
  >
    <div
      class="w-full flex px-5 py-3 md:gap-2 gap-4 items-center
    transition duration-200 group-hover:bg-secondary-gray group-focus-visible:ring-2"
    >
      <div class="flex-1 flex items-center md:gap-2 gap-4">
        <Icon :name="icon" size="1.5rem" />
        <span class="font-medium">{{ text }}</span>
      </div>
      <div>
        <Icon name="ri:arrow-right-s-line" size="1.5rem" />
      </div>
    </div>
  </NuxtLink>
</template>
