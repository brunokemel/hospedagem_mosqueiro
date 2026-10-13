<script setup lang="ts">
// Variantes visuais tipadas do botão base.
withDefaults(defineProps<{ variant?: 'primary' | 'outline' | 'light' | 'dark'; type?: 'button' | 'submit' }>(), {
  variant: 'primary',
  type: 'button'
})
</script>

<template><button class="button" :class="`button-${variant}`" :type="type"><slot /></button></template>

<style scoped>
/* Mantém o conteúdo do botão alinhado quando há ícones. */
button { white-space: nowrap; }
</style>
