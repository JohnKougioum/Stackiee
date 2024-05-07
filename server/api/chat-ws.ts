import type { Peer } from 'crossws'
import { getQuery } from 'ufo'
import { getUserConversations } from '~/server/utils/chat-utils'

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
  async message(peer, message) {
    console.log(`[ws] message ${peer} ${message.text()}`)
    const userId = getUserId(peer)
    const _message = {
      user: userId,
      message: message.text(),
    }
    peer.send(_message) // echo back
    peer.publish('chat', _message)

    // TODO: add message to db
    // await addMessage(userId, message.text())
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
