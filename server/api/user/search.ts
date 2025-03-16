import { PrismaClient } from '@prisma/client'
import { object, string } from 'zod'
import { removeAccents } from '@/composables/i18n'

const prisma = new PrismaClient()

const userSearchSchema = object({
  searchString: string(),
})

export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event)

  try {
    userSearchSchema.parse(requestBody)
  }
  catch (_) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Invalid Payload',
    })
  }

  if (!requestBody.searchString) {
    return {
      status: 'success',
      data: [],
    }
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          fullName: {
            contains: removeAccents(requestBody.searchString),
            mode: 'insensitive',
          },
        },
        {
          fullNameEL: {
            contains: removeAccents(requestBody.searchString),
            mode: 'insensitive',
          },
        },
        {
          uid: {
            contains: requestBody.searchString,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: removeAccents(requestBody.searchString),
            mode: 'insensitive',
          },
        },
      ],
    },
  }) || []

  return {
    status: 'success',
    data: users,
  }
})
