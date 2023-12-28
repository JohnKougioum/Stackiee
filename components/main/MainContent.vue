<script setup lang='ts'>
defineProps<{
  back?: boolean
  fullHeight?: boolean
}>()

const container = ref()
const route = useRoute()
const { height: windowHeight } = useWindowSize()
const { height: containerHeight } = useElementBounding(container)
const wideLayout = computed(() => route.meta.wideLayout ?? false)
const sticky = computed(() => route.path?.startsWith('/settings/'))
const containerClass = computed(() => {
  if (!isHydrated.value || !sticky.value || (windowHeight.value < containerHeight.value))
    return null
  return 'lg:sticky lg:top-0'
})
</script>

<template>
  <div ref="container" :class="{ containerClass, 'h-full': fullHeight }">
    <div class="sticky top-0 z-10 backdrop-blur bg-base bg-opacity-70 border-b-[1px]">
      <div class="flex justify-between px-5 py-2" :class="{ 'xl:hidden': $route.name !== 'tag' }">
        <div class="flex gap-3 items-center py-2 w-full">
          <NuxtLink
            v-if="back"
            :aria-label="$t('back')"
            @click="$router.go(-1)"
          >
            <Icon name="ri:arrow-left-line" size="1.3rem" class="timeline-title cursor-pointer" />
          </NuxtLink>
          <div class="flex w-full">
            <slot name="title" />
          </div>
          <div class="sm:hidden h-7 w-[1px]" />
        </div>
      </div>
    </div>
    <div :class="{ 'xl:block': $route.name !== 'tag' }" class="hidden h-6" />
    <div
      class="m-auto"
      :class="[
        isHydrated && wideLayout ? 'w-full sm:max-w-600px' : 'sm:max-w-600px md:shrink-0',
        { 'h-[calc(100%-60px)] xl:h-[calc(100%-30px)]': fullHeight }]"
    >
      <slot />
    </div>
  </div>
</template>
