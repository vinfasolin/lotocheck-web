import { apiClient } from '@/services/api/client'
import { API_ENDPOINTS } from '@/services/api/endpoints'

export const authApi = {
  register(payload) {
    return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, payload)
  },

  login(payload) {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, payload)
  },

  google(payload) {
    return apiClient.post(API_ENDPOINTS.AUTH.GOOGLE, payload)
  },

  guest(payload) {
    return apiClient.post(API_ENDPOINTS.AUTH.GUEST, payload)
  },

  me() {
    return apiClient.get(API_ENDPOINTS.AUTH.ME)
  },

  logout() {
    return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
  },
}