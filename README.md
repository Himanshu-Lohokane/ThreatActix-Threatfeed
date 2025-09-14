# ThreatActix Threatfeed

A full-stack threat intelligence dashboard that integrates with OpenCTI (Open Cyber Threat Intelligence) platform.

## Project Overview

This dashboard provides a visual interface for monitoring and analyzing threat intelligence data, including:

- Threat indicators and IOCs
- Security incidents
- Vulnerabilities
- Intelligence reports
- Network activity analysis

## Architecture

### Frontend
- React-based dashboard UI
- Chart.js for data visualization
- Mobile-friendly responsive design

### Backend
- Express.js REST API
- OpenCTI GraphQL integration
- Secure authentication and data handling

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- OpenCTI instance (for production use)

### Frontend Setup
\\\ash
cd falcon-threat-intelligence/frontend
npm install
npm run dev
\\\

### Backend Setup
\\\ash
cd falcon-threat-intelligence/backend
npm install
# Create .env file based on .env.example
npm run dev
\\\

## Environment Configuration

The backend requires the following environment variables:
- \OPENCTI_URL\: URL to your OpenCTI instance
- \OPENCTI_API_KEY\: API key for OpenCTI access

A template is provided in \.env.example\.

## Demo Mode

When running without OpenCTI credentials, the application uses static sample data for demonstration purposes.

