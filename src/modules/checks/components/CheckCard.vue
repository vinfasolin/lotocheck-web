<script setup>
import { computed } from 'vue'

import PrizeBadge from './PrizeBadge.vue'
import HitNumbers from './HitNumbers.vue'
import BaseButton from '@/shared/components/BaseButton.vue'

const props = defineProps({
  check: {
    type: Object,
    required: true,
  },
})

defineEmits(['details'])

const formattedPrizeAmount = computed(() => {
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

const checkedAt = computed(() => {
  const value = props.check?.checked_at

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
})

const lotteryLabel = computed(() => {
  return props.check?.result?.lottery_label || props.check?.game?.lottery_label || 'Loteria'
})
</script>

<template>
  <article
    class="check-card check-card-local"
    :class="{ 'check-card-local--winner': check.has_prize }"
  >
    <header class="check-card-local__header">
      <div class="check-card-local__title">
        <PrizeBadge :has-prize="check.has_prize" />

        <h3>{{ check.game?.name || 'Jogo conferido' }}</h3>

        <p class="muted">
          {{ lotteryLabel }}
          <span v-if="check.contest_number">
            • Concurso {{ check.contest_number }}
          </span>
        </p>
      </div>

      <span
        v-if="check.is_mirror"
        class="mirror-pill"
      >
        Espelho
      </span>
    </header>

    <div class="check-card-local__summary">
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
        <strong>{{ formattedPrizeAmount || '-' }}</strong>
      </div>
    </div>

    <section class="check-card-local__hits">
      <strong>Acertos encontrados</strong>

      <HitNumbers
        v-if="check.hit_numbers?.length"
        :numbers="check.hit_numbers"
      />

      <p
        v-else
        class="muted"
      >
        Nenhum número acertado.
      </p>
    </section>

    <footer class="check-card-local__footer">
      <span v-if="checkedAt">
        Conferido em {{ checkedAt }}
      </span>

      <BaseButton
        variant="ghost"
        @click="$emit('details', check)"
      >
        Detalhes
      </BaseButton>
    </footer>
  </article>
</template>

<style scoped>
.check-card-local {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 280px;
}

.check-card-local--winner {
  border-color: rgba(22, 163, 74, 0.45);
  background: linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%);
}

.check-card-local__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.check-card-local__title {
  display: grid;
  gap: 0.45rem;
  min-width: 0;
}

.check-card-local__title h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 1.1rem;
  line-height: 1.25;
  word-break: break-word;
}

.check-card-local__title p {
  margin: 0;
}

.check-card-local__summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.65rem;
}

.check-card-local__summary > div {
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: #ffffff;
}

.check-card-local__summary span {
  display: block;
  color: var(--color-muted);
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
}

.check-card-local__summary strong {
  display: block;
  margin-top: 0.25rem;
  color: var(--color-text);
  font-size: 0.95rem;
}

.check-card-local__hits {
  display: grid;
  gap: 0.5rem;
}

.check-card-local__hits > strong {
  font-size: 0.9rem;
}

.check-card-local__hits p {
  margin: 0;
}

.check-card-local__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border);
  color: var(--color-muted);
  font-size: 0.88rem;
}

@media (max-width: 640px) {
  .check-card-local {
    min-height: auto;
  }

  .check-card-local__header,
  .check-card-local__footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .check-card-local__summary {
    grid-template-columns: 1fr;
  }
}
</style>