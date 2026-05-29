FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY server/package.json ./server/package.json
RUN npm install --workspace server --include-workspace-root

FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./package.json
COPY server ./server
RUN npm --workspace server run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./package.json
COPY server/package.json ./server/package.json
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/server/dist ./server/dist
EXPOSE 3000
CMD ["node", "server/dist/main.js"]
