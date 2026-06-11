# --- Base image ---
FROM node:20-alpine AS base
WORKDIR /app

# --- Install dependencies ---
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./
RUN npm ci

# --- Build the application ---
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- Production image ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create user
RUN addgroup -g 1001 nodejs
RUN adduser -u 1001 -G nodejs -s /bin/sh -D nodejs

# Copy build output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nodejs

EXPOSE 3000

CMD ["npm", "start"]
