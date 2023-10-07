import { PrismaClient } from '@prisma/client'

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

    if (conversation.participants.length > 2) {
      const conversationAdmin = conversation.participants.find(participant => participant.isAdmin === true)
      if (conversationAdmin?.userId !== user.id) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Only conversation admins have the authority to delete a conversation.',
        })
      }
    }

    const newConversation = await prisma.conversation.update({
      where: {
        id: conversationID,
      },
      data: {
        name: newName,
      },
    })

    return {
      statusCode: 200,
      body: newConversation,
    }
  }
  catch (error) {
    setResponseStatus(event, error.statusCode)
    return {
      statusCode: error.statusCode,
      statusMessage: error.statusMessage,
    }
  }
})
