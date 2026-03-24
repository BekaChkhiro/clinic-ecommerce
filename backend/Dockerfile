FROM node:20-alpine

WORKDIR /app

# Build arg for admin backend URL
ARG MEDUSA_BACKEND_URL
ENV MEDUSA_BACKEND_URL=$MEDUSA_BACKEND_URL

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy all source files
COPY . .

# Build backend + admin
RUN npm run build

# Verify admin exists after build
RUN test -f .medusa/server/public/admin/index.html && echo "Admin OK" || exit 1

ENV NODE_ENV=production
ENV PORT=9000

EXPOSE 9000

# Debug at startup then start
CMD sh -c "echo '=== Runtime check ===' && ls -la .medusa/server/public/admin/ && find .medusa -name index.html && npm run start"
