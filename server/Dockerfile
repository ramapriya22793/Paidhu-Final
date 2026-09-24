# Production-ready Dockerfile for Paidhu Backend Server
FROM node:20-slim AS base

# Install OpenSSL for Prisma binary compatibility, ca-certificates, and curl for healthcheck
RUN apt-get update -y && apt-get install -y openssl ca-certificates curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency manifests and Prisma schema first for layer caching
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies and generate Prisma client
RUN npm ci --omit=dev && npx prisma generate

# Copy the rest of the application code
COPY . .

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

# Expose backend port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:5000/api/ping || exit 1

# Start server
CMD ["node", "server.js"]
