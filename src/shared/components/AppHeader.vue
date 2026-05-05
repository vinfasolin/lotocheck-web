<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import BaseButton from './BaseButton.vue'
import { useAuthStore } from '@/modules/auth/store/auth.store'

const authStore = useAuthStore()
const router = useRouter()

const loggingOut = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)

const userName = computed(() => {
  return authStore.user?.name || 'Usuário'
})

const userProviderLabel = computed(() => {
  const provider = authStore.user?.provider

  if (provider === 'guest') {
    return 'Visitante'
  }

  if (provider === 'google') {
    return 'Google'
  }

  return null
})

async function logout() {
  if (loggingOut.value) {
    return
  }

  loggingOut.value = true

  try {
    await authStore.logout()
    router.push({ name: 'home' })
  } finally {
    loggingOut.value = false
  }
}
</script>

<template>
  <header class="app-header app-header-local">
    <RouterLink
      class="brand"
      :to="{ name: 'home' }"
      aria-label="Ir para a página inicial do LotoCheck"
    >
      <span class="brand-mark">LC</span>
      <span>LotoCheck</span>
    </RouterLink>

    <nav
      class="main-nav app-header-local__nav"
      aria-label="Menu principal"
    >
      <RouterLink :to="{ name: 'results' }">
        Resultados
      </RouterLink>

      <RouterLink
        v-if="isAuthenticated"
        :to="{ name: 'dashboard' }"
      >
        Painel
      </RouterLink>

      <RouterLink
        v-if="isAuthenticated"
        :to="{ name: 'games' }"
      >
        Jogos
      </RouterLink>

      <RouterLink
        v-if="isAuthenticated"
        :to="{ name: 'checks' }"
      >
        Conferências
      </RouterLink>
    </nav>

    <div class="header-actions app-header-local__actions">
      <template v-if="isAuthenticated">
        <div class="app-header-local__user">
          <span class="user-chip">
            {{ userName }}
          </span>

          <small v-if="userProviderLabel">
            {{ userProviderLabel }}
          </small>
        </div>

        <BaseButton
          variant="ghost"
          :disabled="loggingOut"
          @click="logout"
        >
          {{ loggingOut ? 'Saindo...' : 'Sair' }}
        </BaseButton>
      </template>

      <template v-else>
        <BaseButton
          variant="ghost"
          @click="authStore.openAuthModal('guest')"
        >
          Visitante
        </BaseButton>

        <BaseButton @click="authStore.openAuthModal('login')">
          Entrar
        </BaseButton>
      </template>
    </div>
  </header>
</template>

<style scoped>
.app-header-local__user {
  display: grid;
  gap: 0.1rem;
  min-width: 0;
  text-align: right;
}

.app-header-local__user small {
  color: var(--color-muted);
  font-size: 0.75rem;
  font-weight: 800;
}

@media (max-width: 860px) {
  .app-header-local__nav,
  .app-header-local__actions {
    width: 100%;
  }

  .app-header-local__user {
    text-align: left;
  }
}
</style>