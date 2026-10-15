<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { SearchFilters } from '../types'
import SearchPanel from './SearchPanel.vue'

defineProps<{ image: string }>()
defineEmits<{ search: [filters: SearchFilters] }>()
</script>

<template>
  <section id="inicio" class="hero">
    <div class="hero-art"><img class="hero-photo" :src="image" alt="Pôr do sol na orla de Mosqueiro, com banhistas e o rio ao fundo"><span class="hero-photo-shade" aria-hidden="true" /><div class="hero-label">◌ Orla de Mosqueiro</div></div>
    <div class="hero-content"><p class="eyebrow">Mosqueiro, Belém–PA</p><h1>Seu lugar em<br> Mosqueiro começa aqui.</h1><p class="hero-copy">Para passar uns dias perto do rio e viver Mosqueiro no seu tempo.</p><SearchPanel @search="$emit('search', $event)" /><p class="demo-note">Anúncios e valores desta versão são demonstrativos.</p></div>
    <RouterLink class="scroll-cue" to="/mosqueiro">Descubra a ilha <span>→</span></RouterLink>
  </section>
</template>

<style scoped>
.hero::after { content: ''; position: absolute; z-index: 1; inset: 0; background: linear-gradient(90deg, var(--sand) 0 36%, rgba(244, 235, 221, .98) 46%, rgba(244, 235, 221, .78) 54%, rgba(244, 235, 221, .26) 65%, transparent 74%); pointer-events: none; }
.hero-art { inset: 0 0 0 42%; background: transparent; }
.hero-art::before, .hero-art::after { display: none; }
.hero-photo { width: 100%; height: 100%; display: block; object-fit: cover; object-position: 48% 58%; filter: saturate(.92) contrast(1.05) brightness(.9); -webkit-mask-image: linear-gradient(90deg, transparent 0, rgba(0, 0, 0, .2) 7%, #000 24%, #000 100%); mask-image: linear-gradient(90deg, transparent 0, rgba(0, 0, 0, .2) 7%, #000 24%, #000 100%); }
.hero-photo-shade { position: absolute; inset: 0; background: linear-gradient(90deg, transparent 12%, rgba(16, 59, 52, .12) 42%, transparent 70%), linear-gradient(0deg, rgba(16, 30, 27, .25), transparent 45%); pointer-events: none; }
@media (max-width: 1020px) { .hero::after { display: none; } .hero-art { inset: auto; } .hero-photo { -webkit-mask-image: linear-gradient(180deg, transparent 0, #000 18%, #000 100%); mask-image: linear-gradient(180deg, transparent 0, #000 18%, #000 100%); } }
@media (max-width: 720px) { .hero-photo { object-position: 47% 58%; } .hero-photo-shade { background: linear-gradient(0deg, rgba(16, 30, 27, .28), transparent 55%); } }
</style>
