<script setup>
import { computed } from 'vue'

import { buildNumberRange, getLotteryRule } from '@/shared/utils/lottery'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  lotteryType: {
    type: String,
    default: 'megasena',
  },
})

const emit = defineEmits(['update:modelValue'])

const numbers = computed(() => buildNumberRange(props.lotteryType))
const rule = computed(() => getLotteryRule(props.lotteryType))

const selectedCount = computed(() => props.modelValue.length)

const hasMinimum = computed(() => selectedCount.value >= rule.value.min)
const reachedMaximum = computed(() => selectedCount.value >= rule.value.max)

const selectionText = computed(() => {
  if (rule.value.min === rule.value.max) {
    return `${selectedCount.value} de ${rule.value.max} números selecionados`
  }

  return `${selectedCount.value} selecionados de ${rule.value.min} a ${rule.value.max}`
})

const helperText = computed(() => {
  if (hasMinimum.value && !reachedMaximum.value) {
    return 'Você já pode salvar o jogo ou escolher mais números.'
  }

  if (reachedMaximum.value) {
    return 'Limite máximo de números atingido.'
  }

  const remaining = rule.value.min - selectedCount.value

  return `Selecione mais ${remaining} número${remaining === 1 ? '' : 's'} para completar o jogo.`
})

function toggle(number) {
  const selected = [...props.modelValue]
  const index = selected.indexOf(number)

  if (index >= 0) {
    selected.splice(index, 1)
  } else if (selected.length < rule.value.max) {
    selected.push(number)
  }

  emit('update:modelValue', selected.sort())
}

function isDisabled(number) {
  return reachedMaximum.value && !props.modelValue.includes(number)
}
</script>

<template>
  <div class="numbers-picker-local">
    <div class="numbers-picker-local__header">
      <p class="muted">
        <strong>{{ selectionText }}</strong>
      </p>

      <p
        class="numbers-picker-local__helper"
        :class="{
          'numbers-picker-local__helper--ok': hasMinimum,
          'numbers-picker-local__helper--limit': reachedMaximum,
        }"
      >
        {{ helperText }}
      </p>
    </div>

    <div class="numbers-picker-local__grid">
      <button
        v-for="number in numbers"
        :key="number"
        type="button"
        class="numbers-picker-local__button"
        :class="{ selected: modelValue.includes(number) }"
        :disabled="isDisabled(number)"
        @click="toggle(number)"
      >
        {{ number }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.numbers-picker-local {
  display: grid;
  gap: 0.85rem;
}

.numbers-picker-local__header {
  display: grid;
  gap: 0.25rem;
}

.numbers-picker-local__header p {
  margin: 0;
}

.numbers-picker-local__helper {
  color: var(--color-muted);
  font-size: 0.88rem;
}

.numbers-picker-local__helper--ok {
  color: var(--color-primary);
  font-weight: 700;
}

.numbers-picker-local__helper--limit {
  color: #92400e;
  font-weight: 700;
}

.numbers-picker-local__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(42px, 1fr));
  gap: 0.45rem;
}

.numbers-picker-local__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  min-width: 42px;
  height: 42px;
  min-height: 42px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: #ffffff;
  color: var(--color-text);
  font-size: 0.9rem;
  font-weight: 900;
  line-height: 1;
  transition: 0.16s ease;
}

.numbers-picker-local__button:hover:not(:disabled) {
  border-color: var(--color-primary);
  background: #f0fdf4;
}

.numbers-picker-local__button.selected {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: #ffffff;
}

.numbers-picker-local__button:disabled {
  cursor: not-allowed;
  opacity: 0.35;
}

@media (max-width: 640px) {
  .numbers-picker-local__grid {
    grid-template-columns: repeat(auto-fill, minmax(38px, 1fr));
  }

  .numbers-picker-local__button {
    width: 38px;
    min-width: 38px;
    height: 38px;
    min-height: 38px;
    font-size: 0.84rem;
  }
}
</style>