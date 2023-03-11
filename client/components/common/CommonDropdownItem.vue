<script setup lang='ts'>
defineProps<{
  icon?: string
}>()
const emit = defineEmits(['click'])

const { hide } = useDropdownContext() || {}
const el = ref<HTMLDivElement>()

const handleClick = (evt: MouseEvent) => {
  hide?.()
  emit('click', evt)
}
</script>

<template>
  <div
    v-bind="$attrs"
    ref="el"
    class="w-full flex gap-3 items-center px-4 py-3 select-none cursor-pointer hover:bg-primary-dark hover:bg-opacity-5 duration-75"
    @click="handleClick"
  >
    <Icon v-if="icon" :name="icon" size="1.1rem" />
    <div class="flex flex-col">
      <slot />
    </div>
  </div>
</template>
