# Ilha & Lar

Plataforma web para descoberta de hospedagens de curta duração e imóveis à venda na Ilha de Mosqueiro, distrito de Belém–PA.

O projeto apresenta duas jornadas claramente separadas:

- **Hospedar-se:** busca por região, datas e quantidade de hóspedes;
- **Comprar:** busca de casas, chalés e terrenos por região e faixa de preço.

> O conteúdo, os anúncios e os valores desta versão são demonstrativos. A interface está preparada para uma futura integração com API, autenticação e persistência de dados.

## Site publicado

Versão privada publicada com OpenAI Sites:

<https://ilha-lar-mosqueiro.wryeel2.chatgpt.site>

## Tecnologias

- Vue 3 com Composition API;
- TypeScript em modo estrito;
- Vue Single-File Components (`.vue`);
- estilos globais com tokens CSS e estilos locais com `<style scoped>`;
- Vite para desenvolvimento e build;
- `vue-tsc` para validação de tipos;
- armazenamento local do navegador para favoritos;
- OpenAI Sites para hospedagem da demonstração.

## Requisitos

- Node.js 20 ou superior;
- npm, instalado junto com o Node.js.

As versões utilizadas pelo projeto estão registradas em `package.json` e `package-lock.json`.

## Instalação

Clone o repositório e instale as dependências:

```powershell
git clone https://github.com/brunokemel/hospedagem_mosqueiro.git
cd hospedagem_mosqueiro
npm install
```

## Ambiente de desenvolvimento

Inicie o servidor local:

```powershell
npm run dev
```

O Vite exibirá o endereço da aplicação no terminal, normalmente:

```text
http://localhost:5173
```

## Validação e build

Execute somente a verificação TypeScript:

```powershell
npm run typecheck
```

Gere o build de produção, incluindo a verificação TypeScript:

```powershell
npm run build
```

Os arquivos finais serão gerados em `dist/`.

## Scripts disponíveis

| Comando | Finalidade |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento do Vite. |
| `npm run typecheck` | Valida componentes Vue e arquivos TypeScript. |
| `npm run build` | Executa o typecheck e gera o build de produção. |

## Arquitetura

O projeto separa apresentação, aplicação, domínio e infraestrutura. A orientação a objetos é aplicada às regras de negócio, sem transformar componentes Vue em classes.

```text
src/
├── application/
│   ├── services/          # Serviços de aplicação, como favoritos
│   └── use-cases/         # Casos de uso, como busca de anúncios
├── banner/                # Imagens usadas no hero
├── components/            # Componentes Vue reutilizáveis
├── data/                  # Dados demonstrativos
├── domain/
│   ├── entities/          # Entidades com identidade e comportamento
│   ├── repositories/      # Contratos das fontes de dados
│   └── value-objects/     # Objetos de valor imutáveis
├── infrastructure/
│   └── repositories/      # Implementações concretas dos repositórios
├── App.vue                # Composição da página principal
├── main.ts                # Inicialização da aplicação Vue
├── mobile.css             # Regras responsivas complementares
├── styles.css             # Tokens e estilos globais
└── types.ts               # Tipos compartilhados da interface
```

### Camada de domínio

- `ListingEntity`: representa um anúncio e concentra comportamentos relacionados a finalidade e região;
- `Money`: representa valores monetários em centavos e formata preços em reais;
- `ListingRepository`: define o contrato para consultar anúncios.

### Camada de aplicação

- `SearchListings`: consulta e ordena anúncios sem depender da interface ou da fonte de dados;
- `FavoriteService`: gerencia favoritos persistidos no navegador.

### Infraestrutura

`InMemoryListingRepository` fornece os anúncios demonstrativos usados no protótipo. Ele pode ser substituído por uma implementação HTTP sem alterar os componentes ou o caso de uso.

## Componentes Vue

Os componentes usam `<script setup lang="ts">`, propriedades e eventos tipados e estilos encapsulados quando necessário.

- `BaseButton`: botão reutilizável com variantes visuais;
- `ModeSwitch`: alternância acessível entre hospedagem e compra;
- `SearchPanel`: formulário adaptativo para cada intenção de busca;
- `ListingCard`: apresentação reutilizável dos anúncios.

## Funcionalidades atuais

- alternância entre hospedagens e imóveis à venda;
- campos de busca específicos para cada modalidade;
- filtro por região de Mosqueiro;
- ordenação por preço;
- favoritos persistidos em `localStorage`;
- cards e detalhes de anúncios demonstrativos;
- formulários demonstrativos de reserva, visita, login e anúncio;
- filtros refletidos na URL;
- conteúdo editorial sobre Mosqueiro;
- banner com fotografia da orla e transição visual suave;
- menu e layout responsivos;
- diálogos, foco visível, labels e alvos de toque acessíveis.

## Responsividade

A interface foi projetada para funcionar a partir de 360 px e possui ajustes específicos para:

- celulares estreitos, até 430 px;
- celulares e tablets pequenos, até 720 px;
- tablets e telas intermediárias, até 1020 px;
- desktops e monitores amplos.

No mobile, o formulário utiliza uma coluna, os botões ocupam a largura disponível, os cards evitam rolagem horizontal e o banner passa a usar uma transição vertical.

## Identidade visual

Principais cores:

| Token | Cor | Uso |
|---|---|---|
| Verde mata | `#174C42` | Marca, títulos e ações principais |
| Areia | `#F4EBDD` | Fundos e transição do banner |
| Terracota | `#CA754B` | Destaques e acentos |
| Azul rio | `#83B6BC` | Elementos informativos |
| Madeira | `#322E29` | Texto e áreas escuras |

As fontes utilizadas são DM Sans na interface e Cormorant Garamond nos títulos editoriais.

## Dados e persistência

Nesta etapa, os anúncios ficam em `src/data/listings.ts`. Os favoritos são armazenados localmente no navegador.

Ainda não existem:

- banco de dados;
- API de produção;
- autenticação real;
- pagamento ou reserva instantânea;
- envio real de leads e solicitações.

## Imagens

As imagens do hero ficam em `src/banner/`. A versão atualmente escolhida é `orla2.0.jpg`, pois sua proporção 16:9 preserva melhor o horizonte, a praia e as pessoas nos recortes responsivos.

Antes do uso comercial, confirme autoria, licença, consentimentos necessários e créditos da fotografia.

## Publicação

O projeto possui o manifesto `.openai/hosting.json`, configurado para publicar a saída estática de `dist/` pelo OpenAI Sites.

A publicação não substitui o repositório GitHub: o código-fonte deve continuar sendo versionado normalmente, enquanto `dist/`, dependências e arquivos temporários permanecem ignorados.

## Próximas etapas

- integrar uma API TypeScript e PostgreSQL;
- implementar autenticação e recuperação de acesso;
- persistir favoritos por usuário;
- criar solicitação real de reserva e cadastro de leads;
- desenvolver painel do anunciante e moderação;
- substituir anúncios demonstrativos por dados verificados;
- adicionar galeria de imagens por anúncio;
- criar testes unitários, de componentes e fluxos E2E;
- executar auditorias de acessibilidade e desempenho;
- revisar conteúdo e imagens com pessoas de Mosqueiro.

## Aviso

Este repositório contém um protótipo. Informações comerciais, disponibilidade, preços, documentos, horários e contatos devem ser verificados antes de qualquer operação pública.
