import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const userId = event.context.id.id

  await prisma.notification.deleteMany({
    where: {
      userId,
      hasSeen: true,
    },
  })

  deleteCookie(event, 'loggedIn')
  deleteCookie(event, 'token')
  return {
    status: 'success',
    data: 'Logged out',
  }
})
