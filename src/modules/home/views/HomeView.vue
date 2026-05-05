<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import BaseButton from '@/shared/components/BaseButton.vue'
import BaseCard from '@/shared/components/BaseCard.vue'
import { useAuthStore } from '@/modules/auth/store/auth.store'

const authStore = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated)

function start() {
  if (isAuthenticated.value) {
    router.push({ name: 'dashboard' })
    return
  }

  authStore.openAuthModal('login')
}

function openRegister() {
  authStore.openAuthModal('register')
}

function openGuestAccess() {
  authStore.openAuthModal('guest')
}

function goToResults() {
  router.push({ name: 'results' })
}
</script>

<template>
  <section class="hero-section home-view">
    <div class="hero-content">
      <span class="eyebrow">
        Mega-Sena • Quina • Lotofácil • Lotomania
      </span>

      <h1>
        Confira seus jogos de loteria em poucos cliques.
      </h1>

      <p>
        Cadastre jogos, veja resultados, confira acertos e receba alerta quando houver possível prêmio.
      </p>

      <div class="hero-actions">
        <BaseButton @click="start">
          {{ isAuthenticated ? 'Ir para o painel' : 'Começar' }}
        </BaseButton>

        <BaseButton
          variant="secondary"
          @click="goToResults"
        >
          Ver resultados
        </BaseButton>

        <BaseButton
          v-if="!isAuthenticated"
          variant="ghost"
          @click="openGuestAccess"
        >
          Acessar como visitante
        </BaseButton>
      </div>

      <div
        v-if="!isAuthenticated"
        class="home-view__register"
      >
        Ainda não tem conta?
        <button
          type="button"
          @click="openRegister"
        >
          Criar conta grátis
        </button>
      </div>
    </div>

    <BaseCard class="hero-card home-view__card">
      <span class="eyebrow">
        Destaque
      </span>

      <h2>
        Lotomania com espelho
      </h2>

      <p>
        Você cadastra 50 números e o sistema também confere automaticamente
        os outros 50 números que você não marcou.
      </p>

      <ul>
        <li>Conferência do jogo principal</li>
        <li>Conferência automática do espelho</li>
        <li>Histórico e possíveis prêmios</li>
      </ul>
    </BaseCard>
  </section>
</template>

<style scoped>
.home-view__register {
  margin-top: 1rem;
  color: var(--color-muted);
  font-size: 0.95rem;
}

.home-view__register button {
  border: 0;
  background: transparent;
  color: var(--color-primary);
  font-weight: 900;
}

.home-view__register button:hover {
  text-decoration: underline;
}

.home-view__card {
  align-self: center;
}

.home-view__card h2 {
  margin-bottom: 0.6rem;
}

.home-view__card p {
  color: var(--color-muted);
  line-height: 1.5;
}

.home-view__card ul {
  display: grid;
  gap: 0.45rem;
  margin: 1rem 0 0;
  padding-left: 1.2rem;
  color: var(--color-muted);
}
</style>