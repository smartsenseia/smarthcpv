
┣ 📂.vscode
┃ ┗ 📜launch.json
┣ 📂Frontend
┃ ┣ 📂public
┃ ┃ ┗ 📜favicon.svg
┃ ┣ 📂src
┃ ┃ ┣ 📂app
┃ ┃ ┃ ┣ 📂layout
┃ ┃ ┃ ┃ ┣ 📜AppLayout.tsx
┃ ┃ ┃ ┃ ┣ 📜Sidebar.tsx
┃ ┃ ┃ ┃ ┗ 📜Topbar.tsx
┃ ┃ ┃ ┣ 📂providers
┃ ┃ ┃ ┃ ┣ 📜AuthProvider.tsx
┃ ┃ ┃ ┃ ┣ 📜QueryProviders.tsx
┃ ┃ ┃ ┃ ┗ 📜ThemeProvider.tsx
┃ ┃ ┃ ┣ 📂routes
┃ ┃ ┃ ┃ ┣ 📜guards.tsx
┃ ┃ ┃ ┃ ┗ 📜index.tsx
┃ ┃ ┃ ┣ 📜App.tsx
┃ ┃ ┃ ┗ 📜main.tsx
┃ ┃ ┣ 📂assets
┃ ┃ ┃ ┣ 📂icons
┃ ┃ ┃ ┃ ┣ 📜alert.svg
┃ ┃ ┃ ┃ ┣ 📜dashboard.svg
┃ ┃ ┃ ┃ ┣ 📜logout.svg
┃ ┃ ┃ ┃ ┣ 📜settings.svg
┃ ┃ ┃ ┃ ┣ 📜telemetry.svg
┃ ┃ ┃ ┃ ┗ 📜user.svg
┃ ┃ ┃ ┗ 📂images
┃ ┃ ┣ 📂features
┃ ┃ ┃ ┣ 📂alerts
┃ ┃ ┃ ┃ ┣ 📂api
┃ ┃ ┃ ┃ ┃ ┣ 📜alerts.api.ts
┃ ┃ ┃ ┃ ┃ ┗ 📜alerts.keys.ts
┃ ┃ ┃ ┃ ┣ 📂components
┃ ┃ ┃ ┃ ┃ ┣ 📜AlertBadge.tsx
┃ ┃ ┃ ┃ ┃ ┗ 📜AlertsTable.tsx
┃ ┃ ┃ ┃ ┣ 📂hooks
┃ ┃ ┃ ┃ ┃ ┣ 📜useAckAlert.ts
┃ ┃ ┃ ┃ ┃ ┗ 📜useAlerts.ts
┃ ┃ ┃ ┃ ┣ 📂pages
┃ ┃ ┃ ┃ ┃ ┗ 📜AlertsPage.tsx
┃ ┃ ┃ ┃ ┣ 📜index.ts
┃ ┃ ┃ ┃ ┗ 📜types.ts
┃ ┃ ┃ ┣ 📂auth
┃ ┃ ┃ ┃ ┣ 📂api
┃ ┃ ┃ ┃ ┃ ┗ 📜auth.api.ts
┃ ┃ ┃ ┃ ┣ 📂components
┃ ┃ ┃ ┃ ┃ ┗ 📜LoginForm.tsx
┃ ┃ ┃ ┃ ┣ 📂hooks
┃ ┃ ┃ ┃ ┃ ┣ 📜useLogin.ts
┃ ┃ ┃ ┃ ┃ ┗ 📜useMe.ts
┃ ┃ ┃ ┃ ┣ 📂pages
┃ ┃ ┃ ┃ ┃ ┗ 📜LoginPage.tsx
┃ ┃ ┃ ┃ ┣ 📂store
┃ ┃ ┃ ┃ ┃ ┗ 📜auth.store.ts
┃ ┃ ┃ ┃ ┣ 📜index.ts
┃ ┃ ┃ ┃ ┗ 📜types.ts
┃ ┃ ┃ ┗ 📂telemetry
┃ ┃ ┃   ┣ 📂api
┃ ┃ ┃   ┃ ┣ 📜telemetry.api.ts
┃ ┃ ┃   ┃ ┣ 📜telemetry.keys.ts
┃ ┃ ┃   ┃ ┗ 📜telemetry.mock.ts
┃ ┃ ┃   ┣ 📂components
┃ ┃ ┃   ┃ ┣ 📜TelemetryCard.tsx
┃ ┃ ┃   ┃ ┣ 📜TelemetryChart.tsx
┃ ┃ ┃   ┃ ┣ 📜TelemetryPage.tsx
┃ ┃ ┃   ┃ ┗ 📜TelemetryTable.tsx
┃ ┃ ┃   ┣ 📂hooks
┃ ┃ ┃   ┃ ┣ 📜useTelemetryLatest.ts
┃ ┃ ┃   ┃ ┗ 📜useTelemetryRange.ts
┃ ┃ ┃   ┣ 📂pages
┃ ┃ ┃   ┃ ┣ 📜TelemetryDetailPage.tsx
┃ ┃ ┃   ┃ ┗ 📜TelemetryOverviewPage.tsx
┃ ┃ ┃   ┣ 📜index.ts
┃ ┃ ┃   ┗ 📜types.ts
┃ ┃ ┣ 📂shared
┃ ┃ ┃ ┣ 📂api
┃ ┃ ┃ ┃ ┣ 📜env.ts
┃ ┃ ┃ ┃ ┣ 📜error.ts
┃ ┃ ┃ ┃ ┗ 📜http.ts
┃ ┃ ┃ ┣ 📂components
┃ ┃ ┃ ┃ ┣ 📂Button
┃ ┃ ┃ ┃ ┃ ┣ 📜Button.tsx
┃ ┃ ┃ ┃ ┃ ┗ 📜index.ts
┃ ┃ ┃ ┃ ┣ 📂Card
┃ ┃ ┃ ┃ ┃ ┣ 📜Card.tsx
┃ ┃ ┃ ┃ ┃ ┗ 📜index.ts
┃ ┃ ┃ ┃ ┣ 📂DataTable
┃ ┃ ┃ ┃ ┃ ┣ 📜DataTable.tsx
┃ ┃ ┃ ┃ ┃ ┗ 📜index.ts
┃ ┃ ┃ ┃ ┗ 📂Loading
┃ ┃ ┃ ┃   ┣ 📜index.ts
┃ ┃ ┃ ┃   ┣ 📜Skeleton.tsx
┃ ┃ ┃ ┃   ┗ 📜Spinner.tsx
┃ ┃ ┃ ┣ 📂hooks
┃ ┃ ┃ ┃ ┣ 📜useDebounce.ts
┃ ┃ ┃ ┃ ┗ 📜useInterval.ts
┃ ┃ ┃ ┣ 📂styles
┃ ┃ ┃ ┃ ┣ 📜global.css
┃ ┃ ┃ ┃ ┗ 📜theme.css
┃ ┃ ┃ ┣ 📂types
┃ ┃ ┃ ┃ ┣ 📜api.ts
┃ ┃ ┃ ┃ ┗ 📜index.ts
┃ ┃ ┃ ┗ 📂utils
┃ ┃ ┃   ┣ 📜dates.ts
┃ ┃ ┃   ┣ 📜format.ts
┃ ┃ ┃   ┗ 📜validate.ts
┃ ┃ ┗ 📜index.css
┃ ┣ 📜.env
┃ ┣ 📜.env.production
┃ ┣ 📜eslint.config.js
┃ ┣ 📜index.html
┃ ┣ 📜package.json
┃ ┣ 📜Readme.txt
┃ ┣ 📜tsconfig.json
┃ ┗ 📜vite.config.ts


---

## 1) Visão geral da arquitetura

A ideia central é separar o código em 3 camadas principais:

- **`app/`**: “cola” do aplicativo. Aqui ficam **entrada**, **rotas**, **providers globais** e **layout**.
- **`features/`**: módulos por domínio/funcionalidade (telemetria, alertas, autenticação). Cada feature contém **API**, **páginas**, **componentes específicos** e **hooks**.
- **`shared/`**: recursos reutilizáveis por várias features (cliente HTTP, componentes genéricos, hooks utilitários, estilos e tipos globais).

Isso evita um projeto “monolítico” e facilita crescer sem virar bagunça.

---

## 2) Diretório raiz: `frontend/`

### `package.json`
Define:
- dependências (react, router, libs de charts, react-query, etc.)
- scripts (`dev`, `build`, `lint`, `test`)
- configurações de tooling.

### `vite.config.ts`
Configuração do Vite (bundler):
- aliases (ex.: `@/` apontando para `src/`)
- plugins (React, SVGR, etc.)
- proxy de desenvolvimento (opcional, útil para evitar CORS no dev).

### `tsconfig.json`
Configurações do TypeScript:
- strict mode
- paths/aliases
- target de compilação
- include/exclude do projeto.

### `eslint.config.js`
Regras de lint:
- padronização de código (estilo)
- prevenção de bugs (uso correto de hooks, dependências do useEffect, etc.)

### `.env` e `.env.production`
Variáveis de ambiente:
- `.env` para desenvolvimento
- `.env.production` para build/produção

Exemplos típicos:
- `VITE_API_BASE_URL=https://api.seudominio.com`
- `VITE_APP_NAME=Telemetry Dashboard`

> Observação: no Vite, variáveis expostas ao frontend normalmente começam com `VITE_`.

---

## 3) `public/`

### `public/`
Arquivos servidos **como estão**, sem passar por bundler.
- Ideal para assets “estáticos” e fáceis de referenciar por URL.

#### `public/favicon.svg`
Ícone do site que aparece na aba do navegador.

---

## 4) `src/` (código-fonte do app)

### `src/index.css`
CSS global (se você estiver usando CSS puro) ou ponto de entrada de estilos globais.

> Algumas equipes preferem centralizar isso em `src/shared/styles/globals.css`. Você pode manter ambos, mas normalmente um deles vira a fonte principal.

### `src/assets/`
Arquivos de mídia **importados** pelo código (passam pelo bundler).
- Diferente de `public/`: aqui você importa no TS/JS (`import logo from ...`).

#### `src/assets/icons/`
Ícones (SVG/PNG) usados pela UI.

#### `src/assets/images/`
Imagens maiores (banners, backgrounds, placeholders, etc.).

---

## 5) `src/app/` — núcleo do aplicativo (orquestração)

### `src/app/main.tsx`
Ponto de entrada do React (bootstrap).
Responsabilidades típicas:
- criar o root (`createRoot(...)`)
- renderizar `<App />`
- aplicar providers globais (se não estiverem encapsulados em `App.tsx`)
- importar CSS global

> Este arquivo deve ser “pequeno” e estável.

---

### `src/app/App.tsx`
Componente raiz do app.
Responsabilidades típicas:
- montar a árvore principal: providers + rotas + layout
- decidir qual layout envolve as páginas (ex.: com sidebar)

Exemplo conceitual do que ele “organiza”:
- `<ThemeProvider>`
- `<AuthProvider>`
- `<QueryProvider>`
- `<Routes />` (ou `<RouterProvider />`)

---

### `src/app/routes/`
Define como o usuário navega entre páginas.

#### `src/app/routes/index.tsx`
Definição das rotas:
- mapeia URL → página
- organiza rotas aninhadas (ex.: `/telemetry`, `/alerts`)
- aplica layout base (quando usando nested routes)

Exemplos de rotas comuns:
- `/` → Dashboard overview
- `/telemetry` → visão geral
- `/telemetry/:assetId` → detalhes
- `/alerts` → lista de alertas
- `/login` → autenticação (se existir)

#### `src/app/routes/guards.tsx`
Guards (opcional) para controlar acesso:
- **rota protegida**: exige login
- **rota pública**: login, reset de senha
- bloqueio por perfil (admin, viewer, etc.)

Normalmente implementa componentes como:
- `<RequireAuth />`
- `<RequireRole roles={...} />`

---

### `src/app/providers/`
Providers globais: são “camadas” que envolvem o app e fornecem contexto.

#### `QueryProvider.tsx` (opcional)
Provider do React Query (TanStack Query), caso você use:
- cache de requisições
- revalidação automática
- estados de loading/error padronizados

Ele geralmente inicializa:
- `QueryClient`
- `QueryClientProvider`

#### `AuthProvider.tsx` (opcional)
Contexto de autenticação:
- mantém estado do usuário (logado/deslogado)
- token (em memória ou storage)
- funções `login`, `logout`, `refreshToken`
- disponibilidade de permissões/roles

#### `ThemeProvider.tsx` (opcional)
Tema e preferências visuais:
- dark/light mode
- tokens de design (cores, fontes)
- integra com CSS variables, Tailwind, MUI, etc.

---

### `src/app/layout/`
Componentes que estruturam a página (shell).

#### `AppLayout.tsx`
Layout principal:
- define a “moldura” do app (sidebar + topbar + área de conteúdo)
- recebe o conteúdo das páginas via children (ou `<Outlet />` do React Router)

#### `Sidebar.tsx`
Menu lateral:
- links para Telemetry, Alerts, Settings etc.
- pode mostrar status, filtros globais, seleção de ativo

#### `Topbar.tsx`
Barra superior:
- título da página atual
- seletor de data/intervalo
- botão de perfil/logout
- breadcrumbs, search global, etc.

---

## 6) `src/features/` — organização por domínio (escala bem)

Cada feature segue um padrão:
- `api/`: chamadas HTTP específicas daquele domínio
- `components/`: componentes específicos (não genéricos)
- `pages/`: telas que são rotas
- `hooks/`: lógica reutilizável dentro da feature
- `types.ts`: tipos do domínio
- `index.ts`: export público da feature (para import limpo)

### 6.1) `features/telemetry/`

#### `features/telemetry/api/telemetry.api.ts`
Funções que conversam com o backend para telemetria.
Exemplos de responsabilidades:
- `getLatest()` → último ponto por sensor/asset
- `getRange(from, to)` → série temporal
- `getAssets()` → lista de ativos monitorados

> Aqui você usa o client em `shared/api/http.ts` para evitar repetir baseURL, headers, tratamento de erro etc.

#### `features/telemetry/api/telemetry.keys.ts` (opcional)
Chaves do React Query para padronização de cache:
- evita inconsistência: todo mundo usa o mesmo “nome” de query
- facilita invalidar cache (ex.: após update)

Ex.: `telemetryKeys.latest(assetId)` / `telemetryKeys.range(assetId, from, to)`

#### `features/telemetry/components/TelemetryCard.tsx`
Componente de card específico para telemetria:
- mostra valor atual + unidade + status (ok/alarme)
- pode mostrar variação, timestamp, badge

#### `features/telemetry/components/TelemetryChart.tsx`
Gráfico específico:
- série temporal (linha)
- zoom/brush (se necessário)
- tooltip, seleção de intervalo

#### `features/telemetry/components/TelemetryTable.tsx`
Tabela específica:
- lista de pontos, agregações, min/max/avg
- paginação/ordenação (se preciso)
- export CSV (se quiser)

#### `features/telemetry/pages/TelemetryOverviewPage.tsx`
Página “overview” (rota):
- geralmente mostra cards com “latest”
- gráficos resumidos e filtros globais

#### `features/telemetry/pages/TelemetryDetailPage.tsx`
Página de detalhe (rota):
- foca em um ativo/sensor/canal
- histórico, comparações, estatísticas

#### `features/telemetry/hooks/useTelemetryLatest.ts`
Hook que encapsula a lógica de buscar “último valor”.
Se usar React Query:
- define queryKey
- chama `telemetry.api.ts`
- retorna data/loading/error

#### `features/telemetry/hooks/useTelemetryRange.ts`
Hook para buscar série temporal por intervalo.
Mesma ideia do anterior, mas com parâmetros (from/to).

#### `features/telemetry/types.ts`
Tipos do domínio Telemetry:
- `TelemetryPoint`
- `Sensor`
- `Asset`
- `TelemetrySeries`

Mantém o domínio “forte” e evita `any`.

#### `features/telemetry/index.ts`
Barrel exports (export público):
- permite importar assim: `import { TelemetryOverviewPage } from "@/features/telemetry";`
- expõe apenas o que deve ser usado fora da feature (não expõe internos desnecessários)

---

### 6.2) `features/alerts/`
Estrutura análoga à Telemetry, mas para alertas/eventos.

- `api/`: endpoints como `getAlerts`, `ackAlert`, `getRules`
- `components/`: `AlertsTable`, `AlertBadge`, `AlertFilters`
- `pages/`: `AlertsListPage`, `AlertDetailPage`
- `hooks/`: `useAlerts`, `useAcknowledgeAlert`
- `types.ts`: `Alert`, `AlertSeverity`, `AlertStatus`
- `index.ts`: exports

---

### 6.3) `features/auth/` (opcional)
Só existe se você tiver login/controle de acesso.

- `api/`: `login`, `refresh`, `logout`, `me`
- `pages/`: `LoginPage`, `ForgotPasswordPage`
- `components/`: `LoginForm`, `PasswordInput`
- `hooks/`: `useLogin`, `useMe`
- `store/`: estado global (se escolher Zustand/Redux) para auth/token
- `types.ts`: `User`, `AuthTokens`, `Role`
- `index.ts`: exports

---

## 7) `src/shared/` — infraestrutura e itens reutilizáveis

### 7.1) `shared/api/`

#### `shared/api/http.ts`
Cliente HTTP central.
Responsabilidades típicas:
- configurar baseURL (via `env.ts`)
- adicionar headers padrão (ex.: `Authorization`)
- interceptar respostas (401 → logout/refresh token)
- padronizar timeouts e parsing

> A ideia é: **nenhuma feature faz fetch “cru”**; todas usam esse cliente.

#### `shared/api/error.ts`
Normalização de erros:
- transforma erro do axios/fetch em um formato único
- ajuda a exibir mensagens consistentes na UI
- mapeia status code → mensagem amigável

Ex.: `ApiError { status, message, details }`

#### `shared/api/env.ts`
Leitura e validação das variáveis de ambiente:
- `API_BASE_URL`
- flags de build
- nome do app, etc.

Pode também:
- checar se variáveis obrigatórias existem e falhar cedo no dev.

---

### 7.2) `shared/components/`
Componentes genéricos, reutilizáveis por várias features.

#### `Button/`
Pasta por componente (recomendado para escalabilidade).

- `Button.tsx`: implementação do botão (variantes, tamanhos, estados)
- `index.ts`: export limpo (`export { Button } from "./Button";`)

#### `Card/`
Componente genérico de card (container com padding, sombra, header).

#### `DataTable/`
Tabela genérica (colunas configuráveis, paginação, sorting).
As features (Telemetry/Alerts) podem “montar” tabelas específicas em cima dela.

#### `Loading/`
Componentes de loading:
- spinner
- skeleton
- placeholder de carregamento

---

### 7.3) `shared/hooks/`

#### `useDebounce.ts`
Evita disparar ações a cada tecla (ex.: busca).
Ex.: debounced search input.

#### `useInterval.ts`
Executa ações periódicas de forma React-friendly.
Ex.: “recarregar latest a cada 5s” (quando não usa React Query refetch interval, ou para casos específicos).

---

### 7.4) `shared/utils/`

#### `dates.ts`
Helpers de data:
- parse/format ISO
- converter timezone
- intervalos (últimas 24h, última semana)

#### `format.ts`
Formatação:
- número com casas decimais
- unidades (°C, bar, L/m²h)
- moeda (se existir)

#### `validate.ts`
Validações:
- e-mail, senha, campos obrigatórios
- validação de filtros (from < to)
- sanitização simples

---

### 7.5) `shared/styles/`

#### `globals.css`
Estilos globais (reset, tipografia base, classes comuns).

#### `theme.css`
Tokens de tema (CSS variables):
- cores, espaçamentos, fontes
- dark/light mode (se aplicável)

---

### 7.6) `shared/types/`

#### `api.ts`
Tipos genéricos de API:
- `Paginated<T>`
- `ApiResponse<T>`
- `Sort`
- `Filter`

#### `index.ts`
Barrel exports para tipos compartilhados.

---

## 8) Convenções recomendadas (pra manter a estrutura saudável)

### 8.1) O que vai onde (regra de ouro)
- **Rota (tela)** → `features/*/pages`
- **Componente específico do domínio** → `features/*/components`
- **Componente genérico** → `shared/components`
- **Chamada HTTP** → `features/*/api` usando `shared/api/http.ts`
- **Lógica reutilizável da feature** → `features/*/hooks`
- **Lógica reutilizável geral** → `shared/hooks`
- **Tipos do domínio** → `features/*/types.ts`
- **Tipos genéricos** → `shared/types`

### 8.2) Importações limpas
Use o `index.ts` de cada feature para exportar o “público”.
Assim você evita imports profundos e acoplamento.

Exemplo desejado:
- `import { TelemetryOverviewPage } from "@/features/telemetry";`
Em vez de:
- `import TelemetryOverviewPage from "@/features/telemetry/pages/TelemetryOverviewPage";`

---

## 9) Fluxo típico de dados (como tudo se conecta)

Um caminho comum na feature Telemetry:

1. **Página** (`TelemetryOverviewPage.tsx`)
2. usa um **hook** (`useTelemetryLatest.ts`)
3. que chama a **API da feature** (`telemetry.api.ts`)
4. que usa o **cliente HTTP compartilhado** (`shared/api/http.ts`)
5. e retorna dados tipados (`telemetry/types.ts`)
6. a página renderiza com **componentes da feature** (`TelemetryCard`, `TelemetryChart` etc.)
7. e reutiliza componentes **shared** (Button, Card, Loading, DataTable) quando necessário.

---

## 10) Checklist: quando criar algo novo?

- Nova página? → `features/<dominio>/pages/`
- Novo endpoint? → `features/<dominio>/api/`
- Novo gráfico específico? → `features/<dominio>/components/`
- Hook para encapsular chamada? → `features/<dominio>/hooks/`
- Componente genérico que outras features usarão? → `shared/components/`
- Utilitário de data/formatação? → `shared/utils/`
- Tipo novo do domínio? → `features/<dominio>/types.ts`
- Tipo genérico (paginação etc.)? → `shared/types/api.ts`

---

## 11) Observação final (importante para FastAPI + Postgres)

Mesmo com Postgres, o frontend **nunca fala direto com o banco**:
- ele sempre consome a sua **API FastAPI** (HTTP/WS/SSE).
A estrutura aqui já assume isso: todas as features chamam `shared/api/http.ts` → backend.

---

Se você quiser, eu posso te devolver esse README já com:
- exemplos de nomenclatura de rotas (`/telemetry`, `/telemetry/:id`, `/alerts`)
- sugestão de alias `@` no `vite.config.ts`
- convenções de naming (PascalCase, kebab-case em rotas, etc.)
