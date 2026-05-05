<script setup>
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

import AppFooter from '@/shared/components/AppFooter.vue'
import AppHeader from '@/shared/components/AppHeader.vue'
import AuthModal from '@/modules/auth/components/AuthModal.vue'
import { useAuthStore } from '@/modules/auth/store/auth.store'

const authStore = useAuthStore()
const route = useRoute()

const allowedAuthModes = ['login', 'register', 'guest']

onMounted(() => {
  authStore.restoreSession()
  window.addEventListener('lotocheck:unauthorized', handleUnauthorized)
})

onBeforeUnmount(() => {
  window.removeEventListener('lotocheck:unauthorized', handleUnauthorized)
})

watch(
  () => route.query.auth,
  (mode) => {
    if (!authStore.isAuthenticated && allowedAuthModes.includes(mode)) {
      authStore.openAuthModal(mode)
    }
  },
  { immediate: true },
)

function handleUnauthorized() {
  authStore.user = null
  authStore.token = null
  authStore.openAuthModal('login')
}
</script>

<template>
  <div class="app-shell">
    <AppHeader />

    <main class="app-main">
      <RouterView />
    </main>

    <AppFooter />
    <AuthModal />
  </div>
</template>