const axios = require('axios');

class OpenCTIClient {
  constructor(apiUrl, apiKey) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      timeout: 30000, // 30 seconds timeout
    });
  }

  async query(query, variables = {}) {
    try {
      const response = await this.client.post('', {
        query,
        variables,
      });

      if (response.data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(response.data.errors)}`);
      }

      return response.data;
    } catch (error) {
      console.error('OpenCTI Query Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  }

  // Get all indicators with filtering
  async getIndicators(limit = 100, filters = {}) {
    const query = `
      query GetIndicators($first: Int, $filters: [IndicatorsFiltering!]) {
        indicators(first: $first, filters: $filters, orderBy: created_at, orderMode: desc) {
          edges {
            node {
              id
              pattern
              indicator_types
              confidence
              created_at
              updated_at
              valid_from
              valid_until
              labels {
                edges {
                  node {
                    value
                    color
                  }
                }
              }
              killChainPhases {
                edges {
                  node {
                    phase_name
                    kill_chain_name
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

    const variables = {
      first: limit,
      filters: Object.keys(filters).map(key => ({
        key,
        values: Array.isArray(filters[key]) ? filters[key] : [filters[key]]
      }))
    };

    return await this.query(query, variables);
  }

  // Get all incidents
  async getIncidents(limit = 50) {
    const query = `
      query GetIncidents($first: Int) {
        incidents(first: $first, orderBy: created_at, orderMode: desc) {
          edges {
            node {
              id
              name
              description
              severity
              confidence
              created_at
              updated_at
              incident_type
              first_seen
              last_seen
              createdBy {
                name
                entity_type
              }
              labels {
                edges {
                  node {
                    value
                    color
                  }
                }
              }
              status {
                template {
                  name
                }
              }
            }
          }
        }
      }
    `;

    return await this.query(query, { first: limit });
  }

  // Get vulnerabilities
  async getVulnerabilities(limit = 100) {
    const query = `
      query GetVulnerabilities($first: Int) {
        vulnerabilities(first: $first, orderBy: created_at, orderMode: desc) {
          edges {
            node {
              id
              name
              description
              severity
              created_at
              updated_at
              external_references {
                edges {
                  node {
                    external_id
                    source_name
                    url
                    description
                  }
                }
              }
              labels {
                edges {
                  node {
                    value
                    color
                  }
                }
              }
            }
          }
        }
      }
    `;

    return await this.query(query, { first: limit });
  }

  // Get intelligence reports
  async getReports(limit = 50) {
    const query = `
      query GetReports($first: Int) {
        reports(first: $first, orderBy: published, orderMode: desc) {
          edges {
            node {
              id
              name
              description
              content
              published
              created_at
              updated_at
              report_types
              confidence
              createdBy {
                name
                entity_type
              }
              labels {
                edges {
                  node {
                    value
                    color
                  }
                }
              }
              external_references {
                edges {
                  node {
                    source_name
                    url
                    external_id
                  }
                }
              }
            }
          }
        }
      }
    `;

    return await this.query(query, { first: limit });
  }

  // Get observables (network artifacts)
  async getObservables(types = [], limit = 100) {
    const query = `
      query GetObservables($first: Int, $types: [String!]) {
        observables(first: $first, types: $types, orderBy: created_at, orderMode: desc) {
          edges {
            node {
              id
              value
              entity_type
              created_at
              updated_at
              labels {
                edges {
                  node {
                    value
                    color
                  }
                }
              }
              indicators {
                edges {
                  node {
                    id
                    pattern
                    confidence
                  }
                }
              }
            }
          }
        }
      }
    `;

    const variables = { first: limit };
    if (types.length > 0) {
      variables.types = types;
    }

    return await this.query(query, variables);
  }

  // Create a new incident
  async createIncident(incidentData) {
    const mutation = `
      mutation CreateIncident($input: IncidentAddInput!) {
        incidentAdd(input: $input) {
          id
          name
          severity
          description
          confidence
          created_at
        }
      }
    `;

    const input = {
      name: incidentData.name || incidentData.title,
      description: incidentData.description || '',
      severity: incidentData.severity?.toLowerCase() || 'medium',
      confidence: incidentData.confidence || 50,
      incident_type: incidentData.type || 'security-incident',
      ...incidentData
    };

    return await this.query(mutation, { input });
  }

  // Update an existing incident
  async updateIncident(id, updateData) {
    const mutation = `
      mutation UpdateIncident($id: ID!, $input: [Edit!]!) {
        incidentFieldPatch(id: $id, input: $input) {
          id
          name
          severity
          description
          confidence
        }
      }
    `;

    const input = Object.keys(updateData).map(key => ({
      key,
      value: Array.isArray(updateData[key]) ? updateData[key] : [String(updateData[key])]
    }));

    return await this.query(mutation, { id, input });
  }

  // Get threat actors
  async getThreatActors(limit = 50) {
    const query = `
      query GetThreatActors($first: Int) {
        threatActors(first: $first, orderBy: created_at, orderMode: desc) {
          edges {
            node {
              id
              name
              description
              aliases
              sophistication
              resource_level
              primary_motivation
              created_at
              updated_at
              labels {
                edges {
                  node {
                    value
                    color
                  }
                }
              }
            }
          }
        }
      }
    `;

    return await this.query(query, { first: limit });
  }

  // Get malware families
  async getMalware(limit = 50) {
    const query = `
      query GetMalware($first: Int) {
        malwares(first: $first, orderBy: created_at, orderMode: desc) {
          edges {
            node {
              id
              name
              description
              aliases
              malware_types
              is_family
              created_at
              updated_at
              labels {
                edges {
                  node {
                    value
                    color
                  }
                }
              }
              killChainPhases {
                edges {
                  node {
                    phase_name
                    kill_chain_name
                  }
                }
              }
            }
          }
        }
      }
    `;

    return await this.query(query, { first: limit });
  }

  // Test connection to OpenCTI
  async testConnection() {
    const query = `
      query TestConnection {
        about {
          version
        }
      }
    `;

    try {
      const result = await this.query(query);
      return {
        success: true,
        version: result?.data?.about?.version || 'Unknown'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = OpenCTIClient;
