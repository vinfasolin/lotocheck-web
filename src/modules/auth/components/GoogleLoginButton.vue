<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import ErrorAlert from '@/shared/components/ErrorAlert.vue'
import { googleAuthService } from '@/services/auth/google-auth.service'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { getErrorMessage } from '@/shared/utils/errors'

const host = ref(null)
const localError = ref('')
const loading = ref(false)

const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  localError.value = ''

  try {
    await googleAuthService.renderButton(host.value, async (response) => {
      if (!response?.credential) {
        localError.value = 'Não foi possível obter a credencial do Google.'
        return
      }

      loading.value = true
      localError.value = ''

      try {
        await authStore.loginWithGoogle(response.credential)
        router.push({ name: 'dashboard' })
      } catch (error) {
        localError.value = getErrorMessage(error, 'Não foi possível entrar com Google.')
      } finally {
        loading.value = false
      }
    })
  } catch (error) {
    localError.value = getErrorMessage(error, 'Não foi possível carregar o botão do Google.')
  }
})
</script>

<template>
  <div class="google-login-button">
    <ErrorAlert :message="localError" />

    <div
      ref="host"
      class="google-button-host"
      :class="{ 'google-button-host--loading': loading }"
    />

    <p
      v-if="loading"
      class="google-login-button__loading"
    >
      Entrando com Google...
    </p>
  </div>
</template>

<style scoped>
.google-login-button {
  display: grid;
  gap: 0.65rem;
}

.google-button-host {
  display: grid;
  min-height: 44px;
}

.google-button-host--loading {
  pointer-events: none;
  opacity: 0.65;
}

.google-login-button__loading {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.9rem;
  text-align: center;
}
</style>