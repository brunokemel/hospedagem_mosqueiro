export type FoodCategory = 'restaurant' | 'snack' | 'cafe' | 'regional'
export type ContactChannel = 'order' | 'reservation' | 'instagram' | 'map'

export interface FoodPlaceAction {
  readonly label: string
  readonly url: string
  readonly channel: ContactChannel
}

export interface FoodPlaceProps {
  readonly id: string
  readonly name: string
  readonly category: FoodCategory
  readonly categoryLabel: string
  readonly specialty: string
  readonly address: string
  readonly neighborhood: string
  readonly description: string
  readonly action: FoodPlaceAction
  readonly sourceUrl: string
}

// Entidade de domínio que concentra os dados e o comportamento de busca do estabelecimento.
export class FoodPlaceEntity {
  readonly id: string
  readonly name: string
  readonly category: FoodCategory
  readonly categoryLabel: string
  readonly specialty: string
  readonly address: string
  readonly neighborhood: string
  readonly description: string
  readonly action: FoodPlaceAction
  readonly sourceUrl: string

  constructor(props: FoodPlaceProps) {
    this.id = props.id
    this.name = props.name
    this.category = props.category
    this.categoryLabel = props.categoryLabel
    this.specialty = props.specialty
    this.address = props.address
    this.neighborhood = props.neighborhood
    this.description = props.description
    this.action = props.action
    this.sourceUrl = props.sourceUrl
  }

  matches(term: string): boolean {
    const searchable = [this.name, this.specialty, this.address, this.neighborhood, this.categoryLabel]
      .join(' ')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()

    return searchable.includes(term.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase())
  }
}

