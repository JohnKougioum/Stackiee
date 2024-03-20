import { PrismaClient } from '@prisma/client'
import { sendSSEEvent } from '~/server/utils/server-events'
import { SocketEvents } from '~/types'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event)
  const participantIds: string[] = requestBody.userIDs.sort()

  if (!participantIds.length) {
    throw createError({
      statusCode: 400,
      message: 'You cannot create a conversation without setting at least one participant',
    })
  }

  // Get all the details of the logged-in user
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: event.context.id.id,
    },
  })

  if (!(participantIds.includes(user.id)))
    participantIds.push(user.id)

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
    latestMessage: {
      include: {
        sender: {
          select: {
            id: true,
            uid: true,
          },
        },
      },
    },
  }
  try {
    // TODO: Send SSE event to all participants in the conversation (except the sender)
    const allConversationParticipants = await prisma.conversationParticipant.findMany({})

    const transformedArray = allConversationParticipants.reduce((result, item) => {
      // Find if there is an existing record in the result array with the same conversationId
      const existingRecord = result.find(entry => entry.conversationID === item.conversationId)

      // If an existing record is found, add the userId to its participants array
      if (existingRecord) {
        existingRecord.participants.push(item.userId)
      }
      else {
        // If no existing record is found, create a new entry
        result.push({
          conversationID: item.conversationId,
          participants: [item.userId],
        })
      }

      return result
    }, [])
    let everyElementsExists = null

    for (const item of transformedArray) {
      if (participantIds.every(element => item.participants.includes(element)) && participantIds.length === item.participants.length) {
        everyElementsExists = item.conversationID
        break
      }
    }
    if (everyElementsExists) {
      return {
        status: 200,
        message: 'A conversation with the given participants already exists',
        conversation_id: everyElementsExists,
      }
    }
    else {
      const conversation = await prisma.conversation.create({
        data: {
          name: '',
          participants: {
            createMany: {
              data: participantIds.map((id: string) => ({
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
    }
  }
  catch (error) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Invalid Payload',
    })
  }
})
