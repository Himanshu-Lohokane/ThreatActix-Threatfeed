# Create deployment files in smaller batches

# Create Docker configuration
dockerfile_content = """# Falcon Threat Intelligence Backend Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=3s CMD node healthcheck.js || exit 1
CMD ["npm", "start"]
"""

# Create setup instructions
setup_instructions = """# Falcon Threat Intelligence Setup Instructions

## Quick Start

1. **Backend Setup:**
   ```bash
   npm install
   cp .env.template .env
   # Edit .env with your OpenCTI API key
   npm start
   ```

2. **Frontend Setup:**
   Open the provided web application URL in your browser

3. **OpenCTI Configuration:**
   - Update OPENCTI_API_URL in .env
   - Add your OPENCTI_API_KEY
   - Test connection: GET /api/health

## Environment Variables

Required in .env file:
- OPENCTI_API_URL=http://localhost:4000/graphql  
- OPENCTI_API_KEY=your_api_key_here
- PORT=5000
"""

# Save files
with open('Dockerfile', 'w') as f:
    f.write(dockerfile_content)

with open('SETUP.md', 'w') as f:
    f.write(setup_instructions)

print("Core deployment files created!")
print("- Dockerfile")
print("- SETUP.md")