<script setup>
defineOptions({
  inheritAttrs: false,
})

defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  required: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <label class="form-field">
    <span
      v-if="label"
      class="form-field__label"
    >
      {{ label }}
      <strong v-if="required">*</strong>
    </span>

    <input
      v-bind="$attrs"
      class="form-field__input"
      :class="{ 'form-field__input--error': error }"
      :type="type"
      :required="required"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >

    <small
      v-if="error"
      class="form-field__error"
    >
      {{ error }}
    </small>
  </label>
</template>

<style scoped>
.form-field {
  display: grid;
  gap: 0.4rem;
}

.form-field__label {
  color: var(--color-text);
  font-size: 0.92rem;
  font-weight: 800;
}

.form-field__label strong {
  color: var(--color-danger);
}

.form-field__input {
  width: 100%;
  min-height: 44px;
  padding: 0.8rem 0.95rem;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: #ffffff;
  color: var(--color-text);
  outline: none;
  transition: 0.16s ease;
}

.form-field__input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.12);
}

.form-field__input::placeholder {
  color: #94a3b8;
}

.form-field__input--error {
  border-color: var(--color-danger);
}

.form-field__error {
  color: var(--color-danger);
  font-size: 0.82rem;
  font-weight: 700;
}
</style>