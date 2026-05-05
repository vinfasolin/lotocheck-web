import { localStorageService } from '@/services/storage/local-storage.service'
import { tokenService } from './token.service'

const prefix = import.meta.env.VITE_STORAGE_PREFIX || 'lotocheck'
const userKey = `${prefix}_user`

export const sessionService = {
  save({ token, token_type: tokenType = 'Bearer', user }) {
    if (!token) {
      return
    }

    tokenService.setToken(token, tokenType || 'Bearer')
    localStorageService.set(userKey, user || null)
  },

  getUser() {
    return localStorageService.get(userKey)
  },

  getToken() {
    return tokenService.getToken()
  },

  getAuthorizationHeader() {
    return tokenService.getAuthorizationHeader()
  },

  hasSession() {
    return Boolean(tokenService.getToken())
  },

  clear() {
    tokenService.clear()
    localStorageService.remove(userKey)
  },
}