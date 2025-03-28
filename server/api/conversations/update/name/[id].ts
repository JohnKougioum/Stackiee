import { PrismaClient } from '@prisma/client'
import { SocketEvents } from '~/types'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const conversationID = event.context.params?.id
  const requestBody = await readBody(event)
  const newName = requestBody.name
  const userId = event.context.id.id

  if (!conversationID) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing conversation ID',
    })
  }

  const conversation = await prisma.conversation.findUniqueOrThrow({
    where: {
      id: conversationID,
    },
    include: {
      participants: {},
    },
  })

  if (!conversation) {
    throw createError({
      statusCode: 400,
      statusMessage: 'There is not conversation with the given ID',
    })
  }

  if (conversation.participants.length > 2) {
    const conversationAdmin = conversation.participants.find(participant => participant.isAdmin === true)
    if (conversationAdmin?.userId !== userId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'You don\'t have permission to change the name of this conversation',
      })
    }
  }

  await prisma.conversation.update({
    where: {
      id: conversationID,
    },
    data: {
      name: newName,
    },
  })

  for (const participant of conversation.participants) {
    await sendSSEEvent(participant.userId, JSON.stringify({
      type: SocketEvents.ConversationNameUpdate,
      body: {
        chatId: conversationID,
        name: newName,
      },
    }))
  }

  return {
    statusCode: 200,
    body: 'Name updated successfully',
  }
})
