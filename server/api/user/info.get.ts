import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const userUid = event.context?.uid

  if (!userUid?.uid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const user = await prisma.user.findUnique({
    where: {
      uid: userUid.uid,
    },
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  return {
    status: 'success',
    data: user,
  }
})
