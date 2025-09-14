#!/bin/bash

echo "🦅 Falcon Threat Intelligence - Project Setup"
echo "============================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right place
if [ -f "server.js" ] && [ -f "package.json" ]; then
    echo -e "${GREEN}✅ Found backend files in current directory${NC}"
else
    echo -e "${RED}❌ Backend files not found. Please run this script where server.js and package.json are located.${NC}"
    exit 1
fi

# Create main project structure
echo -e "${BLUE}📁 Creating project structure...${NC}"
mkdir -p falcon-threat-intelligence

# Backend structure
mkdir -p falcon-threat-intelligence/backend/{src,tests,scripts,docs}
mkdir -p falcon-threat-intelligence/backend/src/{controllers,services,middleware,routes,utils,config}

# Frontend structure (for future use)
mkdir -p falcon-threat-intelligence/frontend/{public,src,build}

# Documentation
mkdir -p falcon-threat-intelligence/docs/{setup,api,deployment}

# Deployment
mkdir -p falcon-threat-intelligence/deployment/{docker,nginx}

# Config and logs
mkdir -p falcon-threat-intelligence/{config,logs}

echo -e "${GREEN}✅ Directory structure created${NC}"

# Move files to proper locations
echo -e "${BLUE}📦 Organizing files...${NC}"

# Backend files
cp server.js falcon-threat-intelligence/backend/
cp package.json falcon-threat-intelligence/backend/
cp opencti-client.js falcon-threat-intelligence/backend/src/utils/
cp README.md falcon-threat-intelligence/backend/
cp .env.template falcon-threat-intelligence/backend/.env.example
cp Dockerfile falcon-threat-intelligence/backend/
cp SETUP.md falcon-threat-intelligence/backend/

# Documentation files
if [ -f "PROJECT_SUMMARY.md" ]; then
    cp PROJECT_SUMMARY.md falcon-threat-intelligence/docs/
fi

# Create essential files
echo -e "${BLUE}📝 Creating additional configuration files...${NC}"

# Backend .gitignore
cat > falcon-threat-intelligence/backend/.gitignore << EOF
node_modules/
.env
.env.local
.env.*.local
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
dist/
build/
coverage/
.nyc_output/
.DS_Store
Thumbs.db
EOF

# Main project README
cat > falcon-threat-intelligence/README.md << EOF
# Falcon Threat Intelligence Dashboard

A full-stack threat intelligence platform with React frontend and Express.js backend, featuring OpenCTI integration.

## Quick Start

1. **Backend Setup:**
   \`\`\`bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your OpenCTI API key
   npm start
   \`\`\`

2. **Frontend:**
   Access the deployed web application at the provided URL

3. **Docker (Optional):**
   \`\`\`bash
   cd deployment
   docker-compose up -d
   \`\`\`

## Project Structure
- \`backend/\` - Express.js API server with OpenCTI integration
- \`frontend/\` - React web application (pre-deployed)
- \`docs/\` - Project documentation
- \`deployment/\` - Docker and deployment configurations

See \`docs/PROJECT_SUMMARY.md\` for detailed information.
EOF

# Docker compose for easy deployment
cat > falcon-threat-intelligence/deployment/docker-compose.yml << EOF
version: '3.8'

services:
  backend:
    build: ../backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - OPENCTI_API_URL=\${OPENCTI_API_URL:-http://localhost:4000/graphql}
      - OPENCTI_API_KEY=\${OPENCTI_API_KEY}
    volumes:
      - ../logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "healthcheck.js"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  app_logs:
EOF

# Environment template for Docker
cat > falcon-threat-intelligence/deployment/.env.example << EOF
# OpenCTI Configuration
OPENCTI_API_URL=http://localhost:4000/graphql
OPENCTI_API_KEY=your_opencti_api_key_here

# Optional: External services
DATABASE_URL=postgresql://user:pass@localhost:5432/falcon
REDIS_URL=redis://localhost:6379
EOF

# Create start script
cat > falcon-threat-intelligence/start-dev.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting Falcon Threat Intelligence Dashboard..."

# Check if OpenCTI API key is set
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Please copy backend/.env.example to backend/.env and configure your OpenCTI API key"
    exit 1
fi

# Start backend
echo "📡 Starting backend server..."
cd backend
npm install --silent
npm run dev &
BACKEND_PID=$!

echo "✅ Backend started on http://localhost:5000"
echo "🌐 Frontend available at your deployed web app URL"
echo "📊 API Health: http://localhost:5000/api/health"
echo ""
echo "Press Ctrl+C to stop the backend server"

# Wait for interrupt
trap "kill $BACKEND_PID" INT
wait $BACKEND_PID
EOF

chmod +x falcon-threat-intelligence/start-dev.sh

echo -e "${GREEN}✅ Files organized successfully!${NC}"
echo ""
echo -e "${YELLOW}📋 NEXT STEPS:${NC}"
echo "1. cd falcon-threat-intelligence"
echo "2. Configure OpenCTI:"
echo "   cd backend && cp .env.example .env"
echo "   # Edit .env with your OpenCTI API details"
echo "3. Start development: ./start-dev.sh"
echo "4. Or use Docker: cd deployment && docker-compose up"
echo ""
echo -e "${GREEN}🎉 Project setup complete!${NC}"
echo -e "${BLUE}Project location: $(pwd)/falcon-threat-intelligence${NC}"
