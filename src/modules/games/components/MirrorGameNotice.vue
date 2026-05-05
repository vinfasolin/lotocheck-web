<template>
  <div class="mirror-game-notice">
    <strong>Lotomania com espelho</strong>

    <p>
      Você escolhe 50 números e o backend gera automaticamente os outros 50 números
      para conferir também a aposta espelho.
    </p>

    <p class="mirror-game-notice__hint">
      Assim, a conferência pode retornar dois resultados: jogo principal e espelho.
    </p>
  </div>
</template>

<style scoped>
.mirror-game-notice {
  display: grid;
  gap: 0.4rem;
  padding: 0.9rem;
  border: 1px solid #bfdbfe;
  border-radius: 16px;
  background: #eff6ff;
  color: #1e3a8a;
}

.mirror-game-notice strong {
  font-size: 0.95rem;
}

.mirror-game-notice p {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.45;
}

.mirror-game-notice__hint {
  color: #1d4ed8;
  font-weight: 700;
}
</style>