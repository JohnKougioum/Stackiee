import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: event.context.id.id,
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
          user: {
            select: {
              fullNameEL: true,
              fullName: true,
              uid: true,
              id: true,
            },
          },
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
