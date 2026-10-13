import type { Listing } from '../types'

export const listings: Listing[] = [
  { id: 's1', purpose: 'stay', region: 'Farol', title: 'Casa Brisa do Farol', meta: ['Até 6 hóspedes', '3 quartos', '2 banheiros'], priceCents: 48000, badge: 'Perto da praia', visualVariant: 1 },
  { id: 's2', purpose: 'stay', region: 'Chapéu Virado', title: 'Chalé Varanda da Ilha', meta: ['Até 4 hóspedes', '2 quartos', 'Rede na varanda'], priceCents: 35000, badge: 'Charme local', visualVariant: 2 },
  { id: 's3', purpose: 'stay', region: 'Baía do Sol', title: 'Refúgio da Baía', meta: ['Até 8 hóspedes', '4 quartos', 'Área externa'], priceCents: 62000, badge: 'Mais reservado', visualVariant: 3 },
  { id: 's4', purpose: 'stay', region: 'Murubira', title: 'Casa Maré Mansa', meta: ['Até 5 hóspedes', '2 quartos', 'Cozinha equipada'], priceCents: 39000, badge: 'Boa para famílias', visualVariant: 2 },
  { id: 'v1', purpose: 'sale', region: 'Farol', title: 'Casa da Orla', meta: ['180 m²', '4 quartos', '2 vagas'], priceCents: 68000000, badge: 'Casa', visualVariant: 3 },
  { id: 'v2', purpose: 'sale', region: 'Chapéu Virado', title: 'Chalé das Mangueiras', meta: ['240 m²', '3 quartos', 'Terreno amplo'], priceCents: 54000000, badge: 'Chalé', visualVariant: 2 },
  { id: 'v3', purpose: 'sale', region: 'Baía do Sol', title: 'Terreno Vista do Rio', meta: ['600 m²', 'Acesso por via local'], priceCents: 29000000, badge: 'Terreno', visualVariant: 1 },
  { id: 'v4', purpose: 'sale', region: 'Murubira', title: 'Casa Pátio Murubira', meta: ['150 m²', '3 quartos', '1 vaga'], priceCents: 42000000, badge: 'Casa', visualVariant: 2 }
]
