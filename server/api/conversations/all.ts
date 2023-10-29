import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      uid: event.context.uid.uid,
    },
  })
  // GET ALL CONVERSATIONS
  let conversations = await prisma.conversation.findMany({
    where: {},
    include: {
      participants: {
        include: {
          user: {
            select: {
              fullNameEL: true,
              fullName: true,
              uid: true,
            },
          },
        },
      },
    },
  })
  // FILTER CONVERSATIONS TO TAKE ONLY THE CONVERSATIONS OF THE CURRENT USER
  conversations = conversations.filter((item) => {
    return item.participants.some((item1) => {
      return item1.userId === user.id
    })
  })

  return {
    statusCode: 200,
    body: conversations,
  }
})
