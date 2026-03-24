# Build stage - use full node for reliable admin build
FROM node:20 AS builder

WORKDIR /app

# Build arg for admin backend URL
ARG MEDUSA_BACKEND_URL
ENV MEDUSA_BACKEND_URL=$MEDUSA_BACKEND_URL

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci --legacy-peer-deps

# Copy all source files
COPY . .

# Build backend + admin
RUN npm run build

# Debug: find ALL html files in .medusa
RUN echo "=== All files in .medusa ===" && find .medusa -type f -name "*.html" -o -name "*.js" -o -name "*.css" | head -30

# If admin built to .medusa/client, copy to where server expects it
RUN if [ -f .medusa/client/index.html ] && [ ! -f .medusa/server/public/admin/index.html ]; then \
      echo "Copying admin from client to server/public/admin" && \
      mkdir -p .medusa/server/public/admin && \
      cp -r .medusa/client/* .medusa/server/public/admin/; \
    fi

# Production stage - cache bust v2
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
