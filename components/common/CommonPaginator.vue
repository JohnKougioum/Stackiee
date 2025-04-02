<script setup lang='ts'>
// @ts-expect-error missing types
import { DynamicScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const props = defineProps<{
  items: Array<any>
  pending: boolean
  nextPage: boolean
  hideUserIcon?: boolean
  minSize?: number
}>()

const { pending, nextPage } = toRefs(props)

const page = defineModel<number>('page')

const { endAnchor } = usePaginator(page, pending, nextPage)
const minItemSize = computed(() => props.minSize || 200)
</script>

<template>
  <DynamicScroller
    v-slot="{ item, active, index }"
    class="scoller"
    :items="items"
    :min-item-size="minItemSize"
    key-field="id"
    page-mode
  >
    <slot
      :item="item"
      :index="index"
      :active="active"
    />
  </DynamicScroller>
  <div ref="endAnchor" />
  <TimelineSkeleton v-if="pending" :hide-user-icon="hideUserIcon" />
  <div v-if="!pending && !nextPage" class="p-4 text-center text-xl">
    <slot name="end-message">
      {{ $t('noMorePosts') }}
    </slot>
  </div>
</template>
