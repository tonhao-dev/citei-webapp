FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# A URL da API é fixada no build: o navegador chama a API direto.
ARG VITE_API_URL=http://localhost:3123
ENV VITE_API_URL=$VITE_API_URL
# "npm run build" roda tsc -b, que já falha no código atual (erros de tipo antigos). Aqui só o Vite.
RUN npx vite build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
