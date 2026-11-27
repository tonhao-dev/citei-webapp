# Mesma imagem para todo mundo: o navegador e as fontes iguais geram imagens iguais.
# A versão da imagem e a do @playwright/test (package.json) precisam ser iguais.
FROM mcr.microsoft.com/playwright:v1.63.0-noble

WORKDIR /work
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
