#!/bin/bash
# DigitalOcean App Platform Deploy Script
# Setup: https://docs.digitalocean.com/products/app-platform/
# doctl auth init
# doctl apps create --spec do-app.yaml

set -e

echo "🚀 Deploying to DigitalOcean App Platform..."

# Load env
set -a
source .env.production || source .env
set +a

# Create app spec
cat > do-app.yaml << EOF
name: skilltest-platform
region: nyc
http_port: 80
https_port: 443
instance_count: 2
instance_size_slug: basic-xxs
resource: APP

services:
- name: backend
  github:
    repo: yourusername/skilltest-platform
    branch: main
  run_command: npm start
  environment_slug: node-js
  environment_vars:
    - key: MONGO_URI
      scope: RUN_AND_BUILD_TIME
      value: $MONGO_URI
    # ... add all .env vars

- name: frontend
  github:
    repo: yourusername/skilltest-platform
    branch: main
  run_command: npm run preview
  environment_slug: node-js
  source_dir: client
  environment_vars:
    - key: VITE_API_URL
      value: \$DO_APP_URL/api

- name: nginx
  dockerfile_path: client/Dockerfile.frontend
  environment_slug: docker

databases:
- engine: MONGODB
- engine: REDIS
EOF

echo "📄 App spec created: do-app.yaml"
echo "🔗 Update github.repo & env vars, then:"
echo "  doctl apps create --spec do-app.yaml"
echo "✅ Ready for production deploy!"

