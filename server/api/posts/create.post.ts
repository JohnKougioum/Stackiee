export default defineEventHandler(async (event) => {
  const response = await readBody(event)
  console.log(response)
  return { statusCode: 200, body: 'OK' }
})
