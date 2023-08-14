import type { RouteLocationNormalized } from 'vue-router'

export default defineNuxtRouteMiddleware((to: RouteLocationNormalized) => {
  const { $auth } = useNuxtApp()

  if (to.path.startsWith('/login/'))
    return

  if (!$auth.isLoggedIn.value && to.path !== '/login')
    return navigateTo('/login')

  if ($auth.isLoggedIn.value && to.path === '/login')
    return navigateTo('/')
})
