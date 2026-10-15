<script setup lang="ts">
import { ref } from 'vue'
import type { ListingEntity } from '../domain/entities/ListingEntity'
import BaseButton from './BaseButton.vue'

defineProps<{ listing: ListingEntity | null; searchSummary?: string }>()
const emit = defineEmits<{ book: [] }>()
const dialog = ref<HTMLDialogElement | null>(null)
function showModal(): void { dialog.value?.showModal() }
function close(): void { dialog.value?.close() }
defineExpose({ showModal, close })
</script>

<template>
  <dialog ref="dialog" class="modal" @click.self="close"><button class="modal-close" aria-label="Fechar" @click="close">×</button><template v-if="listing"><div class="detail-visual"><small>Galeria de fotos será adicionada na próxima etapa</small></div><div class="detail-body"><span class="listing-location">{{ listing.region }} · Mosqueiro</span><h2>{{ listing.title }}</h2><div class="detail-facts"><span v-for="fact in listing.meta" :key="fact">{{ fact }}</span><span>Mínimo de {{ listing.minimumNights }} {{ listing.minimumNights === 1 ? 'noite' : 'noites' }}</span></div><p v-if="searchSummary" class="booking-context">Sua busca: <b>{{ searchSummary }}</b></p><p>Este anúncio é demonstrativo para validar a experiência. Informações finais e disponibilidade serão conferidas antes da publicação real.</p><div class="detail-action"><div class="listing-price"><small>diária demonstrativa</small><strong>{{ listing.price.format() }}</strong></div><BaseButton @click="emit('book')">Solicitar reserva</BaseButton></div></div></template></dialog>
</template>

<style scoped>
.booking-context { padding: 12px 14px; border-radius: 10px; background: #e8f1ef; color: var(--forest) !important; }
</style>
