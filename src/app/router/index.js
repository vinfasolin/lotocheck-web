import { createRouter, createWebHistory } from 'vue-router'

import { routes } from './routes'
import { sessionService } from '@/services/auth/session.service'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return {
      top: 0,
    }
  },
})

router.beforeEach((to) => {
  const requiresAuth = Boolean(to.meta.requiresAuth)
  const isAuthenticated = sessionService.hasSession()

  if (requiresAuth && !isAuthenticated) {
    return {
      name: 'home',
      query: {
        auth: 'login',
        redirect: to.fullPath,
      },
    }
  }

  return true
})

export default router