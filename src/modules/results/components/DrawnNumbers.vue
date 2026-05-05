<script setup>
defineProps({
  numbers: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div
    v-if="numbers.length"
    class="drawn-numbers"
  >
    <span
      v-for="number in numbers"
      :key="number"
      class="drawn-numbers__item"
    >
      {{ number }}
    </span>
  </div>

  <p
    v-else
    class="drawn-numbers__empty"
  >
    Nenhum número disponível.
  </p>
</template>

<style scoped>
.drawn-numbers {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.drawn-numbers__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  min-width: 34px;
  height: 34px;
  min-height: 34px;
  border: 1px solid #bfdbfe;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.82rem;
  font-weight: 900;
  line-height: 1;
}

.drawn-numbers__empty {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.9rem;
}
</style>