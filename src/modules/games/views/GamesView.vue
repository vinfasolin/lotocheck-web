<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BaseButton from '@/shared/components/BaseButton.vue'
import EmptyState from '@/shared/components/EmptyState.vue'
import LoadingState from '@/shared/components/LoadingState.vue'
import ErrorAlert from '@/shared/components/ErrorAlert.vue'
import GameCard from '../components/GameCard.vue'
import GameFormModal from '../components/GameFormModal.vue'
import CheckResultModal from '../components/CheckResultModal.vue'
import { useGamesStore } from '../store/games.store'
import { getErrorMessage } from '@/shared/utils/errors'

const route = useRoute()
const router = useRouter()
const store = useGamesStore()

const showForm = ref(false)
const editing = ref(null)
const showChecks = ref(false)
const checks = ref([])
const feedbackMessage = ref('')
const localError = ref('')
const deletingId = ref(null)

onMounted(async () => {
  await loadGames()

  if (route.query.create === '1') {
    openCreate()
  }
})

watch(
  () => route.query.create,
  (value) => {
    if (value === '1') {
      openCreate()
    }
  },
)

async function loadGames() {
  localError.value = ''

  try {
    await store.fetchGames()
  } catch (error) {
    localError.value = getErrorMessage(error, 'Não foi possível carregar seus jogos.')
  }
}

function clearMessages() {
  feedbackMessage.value = ''
  localError.value = ''
}

function openCreate() {
  clearMessages()
  editing.value = null
  showForm.value = true
}

function openEdit(game) {
  clearMessages()
  editing.value = game
  showForm.value = true
}

async function onSaved() {
  feedbackMessage.value = editing.value
    ? 'Jogo atualizado com sucesso.'
    : 'Jogo cadastrado com sucesso.'

  editing.value = null

  if (route.query.create) {
    await router.replace({ name: 'games' })
  }

  await store.fetchGames()
}

async function remove(game) {
  clearMessages()

  const confirmed = window.confirm(`Deseja realmente excluir o jogo "${game.name}"?`)

  if (!confirmed) {
    return
  }

  deletingId.value = game.id

  try {
    await store.deleteGame(game.id)
    feedbackMessage.value = 'Jogo excluído com sucesso.'
  } catch (error) {
    localError.value = getErrorMessage(error, 'Não foi possível excluir o jogo.')
  } finally {
    deletingId.value = null
  }
}

async function check(game) {
  clearMessages()

  try {
    const response = await store.checkGame(game.id)
    checks.value = response.checks || []
    showChecks.value = true
    feedbackMessage.value = 'Jogo conferido com sucesso.'
  } catch (error) {
    localError.value = getErrorMessage(error, 'Não foi possível conferir este jogo.')
  }
}

async function checkAll() {
  clearMessages()

  try {
    const response = await store.checkMyGames()
    checks.value = response.checks || []
    showChecks.value = true
    feedbackMessage.value = 'Todos os jogos ativos foram conferidos.'
  } catch (error) {
    localError.value = getErrorMessage(error, 'Não foi possível conferir todos os jogos.')
  }
}
</script>

<template>
  <section class="page-section games-view">
    <div class="page-header">
      <div>
        <span class="eyebrow">Meus jogos</span>
        <h1>Jogos cadastrados</h1>
        <p class="muted">
          Cadastre, edite e confira seus jogos de forma simples.
        </p>
      </div>

      <div class="games-view__actions">
        <BaseButton
          variant="secondary"
          :disabled="store.checking || !store.games.length"
          @click="checkAll"
        >
          {{ store.checking ? 'Conferindo...' : 'Conferir todos' }}
        </BaseButton>

        <BaseButton @click="openCreate">
          Novo jogo
        </BaseButton>
      </div>
    </div>

    <div
      v-if="feedbackMessage"
      class="success-alert"
    >
      {{ feedbackMessage }}
    </div>

    <ErrorAlert :message="localError || store.error" />

    <LoadingState v-if="store.loading && !store.games.length" />

    <EmptyState
      v-else-if="!store.loading && !store.games.length"
      title="Nenhum jogo cadastrado"
      description="Cadastre seu primeiro jogo para começar a conferir seus números."
    >
      <BaseButton @click="openCreate">
        Cadastrar jogo
      </BaseButton>
    </EmptyState>

    <div
      v-else
      class="cards-grid"
    >
      <GameCard
        v-for="game in store.games"
        :key="game.id"
        :game="game"
        @edit="openEdit"
        @delete="remove"
        @check="check"
      />

      <div
        v-if="store.loading"
        class="games-view__soft-loading"
      >
        Atualizando lista...
      </div>
    </div>

    <p
      v-if="deletingId"
      class="muted"
    >
      Excluindo jogo...
    </p>

    <GameFormModal
      v-model="showForm"
      :game="editing"
      @saved="onSaved"
    />

    <CheckResultModal
      v-model="showChecks"
      :checks="checks"
    />
  </section>
</template>

<style scoped>
.games-view {
  position: relative;
}

.games-view .page-header p {
  margin: 0.4rem 0 0;
}

.games-view__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.success-alert {
  padding: 0.9rem 1rem;
  border: 1px solid #bbf7d0;
  border-radius: 14px;
  background: #f0fdf4;
  color: #166534;
  font-weight: 800;
}

.games-view__soft-loading {
  grid-column: 1 / -1;
  padding: 0.9rem 1rem;
  border: 1px dashed var(--color-border);
  border-radius: 14px;
  background: #ffffff;
  color: var(--color-muted);
  text-align: center;
}

@media (max-width: 640px) {
  .games-view__actions {
    width: 100%;
    flex-direction: column;
  }
}
</style>