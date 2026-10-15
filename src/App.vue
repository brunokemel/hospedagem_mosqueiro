<script setup lang="ts">
import { computed, nextTick, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from './components/BaseButton.vue'
import ContactDialog from './components/ContactDialog.vue'
import HeroSearch from './components/HeroSearch.vue'
import HomeStayCta from './components/HomeStayCta.vue'
import FoodDirectory from './components/FoodDirectory.vue'
import ListingCard from './components/ListingCard.vue'
import ListingDetailsDialog from './components/ListingDetailsDialog.vue'
import SiteFooter from './components/SiteFooter.vue'
import SiteHeader from './components/SiteHeader.vue'
import { FavoriteService } from './application/services/FavoriteService'
import { SearchListings } from './application/use-cases/SearchListings'
import type { ListingEntity } from './domain/entities/ListingEntity'
import { InMemoryListingRepository } from './infrastructure/repositories/InMemoryListingRepository'
import type { SearchFilters } from './types'

type ModalKind = 'login' | 'announce' | 'booking' | null
type SortOrder = 'featured' | 'low' | 'high'
type Beach = {
  name: string
  area: string
  description: string
  query: string
}

// Dependências de domínio e aplicação, injetadas sem acoplar a interface à fonte de dados.
const searchListings = new SearchListings(new InMemoryListingRepository())
const favoriteService = new FavoriteService('ilhaelar-favorites', localStorage)
const route = useRoute()
const router = useRouter()

// A versão 16:9 preserva melhor a cena nos recortes desktop e mobile do hero.
const heroImage = new URL('./banner/orla2.0.jpg', import.meta.url).href

// Estado reativo da experiência principal.
const initialRegion = typeof route.query.regiao === 'string' ? route.query.regiao : ''
const initialCheckin = typeof route.query.chegada === 'string' ? route.query.chegada : ''
const initialCheckout = typeof route.query.saida === 'string' ? route.query.saida : ''
const parsedGuests = Number(route.query.hospedes)
const initialGuests = Number.isInteger(parsedGuests) && parsedGuests > 0 && parsedGuests <= 8 ? parsedGuests : 1
const initialSearch: SearchFilters | null = initialCheckin && initialCheckout > initialCheckin
  ? { region: initialRegion, checkin: initialCheckin, checkout: initialCheckout, guests: initialGuests }
  : null
const region = ref(initialRegion)
const guests = ref(initialSearch?.guests ?? 1)
const stayNights = ref<number | undefined>(initialSearch ? calculateNights(initialSearch) : undefined)
const activeSearch = ref<SearchFilters | null>(initialSearch)
const sortOrder = ref<SortOrder>('featured')
const showAll = ref(false)
const selectedListing = ref<ListingEntity | null>(null)
const modalKind = ref<ModalKind>(null)
const toastMessage = ref('')
const favorites = ref<string[]>(favoriteService.list())
const searchResult = ref<readonly ListingEntity[]>([])
const detailDialog = ref<InstanceType<typeof ListingDetailsDialog> | null>(null)
const formDialog = ref<InstanceType<typeof ContactDialog> | null>(null)
const routingBeach = ref<string | null>(null)

// Os destinos usam nomes completos reconhecidos pelos principais aplicativos de mapa.
const beaches: readonly Beach[] = [
  { name: 'Praia do Farol', area: 'Farol', description: 'Orla animada, pôr do sol e estrutura por perto.', query: 'Praia do Farol, Mosqueiro, Belém - PA' },
  { name: 'Praia do Chapéu Virado', area: 'Chapéu Virado', description: 'Faixa de areia ampla, ondas e quiosques na orla.', query: 'Praia do Chapéu Virado, Mosqueiro, Belém - PA' },
  { name: 'Praia do Murubira', area: 'Murubira', description: 'Praia extensa e um clima tranquilo para ir em família.', query: 'Praia do Murubira, Mosqueiro, Belém - PA' },
  { name: 'Praia do Ariramba', area: 'Ariramba', description: 'Um trecho mais sossegado da orla de Mosqueiro.', query: 'Praia do Ariramba, Mosqueiro, Belém - PA' },
  { name: 'Praia do Paraíso', area: 'Paraíso', description: 'Paisagem aberta e natureza no lado norte da ilha.', query: 'Praia do Paraíso, Mosqueiro, Belém - PA' },
  { name: 'Praia da Baía do Sol', area: 'Baía do Sol', description: 'Horizonte amplo e ritmo calmo na ponta da ilha.', query: 'Praia da Baía do Sol, Mosqueiro, Belém - PA' },
]

// A vitrine limita os resultados; o caso de uso continua responsável pela busca e ordenação.
const visibleListings = computed(() => showAll.value ? searchResult.value : searchResult.value.slice(0, 3))

const modalTitle = computed(() => {
  if (modalKind.value === 'login') return 'Entre na Ilha & Lar'
  if (modalKind.value === 'announce') return 'Conte sobre sua hospedagem'
  return 'Peça sua reserva'
})

watchEffect(async () => {
  searchResult.value = await searchListings.execute({ region: region.value, guests: guests.value, nights: stayNights.value, order: sortOrder.value })
})

function calculateNights(filters: SearchFilters): number {
  return Math.round((new Date(`${filters.checkout}T12:00:00`).getTime() - new Date(`${filters.checkin}T12:00:00`).getTime()) / 86400000)
}

function updateUrl(filters: SearchFilters | null): void {
  router.replace({
    name: 'stays',
    query: filters ? { regiao: filters.region || undefined, chegada: filters.checkin, saida: filters.checkout, hospedes: String(filters.guests) } : {},
  })
}

function showStays(scroll = false): void {
  router.push({ name: 'stays' })
  if (scroll) nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
}

function search(filters: SearchFilters): void {
  region.value = filters.region
  guests.value = filters.guests
  stayNights.value = calculateNights(filters)
  activeSearch.value = filters
  showAll.value = true
  updateUrl(filters)
  nextTick(() => document.querySelector('#destaques')?.scrollIntoView({ behavior: 'smooth' }))
}

function clearSearch(): void {
  region.value = ''
  guests.value = 1
  stayNights.value = undefined
  activeSearch.value = null
  updateUrl(null)
}

function formatSearchSummary(filters: SearchFilters): string {
  const format = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' })
  const checkin = format.format(new Date(`${filters.checkin}T12:00:00`))
  const checkout = format.format(new Date(`${filters.checkout}T12:00:00`))
  return `${checkin} – ${checkout} · ${filters.guests} ${filters.guests === 1 ? 'hóspede' : 'hóspedes'}`
}

function toggleFavorite(id: string): void {
  favorites.value = favoriteService.toggle(id)
  showToast(favorites.value.includes(id) ? 'Salvo nos seus favoritos.' : 'Removido dos favoritos.')
}

function openDetails(listing: ListingEntity): void {
  selectedListing.value = listing
  detailDialog.value?.showModal()
}

function openForm(kind: Exclude<ModalKind, null>): void {
  detailDialog.value?.close()
  modalKind.value = kind
  formDialog.value?.showModal()
}

function submitForm(): void {
  formDialog.value?.close()
  showToast(modalKind.value === 'login' ? 'Acesso demonstrativo concluído.' : 'Solicitação recebida. O fluxo está pronto para integração com a API.')
}

function showToast(message: string): void {
  toastMessage.value = message
  window.setTimeout(() => { if (toastMessage.value === message) toastMessage.value = '' }, 3200)
}

function googleMapsRoute(beach: Beach, origin?: GeolocationCoordinates): string {
  const params = new URLSearchParams({ api: '1', destination: beach.query, travelmode: 'driving' })
  if (origin) params.set('origin', `${origin.latitude},${origin.longitude}`)
  return `https://www.google.com/maps/dir/?${params.toString()}`
}

function openRouteUrl(beach: Beach, origin?: GeolocationCoordinates): void {
  const isAppleMobile = /iPad|iPhone|iPod/.test(navigator.userAgent)
  if (isAppleMobile) {
    const params = new URLSearchParams({ daddr: beach.query, dirflg: 'd' })
    params.set('saddr', origin ? `${origin.latitude},${origin.longitude}` : 'Current Location')
    window.location.href = `https://maps.apple.com/?${params.toString()}`
    return
  }
  window.location.href = googleMapsRoute(beach, origin)
}

function traceRoute(beach: Beach): void {
  routingBeach.value = beach.name
  showToast('Permita o acesso à localização para traçar a rota a partir de onde você está.')

  if (!navigator.geolocation) {
    openRouteUrl(beach)
    return
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => openRouteUrl(beach, coords),
    () => {
      showToast('Localização não liberada. O mapa usará sua posição atual ao abrir.')
      openRouteUrl(beach)
    },
    { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
  )
}

function wazeUrl(beach: Beach): string {
  return `https://www.waze.com/ul?${new URLSearchParams({ q: beach.query, navigate: 'yes' }).toString()}`
}
</script>

<template>
  <!-- Cabeçalho e navegação principal. -->
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
  <SiteHeader :favorites-count="favorites.length" @announce="openForm('announce')" @login="openForm('login')" @favorites="showToast(favorites.length ? `${favorites.length} anúncio(s) salvo(s) neste navegador.` : 'Você ainda não salvou nenhum anúncio.')" />

  <main id="conteudo">
    <!-- Hero, busca e vitrine principal do produto. -->
    <HeroSearch v-if="route.name === 'home'" :image="heroImage" @search="search" />

    <!-- Resultados filtráveis gerados pelo caso de uso. -->
    <section v-if="route.name === 'stays'" id="destaques" class="section listings-section page-section">
      <div class="section-heading"><div><p class="eyebrow">Seleção local</p><h2>Estadias para viver a ilha sem pressa</h2></div><div class="listing-tools"><label class="sort-label">Ordenar<select v-model="sortOrder"><option value="featured">Recomendados</option><option value="low">Menor preço</option><option value="high">Maior preço</option></select></label><BaseButton variant="outline" @click="showAll = !showAll">{{ showAll ? 'Ver menos' : 'Ver todos' }}</BaseButton></div></div>
      <div v-if="activeSearch" class="active-filter"><span>Busca para <b>{{ formatSearchSummary(activeSearch) }}</b><template v-if="region"> em <b>{{ region }}</b></template></span><button @click="clearSearch">limpar busca</button></div>
      <div v-if="visibleListings.length" class="listing-grid" aria-live="polite"><ListingCard v-for="listing in visibleListings" :key="listing.id" :listing="listing" :favorite="favorites.includes(listing.id)" @favorite="toggleFavorite" @details="openDetails" /></div>
      <div v-else class="empty-state"><span>⌕</span><h3>Nenhuma hospedagem encontrada</h3><p>Tente reduzir o número de hóspedes, ampliar a estadia ou escolher outra região.</p><BaseButton variant="outline" @click="clearSearch">Limpar busca</BaseButton></div>
    </section>

    <section v-if="route.name === 'mosqueiro'" class="section regions-section page-section"><div class="section-heading compact"><div><p class="eyebrow">Cada canto, um ritmo</p><h2>Explore a ilha por região</h2></div><p>Praia, vila ou sossego: conheça a vizinhança que combina com seus planos.</p></div><div class="region-grid"><article v-for="(item, index) in [{name:'Farol',copy:'Orla, movimento e pôr do sol'},{name:'Chapéu Virado',copy:'Memória, praça e casas de época'},{name:'Murubira',copy:'Praia extensa e clima familiar'},{name:'Baía do Sol',copy:'Calma, natureza e horizonte aberto'}]" :key="item.name" class="region-card" :class="`region-${index + 1}`"><span class="region-number">0{{ index + 1 }}</span><span><b>{{ item.name }}</b><small>{{ item.copy }}</small></span></article></div></section>

    <section v-if="route.name === 'mosqueiro'" class="section beach-routes-section" aria-labelledby="beach-routes-title">
      <div class="section-heading compact">
        <div><p class="eyebrow">Chegue sem complicação</p><h2 id="beach-routes-title">As praias de Mosqueiro no seu mapa</h2></div>
        <p>Escolha uma praia, permita o acesso à sua localização e receba a rota a partir de onde você estiver.</p>
      </div>
      <div class="beach-grid">
        <article v-for="(beach, index) in beaches" :key="beach.name" class="beach-card">
          <div class="beach-card-top"><span class="beach-pin" aria-hidden="true">⌖</span><small>Destino 0{{ index + 1 }}</small></div>
          <p class="beach-area">{{ beach.area }} · Mosqueiro</p>
          <h3>{{ beach.name }}</h3>
          <p>{{ beach.description }}</p>
          <div class="beach-actions">
            <button class="button button-primary" type="button" @click="traceRoute(beach)">{{ routingBeach === beach.name ? 'Abrindo mapa…' : 'Traçar rota' }} <span aria-hidden="true">→</span></button>
            <a :href="wazeUrl(beach)" target="_blank" rel="noopener noreferrer" :aria-label="`Abrir rota para ${beach.name} no Waze`">Abrir no Waze</a>
          </div>
        </article>
      </div>
      <p class="location-note"><span aria-hidden="true">◎</span> Sua localização é usada apenas pelo aplicativo de mapas para montar a rota e não fica salva no Ilha & Lar.</p>
    </section>

    <!-- Diretório gastronômico com busca, categorias e canais externos verificados. -->
    <FoodDirectory v-if="route.name === 'food'" />

    <HomeStayCta v-if="route.name === 'home'" @find="showStays(true)" @announce="openForm('announce')" />

    <section v-if="route.name === 'mosqueiro'" id="mosqueiro" class="story-section"><div class="story-visual" aria-label="Espaço reservado para fotografia de um chalé histórico"><div class="house-lines" aria-hidden="true"><span /><i /><b /></div><small>Imagem histórica ou autoral em breve</small></div><div class="story-copy"><p class="eyebrow">Uma ilha com memória</p><h2>Água doce, varandas abertas e histórias que atravessam gerações.</h2><p>Mosqueiro é praia fluvial, igarapé, bairro, feira e vida ribeirinha. Seus chalés guardam marcas do veraneio ligado à Belle Époque de Belém, enquanto a ilha segue viva no trabalho de pescadores, tapioqueiras, cozinheiros e moradores.</p><p>Aqui, encontrar um lugar também é aprender a cuidar dele.</p><a class="text-link" href="#guia">Veja o guia essencial ↓</a></div></section>

    <section v-if="route.name === 'home'" class="section trust-section"><div class="section-heading compact"><div><p class="eyebrow">Escolhas tranquilas</p><h2>Confiança em cada etapa</h2></div></div><div class="trust-grid"><article v-for="item in [{icon:'✓',title:'Informação clara',copy:'Preço total, regras e características visíveis antes do contato.'},{icon:'⌂',title:'Anúncios cuidados',copy:'Um processo de revisão pensado para reduzir surpresas.'},{icon:'♢',title:'Privacidade primeiro',copy:'Localização aproximada e dados compartilhados só quando necessário.'},{icon:'◎',title:'Olhar para a comunidade',copy:'Conteúdo que valoriza quem vive e trabalha na ilha.'}]" :key="item.title"><span>{{ item.icon }}</span><h3>{{ item.title }}</h3><p>{{ item.copy }}</p></article></div></section>

    <section v-if="route.name === 'mosqueiro'" id="guia" class="guide-section"><div><p class="eyebrow">Guia essencial</p><h2>Antes de chegar, vale saber</h2></div><div class="guide-list"><details><summary><span>01</span> Praias de água doce têm marés e ondas <i>+</i></summary><p>O comportamento da água muda ao longo do dia. Consulte condições locais e respeite a sinalização.</p></details><details><summary><span>02</span> Leve tempo para a culinária local <i>+</i></summary><p>Tapioca, peixe e sabores amazônicos fazem parte da experiência — prefira negócios e produtores locais.</p></details><details><summary><span>03</span> Cuide da ilha como quem mora aqui <i>+</i></summary><p>Recolha seu lixo, preserve áreas naturais e respeite a rotina das comunidades.</p></details></div></section>

    <section v-if="route.name === 'home'" class="host-section"><div class="host-copy"><p class="eyebrow">Sua hospedagem também pode estar aqui</p><h2>Abra as portas para novos encontros.</h2><p>Publique sua hospedagem com uma apresentação feita para Mosqueiro.</p><BaseButton @click="openForm('announce')">Quero anunciar →</BaseButton></div><ol><li><b>01</b><span><strong>Conte sobre a hospedagem</strong><small>Preencha as informações essenciais.</small></span></li><li><b>02</b><span><strong>Envie para revisão</strong><small>Conferimos clareza e segurança.</small></span></li><li><b>03</b><span><strong>Receba contatos</strong><small>Acompanhe o interesse pelo anúncio.</small></span></li></ol></section>
  </main>

  <SiteFooter @announce="openForm('announce')" @login="openForm('login')" />

  <ListingDetailsDialog ref="detailDialog" :listing="selectedListing" :search-summary="activeSearch ? formatSearchSummary(activeSearch) : undefined" @book="openForm('booking')" />
  <ContactDialog ref="formDialog" :kind="modalKind" :title="modalTitle" @submit="submitForm" />
  <div class="toast" :class="{ show: toastMessage }" role="status" aria-live="polite">{{ toastMessage }}</div>
</template>

<style scoped>
/* Ajustes pertencentes apenas à composição da página principal. */
main { overflow: hidden; }

.page-section { min-height: calc(100vh - 80px); }
.active-filter { display: flex; align-items: center; justify-content: space-between; gap: 18px; }
.active-filter button { flex: 0 0 auto; }

/* Guia de praias com ações pensadas para toque e abertura em apps de navegação. */
.beach-routes-section { background: #edf3f1; }
.beach-grid { width: min(1400px, 100%); margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.beach-card { min-height: 310px; display: flex; flex-direction: column; padding: 26px; border: 1px solid rgba(23, 76, 66, .14); border-radius: 18px; background: #fff; box-shadow: 0 8px 26px rgba(16, 59, 52, .05); }
.beach-card-top { display: flex; align-items: center; justify-content: space-between; color: var(--forest); }
.beach-card-top small { font-size: 10px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
.beach-pin { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 50%; background: #e2eeec; font-size: 24px; }
.beach-area { margin: 25px 0 5px !important; color: var(--terra) !important; font-size: 11px; font-weight: 800; letter-spacing: .09em; text-transform: uppercase; }
.beach-card h3 { margin: 0 0 10px; color: var(--forest); font: 600 29px "Cormorant Garamond", serif; }
.beach-card > p:not(.beach-area) { margin: 0 0 24px; color: var(--muted); line-height: 1.6; }
.beach-actions { margin-top: auto; display: flex; align-items: center; gap: 18px; }
.beach-actions .button { min-height: 46px; padding-inline: 17px; }
.beach-actions a { color: var(--forest); font-size: 13px; font-weight: 800; text-decoration: underline; text-underline-offset: 3px; }
.location-note { width: min(1400px, 100%); margin: 22px auto 0; display: flex; align-items: center; gap: 9px; color: var(--muted); font-size: 12px; line-height: 1.5; }
.location-note span { color: var(--forest); font-size: 18px; }

@media (max-width: 1020px) {
  .beach-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 720px) {
  .active-filter { align-items: flex-start; flex-direction: column; gap: 8px; }
  .beach-grid { grid-template-columns: 1fr; }
  .beach-card { min-height: 285px; }
  .beach-actions { align-items: stretch; flex-direction: column; gap: 13px; }
  .beach-actions a { min-height: 40px; display: grid; place-items: center; }
  .location-note { align-items: flex-start; }
}
</style>
