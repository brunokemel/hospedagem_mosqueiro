import { FoodPlaceEntity, type FoodPlaceProps } from '../../domain/entities/FoodPlaceEntity'
import type { FoodPlaceRepository } from '../../domain/repositories/FoodPlaceRepository'

// Catálogo inicial baseado em canais públicos consultados em outubro de 2026.
const foodPlaces: readonly FoodPlaceProps[] = [
  {
    id: 'casa-moqueio', name: 'Casa Moqueio', category: 'regional', categoryLabel: 'Cozinha amazônica',
    specialty: 'Sabores amazônicos', address: 'Rua Luís Camões, 17', neighborhood: 'Praia do São Francisco',
    description: 'Experiência de cozinha amazônica com canal próprio para informações e reservas.',
    action: { label: 'Ver reservas', url: 'https://linktr.ee/casamoqueio.pa', channel: 'reservation' },
    sourceUrl: 'https://linktr.ee/casamoqueio.pa',
  },
  {
    id: 'muka-bad-bar', name: 'Muka Bad Bar', category: 'snack', categoryLabel: 'Bar e petiscos',
    specialty: 'Petiscos e bebidas', address: 'Mosqueiro', neighborhood: 'Confirme no Instagram',
    description: 'Opção descontraída para petiscos; consulte o perfil para localização e atendimento atuais.',
    action: { label: 'Abrir Instagram', url: 'https://www.instagram.com/mukamosqueiro', channel: 'instagram' },
    sourceUrl: 'https://primegourmetclub.com.br/mosqueiro-pa/Qg47MYypvLI4',
  },
  {
    id: 'pf-da-16', name: 'Restaurante PF da 16', category: 'restaurant', categoryLabel: 'Restaurante',
    specialty: 'Pratos feitos', address: 'Av. 16 de Novembro, 2945', neighborhood: 'Vila',
    description: 'Refeições práticas com cardápio e pedido disponíveis em canal digital.',
    action: { label: 'Pedir agora', url: 'https://instadelivery.com.br/restaurantepfda16', channel: 'order' },
    sourceUrl: 'https://portal.instadelivery.com.br/belem-2',
  },
  {
    id: 'chapa-quente', name: 'Chapa Quente', category: 'snack', categoryLabel: 'Hambúrguer e pizza',
    specialty: 'Hambúrgueres e pizzas', address: 'Av. Barão do Rio Branco, 3', neighborhood: 'Carananduba',
    description: 'Hamburgueria e pizzaria com cardápio e pedidos pela plataforma de delivery.',
    action: { label: 'Pedir agora', url: 'https://instadelivery.com.br/hamburgueriaepizzariachapaquen', channel: 'order' },
    sourceUrl: 'https://portal.instadelivery.com.br/belem-2',
  },
  {
    id: 'hotsushi', name: 'Hotsushi', category: 'restaurant', categoryLabel: 'Culinária japonesa',
    specialty: 'Sushi e combinados', address: 'Av. 16 de Novembro, 3502A', neighborhood: 'Vila',
    description: 'Opção de culinária japonesa com canal digital para consultar o cardápio.',
    action: { label: 'Pedir agora', url: 'https://instadelivery.com.br/hotsushi', channel: 'order' },
    sourceUrl: 'https://portal.instadelivery.com.br/belem-2',
  },
  {
    id: 'eden-brasas', name: 'Éden Brasas Steak House', category: 'restaurant', categoryLabel: 'Churrasco',
    specialty: 'Carnes e grelhados', address: 'Av. 16 de Novembro, 879', neighborhood: 'Chapéu Virado',
    description: 'Steak house com cardápio e pedidos disponíveis pelo canal de delivery.',
    action: { label: 'Pedir agora', url: 'https://instadelivery.com.br/edenbrasassteakhouse', channel: 'order' },
    sourceUrl: 'https://portal.instadelivery.com.br/belem-2',
  },
  {
    id: 'mana-pizza', name: 'Maná Pizza Burguer', category: 'snack', categoryLabel: 'Pizza e hambúrguer',
    specialty: 'Pizzas e lanches', address: 'Av. 16 de Novembro, 624', neighborhood: 'Mosqueiro',
    description: 'Pizzas, hambúrgueres e opções rápidas com pedido direto pelo cardápio online.',
    action: { label: 'Pedir agora', url: 'https://instadelivery.com.br/manapizzaburguer', channel: 'order' },
    sourceUrl: 'https://portal.instadelivery.com.br/belem-2',
  },
  {
    id: 'eden-doces', name: 'Éden Doces Cafeteria Gourmet', category: 'cafe', categoryLabel: 'Café e doces',
    specialty: 'Doces e cafeteria', address: 'Av. 16 de Novembro, 315', neighborhood: 'Chapéu Virado',
    description: 'Cafeteria e doceria com cardápio para consultar e pedir online.',
    action: { label: 'Pedir agora', url: 'https://instadelivery.com.br/edendocescafeteriagourmet', channel: 'order' },
    sourceUrl: 'https://portal.instadelivery.com.br/belem-2',
  },
  {
    id: 'forno-da-ilha', name: 'Forno da Ilha', category: 'snack', categoryLabel: 'Pizzaria',
    specialty: 'Pizzas', address: 'Av. Variante, 701', neighborhood: 'Ariramba',
    description: 'Pizzaria local com acesso ao cardápio e canal de pedido online.',
    action: { label: 'Pedir agora', url: 'https://instadelivery.com.br/fornodailha', channel: 'order' },
    sourceUrl: 'https://portal.instadelivery.com.br/belem-2',
  },
  {
    id: 'tapiocaria-mosqueiro', name: 'Tapiocaria de Mosqueiro', category: 'regional', categoryLabel: 'Tradição local',
    specialty: 'Tapiocas e café da manhã', address: 'Travessa Carlos Bentes', neighborhood: 'Vila',
    description: 'Ponto tradicional para provar tapiocas. Confira localização e funcionamento antes da visita.',
    action: { label: 'Ver no mapa', url: 'https://www.google.com/maps/search/?api=1&query=Tapiocaria+de+Mosqueiro+PA', channel: 'map' },
    sourceUrl: 'https://www.setur.pa.gov.br/sites/default/files/pdf/inventario_da_oferta_turistica_03-11-2016_-_mosqueiro_.pdf',
  },
]

// Implementação em memória adequada ao protótipo e preparada para futura persistência externa.
export class InMemoryFoodPlaceRepository implements FoodPlaceRepository {
  async list(): Promise<readonly FoodPlaceEntity[]> {
    return foodPlaces.map((place) => new FoodPlaceEntity(place))
  }
}

