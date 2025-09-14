const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// OpenCTI Configuration
const OPENCTI_API_URL = process.env.OPENCTI_API_URL || 'http://localhost:4000/graphql';
const OPENCTI_API_KEY = process.env.OPENCTI_API_KEY || 'YOUR_API_KEY_HERE';

// GraphQL client for OpenCTI
const openCTIClient = axios.create({
  baseURL: OPENCTI_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENCTI_API_KEY}`,
  },
});

// Helper function to make GraphQL queries to OpenCTI
async function queryOpenCTI(query, variables = {}) {
  try {
    const response = await openCTIClient.post('', {
      query,
      variables,
    });
    return response.data;
  } catch (error) {
    console.error('OpenCTI API Error:', error.response?.data || error.message);
    throw error;
  }
}

// Dashboard metrics endpoint
app.get('/api/dashboard/metrics', async (req, res) => {
  try {
    // Sample implementation - replace with actual OpenCTI queries
    const metricsQuery = `
      query {
        indicators(first: 1000) {
          edges {
            node {
              id
              pattern
              confidence
              created_at
            }
          }
        }
        incidents(first: 100) {
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
    `;

    const data = await queryOpenCTI(metricsQuery);

    // Process data and return metrics
    const indicators = data?.data?.indicators?.edges || [];
    const incidents = data?.data?.incidents?.edges || [];

    const metrics = {
      criticalAlerts: incidents.filter(i => i.node.severity === 'critical').length,
      activeThreats: indicators.length,
      resolvedIncidents: incidents.filter(i => i.node.severity === 'low').length,
      riskScore: Math.min(10, Math.max(1, indicators.length / 10))
    };

    res.json(metrics);
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});

// Threats and IOCs endpoint
app.get('/api/threats', async (req, res) => {
  try {
    const threatsQuery = `
      query {
        indicators(first: 100, orderBy: created_at, orderMode: desc) {
          edges {
            node {
              id
              pattern
              indicator_types
              confidence
              created_at
              updated_at
              labels {
                edges {
                  node {
                    value
                  }
                }
              }
              observables {
                edges {
                  node {
                    value
                    entity_type
                  }
                }
              }
            }
          }
        }
      }
    `;

    const data = await queryOpenCTI(threatsQuery);
    const indicators = data?.data?.indicators?.edges || [];

    const processedThreats = indicators.map(indicator => ({
      id: indicator.node.id,
      type: indicator.node.observables?.edges?.[0]?.node?.entity_type || 'Unknown',
      value: indicator.node.observables?.edges?.[0]?.node?.value || indicator.node.pattern,
      threat: indicator.node.labels?.edges?.[0]?.node?.value || 'Unknown Threat',
      confidence: indicator.node.confidence || 0,
      firstSeen: indicator.node.created_at,
      lastSeen: indicator.node.updated_at
    }));

    res.json(processedThreats);
  } catch (error) {
    console.error('Error fetching threats:', error);
    res.status(500).json({ error: 'Failed to fetch threats data' });
  }
});

// Incidents endpoint
app.get('/api/incidents', async (req, res) => {
  try {
    const incidentsQuery = `
      query {
        incidents(first: 50, orderBy: created_at, orderMode: desc) {
          edges {
            node {
              id
              name
              description
              severity
              confidence
              created_at
              updated_at
              createdBy {
                name
              }
              labels {
                edges {
                  node {
                    value
                  }
                }
              }
            }
          }
        }
      }
    `;

    const data = await queryOpenCTI(incidentsQuery);
    const incidents = data?.data?.incidents?.edges || [];

    const processedIncidents = incidents.map(incident => ({
      id: incident.node.id,
      title: incident.node.name,
      severity: incident.node.severity || 'Medium',
      status: incident.node.confidence > 80 ? 'Active' : 'Investigating',
      timestamp: incident.node.created_at,
      assignee: incident.node.createdBy?.name || 'Unassigned',
      description: incident.node.description
    }));

    res.json(processedIncidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ error: 'Failed to fetch incidents data' });
  }
});

// Vulnerabilities endpoint
app.get('/api/vulnerabilities', async (req, res) => {
  try {
    const vulnerabilitiesQuery = `
      query {
        vulnerabilities(first: 100, orderBy: created_at, orderMode: desc) {
          edges {
            node {
              id
              name
              description
              severity
              created_at
              external_references {
                edges {
                  node {
                    external_id
                    source_name
                  }
                }
              }
            }
          }
        }
      }
    `;

    const data = await queryOpenCTI(vulnerabilitiesQuery);
    const vulnerabilities = data?.data?.vulnerabilities?.edges || [];

    const processedVulnerabilities = vulnerabilities.map(vuln => ({
      id: vuln.node.external_references?.edges?.[0]?.node?.external_id || vuln.node.id,
      severity: vuln.node.severity || 'Medium',
      score: Math.random() * 10, // Placeholder - get actual CVSS score if available
      title: vuln.node.name,
      affectedSystems: Math.floor(Math.random() * 50) + 1,
      patchAvailable: Math.random() > 0.3
    }));

    res.json(processedVulnerabilities);
  } catch (error) {
    console.error('Error fetching vulnerabilities:', error);
    res.status(500).json({ error: 'Failed to fetch vulnerabilities data' });
  }
});

// Intelligence reports endpoint
app.get('/api/reports', async (req, res) => {
  try {
    const reportsQuery = `
      query {
        reports(first: 50, orderBy: created_at, orderMode: desc) {
          edges {
            node {
              id
              name
              description
              published
              created_at
              createdBy {
                name
              }
              report_types
            }
          }
        }
      }
    `;

    const data = await queryOpenCTI(reportsQuery);
    const reports = data?.data?.reports?.edges || [];

    const processedReports = reports.map(report => ({
      id: report.node.id,
      title: report.node.name,
      date: report.node.published || report.node.created_at,
      author: report.node.createdBy?.name || 'Unknown',
      type: report.node.report_types?.[0] || 'General'
    }));

    res.json(processedReports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports data' });
  }
});

// Network analysis endpoint
app.get('/api/network', async (req, res) => {
  try {
    const networkQuery = `
      query {
        observables(types: ["IPv4-Addr", "Domain-Name", "URL"], first: 100) {
          edges {
            node {
              id
              value
              entity_type
              created_at
              labels {
                edges {
                  node {
                    value
                  }
                }
              }
            }
          }
        }
      }
    `;

    const data = await queryOpenCTI(networkQuery);
    const observables = data?.data?.observables?.edges || [];

    const networkActivity = observables.map(obs => ({
      timestamp: obs.node.created_at,
      type: obs.node.labels?.edges?.[0]?.node?.value || 'Network Activity',
      source: obs.node.value,
      destination: 'Various',
      blocked: Math.random() > 0.7
    }));

    res.json(networkActivity);
  } catch (error) {
    console.error('Error fetching network data:', error);
    res.status(500).json({ error: 'Failed to fetch network data' });
  }
});

// Create new incident endpoint
app.post('/api/incidents', async (req, res) => {
  try {
    const { title, severity, description } = req.body;

    const createIncidentMutation = `
      mutation CreateIncident($input: IncidentAddInput!) {
        incidentAdd(input: $input) {
          id
          name
          severity
          description
        }
      }
    `;

    const variables = {
      input: {
        name: title,
        severity: severity.toLowerCase(),
        description: description || '',
        confidence: 50
      }
    };

    const data = await queryOpenCTI(createIncidentMutation, variables);

    if (data?.data?.incidentAdd) {
      res.json({
        success: true,
        incident: data.data.incidentAdd
      });
    } else {
      res.status(400).json({ error: 'Failed to create incident' });
    }
  } catch (error) {
    console.error('Error creating incident:', error);
    res.status(500).json({ error: 'Failed to create incident' });
  }
});

// Update incident endpoint
app.put('/api/incidents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, severity, assignee } = req.body;

    const updateIncidentMutation = `
      mutation UpdateIncident($id: ID!, $input: IncidentEditInput!) {
        incidentEdit(id: $id, input: $input) {
          id
          name
          severity
        }
      }
    `;

    const variables = {
      id: id,
      input: {
        severity: severity?.toLowerCase(),
        // Note: OpenCTI may not have direct assignee field - this is a placeholder
      }
    };

    const data = await queryOpenCTI(updateIncidentMutation, variables);

    if (data?.data?.incidentEdit) {
      res.json({
        success: true,
        incident: data.data.incidentEdit
      });
    } else {
      res.status(400).json({ error: 'Failed to update incident' });
    }
  } catch (error) {
    console.error('Error updating incident:', error);
    res.status(500).json({ error: 'Failed to update incident' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    opencti_url: OPENCTI_API_URL
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Falcon Threat Intelligence Backend Server running on port ${PORT}`);
  console.log(`OpenCTI API URL: ${OPENCTI_API_URL}`);
  console.log(`API Key configured: ${OPENCTI_API_KEY ? 'Yes' : 'No'}`);
});

module.exports = app;
