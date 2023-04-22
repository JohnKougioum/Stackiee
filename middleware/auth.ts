import type { RouteLocationNormalized } from 'vue-router'

export default defineNuxtRouteMiddleware((to: RouteLocationNormalized) => {
  const { $auth } = useNuxtApp()
  if (process.server)
    return

  if (isHydrated.value)
    return handleAuth(to, $auth.isLoggedIn.value, $auth.redirectToLogin)

  onHydrated(() => handleAuth(to, $auth.isLoggedIn.value, $auth.redirectToLogin))
})

function handleAuth(to: RouteLocationNormalized, isLoggedIn: boolean, redirectToLogin: () => void) {
  if (!isLoggedIn) {
    console.log(to.path)

    return redirectToLogin()
  }
}
