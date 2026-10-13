<script setup lang="ts">
import type { ListingMode } from '../types'

// Contrato de estado controlado para alternar a intenção da busca.
defineProps<{ modelValue: ListingMode }>()
const emit = defineEmits<{ 'update:modelValue': [value: ListingMode] }>()
</script>

<template>
  <!-- Abas semânticas com estado selecionado exposto a leitores de tela. -->
  <div class="mode-tabs" role="tablist" aria-label="Tipo de busca">
    <button role="tab" :aria-selected="modelValue === 'stay'" :class="{ active: modelValue === 'stay' }" @click="emit('update:modelValue', 'stay')">Hospedar-se</button>
    <button role="tab" :aria-selected="modelValue === 'sale'" :class="{ active: modelValue === 'sale' }" @click="emit('update:modelValue', 'sale')">Comprar</button>
  </div>
</template>

<style scoped>
/* O foco visível permanece acima da borda decorativa. */
button:focus-visible { z-index: 1; }
</style>
