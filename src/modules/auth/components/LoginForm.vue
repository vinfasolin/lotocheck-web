<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

import BaseButton from '@/shared/components/BaseButton.vue'
import BaseInput from '@/shared/components/BaseInput.vue'
import ErrorAlert from '@/shared/components/ErrorAlert.vue'
import { useAuthStore } from '@/modules/auth/store/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

async function submit() {
  try {
    await authStore.login({
      email: form.email,
      password: form.password,
    })

    router.push({ name: 'dashboard' })
  } catch {
    // O auth.store já preenche authStore.error e authStore.errors.
  }
}
</script>

<template>
  <form
    class="login-form stack"
    @submit.prevent="submit"
  >
    <ErrorAlert :message="authStore.error || authStore.errors" />

    <BaseInput
      v-model="form.email"
      label="E-mail"
      type="email"
      placeholder="seuemail@exemplo.com"
      autocomplete="email"
      required
    />

    <BaseInput
      v-model="form.password"
      label="Senha"
      type="password"
      placeholder="Digite sua senha"
      autocomplete="current-password"
      required
    />

    <BaseButton
      type="submit"
      :disabled="authStore.loading"
    >
      {{ authStore.loading ? 'Entrando...' : 'Entrar' }}
    </BaseButton>
  </form>
</template>