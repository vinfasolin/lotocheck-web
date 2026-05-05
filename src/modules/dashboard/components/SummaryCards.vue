<script setup>
import BaseCard from '@/shared/components/BaseCard.vue'

defineProps({
  summary: {
    type: Object,
    default: null,
  },
})

function formatNumber(value) {
  const number = Number(value ?? 0)

  if (Number.isNaN(number)) {
    return '0'
  }

  return new Intl.NumberFormat('pt-BR').format(number)
}
</script>

<template>
  <div class="summary-grid summary-cards-local">
    <BaseCard class="summary-cards-local__card">
      <span class="card-label">Jogos cadastrados</span>
      <strong class="card-number">{{ formatNumber(summary?.games_count) }}</strong>
      <p>Total de jogos salvos na sua conta.</p>
    </BaseCard>

    <BaseCard class="summary-cards-local__card">
      <span class="card-label">Jogos ativos</span>
      <strong class="card-number">{{ formatNumber(summary?.active_games_count) }}</strong>
      <p>Jogos considerados na conferência geral.</p>
    </BaseCard>

    <BaseCard class="summary-cards-local__card">
      <span class="card-label">Possíveis prêmios</span>
      <strong class="card-number">{{ formatNumber(summary?.winner_checks_count) }}</strong>
      <p>Conferências com alguma faixa de premiação.</p>
    </BaseCard>
  </div>
</template>

<style scoped>
.summary-cards-local__card {
  display: grid;
  gap: 0.35rem;
}

.summary-cards-local__card p {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.9rem;
  line-height: 1.35;
}
</style>