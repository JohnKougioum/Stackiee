export default defineEventHandler(async (event) => {
  deleteCookie(event, 'loggedIn')
  deleteCookie(event, 'token')
  return {
    status: 'success',
    data: 'Logged out',
  }
})
