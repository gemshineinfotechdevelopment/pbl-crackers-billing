#!/usr/bin/env bash
# ==============================================================================
# PBL Crackers Billing - VPS Deployment / Update Script
# Subdomain: pbl-billing.gemshine.tech
# Backend Port: 5018
# Usage on VPS: bash deploy.sh
# ==============================================================================

set -e

echo "🚀 [1/5] Pulling latest changes from Git..."
git pull origin main || true

echo "📦 [2/5] Installing root & frontend dependencies..."
npm install

echo "📦 [3/5] Installing backend dependencies..."
npm --prefix server install

echo "🔨 [4/5] Building frontend & backend (TypeScript)..."
npm run build:all

echo "🔄 [5/5] Reloading PM2 backend service (Port 5018: pbl-billing-api)..."
pm2 reload ecosystem.config.cjs --env production || pm2 start ecosystem.config.cjs --env production
pm2 save

echo "=========================================================="
echo "✅ PBL Crackers Billing deployed successfully on Port 5018!"
echo "🌐 Subdomain : https://pbl-billing.gemshine.tech"
echo "🔌 Health API : http://127.0.0.1:5018/api/health"
echo "=========================================================="
