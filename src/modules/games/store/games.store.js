import { defineStore } from 'pinia'

import { checksApi } from '@/modules/checks/api/checks.api'
import { gamesApi } from '@/modules/games/api/games.api'
import { getErrorMessage, getValidationErrors } from '@/shared/utils/errors'

export const useGamesStore = defineStore('games', {
  state: () => ({
    games: [],
    meta: null,
    loading: false,
    saving: false,
    checking: false,
    deletingId: null,
    error: '',
    errors: {},
  }),

  actions: {
    clearErrors() {
      this.error = ''
      this.errors = {}
    },

    async fetchGames(params = {}) {
      this.loading = true
      this.clearErrors()

      try {
        const { data } = await gamesApi.list(params)

        this.games = data.data || []
        this.meta = data.meta || null

        return data
      } catch (error) {
        this.error = getErrorMessage(error, 'Não foi possível carregar seus jogos.')
        throw error
      } finally {
        this.loading = false
      }
    },

    async createGame(payload) {
      return this.save(() => gamesApi.create(payload))
    },

    async updateGame(id, payload) {
      return this.save(() => gamesApi.update(id, payload))
    },

    async save(request) {
      this.saving = true
      this.clearErrors()

      try {
        const { data } = await request()

        await this.fetchGames()

        return data
      } catch (error) {
        this.error = getErrorMessage(error, 'Não foi possível salvar o jogo.')
        this.errors = getValidationErrors(error)

        throw error
      } finally {
        this.saving = false
      }
    },

    async deleteGame(id) {
      this.deletingId = id
      this.clearErrors()

      try {
        await gamesApi.delete(id)

        this.games = this.games.filter((game) => game.id !== id)
      } catch (error) {
        this.error = getErrorMessage(error, 'Não foi possível excluir o jogo.')

        throw error
      } finally {
        this.deletingId = null
      }
    },

    async checkGame(id) {
      this.checking = true
      this.clearErrors()

      try {
        const { data } = await gamesApi.check(id)

        await this.fetchGames()

        return data
      } catch (error) {
        this.error = getErrorMessage(error, 'Não foi possível conferir este jogo.')

        throw error
      } finally {
        this.checking = false
      }
    },

    async checkMyGames() {
      this.checking = true
      this.clearErrors()

      try {
        const { data } = await checksApi.checkMyGames()

        await this.fetchGames()

        return data
      } catch (error) {
        this.error = getErrorMessage(error, 'Não foi possível conferir seus jogos.')

        throw error
      } finally {
        this.checking = false
      }
    },
  },
})