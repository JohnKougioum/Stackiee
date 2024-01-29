<script setup lang='ts'>
import PartySocket from 'partysocket'
import type { FullConversationType } from '~/composables/chat'
import { SocketEvents } from '~/types'
import { isModalInChatOpen } from '~/composables/modal'

const chatId = useRoute().params.id as string

const { data: conversationResponse, refresh, error } = await useFetch<{ statusCode: number; body: FullConversationType }>(`/api/conversations/${chatId}`)
!error.value && !Object.keys(conversationResponse.value!).length && await navigateTo('/chat')
const isUserAdmin = computed(() => conversationResponse.value?.body.participants
  .some(participant => participant.isAdmin && participant.userId === userObject.value?.id) || false)

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

socketsList.value?.get(chatId)?.addEventListener('message', async (event) => {
  const data = JSON.parse(event.data) as { eventName: number; message: any }
  if (data.eventName === SocketEvents.NewMessage)
    messagesContainer.value?.addMessage(data.message)

  if (data.eventName === SocketEvents.ConversationUpdated) {
    await refresh()
    if (conversationResponse.value?.body)
      updateChat(conversationResponse.value?.body)
  }
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
      <template #participantsDropdown>
        <ChatParticipantsDropdown
          v-if="conversationResponse?.body.participants.length"
          :participants="conversationResponse?.body.participants"
          :chat-id="chatId"
          :is-user-admin="isUserAdmin"
        />
      </template>
      <template #chat-settings>
        <ChatSettings :is-user-admin="isUserAdmin" />
      </template>
    </ChatLayout>
  </MainContent>
  <ModalDialog v-model="isModalInChatOpen" :custom-z-index="10001" use-v-if>
    <ChatAddUsers v-if="isParticipantsDropdownOpen" :participants="conversationResponse?.body.participants!" :chat-id="chatId" />
    <ChatRenameDialog v-if="isChatRenameOpen" :chat-id="chatId" />
  </ModalDialog>
</template>
