<script setup lang='ts'>
import PartySocket from 'partysocket'
import type { FullConversationType } from '~/composables/chat'

const chatId = useRoute().params.id as string

const { data: conversationResponse } = await useFetch<{ statusCode: number; body: FullConversationType }>(`/api/conversations/${chatId}`)

const inputText = ref('')
const messagesContainer = ref()

async function sendMessage() {
  if (!inputText.value.trim())
    return
  const text = inputText.value
  inputText.value = ''
  try {
    const data = await $fetch('/api/messages/create', {
      method: 'POST',
      body: {
        conversationId: chatId,
        body: text,
      },
    })
    messagesContainer.value?.addMessage(data?.body)
  }
  catch (error) {

  }
}

const ws = new PartySocket({
  host: '127.0.0.1:1999',
  room: 'chat',
  id: userObject.value?.id,
})

ws.addEventListener('message', (event) => {
  messagesContainer.value?.addMessage(JSON.parse(event.data))
})
</script>

<template>
  <MainContent back full-height>
    <template #title>
      <div class="textlg font-bold flex items-center gap-2" @click="$scrollToTop">
        <span>{{ $t('nav.messages') }}</span>
      </div>
    </template>
    <ChatLayout v-model="inputText" @submit="sendMessage">
      <template #title>
        <ChatName class="flex-1" :name="conversationResponse!.body.name" :participants="conversationResponse!.body.participants" />
      </template>
      <template #messages>
        <template v-if="conversationResponse?.body?.participants.length">
          <ChatMessagesContainer ref="messagesContainer" :chat-id="chatId" :participants="conversationResponse?.body?.participants" />
        </template>
      </template>
    </ChatLayout>
  </MainContent>
</template>
