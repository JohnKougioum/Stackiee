<script setup lang='ts'>
import { SocketEvents } from '~/types'
import { isModalInChatOpen } from '~/composables/modal'

definePageMeta({
  keepalive: false,
})

const chatId = useRoute().params.id as string

const { $ws } = useNuxtApp()

const conversationResponse = ref(chats.value.find(chat => chat.id === chatId))
if (!conversationResponse.value)
  await navigateTo('/chat')

const isUserAdmin = computed(() => conversationResponse.value?.participants
  .some(participant => participant.isAdmin && participant.userId === userObject.value?.id) || false)

const inputText = ref('')
const messagesContainer = ref()
const messagesContainerWhiteboard = ref()

async function sendMessage() {
  if (!inputText.value.trim())
    return
  const text = inputText.value
  inputText.value = ''
  try {
    $ws.value?.send(JSON.stringify({
      eventName: SocketEvents.NewMessage,
      message: text,
      chatId,

    }))
  }
  catch (error) {

  }
}

const deactivated = useDeactivated()

onMounted(async () => {
  $ws.value?.addEventListener('message', async (event) => {
    let data
            = typeof event.data === 'string' ? event.data : await event.data.text()
    data = data.startsWith('{')
      ? JSON.parse(data)
      : { message: data }
    if (data.eventName === SocketEvents.NewMessage) {
      messagesContainer.value?.addMessage(data.message)
      if (isWhiteboardOpen.value && messagesContainerWhiteboard.value)
        messagesContainerWhiteboard.value?.addMessage(data.message)
    }

    if (data.eventName === SocketEvents.ConversationNameUpdate)
      updateChatName(data.chatId, data.conversationName)

    if (data.eventName === SocketEvents.ConversationParticipantsUpdate)
      updateParticipantsList(data.chatId, data.participants)
  })
})

onDeactivated(() => {
  isWhiteboardOpen.value = false
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
        <ChatName class="flex-1" :name="conversationResponse!.name" :participants="conversationResponse!.participants" />
      </template>
      <template #messages>
        <template v-if="conversationResponse?.participants.length">
          <ChatMessagesContainer ref="messagesContainer" :chat-id="chatId" :participants="conversationResponse?.participants" />
        </template>
      </template>
      <template #participantsDropdown>
        <ChatParticipantsDropdown
          v-if="conversationResponse?.participants.length"
          :participants="conversationResponse.participants"
          :chat-id="chatId"
          :is-user-admin="isUserAdmin"
        />
      </template>
      <template #chat-settings>
        <ChatSettings :is-user-admin="isUserAdmin" />
      </template>
    </ChatLayout>
  </MainContent>
  <ModalDialog
    v-if="!deactivated"
    v-model="isModalInChatOpen"
    :custom-z-index="10001"
    use-v-if
  >
    <ChatAddUsers v-if="isParticipantsDropdownOpen" :participants="conversationResponse?.participants!" :chat-id="chatId" />
    <ChatRenameDialog v-if="isChatRenameOpen" :chat-id="chatId" />
  </ModalDialog>
  <WhiteboardModal v-if="isWhiteboardOpen && !deactivated">
    <div class="rounded-md flex-1 h-full">
      <ChatLayout v-model="inputText" @submit="sendMessage">
        <template #title>
          <ChatName class="flex-1 overflow-hidden" :name="conversationResponse!.name" :participants="conversationResponse!.participants" />
        </template>
        <template #messages>
          <template v-if="conversationResponse?.participants.length">
            <ChatMessagesContainer ref="messagesContainerWhiteboard" :chat-id="chatId" :participants="conversationResponse?.participants" />
          </template>
        </template>
        <template #participantsDropdown>
          <ChatParticipantsDropdown
            v-if="conversationResponse?.participants.length"
            :participants="conversationResponse.participants"
            :chat-id="chatId"
            :is-user-admin="isUserAdmin"
          />
        </template>
        <template #chat-settings>
          <ChatSettings :is-user-admin="isUserAdmin" />
        </template>
      </ChatLayout>
    </div>
  </WhiteboardModal>
</template>

<style scoped lang="postcss">
</style>
