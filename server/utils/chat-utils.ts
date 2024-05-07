import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getUserConversations(userId: string) {
  const conversations = await prisma.conversationParticipant.findMany({
    where: {
      userId,
    },
    select: {
      conversation: {
        include: {
          participants: {
            include: {
              user: {
                select: {
                  fullNameEL: true,
                  fullName: true,
                  uid: true,
                  id: true,
                },
              },
            },
          },
          latestMessage: true,
        },
      },
    },
  })
  return conversations
}
