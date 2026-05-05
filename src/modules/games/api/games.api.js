import { apiClient } from '@/services/api/client'
import { API_ENDPOINTS } from '@/services/api/endpoints'

export const gamesApi = {
  list(params = {}) {
    return apiClient.get(API_ENDPOINTS.GAMES.LIST, { params })
  },

  show(id) {
    return apiClient.get(API_ENDPOINTS.GAMES.SHOW(id))
  },

  create(payload) {
    return apiClient.post(API_ENDPOINTS.GAMES.STORE, payload)
  },

  update(id, payload) {
    return apiClient.put(API_ENDPOINTS.GAMES.UPDATE(id), payload)
  },

  delete(id) {
    return apiClient.delete(API_ENDPOINTS.GAMES.DELETE(id))
  },

  check(id) {
    return apiClient.post(API_ENDPOINTS.GAMES.CHECK(id))
  },
}