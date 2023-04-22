import { PrismaClient } from '@prisma/client'
import z from 'zod'

const prisma = new PrismaClient()

const postCreationSchema = z.object({
  postBody: z.string(),
  semester: z.number().optional().nullable(),
  course: z.string().optional().nullable(),
})

export default defineEventHandler(async (event) => {
  const response = await readBody(event)
  try {
    postCreationSchema.parse(response)
    await prisma.post.create({
      data: {
        body: response.postBody,
        semester: response.semester || 0,
        course: response.course || '',
        User: {
          connect: {
            uid: event.context.uid.uid,
          },
        },
      },
    })
  }
  catch (error) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Invalid Payload',
    })
  }
  return { statusCode: 200, body: 'OK' }
})
