<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import BaseButton from '@/shared/components/BaseButton.vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['check-all'])

const router = useRouter()

const checkAllLabel = computed(() => {
  return props.disabled ? 'Conferindo...' : 'Conferir todos'
})

function goToCreateGame() {
  router.push({
    name: 'games',
    query: {
      create: '1',
    },
  })
}

function goToChecks() {
  router.push({
    name: 'checks',
  })
}

function checkAll() {
  if (props.disabled) {
    return
  }

  emit('check-all')
}
</script>

<template>
  <div class="quick-actions quick-actions-local">
    <BaseButton @click="goToCreateGame">
      Cadastrar jogo
    </BaseButton>

    <BaseButton
      variant="secondary"
      :disabled="disabled"
      @click="checkAll"
    >
      {{ checkAllLabel }}
    </BaseButton>

    <BaseButton
      variant="ghost"
      @click="goToChecks"
    >
      Conferências
    </BaseButton>
  </div>
</template>

<style scoped>
.quick-actions-local {
  align-items: center;
}

@media (max-width: 640px) {
  .quick-actions-local {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>