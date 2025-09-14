# Create additional configuration and deployment files

# Create Docker files for containerization
dockerfile_content = '''# Falcon Threat Intelligence Backend Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node healthcheck.js

# Start the application
CMD ["npm", "start"]
'''

# Create docker-compose.yml for full stack deployment
docker_compose_content = '''version: '3.8'

services:
  # Frontend (React Application)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://backend:5000/api
    depends_on:
      - backend
    networks:
      - falcon-network

  # Backend (Express + OpenCTI Integration)
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - OPENCTI_API_URL=${OPENCTI_API_URL}
      - OPENCTI_API_KEY=${OPENCTI_API_KEY}
      - PORT=5000
    depends_on:
      - redis
    networks:
      - falcon-network
    volumes:
      - ./logs:/app/logs

  # Redis for caching (optional)
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - falcon-network
    volumes:
      - redis_data:/data

  # Nginx reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    networks:
      - falcon-network

volumes:
  redis_data:

networks:
  falcon-network:
    driver: bridge
'''

# Create nginx configuration
nginx_conf_content = '''events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:5000;
    }

    upstream frontend {
        server frontend:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    server {
        listen 80;
        server_name falcon-threat-intel.local;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Backend API
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # WebSocket support (for real-time features)
        location /ws {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}
'''

# Create healthcheck.js for Docker health monitoring
healthcheck_content = '''const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 5000,
  path: '/api/health',
  method: 'GET',
  timeout: 3000
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    console.log('Health check passed');
    process.exit(0);
  } else {
    console.log(`Health check failed with status code: ${res.statusCode}`);
    process.exit(1);
  }
});

req.on('error', (err) => {
  console.error('Health check error:', err.message);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('Health check timeout');
  req.destroy();
  process.exit(1);
});

req.end();
'''

# Create setup script for easy installation
setup_script_content = '''#!/bin/bash

# Falcon Threat Intelligence Dashboard Setup Script

echo "🦅 Falcon Threat Intelligence Dashboard Setup"
echo "============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Create project structure
echo "📁 Creating project structure..."
mkdir -p falcon-threat-intelligence/{backend,frontend,nginx,ssl,logs}
cd falcon-threat-intelligence

# Setup backend
echo "🔧 Setting up backend..."
cd backend
npm init -y
npm install express cors axios body-parser dotenv helmet express-rate-limit morgan

# Copy backend files (assume they're in the current directory)
cp ../server.js .
cp ../package.json .
cp ../.env.template .env
cp ../README.md .
cp ../opencti-client.js .

echo "📝 Please update your .env file with your OpenCTI configuration:"
echo "   - OPENCTI_API_URL=http://your-opencti-instance:4000/graphql"
echo "   - OPENCTI_API_KEY=your_actual_api_key_here"

cd ..

# Setup frontend (React app)
echo "⚛️  Setting up React frontend..."
cd frontend
# Note: Frontend files are already created as web application

cd ..

# Create Docker setup
echo "🐳 Setting up Docker configuration..."
# Docker files already created above

# Make scripts executable
chmod +x setup.sh

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update backend/.env with your OpenCTI credentials"
echo "2. Start the backend: cd backend && npm run dev"
echo "3. Open the frontend web application in your browser"
echo "4. Or use Docker: docker-compose up -d"
echo ""
echo "🔗 URLs:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:5000/api"
echo "   - Health Check: http://localhost:5000/api/health"
'''

# Create frontend Dockerfile
frontend_dockerfile_content = '''# Falcon Threat Intelligence Frontend Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy the pre-built frontend files
COPY . .

# Install a simple HTTP server
RUN npm install -g serve

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Start the application
CMD ["serve", "-s", ".", "-l", "3000"]
'''

# Create deployment guide
deployment_guide_content = '''# Falcon Threat Intelligence - Deployment Guide

This guide covers various deployment options for the Falcon Threat Intelligence Dashboard.

## Prerequisites

- Node.js 18+ and npm 8+
- OpenCTI instance (local or remote)
- Valid OpenCTI API key
- Docker and Docker Compose (for containerized deployment)

## Quick Start

### 1. Local Development Setup

```bash
# Clone and setup
git clone <repository>
cd falcon-threat-intelligence

# Run setup script
chmod +x setup.sh
./setup.sh

# Configure OpenCTI connection
cd backend
cp .env.template .env
# Edit .env with your OpenCTI details

# Start backend
npm run dev

# Open frontend
# The web application URL will be provided
```

### 2. Docker Deployment

```bash
# Create docker-compose.yml with your environment variables
cp docker-compose.yml.template docker-compose.yml

# Configure environment
export OPENCTI_API_URL="http://your-opencti:4000/graphql"
export OPENCTI_API_KEY="your_api_key_here"

# Deploy with Docker Compose
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f backend
```

### 3. Production Deployment

#### Option A: PM2 Process Manager

```bash
# Install PM2
npm install -g pm2

# Start backend with PM2
cd backend
pm2 start ecosystem.config.js

# Monitor
pm2 list
pm2 logs falcon-backend
pm2 monit
```

#### Option B: Systemd Service

```bash
# Create systemd service
sudo nano /etc/systemd/system/falcon-backend.service

# Add service configuration:
[Unit]
Description=Falcon Threat Intelligence Backend
After=network.target

[Service]
Type=simple
User=nodejs
WorkingDirectory=/opt/falcon-threat-intelligence/backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server.js
Restart=always

[Install]
WantedBy=multi-user.target

# Enable and start service
sudo systemctl enable falcon-backend
sudo systemctl start falcon-backend
sudo systemctl status falcon-backend
```

## Environment Configuration

### Backend Environment Variables

```env
# Required
OPENCTI_API_URL=http://localhost:4000/graphql
OPENCTI_API_KEY=your_opencti_api_key

# Optional
PORT=5000
NODE_ENV=production
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Frontend Configuration

The frontend is a static React application that connects to the backend API. Update the API URL in the application configuration if needed.

## Security Considerations

### 1. API Key Security
- Store API keys in environment variables
- Never commit API keys to version control
- Use secure key management in production
- Rotate API keys regularly

### 2. Network Security
- Use HTTPS in production
- Configure proper CORS policies
- Implement rate limiting
- Use a reverse proxy (nginx)

### 3. Access Control
- Implement authentication for the frontend
- Use role-based access control
- Monitor API access logs
- Set up intrusion detection

## Monitoring and Logging

### Health Checks
```bash
# Backend health
curl http://localhost:5000/api/health

# OpenCTI connectivity
curl http://localhost:5000/api/dashboard/metrics
```

### Log Management
```bash
# View backend logs
tail -f logs/backend.log

# Docker logs
docker-compose logs -f backend

# PM2 logs
pm2 logs falcon-backend
```

### Metrics and Monitoring
- Set up application performance monitoring (APM)
- Monitor OpenCTI API response times
- Track error rates and response codes
- Set up alerting for critical failures

## Backup and Recovery

### Database Backup
Since the application relies on OpenCTI data:
- Follow OpenCTI backup procedures
- Backup OpenCTI database regularly
- Test restore procedures

### Application Backup
- Backup configuration files
- Store environment variables securely
- Document deployment procedures
- Maintain deployment scripts

## Troubleshooting

### Common Issues

1. **OpenCTI Connection Failed**
   ```bash
   # Test connectivity
   curl -H "Authorization: Bearer YOUR_API_KEY" \\
        -H "Content-Type: application/json" \\
        -d '{"query": "query { about { version } }"}' \\
        http://your-opencti:4000/graphql
   ```

2. **CORS Errors**
   - Check CORS configuration in backend
   - Verify frontend URL is allowed
   - Check browser network tab

3. **High Memory Usage**
   - Monitor Node.js memory usage
   - Implement memory limits
   - Check for memory leaks

4. **Slow API Responses**
   - Check OpenCTI performance
   - Implement caching with Redis
   - Optimize GraphQL queries

### Debug Mode

```bash
# Enable debug logging
export DEBUG=*
export LOG_LEVEL=debug

# Start with debugging
npm run dev
```

## Performance Optimization

### 1. Caching
```javascript
// Add Redis caching
const redis = require('redis');
const client = redis.createClient();

// Cache API responses
app.get('/api/threats', async (req, res) => {
  const cached = await client.get('threats');
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  // ... fetch from OpenCTI and cache
});
```

### 2. Database Optimization
- Optimize OpenCTI database queries
- Use appropriate indexes
- Implement query result limits
- Use pagination for large datasets

### 3. Frontend Optimization
- Implement lazy loading
- Use React.memo for expensive components
- Optimize chart rendering
- Implement virtual scrolling for large tables

## Scaling

### Horizontal Scaling
- Use load balancers for multiple backend instances
- Implement session stickiness if needed
- Use shared Redis for caching
- Consider API Gateway for routing

### Vertical Scaling
- Monitor resource usage
- Increase server specifications as needed
- Optimize memory and CPU usage
- Use cluster mode for Node.js

## Updates and Maintenance

### Update Procedure
1. Test updates in staging environment
2. Backup current deployment
3. Update dependencies
4. Run integration tests
5. Deploy to production
6. Monitor for issues

### Security Updates
- Regularly update Node.js dependencies
- Monitor security advisories
- Update OpenCTI to latest version
- Review and update security configurations

## Support

For issues and support:
1. Check application logs
2. Test OpenCTI connectivity
3. Review configuration
4. Check documentation
5. Contact support team

## License

MIT License - see LICENSE file for details.
'''

# Save all deployment files
with open('Dockerfile', 'w') as f:
    f.write(dockerfile_content)

with open('docker-compose.yml', 'w') as f:
    f.write(docker_compose_content)

with open('nginx.conf', 'w') as f:
    f.write(nginx_conf_content)

with open('healthcheck.js', 'w') as f:
    f.write(healthcheck_content)

with open('setup.sh', 'w') as f:
    f.write(setup_script_content)

with open('frontend.Dockerfile', 'w') as f:
    f.write(frontend_dockerfile_content)

with open('DEPLOYMENT.md', 'w') as f:
    f.write(deployment_guide_content)

print("Deployment files created successfully!")
print("\nDeployment files created:")
print("- Dockerfile (Backend container)")
print("- docker-compose.yml (Full stack orchestration)")  
print("- nginx.conf (Reverse proxy configuration)")
print("- healthcheck.js (Health monitoring)")
print("- setup.sh (Installation script)")
print("- frontend.Dockerfile (Frontend container)")
print("- DEPLOYMENT.md (Comprehensive deployment guide)")