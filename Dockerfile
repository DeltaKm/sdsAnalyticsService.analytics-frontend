# ================================================
# FASE 1 — BUILDER
# Compila Next.js con output standalone
# ================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Per evitare errori su pacchetti nativi
RUN apk add --no-cache libc6-compat

# Copia i file package.json / lock
COPY package*.json ./

# Installa tutte le dipendenze
RUN npm install

# Copia tutto il codice del progetto
COPY . .

# Build Next.js (produce .next/standalone)
RUN npm run build


# ================================================
# FASE 2 — RUNNER
# Esegue il bundle standalone
# ================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Installa SOLO deps di produzione (più leggero)
COPY package*.json ./
RUN npm install --omit=dev

# Copia standalone e assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Esponi la porta
EXPOSE 8080

# Avvia Next.js standalone
CMD ["node", "server.js"]
