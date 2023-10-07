import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const conversationID = event.context.params?.id
  const requestBody = await readBody(event)
  const participants = requestBody.participantIDs.sort()

  if (!conversationID) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing conversation ID',
    })
  }

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        uid: event.context.uid.uid,
      },
    })

    const conversation = await prisma.conversation.findUniqueOrThrow({
      where: {
        id: conversationID,
      },
      include: {
        participants: {},
      },
    })

    if (!conversation) {
      throw createError({
        statusCode: 400,
        statusMessage: 'There is not conversation with the given ID',
      })
    }

    const isUserPartOfConversation = conversation.participants.some(item => item.userId === user.id)
    if (!isUserPartOfConversation) {
      throw createError({
        statusCode: 401,
        statusMessage: 'You are not part of this conversation!',
      })
    }

    const conversationAdmin = conversation.participants.find(participant => participant.isAdmin === true)
    if (conversationAdmin?.userId !== user.id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Only conversation admins have the authority to configure the participants of a conversation.',
      })
    }

    const allConversationParticipants = await prisma.conversationParticipant.findMany({
      where: {
        conversationId: conversationID,
      },
    })
    const tempConversationParticipants = allConversationParticipants.map((element) => {
      return element.userId
    })

    const usersToRemove = tempConversationParticipants.filter(item => !participants.includes(item))
    const usersToAdd = participants.filter(uid =>
      !tempConversationParticipants.includes(uid) && uid !== user.id,
    )

    if (usersToRemove.length) {
      const x = await prisma.conversationParticipant.deleteMany({
        where: {
          conversationId: conversation.id,
          userId: {
            in: usersToRemove,
          },
        },
      })
      console.log('response: ', x)
    }

    if (usersToAdd.length) {
      const x1 = await prisma.conversation.update({
        where: {
          id: conversation.id,
        },
        data: {
          participants: {
            createMany: {
              data: usersToAdd.map(id => ({
                userId: id,
                hasSeenLatestMessage: id === user.id,
                isAdmin: id === user.id,
              })),
            },
          },
        },
      })
      console.log('response: ', x1)
    }

    return {
      statusCode: 200,
      conversationParticipants: tempConversationParticipants,
      participantsInPayload: participants,
      toRemove: usersToRemove,
      toAdd: usersToAdd,
    }
  }
  catch (error: any) {
    setResponseStatus(event, error.statusCode)
    return {
      statusCode: error.statusCode,
      body: error.statusMessage,
    }
  }
},
)
