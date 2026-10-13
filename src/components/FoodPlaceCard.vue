<script setup lang="ts">
import type { FoodPlaceEntity } from '../domain/entities/FoodPlaceEntity'

defineProps<{ place: FoodPlaceEntity }>()

// Ícones textuais mantêm o card leve até a etapa dedicada às ilustrações.
const channelIcons = { order: '↗', reservation: '⌁', instagram: '◎', map: '⌖' } as const
</script>

<template>
  <!-- Card com dados essenciais, contato principal e transparência sobre a fonte. -->
  <article class="food-card">
    <div class="food-card-top">
      <span class="food-category">{{ place.categoryLabel }}</span>
      <span class="food-icon" aria-hidden="true">{{ channelIcons[place.action.channel] }}</span>
    </div>
    <h3>{{ place.name }}</h3>
    <p class="food-specialty">{{ place.specialty }}</p>
    <p class="food-description">{{ place.description }}</p>
    <div class="food-address"><span aria-hidden="true">⌖</span><span><b>{{ place.neighborhood }}</b><small>{{ place.address }}</small></span></div>
    <div class="food-card-footer">
      <a class="food-action" :href="place.action.url" target="_blank" rel="noopener noreferrer">{{ place.action.label }} <span aria-hidden="true">→</span></a>
      <a class="food-source" :href="place.sourceUrl" target="_blank" rel="noopener noreferrer" :aria-label="`Ver fonte das informações de ${place.name}`">Fonte</a>
    </div>
  </article>
</template>

<style scoped>
/* Estrutura visual do card gastronômico. */
.food-card { min-width: 0; display: flex; flex-direction: column; min-height: 360px; padding: 26px; border: 1px solid rgba(23, 76, 66, .14); border-radius: 18px; background: #fff; box-shadow: 0 8px 30px rgba(50, 46, 41, .055); transition: transform .2s, box-shadow .2s; }
.food-card:hover { transform: translateY(-4px); box-shadow: 0 16px 38px rgba(50, 46, 41, .1); }
.food-card-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.food-category { color: var(--terra); font-size: 11px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
.food-icon { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; background: #e8f1ef; color: var(--forest); font-size: 18px; }
h3 { margin: 18px 0 5px; color: var(--forest); font: 600 30px/1 "Cormorant Garamond", serif; }
.food-specialty { margin: 0; color: var(--forest); font-size: 13px; font-weight: 700; }
.food-description { flex: 1; margin: 18px 0; color: var(--muted); font-size: 14px; line-height: 1.6; }
.food-address { display: flex; gap: 10px; align-items: flex-start; padding-top: 16px; border-top: 1px solid var(--line); color: var(--forest); }
.food-address > span:first-child { color: var(--terra); }
.food-address span:last-child { display: flex; flex-direction: column; gap: 3px; }
.food-address b { font-size: 13px; }
.food-address small { color: var(--muted); line-height: 1.35; }
.food-card-footer { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-top: 20px; }
.food-action { min-height: 44px; display: inline-flex; align-items: center; gap: 9px; padding: 0 16px; border-radius: 9px; background: var(--forest); color: #fff; font-size: 13px; font-weight: 800; }
.food-source { padding: 10px 0; color: var(--muted); font-size: 12px; text-decoration: underline; text-underline-offset: 3px; }

/* Ajustes do card para telas estreitas. */
@media (max-width: 430px) {
  .food-card { min-height: 0; padding: 22px 18px; }
  .food-card-footer { align-items: stretch; flex-direction: column; }
  .food-action { justify-content: space-between; width: 100%; }
  .food-source { width: fit-content; }
}
</style>

