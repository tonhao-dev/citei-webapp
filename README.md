# Citei Webapp

Projeto de apoio para a palestra sobre **testes automatizados no frontend**. O objetivo é apresentar na prática os principais tipos de testes — unitários, integração, end-to-end e regressão visual — em uma aplicação React com TypeScript.

## Sobre a palestra

Capacitar os participantes a compreender e aplicar os principais tipos de testes automatizados em aplicações frontend, indo além dos testes visuais, abordando estratégias, boas práticas e o papel dos testes de unidade, integração, end-to-end, regressão visual e de contrato no desenvolvimento de software de qualidade.

## Tecnologias

- React 19 + TypeScript
- Vite
- Jest + Testing Library (unitários e integração)
- Playwright (e2e e regressão visual)

## Pré-requisitos

### Verificar se o Node.js e o npm estão instalados

Abra o terminal (Prompt de Comando ou PowerShell) e execute:

```bash
node -v
```

Se aparecer algo como `v18.x.x` ou superior, o Node.js já está instalado. Agora verifique o npm:

```bash
npm -v
```

Se aparecer um número de versão, o npm também está instalado.

### Se o Node.js não estiver instalado

1. Acesse [https://nodejs.org/pt](https://nodejs.org/pt)
2. Clique no botão de download da versão **LTS** (recomendada)
3. Execute o instalador `.msi` que foi baixado
4. Siga o assistente clicando em **Next** até finalizar a instalação
5. Após a instalação, feche e abra o terminal novamente
6. Execute `node -v` e `npm -v` para confirmar que tudo foi instalado corretamente

> O npm já vem incluído na instalação do Node.js, não precisa instalar separadamente.

## Como rodar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/tonhao-dev/citei-webapp
cd citei-webapp
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Instalar os navegadores do Playwright

```bash
npx playwright install
```

### 4. Rodar a aplicação

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

## Como rodar os testes

### Testes unitários

Testam funções e entidades de forma isolada.

```bash
npm run test:unit
```

### Testes de integração

Testam a interação entre componentes usando Testing Library.

```bash
npm run test:integration
```

### Testes end-to-end (E2E)

Testam fluxos completos no navegador com Playwright. A aplicação precisa estar rodando (`npm run dev`) antes de executar.

```bash
npm run test:e2e
```

Para rodar com o navegador visível:

```bash
npm run test:e2e:headed
```

Para abrir a interface visual do Playwright:

```bash
npm run test:e2e:ui
```

### Testes de regressão visual

Comparam screenshots da interface com imagens de referência para detectar mudanças visuais inesperadas.

**Gerar/atualizar os screenshots de referência:**

```bash
npm run test:e2e:snapshots
```

**Rodar a comparação visual:**

```bash
npm run test:e2e:regression
```

Se algum teste falhar, abra o relatório para ver as diferenças visuais (expected, actual e diff):

```bash
npx playwright show-report
```

## Estrutura de testes

```
__tests__/
├── unit/              # Testes unitários (Jest)
├── integration/       # Testes de integração (Jest + Testing Library)
├── factory/           # Factories para gerar dados de teste
└── e2e/               # Testes end-to-end (Playwright)
    └── ui/            # Testes de regressão visual (Playwright)
```

## Testes de contrato (Pact)

Este frontend é o consumidor. O backend (`citei-backend`) é o provedor.
O broker sobe a partir do repositório do backend: `npm run pact:broker:up`.

1. `npm run test:pact` gera o contrato na pasta `pacts/`.
2. `npm run pact:publish` envia o contrato ao broker (http://localhost:9292).
3. No backend, `npm run pact:verify` verifica o contrato.
4. `npm run pact:can-i-deploy` diz se esta versão pode ir para produção.

## Regressão visual (Playwright com Node e TypeScript)

Os testes ficam na pasta `visual/` e rodam dentro da imagem oficial `mcr.microsoft.com/playwright:v1.63.0-noble`. O mesmo navegador e as mesmas fontes geram sempre a mesma imagem.
A versão da imagem e a do `@playwright/test` (em `visual/package.json`) precisam ser iguais.

1. `npm run test:visual:update` grava as imagens de referência em `visual/tests/__snapshots__/`.
2. `npm run test:visual` compara a tela atual com essas imagens.
3. Se algo mudar sem querer, o teste falha e grava a imagem esperada, a atual e a diferença em `visual/test-results/`.
4. Se a mudança foi de propósito, rode o passo 1 de novo e faça commit das imagens novas.

O app sobe sozinho no compose `docker-compose.visual.yml`. A API é falsa, então não precisa do backend.
`npm run test:visual:down` apaga os containers.

## Segurança (Snyk)

1. Copie o token em https://app.snyk.io/account e ponha no `.env`: `SNYK_TOKEN=seu-token`.
2. Rode `npm run snyk:all` (dependências, código e imagem Docker).
3. Rode `npm run snyk:monitor` para guardar um snapshot no painel do Snyk.

Sem `SNYK_TOKEN` no `.env`, os scripts avisam e saem com código 0. Com token, falham se acharem problema de severidade alta ou maior.