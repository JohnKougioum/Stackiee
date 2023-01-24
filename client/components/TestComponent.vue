<script setup lang='ts'>
// @ts-expect-error missing types
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
defineProps<{
  items: Array<any>
}>()
</script>

<template>
  <DynamicScroller
    class="scoller"
    :items="items"
    :min-item-size="200"
    key-field="_id"
    page-mode
  >
    <template #default="{ item, index, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :size-dependencies="[
          item.body,
        ]"
        :data-index="index"
      >
        <div class="py-2 border-b-2">
          <div class="flex justify-between">
            <span class="text-lg">
              {{ item.user }}
            </span>
            <span class="text-sm">
              {{ item.createdAt }}
            </span>
          </div>
          <h1>
            {{ item.title }}
          </h1>
          <p class="text-xl pt-4 pb-1">
            {{ item.body }}
          </p>
        </div>
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
  <slot name="anchor" />
</template>
