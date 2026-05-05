<script setup>
import { onMounted, ref } from 'vue'

import EmptyState from '@/shared/components/EmptyState.vue'
import ErrorAlert from '@/shared/components/ErrorAlert.vue'
import LoadingState from '@/shared/components/LoadingState.vue'
import { LOTTERY_TYPES } from '@/shared/utils/lottery'
import ResultCard from '../components/ResultCard.vue'
import { useResultsStore } from '../store/results.store'

const store = useResultsStore()

const selected = ref('megasena')
const localError = ref('')

onMounted(() => {
  fetchResult()
})

async function fetchResult() {
  localError.value = ''

  try {
    await store.fetchLatest(selected.value)
  } catch {
    localError.value = 'Não foi possível carregar o resultado desta loteria.'
  }
}

function selectLottery(lotteryType) {
  if (selected.value === lotteryType) {
    return
  }

  selected.value = lotteryType
  fetchResult()
}
</script>

<template>
  <section class="page-section results-view">
    <div class="page-header">
      <div>
        <span class="eyebrow">Resultados</span>
        <h1>Últimos resultados</h1>
        <p class="muted">
          Consulte os resultados mais recentes das loterias disponíveis.
        </p>
      </div>
    </div>

    <div
      class="lottery-tabs results-view__tabs"
      role="tablist"
      aria-label="Selecionar loteria"
    >
      <button
        v-for="lottery in LOTTERY_TYPES"
        :key="lottery.value"
        type="button"
        :class="{ active: selected === lottery.value }"
        :aria-pressed="selected === lottery.value"
        :disabled="store.loading"
        @click="selectLottery(lottery.value)"
      >
        {{ lottery.label }}
      </button>
    </div>

    <ErrorAlert :message="localError || store.error" />

    <LoadingState
      v-if="store.loading"
      message="Carregando resultado..."
    />

    <ResultCard
      v-else-if="store.currentResult"
      :result="store.currentResult"
    />

    <EmptyState
      v-else
      title="Resultado não encontrado"
      description="Não foi possível encontrar o último resultado desta loteria."
    />
  </section>
</template>

<style scoped>
.results-view .page-header p {
  margin: 0.4rem 0 0;
}

.results-view__tabs button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}
</style>