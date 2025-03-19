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

export function updateParticipantsList(chatId: string, participants: Array<ConversationParticipant & { user: ThinnedUser }>) {
  const index = chats.value.findIndex(chat => chat.id === chatId)
  if (index !== -1)
    chats.value[index].participants = participants
}

export async function handleNewChatSSEEvent() {
  const { fullPath } = useRoute()
  fullPath.includes('chat') && await fetchChats()
  // subscribe to new chat with websocket
}
