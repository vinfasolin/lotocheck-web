import { apiClient } from '@/services/api/client'
import { API_ENDPOINTS } from '@/services/api/endpoints'

export const meApi = {
  summary() {
    return apiClient.get(API_ENDPOINTS.ME.SUMMARY)
  },
}