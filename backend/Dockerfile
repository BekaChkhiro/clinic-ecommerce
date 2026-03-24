FROM node:20-alpine

WORKDIR /app

ARG MEDUSA_BACKEND_URL
ENV MEDUSA_BACKEND_URL=$MEDUSA_BACKEND_URL

COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build
RUN test -f .medusa/server/public/admin/index.html && echo "Admin OK" || exit 1

ENV NODE_ENV=production
ENV PORT=9000
EXPOSE 9000

# Find where medusa looks for admin and start
CMD sh -c "\
  echo 'PWD:' && pwd && \
  echo 'Checking all possible admin locations:' && \
  ls .medusa/server/public/admin/index.html 2>/dev/null && echo 'Found in .medusa/server/public/admin/' || true && \
  ls .medusa/admin/index.html 2>/dev/null && echo 'Found in .medusa/admin/' || true && \
  ls build/admin/index.html 2>/dev/null && echo 'Found in build/admin/' || true && \
  ls public/admin/index.html 2>/dev/null && echo 'Found in public/admin/' || true && \
  ls .medusa/server/build/admin/index.html 2>/dev/null && echo 'Found in .medusa/server/build/admin/' || true && \
  echo '--- Grepping medusa source for admin path ---' && \
  grep -r 'admin build directory' node_modules/@medusajs/medusa/dist/ 2>/dev/null | head -3 && \
  grep -r 'index.html' node_modules/@medusajs/medusa/dist/commands/start.js 2>/dev/null | head -5 && \
  npm run start"
