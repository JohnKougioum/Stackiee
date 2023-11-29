import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async () => {
  const users = await prisma.user.findMany()

  if (!users) {
    throw createError({
      statusCode: 404,
      statusMessage: 'NotFound',
    })
  }

  return {
    status: 'success',
    data: users,
  }
})
