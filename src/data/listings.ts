import type { Listing } from '../types'

export const listings: Listing[] = [
  { id: 's1', region: 'Farol', title: 'Casa Brisa do Farol', meta: ['Até 6 hóspedes', '3 quartos', '2 banheiros'], capacity: 6, minimumNights: 2, priceCents: 48000, badge: 'Perto da praia', visualVariant: 1 },
  { id: 's2', region: 'Chapéu Virado', title: 'Chalé Varanda da Ilha', meta: ['Até 4 hóspedes', '2 quartos', 'Rede na varanda'], capacity: 4, minimumNights: 1, priceCents: 35000, badge: 'Charme local', visualVariant: 2 },
  { id: 's3', region: 'Baía do Sol', title: 'Refúgio da Baía', meta: ['Até 8 hóspedes', '4 quartos', 'Área externa'], capacity: 8, minimumNights: 3, priceCents: 62000, badge: 'Mais reservado', visualVariant: 3 },
  { id: 's4', region: 'Murubira', title: 'Casa Maré Mansa', meta: ['Até 5 hóspedes', '2 quartos', 'Cozinha equipada'], capacity: 5, minimumNights: 2, priceCents: 39000, badge: 'Boa para famílias', visualVariant: 2 }
]
