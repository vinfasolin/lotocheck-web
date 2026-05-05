<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: [String, Object, Array],
    default: '',
  },
})

const hasMessage = computed(() => {
  if (!props.message) {
    return false
  }

  if (typeof props.message === 'string') {
    return props.message.trim().length > 0
  }

  if (Array.isArray(props.message)) {
    return props.message.length > 0
  }

  if (typeof props.message === 'object') {
    return Object.keys(props.message).length > 0
  }

  return false
})

const normalizedMessages = computed(() => {
  if (!hasMessage.value) {
    return []
  }

  if (typeof props.message === 'string') {
    return [props.message]
  }

  if (Array.isArray(props.message)) {
    return props.message
  }

  return Object.entries(props.message).flatMap(([field, errors]) => {
    const fieldErrors = Array.isArray(errors) ? errors : [errors]

    return fieldErrors.map((error) => ({
      field,
      error,
    }))
  })
})
</script>

<template>
  <div
    v-if="hasMessage"
    class="error-alert"
    role="alert"
  >
    <template v-if="typeof message === 'string' || Array.isArray(message)">
      <div
        v-for="(item, index) in normalizedMessages"
        :key="index"
      >
        {{ item }}
      </div>
    </template>

    <template v-else>
      <div
        v-for="item in normalizedMessages"
        :key="`${item.field}-${item.error}`"
      >
        <strong>{{ item.field }}:</strong>
        <span>{{ item.error }}</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.error-alert {
  display: grid;
  gap: 0.35rem;
}

.error-alert strong {
  margin-right: 0.25rem;
}
</style>