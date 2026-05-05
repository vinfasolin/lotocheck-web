import axios from 'axios'

import { sessionService } from '@/services/auth/session.service'
import { tokenService } from '@/services/auth/token.service'

const baseURL = import.meta.env.VITE_API_BASE_URL

if (!baseURL) {
  // Ajuda muito em desenvolvimento caso o .env esteja faltando ou errado.
  // Não bloqueia o build, mas deixa o erro claro no console.
  console.warn('VITE_API_BASE_URL não está configurado.')
}

export const apiClient = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const authorization = tokenService.getAuthorizationHeader()

  if (authorization) {
    config.headers.Authorization = authorization
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401 || status === 419) {
      sessionService.clear()

      window.dispatchEvent(
        new CustomEvent('lotocheck:unauthorized', {
          detail: {
            status,
            message: error.response?.data?.message || 'Sessão expirada.',
          },
        }),
      )
    }

    return Promise.reject(error)
  },
)