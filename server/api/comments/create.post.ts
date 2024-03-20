import { PrismaClient } from '@prisma/client'
import { object, string } from 'zod'

const prisma = new PrismaClient()

const commentCreationSchema = object({
  postId: string(),
  comment: string(),
})

export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event)
  try {
    commentCreationSchema.parse(requestBody)
    await prisma.comment.create({
      data: {
        body: requestBody.comment,
        Post: {
          connect: {
            id: requestBody.postId,
          },
        },
        User: {
          connect: {
            id: event.context.id.id,
          },
        },
      },
    })
    return {
      statusCode: 200,
      body: 'OK',
    }
  }
  catch (error) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Invalid Payload',
    })
  }
})
