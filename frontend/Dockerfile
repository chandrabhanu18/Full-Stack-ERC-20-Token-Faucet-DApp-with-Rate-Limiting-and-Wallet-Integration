# ---- Build stage ----
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Serve stage ----
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Health endpoint
RUN echo "ok" > /usr/share/nginx/html/health

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
