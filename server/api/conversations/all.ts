import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      uid: event.context.uid.uid,
    },
  })

  // Get all the conversations where the logged in user is part of
  const conversations = await prisma.conversationParticipant.findMany({
    where: {
      userId: user.id,
    },
    select: {
      conversation: {
        include: {
          latestMessage: true,
        },
      },
    },
  });

  const finalResponse = {
    statusCode: 200,
    conversations: conversations.map(({ conversation }) => ({
      ...conversation,
    })),
  };
  
  return finalResponse
})
