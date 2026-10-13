<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { SearchFoodPlaces, type FoodCategoryFilter } from '../application/use-cases/SearchFoodPlaces'
import type { FoodPlaceEntity } from '../domain/entities/FoodPlaceEntity'
import { InMemoryFoodPlaceRepository } from '../infrastructure/repositories/InMemoryFoodPlaceRepository'
import FoodPlaceCard from './FoodPlaceCard.vue'

// Dependência de busca isolada da camada visual por meio do repositório de domínio.
const searchFoodPlaces = new SearchFoodPlaces(new InMemoryFoodPlaceRepository())

// Estado dos filtros do guia gastronômico.
const query = ref('')
const category = ref<FoodCategoryFilter>('all')
const results = ref<readonly FoodPlaceEntity[]>([])
const categories: readonly { value: FoodCategoryFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'restaurant', label: 'Restaurantes' },
  { value: 'snack', label: 'Lanches e pizza' },
  { value: 'cafe', label: 'Cafés e doces' },
  { value: 'regional', label: 'Sabores locais' },
]

watchEffect(async () => {
  results.value = await searchFoodPlaces.execute(query.value, category.value)
})
</script>

<template>
  <!-- Guia pesquisável para decidir onde comer e acessar o canal de atendimento. -->
  <section id="onde-comer" class="food-section">
    <div class="food-heading">
      <div><p class="eyebrow">Sabores da ilha</p><h2>Onde comer em Mosqueiro</h2></div>
      <p>Restaurantes, lanchonetes, cafés e sabores locais com o caminho mais direto para consultar ou pedir.</p>
    </div>

    <!-- Busca e filtros de categoria adaptáveis ao toque. -->
    <div class="food-controls">
      <label class="food-search"><span class="sr-only">Buscar estabelecimento</span><i aria-hidden="true">⌕</i><input v-model="query" type="search" placeholder="Busque por nome, bairro ou comida"></label>
      <div class="food-filters" aria-label="Filtrar por tipo">
        <button v-for="item in categories" :key="item.value" :class="{ active: category === item.value }" :aria-pressed="category === item.value" @click="category = item.value">{{ item.label }}</button>
      </div>
    </div>

    <!-- Resultado atualizado conforme a busca, com mensagem útil quando vazio. -->
    <div v-if="results.length" class="food-grid" aria-live="polite"><FoodPlaceCard v-for="place in results" :key="place.id" :place="place" /></div>
    <div v-else class="food-empty"><b>Nenhum sabor encontrado.</b><span>Tente outro nome, bairro ou categoria.</span><button @click="query = ''; category = 'all'">Limpar busca</button></div>

    <p class="food-disclaimer"><span aria-hidden="true">i</span> Contatos, horários, cardápios e áreas de entrega podem mudar. Confirme as informações diretamente no canal do estabelecimento antes de sair ou fazer o pedido.</p>
  </section>
</template>

<style scoped>
/* Fundo e cabeçalho dão identidade própria ao guia sem depender de imagens. */
.food-section { padding: 110px max(5vw, 20px); background: #e8f1ef; }
.food-heading { max-width: 1400px; margin: 0 auto 34px; display: flex; align-items: end; justify-content: space-between; gap: 38px; }
.food-heading h2 { margin: 0; color: var(--forest); font: 600 clamp(42px, 4.5vw, 64px)/.98 "Cormorant Garamond", serif; }
.food-heading > p { max-width: 500px; margin: 0; color: var(--muted); line-height: 1.65; }

/* Controles pesquisáveis e categorias roláveis em telas pequenas. */
.food-controls { max-width: 1400px; margin: 0 auto 30px; padding: 14px; display: flex; align-items: center; gap: 16px; border: 1px solid rgba(23, 76, 66, .12); border-radius: 16px; background: rgba(255, 255, 255, .72); }
.food-search { min-width: 280px; flex: 1; display: flex; align-items: center; gap: 10px; min-height: 48px; padding: 0 15px; border: 1px solid var(--line); border-radius: 10px; background: #fff; }
.food-search i { color: var(--terra); font-size: 21px; font-style: normal; }
.food-search input { width: 100%; border: 0; outline: 0; background: transparent; color: var(--wood); }
.food-filters { display: flex; gap: 8px; }
.food-filters button { min-height: 44px; padding: 0 14px; border: 1px solid transparent; border-radius: 22px; background: transparent; color: var(--forest); font-size: 12px; font-weight: 800; white-space: nowrap; }
.food-filters button.active { border-color: var(--forest); background: var(--forest); color: #fff; }

/* Grade de estabelecimentos e estados de retorno. */
.food-grid { max-width: 1400px; margin: auto; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
.food-disclaimer { max-width: 1400px; margin: 24px auto 0; display: flex; gap: 10px; align-items: flex-start; color: #526b66; font-size: 12px; line-height: 1.55; }
.food-disclaimer span { flex: 0 0 auto; display: grid; place-items: center; width: 20px; height: 20px; border: 1px solid currentColor; border-radius: 50%; font-weight: 800; }
.food-empty { max-width: 1400px; margin: auto; padding: 60px 20px; display: grid; justify-items: center; gap: 8px; text-align: center; color: var(--muted); }
.food-empty b { color: var(--forest); font: 600 30px "Cormorant Garamond", serif; }
.food-empty button { margin-top: 10px; border: 0; background: transparent; color: var(--forest); font-weight: 800; text-decoration: underline; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; }

/* Tablet e mobile priorizam leitura, toque e rolagem horizontal dos filtros. */
@media (max-width: 1020px) {
  .food-heading { align-items: start; flex-direction: column; gap: 18px; }
  .food-controls { align-items: stretch; flex-direction: column; }
  .food-filters { width: 100%; overflow-x: auto; padding-bottom: 4px; scrollbar-width: thin; }
  .food-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 720px) {
  .food-section { padding: 68px 16px; }
  .food-heading { margin-bottom: 26px; }
  .food-heading h2 { font-size: clamp(40px, 12vw, 52px); }
  .food-controls { margin-inline: -2px; padding: 10px; border-radius: 14px; }
  .food-search { min-width: 0; width: 100%; }
  .food-filters { margin-inline: -2px; width: calc(100% + 4px); }
  .food-filters button { min-height: 46px; }
  .food-grid { grid-template-columns: minmax(0, 1fr); gap: 14px; }
}
</style>

