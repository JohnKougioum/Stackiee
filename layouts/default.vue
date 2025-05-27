<script setup lang="ts">
const route = useRoute()

const wideLayout = computed(() => route.meta.wideLayout ?? false)
</script>

<template>
  <div class="h-full">
    <main class="flex w-full mx-auto lg:max-w-[80rem]">
      <aside class="hidden relative sm:flex w-[12.5%] md:w-1/6 lg:w-1/5 xl:w-1/4 justify-end margin-inline-4">
        <div class="sticky top-0 w-20 xl:w-[25rem] h-screen flex flex-col items-center">
          <div class="flex flex-col overflow-y-auto justify-between h-full w-full max-w-full mt-5">
            <NavTitle />
            <NavSide />
            <div class="flex-auto" />
            <div class="flex flex-col stricky bottom-0">
              <div class="p-6 pb-8 w-full">
                <UserSignedInCard />
              </div>
            </div>
          </div>
        </div>
      </aside>
      <div class="w-full min-h-screen border-base" :class="isHydrated && wideLayout ? 'xl:w-full sm:w-[600px] lg:w-[800px]' : 'sm:w-[600px] md:shrink-0'">
        <div class="min-h-[calc(100vh-3.5rem)] sm:min-h-screen">
          <slot />
        </div>
        <div class="sticky left-0 right-0 bottom-0 z-10 bg-base padding-transition">
          <!-- TODO: maybe add offline checker here -->
          <NavBottom v-if="isHydrated" class="sm:hidden" />
        </div>
      </div>
      <aside v-if="isHydrated && !wideLayout" class="hidden lg:w-1/5 xl:w-1/4 sm:hidden xl:block">
        <div class="sticky top-0 h-screen flex flex-col gap-2 py-3 margin-inline-2">
          <slot name="right">
            <div class="flex-auto" />
            <NavFooter />
          </slot>
        </div>
      </aside>
    </main>
  </div>
</template>

<style class="scoped">
.margin-inline-4{
  -webkit-margin-end: 1rem;
  margin-inline-end: 1rem;
}

.margin-inline-2{
  -webkit-margin-end: 0.5rem;
  margin-inline-end: 0.5rem;
}

.padding-transition{
  transition-duration: .15s;
  transition-property: padding;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
}
</style>
