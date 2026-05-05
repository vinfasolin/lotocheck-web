<script setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'

import BaseButton from '@/shared/components/BaseButton.vue'
import BaseInput from '@/shared/components/BaseInput.vue'
import ErrorAlert from '@/shared/components/ErrorAlert.vue'
import { useAuthStore } from '@/modules/auth/store/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const errorMessage = computed(() => {
  return Object.keys(authStore.errors || {}).length
    ? authStore.errors
    : authStore.error
})

async function submit() {
  try {
    await authStore.register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      password_confirmation: form.password_confirmation,
    })

    router.push({ name: 'dashboard' })
  } catch {
    // O auth.store já preenche authStore.errors ou authStore.error.
  }
}
</script>

<template>
  <form
    class="register-form stack"
    @submit.prevent="submit"
  >
    <ErrorAlert :message="errorMessage" />

    <BaseInput
      v-model="form.name"
      label="Nome"
      placeholder="Seu nome"
      autocomplete="name"
      required
    />

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
      placeholder="Crie uma senha"
      autocomplete="new-password"
      required
    />

    <BaseInput
      v-model="form.password_confirmation"
      label="Confirmar senha"
      type="password"
      placeholder="Repita sua senha"
      autocomplete="new-password"
      required
    />

    <BaseButton
      type="submit"
      :disabled="authStore.loading"
    >
      {{ authStore.loading ? 'Criando conta...' : 'Criar conta' }}
    </BaseButton>
  </form>
</template>