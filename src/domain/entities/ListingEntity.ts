import type { Listing } from '../../types'
import { Money } from '../value-objects/Money'

/** Entidade de domínio que concentra os dados e comportamentos de um anúncio. */
export class ListingEntity {
  readonly id: string
  readonly region: string
  readonly title: string
  readonly meta: readonly string[]
  readonly capacity: number
  readonly minimumNights: number
  readonly price: Money
  readonly badge: string
  readonly visualVariant: 1 | 2 | 3

  constructor(data: Listing) {
    this.id = data.id
    this.region = data.region
    this.title = data.title
    this.meta = Object.freeze([...data.meta])
    this.capacity = data.capacity
    this.minimumNights = data.minimumNights
    this.price = Money.fromCents(data.priceCents)
    this.badge = data.badge
    this.visualVariant = data.visualVariant
  }

  isInRegion(region: string): boolean {
    return !region || this.region === region
  }

  accommodates(guests: number): boolean {
    return this.capacity >= guests
  }

  acceptsStay(nights?: number): boolean {
    return nights === undefined || nights >= this.minimumNights
  }
}
