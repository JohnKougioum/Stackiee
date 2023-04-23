import { PrismaClient } from '@prisma/client'
import z from 'zod'

const prisma = new PrismaClient()

const postSearchSchema = z.object({
  page: z.number(),
  searchQuery: z.string().nullable().optional(),
  semester: z.number().nullable().optional(),
  course: z.string().nullable().optional(),
})

export default defineEventHandler(async (event) => {
  const searchRequest = await readBody(event)
  try {
    postSearchSchema.parse(searchRequest)

    const limit = 10

    const startIndex = (searchRequest.page - 1) * limit

    const posts = await prisma.post.findMany({
      where: {
        AND: [
          {
            body: {
              contains: searchRequest.searchQuery,
              mode: 'insensitive',
            },
            semester: {
              equals: searchRequest.semester,
            },
            course: {
              equals: searchRequest.course,
            },
          },
        ],
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

    const postsCount = await prisma.post.count()

    if (!posts) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Something went wrong',
      })
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
