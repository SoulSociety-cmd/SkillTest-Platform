FROM node:20-alpine

# Install system deps for Playwright + Python
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freetype \
    python3 \
    py3-pip \
    nodejs \
    npm

# Install Playwright browsers
RUN npx playwright@1.41.2 install --with-deps chromium

# Install Python pytest
RUN pip3 install pytest pytest-html requests

WORKDIR /app
COPY package.json ./
RUN npm install

# Copy runner
COPY runner.js eslint.config.js ./

# Non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S tester -u 1001 && \
    chown -R tester:nodejs /app

USER tester

EXPOSE 3000

CMD ["npm", "start"]

