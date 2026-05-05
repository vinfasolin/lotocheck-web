function getStorage() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null
  }

  return window.localStorage
}

export const localStorageService = {
  get(key, fallback = null) {
    try {
      const storage = getStorage()

      if (!storage) {
        return fallback
      }

      const value = storage.getItem(key)

      return value ? JSON.parse(value) : fallback
    } catch {
      return fallback
    }
  },

  set(key, value) {
    try {
      const storage = getStorage()

      if (!storage) {
        return
      }

      storage.setItem(key, JSON.stringify(value))
    } catch {
      // Falha silenciosa para não quebrar a experiência do usuário.
    }
  },

  remove(key) {
    try {
      const storage = getStorage()

      if (!storage) {
        return
      }

      storage.removeItem(key)
    } catch {
      // Falha silenciosa para não quebrar a experiência do usuário.
    }
  },

  clearByPrefix(prefix) {
    try {
      const storage = getStorage()

      if (!storage) {
        return
      }

      Object.keys(storage)
        .filter((key) => key.startsWith(prefix))
        .forEach((key) => storage.removeItem(key))
    } catch {
      // Falha silenciosa para não quebrar a experiência do usuário.
    }
  },
}