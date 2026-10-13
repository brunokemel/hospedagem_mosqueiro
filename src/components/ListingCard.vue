<script setup lang="ts">
import type { ListingEntity } from '../domain/entities/ListingEntity'

// API tipada do componente visual de anúncio.
const props = defineProps<{ listing: ListingEntity; favorite: boolean }>()
defineEmits<{ favorite: [id: string]; details: [listing: ListingEntity] }>()
const price = props.listing.price.format({ hideCents: props.listing.purpose === 'sale' })
</script>

<template>
  <!-- Card acessível e reutilizável para hospedagem e venda. -->
  <article class="listing-card">
    <div class="listing-media" :class="`variant-${listing.visualVariant}`">
      <span class="listing-badge">{{ listing.badge }}</span>
      <button class="favorite" :class="{ active: favorite }" :aria-label="favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'" @click="$emit('favorite', listing.id)">{{ favorite ? '♥' : '♡' }}</button>
    </div>
    <div class="listing-body">
      <span class="listing-location">{{ listing.region }} · Mosqueiro</span>
      <h3>{{ listing.title }}</h3>
      <p class="listing-meta">{{ listing.meta.join(' · ') }}</p>
      <div class="listing-footer">
        <div class="listing-price"><small>{{ listing.purpose === 'stay' ? 'a partir de' : 'valor demonstrativo' }}</small><strong>{{ price }}</strong><small v-if="listing.purpose === 'stay'">por diária · taxas à parte</small></div>
        <button class="card-link" @click="$emit('details', listing)">Ver detalhes →</button>
      </div>
    </div>
  </article>
</template>

<style scoped>
/* O componente mantém apenas seus ajustes locais; os tokens vivem no tema global. */
.listing-card { isolation: isolate; }
.card-link:hover { text-decoration: underline; }
</style>
