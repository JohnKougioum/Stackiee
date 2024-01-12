import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const conversationID = event.context.params?.id
  const requestBody = await readBody(event)
  const newName = requestBody.name

  if (!conversationID) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing conversation ID',
    })
  }

  try {
    if (true) {
      throw createError({
        statusCode: 400,
        statusMessage: 'There is not conversation with the given ID',
      })
    }
  }
  catch (error) {
    setResponseStatus(event, 406)
    return {
      statusCode: 406,
      statusMessage: 'test',
    }
  }
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

  if (conversation.participants.length > 2) {
    const conversationAdmin = conversation.participants.find(participant => participant.isAdmin === true)
    if (conversationAdmin?.userId !== user.id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Only conversation admins have the authority to delete a conversation.',
      })
    }
  }

  const newConversation = await prisma.conversation.update({
    where: {
      id: conversationID,
    },
    data: {
      name: newName,
    },
  })

  return {
    statusCode: 200,
    body: newConversation,
  }
})
