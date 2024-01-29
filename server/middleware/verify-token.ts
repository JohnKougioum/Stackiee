import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const { token } = parseCookies(event)
  if (
    event.node.req.url?.startsWith('/login')
    || event.node.req.url?.startsWith('/api/login')
    || event.node.req.url?.startsWith('/favicon.ico')
  )
    return

  if (!token) {
    deleteCookie(event, 'loggedIn')
    deleteCookie(event, 'token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    })
    return await sendRedirect(event, '/login', 401)
  }

  jwt.verify(token, useRuntimeConfig().token_secret, async (err, uid) => {
    if (err) {
      deleteCookie(event, 'loggedIn')
      deleteCookie(event, 'token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      })
      return await sendRedirect(event, '/login', 401)
    }
    event.context.uid = uid
  })
})
