import { PrismaClient } from '@prisma/client'
import z from 'zod'

const prisma = new PrismaClient()

const userPostsSchema = z.object({
  page: z.number(),
  id: z.string(),
})

export default defineEventHandler(async (event) => {
  const searchRequest = await readBody(event)
  try {
    userPostsSchema.parse(searchRequest)

    const limit = 15

    const startIndex = (searchRequest.page - 1) * limit

    const posts = await prisma.post.findMany({
      where: {
        userId: searchRequest.id,
      },
      include: {
        User: true,
        _count: {
          select: {
            Comment: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: startIndex,
      take: limit,
    })

    const postsCount = await prisma.post.count({ where: { userId: searchRequest.id } })

    if (!posts) {
      return {
        statusCode: 204,
        statusMessage: 'No posts found',
      }
    }

    return {
      statusCode: 200,
      body: posts,
      postsCount,
    }
  }
  catch (error) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Invalid Payload',
    })
  }
})
