import PartySocket from 'partysocket'
import { SocketEvents } from '~/types'

export const socketsList = ref(new Map<string, PartySocket>())

export function setSocket(conversationId: string) {
  if (socketsList.value.has(conversationId))
    return
  socketsList.value.set(conversationId, new PartySocket({
    host: '127.0.0.1:1999',
    room: conversationId,
    id: userObject.value?.id,
  }))
  mountSocketEvents(conversationId)
}

function mountSocketEvents(conversationId: string) {
  const socket = socketsList.value.get(conversationId)
  socket?.addEventListener('message', (event) => {
    const data = JSON.parse(event.data) as { eventName: number; message: any }

    if (data.eventName === SocketEvents.ConversationNameUpdate)
      updateChatName(conversationId, data.message)

    if (data.eventName === SocketEvents.ConversationParticipantsUpdate)
      updateParticipantsList(conversationId, data.message)
  })
}
