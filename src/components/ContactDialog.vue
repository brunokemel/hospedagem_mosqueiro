<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from './BaseButton.vue'

type ContactKind = 'login' | 'announce' | 'booking'
defineProps<{ kind: ContactKind | null; title: string }>()
const emit = defineEmits<{ submit: [] }>()
const dialog = ref<HTMLDialogElement | null>(null)
function showModal(): void { dialog.value?.showModal() }
function close(): void { dialog.value?.close() }
function submit(): void { close(); emit('submit') }
defineExpose({ showModal, close })
</script>

<template>
  <dialog ref="dialog" class="modal form-modal" @click.self="close"><button class="modal-close" aria-label="Fechar" @click="close">×</button><div class="form-content"><p class="eyebrow">{{ kind === 'login' ? 'Sua conta' : kind === 'announce' ? 'Comece a anunciar' : 'Contato com o responsável' }}</p><h2>{{ title }}</h2><p>Preencha seus dados para continuar neste fluxo demonstrativo.</p><form @submit.prevent="submit"><label>Nome completo<input autocomplete="name" required></label><label>E-mail<input type="email" autocomplete="email" required></label><template v-if="kind !== 'login'"><label>Telefone<input type="tel" autocomplete="tel" required></label><label class="checkbox"><input type="checkbox" required><span>Concordo com o uso destes dados para atender esta solicitação.</span></label></template><BaseButton type="submit">{{ kind === 'login' ? 'Continuar' : 'Enviar solicitação' }}</BaseButton></form></div></dialog>
</template>
