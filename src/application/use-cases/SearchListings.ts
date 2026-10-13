import type { ListingMode } from '../../types'
import type { ListingEntity } from '../../domain/entities/ListingEntity'
import type { ListingRepository } from '../../domain/repositories/ListingRepository'

/** Caso de uso responsável por consultar e ordenar anúncios. */
export class SearchListings {
  constructor(private readonly repository: ListingRepository) {}

  async execute(input: { mode: ListingMode; region?: string; order?: 'featured' | 'low' | 'high' }): Promise<readonly ListingEntity[]> {
    const result = [...await this.repository.search(input.mode, input.region)]
    if (input.order === 'low') result.sort((a, b) => a.price.cents - b.price.cents)
    if (input.order === 'high') result.sort((a, b) => b.price.cents - a.price.cents)
    return result
  }
}
