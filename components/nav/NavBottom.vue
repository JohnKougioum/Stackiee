<script setup lang='ts'>
const moreMenuVisible = ref(false)
</script>

<template>
  <nav
    class="h-14 border-t-2 flex flex-row text-xl
  overflow-y-scroll scrollbar-hide overscroll-none
  after:content-none after:h-[calc(100%+0.5px)] after:w-[0.1px]
  after:pointer-event"
  >
    <NuxtLink to="/" :active-class="moreMenuVisible ? '' : 'text-base-orange'" class="flex flex-row place-content-center items-center h-full flex-1" @click="$scrollToTop">
      <Icon name="majesticons:home-analytics-line" size="1.6rem" />
    </NuxtLink>
    <NuxtLink to="/search" :active-class="moreMenuVisible ? '' : 'text-base-orange'" class="flex flex-row place-content-center items-center h-full flex-1" @click="$scrollToTop">
      <Icon name="ri:search-line" size="1.6rem" />
    </NuxtLink>
    <NuxtLink to="/chat" :active-class="moreMenuVisible ? '' : 'text-base-orange'" class="flex flex-row place-content-center items-center h-full flex-1" @click="$scrollToTop">
      <Icon name="majesticons:messages-line" size="1.6rem" />
    </NuxtLink>
    <NuxtLink :to="`/profile/${userObject?.uid}`" :active-class="moreMenuVisible ? '' : 'text-base-orange'" class="flex flex-row place-content-center items-center h-full flex-1" @click="$scrollToTop">
      <Icon name="mingcute:user-3-line" size="1.6rem" />
    </NuxtLink>
    <NavBottomMoreMenu
      v-slot="{ toggleVisible, show }"
      v-model="moreMenuVisible"
      class="flex flex-row items-center place-content-center h-full flex-1 cursor-pointer"
    >
      <label
        class="flex items-center place-content-center h-full flex-1 select-none"
        :class="show ? 'text-base-orange' : ''"
      >
        <input type="checkbox" class="absolute inset-0 opacity-0 z-[-1]" @click="toggleVisible">
        <Icon v-show="show" name="ri:close-fill" size="1.6rem" class="cursor-pointer" />
        <Icon v-show="!show" name="ri:more-fill" size="1.6rem" class="cursor-pointer" />
      </label>
    </NavBottomMoreMenu>
  </nav>
</template>
