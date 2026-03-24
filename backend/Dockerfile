# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Build arg for admin backend URL
ARG MEDUSA_BACKEND_URL
ENV MEDUSA_BACKEND_URL=$MEDUSA_BACKEND_URL

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for admin build)
RUN npm ci --legacy-peer-deps

# Copy all source files
COPY . .

# Build backend and admin
RUN npm run build

# Verify admin build exists
RUN ls -la .medusa/server/public/admin/ && echo "Admin build OK" || echo "WARNING: Admin build missing"

# Production stage
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
