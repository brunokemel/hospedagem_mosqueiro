import { listings } from '../../data/listings'
import { ListingEntity } from '../../domain/entities/ListingEntity'
import type { ListingRepository } from '../../domain/repositories/ListingRepository'
import type { ListingMode } from '../../types'

/** Implementação local usada no protótipo; pode ser trocada por uma API sem alterar a interface. */
export class InMemoryListingRepository implements ListingRepository {
  private readonly items = listings.map((listing) => new ListingEntity(listing))

  async search(mode: ListingMode, region = ''): Promise<readonly ListingEntity[]> {
    return this.items.filter((listing) => listing.belongsTo(mode) && listing.isInRegion(region))
  }
}
