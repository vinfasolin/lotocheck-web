import { apiClient } from '@/services/api/client'
import { API_ENDPOINTS } from '@/services/api/endpoints'

export const resultsApi = {
  latest(lottery) {
    return apiClient.get(API_ENDPOINTS.RESULTS.LATEST(lottery))
  },

  byContest(lottery, contest) {
    return apiClient.get(API_ENDPOINTS.RESULTS.BY_CONTEST(lottery, contest))
  },

  syncLatest(lottery) {
    return apiClient.post(API_ENDPOINTS.RESULTS.SYNC_LATEST(lottery))
  },

  syncByContest(lottery, contest) {
    return apiClient.post(API_ENDPOINTS.RESULTS.SYNC_BY_CONTEST(lottery, contest))
  },
}