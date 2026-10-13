import type { Listing, ListingMode } from '../../types'
import { Money } from '../value-objects/Money'

/** Entidade de domínio que concentra os dados e comportamentos de um anúncio. */
export class ListingEntity {
  readonly id: string
  readonly purpose: ListingMode
  readonly region: string
  readonly title: string
  readonly meta: readonly string[]
  readonly price: Money
  readonly badge: string
  readonly visualVariant: 1 | 2 | 3

  constructor(data: Listing) {
    this.id = data.id
    this.purpose = data.purpose
    this.region = data.region
    this.title = data.title
    this.meta = Object.freeze([...data.meta])
    this.price = Money.fromCents(data.priceCents)
    this.badge = data.badge
    this.visualVariant = data.visualVariant
  }

  belongsTo(mode: ListingMode): boolean {
    return this.purpose === mode
  }

  isInRegion(region: string): boolean {
    return !region || this.region === region
  }
}
