# Base Node.js image
FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the frontend application
RUN npm run build

# Production image
FROM node:18-alpine

# Install Puppeteer dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Set working directory
WORKDIR /app

# Copy from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# Install production dependencies only
RUN npm ci --omit=dev

# Create storage directory
RUN mkdir -p storage/pdfs storage/uploads

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "server/index.js"]