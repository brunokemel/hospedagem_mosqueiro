<script setup lang="ts">
import { RouterLink } from 'vue-router'
defineEmits<{ announce: []; login: [] }>()
</script>

<template>
  <footer class="site-footer"><div class="footer-top"><div><RouterLink class="brand brand-light" to="/"><span class="brand-mark"><i /><i /><i /></span><span>Ilha <b>&</b> Lar</span></RouterLink><p>Seu canto em Mosqueiro,<br> por alguns dias.</p></div><div><h3>Encontre</h3><RouterLink to="/hospedagens">Hospedagens</RouterLink><RouterLink to="/onde-comer">Onde comer</RouterLink></div><div><h3>Para anunciar</h3><button @click="$emit('announce')">Publicar hospedagem</button><button @click="$emit('login')">Área do anunciante</button></div><div><h3>Descubra</h3><RouterLink to="/mosqueiro">Conheça Mosqueiro</RouterLink><a href="mailto:contato@ilhaelar.com.br">Contato</a></div></div><div class="footer-bottom"><span>© 2026 Ilha & Lar — Protótipo demonstrativo.</span><span>Privacidade · Termos · Acessibilidade</span></div></footer>
</template>
