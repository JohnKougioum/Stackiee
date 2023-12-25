import { ref } from 'vue'
import type { Conversation, ConversationParticipant, User } from '@prisma/client'

type ChatsList = Conversation & { participants: Array<ConversationParticipant & { user: User }> }

const chats = ref < Array<ChatsList>>([])
const isChatsListLoading = ref(false)
export async function fetchChats() {
  isChatsListLoading.value = true
  const { data } = await useFetch<{ statusCode: number; body: ChatsList[] }>('/api/conversations/all')
  isChatsListLoading.value = false

  chats.value = data.value?.body || []
  return {
    chats,
    isChatsListLoading,
  }
}
