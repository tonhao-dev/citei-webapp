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
