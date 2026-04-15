#!/bin/bash
# Railway CLI Deploy Script for SkillTest Platform
# Setup: https://docs.railway.app/guides/railway-cli
# railway login
# railway link <project-id>

set -e

echo "🚀 Deploying SkillTest Platform to Railway..."

# Load .env.production
set -a
source .env.production || source .env
set +a

# Build & deploy services
echo "📦 Building Backend..."
railway up --service backend-prod

echo "📦 Building Frontend..."
cd client
railway up --service frontend-prod
cd ..

echo "🗄️  Deploying MongoDB Replica (manual via Railway templates)"
echo "🔗 Redis via Railway plugin: railway add redis"

echo "✅ Deployment complete!"
echo "🌐 Access at: https://your-app.railway.app"
echo "📋 Copy .env.production vars to Railway Variables tab"

# Post-deploy
railway run docker compose -f docker-compose.prod.yml up -d --wait

