import type { ListingMode } from '../../types'
import type { ListingEntity } from '../entities/ListingEntity'

/** Contrato que desacopla a busca de anúncios da fonte de dados usada. */
export interface ListingRepository {
  search(mode: ListingMode, region?: string): Promise<readonly ListingEntity[]>
}
