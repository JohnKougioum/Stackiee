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

    const posts = await prisma.comment.findMany({
      where: {
        userId: searchRequest.id,
      },
      include: {
        Post: {
          select: {
            User: {
              select: {
                fullName: true,
                fullNameEL: true,
              },
            },
          },
        },
        User: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: startIndex,
      take: limit,
    })

    const commentsCount = await prisma.comment.count({ where: { userId: searchRequest.id } })

    if (!posts) {
      return {
        statusCode: 204,
        statusMessage: 'No comments found',
      }
    }

    posts.forEach((post) => {
      post.postUsername = {
        fullName: post.Post?.User?.fullName || '',
        fullNameEL: post.Post?.User?.fullNameEL || '',
      }
      delete post.Post
    })

    return {
      statusCode: 200,
      body: posts,
      commentsCount,
    }
  }
  catch (error) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Invalid Payload',
    })
  }
})
