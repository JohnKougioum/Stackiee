import { ref } from 'vue'
import type { Conversation, ConversationParticipant } from '@prisma/client'
import type { ThinnedUser } from '~/types/index'

export type FullConversationType = Conversation & { participants: Array<ConversationParticipant & { user: ThinnedUser }> }

const chats = ref < Array<FullConversationType>>([])
const isChatsListLoading = ref(false)
export async function fetchChats() {
  isChatsListLoading.value = true
  const data = await $fetch<{ statusCode: number; body: FullConversationType[] }>('/api/conversations/all')
  isChatsListLoading.value = false

  chats.value = data?.body || []
  chats.value.forEach((chat) => {
    setSocket(chat.id)
  })

  return {
    chats,
    isChatsListLoading,
  }
}
