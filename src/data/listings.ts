import type { Listing } from '../types'

export const listings: Listing[] = [
  { id: 's1', purpose: 'stay', region: 'Farol', title: 'Casa Brisa do Farol', meta: ['Até 6 hóspedes', '3 quartos', '2 banheiros'], priceCents: 48000, badge: 'Perto da praia', visualVariant: 1 },
  { id: 's2', purpose: 'stay', region: 'Chapéu Virado', title: 'Chalé Varanda da Ilha', meta: ['Até 4 hóspedes', '2 quartos', 'Rede na varanda'], priceCents: 35000, badge: 'Charme local', visualVariant: 2 },
  { id: 's3', purpose: 'stay', region: 'Baía do Sol', title: 'Refúgio da Baía', meta: ['Até 8 hóspedes', '4 quartos', 'Área externa'], priceCents: 62000, badge: 'Mais reservado', visualVariant: 3 },
  { id: 's4', purpose: 'stay', region: 'Murubira', title: 'Casa Maré Mansa', meta: ['Até 5 hóspedes', '2 quartos', 'Cozinha equipada'], priceCents: 39000, badge: 'Boa para famílias', visualVariant: 2 }
]
