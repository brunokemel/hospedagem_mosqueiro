import type { ListingEntity } from '../entities/ListingEntity'

/** Contrato que desacopla a busca de anúncios da fonte de dados usada. */
export interface ListingRepository {
  search(filters: { region?: string; guests?: number; nights?: number }): Promise<readonly ListingEntity[]>
}
