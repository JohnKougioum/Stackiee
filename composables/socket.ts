import PartySocket from 'partysocket'

export const socketsList = ref(new Map<string, PartySocket>())

export function setSocket(conversationId: string) {
  socketsList.value.set(conversationId, new PartySocket({
    host: '127.0.0.1:1999',
    room: conversationId,
    id: userObject.value?.id,
  }))
}
