<script setup>
import { computed } from 'vue'

import BaseModal from '@/shared/components/BaseModal.vue'
import GuestAccessForm from './GuestAccessForm.vue'
import GoogleLoginButton from './GoogleLoginButton.vue'
import LoginForm from './LoginForm.vue'
import RegisterForm from './RegisterForm.vue'
import { useAuthStore } from '@/modules/auth/store/auth.store'

const authStore = useAuthStore()

const show = computed({
  get: () => Boolean(authStore.modalMode),
  set: (value) => {
    if (!value) {
      authStore.closeAuthModal()
    }
  },
})

const title = computed(() => {
  const titles = {
    login: 'Entrar no LotoCheck',
    register: 'Criar conta',
    guest: 'Acesso visitante',
  }

  return titles[authStore.modalMode] || 'Acesso'
})

const subtitle = computed(() => {
  const subtitles = {
    login: 'Entre para cadastrar, conferir e acompanhar seus jogos.',
    register: 'Crie sua conta para salvar seus jogos com segurança.',
    guest: 'Acesse rapidamente sem senha para testar o sistema.',
  }

  return subtitles[authStore.modalMode] || ''
})
</script>

<template>
  <BaseModal
    v-model="show"
    :title="title"
  >
    <div class="auth-modal">
      <p
        v-if="subtitle"
        class="auth-modal__subtitle"
      >
        {{ subtitle }}
      </p>

      <LoginForm v-if="authStore.modalMode === 'login'" />

      <RegisterForm v-if="authStore.modalMode === 'register'" />

      <GuestAccessForm v-if="authStore.modalMode === 'guest'" />

      <template v-if="authStore.modalMode !== 'guest'">
        <div class="auth-modal__separator">
          <span>ou entre com Google</span>
        </div>

        <GoogleLoginButton />
      </template>

      <div class="auth-modal__switch">
        <button
          v-if="authStore.modalMode !== 'login'"
          type="button"
          @click="authStore.openAuthModal('login')"
        >
          Já tenho conta
        </button>

        <button
          v-if="authStore.modalMode !== 'register'"
          type="button"
          @click="authStore.openAuthModal('register')"
        >
          Criar conta
        </button>

        <button
          v-if="authStore.modalMode !== 'guest'"
          type="button"
          @click="authStore.openAuthModal('guest')"
        >
          Acessar como visitante
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.auth-modal {
  display: grid;
  gap: 1rem;
}

.auth-modal__subtitle {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.95rem;
  line-height: 1.45;
}

.auth-modal__separator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-muted);
  font-size: 0.86rem;
  font-weight: 700;
}

.auth-modal__separator::before,
.auth-modal__separator::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.auth-modal__separator span {
  white-space: nowrap;
}

.auth-modal__switch {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  padding-top: 0.35rem;
}

.auth-modal__switch button {
  border: 0;
  background: transparent;
  color: var(--color-primary);
  font-weight: 800;
}

.auth-modal__switch button:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .auth-modal__switch {
    align-items: center;
    flex-direction: column;
  }

  .auth-modal__separator span {
    white-space: normal;
    text-align: center;
  }
}
</style>