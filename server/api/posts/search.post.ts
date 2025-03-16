import { PrismaClient } from '@prisma/client'
import z from 'zod'

const prisma = new PrismaClient()

const postSearchSchema = z.object({
  page: z.number(),
  searchQuery: z.string().nullable().optional(),
  semesters: z.string().array().nullable().optional(),
  courses: z.string().array().nullable().optional(),
})

export default defineEventHandler(async (event) => {
  const searchRequest = await readBody(event)
  try {
    postSearchSchema.parse(searchRequest)

    const limit = 15

    const startIndex = (searchRequest.page - 1) * limit

    const prismaWhereQuery = {
      where: {
        AND: [
          {
            ...searchRequest.searchQuery && {
              body: {
                contains: searchRequest.searchQuery,
                mode: 'insensitive',
              },
            },
          },
          {
            OR: [
              {
                ...searchRequest.semesters.length && {
                  semester: {
                    in: searchRequest.semesters.map(Number),
                  },
                },
              },
              {
                ...searchRequest.courses.length && {
                  course: {
                    in: searchRequest.courses,
                  },
                },
              },
            ],
          },
        ],
      },
    }

    const posts = await prisma.post.findMany({
      ...prismaWhereQuery,
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

    const postsCount = await prisma.post.count({ where: prismaWhereQuery.where })

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
