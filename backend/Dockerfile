# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy all source files
COPY . .

# Build backend and admin
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy everything needed for runtime
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/medusa-config.ts ./
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/src ./src

# Copy admin build (important!)
COPY --from=builder /app/.medusa/admin ./.medusa/admin

EXPOSE 9000

CMD ["npm", "run", "start"]
