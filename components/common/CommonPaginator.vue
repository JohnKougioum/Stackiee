<script setup lang='ts'>
// @ts-expect-error missing types
import { DynamicScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const props = defineProps<{
  items: Array<any>
  pending: boolean
  nextPage: boolean
}>()

const { pending, nextPage } = toRefs(props)

const page = defineModel<number>('page')

const { endAnchor } = usePaginator(page, pending, nextPage)
</script>

<template>
  <DynamicScroller
    v-slot="{ item, active, index }"
    class="scoller"
    :items="items"
    :min-item-size="200"
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
  <TimelineSkeleton v-if="pending" />
  <div v-if="!pending && !nextPage" class="p-4 text-center text-xl">
    {{ $t('noMorePosts') }}
  </div>
</template>
