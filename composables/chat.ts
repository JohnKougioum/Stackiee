import { ref } from 'vue'
import type { Conversation, ConversationParticipant, Message } from '@prisma/client'
import type { ThinnedUser } from '~/types/index'

export type FullConversationType = Conversation & { participants: Array<ConversationParticipant & { user: ThinnedUser }> } & { hasSeen?: boolean }

export const chats = ref <FullConversationType[]>([])
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

export const orderedChats = computed(() => {
  // const route = useRoute()
  return chats.value
  // .sort((a, b) => {
  //   if (route.params?.id?.includes(a.id) && !route.params?.id?.includes(b.id))
  //     return -1
  //   if (!route.params?.id?.includes(a.id) && route.params?.id?.includes(b.id))
  //     return 1
  //   if (notifications.value.length) {
  //     const notificationA = notifications.value.find(notification => notification.fromId === a.id)?.hasSeen ?? true
  //     const notificationB = notifications.value.find(notification => notification.fromId === b.id)?.hasSeen ?? true
  //     if (!notificationA && notificationB)
  //       return -1
  //     if (notificationA && !notificationB)
  //       return 1
  //   }
  //   const lastMessageA = new Date(a.updatedAt).getTime() || 0
  //   const lastMessageB = new Date(b.updatedAt).getTime() || 0
  //   return lastMessageB - lastMessageA
  // })
    .map((chat) => {
      const hasSeen = notifications.value.find(notification => notification.fromId === chat.id)?.hasSeen ?? true
      return {
        ...chat,
        hasSeen,
      }
    })
})

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
      route.params?.id?.includes(chatId) && await navigateTo('/chat')
    }
    else {
      chats.value[index].participants = participants
    }
  }
  else {
    await navigateTo('/chat')
    await fetchChats()
  }
}

export async function handleNewChatSSEEvent() {
  await fetchChats()
}

export function handleParticipantsUpdateSSEEvent(chatId: string, participants: Array<ConversationParticipant & { user: ThinnedUser }>) {
  updateParticipantsList(chatId, participants)
}

export function handleChatNameUpdateSSEEvent(chatId: string, newName: string) {
  updateChatName(chatId, newName)
}

export function handleLastMessageUpdateSSEEvent(newMessage: Message, hasSeen: boolean) {
  const index = chats.value.findIndex(chat => chat.id === newMessage.conversationId)
  if (index !== -1) {
    chats.value[index].latestMessage = newMessage.body
    chats.value[index].updatedAt = newMessage.updatedAt
    chats.value[index].hasSeen = hasSeen
  }
}
