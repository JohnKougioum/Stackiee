<script setup lang="ts">
import { connectSSE, disconnectSSE } from './composables/sse.client'

const route = useRoute()
const { data: user, error } = await useFetch('/api/user/info', {
  method: 'GET',
  server: false,
  credentials: 'include',
})
if (error.value && import.meta.client && route.path !== '/login' && route.path !== '/login/auth')
  window.location.href = '/login'

const { $connectWebsocket } = useNuxtApp()
onMounted(async () => {
  const unwatch = watch(user, async (newUser) => {
    if (newUser?.data?.id) {
      userObject.value = newUser?.data || null
      await $connectWebsocket(newUser.data.id)
      unwatch()
    }
  }, { immediate: true })

  connectSSE(user.value?.data.id)
})
onUnmounted(() => {
  const { $ws } = useNuxtApp()
  $ws.value?.close()
  disconnectSSE()
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
