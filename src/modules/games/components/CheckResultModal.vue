<script setup>
import { computed } from 'vue'

import BaseModal from '@/shared/components/BaseModal.vue'
import BaseBadge from '@/shared/components/BaseBadge.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  checks: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['update:modelValue'])

const hasChecks = computed(() => props.checks.length > 0)

function formatCurrency(value) {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const amount = Number(value)

  if (Number.isNaN(amount)) {
    return null
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount)
}

function formatDateTime(value) {
  if (!value) {
    return '-'
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

function numbersOrEmpty(numbers) {
  return Array.isArray(numbers) ? numbers : []
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    title="Resultado da conferência"
    size="lg"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div
      v-if="!hasChecks"
      class="state-box"
    >
      <strong>Nenhuma conferência encontrada</strong>
      <p>O backend não retornou resultados para este jogo.</p>
    </div>

    <div
      v-else
      class="check-result-modal"
    >
      <article
        v-for="check in checks"
        :key="check.id"
        class="check-result-card"
        :class="{ 'check-result-card--winner': check.has_prize }"
      >
        <header class="check-result-card__header">
          <div class="check-result-card__title">
            <BaseBadge :variant="check.has_prize ? 'success' : 'neutral'">
              {{ check.has_prize ? 'Possível prêmio' : 'Sem prêmio' }}
            </BaseBadge>

            <h3>{{ check.game?.name || 'Jogo conferido' }}</h3>

            <p class="muted">
              {{ check.result?.lottery_label || check.game?.lottery_label }}
              <span v-if="check.contest_number">
                • Concurso {{ check.contest_number }}
              </span>
            </p>
          </div>

          <BaseBadge v-if="check.is_mirror">
            Espelho
          </BaseBadge>
        </header>

        <div class="check-result-card__summary">
          <div>
            <span class="check-result-card__label">Acertos</span>
            <strong>{{ check.hits_count }}</strong>
          </div>

          <div>
            <span class="check-result-card__label">Faixa</span>
            <strong>{{ check.prize_label || '-' }}</strong>
          </div>

          <div>
            <span class="check-result-card__label">Prêmio</span>
            <strong>{{ formatCurrency(check.prize_amount) || '-' }}</strong>
          </div>
        </div>

        <section class="check-result-card__section">
          <h4>Números sorteados</h4>

          <div class="check-result-card__numbers">
            <span
              v-for="number in numbersOrEmpty(check.drawn_numbers)"
              :key="`drawn-${check.id}-${number}`"
              class="check-result-card__number check-result-card__number--drawn"
            >
              {{ number }}
            </span>
          </div>
        </section>

        <section class="check-result-card__section">
          <h4>Seus números conferidos</h4>

          <div class="check-result-card__numbers">
            <span
              v-for="number in numbersOrEmpty(check.checked_numbers)"
              :key="`checked-${check.id}-${number}`"
              class="check-result-card__number"
              :class="{ 'check-result-card__number--hit': numbersOrEmpty(check.hit_numbers).includes(number) }"
            >
              {{ number }}
            </span>
          </div>
        </section>

        <section class="check-result-card__section">
          <h4>Acertos</h4>

          <div
            v-if="numbersOrEmpty(check.hit_numbers).length"
            class="check-result-card__numbers"
          >
            <span
              v-for="number in numbersOrEmpty(check.hit_numbers)"
              :key="`hit-${check.id}-${number}`"
              class="check-result-card__number check-result-card__number--hit"
            >
              {{ number }}
            </span>
          </div>

          <p
            v-else
            class="muted"
          >
            Nenhum número acertado nesta conferência.
          </p>
        </section>

        <footer class="check-result-card__footer">
          <span>
            Conferido em {{ formatDateTime(check.checked_at) }}
          </span>

          <span v-if="check.notified_at">
            E-mail enviado em {{ formatDateTime(check.notified_at) }}
          </span>
        </footer>
      </article>
    </div>
  </BaseModal>
</template>

<style scoped>
.check-result-modal {
  display: grid;
  gap: 1rem;
}

.check-result-card {
  display: grid;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: #ffffff;
}

.check-result-card--winner {
  border-color: rgba(22, 163, 74, 0.45);
  background: linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%);
}

.check-result-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.check-result-card__title {
  display: grid;
  gap: 0.45rem;
}

.check-result-card__title h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 1.15rem;
  line-height: 1.25;
}

.check-result-card__title p {
  margin: 0;
}

.check-result-card__summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.check-result-card__summary > div {
  padding: 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: #ffffff;
}

.check-result-card__summary strong {
  display: block;
  margin-top: 0.25rem;
  color: var(--color-text);
  font-size: 1rem;
}

.check-result-card__label {
  display: block;
  color: var(--color-muted);
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.check-result-card__section {
  display: grid;
  gap: 0.55rem;
}

.check-result-card__section h4 {
  margin: 0;
  color: var(--color-text);
  font-size: 0.92rem;
}

.check-result-card__numbers {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.check-result-card__number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  min-width: 34px;
  height: 34px;
  min-height: 34px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: #ffffff;
  color: var(--color-text);
  font-size: 0.82rem;
  font-weight: 900;
  line-height: 1;
}

.check-result-card__number--drawn {
  background: #eff6ff;
  color: #1d4ed8;
}

.check-result-card__number--hit {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: #ffffff;
}

.check-result-card__footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border);
  color: var(--color-muted);
  font-size: 0.88rem;
}

@media (max-width: 640px) {
  .check-result-card__header {
    flex-direction: column;
  }

  .check-result-card__summary {
    grid-template-columns: 1fr;
  }
}
</style>