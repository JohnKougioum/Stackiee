import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event)
  const participantIds: string[] = requestBody.userIDs.sort()

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      uid: event.context.uid.uid,
    },
  })
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
    const allConversationParticipants = await prisma.conversationParticipant.findMany({})

    const transformedArray = allConversationParticipants.reduce((result, item) => {
      // Find if there is an existing entry in the result array with the same conversationId
      const existingEntry = result.find(entry => entry.conversationID === item.conversationId)

      // If an existing entry is found, add the userId to its participants array
      if (existingEntry) {
        existingEntry.participants.push(item.userId)
      }
      else {
        // If no existing entry is found, create a new entry
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
      return {
        status: 200,
        conversation_id: conversation.id,
      }
    }
  }
  catch (error) {
    console.log(error)
    throw createError({
      statusCode: 403,
      statusMessage: 'Invalid Payload',
    })
  }
})
