import { PrismaClient } from '@prisma/client'
import type { IhuApiProfile } from '@/types/index'
import z from 'zod'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

const payload = z.object({
  accessToken: z.string()
})

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  let body, token;
  try {
    body = await readBody(event)
    payload.parse(body)
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user data received.',
    })
  }

  const  profile = await $fetch<IhuApiProfile>('https://api.iee.ihu.gr/profile', {
    method: 'GET',
    headers: {
      'x-access-token': body.accessToken,
    },
  })

  if (!profile) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Invalid IHU Access Token'
    })
  }

  let user = await prisma.user.findUnique({ where: { uid: profile?.uid } })

  if (!user) {
    user = await prisma.user.create({
      data: {
        uid: profile?.uid,
        am: profile?.am,
        fullName: profile?.cn,
        fullNameEL: profile!['cn;lang-el'],
        email: profile?.mail,
        eduPersonAffiliation: profile?.eduPersonAffiliation,
        eduPersonPrimaryAffiliation: profile?.eduPersonPrimaryAffiliation,
        regyear: profile?.regyear,
      },
    })
  }

  token = jwt.sign({ uid: user.uid }, config.token_secret, { expiresIn: '86400s' })
  setCookie(event, 'loggedIn', 'true')
  setCookie(event, 'token', token, { sameSite: 'lax', httpOnly: true })
  
  return { statusCode: 200, body: 'OK' }
})
