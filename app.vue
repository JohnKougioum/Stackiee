<script setup lang="ts">
import { SocketEvents } from '~/types'

const { $connectWebsocket } = useNuxtApp()
onMounted(async () => {
  userObject.value?.id && await $connectWebsocket(userObject.value?.id)

  const source = new EventSource(`/api/sse?user=${userObject.value?.id}`)
  source.addEventListener('open', (event) => {
    console.log('SSE connection opened:', event)
  })

  source.addEventListener('message', async (event) => {
    const data = JSON.parse(event.data)
    if (data.type === SocketEvents.NewConversationCreated)
      await handleNewChatSSEEvent()
    if (data.type === SocketEvents.ConversationParticipantsUpdate)
      handleParticipantsUpdateSSEEvent(data.body.chatId, data.body.participants)
    if (data.type === SocketEvents.ConversationNameUpdate)
      handleChatNameUpdateSSEEvent(data.body.chatId, data.body.name)
  })

  source.addEventListener('error', (event) => {
    console.error('Error with SSE connection:', event)
  })
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
