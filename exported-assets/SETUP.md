# Falcon Threat Intelligence Setup Instructions

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
