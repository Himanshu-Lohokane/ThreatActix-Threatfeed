const { useState, useEffect, useRef } = React;

// Sample data
const dashboardData = {
  "dashboardMetrics": {
    "criticalAlerts": 23,
    "activeThreats": 156,
    "resolvedIncidents": 89,
    "riskScore": 7.3
  },
  "threatTrends": [
    { "date": "2025-09-07", "threats": 45, "incidents": 12 },
    { "date": "2025-09-08", "threats": 52, "incidents": 18 },
    { "date": "2025-09-09", "threats": 38, "incidents": 9 },
    { "date": "2025-09-10", "threats": 67, "incidents": 21 },
    { "date": "2025-09-11", "threats": 43, "incidents": 14 },
    { "date": "2025-09-12", "threats": 59, "incidents": 16 },
    { "date": "2025-09-13", "threats": 73, "incidents": 25 }
  ],
  "geographicThreats": [
    { "country": "China", "threats": 234, "lat": 35.8617, "lng": 104.1954 },
    { "country": "Russia", "threats": 189, "lat": 61.5240, "lng": 105.3188 },
    { "country": "United States", "threats": 156, "lat": 37.0902, "lng": -95.7129 },
    { "country": "North Korea", "threats": 98, "lat": 40.3399, "lng": 127.5101 },
    { "country": "Iran", "threats": 87, "lat": 32.4279, "lng": 53.6880 }
  ],
  "recentIncidents": [
    { "id": 1, "title": "Phishing Campaign Detected", "severity": "High", "status": "Active", "timestamp": "2025-09-13 18:45", "assignee": "Sarah Chen" },
    { "id": 2, "title": "Malware Distribution via Email", "severity": "Critical", "status": "Investigating", "timestamp": "2025-09-13 17:32", "assignee": "Mike Rodriguez" },
    { "id": 3, "title": "Suspicious Network Activity", "severity": "Medium", "status": "Resolved", "timestamp": "2025-09-13 16:18", "assignee": "Jessica Wu" },
    { "id": 4, "title": "Credential Stuffing Attack", "severity": "High", "status": "Active", "timestamp": "2025-09-13 15:03", "assignee": "David Kim" }
  ],
  "threatCategories": [
    { "category": "Malware", "count": 145, "percentage": 32 },
    { "category": "Phishing", "count": 98, "percentage": 22 },
    { "category": "Botnet", "count": 76, "percentage": 17 },
    { "category": "Ransomware", "count": 65, "percentage": 14 },
    { "category": "APT", "count": 67, "percentage": 15 }
  ],
  "indicators": [
    { "id": 1, "type": "IP", "value": "192.168.1.100", "threat": "Botnet C&C", "confidence": 95, "firstSeen": "2025-09-10", "lastSeen": "2025-09-13" },
    { "id": 2, "type": "Domain", "value": "malicious-site.com", "threat": "Phishing", "confidence": 88, "firstSeen": "2025-09-12", "lastSeen": "2025-09-13" },
    { "id": 3, "type": "Hash", "value": "d41d8cd98f00b204e9800998ecf8427e", "threat": "Trojan", "confidence": 92, "firstSeen": "2025-09-11", "lastSeen": "2025-09-13" },
    { "id": 4, "type": "URL", "value": "http://evil-download.net/payload", "threat": "Malware Dropper", "confidence": 97, "firstSeen": "2025-09-09", "lastSeen": "2025-09-13" }
  ],
  "vulnerabilities": [
    { "id": "CVE-2023-12345", "severity": "Critical", "score": 9.8, "title": "Remote Code Execution in Web Framework", "affectedSystems": 23, "patchAvailable": true },
    { "id": "CVE-2023-12346", "severity": "High", "score": 8.1, "title": "SQL Injection in Database Driver", "affectedSystems": 45, "patchAvailable": true },
    { "id": "CVE-2023-12347", "severity": "Medium", "score": 6.5, "title": "Cross-Site Scripting in Admin Panel", "affectedSystems": 12, "patchAvailable": false },
    { "id": "CVE-2023-12348", "severity": "Low", "score": 3.2, "title": "Information Disclosure in API", "affectedSystems": 8, "patchAvailable": true }
  ],
  "networkActivity": [
    { "timestamp": "2025-09-13 19:00", "type": "Suspicious Connection", "source": "192.168.1.100", "destination": "malicious-c2.com", "blocked": true },
    { "timestamp": "2025-09-13 18:45", "type": "Malware Download", "source": "10.0.0.50", "destination": "evil-site.net", "blocked": true },
    { "timestamp": "2025-09-13 18:30", "type": "Data Exfiltration", "source": "172.16.0.25", "destination": "unknown-server.com", "blocked": false },
    { "timestamp": "2025-09-13 18:15", "type": "Brute Force Attack", "source": "203.0.113.1", "destination": "internal-server", "blocked": true }
  ],
  "reports": [
    { "id": 1, "title": "Q3 2025 Threat Landscape Report", "date": "2025-09-01", "author": "Threat Intel Team", "type": "Quarterly" },
    { "id": 2, "title": "APT28 Campaign Analysis", "date": "2025-08-15", "author": "Sarah Chen", "type": "Campaign" },
    { "id": 3, "title": "Ransomware Trends August 2025", "date": "2025-08-01", "author": "Mike Rodriguez", "type": "Monthly" },
    { "id": 4, "title": "Phishing Infrastructure Report", "date": "2025-07-20", "author": "Jessica Wu", "type": "Infrastructure" }
  ]
};

// Sidebar Component
const Sidebar = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { id: 'threats', icon: 'fas fa-shield-alt', label: 'Threats & IOCs' },
    { id: 'incidents', icon: 'fas fa-exclamation-triangle', label: 'Incidents' },
    { id: 'vulnerabilities', icon: 'fas fa-bug', label: 'Vulnerabilities' },
    { id: 'reports', icon: 'fas fa-file-alt', label: 'Intelligence Reports' },
    { id: 'network', icon: 'fas fa-network-wired', label: 'Network Analysis' },
    { id: 'settings', icon: 'fas fa-cog', label: 'Settings' }
  ];

  const handleNavClick = (itemId) => {
    setActiveView(itemId);
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <i className="fas fa-shield-alt"></i>
        <span className="logo-text">ThreatIntel</span>
      </div>
      <ul className="nav-menu">
        {menuItems.map(item => (
          <li key={item.id} className="nav-item">
            <button
              type="button"
              className={`nav-link ${activeView === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left'
              }}
            >
              <i className={item.icon}></i>
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Header Component
const Header = ({ title, onLogout }) => {
  return (
    <div className="header">
      <h1 className="header-title">{title}</h1>
      <div className="header-actions">
        <div className="search-box">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search threats, indicators, incidents..."
            className="search-input"
          />
        </div>
        <button className="btn btn--outline">
          <i className="fas fa-bell"></i>
        </button>
        <button className="btn btn--outline" onClick={onLogout}>
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, icon, type }) => {
  return (
    <div className={`metric-card ${type}`}>
      <div className="metric-info">
        <h3>{title}</h3>
        <p className="metric-value">{value}</p>
      </div>
      <i className={`${icon} metric-icon`}></i>
    </div>
  );
};

// Epic Chart Components with Gradients
const ThreatTrendChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    // Create epic gradients
    const threatGradient = ctx.createLinearGradient(0, 0, 0, 300);
    threatGradient.addColorStop(0, 'rgba(20, 184, 166, 0.8)');
    threatGradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.4)');
    threatGradient.addColorStop(1, 'rgba(20, 184, 166, 0.1)');
    
    const incidentGradient = ctx.createLinearGradient(0, 0, 0, 300);
    incidentGradient.addColorStop(0, 'rgba(236, 72, 153, 0.8)');
    incidentGradient.addColorStop(0.5, 'rgba(147, 51, 234, 0.4)');
    incidentGradient.addColorStop(1, 'rgba(236, 72, 153, 0.1)');
    
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dashboardData.threatTrends.map(item => item.date.slice(5)),
        datasets: [
          {
            label: 'Threats',
            data: dashboardData.threatTrends.map(item => item.threats),
            borderColor: '#14b8a6',
            backgroundColor: threatGradient,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#14b8a6',
            pointBorderColor: '#0f172a',
            pointRadius: 5,
            pointHoverRadius: 8,
            pointBorderWidth: 2,
            pointHoverBorderWidth: 3
          },
          {
            label: 'Incidents',
            data: dashboardData.threatTrends.map(item => item.incidents),
            borderColor: '#ec4899',
            backgroundColor: incidentGradient,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#ec4899',
            pointBorderColor: '#0f172a',
            pointRadius: 5,
            pointHoverRadius: 8,
            pointBorderWidth: 2,
            pointHoverBorderWidth: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            labels: {
              color: '#f8fafc',
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12,
                weight: '500'
              }
            }
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#14b8a6',
            bodyColor: '#f8fafc',
            borderColor: '#14b8a6',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              title: (tooltipItems) => {
                return `Date: ${tooltipItems[0].label}`;
              },
              label: (context) => {
                return `${context.dataset.label}: ${context.parsed.y} ${context.dataset.label === 'Threats' ? '🛡️' : '⚠️'}`;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: { 
              color: '#94a3b8',
              font: { weight: '500' }
            },
            grid: { 
              color: 'rgba(59, 130, 246, 0.2)',
              drawBorder: false
            }
          },
          y: {
            ticks: { 
              color: '#94a3b8',
              font: { weight: '500' }
            },
            grid: { 
              color: 'rgba(59, 130, 246, 0.2)',
              drawBorder: false
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="chart-container">
      <h3 className="chart-title">Threat Trends (Last 7 Days)</h3>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

const ThreatCategoriesChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    
    // Epic cyber colors with glow effect
    const epicColors = [
      '#14b8a6', // Cyber teal
      '#ec4899', // Cyber pink  
      '#3b82f6', // Electric blue
      '#8b5cf6', // Cyber purple
      '#22c55e'  // Cyber green
    ];
    
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: dashboardData.threatCategories.map(item => item.category),
        datasets: [{
          data: dashboardData.threatCategories.map(item => item.count),
          backgroundColor: epicColors,
          borderColor: epicColors.map(color => color + '80'),
          borderWidth: 2,
          hoverBackgroundColor: epicColors.map(color => color + 'CC'),
          hoverBorderColor: epicColors,
          hoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#f8fafc',
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle',
              font: {
                size: 12,
                weight: '500'
              }
            }
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#14b8a6',
            bodyColor: '#f8fafc',
            borderColor: '#14b8a6',
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
              label: (context) => {
                const percentage = Math.round((context.parsed / context.dataset.data.reduce((a, b) => a + b, 0)) * 100);
                return `${context.label}: ${context.parsed} (${percentage}%) 🎯`;
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          duration: 2000
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="chart-container">
      <h3 className="chart-title">Threat Categories</h3>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview = () => {
  return (
    <div>
      <div className="metrics-grid">
        <MetricCard
          title="Critical Alerts"
          value={dashboardData.dashboardMetrics.criticalAlerts}
          icon="fas fa-exclamation-circle"
          type="critical"
        />
        <MetricCard
          title="Active Threats"
          value={dashboardData.dashboardMetrics.activeThreats}
          icon="fas fa-shield-alt"
          type="active"
        />
        <MetricCard
          title="Resolved Incidents"
          value={dashboardData.dashboardMetrics.resolvedIncidents}
          icon="fas fa-check-circle"
          type="resolved"
        />
        <MetricCard
          title="Risk Score"
          value={dashboardData.dashboardMetrics.riskScore}
          icon="fas fa-chart-line"
          type="risk"
        />
      </div>

      <div className="dashboard-grid">
        <ThreatTrendChart />
        <ThreatCategoriesChart />
      </div>

      <div className="bottom-grid">
        <div className="incidents-table">
          <h3 className="chart-title">Recent Incidents</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Incident</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Assignee</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentIncidents.map(incident => (
                  <tr key={incident.id}>
                    <td>{incident.title}</td>
                    <td>
                      <span className={`severity-badge severity-${incident.severity.toLowerCase()}`}>
                        {incident.severity}
                      </span>
                    </td>
                    <td>{incident.status}</td>
                    <td>{incident.assignee}</td>
                    <td>{incident.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="threat-map">
          <h3 className="chart-title">Geographic Threats</h3>
          <div>
            {dashboardData.geographicThreats.map((threat, index) => (
              <div key={index} className="geo-threat-item">
                <span className="country-name">{threat.country}</span>
                <span className="threat-count">{threat.threats}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Threats & IOCs Component
const ThreatsPage = () => {
  const [typeFilter, setTypeFilter] = useState('all');
  const [confidenceFilter, setConfidenceFilter] = useState('all');

  const filteredIndicators = dashboardData.indicators.filter(indicator => {
    if (typeFilter !== 'all' && indicator.type.toLowerCase() !== typeFilter) return false;
    if (confidenceFilter !== 'all') {
      if (confidenceFilter === 'high' && indicator.confidence < 90) return false;
      if (confidenceFilter === 'medium' && (indicator.confidence < 70 || indicator.confidence >= 90)) return false;
      if (confidenceFilter === 'low' && indicator.confidence >= 70) return false;
    }
    return true;
  });

  const handleTypeFilterChange = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setTypeFilter(event.target.value);
  };

  const handleConfidenceFilterChange = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setConfidenceFilter(event.target.value);
  };

  return (
    <div className="page-content">
      <h2>Threats & Indicators of Compromise</h2>

      <div className="filter-bar">
        <div className="filter-group">
          <label className="filter-label">Type</label>
          <select
            className="filter-select"
            value={typeFilter}
            onChange={handleTypeFilterChange}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="all">All Types</option>
            <option value="ip">IP Address</option>
            <option value="domain">Domain</option>
            <option value="hash">Hash</option>
            <option value="url">URL</option>
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">Confidence</label>
          <select
            className="filter-select"
            value={confidenceFilter}
            onChange={handleConfidenceFilterChange}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="all">All Confidence</option>
            <option value="high">High (90%+)</option>
            <option value="medium">Medium (70-89%)</option>
            <option value="low">Low (&lt;70%)</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Value</th>
              <th>Threat</th>
              <th>Confidence</th>
              <th>First Seen</th>
              <th>Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {filteredIndicators.map(indicator => (
              <tr key={indicator.id}>
                <td>
                  <span className={`type-badge type-${indicator.type.toLowerCase()}`}>
                    {indicator.type}
                  </span>
                </td>
                <td style={{ fontFamily: 'var(--font-family-mono)', fontSize: 'var(--font-size-sm)' }}>{indicator.value}</td>
                <td>{indicator.threat}</td>
                <td>
                  <div className="confidence-bar">
                    <div className="confidence-fill" style={{ width: `${indicator.confidence}%` }}></div>
                  </div>
                  <span style={{ marginLeft: '8px', fontSize: 'var(--font-size-sm)' }}>{indicator.confidence}%</span>
                </td>
                <td>{indicator.firstSeen}</td>
                <td>{indicator.lastSeen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Incidents Component
const IncidentsPage = () => {
  return (
    <div className="page-content">
      <h2>Security Incidents</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Assignee</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.recentIncidents.map(incident => (
              <tr key={incident.id}>
                <td>#{incident.id}</td>
                <td>{incident.title}</td>
                <td>
                  <span className={`severity-badge severity-${incident.severity.toLowerCase()}`}>
                    {incident.severity}
                  </span>
                </td>
                <td>{incident.status}</td>
                <td>{incident.assignee}</td>
                <td>{incident.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Vulnerabilities Component
const VulnerabilitiesPage = () => {
  const getScoreClass = (score) => {
    if (score >= 9.0) return 'score-critical';
    if (score >= 7.0) return 'score-high';
    if (score >= 4.0) return 'score-medium';
    return 'score-low';
  };

  return (
    <div className="page-content">
      <h2>Vulnerabilities</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>CVE ID</th>
              <th>Title</th>
              <th>Severity</th>
              <th>CVSS Score</th>
              <th>Affected Systems</th>
              <th>Patch Status</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.vulnerabilities.map(vuln => (
              <tr key={vuln.id}>
                <td style={{ fontFamily: 'var(--font-family-mono)' }}>{vuln.id}</td>
                <td>{vuln.title}</td>
                <td>
                  <span className={`severity-badge severity-${vuln.severity.toLowerCase()}`}>
                    {vuln.severity}
                  </span>
                </td>
                <td>
                  <span className={`cve-score ${getScoreClass(vuln.score)}`}>
                    {vuln.score}
                  </span>
                </td>
                <td>{vuln.affectedSystems}</td>
                <td>
                  <div className="patch-status">
                    <i className={`fas ${vuln.patchAvailable ? 'fa-check-circle patch-available' : 'fa-times-circle patch-unavailable'}`}></i>
                    <span>{vuln.patchAvailable ? 'Available' : 'Unavailable'}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Reports Component
const ReportsPage = () => {
  return (
    <div className="page-content">
      <h2>Intelligence Reports</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Author</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.reports.map(report => (
              <tr key={report.id}>
                <td>{report.title}</td>
                <td>
                  <span className="report-type">{report.type}</span>
                </td>
                <td>{report.author}</td>
                <td>{report.date}</td>
                <td>
                  <button className="btn btn--sm btn--outline">
                    <i className="fas fa-download"></i> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Network Analysis Component
const NetworkPage = () => {
  return (
    <div className="page-content">
      <h2>Network Analysis</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Activity Type</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.networkActivity.map((activity, index) => (
              <tr key={index}>
                <td>{activity.timestamp}</td>
                <td>{activity.type}</td>
                <td className="network-activity">{activity.source}</td>
                <td className="network-activity">{activity.destination}</td>
                <td>
                  <span className={activity.blocked ? 'activity-blocked' : 'activity-allowed'}>
                    <i className={`fas ${activity.blocked ? 'fa-shield-alt' : 'fa-exclamation-triangle'}`}></i>
                    {activity.blocked ? 'Blocked' : 'Allowed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Settings Component
const SettingsPage = () => {
  return (
    <div className="page-content">
      <h2>Settings</h2>
      <div className="form-group">
        <label className="form-label">OpenCTI API URL</label>
        <input
          type="text"
          className="form-control"
          defaultValue="http://localhost:4000/graphql"
          placeholder="Enter OpenCTI API URL"
        />
      </div>
      <div className="form-group">
        <label className="form-label">API Key</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter your OpenCTI API key"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Refresh Interval (seconds)</label>
        <select className="form-control">
          <option value="30">30 seconds</option>
          <option value="60">1 minute</option>
          <option value="300">5 minutes</option>
          <option value="600">10 minutes</option>
        </select>
      </div>
      <button className="btn btn--primary">Save Settings</button>
    </div>
  );
};

// Epic Login Page Component
const LoginPage = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '', rememberMe: false });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple demo authentication - only store login status, never credentials
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('loginTimestamp', Date.now().toString());
      setIsLoading(false);
      onLogin(true);
    }, 1500);
  };

  const handleInputChange = (field) => (e) => {
    setCredentials(prev => ({
      ...prev,
      [field]: field === 'rememberMe' ? e.target.checked : e.target.value
    }));
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-particles"></div>
        <div className="login-grid"></div>
      </div>
      <div className="login-card">
        <div className="login-header">
          <i className="fas fa-shield-alt login-icon"></i>
          <h1 className="login-title">Falcon Intelligence</h1>
          <p className="login-subtitle">Secure Threat Intelligence Portal</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control login-input"
              value={credentials.username}
              onChange={handleInputChange('username')}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control login-input"
              value={credentials.password}
              onChange={handleInputChange('password')}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="login-options">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={credentials.rememberMe}
                onChange={handleInputChange('rememberMe')}
              />
              <span className="checkmark"></span>
              Remember me
            </label>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>
          <button 
            type="submit" 
            className={`btn btn--primary login-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner login-spinner"></i>
                Authenticating...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Login
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for existing login on mount with expiry (24 hour demo session)
  React.useEffect(() => {
    const checkSessionValidity = () => {
      const isAuth = localStorage.getItem('isAuthenticated');
      const loginTime = localStorage.getItem('loginTimestamp');
      
      if (isAuth && loginTime) {
        const twentyFourHours = 24 * 60 * 60 * 1000;
        const isExpired = Date.now() - parseInt(loginTime) > twentyFourHours;
        
        if (!isExpired) {
          setIsLoggedIn(true);
        } else {
          // Auto-logout expired session
          handleLogout();
        }
      }
    };

    // Check on mount
    checkSessionValidity();

    // Also check when tab becomes visible (catches expiry when user returns)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkSessionValidity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup listener
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleLogin = (authStatus) => {
    setIsLoggedIn(authStatus);
  };

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('loginTimestamp');
    setIsLoggedIn(false);
    setActiveView('dashboard');
  };

  if (!isLoggedIn) {
    return React.createElement(LoginPage, { onLogin: handleLogin });
  }

  const getPageTitle = (view) => {
    const titles = {
      dashboard: 'Dashboard Overview',
      threats: 'Threats & IOCs',
      incidents: 'Incident Management',
      vulnerabilities: 'Vulnerability Assessment',
      reports: 'Intelligence Reports',
      network: 'Network Analysis',
      settings: 'Settings'
    };
    return titles[view] || 'Dashboard';
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardOverview />;
      case 'threats': return <ThreatsPage />;
      case 'incidents': return <IncidentsPage />;
      case 'vulnerabilities': return <VulnerabilitiesPage />;
      case 'reports': return <ReportsPage />;
      case 'network': return <NetworkPage />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardOverview />;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="main-content">
        <Header title={getPageTitle(activeView)} onLogout={handleLogout} />
        {renderContent()}
      </div>
    </div>
  );
};

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));