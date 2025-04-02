import { PrismaClient, Prisma } from '@prisma/client'
import z from 'zod'
import { removeDiacritics } from '~/server/utils/normalize'

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

    const searchQuery = searchRequest.searchQuery
      ? removeDiacritics(searchRequest.searchQuery)
      : null

    const prismaWhereQuery = {
      where: {
        AND: [
          {
            ...searchQuery && {
              normalizedBody: {
                contains: searchRequest.searchQuery,
                mode: Prisma.QueryMode.insensitive,
              }
            },
          },
          {
            OR: [
              {
                ...searchRequest.semesters?.length && {
                  semester: {
                    in: searchRequest.semesters.map(Number),
                  },
                },
              },
              {
                ...searchRequest.courses?.length && {
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

    return {
      statusCode: 200,
      body: posts,
      postsCount,
    }
  } catch (error) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Invalid Payload',
    })
  }
})