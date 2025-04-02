import { PrismaClient } from '@prisma/client'
import { getUserConversations } from '~/server/utils/chat-utils'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: event.context.id.id,
    },
  })

  // Get all the conversations where the logged in user is part of
  const conversations = await getUserConversations(user.id)
  const finalResponse = {
    statusCode: 200,
    conversations: conversations.map(({ conversation }) => ({
      ...conversation,
    })),
  }

  return finalResponse
})
