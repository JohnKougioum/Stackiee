import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const conversationID = event.context.params?.id
  const { lastDate } = await readBody(event)

  if (!conversationID) {
    throw createError({
      statusCode: 403,
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

  const lookupBeforeDate = lastDate ? new Date(lastDate) : new Date()

  const messages = await prisma.message.findMany({
    where: {
      conversationId: conversationID,
      createdAt: {
        lt: lookupBeforeDate,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
  })

  return {
    statusCode: 200,
    body: messages,
  }
})
