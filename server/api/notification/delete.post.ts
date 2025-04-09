import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const notificationId = await readBody(event).then(body => body.notificationId)
  const userId = event.context.id.id
  console.log('Notification ID:', notificationId, userId)

  if (!notificationId || !userId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Missing notification ID',
    })
  }

  try {
    const notification = await prisma.notification.findUniqueOrThrow({
      where: {
        id: notificationId,
        userId,
      },
    })

    if (Object.keys(notification).length) {
      await prisma.notification.delete({
        where: {
          id: notificationId,
        },
      })

      return {
        statusCode: 200,
        body: { message: 'Notification deleted successfully' },
      }
    }
    else {
      throw createError({
        statusCode: 404,
        statusMessage: 'Notification not found',
      })
    }
  }
  catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Internal Server Error',
    })
  }
})
