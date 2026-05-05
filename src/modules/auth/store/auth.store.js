import { defineStore } from 'pinia'

import { authApi } from '@/modules/auth/api/auth.api'
import { sessionService } from '@/services/auth/session.service'
import { getErrorMessage, getValidationErrors } from '@/shared/utils/errors'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    modalMode: null,
    loading: false,
    error: '',
    errors: {},
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },

  actions: {
    clearErrors() {
      this.error = ''
      this.errors = {}
    },

    restoreSession() {
      this.user = sessionService.getUser()
      this.token = sessionService.hasSession() ? 'stored-token' : null
      this.clearErrors()
    },

    openAuthModal(mode = 'login') {
      this.modalMode = mode
      this.clearErrors()
    },

    closeAuthModal() {
      this.modalMode = null
      this.clearErrors()
    },

    saveSession(payload) {
      sessionService.save(payload)

      this.user = payload.user || null
      this.token = payload.token || null

      this.closeAuthModal()
    },

    async register(payload) {
      return this.runAuthRequest(() => authApi.register(payload))
    },

    async login(payload) {
      return this.runAuthRequest(() => authApi.login(payload))
    },

    async loginWithGoogle(credential) {
      return this.runAuthRequest(() => authApi.google({ credential }))
    },

    async loginAsGuest(payload) {
      return this.runAuthRequest(() => authApi.guest(payload))
    },

    async fetchMe() {
      if (!sessionService.hasSession()) {
        this.user = null
        this.token = null
        return null
      }

      this.loading = true
      this.clearErrors()

      try {
        const { data } = await authApi.me()

        this.user = data.user || null
        this.token = sessionService.hasSession() ? 'stored-token' : null

        return this.user
      } catch (error) {
        const validationErrors = getValidationErrors(error)

        this.errors = validationErrors
        this.error = Object.keys(validationErrors).length
          ? ''
          : getErrorMessage(error, 'Não foi possível carregar os dados do usuário.')

        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      this.clearErrors()

      try {
        if (sessionService.hasSession()) {
          await authApi.logout()
        }
      } catch {
        // Mesmo se o backend falhar, o front precisa encerrar a sessão local.
      } finally {
        sessionService.clear()

        this.user = null
        this.token = null
        this.modalMode = null
        this.loading = false
      }
    },

    async runAuthRequest(request) {
      this.loading = true
      this.clearErrors()

      try {
        const { data } = await request()

        this.saveSession(data)

        return data
      } catch (error) {
        const validationErrors = getValidationErrors(error)

        this.errors = validationErrors
        this.error = Object.keys(validationErrors).length
          ? ''
          : getErrorMessage(error, 'Não foi possível autenticar.')

        throw error
      } finally {
        this.loading = false
      }
    },
  },
})