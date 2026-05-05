import { localStorageService } from '@/services/storage/local-storage.service'

const prefix = import.meta.env.VITE_STORAGE_PREFIX || 'lotocheck'

const tokenKey = `${prefix}_token`
const tokenTypeKey = `${prefix}_token_type`

export const tokenService = {
  getToken() {
    return localStorageService.get(tokenKey)
  },

  getTokenType() {
    return localStorageService.get(tokenTypeKey, 'Bearer') || 'Bearer'
  },

  setToken(token, tokenType = 'Bearer') {
    if (!token) {
      return
    }

    localStorageService.set(tokenKey, token)
    localStorageService.set(tokenTypeKey, tokenType || 'Bearer')
  },

  getAuthorizationHeader() {
    const token = this.getToken()

    if (!token) {
      return null
    }

    return `${this.getTokenType()} ${token}`
  },

  clear() {
    localStorageService.remove(tokenKey)
    localStorageService.remove(tokenTypeKey)
  },
}