import { apiClient } from '@/services/api/client'
import { API_ENDPOINTS } from '@/services/api/endpoints'

export const checksApi = {
  checkMyGames() {
    return apiClient.post(API_ENDPOINTS.CHECKS.MY_GAMES)
  },

  history(params = {}) {
    return apiClient.get(API_ENDPOINTS.CHECKS.HISTORY, { params })
  },

  winners(params = {}) {
    return apiClient.get(API_ENDPOINTS.CHECKS.WINNERS, { params })
  },
}