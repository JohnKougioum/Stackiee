import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event)
  const conversationID = requestBody.conversation_id
  const senderID = requestBody.sender_id
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

  try {
    const conversation = await prisma.conversation.findUnique ({
      where: {
        id: conversationID,
      },
      include: {
        participants: {},
      },
    })

    if (!conversation) {
      throw createError({
        statusCode: 404,
        statusMessage: 'There is not conversation with the given ID',
      })
    }

    const isUserPartOfConversation = conversation.participants.some(item => item.userId === user.id)
    if (!isUserPartOfConversation) {
      throw createError({
        statusCode: 401,
        statusMessage: 'You are not part of this conversation!',
      })
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId: senderID,
        conversationId: conversationID,
        body: messageBody,
      },
      include: messagePopulated,
    })

    return {
      message: newMessage,
    }
  }
  catch (error) {
    setResponseStatus(event, error.statusCode)
    return {
      statusCode: error.statusCode,
      body: error.statusMessage,
    }
  }
})
