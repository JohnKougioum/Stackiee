import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const userId = event.context.id.id

  if (!userId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Missing user ID',
    })
  }

  const notifications = await prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (!notifications.length) {
    return {
      statusCode: 404,
      body: 'No notifications found',
    }
  }

  return {
    statusCode: 200,
    body: notifications,
  }
})
