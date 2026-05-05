<script setup>
defineProps({
  prizes: {
    type: Array,
    default: () => [],
  },
})

function formatCurrency(value) {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  const amount = Number(value)

  if (Number.isNaN(amount)) {
    return '-'
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount)
}

function formatNumber(value) {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  const amount = Number(value)

  if (Number.isNaN(amount)) {
    return value
  }

  return new Intl.NumberFormat('pt-BR').format(amount)
}
</script>

<template>
  <div
    v-if="!prizes.length"
    class="prize-table-empty"
  >
    Nenhuma informação de premiação disponível.
  </div>

  <div
    v-else
    class="table-wrap prize-table"
  >
    <table>
      <thead>
        <tr>
          <th>Faixa</th>
          <th>Descrição</th>
          <th>Ganhadores</th>
          <th>Prêmio</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="prize in prizes"
          :key="prize.faixa"
        >
          <td>{{ prize.faixa }}</td>
          <td>{{ prize.descricao || '-' }}</td>
          <td>{{ formatNumber(prize.ganhadores) }}</td>
          <td class="prize-table__amount">
            {{ formatCurrency(prize.valorPremio) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.prize-table {
  margin-top: 1rem;
}

.prize-table table {
  width: 100%;
}

.prize-table th {
  color: var(--color-muted);
  font-size: 0.82rem;
  text-transform: uppercase;
}

.prize-table td,
.prize-table th {
  white-space: nowrap;
}

.prize-table td:nth-child(2),
.prize-table th:nth-child(2) {
  white-space: normal;
}

.prize-table__amount {
  font-weight: 800;
}

.prize-table-empty {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px dashed var(--color-border);
  border-radius: 14px;
  background: #ffffff;
  color: var(--color-muted);
  text-align: center;
}

@media (max-width: 640px) {
  .prize-table td,
  .prize-table th {
    padding: 0.65rem 0.5rem;
    font-size: 0.86rem;
  }
}
</style>