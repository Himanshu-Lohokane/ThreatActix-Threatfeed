# Falcon Threat Intelligence Backend

A Node.js/Express backend server for the Falcon Threat Intelligence Dashboard with OpenCTI integration.

## Features

- **OpenCTI Integration**: Full GraphQL API integration with OpenCTI platform
- **RESTful API**: Clean REST endpoints for frontend consumption
- **Real-time Data**: Fetch live threat intelligence data
- **Comprehensive Coverage**: Threats, incidents, vulnerabilities, and reports
- **Security**: Rate limiting, CORS, and security headers
- **Error Handling**: Robust error handling and logging

## Prerequisites

- Node.js 18+ and npm 8+
- OpenCTI instance running (local or remote)
- Valid OpenCTI API key

## Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Copy `.env.template` to `.env` and update with your settings:
   ```bash
   cp .env.template .env
   ```

3. **Update your OpenCTI configuration in `.env`:**
   ```env
   OPENCTI_API_URL=http://your-opencti-instance:4000/graphql
   OPENCTI_API_KEY=your_actual_api_key_here
   ```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

## API Endpoints

### Dashboard
- `GET /api/dashboard/metrics` - Get dashboard summary metrics
- `GET /api/health` - Health check endpoint

### Threat Intelligence
- `GET /api/threats` - Get threat indicators and IOCs
- `GET /api/incidents` - Get security incidents
- `GET /api/vulnerabilities` - Get vulnerability data
- `GET /api/reports` - Get intelligence reports
- `GET /api/network` - Get network analysis data

### Incident Management
- `POST /api/incidents` - Create new incident
- `PUT /api/incidents/:id` - Update existing incident

## OpenCTI Integration

The backend integrates with OpenCTI using GraphQL queries to fetch:

- **Indicators**: IoCs, observables, and threat indicators
- **Incidents**: Security incidents and their details
- **Vulnerabilities**: CVE data and vulnerability information
- **Reports**: Threat intelligence reports
- **Observables**: Network artifacts and suspicious entities

### Authentication

The backend uses Bearer token authentication to connect to OpenCTI:

```javascript
headers: {
  'Authorization': `Bearer ${OPENCTI_API_KEY}`
}
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENCTI_API_URL` | OpenCTI GraphQL endpoint | `http://localhost:4000/graphql` |
| `OPENCTI_API_KEY` | OpenCTI API key | Required |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |

### OpenCTI Setup

1. **Install OpenCTI** following the [official documentation](https://docs.opencti.io/)

2. **Generate API Key:**
   - Login to OpenCTI web interface
   - Go to Settings → Security → Users
   - Create a new user or use existing
   - Generate API token

3. **Configure Permissions:**
   - Ensure the API user has appropriate read/write permissions
   - For incidents creation, ensure write access to incidents

## Sample GraphQL Queries

### Get Indicators
```graphql
query {
  indicators(first: 100) {
    edges {
      node {
        id
        pattern
        confidence
        created_at
      }
    }
  }
}
```

### Get Incidents
```graphql
query {
  incidents(first: 50) {
    edges {
      node {
        id
        name
        severity
        created_at
      }
    }
  }
}
```

## Frontend Integration

This backend is designed to work with the React frontend application. Update your frontend API base URL to point to this backend:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## Testing

Run the test suite:
```bash
npm test
```

## Deployment

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Setup
Ensure all environment variables are properly set in production, especially:
- Secure `OPENCTI_API_KEY`
- Appropriate `NODE_ENV=production`
- Correct `OPENCTI_API_URL` pointing to your OpenCTI instance

## Security Considerations

1. **API Key Security**: Never commit API keys to version control
2. **HTTPS**: Use HTTPS in production
3. **Rate Limiting**: Configured to prevent abuse
4. **CORS**: Properly configure CORS for your domain
5. **Input Validation**: Validate all user inputs
6. **Error Handling**: Don't expose sensitive information in errors

## Troubleshooting

### Common Issues

1. **OpenCTI Connection Failed**
   - Check `OPENCTI_API_URL` is correct
   - Verify API key is valid
   - Ensure OpenCTI instance is running

2. **GraphQL Errors**
   - Check OpenCTI API permissions
   - Verify GraphQL schema matches queries
   - Review OpenCTI logs for details

3. **CORS Issues**
   - Update CORS configuration for your frontend domain
   - Check browser network tab for CORS errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Check OpenCTI documentation
- Review server logs
- Test API endpoints using tools like Postman
- Verify OpenCTI connectivity

## Related Projects

- [OpenCTI Platform](https://github.com/OpenCTI-Platform/opencti)
- [OpenCTI Python Client](https://github.com/OpenCTI-Platform/client-python)
- [Falcon React Frontend](./frontend/)
