import { defineStore } from 'pinia'

import { resultsApi } from '../api/results.api'
import { getErrorMessage } from '@/shared/utils/errors'

export const useResultsStore = defineStore('results', {
  state: () => ({
    latestResults: {},
    currentResult: null,
    loading: false,
    error: '',
  }),

  actions: {
    clearError() {
      this.error = ''
    },

    async fetchLatest(lottery) {
      this.loading = true
      this.clearError()

      try {
        const { data } = await resultsApi.latest(lottery)

        this.currentResult = data.result || null

        if (data.result?.lottery_type) {
          this.latestResults[data.result.lottery_type] = data.result
        } else if (lottery) {
          this.latestResults[lottery] = data.result || null
        }

        return this.currentResult
      } catch (error) {
        this.currentResult = null
        this.error = getErrorMessage(error, 'Não foi possível carregar o último resultado.')

        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchByContest(lottery, contest) {
      this.loading = true
      this.clearError()

      try {
        const { data } = await resultsApi.byContest(lottery, contest)

        this.currentResult = data.result || null

        return this.currentResult
      } catch (error) {
        this.currentResult = null
        this.error = getErrorMessage(error, 'Não foi possível carregar o resultado deste concurso.')

        throw error
      } finally {
        this.loading = false
      }
    },
  },
})