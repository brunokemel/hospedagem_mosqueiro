<script setup lang="ts">
import { computed, nextTick, ref, watch, watchEffect } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import BaseButton from './components/BaseButton.vue'
import FoodDirectory from './components/FoodDirectory.vue'
import ListingCard from './components/ListingCard.vue'
import SearchPanel from './components/SearchPanel.vue'
import { FavoriteService } from './application/services/FavoriteService'
import { SearchListings } from './application/use-cases/SearchListings'
import type { ListingEntity } from './domain/entities/ListingEntity'
import { InMemoryListingRepository } from './infrastructure/repositories/InMemoryListingRepository'
import type { ListingMode, SearchFilters } from './types'

type ModalKind = 'login' | 'announce' | 'booking' | 'visit' | null
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
const mode = computed<ListingMode>(() => route.name === 'properties' ? 'sale' : 'stay')
const region = ref(typeof route.query.regiao === 'string' ? route.query.regiao : '')
const sortOrder = ref<SortOrder>('featured')
const showAll = ref(false)
const selectedListing = ref<ListingEntity | null>(null)
const modalKind = ref<ModalKind>(null)
const toastMessage = ref('')
const mobileMenuOpen = ref(false)
const favorites = ref<string[]>(favoriteService.list())
const searchResult = ref<readonly ListingEntity[]>([])
const detailDialog = ref<HTMLDialogElement | null>(null)
const formDialog = ref<HTMLDialogElement | null>(null)
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
  if (modalKind.value === 'announce') return 'Conte sobre seu imóvel'
  if (modalKind.value === 'visit') return 'Agende uma visita'
  return 'Peça sua reserva'
})

watch(mode, () => {
  region.value = ''
  showAll.value = false
})

watchEffect(async () => {
  searchResult.value = await searchListings.execute({ mode: mode.value, region: region.value, order: sortOrder.value })
})

function updateUrl(currentMode: ListingMode, currentRegion: string): void {
  const name = currentMode === 'sale' ? 'properties' : 'stays'
  router.replace({ name, query: currentRegion ? { regiao: currentRegion } : {} })
}

function chooseMode(value: ListingMode, scroll = false): void {
  router.push({ name: value === 'sale' ? 'properties' : 'stays' })
  if (scroll) nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
}

function search(filters: SearchFilters): void {
  region.value = filters.region
  showAll.value = true
  updateUrl(mode.value, region.value)
  nextTick(() => document.querySelector('#destaques')?.scrollIntoView({ behavior: 'smooth' }))
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

function formatPrice(listing: ListingEntity): string {
  return listing.price.format({ hideCents: listing.purpose === 'sale' })
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
  <header class="site-header">
    <RouterLink class="brand" to="/" aria-label="Ilha & Lar — início"><span class="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>Ilha <b>&</b> Lar</span></RouterLink>
    <nav class="main-nav" aria-label="Navegação principal"><RouterLink to="/hospedagens">Hospedagens</RouterLink><RouterLink to="/imoveis">Imóveis</RouterLink><RouterLink to="/onde-comer">Onde comer</RouterLink><RouterLink to="/mosqueiro">Mosqueiro</RouterLink></nav>
    <div class="header-actions">
      <button class="text-button" @click="openForm('announce')">Anunciar</button>
      <button class="icon-button" aria-label="Ver favoritos" @click="showToast(favorites.length ? `${favorites.length} anúncio(s) salvo(s) neste navegador.` : 'Você ainda não salvou nenhum anúncio.')">♡ <span>{{ favorites.length }}</span></button>
      <BaseButton variant="outline" @click="openForm('login')">Entrar</BaseButton>
      <button class="menu-button" :aria-expanded="mobileMenuOpen" aria-controls="mobile-navigation" :aria-label="mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'" @click="mobileMenuOpen = !mobileMenuOpen"><span /><span /><span /></button>
    </div>
    <!-- Menu compacto para navegação em telas pequenas. -->
    <nav v-if="mobileMenuOpen" id="mobile-navigation" class="mobile-nav" aria-label="Navegação móvel">
      <RouterLink to="/hospedagens" @click="mobileMenuOpen = false">Hospedagens</RouterLink>
      <RouterLink to="/imoveis" @click="mobileMenuOpen = false">Imóveis à venda</RouterLink>
      <RouterLink to="/onde-comer" @click="mobileMenuOpen = false">Onde comer</RouterLink>
      <RouterLink to="/mosqueiro" @click="mobileMenuOpen = false">Conheça Mosqueiro</RouterLink>
      <button @click="openForm('announce'); mobileMenuOpen = false">Quero anunciar</button>
    </nav>
  </header>

  <main id="conteudo">
    <!-- Hero, busca e vitrine principal do produto. -->
    <section v-if="route.name === 'home'" id="inicio" class="hero">
      <div class="hero-art">
        <img class="hero-photo" :src="heroImage" alt="Pôr do sol na orla de Mosqueiro, com banhistas e o rio ao fundo">
        <span class="hero-photo-shade" aria-hidden="true" />
        <div class="hero-label">◌ Orla de Mosqueiro</div>
      </div>
      <div class="hero-content"><p class="eyebrow">Mosqueiro, Belém–PA</p><h1>Seu lugar em<br> Mosqueiro começa aqui.</h1><p class="hero-copy">Para passar uns dias perto do rio ou criar novas raízes na ilha.</p><SearchPanel :mode="mode" @update:mode="chooseMode" @search="search" /><p class="demo-note">Anúncios e valores desta versão são demonstrativos.</p></div>
      <RouterLink class="scroll-cue" to="/mosqueiro">Descubra a ilha <span>→</span></RouterLink>
    </section>

    <!-- Resultados filtráveis gerados pelo caso de uso. -->
    <section v-if="route.name === 'stays' || route.name === 'properties'" id="destaques" class="section listings-section page-section">
      <div class="section-heading"><div><p class="eyebrow">Seleção local</p><h2>{{ mode === 'stay' ? 'Estadias para viver a ilha sem pressa' : 'Imóveis para criar raízes na ilha' }}</h2></div><div class="listing-tools"><label class="sort-label">Ordenar<select v-model="sortOrder"><option value="featured">Recomendados</option><option value="low">Menor preço</option><option value="high">Maior preço</option></select></label><BaseButton variant="outline" @click="showAll = !showAll">{{ showAll ? 'Ver menos' : 'Ver todos' }}</BaseButton></div></div>
      <div v-if="region" class="active-filter">Mostrando anúncios em <b>{{ region }}</b> · <button @click="region = ''; updateUrl(mode, '')">remover filtro</button></div>
      <div v-if="visibleListings.length" class="listing-grid" aria-live="polite"><ListingCard v-for="listing in visibleListings" :key="listing.id" :listing="listing" :favorite="favorites.includes(listing.id)" @favorite="toggleFavorite" @details="openDetails" /></div>
      <div v-else class="empty-state"><span>⌕</span><h3>Nenhum canto encontrado</h3><p>Tente outra região ou remova os filtros.</p><BaseButton variant="outline" @click="region = ''">Limpar filtros</BaseButton></div>
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

    <section v-if="route.name === 'home'" class="path-section"><article class="path-card path-stay"><div><p class="eyebrow">Para passar uns dias</p><h2>Acorde com a brisa do rio.</h2><p>Casas, pousadas e chalés para descansar, reunir a família e conhecer Mosqueiro no seu tempo.</p><BaseButton variant="light" @click="chooseMode('stay', true)">Encontrar hospedagem →</BaseButton></div><div class="path-art" aria-hidden="true"><span /><i /></div></article><article class="path-card path-buy"><div><p class="eyebrow">Para chamar de seu</p><h2>Crie raízes perto da água.</h2><p>Imóveis para morar, veranear ou começar um novo projeto, com informações claras e contato direto.</p><BaseButton variant="dark" @click="chooseMode('sale', true)">Ver imóveis à venda →</BaseButton></div><div class="path-art" aria-hidden="true"><span /><i /></div></article></section>

    <section v-if="route.name === 'mosqueiro'" id="mosqueiro" class="story-section"><div class="story-visual" aria-label="Espaço reservado para fotografia de um chalé histórico"><div class="house-lines" aria-hidden="true"><span /><i /><b /></div><small>Imagem histórica ou autoral em breve</small></div><div class="story-copy"><p class="eyebrow">Uma ilha com memória</p><h2>Água doce, varandas abertas e histórias que atravessam gerações.</h2><p>Mosqueiro é praia fluvial, igarapé, bairro, feira e vida ribeirinha. Seus chalés guardam marcas do veraneio ligado à Belle Époque de Belém, enquanto a ilha segue viva no trabalho de pescadores, tapioqueiras, cozinheiros e moradores.</p><p>Aqui, encontrar um lugar também é aprender a cuidar dele.</p><a class="text-link" href="#guia">Veja o guia essencial ↓</a></div></section>

    <section v-if="route.name === 'home'" class="section trust-section"><div class="section-heading compact"><div><p class="eyebrow">Escolhas tranquilas</p><h2>Confiança em cada etapa</h2></div></div><div class="trust-grid"><article v-for="item in [{icon:'✓',title:'Informação clara',copy:'Preço total, regras e características visíveis antes do contato.'},{icon:'⌂',title:'Anúncios cuidados',copy:'Um processo de revisão pensado para reduzir surpresas.'},{icon:'♢',title:'Privacidade primeiro',copy:'Localização aproximada e dados compartilhados só quando necessário.'},{icon:'◎',title:'Olhar para a comunidade',copy:'Conteúdo que valoriza quem vive e trabalha na ilha.'}]" :key="item.title"><span>{{ item.icon }}</span><h3>{{ item.title }}</h3><p>{{ item.copy }}</p></article></div></section>

    <section v-if="route.name === 'mosqueiro'" id="guia" class="guide-section"><div><p class="eyebrow">Guia essencial</p><h2>Antes de chegar, vale saber</h2></div><div class="guide-list"><details><summary><span>01</span> Praias de água doce têm marés e ondas <i>+</i></summary><p>O comportamento da água muda ao longo do dia. Consulte condições locais e respeite a sinalização.</p></details><details><summary><span>02</span> Leve tempo para a culinária local <i>+</i></summary><p>Tapioca, peixe e sabores amazônicos fazem parte da experiência — prefira negócios e produtores locais.</p></details><details><summary><span>03</span> Cuide da ilha como quem mora aqui <i>+</i></summary><p>Recolha seu lixo, preserve áreas naturais e respeite a rotina das comunidades.</p></details></div></section>

    <section v-if="route.name === 'home'" class="host-section"><div class="host-copy"><p class="eyebrow">Seu imóvel também pode estar aqui</p><h2>Abra as portas para novos encontros.</h2><p>Publique sua hospedagem ou imóvel à venda com uma apresentação feita para Mosqueiro.</p><BaseButton @click="openForm('announce')">Quero anunciar →</BaseButton></div><ol><li><b>01</b><span><strong>Conte sobre o imóvel</strong><small>Preencha as informações essenciais.</small></span></li><li><b>02</b><span><strong>Envie para revisão</strong><small>Conferimos clareza e segurança.</small></span></li><li><b>03</b><span><strong>Receba contatos</strong><small>Acompanhe o interesse pelo anúncio.</small></span></li></ol></section>
  </main>

  <footer class="site-footer"><div class="footer-top"><div><RouterLink class="brand brand-light" to="/"><span class="brand-mark"><i /><i /><i /></span><span>Ilha <b>&</b> Lar</span></RouterLink><p>Seu canto em Mosqueiro,<br> por alguns dias ou por muitos anos.</p></div><div><h3>Encontre</h3><RouterLink to="/hospedagens">Hospedagens</RouterLink><RouterLink to="/imoveis">Imóveis à venda</RouterLink><RouterLink to="/onde-comer">Onde comer</RouterLink></div><div><h3>Para anunciar</h3><button @click="openForm('announce')">Publicar imóvel</button><button @click="openForm('login')">Área do anunciante</button></div><div><h3>Descubra</h3><RouterLink to="/mosqueiro">Conheça Mosqueiro</RouterLink><a href="mailto:contato@ilhaelar.com.br">Contato</a></div></div><div class="footer-bottom"><span>© 2026 Ilha & Lar — Protótipo demonstrativo.</span><span>Privacidade · Termos · Acessibilidade</span></div></footer>

  <dialog ref="detailDialog" class="modal" @click.self="detailDialog?.close()"><button class="modal-close" aria-label="Fechar" @click="detailDialog?.close()">×</button><template v-if="selectedListing"><div class="detail-visual"><small>Galeria de fotos será adicionada na próxima etapa</small></div><div class="detail-body"><span class="listing-location">{{ selectedListing.region }} · Mosqueiro</span><h2>{{ selectedListing.title }}</h2><div class="detail-facts"><span v-for="fact in selectedListing.meta" :key="fact">{{ fact }}</span></div><p>Este anúncio é demonstrativo para validar a experiência. Informações finais, documentação e disponibilidade serão conferidas antes da publicação real.</p><div class="detail-action"><div class="listing-price"><small>valor demonstrativo</small><strong>{{ formatPrice(selectedListing) }}</strong></div><BaseButton @click="openForm(selectedListing.purpose === 'sale' ? 'visit' : 'booking')">{{ selectedListing.purpose === 'sale' ? 'Agendar visita' : 'Solicitar reserva' }}</BaseButton></div></div></template></dialog>
  <dialog ref="formDialog" class="modal form-modal" @click.self="formDialog?.close()"><button class="modal-close" aria-label="Fechar" @click="formDialog?.close()">×</button><div class="form-content"><p class="eyebrow">{{ modalKind === 'login' ? 'Sua conta' : modalKind === 'announce' ? 'Comece a anunciar' : 'Contato com o responsável' }}</p><h2>{{ modalTitle }}</h2><p>Preencha seus dados para continuar neste fluxo demonstrativo.</p><form @submit.prevent="submitForm"><label>Nome completo<input autocomplete="name" required></label><label>E-mail<input type="email" autocomplete="email" required></label><template v-if="modalKind !== 'login'"><label>Telefone<input type="tel" autocomplete="tel" required></label><label class="checkbox"><input type="checkbox" required><span>Concordo com o uso destes dados para atender esta solicitação.</span></label></template><BaseButton type="submit">{{ modalKind === 'login' ? 'Continuar' : 'Enviar solicitação' }}</BaseButton></form></div></dialog>
  <div class="toast" :class="{ show: toastMessage }" role="status" aria-live="polite">{{ toastMessage }}</div>
</template>

<style scoped>
/* Ajustes pertencentes apenas à composição da página principal. */
main { overflow: hidden; }

/* Dissolve a fotografia no fundo areia e mantém uma zona segura para leitura. */
.hero::after { content: ''; position: absolute; z-index: 1; inset: 0; background: linear-gradient(90deg, var(--sand) 0 36%, rgba(244, 235, 221, .98) 46%, rgba(244, 235, 221, .78) 54%, rgba(244, 235, 221, .26) 65%, transparent 74%); pointer-events: none; }
.hero-art { inset: 0 0 0 42%; background: transparent; }
.hero-art::before, .hero-art::after { display: none; }
.hero-photo { width: 100%; height: 100%; display: block; object-fit: cover; object-position: 48% 58%; filter: saturate(.92) contrast(1.05) brightness(.9); -webkit-mask-image: linear-gradient(90deg, transparent 0, rgba(0, 0, 0, .2) 7%, #000 24%, #000 100%); mask-image: linear-gradient(90deg, transparent 0, rgba(0, 0, 0, .2) 7%, #000 24%, #000 100%); }
.hero-photo-shade { position: absolute; inset: 0; background: linear-gradient(90deg, transparent 12%, rgba(16, 59, 52, .12) 42%, transparent 70%), linear-gradient(0deg, rgba(16, 30, 27, .25), transparent 45%); pointer-events: none; }

/* Navegação móvel encapsulada no componente da página. */
.menu-button { display: none; width: 44px; height: 44px; padding: 10px; border: 0; border-radius: 50%; background: transparent; }
.menu-button span { display: block; width: 22px; height: 2px; margin: 4px auto; border-radius: 2px; background: var(--forest); }
.mobile-nav { display: none; }
.main-nav a.router-link-active { color: var(--terra); }
.page-section { min-height: calc(100vh - 80px); }

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
  .hero::after { display: none; }
  .hero-art { inset: auto; }
  .hero-photo { -webkit-mask-image: linear-gradient(180deg, transparent 0, #000 18%, #000 100%); mask-image: linear-gradient(180deg, transparent 0, #000 18%, #000 100%); }
  .menu-button { display: block; }
  .mobile-nav { position: absolute; top: calc(100% + 1px); right: 16px; left: 16px; display: grid; padding: 10px; border: 1px solid rgba(23, 76, 66, .14); border-radius: 0 0 16px 16px; background: var(--paper); box-shadow: 0 18px 40px rgba(16, 59, 52, .16); }
  .mobile-nav a, .mobile-nav button { min-height: 50px; display: flex; align-items: center; padding: 0 14px; border: 0; border-bottom: 1px solid var(--line); background: transparent; color: var(--forest); font-weight: 700; text-align: left; }
  .mobile-nav button { border-bottom: 0; color: var(--terra); }
  .beach-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 720px) {
  .hero-photo { object-position: 47% 58%; }
  .hero-photo-shade { background: linear-gradient(0deg, rgba(16, 30, 27, .28), transparent 55%); }
  .beach-grid { grid-template-columns: 1fr; }
  .beach-card { min-height: 285px; }
  .beach-actions { align-items: stretch; flex-direction: column; gap: 13px; }
  .beach-actions a { min-height: 40px; display: grid; place-items: center; }
  .location-note { align-items: flex-start; }
}
</style>
