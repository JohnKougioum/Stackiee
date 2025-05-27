import { PrismaClient } from '@prisma/client'
import { object as zobject, string as zstring } from 'zod'
import { NotificationTypes } from '@/types'
import { sendSSEEvent } from '~/server/utils/server-events'

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

export async function addMessageDB(
  userId = '',
  conversationId = '',
  body = '',
) {
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
      participants: {
        select: {
          user: {
            select: {
              id: true,
              uid: true,
              fullName: true,
              fullNameEL: true,
            },
          },
        },
      },
    },
  })

  if (
    !conversation
    || !conversation?.participants.some(p => p.user.id === userId)
  )
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

    const participants = conversation.participants.filter(p => p.user.id !== userId)
    for (const participant of participants) {
      const conversationName = conversation.name
        ? { value: conversation.name }
        : participants.length > 1
          ? {
              en: participants.map(p => p.user.fullName).join(', '),
              el: participants.map(p => p.user.fullNameEL).join(', '),
            }
          : {
              en: conversation.participants.find(p => p.user.id === userId)?.user.fullName,
              el: conversation.participants.find(p => p.user.id === userId)?.user.fullNameEL,
            }

      const existingNotification = await prisma.notification.findFirst({
        where: {
          fromId: conversationId,
          userId: participant.user.id,
          type: NotificationTypes.NewMessage,
        },
      })
      let notificationData = null
      if (!existingNotification || (existingNotification && existingNotification.hasSeen)) {
        notificationData = await prisma.notification.create({
          data: {
            User: {
              connect: {
                id: participant.user.id,
              },
            },
            fromId: conversationId,
            type: NotificationTypes.NewMessage,
            body: conversationName,
          },
        })
      }
      await sendSSEEvent(participant.user.id, JSON.stringify({
        type: NotificationTypes.NewMessage,
        body: {
          notification: { ...notificationData },
          newMessage,
        },
      }))
    }

    await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        latestMessage: newMessage.body,
      },
    })

    return newMessage
  }
  catch (error) {
    throw createError('Error sending message')
  }
}
