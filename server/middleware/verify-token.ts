import jwt from 'jsonwebtoken'

const routes = [
  '/api/user/info',
  '/api/posts/create',
]

export default defineEventHandler(async (event) => {
  if (!routes.some(route => event.node.req.url?.startsWith(route)))
    return

  const { token } = parseCookies(event)

  if (!token) {
    throw createError({
      statusCode: 403,
      message: 'No token',
    })
  }

  jwt.verify(token, useRuntimeConfig().token_secret, (err, uid) => {
    if (err) {
      throw createError({
        statusCode: 403,
        message: 'Invalid token',
      })
    }
    event.context.uid = uid
  })
})
