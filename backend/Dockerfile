FROM node:20-alpine

WORKDIR /app

ARG MEDUSA_BACKEND_URL
ENV MEDUSA_BACKEND_URL=$MEDUSA_BACKEND_URL

COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .

# Build backend + admin
RUN npm run build

# Copy admin to where medusa start expects it: /app/public/admin/
RUN mkdir -p public && cp -r .medusa/server/public/admin public/admin

# Verify
RUN test -f public/admin/index.html && echo "Admin at /app/public/admin/ OK"

ENV NODE_ENV=production
ENV PORT=9000
EXPOSE 9000

CMD ["npm", "run", "start"]
