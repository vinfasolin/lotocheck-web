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
    class="hit-numbers"
  >
    <span
      v-for="number in numbers"
      :key="number"
      class="hit-numbers__item"
    >
      {{ number }}
    </span>
  </div>

  <p
    v-else
    class="hit-numbers__empty"
  >
    Nenhum acerto.
  </p>
</template>

<style scoped>
.hit-numbers {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.hit-numbers__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  min-width: 34px;
  height: 34px;
  min-height: 34px;
  border: 1px solid var(--color-primary);
  border-radius: 999px;
  background: var(--color-primary);
  color: #ffffff;
  font-size: 0.82rem;
  font-weight: 900;
  line-height: 1;
}

.hit-numbers__empty {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.9rem;
}
</style>