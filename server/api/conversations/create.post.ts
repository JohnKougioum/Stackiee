import { PrismaClient } from '@prisma/client'
import { sendSSEEvent } from '~/server/utils/server-events'
import { SocketEvents } from '~/types'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event)
  
  const participantIds = new Set(requestBody.userIDs)

  if (!participantIds.size) {
    throw createError({
      statusCode: 400,
      message: 'You must provide at least one participant.',
    })
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: event.context.id.id },
  })
  participantIds.add(user.id)

  const participantPopulated = {
    user: {
      select: {
        uid: true,
      },
    },
  }

  const conversationPopulated = {
    participants: {
      include: participantPopulated,
    },
  }

  try {
    const existingConversations = await prisma.conversationParticipant.findMany()
    const conversationMap = new Map<string, Set<string>>()

    for (const { conversationId, userId } of existingConversations) {
      if (!conversationMap.has(conversationId)) {
        conversationMap.set(conversationId, new Set())
      }
      conversationMap.get(conversationId)!.add(userId)
    }

    for (const [conversationId, participants] of conversationMap) {
      if (
        participantIds.size === participants.size &&
        [...participantIds].every(id => participants.has(id))
      ) {
        return {
          status: 200,
          message: 'A conversation with the given participants already exists',
          conversation_id: conversationId,
        }
      }
    }

    const conversation = await prisma.conversation.create({
      data: {
        name: '',
        participants: {
          createMany: {
            data: [...participantIds].map(id => ({
              userId: id,
              hasSeenLatestMessage: id === user.id,
              isAdmin: id === user.id,
            })),
          },
        },
      },
      include: conversationPopulated,
    })

    for (const participant of conversation.participants) {
      if (participant.userId !== user.id) {
        await sendSSEEvent(participant.userId, JSON.stringify({
          type: SocketEvents.NewConversationCreated,
        }))
      }
    }

    return {
      status: 200,
      message: 'A new conversation has been created',
      conversation_id: conversation.id,
    }
  } catch (error: any) {
    console.error('Error creating conversation:', {
      message: error.message,
      stack: error.stack,
      original: error,
    })

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'An unexpected error occurred while creating the conversation.',
    })
  }
})