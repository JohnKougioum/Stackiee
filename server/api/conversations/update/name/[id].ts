import { PrismaClient } from '@prisma/client'
import PartySocket from 'partysocket'
import { SocketEvents } from '~/types'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const conversationID = event.context.params?.id
  const requestBody = await readBody(event)
  const newName = requestBody.name

  if (!conversationID) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing conversation ID',
    })
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: event.context.id.id,
    },
  })
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
    // TODO: don't need to fetch the user from the db after we change the token to include the user id
    if (conversationAdmin?.userId !== user.id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Only conversation admins have the authority to delete a conversation.',
      })
    }
  }

  const updatedConv = await prisma.conversation.update({
    where: {
      id: conversationID,
    },
    data: {
      name: newName,
    },
  })

  await PartySocket.fetch(
    { host: '127.0.0.1:1999', room: conversationID },
    {
      method: 'POST',
      body: JSON.stringify({ socketEvent: SocketEvents.ConversationNameUpdate, message: updatedConv.name }),
    },
  )

  return {
    statusCode: 200,
    body: 'Name updated successfully',
  }
})
