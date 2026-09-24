# Stage 1: Build the React + Vite frontend
FROM node:20-slim AS builder

WORKDIR /app

# Build arguments for Vite client-side environment variables
ARG VITE_API_URL=""
ARG VITE_SUPABASE_URL=""
ARG VITE_SUPABASE_ANON_KEY=""
ARG VITE_RAZORPAY_KEY_ID=""

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
ENV VITE_RAZORPAY_KEY_ID=${VITE_RAZORPAY_KEY_ID}

# Copy dependency manifests first for layer caching
COPY package*.json ./
RUN npm ci

# Copy all source files and run production build
COPY . .
RUN npm run build

# Stage 2: Serve with lightweight NGINX Alpine
FROM nginx:alpine AS runner

# Remove default nginx static html files
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
