<script setup lang='ts'>
import type { Popper as VTooltipType } from 'floating-vue/dist'

export interface Props extends Partial<typeof VTooltipType> {
  content?: string
}

defineProps<Props>()
</script>

<template>
  <VTooltip
    v-bind="$attrs"
    auto-hide
  >
    <slot />
    <template #popper>
      <div text-3>
        <slot name="popper">
          {{ content }}
        </slot>
      </div>
    </template>
  </VTooltip>
</template>
