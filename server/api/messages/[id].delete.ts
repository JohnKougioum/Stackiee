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
      id: event.context.id.id,
    },
  })

  const messages = await prisma.message.deleteMany({
    where: {
      conversationId: conversationID,
    },
  })

  return {
    statusCode: 200,
    body: messages,
  }
})
