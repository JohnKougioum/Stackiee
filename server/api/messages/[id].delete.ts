import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const conversationID = event.context.params?.id

  if (!conversationID) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing conversation ID',
    })
  }

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        uid: event.context.uid.uid,
      },
    })

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

    const messages = await prisma.message.deleteMany({
      where: {
        conversationId: conversationID,
      },
    })

    return {
      statusCode: 200,
      body: messages,
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
