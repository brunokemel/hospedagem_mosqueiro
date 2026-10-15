<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { SearchFilters } from '../types'
import BaseButton from './BaseButton.vue'

const emit = defineEmits<{ search: [filters: SearchFilters] }>()
const filters = reactive<SearchFilters>({ region: '', checkin: '', checkout: '', guests: 2 })
const validationMessage = ref('')

const today = new Date()
const todayIso = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toLocaleDateString('sv-SE')
const checkoutMinimum = computed(() => {
  if (!filters.checkin) return todayIso
  const date = new Date(`${filters.checkin}T12:00:00`)
  date.setDate(date.getDate() + 1)
  return date.toLocaleDateString('sv-SE')
})

watch(() => filters.checkin, () => {
  if (filters.checkout && filters.checkout < checkoutMinimum.value) filters.checkout = ''
  validationMessage.value = ''
})

function submitSearch(): void {
  if (!filters.checkin || !filters.checkout) {
    validationMessage.value = 'Escolha as datas de chegada e saída.'
    return
  }
  if (filters.checkout <= filters.checkin) {
    validationMessage.value = 'A saída precisa ser posterior à chegada.'
    return
  }
  validationMessage.value = ''
  emit('search', { ...filters })
}
</script>

<template>
  <div class="search-panel" aria-label="Buscar hospedagens">
    <div class="search-panel-heading"><span aria-hidden="true">⌂</span><div><b>Encontre sua hospedagem</b><small>Informe quando você vem e com quem.</small></div></div>
    <form @submit.prevent="submitSearch">
      <div class="search-fields">
        <label><span>Onde</span><select v-model="filters.region"><option value="">Toda Mosqueiro</option><option>Farol</option><option>Chapéu Virado</option><option>Murubira</option><option>Baía do Sol</option></select></label>
        <label><span>Chegada</span><input v-model="filters.checkin" type="date" :min="todayIso" required></label>
        <label><span>Saída</span><input v-model="filters.checkout" type="date" :min="checkoutMinimum" required></label>
        <label><span>Hóspedes</span><select v-model.number="filters.guests"><option v-for="amount in 8" :key="amount" :value="amount">{{ amount }} {{ amount === 1 ? 'hóspede' : 'hóspedes' }}</option></select></label>
        <BaseButton class="search-button" type="submit"><span aria-hidden="true">⌕</span> Buscar</BaseButton>
      </div><p v-if="validationMessage" class="search-error" role="alert">{{ validationMessage }}</p>
    </form>
  </div>
</template>

<style scoped>
select, input { min-width: 0; }
.search-panel-heading { min-height: 72px; display: flex; align-items: center; gap: 12px; padding: 14px 22px; border-bottom: 1px solid var(--line); color: var(--forest); }
.search-panel-heading > span { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 50%; background: #e8f1ef; font-size: 19px; }
.search-panel-heading div { display: grid; gap: 2px; }
.search-panel-heading b { font-size: 15px; }
.search-panel-heading small { color: var(--muted); font-size: 12px; }
.search-error { margin: -4px 22px 16px; color: #a33d2d; font-size: 13px; font-weight: 700; }
@media (max-width: 720px) { .search-panel-heading { min-height: 66px; padding-inline: 16px; } .search-error { margin-inline: 14px; } }
</style>
