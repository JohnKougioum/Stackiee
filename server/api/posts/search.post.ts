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

    const lectures = {
      semester: {
        equals: searchRequest.semester,
      },
      course: {
        equals: searchRequest.course,
      },
    }

    // const posts = await prisma.post.findMany({
    //   where: {
    //     OR: [
    //       {
    //         body: {
    //           contains: searchRequest.searchQuery,
    //         },
    //       },
    //       lectures,
    //     ],
    //   },
    //   skip: startIndex,
    //   take: limit,
    //   orderBy: {
    //     createdAt: 'desc',
    //   },
    //   include: {
    //     User: true,
    //   },
    // })
    const posts = await prisma.post.findMany({
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
