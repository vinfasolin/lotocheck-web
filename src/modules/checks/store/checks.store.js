import { defineStore } from 'pinia'

import { checksApi } from '../api/checks.api'
import { getErrorMessage } from '@/shared/utils/errors'

export const useChecksStore = defineStore('checks', {
  state: () => ({
    history: [],
    winners: [],
    historyMeta: null,
    winnersMeta: null,
    loading: false,
    error: '',
  }),

  actions: {
    clearError() {
      this.error = ''
    },

    async fetchHistory(params = {}) {
      this.loading = true
      this.clearError()

      try {
        const { data } = await checksApi.history(params)

        this.history = data.data || []
        this.historyMeta = data.meta || null

        return data
      } catch (error) {
        this.error = getErrorMessage(error, 'Não foi possível carregar o histórico de conferências.')
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchWinners(params = {}) {
      this.loading = true
      this.clearError()

      try {
        const { data } = await checksApi.winners(params)

        this.winners = data.data || []
        this.winnersMeta = data.meta || null

        return data
      } catch (error) {
        this.error = getErrorMessage(error, 'Não foi possível carregar os possíveis prêmios.')
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})