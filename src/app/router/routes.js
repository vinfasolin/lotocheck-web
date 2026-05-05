export const routes = [
  { path: '/', name: 'home', component: () => import('@/modules/home/views/HomeView.vue') },
  { path: '/dashboard', name: 'dashboard', meta: { requiresAuth: true }, component: () => import('@/modules/dashboard/views/DashboardView.vue') },
  { path: '/games', name: 'games', meta: { requiresAuth: true }, component: () => import('@/modules/games/views/GamesView.vue') },
  { path: '/results', name: 'results', component: () => import('@/modules/results/views/ResultsView.vue') },
  { path: '/checks', name: 'checks', meta: { requiresAuth: true }, component: () => import('@/modules/checks/views/ChecksView.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]
