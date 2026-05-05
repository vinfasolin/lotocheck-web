<script setup>
import { computed, reactive, ref, watch } from 'vue'

import BaseModal from '@/shared/components/BaseModal.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import BaseInput from '@/shared/components/BaseInput.vue'
import ErrorAlert from '@/shared/components/ErrorAlert.vue'
import LotteryTypeTabs from './LotteryTypeTabs.vue'
import GameNumbersPicker from './GameNumbersPicker.vue'
import MirrorGameNotice from './MirrorGameNotice.vue'
import { getLotteryRule } from '@/shared/utils/lottery'
import { useGamesStore } from '@/modules/games/store/games.store'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  game: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'saved'])

const store = useGamesStore()

const form = reactive({
  lottery_type: 'megasena',
  name: '',
  numbers: [],
  use_mirror: false,
  notify_by_email: true,
  alert_email: '',
  is_active: true,
})

const localError = ref('')
const isHydrating = ref(false)

const editing = computed(() => Boolean(props.game?.id))
const title = computed(() => (editing.value ? 'Editar jogo' : 'Cadastrar jogo'))
const rule = computed(() => getLotteryRule(form.lottery_type))

const numbersText = computed(() => {
  if (rule.value.min === rule.value.max) {
    return `Escolha exatamente ${rule.value.min} números.`
  }

  return `Escolha de ${rule.value.min} a ${rule.value.max} números.`
})

const selectedText = computed(() => {
  return `${form.numbers.length} número${form.numbers.length === 1 ? '' : 's'} selecionado${form.numbers.length === 1 ? '' : 's'}`
})

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      fillForm()
    }
  },
)

watch(
  () => form.lottery_type,
  () => {
    if (isHydrating.value) {
      return
    }

    form.numbers = []
    form.use_mirror = false
    localError.value = ''
  },
)

function fillForm() {
  isHydrating.value = true

  form.lottery_type = props.game?.lottery_type || 'megasena'
  form.name = props.game?.name || ''
  form.numbers = [...(props.game?.numbers || [])]
  form.use_mirror = Boolean(props.game?.use_mirror)
  form.notify_by_email = props.game?.notify_by_email ?? true
  form.alert_email = props.game?.alert_email || ''
  form.is_active = props.game?.is_active ?? true

  localError.value = ''

  requestAnimationFrame(() => {
    isHydrating.value = false
  })
}

function validateForm() {
  localError.value = ''

  if (!form.name || form.name.trim().length < 2) {
    localError.value = 'Informe um nome para o jogo com pelo menos 2 caracteres.'
    return false
  }

  if (form.numbers.length < rule.value.min || form.numbers.length > rule.value.max) {
    if (rule.value.min === rule.value.max) {
      localError.value = `${rule.value.label} exige exatamente ${rule.value.min} números.`
      return false
    }

    localError.value = `${rule.value.label} exige entre ${rule.value.min} e ${rule.value.max} números.`
    return false
  }

  return true
}

async function submit() {
  if (!validateForm()) {
    return
  }

  const payload = {
    lottery_type: form.lottery_type,
    name: form.name.trim(),
    numbers: form.numbers,
    use_mirror: form.lottery_type === 'lotomania' ? form.use_mirror : false,
    notify_by_email: form.notify_by_email,
    alert_email: form.notify_by_email ? form.alert_email || null : null,
    is_active: form.is_active,
  }

  if (editing.value) {
    await store.updateGame(props.game.id, payload)
  } else {
    await store.createGame(payload)
  }

  emit('saved')
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    :title="title"
    size="lg"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <form
      class="game-form-modal stack"
      @submit.prevent="submit"
    >
      <ErrorAlert :message="localError || store.error || store.errors" />

      <section class="game-form-modal__section">
        <h3>Tipo de loteria</h3>

        <LotteryTypeTabs v-model="form.lottery_type" />

        <p class="muted">
          {{ numbersText }}
        </p>
      </section>

      <section class="game-form-modal__section">
        <BaseInput
          v-model="form.name"
          label="Nome do jogo"
          placeholder="Ex: Minha Mega principal"
          required
        />
      </section>

      <section class="game-form-modal__section">
        <div class="game-form-modal__numbers-header">
          <h3>Números do jogo</h3>

          <span>
            {{ selectedText }}
          </span>
        </div>

        <GameNumbersPicker
          v-model="form.numbers"
          :lottery-type="form.lottery_type"
        />
      </section>

      <section
        v-if="form.lottery_type === 'lotomania'"
        class="game-form-modal__section"
      >
        <label class="check-row">
          <input
            v-model="form.use_mirror"
            type="checkbox"
          >

          <span>Ativar aposta espelho</span>
        </label>

        <MirrorGameNotice v-if="form.use_mirror" />
      </section>

      <section class="game-form-modal__section">
        <label class="check-row">
          <input
            v-model="form.notify_by_email"
            type="checkbox"
          >

          <span>Alertar por e-mail se houver possível prêmio</span>
        </label>

        <BaseInput
          v-if="form.notify_by_email"
          v-model="form.alert_email"
          label="E-mail para alerta"
          type="email"
          placeholder="usuario@email.com"
        />
      </section>

      <section class="game-form-modal__section">
        <label class="check-row">
          <input
            v-model="form.is_active"
            type="checkbox"
          >

          <span>Jogo ativo</span>
        </label>
      </section>

      <div class="form-actions game-form-modal__actions">
        <BaseButton
          type="button"
          variant="ghost"
          @click="$emit('update:modelValue', false)"
        >
          Cancelar
        </BaseButton>

        <BaseButton
          type="submit"
          :disabled="store.saving"
        >
          {{ store.saving ? 'Salvando...' : 'Salvar jogo' }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<style scoped>
.game-form-modal {
  gap: 1.15rem;
}

.game-form-modal__section {
  display: grid;
  gap: 0.75rem;
}

.game-form-modal__section h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 1rem;
}

.game-form-modal__section p {
  margin: 0;
}

.game-form-modal__numbers-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.game-form-modal__numbers-header span {
  color: var(--color-muted);
  font-size: 0.9rem;
  font-weight: 800;
}

.game-form-modal__actions {
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

@media (max-width: 640px) {
  .game-form-modal__numbers-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .game-form-modal__actions {
    flex-direction: column-reverse;
  }
}
</style>