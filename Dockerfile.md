# Dockerfile
Use this file to build the image manually if you are not using the pre-built image.

```dockerfile
# Base Image: Lightweight Node.js environment
FROM node:18-bullseye-slim

# System Dependencies
# These are required for Tor, I2P, and Monero dependencies
RUN apt-get update && apt-get install -y \
    openssl \
    libevent-2.1-7 \
    libboost-all-dev \
    libminiupnpc17 \
    libunbound8 \
    curl \
    wget \
    ca-certificates \
    procps \
    iputils-ping \
    net-tools \
    nano \
    && rm -rf /var/lib/apt/lists/*

# Working Directory
WORKDIR /app

# Ensure Application Structure Exists
# These folders will be overlaid by volumes at runtime, but must exist in image
RUN mkdir -p /app/monero/bin /app/monero/config /app/monero/storage \
    && mkdir -p /app/tor/bin /app/tor/config /app/tor/storage \
    && mkdir -p /app/i2p/bin /app/i2p/config /app/i2p/storage \
    && mkdir -p /app/docs

# Install Node Dependencies
COPY package*.json ./
# Install ALL dependencies (including dev tools like Vite)
RUN npm install

# Copy Application Source
COPY . .

# Set Permissions
# We use UID 1000 to match standard Linux users
RUN chown -R 1000:1000 /app
USER 1000

# Expose Service Ports
# 3000: Web UI
# 9050: Tor SOCKS
# 9051: Tor Control
# 4444: I2P HTTP Proxy
# 18081: Monero RPC
EXPOSE 3000 9050 9051 4444 18081

# Start the Node.js Controller (Vite)
CMD ["npm", "start"]
```