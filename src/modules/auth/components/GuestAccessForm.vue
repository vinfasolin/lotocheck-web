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
  name: '',
})

async function submit() {
  try {
    await authStore.loginAsGuest({
      name: form.name.trim(),
    })

    router.push({ name: 'dashboard' })
  } catch {
    // O auth.store já preenche authStore.error e authStore.errors.
  }
}
</script>

<template>
  <form
    class="guest-access-form stack"
    @submit.prevent="submit"
  >
    <p class="muted">
      Entre rapidamente sem senha para testar o LotoCheck e cadastrar seus jogos.
    </p>

    <ErrorAlert :message="authStore.error || authStore.errors" />

    <BaseInput
      v-model="form.name"
      label="Nome de visitante"
      placeholder="Ex: Visitante Teste"
      autocomplete="name"
      required
    />

    <BaseButton
      type="submit"
      :disabled="authStore.loading"
    >
      {{ authStore.loading ? 'Entrando...' : 'Acessar como visitante' }}
    </BaseButton>
  </form>
</template>