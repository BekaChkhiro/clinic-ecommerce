# Build stage - use full node (not alpine) for reliable admin build
FROM node:20 AS builder

WORKDIR /app

# Build arg for admin backend URL
ARG MEDUSA_BACKEND_URL
ENV MEDUSA_BACKEND_URL=$MEDUSA_BACKEND_URL

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for Vite/admin build)
RUN npm ci --legacy-peer-deps

# Copy all source files
COPY . .

# Build backend + admin
RUN npm run build

# Debug: verify admin build
RUN echo "=== Checking admin build ===" && \
    find .medusa -name "index.html" && \
    ls -la .medusa/server/public/admin/ 2>/dev/null || echo "Admin NOT in server/public/admin" && \
    ls -la .medusa/client/ 2>/dev/null || echo "Admin NOT in client/"

# Production stage - use alpine for smaller image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=9000

# Copy everything needed for runtime
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/medusa-config.ts ./
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/src ./src

EXPOSE 9000

CMD ["npm", "run", "start"]
