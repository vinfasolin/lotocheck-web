<script setup>
import { LOTTERY_TYPES } from '@/shared/utils/lottery'

defineProps({
  modelValue: {
    type: String,
    default: 'megasena',
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div
    class="lottery-type-tabs"
    role="tablist"
    aria-label="Tipos de loteria"
  >
    <button
      v-for="lottery in LOTTERY_TYPES"
      :key="lottery.value"
      type="button"
      class="lottery-type-tabs__button"
      :class="{ 'lottery-type-tabs__button--active': modelValue === lottery.value }"
      :aria-pressed="modelValue === lottery.value"
      @click="$emit('update:modelValue', lottery.value)"
    >
      {{ lottery.label }}
    </button>
  </div>
</template>

<style scoped>
.lottery-type-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.lottery-type-tabs__button {
  padding: 0.65rem 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: #ffffff;
  color: var(--color-muted);
  font-weight: 800;
  transition: 0.16s ease;
}

.lottery-type-tabs__button:hover {
  border-color: var(--color-primary);
  background: #f0fdf4;
  color: var(--color-primary);
}

.lottery-type-tabs__button--active {
  border-color: var(--color-primary);
  background: #dcfce7;
  color: #166534;
}

@media (max-width: 640px) {
  .lottery-type-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 0.15rem;
  }

  .lottery-type-tabs__button {
    flex: 0 0 auto;
  }
}
</style>