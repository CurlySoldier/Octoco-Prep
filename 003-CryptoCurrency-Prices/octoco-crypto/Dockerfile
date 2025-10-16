## Multi-stage Dockerfile for building the Vite React app and serving with nginx
FROM node:20-alpine AS build

WORKDIR /app

# Install deps (including dev deps needed for the build)
COPY package.json package-lock.json* ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build

## Production image
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config to support SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf


# Use non-root user for security
USER nginx

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
