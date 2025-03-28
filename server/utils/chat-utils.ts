import { PrismaClient } from '@prisma/client'
import { object as zobject, string as zstring } from 'zod'

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
        },
      },
    },
  })
  return conversations
}

const createMessagePayloadSchema = zobject({
  conversationId: zstring().min(1),
  body: zstring().min(1),
})

export async function addMessageDB(userId = '', conversationId = '', body = '') {
  try {
    createMessagePayloadSchema.parse({ conversationId, body })
  }
  catch (error) {
    throw new Error('Invalid Payload')
  }

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
    },
    include: {
      participants: true,
    },
  })

  if (!conversation || !conversation?.participants.some(p => p.userId === userId))
    throw new Error('Participant doesn\'t exist in this conversation')

  try {
    const newMessage = await prisma.message.create({
      data: {
        senderId: userId,
        conversationId,
        body,
      },
      include: {
        sender: {
          select: {
            id: true,
            uid: true,
          },
        },
      },
    })

    return newMessage
  }
  catch (error) {
    throw createError('Error sending message')
  }
}

export async function updateConversationName(userId: string, conversationId: string, newName: string = '') {
  if (!userId || !conversationId)
    throw new Error('There was an error changing the name of the conversation. Please try again.')

  const conversation = await prisma.conversation.findUniqueOrThrow({
    where: {
      id: conversationId,
    },
    include: {
      participants: {},
    },
  })

  if (conversation.participants.length > 2) {
    const conversationAdmin = conversation.participants.find(participant => participant.isAdmin === true)
    if (conversationAdmin?.userId !== userId)
      throw new Error('Only conversation admins have the authority to delete a conversation')
  }

  await prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      name: newName,
    },
  })
}
