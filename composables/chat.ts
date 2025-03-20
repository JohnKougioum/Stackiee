import { ref } from 'vue'
import type { Conversation, ConversationParticipant, User } from '@prisma/client'
import type { ThinnedUser } from '~/types/index'

export type FullConversationType = Conversation & { participants: Array<ConversationParticipant & { user: ThinnedUser }> }

export const chats = ref < Array<FullConversationType>>([])
const isChatsListLoading = ref(false)
export async function fetchChats() {
  if (process.client) {
    isChatsListLoading.value = true
    const data = await $fetch<{ statusCode: number; conversations: FullConversationType[] }>('/api/conversations/all')
    isChatsListLoading.value = false

    chats.value = data?.conversations || []

    return {
      chats,
      isChatsListLoading,
    }
  }
}

export function updateChat(newChat: FullConversationType) {
  const index = chats.value.findIndex(chat => chat.id === newChat.id)
  if (index !== -1)
    chats.value[index] = newChat
}

export function updateChatName(chatId: string, newName: string) {
  const index = chats.value.findIndex(chat => chat.id === chatId)
  if (index !== -1)
    chats.value[index].name = newName
}

export async function updateParticipantsList(chatId: string, participants: Array<ConversationParticipant & { user: ThinnedUser }>) {
  const index = chats.value.findIndex(chat => chat.id === chatId)
  if (index !== -1) {
    if (!participants.some(participant => participant.user.id === userObject.value?.id)) {
      chats.value.splice(index, 1)
      const route = useRoute()
      route.params.id.includes(chatId) && await navigateTo('/chat')
    }
    else {
      chats.value[index].participants = participants
    }
  }
}

export async function handleNewChatSSEEvent() {
  const { fullPath } = useRoute()
  fullPath.includes('chat') && await fetchChats()
}

export function handleParticipantsUpdateSSEEvent(chatId: string, participants: Array<ConversationParticipant & { user: ThinnedUser }>) {
  updateParticipantsList(chatId, participants)
}

export function handleChatNameUpdateSSEEvent(chatId: string, newName: string) {
  updateChatName(chatId, newName)
}
