import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const { token } = parseCookies(event)
  if (
    event.node.req.url?.startsWith('/login')
    || event.node.req.url?.startsWith('/api/login')
  )
    return

  if (!token) {
    deleteCookie(event, 'loggedIn')
    await sendRedirect(event, '/login', 401)
  }

  jwt.verify(token, useRuntimeConfig().token_secret, async (err, uid) => {
    if (err) {
      deleteCookie(event, 'loggedIn')
      await sendRedirect(event, '/login', 401)
    }
    else {
      event.context.uid = uid
    }
  })
})
