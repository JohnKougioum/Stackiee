<script setup lang='ts'>
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
  <div ref="container" :class="containerClass">
    <div class="sticky top-0 z-10 backdrop-blur bg-base bg-opacity-70">
      asdfasd
    </div>
    <div class="m-auto" :class="isHydrated && wideLayout ? 'xl:w-full sm:max-w-600px' : 'sm:max-w-600px md:shrink-0'">
      <slot />
    </div>
  </div>
</template>
