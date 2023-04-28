import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (!event.context.params?.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing id',
    })
  }

  const comments = await prisma.comment.findMany({
    where: {
      postId: event.context.params?.id,
    },
    include: {
      User: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return {
    statusCode: 200,
    body: comments,
  }
})
