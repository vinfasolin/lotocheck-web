<script setup>
import { computed } from 'vue'

import BaseModal from '@/shared/components/BaseModal.vue'
import BaseBadge from '@/shared/components/BaseBadge.vue'
import HitNumbers from './HitNumbers.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  check: {
    type: Object,
    default: null,
  },
})

defineEmits(['update:modelValue'])

const lotteryLabel = computed(() => {
  return props.check?.result?.lottery_label || props.check?.game?.lottery_label || 'Loteria'
})

const hasPrize = computed(() => Boolean(props.check?.has_prize))

const prizeAmount = computed(() => {
  const value = props.check?.prize_amount

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
})

const checkedAt = computed(() => formatDateTime(props.check?.checked_at))
const notifiedAt = computed(() => formatDateTime(props.check?.notified_at))

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

function numbersOrEmpty(numbers) {
  return Array.isArray(numbers) ? numbers : []
}

function isHit(number) {
  return numbersOrEmpty(props.check?.hit_numbers).includes(number)
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    title="Detalhes da conferência"
    size="lg"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div
      v-if="!check"
      class="state-box"
    >
      Nenhuma conferência selecionada.
    </div>

    <div
      v-else
      class="check-details"
    >
      <header class="check-details__header">
        <div>
          <BaseBadge :variant="hasPrize ? 'success' : 'neutral'">
            {{ hasPrize ? 'Possível prêmio' : 'Sem prêmio' }}
          </BaseBadge>

          <h3>{{ check.game?.name || 'Jogo conferido' }}</h3>

          <p class="muted">
            {{ lotteryLabel }}
            <span v-if="check.contest_number">
              • Concurso {{ check.contest_number }}
            </span>
          </p>
        </div>

        <BaseBadge v-if="check.is_mirror">
          Espelho
        </BaseBadge>
      </header>

      <div class="check-details__summary">
        <div>
          <span>Acertos</span>
          <strong>{{ check.hits_count }}</strong>
        </div>

        <div>
          <span>Faixa</span>
          <strong>{{ check.prize_label || '-' }}</strong>
        </div>

        <div>
          <span>Prêmio</span>
          <strong>{{ prizeAmount || '-' }}</strong>
        </div>
      </div>

      <section class="check-details__section">
        <h4>Números sorteados</h4>

        <div class="check-details__numbers">
          <span
            v-for="number in numbersOrEmpty(check.drawn_numbers)"
            :key="`drawn-${number}`"
            class="check-details__number check-details__number--drawn"
          >
            {{ number }}
          </span>
        </div>
      </section>

      <section class="check-details__section">
        <h4>Seus números conferidos</h4>

        <div class="check-details__numbers">
          <span
            v-for="number in numbersOrEmpty(check.checked_numbers)"
            :key="`checked-${number}`"
            class="check-details__number"
            :class="{ 'check-details__number--hit': isHit(number) }"
          >
            {{ number }}
          </span>
        </div>
      </section>

      <section class="check-details__section">
        <h4>Acertos encontrados</h4>

        <HitNumbers
          v-if="numbersOrEmpty(check.hit_numbers).length"
          :numbers="check.hit_numbers"
        />

        <p
          v-else
          class="muted"
        >
          Nenhum número acertado nesta conferência.
        </p>
      </section>

      <footer class="check-details__footer">
        <span v-if="checkedAt">
          Conferido em {{ checkedAt }}
        </span>

        <span v-if="notifiedAt">
          E-mail enviado em {{ notifiedAt }}
        </span>
      </footer>
    </div>
  </BaseModal>
</template>

<style scoped>
.check-details {
  display: grid;
  gap: 1rem;
}

.check-details__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.check-details__header h3 {
  margin: 0.65rem 0 0.35rem;
  color: var(--color-text);
  font-size: 1.2rem;
  line-height: 1.25;
}

.check-details__header p {
  margin: 0;
}

.check-details__summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.check-details__summary > div {
  padding: 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: #ffffff;
}

.check-details__summary span {
  display: block;
  color: var(--color-muted);
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
}

.check-details__summary strong {
  display: block;
  margin-top: 0.25rem;
  color: var(--color-text);
  font-size: 1rem;
}

.check-details__section {
  display: grid;
  gap: 0.55rem;
}

.check-details__section h4 {
  margin: 0;
  color: var(--color-text);
  font-size: 0.95rem;
}

.check-details__section p {
  margin: 0;
}

.check-details__numbers {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.check-details__number {
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

.check-details__number--drawn {
  background: #eff6ff;
  color: #1d4ed8;
}

.check-details__number--hit {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: #ffffff;
}

.check-details__footer {
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
  .check-details__header {
    flex-direction: column;
  }

  .check-details__summary {
    grid-template-columns: 1fr;
  }
}
</style>