# Falcon Threat Intelligence Dashboard

## Overview
A full-stack threat intelligence dashboard that integrates with OpenCTI (Open Cyber Threat Intelligence) platform. The application provides a visual interface for monitoring and analyzing threat intelligence data, including threat indicators, security incidents, vulnerabilities, intelligence reports, and network activity analysis.

## Current State
Successfully imported and configured for Replit environment on September 14, 2025. The application is running in demo mode with sample data and is fully functional.

**Import Status**: ✅ Complete
- Frontend server running on port 5000 (Replit proxy compatible)
- Backend server running on localhost:3001 (demo mode with empty OpenCTI credentials)
- All dependencies installed successfully
- Deployment configuration set for autoscale mode

## Project Architecture

### Frontend
- **Technology**: React-based dashboard with Chart.js for visualizations
- **Location**: `falcon-threat-intelligence/frontend/`
- **Port**: 5000 (configured for Replit proxy)
- **Status**: ✅ Running with static serve
- **Features**: Dashboard overview, threat monitoring, incident management, vulnerability assessment, intelligence reports, network analysis

### Backend  
- **Technology**: Express.js REST API with OpenCTI GraphQL integration
- **Location**: `falcon-threat-intelligence/backend/`
- **Port**: 3001 (localhost, non-conflicting)
- **Status**: ✅ Running in demo mode
- **Features**: OpenCTI integration, RESTful API endpoints, demo data fallback

## Configuration

### Environment Setup
- Backend configured with demo mode (no OpenCTI credentials required)
- Frontend serves static files with CORS enabled
- Both servers configured for Replit environment

### Workflows
1. **Frontend Server**: Serves the React dashboard on port 5000
2. **Backend Server**: Provides API endpoints on port 3001 (demo mode)

### Deployment
- Configured for autoscale deployment
- Uses static serve for production frontend
- Suitable for demonstration and development

## Demo Mode
The application runs in demo mode when OpenCTI credentials are not provided, using comprehensive sample data including:
- Dashboard metrics and KPIs
- Threat trends and geographic data
- Recent security incidents
- Threat indicators and IOCs
- Vulnerability assessments
- Intelligence reports
- Network activity logs

## Recent Changes
- Imported from GitHub (September 14, 2025)
- Configured for Replit proxy environment
- Set up dual workflow configuration (frontend/backend)
- Installed all Node.js dependencies
- Created deployment configuration
- Verified demo mode functionality

## User Preferences
- Prefers clean, functional setup
- Values working demo capabilities
- Requires proper Replit environment integration