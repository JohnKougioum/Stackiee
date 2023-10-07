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
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      uid: event.context.uid.uid,
    },
  })

  try {
    const conversation = await prisma.conversation.findUniqueOrThrow({
      where: {
        id: conversationID,
      },
      include: {
        participants: {},
      },
    })
    const isUserPartOfConversation = conversation.participants.some(item => item.userId === user.id)
    if (!isUserPartOfConversation) {
      throw createError({
        statusCode: 401,
        statusMessage: 'You are not part of this conversation!',
      })
    }
    const conversationAdmin = conversation.participants.find(participant => participant.isAdmin === true)
    if (conversationAdmin?.userId !== user.id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Only the admin of the conversation have the authority to delete the conversation.',
      })
    }
    else {
      await prisma.conversationParticipant.deleteMany({ where: { conversationId: conversationID } })
      await prisma.message.deleteMany({ where: { conversationId: conversationID } })
      const deletedConversation = await prisma.conversation.delete({
        where: {
          id: conversationID,
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                },
              },
            },
          },
          latestMessage: {
            include: {
              sender: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      })
      return { statusCode: 200, body: deletedConversation }
    }
  }
  catch (error: any) {
    setResponseStatus(event, error.statusCode)
    return {
      statusCode: error.statusCode,
      body: error.statusMessage,
    }
  }
})
