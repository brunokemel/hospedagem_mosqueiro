<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { ListingMode, SearchFilters } from '../types'
import BaseButton from './BaseButton.vue'
import ModeSwitch from './ModeSwitch.vue'

const props = defineProps<{ mode: ListingMode }>()
const emit = defineEmits<{ 'update:mode': [value: ListingMode]; search: [filters: SearchFilters] }>()
// Estado local do formulário; a página recebe apenas uma busca validada.
const filters = reactive<SearchFilters>({ region: '', checkin: '', checkout: '', guests: 2, propertyType: '', maxPriceCents: null })
watch(() => props.mode, () => { filters.propertyType = ''; filters.maxPriceCents = null })
</script>

<template>
  <!-- Busca adaptativa: os campos mudam sem misturar hospedagem e compra. -->
  <div class="search-panel" aria-label="Buscar anúncios">
    <ModeSwitch :model-value="mode" @update:model-value="emit('update:mode', $event)" />
    <form @submit.prevent="emit('search', { ...filters })">
      <div class="search-fields">
        <label><span>Onde</span><select v-model="filters.region"><option value="">Toda Mosqueiro</option><option>Farol</option><option>Chapéu Virado</option><option>Murubira</option><option>Baía do Sol</option></select></label>
        <template v-if="mode === 'stay'">
          <label><span>Chegada</span><input v-model="filters.checkin" type="date"></label>
          <label><span>Saída</span><input v-model="filters.checkout" type="date"></label>
          <label><span>Hóspedes</span><select v-model.number="filters.guests"><option :value="1">1 hóspede</option><option :value="2">2 hóspedes</option><option :value="4">4 hóspedes</option><option :value="6">6+ hóspedes</option></select></label>
        </template>
        <template v-else>
          <label><span>Tipo</span><select v-model="filters.propertyType"><option value="">Todos os tipos</option><option>Casa</option><option>Chalé</option><option>Terreno</option></select></label>
          <label><span>Até</span><select v-model.number="filters.maxPriceCents"><option :value="null">Qualquer valor</option><option :value="35000000">R$ 350 mil</option><option :value="60000000">R$ 600 mil</option><option :value="100000000">R$ 1 milhão</option></select></label>
        </template>
        <BaseButton class="search-button" type="submit"><span aria-hidden="true">⌕</span> Buscar</BaseButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Evita que campos longos ultrapassem a grade responsiva. */
select, input { min-width: 0; }
</style>
