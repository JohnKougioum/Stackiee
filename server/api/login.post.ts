import { PrismaClient } from '@prisma/client'
import z from 'zod'
import jwt from 'jsonwebtoken'

const token_secret = useRuntimeConfig().token_secret

const loginPayloadSchema = z.object({
  uid: z.string(),
  am: z.string(),
  fullName: z.string(),
  fullNameEL: z.string(),
  email: z.string(),
  eduPersonAffiliation: z.string(),
  eduPersonPrimaryAffiliation: z.string(),
  regyear: z.string(),
})

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const response = await readBody(event)
  try {
    loginPayloadSchema.parse(response)
  }
  catch (error) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Invalid Payload',
    })
  }
  const user = await prisma.user.findUnique({
    where: {
      uid: response.uid,
    },
  })

  let token = ''
  if (!user) {
    const newUser = await prisma.user.create({
      data: {
        uid: response.uid,
        am: response.am,
        fullName: response.fullName,
        fullNameEL: response.fullNameEL,
        email: response.email,
        eduPersonAffiliation: response.eduPersonAffiliation,
        eduPersonPrimaryAffiliation: response.eduPersonPrimaryAffiliation,
        regyear: response.regyear,
      },
    })
    token = jwt.sign({ id: newUser.id }, token_secret, { expiresIn: '86400s' })
  }
  else {
    token = jwt.sign({ id: user.id }, token_secret, { expiresIn: '86400s' })
  }

  setCookie(event, 'loggedIn', 'true')
  setCookie(event, 'token', token, {
    sameSite: 'lax',
    httpOnly: true,
  })
  return { statusCode: 200, body: 'OK' }
})
