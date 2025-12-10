# Privacy Suite Controller v3.0

A professional web-based dashboard for managing privacy nodes (Monero, Tor, I2P) via Docker. 

## 🚀 Quick Start

This project is designed to run in a container while persisting data to your host machine.

### 1. Prepare Environment Files
The configuration files are provided as templates. Run the following commands to initialize them:

```bash
# Convert documentation templates to executable files
cp Dockerfile.md Dockerfile
cp setup.md setup.sh

# Make the setup script executable
chmod +x setup.sh
```

### 2. Initialize Host Directory Structure
We strictly separate the application code from your persistent data (blockchain, keys, configs).
Run the setup script to create the required folder structure in your current directory:

```bash
./setup.sh
```

**What this does:**
- Creates a `./privacy-suite` directory.
- Generates subfolders for `monero`, `tor`, and `i2p`.
- Adds helper `README.txt` files in each folder explaining what to put there.

### 3. Start the Suite
Use Docker Compose to build and launch the controller.

```bash
# Start in detached mode
docker-compose up -d
```

Access the dashboard at: **http://localhost:3000**

---

## 📂 Configuration & Binaries

Since this is a privacy-focused tool, **we do not bundle binary executables** in the image. You must provide them or use the "Downloader" feature in the Web UI.

### Manual Setup (Recommended)
After running `./setup.sh`, navigate to the generated folders:

1. **Monero**: Place `monerod` (Linux x64) in `./privacy-suite/app/monero/bin/`
2. **Tor**: Place `tor` binary in `./privacy-suite/app/tor/bin/`
3. **I2P**: Place `i2pd` binary in `./privacy-suite/app/i2p/bin/`

### Ports
The default configuration exposes the following ports:

- **3000**: Web Controller UI
- **9050**: Tor SOCKS5 Proxy
- **9051**: Tor Control Port
- **4444**: I2P HTTP Proxy
- **18081**: Monero RPC

To change the Web UI port, set the env var before running compose:
```bash
WEB_PORT=8080 docker-compose up -d
```
