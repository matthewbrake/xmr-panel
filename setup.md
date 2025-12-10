#!/bin/bash

# ==========================================
# Privacy Suite Host Setup Script
# ==========================================
# This script creates the directory structure required by the Docker container.
# It ensures your data (blockchain, keys) persists outside the container.

ROOT_DIR="./privacy-suite"

echo "[*] Initializing Privacy Suite Host Structure at: $ROOT_DIR"

# Function to create dir and readme
create_dir_with_readme() {
    local dir_path=$1
    local readme_content=$2
    
    mkdir -p "$dir_path"
    echo "$readme_content" > "$dir_path/README.txt"
    echo "    + Created: $dir_path"
}

# --- MONERO SETUP ---
echo "[-] Setting up Monero..."
create_dir_with_readme "$ROOT_DIR/app/monero/bin" "PLACE BINARY HERE: 'monerod' (Linux x64 executable)"
create_dir_with_readme "$ROOT_DIR/app/monero/config" "PLACE CONFIG HERE: 'monerod.conf'"
create_dir_with_readme "$ROOT_DIR/app/monero/storage" "DATA STORAGE: Blockchain (lmdb) and log files will appear here."

# --- TOR SETUP ---
echo "[-] Setting up Tor..."
create_dir_with_readme "$ROOT_DIR/app/tor/bin" "PLACE BINARY HERE: 'tor' (Linux x64 executable)"
create_dir_with_readme "$ROOT_DIR/app/tor/config" "PLACE CONFIG HERE: 'torrc'"
create_dir_with_readme "$ROOT_DIR/app/tor/storage" "DATA STORAGE: Tor hidden service keys and cache."

# --- I2P SETUP ---
echo "[-] Setting up I2P..."
create_dir_with_readme "$ROOT_DIR/app/i2p/bin" "PLACE BINARY HERE: 'i2pd' (Linux x64 executable)"
create_dir_with_readme "$ROOT_DIR/app/i2p/config" "PLACE CONFIG HERE: 'i2pd.conf' and 'tunnels.conf'"
create_dir_with_readme "$ROOT_DIR/app/i2p/storage" "DATA STORAGE: I2P netDb and router keys."

# --- DOCS ---
echo "[-] Setting up Documentation..."
create_dir_with_readme "$ROOT_DIR/docs" "Place local Markdown documentation files here to view them in the Web UI."

echo ""
echo "=========================================="
echo " [SUCCESS] Structure created!"
echo "=========================================="
echo "Next Steps:"
echo "1. Drop your binaries into the 'bin' folders created above."
echo "2. Run 'docker-compose up -d'"
echo ""
