<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md',
  },
})

const emit = defineEmits(['update:modelValue', 'close'])

const modalPanel = ref(null)
let previousBodyOverflow = ''

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen) {
      previousBodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      window.addEventListener('keydown', handleKeydown)

      await nextTick()
      modalPanel.value?.focus()

      return
    }

    unlockBody()
    window.removeEventListener('keydown', handleKeydown)
  },
)

onBeforeUnmount(() => {
  unlockBody()
  window.removeEventListener('keydown', handleKeydown)
})

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function handleKeydown(event) {
  if (event.key === 'Escape' && props.modelValue) {
    close()
  }
}

function unlockBody() {
  document.body.style.overflow = previousBodyOverflow || ''
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="modal-backdrop"
      role="presentation"
      @click.self="close"
    >
      <section
        ref="modalPanel"
        class="modal-panel"
        :class="`modal-panel--${size}`"
        role="dialog"
        aria-modal="true"
        :aria-label="title || 'Modal'"
        tabindex="-1"
      >
        <header class="modal-header">
          <h2>{{ title }}</h2>

          <button
            class="icon-button"
            type="button"
            aria-label="Fechar modal"
            @click="close"
          >
            ×
          </button>
        </header>

        <div class="modal-body">
          <slot />
        </div>
      </section>
    </div>
  </Teleport>
</template>