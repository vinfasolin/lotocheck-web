<script setup>
import { computed, onMounted, ref } from 'vue'

import EmptyState from '@/shared/components/EmptyState.vue'
import ErrorAlert from '@/shared/components/ErrorAlert.vue'
import LoadingState from '@/shared/components/LoadingState.vue'
import CheckCard from '../components/CheckCard.vue'
import CheckDetailsModal from '../components/CheckDetailsModal.vue'
import { useChecksStore } from '../store/checks.store'
import { getErrorMessage } from '@/shared/utils/errors'

const store = useChecksStore()

const tab = ref('history')
const selected = ref(null)
const show = ref(false)
const localError = ref('')

const list = computed(() => {
  return tab.value === 'winners' ? store.winners : store.history
})

const emptyTitle = computed(() => {
  return tab.value === 'winners'
    ? 'Nenhum possível prêmio encontrado'
    : 'Nenhuma conferência encontrada'
})

const emptyDescription = computed(() => {
  return tab.value === 'winners'
    ? 'Quando algum jogo tiver possível prêmio, ele aparecerá aqui.'
    : 'Confira seus jogos para gerar o histórico de conferências.'
})

onMounted(() => {
  refresh()
})

async function refresh() {
  localError.value = ''

  try {
    if (tab.value === 'winners') {
      await store.fetchWinners()
      return
    }

    await store.fetchHistory()
  } catch (error) {
    localError.value = getErrorMessage(error, 'Não foi possível carregar as conferências.')
  }
}

function switchTab(value) {
  if (tab.value === value) {
    return
  }

  tab.value = value
  refresh()
}

function details(check) {
  selected.value = check
  show.value = true
}
</script>

<template>
  <section class="page-section checks-view">
    <div class="page-header">
      <div>
        <span class="eyebrow">Conferências</span>
        <h1>Histórico e possíveis prêmios</h1>
        <p class="muted">
          Acompanhe as conferências feitas e veja rapidamente quando houver possível prêmio.
        </p>
      </div>
    </div>

    <div
      class="lottery-tabs checks-view__tabs"
      role="tablist"
      aria-label="Filtrar conferências"
    >
      <button
        type="button"
        :class="{ active: tab === 'history' }"
        :aria-pressed="tab === 'history'"
        :disabled="store.loading"
        @click="switchTab('history')"
      >
        Histórico
      </button>

      <button
        type="button"
        :class="{ active: tab === 'winners' }"
        :aria-pressed="tab === 'winners'"
        :disabled="store.loading"
        @click="switchTab('winners')"
      >
        Possíveis prêmios
      </button>
    </div>

    <ErrorAlert :message="localError || store.error" />

    <LoadingState
      v-if="store.loading"
      message="Carregando conferências..."
    />

    <EmptyState
      v-else-if="!list.length"
      :title="emptyTitle"
      :description="emptyDescription"
    />

    <div
      v-else
      class="cards-grid"
    >
      <CheckCard
        v-for="check in list"
        :key="check.id"
        :check="check"
        @details="details"
      />
    </div>

    <CheckDetailsModal
      v-model="show"
      :check="selected"
    />
  </section>
</template>

<style scoped>
.checks-view .page-header p {
  margin: 0.4rem 0 0;
}

.checks-view__tabs button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}
</style>