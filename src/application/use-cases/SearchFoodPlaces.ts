import type { FoodCategory, FoodPlaceEntity } from '../../domain/entities/FoodPlaceEntity'
import type { FoodPlaceRepository } from '../../domain/repositories/FoodPlaceRepository'

export type FoodCategoryFilter = FoodCategory | 'all'

// Caso de uso responsável por filtrar e ordenar o guia gastronômico.
export class SearchFoodPlaces {
  constructor(private readonly repository: FoodPlaceRepository) {}

  async execute(term: string, category: FoodCategoryFilter): Promise<readonly FoodPlaceEntity[]> {
    const places = await this.repository.list()

    return places
      .filter((place) => category === 'all' || place.category === category)
      .filter((place) => !term.trim() || place.matches(term.trim()))
      .sort((left, right) => left.name.localeCompare(right.name, 'pt-BR'))
  }
}

