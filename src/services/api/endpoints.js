export const API_ENDPOINTS = {
  HEALTH: '/health',

  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    GOOGLE: '/auth/google',
    GUEST: '/auth/guest',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },

  ME: {
    SUMMARY: '/me/summary',
  },

  GAMES: {
    LIST: '/games',
    STORE: '/games',
    SHOW: (id) => `/games/${id}`,
    UPDATE: (id) => `/games/${id}`,
    DELETE: (id) => `/games/${id}`,
    CHECK: (id) => `/games/${id}/check`,
  },

  CHECKS: {
    MY_GAMES: '/checks/my-games',
    HISTORY: '/checks/history',
    WINNERS: '/checks/winners',
  },

  RESULTS: {
    LATEST: (lottery) => `/results/latest/${lottery}`,
    BY_CONTEST: (lottery, contest) => `/results/${lottery}/${contest}`,
    SYNC_LATEST: (lottery) => `/results/sync/latest/${lottery}`,
    SYNC_BY_CONTEST: (lottery, contest) => `/results/sync/${lottery}/${contest}`,
  },
}