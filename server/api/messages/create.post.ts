import { PrismaClient } from '@prisma/client'
import PartySocket from 'partysocket'
import { object as zobject, string as zstring } from 'zod'
import { SocketEvents } from '~/types'
import { sendSSEEvent } from '~/server/utils/server-events'

const prisma = new PrismaClient()

const createMessagePayloadSchema = zobject({
  conversationId: zstring().min(1),
  body: zstring().min(1),
})

// TODO: Remove this and use the new socket implementation
export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event)

  try {
    createMessagePayloadSchema.parse(requestBody)
  }
  catch (error) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Invalid Payload',
    })
  }

  const conversationID = requestBody.conversationId
  const messageBody = requestBody.body

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: event.context.id.id,
    },
  })

  const messagePopulated = {
    sender: {
      select: {
        id: true,
        uid: true,
      },
    },
  }

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationID,
    },
    include: {
      participants: true,
    },
  })

  if (!conversation || !conversation.participants.some(p => p.userId === user.id)) {
    throw createError({
      statusCode: 404,
      message: 'Participant doesn\'t exist in this conversation',
    })
  }

  try {
    const newMessage = await prisma.message.create({
      data: {
        senderId: user.id,
        conversationId: conversationID,
        body: messageBody,
      },
      include: messagePopulated,
    })

    // TODO: maybe change this to the new socket implementation
    for (const participant of conversation.participants) {
      await sendSSEEvent(participant.userId, JSON.stringify({
        type: SocketEvents.NewMessage,
        message: `${user.fullName} sent a message: ${messageBody}`,
      }))
    }

    return {
      statusCode: 200,
      body: newMessage,
    }
  }
  catch (error) {
    throw createError('Error sending message')
  }
})
