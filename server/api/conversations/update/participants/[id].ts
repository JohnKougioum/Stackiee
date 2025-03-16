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
        id: event.context.id.id,
      },
    })

    const conversation = await prisma.conversation.findUniqueOrThrow({
      where: {
        id: conversationID,
      },
      include: {
        participants: true,
      },
    })
    if (!conversation) {
      throw createError({
        statusCode: 400,
        statusMessage: 'There is not conversation with the given ID',
      })
    }
    const conversationAdmin = conversation.participants.find(participant => participant.isAdmin === true)
    if (conversationAdmin?.userId !== user.id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Only conversation admins have the authority to configure the participants of a conversation.',
      })
    }

    const tempConversationParticipants = conversation.participants.map(participant => participant.userId)
    const usersToRemove = tempConversationParticipants.filter(item => !participants.includes(item))
    const usersToAdd = participants.filter((uid: string) =>
      !tempConversationParticipants.includes(uid) && uid !== user.id,
    )

    if (usersToRemove.length) {
      await prisma.conversationParticipant.deleteMany({
        where: {
          conversationId: conversation.id,
          userId: {
            in: usersToRemove,
          },
        },
      })
    }

    if (usersToAdd.length) {
      await prisma.conversation.update({
        where: {
          id: conversation.id,
        },
        data: {
          participants: {
            createMany: {
              data: usersToAdd.map((id: string) => ({
                userId: id,
                hasSeenLatestMessage: id === user.id,
                isAdmin: id === user.id,
              })),
            },
          },
        },
        include: {
          participants: true,
        },
      })
    }

    const updatedCoversation = await prisma.conversation.findUniqueOrThrow({
      where: {
        id: conversation.id,
      },
      include: {
        participants: {
          include: {
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

    return {
      statusCode: 200,
      body: {
        message: 'Successfully updated conversation participants',
        participantsList: updatedCoversation.participants,
      },
    }
  }
  catch (error: any) {
    return {
      statusCode: error.statusCode,
      body: error.statusMessage,
    }
  }
},
)
