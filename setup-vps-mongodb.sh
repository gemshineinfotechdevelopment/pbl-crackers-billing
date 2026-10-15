#!/usr/bin/env bash
# ==============================================================================
# Automated MongoDB 7.0 Installation & Setup Script for Ubuntu/Debian VPS
# Target Project: PBL Crackers Billing
# Target Database: pbl_crackers_db (Port: 27017)
# Run with root or sudo: sudo bash setup-vps-mongodb.sh
# ==============================================================================

set -e

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================${NC}"
echo -e "${GREEN}🚀 PBL Crackers - VPS MongoDB Installation & Config${NC}"
echo -e "${BLUE}======================================================${NC}"

# Check for root / sudo
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}❌ Please run this script with sudo or as root!${NC}"
  echo "Usage: sudo bash setup-vps-mongodb.sh"
  exit 1
fi

# Detect Ubuntu / Debian distribution codename
if [ -f /etc/os-release ]; then
  . /etc/os-release
  DISTRO=$ID
  CODENAME=$VERSION_CODENAME
  echo -e "Detected OS: ${YELLOW}$NAME ($CODENAME)${NC}"
else
  echo -e "${RED}❌ Cannot detect OS distribution (/etc/os-release not found).${NC}"
  exit 1
fi

echo -e "\n📦 [1/6] Installing necessary prerequisite packages..."
apt-get update -y
apt-get install -y gnupg curl wget ca-certificates lsb-release

echo -e "\n🔑 [2/6] Importing official MongoDB GPG Key..."
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
  gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
  --dearmor --yes

echo -e "\n📋 [3/6] Adding MongoDB APT Repository for $CODENAME..."
# Special handling for Ubuntu 24.04 (noble) or fallback to jammy repo if noble not yet available
if [ "$DISTRO" = "ubuntu" ]; then
  if [ "$CODENAME" = "noble" ]; then
    # Ubuntu 24.04 Noble
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
  else
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu $CODENAME/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
  fi
elif [ "$DISTRO" = "debian" ]; then
  echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/debian $CODENAME/mongodb-org/7.0 main" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
else
  echo -e "${YELLOW}⚠️ Non-standard Debian/Ubuntu distro. Defaulting to Ubuntu Jammy repo...${NC}"
  echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
fi

echo -e "\n📥 [4/6] Installing MongoDB packages (mongodb-org & mongosh)..."
apt-get update -y
apt-get install -y mongodb-org

echo -e "\n⚙️ [5/6] Starting & Enabling MongoDB Service on Boot..."
systemctl daemon-reload
systemctl enable mongod
systemctl restart mongod

# Give mongod a brief moment to initialize
sleep 2

echo -e "\n🔍 [6/6] Verifying MongoDB Connection..."
if systemctl is-active --quiet mongod; then
  echo -e "${GREEN}✓ MongoDB service is ACTIVE and running!${NC}"
else
  echo -e "${RED}❌ MongoDB service failed to start. Check: journalctl -u mongod -n 50${NC}"
  exit 1
fi

# Test connection via mongosh ping
if command -v mongosh &> /dev/null; then
  PING_RES=$(mongosh --quiet --eval "db.runCommand({ ping: 1 }).ok" 2>/dev/null || echo "0")
  if [ "$PING_RES" = "1" ]; then
    echo -e "${GREEN}✓ Connection to 127.0.0.1:27017 verified successfully!${NC}"
    # Ensure pbl_crackers_db exists
    mongosh "mongodb://127.0.0.1:27017/pbl_crackers_db" --quiet --eval "db.createCollection('init_check'); db.init_check.insertOne({ installedAt: new Date(), project: 'pbl-crackers-billing' });" > /dev/null 2>&1 || true
    echo -e "${GREEN}✓ Default Database 'pbl_crackers_db' initialized!${NC}"
  fi
fi

echo -e "\n${BLUE}======================================================${NC}"
echo -e "${GREEN}✅ MongoDB 7.0 is successfully installed and running!${NC}"
echo -e "   Connection String : ${YELLOW}mongodb://127.0.0.1:27017/pbl_crackers_db${NC}"
echo -e "   Port              : ${YELLOW}27017${NC}"
echo -e "   Service Name      : ${YELLOW}mongod${NC}"
echo -e "   Check status      : ${YELLOW}sudo systemctl status mongod${NC}"
echo -e "${BLUE}======================================================${NC}\n"
