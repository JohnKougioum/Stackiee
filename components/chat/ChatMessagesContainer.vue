<script setup lang='ts'>
import type { ConversationParticipant, Message } from '@prisma/client'
import type { ThinnedUser } from '~/types/index'

const props = defineProps<{
  chatId: string
  participants: Array<ConversationParticipant & { user: ThinnedUser } >
}>()
defineExpose({
  addMessage,
})
const { data: messagesResponse } = await useFetch<{ statusCode: number; body: Message[] }>(`/api/messages/${props.chatId}`, {
  method: 'GET',
})

function addMessage(message: Message) {
  messagesResponse.value?.body.push(message)
}

function displayName(id = '') {
  if (!id)
    return ''
  const participant = props.participants.find(participant => participant.user.id === id)
  if (!participant)
    return ''
  return displayUsernameLocale(participant.user.fullName, participant.user.fullNameEL, true)
}
</script>

<template>
  <div class="flex-grow basis-0 overflow-auto p-1">
    <template v-if="messagesResponse?.body.length">
      <ChatMessage
        v-for="(message, index) in messagesResponse?.body"
        :key="message.id"
        :own="message.senderId === userObject?.id"
        :message="message.body"
        :name="displayName(message.senderId)"
        :show-name="index === 0 || messagesResponse?.body[index - 1].senderId !== message.senderId"
      />
    </template>
    <slot />
  </div>
</template>
