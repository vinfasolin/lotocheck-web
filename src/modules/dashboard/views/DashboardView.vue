<script setup>
import { onMounted, ref } from 'vue'

import EmptyState from '@/shared/components/EmptyState.vue'
import ErrorAlert from '@/shared/components/ErrorAlert.vue'
import LoadingState from '@/shared/components/LoadingState.vue'
import CheckResultModal from '@/modules/games/components/CheckResultModal.vue'
import { getErrorMessage } from '@/shared/utils/errors'
import QuickActions from '../components/QuickActions.vue'
import SummaryCards from '../components/SummaryCards.vue'
import { useDashboardStore } from '../store/dashboard.store'
import { useGamesStore } from '@/modules/games/store/games.store'

const dashboard = useDashboardStore()
const games = useGamesStore()

const show = ref(false)
const checks = ref([])
const feedbackMessage = ref('')
const localError = ref('')

onMounted(() => {
  loadSummary()
})

async function loadSummary() {
  localError.value = ''

  try {
    await dashboard.fetchSummary()
  } catch (error) {
    localError.value = getErrorMessage(error, 'Não foi possível carregar o resumo.')
  }
}

async function checkAll() {
  feedbackMessage.value = ''
  localError.value = ''

  try {
    const response = await games.checkMyGames()

    checks.value = response.checks || []
    show.value = true
    feedbackMessage.value = 'Todos os jogos ativos foram conferidos.'

    await dashboard.fetchSummary()
  } catch (error) {
    localError.value = getErrorMessage(error, 'Não foi possível conferir seus jogos.')
  }
}
</script>

<template>
  <section class="page-section dashboard-view">
    <div class="page-header">
      <div>
        <span class="eyebrow">Painel</span>
        <h1>Resumo dos seus jogos</h1>
        <p class="muted">
          Acompanhe seus jogos, conferências e possíveis prêmios em um só lugar.
        </p>
      </div>
    </div>

    <div
      v-if="feedbackMessage"
      class="success-alert"
    >
      {{ feedbackMessage }}
    </div>

    <ErrorAlert :message="localError || dashboard.error || games.error" />

    <LoadingState
      v-if="dashboard.loading && !dashboard.summary"
      message="Carregando resumo..."
    />

    <template v-else>
      <SummaryCards :summary="dashboard.summary" />

      <QuickActions
        :disabled="games.checking"
        @check-all="checkAll"
      />

      <section class="dashboard-view__latest">
        <h2>Últimas conferências</h2>

        <EmptyState
          v-if="!dashboard.summary?.latest_checks?.length"
          title="Nenhuma conferência recente"
          description="Confira seus jogos para visualizar o histórico aqui."
        />

        <div
          v-else
          class="compact-list"
        >
          <article
            v-for="check in dashboard.summary.latest_checks"
            :key="check.id"
            class="compact-item"
          >
            <div>
              <strong>{{ check.game?.name || 'Jogo conferido' }}</strong>
              <span>
                {{ check.hits_count }} acertos
                <template v-if="check.contest_number">
                  • Concurso {{ check.contest_number }}
                </template>
              </span>
            </div>

            <span
              class="dashboard-view__status"
              :class="{ 'dashboard-view__status--success': check.has_prize }"
            >
              {{ check.has_prize ? 'Possível prêmio' : 'Sem prêmio' }}
            </span>
          </article>
        </div>
      </section>
    </template>

    <CheckResultModal
      v-model="show"
      :checks="checks"
    />
  </section>
</template>

<style scoped>
.dashboard-view .page-header p {
  margin: 0.4rem 0 0;
}

.success-alert {
  padding: 0.9rem 1rem;
  border: 1px solid #bbf7d0;
  border-radius: 14px;
  background: #f0fdf4;
  color: #166534;
  font-weight: 800;
}

.dashboard-view__latest {
  display: grid;
  gap: 1rem;
}

.dashboard-view__latest h2 {
  margin: 0;
  color: var(--color-text);
  font-size: 1.25rem;
}

.dashboard-view__status {
  flex: 0 0 auto;
  color: var(--color-muted);
  font-size: 0.86rem;
  font-weight: 800;
}

.dashboard-view__status--success {
  color: var(--color-primary);
}

.compact-item div {
  display: grid;
  gap: 0.25rem;
}

.compact-item span {
  color: var(--color-muted);
}

@media (max-width: 640px) {
  .compact-item {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>