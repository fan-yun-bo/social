FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY admin/package.json ./admin/package.json
RUN npm install --workspace admin --include-workspace-root

FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./package.json
COPY admin ./admin
RUN npm --workspace admin run build

FROM nginx:1.27-alpine AS runner
COPY admin/deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/admin/dist /usr/share/nginx/html
EXPOSE 80
