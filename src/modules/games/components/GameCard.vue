<script setup>
import { computed } from 'vue'

import BaseButton from '@/shared/components/BaseButton.vue'
import BaseBadge from '@/shared/components/BaseBadge.vue'

const props = defineProps({
  game: {
    type: Object,
    required: true,
  },
})

defineEmits(['edit', 'delete', 'check'])

const numbers = computed(() => {
  return props.game?.numbers || []
})

const mirrorNumbersCount = computed(() => {
  return props.game?.mirror_numbers?.length || 0
})

const lastCheckedText = computed(() => {
  return props.game?.last_checked_contest
    ? `Último concurso conferido: ${props.game.last_checked_contest}`
    : 'Ainda não conferido'
})
</script>

<template>
  <article class="game-card game-card-local">
    <header class="game-card-local__header">
      <div class="game-card-local__title">
        <BaseBadge>{{ game.lottery_label }}</BaseBadge>

        <h3>{{ game.name }}</h3>
      </div>

      <BaseBadge :variant="game.is_active ? 'success' : 'neutral'">
        {{ game.is_active ? 'Ativo' : 'Inativo' }}
      </BaseBadge>
    </header>

    <div
      class="game-card-local__numbers"
      aria-label="Números do jogo"
    >
      <span
        v-for="number in numbers"
        :key="number"
        class="game-card-local__number"
      >
        {{ number }}
      </span>
    </div>

    <div class="game-card-local__info">
      <p
        v-if="game.use_mirror"
        class="game-card-local__mirror"
      >
        Espelho ativo
        <span v-if="mirrorNumbersCount">
          • {{ mirrorNumbersCount }} números
        </span>
      </p>

      <p class="muted">
        {{ lastCheckedText }}
      </p>
    </div>

    <footer class="game-card-local__actions">
      <BaseButton
        variant="secondary"
        @click="$emit('check', game)"
      >
        Conferir
      </BaseButton>

      <BaseButton
        variant="ghost"
        @click="$emit('edit', game)"
      >
        Editar
      </BaseButton>

      <BaseButton
        variant="danger"
        @click="$emit('delete', game)"
      >
        Excluir
      </BaseButton>
    </footer>
  </article>
</template>

<style scoped>
.game-card-local {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 320px;
}

.game-card-local__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.game-card-local__title {
  display: grid;
  gap: 0.65rem;
  min-width: 0;
}

.game-card-local__title h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 1.15rem;
  line-height: 1.25;
  word-break: break-word;
}

.game-card-local__numbers {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 0.45rem;
}

.game-card-local__number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  min-width: 38px;
  height: 38px;
  min-height: 38px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: #ffffff;
  color: var(--color-text);
  font-size: 0.88rem;
  font-weight: 900;
  line-height: 1;
}

.game-card-local__info {
  display: grid;
  gap: 0.4rem;
  margin-top: auto;
}

.game-card-local__info p {
  margin: 0;
}

.game-card-local__mirror {
  color: var(--color-primary);
  font-size: 0.9rem;
  font-weight: 800;
}

.game-card-local__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border);
}

@media (max-width: 640px) {
  .game-card-local {
    min-height: auto;
  }

  .game-card-local__actions {
    flex-direction: column;
  }
}
</style>