import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const requestBody = await readBody(event)
  const userId = event.context.id.id

  if ((!requestBody.notificationId && !requestBody.fromId) || !userId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Missing notification ID',
    })
  }

  try {
    if (requestBody.notificationId) {
      await prisma.notification.findUniqueOrThrow({
        where: {
          id: requestBody.notificationId,
          userId,
        },
      })
      await prisma.notification.update({
        where: {
          id: requestBody.notificationIdsearchId,
          userId,
        },
        data: {
          hasSeen: true,
        },
      })
    }
    else if (requestBody.fromId) {
      const notifications = await prisma.notification.findMany({
        where: {
          fromId: requestBody.fromId,
          userId,
        },
      })

      if (!notifications.length) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Notification not found',
        })
      }

      await prisma.notification.updateMany({
        where: {
          fromId: requestBody.fromId,
          userId,
        },
        data: {
          hasSeen: true,
        },
      })
    }
    return {
      statusCode: 200,
      body: { message: 'Notification updated successfully' },
    }
  }
  catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Internal Server Error',
    })
  }
})
