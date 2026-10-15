export interface Listing {
  id: string
  region: string
  title: string
  meta: string[]
  capacity: number
  minimumNights: number
  priceCents: number
  badge: string
  visualVariant: 1 | 2 | 3
}

export interface SearchFilters {
  region: string
  checkin: string
  checkout: string
  guests: number
}
