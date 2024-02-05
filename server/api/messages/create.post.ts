import { PrismaClient } from '@prisma/client'
import PartySocket from 'partysocket'
import { object as zobject, string as zstring } from 'zod'
import { SocketEvents } from '~/types'

const prisma = new PrismaClient()

const createMessagePayloadSchema = zobject({
  conversationId: zstring().min(1),
  body: zstring().min(1),
})

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
      uid: event.context.uid.uid,
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

  const participant = await prisma.conversationParticipant.findFirst({
    where: {
      userId: user.id,
      conversationId: conversationID,
    },
  })

  if (!participant) {
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

    await PartySocket.fetch(
      { host: '127.0.0.1:1999', room: newMessage.conversationId },
      {
        method: 'POST',
        body: JSON.stringify({ socketEvent: SocketEvents.NewMessage, message: newMessage }),
      },
    )

    return {
      statusCode: 200,
      body: newMessage,
    }
  }
  catch (error) {
    throw createError('Error sending message')
  }
})
