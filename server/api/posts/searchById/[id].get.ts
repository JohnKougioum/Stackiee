import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (!event.context.params?.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing id',
    })
  }

  const post = await prisma.post.findUnique({
    where: {
      id: event.context.params?.id,
    },
    include: {
      User: true,
      _count: {
        select: {
          Comment: true,
        },
      },
    },
  })

  return {
    statusCode: 200,
    body: post,
  }
})
