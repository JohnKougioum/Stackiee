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

    const conversation = await prisma.conversation.findUniqueOrThrow({
      where: {
        id: event.context.params?.id,
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                fullNameEL: true,
              },
            },
          },
        },
      },
    })
  
    return {
      statusCode: 200,
      body: conversation,
    }
  }
  catch (error: any) {
    return {
      statusCode: error.statusCode,
      body: error.statusMessage,
    }
  }
})
