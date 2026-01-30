# ---- Build stage ----
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM node:18-alpine

WORKDIR /app

# Copy package.json for dependencies
COPY package.json package-lock.json ./
RUN npm install --only=production

# Copy built frontend
COPY --from=build /app/dist ./dist

# Copy server file
COPY server.js .

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "server.js"]
