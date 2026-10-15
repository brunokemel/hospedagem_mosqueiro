<script setup lang="ts">
import BaseButton from './BaseButton.vue'
defineEmits<{ find: []; announce: [] }>()
</script>

<template>
  <section class="stay-journey">
    <article class="stay-journey-card"><div><p class="eyebrow">Sua estadia na ilha</p><h2>Acorde com a brisa do rio.</h2><p>Casas, pousadas e chalés para descansar, reunir a família e conhecer Mosqueiro no seu tempo.</p><div class="stay-journey-actions"><BaseButton variant="light" @click="$emit('find')">Encontrar hospedagem →</BaseButton><button class="stay-journey-link" @click="$emit('announce')">Quero anunciar minha hospedagem</button></div></div><div class="path-art" aria-hidden="true"><span /><i /></div></article>
  </section>
</template>

<style scoped>
.stay-journey { padding: clamp(18px, 3vw, 42px); background: var(--paper); }
.stay-journey-card { min-height: 460px; padding: clamp(44px, 6vw, 82px); display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(260px, .75fr); align-items: center; gap: 40px; overflow: hidden; border-radius: 26px; background: var(--forest); color: #fff; }
.stay-journey-card h2 { max-width: 680px; margin: 10px 0 20px; font: 600 clamp(46px, 5vw, 72px)/.95 "Cormorant Garamond", serif; }
.stay-journey-card p:not(.eyebrow) { max-width: 570px; line-height: 1.7; }
.stay-journey-actions { margin-top: 28px; display: flex; align-items: center; gap: 22px; flex-wrap: wrap; }
.stay-journey-link { min-height: 44px; border: 0; background: transparent; color: #fff; font-weight: 800; text-decoration: underline; text-underline-offset: 4px; }
@media (max-width: 720px) { .stay-journey { padding: 12px; } .stay-journey-card { min-height: 0; padding: 58px 22px; grid-template-columns: 1fr; border-radius: 18px; } .stay-journey-actions { align-items: stretch; flex-direction: column; } .stay-journey-actions :deep(.button) { width: 100%; } }
</style>
