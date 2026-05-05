import { defineStore } from 'pinia'

import { meApi } from '@/modules/dashboard/api/me.api'
import { getErrorMessage } from '@/shared/utils/errors'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    summary: null,
    loading: false,
    error: '',
  }),

  actions: {
    clearError() {
      this.error = ''
    },

    async fetchSummary() {
      this.loading = true
      this.clearError()

      try {
        const { data } = await meApi.summary()

        this.summary = data || null

        return this.summary
      } catch (error) {
        this.summary = null
        this.error = getErrorMessage(error, 'Não foi possível carregar o resumo.')

        throw error
      } finally {
        this.loading = false
      }
    },
  },
})