<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import BaseButton from './BaseButton.vue'

defineProps<{ favoritesCount: number }>()
const emit = defineEmits<{ announce: []; login: []; favorites: [] }>()
const mobileMenuOpen = ref(false)

function closeMenu(): void { mobileMenuOpen.value = false }
function announce(): void { closeMenu(); emit('announce') }
</script>

<template>
  <header class="site-header">
    <RouterLink class="brand" to="/" aria-label="Ilha & Lar — início"><span class="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>Ilha <b>&</b> Lar</span></RouterLink>
    <nav class="main-nav" aria-label="Navegação principal"><RouterLink to="/hospedagens">Hospedagens</RouterLink><RouterLink to="/onde-comer">Onde comer</RouterLink><RouterLink to="/mosqueiro">Mosqueiro</RouterLink></nav>
    <div class="header-actions">
      <button class="text-button" @click="emit('announce')">Anunciar</button>
      <button class="icon-button" aria-label="Ver favoritos" @click="emit('favorites')">♡ <span>{{ favoritesCount }}</span></button>
      <BaseButton variant="outline" @click="emit('login')">Entrar</BaseButton>
      <button class="menu-button" :aria-expanded="mobileMenuOpen" aria-controls="mobile-navigation" :aria-label="mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'" @click="mobileMenuOpen = !mobileMenuOpen"><span /><span /><span /></button>
    </div>
    <nav v-if="mobileMenuOpen" id="mobile-navigation" class="mobile-nav" aria-label="Navegação móvel">
      <RouterLink to="/hospedagens" @click="closeMenu">Hospedagens</RouterLink>
      <RouterLink to="/onde-comer" @click="closeMenu">Onde comer</RouterLink>
      <RouterLink to="/mosqueiro" @click="closeMenu">Conheça Mosqueiro</RouterLink>
      <button @click="announce">Quero anunciar</button>
    </nav>
  </header>
</template>

<style scoped>
.menu-button { display: none; width: 44px; height: 44px; padding: 10px; border: 0; border-radius: 50%; background: transparent; }
.menu-button span { display: block; width: 22px; height: 2px; margin: 4px auto; border-radius: 2px; background: var(--forest); }
.mobile-nav { display: none; }
.main-nav a.router-link-active { color: var(--terra); }
@media (max-width: 1020px) {
  .menu-button { display: block; }
  .mobile-nav { position: absolute; top: calc(100% + 1px); right: 16px; left: 16px; display: grid; padding: 10px; border: 1px solid rgba(23, 76, 66, .14); border-radius: 0 0 16px 16px; background: var(--paper); box-shadow: 0 18px 40px rgba(16, 59, 52, .16); }
  .mobile-nav a, .mobile-nav button { min-height: 50px; display: flex; align-items: center; padding: 0 14px; border: 0; border-bottom: 1px solid var(--line); background: transparent; color: var(--forest); font-weight: 700; text-align: left; }
  .mobile-nav button { border-bottom: 0; color: var(--terra); }
}
</style>
