<script setup>
import { computed } from 'vue'

import BaseCard from '@/shared/components/BaseCard.vue'
import DrawnNumbers from './DrawnNumbers.vue'
import PrizeTable from './PrizeTable.vue'

const props = defineProps({
  result: {
    type: Object,
    default: null,
  },
})

const drawDate = computed(() => formatDate(props.result?.draw_date))
const syncedAt = computed(() => formatDateTime(props.result?.synced_at))

function formatDate(value) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('pt-BR').format(date)
}

function formatDateTime(value) {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}
</script>

<template>
  <BaseCard
    v-if="result"
    class="result-card-local"
  >
    <header class="result-card-local__header">
      <div>
        <span class="eyebrow">
          {{ result.lottery_label || 'Resultado' }}
        </span>

        <h2>
          Concurso {{ result.contest_number || '-' }}
        </h2>

        <p class="muted">
          Sorteio: {{ drawDate }}
        </p>
      </div>
    </header>

    <section class="result-card-local__section">
      <h3>Números sorteados</h3>

      <DrawnNumbers :numbers="result.numbers || []" />
    </section>

    <section class="result-card-local__section">
      <h3>Premiação</h3>

      <PrizeTable :prizes="result.prizes || []" />
    </section>

    <footer
      v-if="syncedAt"
      class="result-card-local__footer"
    >
      Atualizado em {{ syncedAt }}
    </footer>
  </BaseCard>
</template>

<style scoped>
.result-card-local {
  display: grid;
  gap: 1.25rem;
}

.result-card-local__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.result-card-local__header h2 {
  margin: 0;
  color: var(--color-text);
  font-size: 1.6rem;
  line-height: 1.2;
}

.result-card-local__header p {
  margin: 0.4rem 0 0;
}

.result-card-local__section {
  display: grid;
  gap: 0.75rem;
}

.result-card-local__section h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 1rem;
}

.result-card-local__footer {
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border);
  color: var(--color-muted);
  font-size: 0.88rem;
}
</style>