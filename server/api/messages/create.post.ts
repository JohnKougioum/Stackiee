import { PrismaClient } from '@prisma/client'
import PartySocket from 'partysocket'
import { updateLanguageServiceSourceFile } from 'typescript'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event)
  const conversationID = requestBody.conversation_id
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
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        userId: user.id,
        conversationId: conversationID,
      },
    })

    if (!participant)
      throw createError('Participant does not exist')

    // TODO: check if body is empty

    const newMessage = await prisma.message.create({
      data: {
        senderId: user.id,
        conversationId: conversationID,
        body: messageBody,
      },
      include: messagePopulated,
    })

    await PartySocket.fetch(
      { host: '127.0.0.1:1999', room: 'chat' },
      {
        method: 'POST',
        body: JSON.stringify({ message: newMessage }),
      },
    )

    return {
      statusCode: 200,
      body: newMessage,
    }
  }
  catch (error) {
    throw createError('Error sending message')
  }
})
