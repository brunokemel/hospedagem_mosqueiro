export type ListingMode = 'stay'

export interface Listing {
  id: string
  purpose: ListingMode
  region: string
  title: string
  meta: string[]
  priceCents: number
  badge: string
  visualVariant: 1 | 2 | 3
}

export interface SearchFilters {
  region: string
  checkin: string
  checkout: string
  guests: number
  propertyType: string
  maxPriceCents: number | null
}
