<script setup lang='ts'>
import { SocketEvents } from '~/types'
import { isModalInChatOpen } from '~/composables/modal'

const chatId = useRoute().params.id as string

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
    const data = await $fetch('/api/messages/create', {
      method: 'POST',
      body: {
        conversationId: chatId,
        body: text,
      },
    })
    messagesContainer.value?.addMessage(data?.body)
    if (isWhiteboardOpen.value && messagesContainerWhiteboard.value)
      messagesContainerWhiteboard.value?.addMessage(data?.body)
  }
  catch (error) {

  }
}

socketsList.value?.get(chatId)?.addEventListener('message', async (event) => {
  const data = JSON.parse(event.data) as { eventName: number; message: any }

  if (data.eventName === SocketEvents.NewMessage) {
    messagesContainer.value?.addMessage(data.message)
    if (isWhiteboardOpen.value && messagesContainerWhiteboard.value)
      messagesContainerWhiteboard.value?.addMessage(data?.message)
  }
})
const deactivated = useDeactivated()

function handleCloseModal() {
  // if (isWhiteboardOpen.value)
  //   isWhiteboardOpen.value = false
}

const { $ws } = useNuxtApp()
onMounted(async () => {
  $ws.value?.addEventListener('message', (event) => {
    console.log('message', event.data)
  })
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
    :custom-close="isWhiteboardOpen"
    @close="handleCloseModal"
  >
    <ChatAddUsers v-if="isParticipantsDropdownOpen" :participants="conversationResponse?.participants!" :chat-id="chatId" />
    <ChatRenameDialog v-if="isChatRenameOpen" :chat-id="chatId" />
  </ModalDialog>
  <WhiteboardModal v-if="isWhiteboardOpen">
    <div class="rounded-md flex-1">
      <ChatLayout v-model="inputText" @submit="sendMessage">
        <template #title>
          <ChatName class="flex-1" :name="conversationResponse!.name" :participants="conversationResponse!.participants" />
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
