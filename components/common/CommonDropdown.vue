<script setup lang="ts">
import { InjectionKeyDropdownContext } from '~/constants/symbols'

defineProps<{
  placement?: string
  autoBoundaryMaxSize?: boolean
}>()

const dropdown = ref<any>()
const hide = () => dropdown.value.hide()
provide(InjectionKeyDropdownContext, {
  hide,
})

defineExpose({
  hide,
})
</script>

<template>
  <VDropdown
    v-bind="$attrs"
    ref="dropdown"
    :placement="placement || 'auto'"
    :auto-boundary-max-size="autoBoundaryMaxSize"
  >
    <slot />
    <template #popper="scope">
      <slot name="popper" v-bind="scope" />
    </template>
  </VDropdown>
</template>
