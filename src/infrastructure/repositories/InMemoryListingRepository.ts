import { listings } from '../../data/listings'
import { ListingEntity } from '../../domain/entities/ListingEntity'
import type { ListingRepository } from '../../domain/repositories/ListingRepository'

/** Implementação local usada no protótipo; pode ser trocada por uma API sem alterar a interface. */
export class InMemoryListingRepository implements ListingRepository {
  private readonly items = listings.map((listing) => new ListingEntity(listing))

  async search(filters: { region?: string; guests?: number; nights?: number }): Promise<readonly ListingEntity[]> {
    return this.items.filter((listing) =>
      listing.isInRegion(filters.region ?? '')
      && listing.accommodates(filters.guests ?? 1)
      && listing.acceptsStay(filters.nights),
    )
  }
}
