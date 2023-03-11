<script setup lang="ts">
const router = useRouter()
const back = ref<any>('')

onMounted(() => {
  back.value = router.options.history.state.back
})

router.afterEach(() => {
  back.value = router.options.history.state.back
})
</script>

<template>
  <div class="flex justify-between sticky top-0 bg-base z-[1] py-4">
    <NuxtLink
      class="flex items-end gap-3 py2 px-5 text-2xl select-none focus-visible:ring-2 focus-visible:ring-primary-gray"
      to="/"
      @click.prevent="$scrollToTop"
    >
      S
    </NuxtLink>
    <div
      class="hidden xl:flex items-center me mt-2"
      :class="{
        'pointer-events-none opacity-0': !back || back === '/' || back.startsWith('/login/auth'),
        'xl:flex': $route.name !== 'tag',
      }"
    >
      <NuxtLink
        aria-label="Go Back"
        @click="$router.go(-1)"
      >
        <Icon name="ri:arrow-left-line" />
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.me{
  margin-inline-end: 2rem;
}
</style>
