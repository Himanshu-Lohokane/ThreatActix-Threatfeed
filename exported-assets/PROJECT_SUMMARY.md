# Falcon Threat Intelligence Dashboard - Full Stack Application

## Overview
A complete threat intelligence dashboard similar to Falcon Feeds, built with React frontend and Express.js backend, featuring OpenCTI API integration for real-time cybersecurity threat monitoring.

## Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │────│  Express Backend │────│   OpenCTI API   │
│   (Web App)      │    │   (REST API)    │    │  (GraphQL)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Features Implemented

### Frontend (React Web Application)
✅ Modern dark-themed dashboard interface
✅ Real-time threat metrics and statistics  
✅ Interactive charts and data visualizations
✅ Threat indicators and IOCs management
✅ Incident response dashboard
✅ Vulnerability assessment display
✅ Geographic threat mapping
✅ Network traffic analysis
✅ Intelligence reports viewer
✅ Responsive mobile-friendly design

### Backend (Express.js API Server)
✅ OpenCTI GraphQL API integration
✅ RESTful API endpoints for frontend
✅ Real-time data processing and transformation
✅ Incident management (CRUD operations)
✅ Authentication with Bearer tokens
✅ Error handling and logging
✅ Health monitoring endpoints
✅ Data caching capabilities
✅ Security middleware (CORS, rate limiting)

### OpenCTI Integration
✅ Threat indicators retrieval
✅ Security incidents management
✅ Vulnerability data access
✅ Intelligence reports fetching
✅ Network observables analysis
✅ Threat actor profiles
✅ Malware family information
✅ MITRE ATT&CK framework support

## File Structure
```
falcon-threat-intelligence/
├── Frontend (Web Application)
│   ├── index.html          # Main HTML file
│   ├── app.js             # React application code
│   └── style.css          # Modern dark theme styles
│
├── Backend Files
│   ├── server.js          # Express server with OpenCTI integration
│   ├── package.json       # Node.js dependencies
│   ├── opencti-client.js  # OpenCTI utility class
│   ├── .env.template      # Environment variables template
│   └── README.md          # Backend documentation
│
└── Deployment
    ├── Dockerfile         # Container configuration
    └── SETUP.md          # Quick setup guide
```

## Technology Stack

**Frontend:**
- React 18 with Hooks
- Chart.js for data visualization
- Modern CSS with dark theme
- Font Awesome icons
- Responsive design

**Backend:**
- Node.js with Express.js
- Axios for HTTP client
- GraphQL integration
- CORS and security middleware
- Environment-based configuration

**Integration:**
- OpenCTI GraphQL API
- Bearer token authentication
- Real-time data streaming
- RESTful API design

## Quick Start Guide

### 1. Backend Setup
```bash
# Install dependencies
npm install

# Configure OpenCTI connection
cp .env.template .env
# Edit .env with your OpenCTI API details

# Start server
npm start  # Production
npm run dev  # Development
```

### 2. Frontend Access
Open the provided web application URL in your browser to access the dashboard.

### 3. OpenCTI Configuration
In your `.env` file, update:
```env
OPENCTI_API_URL=http://your-opencti-instance:4000/graphql
OPENCTI_API_KEY=your_actual_api_key_here
```

## API Endpoints

### Dashboard & Metrics
- `GET /api/dashboard/metrics` - Dashboard summary statistics
- `GET /api/health` - System health check

### Threat Intelligence
- `GET /api/threats` - Threat indicators and IOCs
- `GET /api/incidents` - Security incidents
- `GET /api/vulnerabilities` - Vulnerability data
- `GET /api/reports` - Intelligence reports
- `GET /api/network` - Network analysis data

### Incident Management
- `POST /api/incidents` - Create new incident
- `PUT /api/incidents/:id` - Update incident

## Key Dashboard Components

1. **Overview Dashboard**
   - Real-time threat metrics
   - Geographic threat visualization
   - Incident timeline
   - Threat category breakdown

2. **Threat Intelligence**
   - Indicators of Compromise (IOCs)
   - Threat actor profiles
   - Attack pattern analysis
   - Confidence scoring

3. **Incident Response**
   - Active incident tracking
   - Severity classification
   - Assignment management
   - Response actions

4. **Vulnerability Management**
   - CVE tracking
   - CVSS scoring
   - Affected systems
   - Patch management status

5. **Network Analysis**
   - Traffic monitoring
   - Suspicious IP tracking
   - Domain analysis
   - Connection mapping

## Security Features

- Bearer token authentication for OpenCTI API
- CORS protection for cross-origin requests
- Rate limiting to prevent API abuse
- Input validation and sanitization
- Secure environment variable handling
- Error logging without sensitive data exposure

## Deployment Options

### Local Development
```bash
npm run dev
```

### Production Deployment
```bash
npm start
```

### Docker Deployment
```bash
docker build -t falcon-threat-intel .
docker run -p 5000:5000 --env-file .env falcon-threat-intel
```

## Data Sources and Integration

The application integrates with OpenCTI to fetch:
- Threat indicators and observables
- Security incidents and events
- Vulnerability assessments
- Intelligence reports
- Threat actor information
- Malware family data
- Network artifacts

## Customization

The application is designed to be easily customizable:
- Modify dashboard layouts in React components
- Add new API endpoints in Express server
- Extend OpenCTI integration with additional queries
- Customize styling and themes
- Add new visualization components

## Support and Troubleshooting

Common issues and solutions:
1. **OpenCTI Connection**: Verify API URL and key
2. **CORS Errors**: Check frontend/backend URL configuration  
3. **Data Loading**: Test OpenCTI API connectivity
4. **Performance**: Implement caching for large datasets

## Next Steps

To enhance the application further:
1. Add user authentication and authorization
2. Implement real-time WebSocket updates
3. Add data export functionality
4. Create custom alert rules
5. Integrate with additional threat feeds
6. Add automated response capabilities

## License
MIT License - Open source and freely modifiable
