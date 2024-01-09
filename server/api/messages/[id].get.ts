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

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationID,
    },
    include: {
      participants: true,
    },
  })

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      uid: event.context.uid.uid,
    },
  })

  if (!conversation?.participants.some(participant => participant.userId === user.id)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'User is not in conversation',
    })
  }

  const messages = await prisma.message.findMany({
    where: {
      conversationId: conversationID,
    },
  })

  return {
    statusCode: 200,
    body: messages,
  }
})
