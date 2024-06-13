<script setup lang="ts">
const { $connectWebsocket } = useNuxtApp()
onMounted(async () => {
  userObject.value?.id && $connectWebsocket(userObject.value?.id)
})
</script>

<template>
  <NuxtLoadingIndicator color="repeating-linear-gradient(to right,#d98018 0%,#9a5420 100%)" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="postcss">
html,
body,
#__nuxt {
  height: 100vh;
  margin: 0;
  padding: 0;
}

html{
  @apply bg-base text-primary-dark;
}

body{
  overflow-y: scroll;
}

* {
  scrollbar-color: #8885 #F5F1ED;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar:horizontal {
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #D9D9D9;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: #8885;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: #8886;
}
</style>
