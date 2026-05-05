const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

let googleLoadPromise = null
let initialized = false
let currentCredentialCallback = null

function waitForGoogle(timeout = 8000) {
  if (googleLoadPromise) {
    return googleLoadPromise
  }

  googleLoadPromise = new Promise((resolve, reject) => {
    const startedAt = Date.now()

    const timer = window.setInterval(() => {
      if (window.google?.accounts?.id) {
        window.clearInterval(timer)
        resolve(window.google)
        return
      }

      if (Date.now() - startedAt > timeout) {
        window.clearInterval(timer)
        reject(new Error('Google Identity Services não carregou.'))
      }
    }, 120)
  })

  return googleLoadPromise
}

function ensureGoogleClientId() {
  if (!googleClientId) {
    throw new Error('VITE_GOOGLE_CLIENT_ID não está configurado no .env do front-end.')
  }
}

function initializeGoogle(google) {
  if (initialized) {
    return
  }

  google.accounts.id.initialize({
    client_id: googleClientId,
    ux_mode: 'popup',
    callback: (response) => {
      if (typeof currentCredentialCallback === 'function') {
        currentCredentialCallback(response)
      }
    },
  })

  initialized = true
}

export const googleAuthService = {
  async renderButton(element, callback) {
    ensureGoogleClientId()

    if (!element) {
      throw new Error('Elemento do botão Google não encontrado.')
    }

    const google = await waitForGoogle()

    currentCredentialCallback = callback

    initializeGoogle(google)

    element.replaceChildren()

    google.accounts.id.renderButton(element, {
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      text: 'signin_with',
      width: element.offsetWidth || 320,
    })
  },
}