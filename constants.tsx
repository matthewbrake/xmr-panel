import React from 'react';

export const Icons = {
    Play: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>,
    Square: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>,
    RefreshCw: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>,
    Shield: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
    Activity: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
    Terminal: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>,
    Download: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
    CheckCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
    XCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>,
    Folder: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>,
    Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
    FileText: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
    HardDrive: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="12" x2="2" y2="12"></line><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path><line x1="6" y1="16" x2="6.01" y2="16"></line><line x1="10" y1="16" x2="10.01" y2="16"></line></svg>,
    LayoutDashboard: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
    Server: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>,
    Globe: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
};

export const INITIAL_SERVICES = [
    {
        id: 'tor',
        name: 'Tor Service',
        description: 'Anonymity network router',
        paths: {
            binary: '/app/tor/bin/tor',
            config: '/app/tor/config/torrc',
            storage: '/app/tor/storage'
        },
        port: 9050,
        status: 'STOPPED',
        version: 'Unknown',
        storageSize: '0 B',
        networkStats: { inbound: '0 KB/s', outbound: '0 KB/s', connections: 0 }
    },
    {
        id: 'i2p',
        name: 'I2P Daemon',
        description: 'Invisible Internet Project',
        paths: {
            binary: '/app/i2p/bin/i2pd',
            config: '/app/i2p/config/i2pd.conf',
            storage: '/app/i2p/storage'
        },
        port: 4444,
        status: 'STOPPED',
        version: 'Unknown',
        storageSize: '0 B',
        networkStats: { inbound: '0 KB/s', outbound: '0 KB/s', connections: 0 }
    },
    {
        id: 'monero',
        name: 'Monero Node',
        description: 'Private Decentralized Currency',
        paths: {
            binary: '/app/monero/bin/monerod',
            config: '/app/monero/config/monerod.conf',
            storage: '/app/monero/storage'
        },
        port: 18081,
        status: 'STOPPED',
        version: 'Unknown',
        storageSize: '0 B',
        networkStats: { inbound: '0 KB/s', outbound: '0 KB/s', connections: 0 }
    }
];

export const DOCS_DATA = [
    {
        id: 'folder-structure',
        title: 'Folder Structure & Setup',
        content: `# Folder Structure & Architecture

To use this Privacy Suite Controller effectively, you must understand the mapping between your Host machine and the Docker Container.

## The Concept
The container is stateless for binaries and config. This means if you destroy the container, you don't lose your blockchain or your custom Tor configuration, because they are mapped to your host machine.

## Required Host Structure
Run this bash script on your host machine to create the necessary structure before starting Docker:

\`\`\`bash
#!/bin/bash
# Create root directory
mkdir -p ./privacy-suite

# Create Monero Dirs
mkdir -p ./privacy-suite/app/monero/bin
mkdir -p ./privacy-suite/app/monero/config
mkdir -p ./privacy-suite/app/monero/storage

# Create Tor Dirs
mkdir -p ./privacy-suite/app/tor/bin
mkdir -p ./privacy-suite/app/tor/config
mkdir -p ./privacy-suite/app/tor/storage

# Create I2P Dirs
mkdir -p ./privacy-suite/app/i2p/bin
mkdir -p ./privacy-suite/app/i2p/config
mkdir -p ./privacy-suite/app/i2p/storage

# Create Docs Dir
mkdir -p ./privacy-suite/docs

echo "Structure created. Now place your binaries in the 'bin' folders!"
\`\`\`

## Mappings
- **Host**: \`./privacy-suite/app/monero/bin\` -> **Container**: \`/app/monero/bin\`
- **Host**: \`./privacy-suite/app/monero/storage\` -> **Container**: \`/app/monero/storage\`
- **Host**: \`./privacy-suite/app/monero/config\` -> **Container**: \`/app/monero/config\`

(Same pattern applies for Tor and I2P)`
    },
    {
        id: 'dockerfile',
        title: 'Dockerfile',
        content: `# Dockerfile
Use this file to build the image manually if you are not using the pre-built image.

\`\`\`dockerfile
# Base Image: Lightweight Node.js environment
FROM node:18-bullseye-slim

# System Dependencies
# These are required for Tor, I2P, and Monero dependencies
RUN apt-get update && apt-get install -y \\
    openssl \\
    libevent-2.1-7 \\
    libboost-all-dev \\
    libminiupnpc17 \\
    libunbound8 \\
    curl \\
    wget \\
    ca-certificates \\
    procps \\
    iputils-ping \\
    net-tools \\
    nano \\
    && rm -rf /var/lib/apt/lists/*

# Working Directory
WORKDIR /app

# Ensure Application Structure Exists
# These folders will be overlaid by volumes at runtime, but must exist
RUN mkdir -p /app/monero/bin /app/monero/config /app/monero/storage \\
    && mkdir -p /app/tor/bin /app/tor/config /app/tor/storage \\
    && mkdir -p /app/i2p/bin /app/i2p/config /app/i2p/storage \\
    && mkdir -p /app/docs

# Install Node Dependencies
COPY package*.json ./
RUN npm install --production

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

# Start the Node.js Controller
CMD ["npm", "start"]
\`\`\``
    },
    {
        id: 'usage',
        title: 'Usage & Network',
        content: `# Usage Guide

## 1. Downloading Binaries
The container does NOT ship with the actual Monero/Tor binaries to keep the image legal and small. You must download them.
1. Go to the Dashboard.
2. Click the **Download/Install** icon (Down Arrow) on a service card.
3. Paste a bash script to fetch the binary.
   - Example for Monero: \`wget -O /app/monero/bin/monerod https://downloads.getmonero.org/...\`
4. Click **Execute**.

## 2. Configuration
Use the **Configs** tab to edit \`torrc\`, \`i2pd.conf\`, or \`monerod.conf\` directly. The file system changes are persisted to your host machine.

## 3. Network & Ports
- **Tor SOCKS5**: 127.0.0.1:9050
- **I2P HTTP Proxy**: 127.0.0.1:4444
- **Monero RPC**: 127.0.0.1:18081

You can connect your local browser or wallets to these ports.`
    }
];