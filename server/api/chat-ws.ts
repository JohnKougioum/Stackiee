import type { Peer } from 'crossws'
import { getQuery } from 'ufo'
import { addMessageDB, getUserConversations, updateConversationName } from '~/server/utils/chat-utils'
import { SocketEvents } from '~/types'

const users = new Map<string, { online: boolean }>()

export default defineWebSocketHandler({
  async open(peer) {
    console.log(`[ws] open ${peer}`)
    const userId = getUserId(peer)
    const conversations = await getUserConversations(userId)
    const conversationsIds = conversations.map(({ conversation }) => conversation.id)

    users.set(userId, { online: true })

    peer.send({
      user: 'server',
      message: 'Connected',
    })
    conversationsIds.forEach((conversationId) => {
      peer.subscribe(conversationId)
    })
  },
  async message(peer, event) {
    const data = JSON.parse(event.text())
    const userId = getUserId(peer)
    if (data.eventName === SocketEvents.NewMessage) {
      try {
        const message = await addMessageDB(userId, data.chatId, data.message)
        const _message = {
          user: userId,
          message,
          chatId: data.chatId,
          eventName: data.eventName,
        }
        peer.send(_message)
        peer.publish(data.chatId, _message)
      }
      catch (error) {
        console.error('Error adding message to db', error)
        peer.send({
          eventName: SocketEvents.MessageError,
          message: 'There was an error adding the message to the database. Please try again.',
        })
      }
    }
    if (data.eventName === SocketEvents.ConversationNameUpdate) {
      try {
        await updateConversationName(userId, data.chatId, data.conversationName)
        peer.send({
          eventName: SocketEvents.ConversationNameUpdate,
          chatId: data.chatId,
          conversationName: data.conversationName,
        })
        peer.publish(data.chatId, {
          eventName: SocketEvents.ConversationNameUpdate,
          chatId: data.chatId,
          conversationName: data.conversationName,
        })
      }
      catch (error) {
        peer.send({
          eventName: SocketEvents.MessageError,
          message: (error as any).message,
        })
      }
    }
  },

  close(peer) {
    console.log(`[ws] close ${peer}`)

    const userId = getUserId(peer)
    users.set(userId, { online: false })
  },

  error(peer, error) {
    console.log(`[ws] error ${peer}`, error)
  },
})

function getUserId(peer: Peer) {
  const query = getQuery(peer.url)
  return query.userId as string
}
