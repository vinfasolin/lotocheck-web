<script setup>
defineProps({
  message: {
    type: String,
    default: 'Carregando...',
  },
})
</script>

<template>
  <div
    class="state-box"
    role="status"
    aria-live="polite"
  >
    <span
      class="loader"
      aria-hidden="true"
    />

    <p>{{ message }}</p>
  </div>
</template>