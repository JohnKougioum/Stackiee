import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event)
  const conversationID = requestBody.conversation_id
  const senderID = requestBody.sender_id
  const messageBody = requestBody.body

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      uid: event.context.uid.uid,
    },
  })

  const messagePopulated = {
    sender: {
      select: {
        id: true,
        uid: true,
      },
    },
  }

  try {
    const newMessage = await prisma.message.create({
      data: {
        senderId: senderID,
        conversationId: conversationID,
        body: messageBody,
      },
      include: messagePopulated,
    })

    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        userId: user.id,
        conversationId: conversationID,
      },
    })

    if (!participant)
      throw createError('Participant does not exist')

    return {
      message: newMessage,
    }
  }
  catch (error) {
    console.log('send message error', error)
    throw createError('Error sending message')
  }
})
