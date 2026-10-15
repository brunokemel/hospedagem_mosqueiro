<script setup lang="ts">
import type { ListingMode } from '../types'

// Contrato de estado controlado da busca por hospedagens.
defineProps<{ modelValue: ListingMode }>()
const emit = defineEmits<{ 'update:modelValue': [value: ListingMode] }>()
</script>

<template>
  <div class="mode-tabs" aria-label="Tipo de busca">
    <button class="active" type="button" @click="emit('update:modelValue', 'stay')">Hospedar-se</button>
  </div>
</template>

<style scoped>
/* O foco visível permanece acima da borda decorativa. */
button:focus-visible { z-index: 1; }
</style>
