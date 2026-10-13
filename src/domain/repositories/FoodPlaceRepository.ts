import type { FoodPlaceEntity } from '../entities/FoodPlaceEntity'

// Contrato que permite trocar a lista local por uma API sem alterar a interface.
export interface FoodPlaceRepository {
  list(): Promise<readonly FoodPlaceEntity[]>
}

