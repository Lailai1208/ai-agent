# Deployment Guide

This guide covers production deployment strategies for the AI Agent application.

## 🚀 Production Deployment Options

### Option 1: Docker Deployment (Recommended)

#### 1. Frontend Dockerfile
```dockerfile
# frontend-nextjs/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### 2. Backend Dockerfile
```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app
USER app

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### 3. Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: 
      context: ./frontend-nextjs
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_BACKEND_URL=http://backend:8000
    depends_on:
      - backend
    networks:
      - ai-agent-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
      - DEBUG=false
      - NIM_DEEPSEEK_R1_API=${NIM_DEEPSEEK_R1_API}
      - OLLAMA_API_BASE=${OLLAMA_API_BASE}
      - OLLAMA_MODEL=${OLLAMA_MODEL}
    networks:
      - ai-agent-network
    volumes:
      - ./backend/.env:/app/.env:ro

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    networks:
      - ai-agent-network

networks:
  ai-agent-network:
    driver: bridge
```

### Option 2: Platform-as-a-Service Deployment

#### Vercel (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend-nextjs
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_BACKEND_URL production
```

#### Railway/Render (Backend)
```yaml
# railway.toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "uvicorn main:app --host 0.0.0.0 --port $PORT"

[variables]
ENVIRONMENT = "production"
DEBUG = "false"
```

### Option 3: Cloud Provider Deployment

#### AWS (EC2 + RDS)
```bash
# User data script for EC2 instance
#!/bin/bash
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone and deploy
git clone https://github.com/your-username/ai-agent.git
cd ai-agent
docker-compose up -d
```

## 🔐 Security Considerations

### 1. Environment Variables
```bash
# .env.production (backend)
SECRET_KEY=your-production-secret-key-64-chars-long
ENVIRONMENT=production
DEBUG=false
ALLOWED_HOSTS=["https://yourdomain.com"]
```

### 2. HTTPS Configuration
```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. API Rate Limiting
```python
# backend/app/middleware/rate_limit.py
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    # Implementation for rate limiting
    pass
```

## 📊 Monitoring & Observability

### 1. Health Checks
```yaml
# docker-compose.yml health checks
services:
  backend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### 2. Logging Configuration
```python
# backend/main.py
import logging
from pythonjsonlogger import jsonlogger

# Configure structured logging
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter()
logHandler.setFormatter(formatter)
logger = logging.getLogger()
logger.addHandler(logHandler)
logger.setLevel(logging.INFO)
```

### 3. Application Metrics
```bash
# Prometheus metrics endpoint
curl http://localhost:8000/metrics
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Tests
        run: |
          cd frontend-nextjs && npm test
          cd backend && python -m pytest

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Production
        run: |
          # Your deployment script here
          ./deploy.sh
```

## 🚨 Backup & Recovery

### 1. Database Backup (if using)
```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
```

### 2. Configuration Backup
```bash
# Backup environment files
tar -czf config-backup-$(date +%Y%m%d).tar.gz \
  .env .env.production docker-compose.yml nginx.conf
```

## 📈 Performance Optimization

### 1. Frontend Optimization
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  compress: true,
  images: {
    domains: ['yourdomain.com'],
  },
  experimental: {
    optimizeCss: true,
  }
}
```

### 2. Backend Optimization
```python
# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware

app = FastAPI()
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Configure Gunicorn for production
# gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## 🔧 Troubleshooting

### Common Deployment Issues

1. **Environment Variable Loading**
   ```bash
   # Verify environment variables
   docker exec container_name env | grep API_KEY
   ```

2. **Service Communication**
   ```bash
   # Test service connectivity
   docker exec frontend_container curl http://backend:8000/api/v1/health
   ```

3. **SSL Certificate Issues**
   ```bash
   # Verify SSL configuration
   openssl s_client -connect yourdomain.com:443
   ```

### Performance Monitoring
```bash
# Monitor resource usage
docker stats

# Check application logs
docker logs -f container_name

# Monitor network connectivity
ping backend_service
```

---

**For production deployment support, ensure all environment variables are properly configured and SSL certificates are valid.**
